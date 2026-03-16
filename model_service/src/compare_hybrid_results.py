from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.metrics import average_precision_score
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import roc_auc_score

from fraud_pipeline import default_training_paths
from fraud_pipeline import hybrid_risk_score
from train_model import build_training_features
from train_model import load_ieee_dataset
from train_model import select_feature_matrix
from train_model import split_time_aware


ROOT_DIR = Path(__file__).resolve().parents[1]
ARTIFACT_PATHS = default_training_paths(ROOT_DIR)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare ML-only fraud decisions vs hybrid ML + policy decisions on held-out IEEE data."
    )
    parser.add_argument("--sample-frac", type=float, default=1.0, help="Fraction of dataset rows to load.")
    parser.add_argument("--validation-days", type=int, default=14, help="Use final N days as validation split.")
    parser.add_argument("--random-state", type=int, default=42, help="Sampling random seed.")
    return parser.parse_args()


def print_metrics(title: str, y_true: np.ndarray, probabilities: np.ndarray, threshold: float) -> None:
    predictions = (probabilities >= threshold).astype(np.int8)
    print()
    print("=" * 70)
    print(f"  {title}")
    print("=" * 70)
    print(classification_report(y_true, predictions, digits=4))
    print(f"ROC-AUC Score: {roc_auc_score(y_true, probabilities):.4f}")
    print(f"PR-AUC Score: {average_precision_score(y_true, probabilities):.4f}")
    print(f"Precision: {precision_score(y_true, predictions, zero_division=0):.4f}")
    print(f"Recall: {recall_score(y_true, predictions, zero_division=0):.4f}")
    tn, fp, fn, tp = confusion_matrix(y_true, predictions).ravel()
    print(f"Confusion Matrix: TN={tn} FP={fp} FN={fn} TP={tp}")


def main() -> None:
    args = parse_args()

    model = joblib.load(ARTIFACT_PATHS["model"])
    feature_names = list(joblib.load(ARTIFACT_PATHS["features"]))
    config = json.loads(ARTIFACT_PATHS["config"].read_text(encoding="ascii"))
    flag_threshold = max(float(config["decision_thresholds"]["flag_min"]), 0.25)

    raw_df = load_ieee_dataset(ROOT_DIR / "IEEE Dataset", args.sample_frac, args.random_state)
    feature_frame = build_training_features(raw_df)
    _, test_frame = split_time_aware(feature_frame, args.validation_days)
    test_X, test_y = select_feature_matrix(test_frame)

    model_probabilities = model.predict_proba(test_X[feature_names])[:, 1]
    hybrid_probabilities = np.array(
        [
            hybrid_risk_score(float(prob), row)["hybrid_risk_score"]
            for prob, row in zip(model_probabilities, test_X.to_dict(orient="records"))
        ]
    )

    print(f"Validation rows: {len(test_y):,}")
    print(f"Flag threshold: {flag_threshold:.2f}")
    print_metrics("ML ONLY", test_y.to_numpy(), model_probabilities, flag_threshold)
    print_metrics("HYBRID POLICY", test_y.to_numpy(), hybrid_probabilities, flag_threshold)


if __name__ == "__main__":
    main()
