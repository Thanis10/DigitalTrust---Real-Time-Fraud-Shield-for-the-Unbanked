from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.metrics import average_precision_score
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import roc_auc_score

from fraud_pipeline import MODEL_FEATURE_COLUMNS
from fraud_pipeline import MODEL_VERSION
from fraud_pipeline import build_training_features
from fraud_pipeline import choose_thresholds
from fraud_pipeline import default_training_paths
from fraud_pipeline import select_feature_matrix
from fraud_pipeline import threshold_table


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATA_DIR = ROOT_DIR / "IEEE Dataset"
ARTIFACT_PATHS = default_training_paths(ROOT_DIR)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train and evaluate a deployable LightGBM fraud model on IEEE-CIS."
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=DEFAULT_DATA_DIR,
        help="Directory containing train_transaction.csv and train_identity.csv.",
    )
    parser.add_argument(
        "--sample-frac",
        type=float,
        default=0.2,
        help="Fraction of rows to sample for faster iteration. Use 1.0 for the full training set.",
    )
    parser.add_argument(
        "--random-state",
        type=int,
        default=42,
        help="Random seed used for sampling and model training.",
    )
    parser.add_argument(
        "--validation-days",
        type=int,
        default=14,
        help="Hold out the final N transaction days as a time-aware validation split.",
    )
    parser.add_argument(
        "--n-estimators",
        type=int,
        default=600,
        help="Number of LightGBM trees.",
    )
    parser.add_argument(
        "--save-artifacts",
        action="store_true",
        help="Persist the trained model, feature list, and serving config under model/models/.",
    )
    return parser.parse_args()


def validate_dataset_dir(data_dir: Path) -> tuple[Path, Path]:
    tx_path = data_dir / "train_transaction.csv"
    identity_path = data_dir / "train_identity.csv"

    missing = [str(path) for path in (tx_path, identity_path) if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing IEEE-CIS training files:\n" + "\n".join(missing))

    return tx_path, identity_path


def load_ieee_dataset(data_dir: Path, sample_frac: float, random_state: int) -> pd.DataFrame:
    tx_path, identity_path = validate_dataset_dir(data_dir)

    print(f"Loading transaction data from: {tx_path}")
    transactions = pd.read_csv(tx_path)
    print(f"Loading identity data from: {identity_path}")
    identity = pd.read_csv(identity_path)

    print("Merging train_transaction and train_identity on TransactionID...")
    df = transactions.merge(identity, on="TransactionID", how="left")

    if 0 < sample_frac < 1.0:
        print(f"Sampling {sample_frac:.0%} of rows with class preservation...")
        legit = df[df["isFraud"] == 0].sample(frac=sample_frac, random_state=random_state)
        fraud = df[df["isFraud"] == 1].sample(frac=sample_frac, random_state=random_state)
        df = pd.concat([legit, fraud], ignore_index=True)
        df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)

    return df


def split_time_aware(feature_frame: pd.DataFrame, validation_days: int) -> tuple[pd.DataFrame, pd.DataFrame]:
    day_index = feature_frame["event_time_day"].astype(float)
    day_cutoff = day_index.max() - validation_days
    validation_mask = day_index >= day_cutoff

    if validation_mask.mean() <= 0.02 or validation_mask.mean() >= 0.5:
        split_index = int(len(feature_frame) * 0.8)
        return feature_frame.iloc[:split_index].copy(), feature_frame.iloc[split_index:].copy()

    return feature_frame.loc[~validation_mask].copy(), feature_frame.loc[validation_mask].copy()


def train_model(
    train_X: pd.DataFrame,
    train_y: pd.Series,
    params: dict[str, float | int],
) -> lgb.LGBMClassifier:
    neg_count = int((train_y == 0).sum())
    pos_count = int((train_y == 1).sum())
    scale_pos_weight = neg_count / max(pos_count, 1)

    model = lgb.LGBMClassifier(
        objective="binary",
        boosting_type="gbdt",
        n_estimators=int(params["n_estimators"]),
        learning_rate=float(params["learning_rate"]),
        num_leaves=int(params["num_leaves"]),
        max_depth=int(params["max_depth"]),
        subsample=float(params["subsample"]),
        colsample_bytree=float(params["colsample_bytree"]),
        min_child_samples=int(params["min_child_samples"]),
        reg_alpha=float(params["reg_alpha"]),
        reg_lambda=float(params["reg_lambda"]),
        random_state=int(params["random_state"]),
        n_jobs=-1,
        scale_pos_weight=scale_pos_weight,
        verbosity=-1,
    )
    model.fit(train_X, train_y)
    return model


def split_train_dev_time_aware(train_frame: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    if len(train_frame) < 5000:
        split_index = int(len(train_frame) * 0.85)
        return train_frame.iloc[:split_index].copy(), train_frame.iloc[split_index:].copy()

    day_index = train_frame["event_time_day"].astype(float)
    cutoff = day_index.quantile(0.9)
    dev_mask = day_index >= cutoff

    if dev_mask.mean() < 0.05 or dev_mask.mean() > 0.25:
        split_index = int(len(train_frame) * 0.9)
        return train_frame.iloc[:split_index].copy(), train_frame.iloc[split_index:].copy()

    return train_frame.loc[~dev_mask].copy(), train_frame.loc[dev_mask].copy()


def candidate_param_sets(n_estimators: int, random_state: int) -> list[dict[str, float | int]]:
    return [
        {
            "name": "balanced-wide",
            "n_estimators": n_estimators,
            "learning_rate": 0.03,
            "num_leaves": 96,
            "max_depth": -1,
            "subsample": 0.85,
            "colsample_bytree": 0.85,
            "min_child_samples": 50,
            "reg_alpha": 0.1,
            "reg_lambda": 1.0,
            "random_state": random_state,
        },
        {
            "name": "deeper-regularized",
            "n_estimators": int(n_estimators * 1.25),
            "learning_rate": 0.025,
            "num_leaves": 128,
            "max_depth": -1,
            "subsample": 0.9,
            "colsample_bytree": 0.9,
            "min_child_samples": 80,
            "reg_alpha": 0.3,
            "reg_lambda": 2.0,
            "random_state": random_state,
        },
        {
            "name": "compact-high-bias",
            "n_estimators": int(n_estimators * 0.9),
            "learning_rate": 0.04,
            "num_leaves": 64,
            "max_depth": 10,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "min_child_samples": 120,
            "reg_alpha": 0.2,
            "reg_lambda": 1.5,
            "random_state": random_state,
        },
    ]


def select_best_params(
    train_frame: pd.DataFrame,
    random_state: int,
    n_estimators: int,
) -> dict[str, float | int]:
    fit_frame, dev_frame = split_train_dev_time_aware(train_frame)
    fit_X, fit_y = select_feature_matrix(fit_frame)
    dev_X, dev_y = select_feature_matrix(dev_frame)

    best_params: dict[str, float | int] | None = None
    best_score = -1.0

    print("\n--- Candidate Model Search ---")
    for params in candidate_param_sets(n_estimators, random_state):
        model = train_model(fit_X, fit_y, params)
        probabilities = model.predict_proba(dev_X)[:, 1]
        pr_auc = average_precision_score(dev_y, probabilities)
        roc_auc = roc_auc_score(dev_y, probabilities)
        score = pr_auc + (roc_auc * 0.15)
        print(f"{params['name']}: PR-AUC={pr_auc:.4f} ROC-AUC={roc_auc:.4f}")
        if score > best_score:
            best_score = score
            best_params = params

    assert best_params is not None
    print(f"Selected candidate: {best_params['name']}")
    return best_params


def print_threshold_analysis(rows: list[dict[str, float]], thresholds: dict[str, float]) -> None:
    print("\n--- Threshold Sweep ---")
    print(" threshold  precision  recall  f1     fpr")
    for row in rows:
        print(
            f" {row['threshold']:>8.2f}  {row['precision']:>9.4f}  {row['recall']:>6.4f}  "
            f"{row['f1']:>5.4f}  {row['false_positive_rate']:>5.4f}"
        )

    print("\n--- Recommended Decision Thresholds ---")
    print(f"APPROVE if risk_score <  {thresholds['flag_min']:.2f}")
    print(f"FLAG    if risk_score >= {thresholds['flag_min']:.2f} and < {thresholds['block_min']:.2f}")
    print(f"BLOCK   if risk_score >= {thresholds['block_min']:.2f}")


def summarize_threshold_objectives(rows: list[dict[str, float]]) -> dict[str, dict[str, float]]:
    best_f1 = max(rows, key=lambda row: row["f1"])
    best_recall = max(rows, key=lambda row: row["recall"])

    precision_targets = {}
    for precision_floor in [0.20, 0.30, 0.40, 0.50]:
        candidates = [row for row in rows if row["precision"] >= precision_floor]
        if candidates:
            precision_targets[f"precision>={precision_floor:.2f}"] = max(
                candidates, key=lambda row: (row["recall"], row["f1"])
            )

    summary = {
        "best_f1": best_f1,
        "best_recall": best_recall,
        **precision_targets,
    }
    return summary


def evaluate_model(
    model: lgb.LGBMClassifier,
    test_X: pd.DataFrame,
    test_y: pd.Series,
) -> tuple[np.ndarray, dict[str, float], list[dict[str, float]], dict[str, dict[str, float]]]:
    probabilities = model.predict_proba(test_X)[:, 1]
    threshold_rows = threshold_table(
        y_true=test_y.to_numpy(),
        probabilities=probabilities,
        thresholds=[0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8],
    )
    thresholds = choose_thresholds(threshold_rows)
    objective_summary = summarize_threshold_objectives(threshold_rows)

    predictions = (probabilities >= thresholds["flag_min"]).astype(np.int8)
    print("\n--- Validation Metrics (FLAG threshold) ---")
    print(classification_report(test_y, predictions, digits=4))
    print(f"ROC-AUC Score: {roc_auc_score(test_y, probabilities):.4f}")
    print(f"PR-AUC Score: {average_precision_score(test_y, probabilities):.4f}")
    print(f"Precision: {precision_score(test_y, predictions, zero_division=0):.4f}")
    print(f"Recall: {recall_score(test_y, predictions, zero_division=0):.4f}")

    tn, fp, fn, tp = confusion_matrix(test_y, predictions).ravel()
    print(f"Confusion Matrix: TN={tn} FP={fp} FN={fn} TP={tp}")
    print_threshold_analysis(threshold_rows, thresholds)

    metrics = {
        "roc_auc": float(roc_auc_score(test_y, probabilities)),
        "pr_auc": float(average_precision_score(test_y, probabilities)),
        "precision_at_flag_threshold": float(precision_score(test_y, predictions, zero_division=0)),
        "recall_at_flag_threshold": float(recall_score(test_y, predictions, zero_division=0)),
        "validation_rows": int(len(test_y)),
    }
    return probabilities, metrics, threshold_rows, objective_summary


def save_artifacts(
    model: lgb.LGBMClassifier,
    metrics: dict[str, float],
    thresholds: dict[str, float],
    threshold_rows: list[dict[str, float]],
    threshold_objectives: dict[str, dict[str, float]],
    selected_params: dict[str, float | int],
) -> None:
    for path in ARTIFACT_PATHS.values():
        path.parent.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, ARTIFACT_PATHS["model"])
    joblib.dump(MODEL_FEATURE_COLUMNS, ARTIFACT_PATHS["features"])

    config = {
        "model_version": MODEL_VERSION,
        "feature_names": MODEL_FEATURE_COLUMNS,
        "decision_thresholds": thresholds,
        "metrics": metrics,
        "threshold_sweep": threshold_rows,
        "threshold_objectives": threshold_objectives,
        "selected_params": selected_params,
        "notes": {
            "latency_target": "single-row LightGBM inference under real-time wallet constraints",
            "strategy": "behavioral profiling + contextual scoring + time-aware validation",
        },
    }
    ARTIFACT_PATHS["config"].write_text(json.dumps(config, indent=2), encoding="ascii")

    print(f"Saved model to: {ARTIFACT_PATHS['model']}")
    print(f"Saved feature names to: {ARTIFACT_PATHS['features']}")
    print(f"Saved config to: {ARTIFACT_PATHS['config']}")


def main() -> None:
    args = parse_args()
    if not 0 < args.sample_frac <= 1.0:
        raise ValueError("--sample-frac must be in the range (0, 1].")
    if args.validation_days < 1:
        raise ValueError("--validation-days must be at least 1.")

    raw_df = load_ieee_dataset(args.data_dir, args.sample_frac, args.random_state)
    feature_frame = build_training_features(raw_df)
    train_frame, test_frame = split_time_aware(feature_frame, args.validation_days)
    train_X, train_y = select_feature_matrix(train_frame)
    test_X, test_y = select_feature_matrix(test_frame)

    print(f"Training rows:   {len(train_X):,}")
    print(f"Validation rows: {len(test_X):,}")
    print(f"Feature count:   {len(MODEL_FEATURE_COLUMNS):,}")
    print(f"Fraud rate:      {feature_frame['isFraud'].mean():.4%}")

    best_params = select_best_params(
        train_frame=train_frame,
        random_state=args.random_state,
        n_estimators=args.n_estimators,
    )
    model = train_model(train_X=train_X, train_y=train_y, params=best_params)
    _, metrics, threshold_rows, threshold_objectives = evaluate_model(model, test_X, test_y)
    thresholds = choose_thresholds(threshold_rows)

    if args.save_artifacts:
        save_artifacts(model, metrics, thresholds, threshold_rows, threshold_objectives, best_params)


if __name__ == "__main__":
    main()
