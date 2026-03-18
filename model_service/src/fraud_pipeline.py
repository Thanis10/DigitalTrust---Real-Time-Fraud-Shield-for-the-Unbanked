from __future__ import annotations

from collections import defaultdict
from collections import deque
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


MODEL_VERSION = "ieee-hybrid-v4"

# V columns: Vesta's anonymized transaction fingerprints — the biggest untapped signal in
# the IEEE-CIS dataset. LightGBM handles NaN natively; no fill needed at training time.
# At inference (wallet payload), all V columns default to NaN so the model follows the
# NaN branch it learned during training.
_V_COLS: list[str] = [f"V{i}" for i in range(1, 340)]
V_FEATURE_SET: frozenset[str] = frozenset(_V_COLS)

# Features that should default to NaN (not 0.0) when missing — LightGBM learns the
# optimal NaN-branch direction during training, so inference must also send NaN.
NAN_DEFAULT_FEATURES: frozenset[str] = frozenset(
    _V_COLS + [
        "d1_days", "d2_days", "d3_days", "d4_days", "d5_days",
        "d10_days", "d11_days", "d15_days",
        "dist1_proxy", "dist2_proxy",
        "card2_norm", "card3_norm", "card5_norm",
    ]
)

CARD4_MAP: dict[str, int] = {
    "visa": 0,
    "mastercard": 1,
    "discover": 2,
    "american express": 3,
    "diners club": 4,
}

MODEL_FEATURE_COLUMNS = [
    # ---- behavioural / amount profile (original 50) ----
    "amount",
    "log_transaction_amt",
    "transaction_hour",
    "is_night",
    "is_weekend",
    "profile_tx_count_before",
    "profile_avg_amount",
    "profile_std_amount",
    "profile_max_amount_before",
    "amount_deviation",
    "amount_zscore",
    "amount_vs_profile_max",
    "seconds_since_prev_tx",
    "rolling_tx_count_10m",
    "rolling_tx_count_1h",
    "rolling_tx_count_24h",
    "rolling_amount_sum_1h",
    "rolling_amount_sum_24h",
    "rolling_amount_avg_24h",
    "tx_velocity_1h",
    "tx_velocity_24h",
    "account_age_days",
    "new_device_flag",
    "new_location_flag",
    "device_usage_count",
    "location_usage_count",
    "known_device_count",
    "known_location_count",
    "identity_record_present",
    "device_missing_flag",
    "missing_feature_count",
    "email_domain_match",
    "email_domain_code",
    "device_trust_score",
    "ip_risk_score",
    "transaction_type_code",
    "device_type_code",
    "browser_code",
    "os_code",
    "payment_method_code",
    "dist1_proxy",
    "dist2_proxy",
    "activity_count_sum",
    "activity_count_mean",
    "activity_count_max",
    "activity_count_nonzero",
    "recency_signal_mean",
    "recency_signal_max",
    "verification_match_count",
    "verification_missing_count",
    "identity_signal_mean",
    "identity_signal_std",
    "identity_signal_missing_count",
    # ---- card attributes ----
    "card2_norm",
    "card3_norm",
    "card4_code",
    "card5_norm",
    "card1_freq",
    # ---- target encoding (cumulative fraud rate per entity, leak-free) ----
    "card1_fraud_rate",
    "addr1_fraud_rate",
    "p_emaildomain_fraud_rate",
    "card1_addr1_fraud_rate",
    # ---- aggregation (cumulative mean amount per entity) ----
    "card1_amt_mean",
    "addr1_amt_mean",
    "p_emaildomain_amt_mean",
    "card1_addr1_amt_mean",
    "amt_deviation_from_card1",
    # ---- frequency encoding ----
    "addr1_freq",
    "p_emaildomain_freq",
    # ---- amount splitting (fraud = round numbers, legit = specific cents) ----
    "amount_dollars",
    "amount_cents",
    # ---- feature interactions ----
    "amount_x_new_device",
    "amount_x_new_location",
    "velocity_x_new_device",
    "amount_deviation_x_is_night",
    # ---- individual timedelta features (D columns) ----
    "d1_days",
    "d2_days",
    "d3_days",
    "d4_days",
    "d5_days",
    "d10_days",
    "d11_days",
    "d15_days",
    # ---- Vesta engineered features: V1-V339 ----
] + _V_COLS

TRANSACTION_TYPE_MAP = {
    "w": 0,
    "c": 1,
    "r": 2,
    "h": 3,
    "s": 4,
    "transfer": 5,
    "payment": 6,
    "cash_out": 7,
    "cash_in": 8,
    "debit": 9,
    "purchase": 10,
}

DEVICE_TYPE_MAP = {
    "desktop": 0,
    "mobile": 1,
    "tablet": 2,
    "unknown": 3,
}

BROWSER_MAP = {
    "chrome": 0,
    "safari": 1,
    "firefox": 2,
    "edge": 3,
    "samsung": 4,
    "opera": 5,
    "ie": 6,
    "unknown": 7,
}

OS_MAP = {
    "windows": 0,
    "ios": 1,
    "android": 2,
    "mac": 3,
    "linux": 4,
    "unknown": 5,
}

PAYMENT_METHOD_MAP = {
    "debit": 0,
    "credit": 1,
    "charge": 2,
    "store": 3,
    "prepaid": 4,
    "unknown": 5,
}


def clip_score(value: float) -> float:
    return float(np.clip(value, 0.0, 100.0))


def to_epoch_seconds(value: Any) -> int:
    if value is None:
        return int(datetime.utcnow().timestamp())
    if isinstance(value, datetime):
        return int(value.timestamp())
    if isinstance(value, (int, float, np.integer, np.floating)):
        return int(value)

    text = str(value).strip()
    if not text:
        return int(datetime.utcnow().timestamp())
    try:
        return int(pd.Timestamp(text).timestamp())
    except Exception:
        return int(datetime.utcnow().timestamp())


def normalize_text(value: Any, fallback: str = "unknown") -> str:
    if value is None:
        return fallback
    text = str(value).strip().lower()
    return text if text else fallback


def transaction_type_code(value: Any) -> int:
    text = normalize_text(value, "transfer")
    return TRANSACTION_TYPE_MAP.get(text, TRANSACTION_TYPE_MAP["transfer"])


def device_type_code(value: Any) -> int:
    text = normalize_text(value, "unknown")
    return DEVICE_TYPE_MAP.get(text, DEVICE_TYPE_MAP["unknown"])


def browser_code(value: Any) -> int:
    text = normalize_text(value, "unknown")
    for key, code in BROWSER_MAP.items():
        if key != "unknown" and key in text:
            return code
    return BROWSER_MAP["unknown"]


def os_code(value: Any) -> int:
    text = normalize_text(value, "unknown")
    for key, code in OS_MAP.items():
        if key != "unknown" and key in text:
            return code
    return OS_MAP["unknown"]


def payment_method_code(value: Any) -> int:
    text = normalize_text(value, "unknown")
    return PAYMENT_METHOD_MAP.get(text, PAYMENT_METHOD_MAP["unknown"])


def categorical_hash_code(value: Any, modulus: int = 997) -> int:
    text = normalize_text(value, "unknown")
    return abs(hash(text)) % modulus


def map_match_signal(value: Any) -> float:
    text = normalize_text(value, "")
    if text in {"", "nan", "none"}:
        return np.nan
    if text in {"f", "n", "0"}:
        return 0.0
    return 1.0


def safe_amount_deviation(amount: float, baseline: float) -> float:
    baseline = max(float(baseline), 1.0)
    return float(amount / baseline)


def cumulative_prior_unique(series: pd.Series) -> pd.Series:
    seen: set[str] = set()
    output: list[float] = []
    for value in series.astype(str):
        output.append(float(len(seen)))
        seen.add(value)
    return pd.Series(output, index=series.index, dtype="float64")


def rolling_user_window_features(
    profile_keys: pd.Series,
    timestamps: pd.Series,
    amounts: pd.Series,
) -> pd.DataFrame:
    histories: defaultdict[str, deque[tuple[int, float]]] = defaultdict(deque)
    count_10m: list[float] = []
    count_1h: list[float] = []
    count_24h: list[float] = []
    sum_1h: list[float] = []
    sum_24h: list[float] = []
    avg_24h: list[float] = []

    for profile_key, ts, amount in zip(profile_keys.astype(str), timestamps.astype(int), amounts.astype(float)):
        history = histories[profile_key]

        count10 = 0
        count1h = 0
        count24h = 0
        sum1h = 0.0
        sum24h = 0.0

        for prev_ts, prev_amount in reversed(history):
            delta = ts - prev_ts
            if delta > 86400:
                break
            count24h += 1
            sum24h += prev_amount
            if delta <= 3600:
                count1h += 1
                sum1h += prev_amount
                if delta <= 600:
                    count10 += 1

        count_10m.append(float(count10))
        count_1h.append(float(count1h))
        count_24h.append(float(count24h))
        sum_1h.append(float(sum1h))
        sum_24h.append(float(sum24h))
        avg_24h.append(float(sum24h / count24h) if count24h else 0.0)

        history.append((ts, float(amount)))
        while history and ts - history[0][0] > 86400:
            history.popleft()

    return pd.DataFrame(
        {
            "rolling_tx_count_10m": count_10m,
            "rolling_tx_count_1h": count_1h,
            "rolling_tx_count_24h": count_24h,
            "rolling_amount_sum_1h": sum_1h,
            "rolling_amount_sum_24h": sum_24h,
            "rolling_amount_avg_24h": avg_24h,
        }
    )


def build_ieee_profile_keys(df: pd.DataFrame) -> pd.DataFrame:
    profile_parts = [
        df["card1"].fillna(-1).astype(str),
        df["addr1"].fillna(-1).astype(str),
        df["P_emaildomain"].fillna("unknown").astype(str),
    ]
    profile_key = profile_parts[0] + "|" + profile_parts[1] + "|" + profile_parts[2]

    device_key = df.get("DeviceInfo", pd.Series(index=df.index, dtype="object")).fillna("").astype(str).str.strip()
    id_30 = df.get("id_30", pd.Series(index=df.index, dtype="object")).fillna("").astype(str).str.strip()
    id_31 = df.get("id_31", pd.Series(index=df.index, dtype="object")).fillna("").astype(str).str.strip()
    device_key = device_key.mask(device_key == "", id_30)
    device_key = device_key.mask(device_key == "", id_31)
    device_key = device_key.mask(device_key == "", "unknown_device")

    location_key = (
        df.get("addr1", pd.Series(index=df.index, dtype="float64")).fillna(-1).astype(int).astype(str)
        + "|"
        + df.get("addr2", pd.Series(index=df.index, dtype="float64")).fillna(-1).astype(int).astype(str)
    )

    return pd.DataFrame(
        {
            "profile_key": profile_key,
            "device_key": device_key.astype(str),
            "location_key": location_key.astype(str),
        },
        index=df.index,
    )


def clean_raw_data(df: pd.DataFrame) -> pd.DataFrame:
    """Remove garbage rows before feature engineering.

    Tree-based models handle outliers natively, so we do NOT clip feature
    values — we only remove rows that are clearly corrupt or meaningless.
    """
    n_before = len(df)

    # 1. Drop rows with no / zero / negative transaction amount
    df = df[df["TransactionAmt"].notna() & (df["TransactionAmt"] > 0)].copy()

    # 2. Drop exact duplicate TransactionIDs (keep first occurrence)
    df = df.drop_duplicates(subset=["TransactionID"], keep="first")

    # 3. Remove rows missing >90% of all columns (corrupt / empty rows)
    missing_rate = df.isna().mean(axis=1)
    df = df[missing_rate <= 0.90].copy()

    # 4. Remove impossible TransactionDT (negative or zero)
    if "TransactionDT" in df.columns:
        df = df[df["TransactionDT"] > 0].copy()

    n_after = len(df)
    removed = n_before - n_after
    print(f"Data cleaning: {n_before:,} → {n_after:,} rows ({removed:,} removed, {removed / max(n_before, 1):.2%} garbage)")
    return df.reset_index(drop=True)


def build_training_features(df: pd.DataFrame) -> pd.DataFrame:
    ordered = df.sort_values("TransactionDT").reset_index(drop=True).copy()
    keys = build_ieee_profile_keys(ordered)

    ordered["profile_key"] = keys["profile_key"]
    ordered["device_key"] = keys["device_key"]
    ordered["location_key"] = keys["location_key"]
    ordered["timestamp_seconds"] = ordered["TransactionDT"].astype(int)
    ordered["event_time_day"] = ordered["timestamp_seconds"] / 86400.0
    ordered["transaction_hour"] = ((ordered["timestamp_seconds"] // 3600) % 24).astype(int)
    ordered["is_night"] = ordered["transaction_hour"].isin([0, 1, 2, 3, 4]).astype(np.int8)
    ordered["amount"] = ordered["TransactionAmt"].fillna(0.0).astype(float)
    ordered["log_transaction_amt"] = np.log1p(ordered["amount"])

    profile_groups = ordered.groupby("profile_key", sort=False)
    ordered["profile_tx_count_before"] = profile_groups.cumcount().astype(float)

    cumulative_amount = profile_groups["amount"].cumsum() - ordered["amount"]
    cumulative_amount_sq = profile_groups["amount"].transform(lambda s: (s ** 2).cumsum()) - (ordered["amount"] ** 2)
    prior_count = ordered["profile_tx_count_before"].replace(0, np.nan)
    global_amount_median = float(ordered["amount"].median())
    global_amount_std = float(ordered["amount"].std(ddof=0) or 1.0)
    ordered["profile_avg_amount"] = (cumulative_amount / prior_count).fillna(global_amount_median)
    profile_var = ((cumulative_amount_sq / prior_count) - (ordered["profile_avg_amount"] ** 2)).clip(lower=0.0)
    ordered["profile_std_amount"] = np.sqrt(profile_var).replace(0, np.nan).fillna(global_amount_std)
    ordered["profile_max_amount_before"] = profile_groups["amount"].cummax().shift(1).fillna(global_amount_median)
    ordered["amount_deviation"] = ordered["amount"] / ordered["profile_avg_amount"].clip(lower=1.0)
    ordered["amount_zscore"] = (
        (ordered["amount"] - ordered["profile_avg_amount"]) / ordered["profile_std_amount"].clip(lower=1.0)
    ).clip(lower=-20.0, upper=20.0)
    ordered["amount_vs_profile_max"] = (
        ordered["amount"] / ordered["profile_max_amount_before"].clip(lower=1.0)
    ).clip(lower=0.0, upper=50.0)

    rolling_frame = rolling_user_window_features(
        profile_keys=ordered["profile_key"],
        timestamps=ordered["timestamp_seconds"],
        amounts=ordered["amount"],
    )
    for column in rolling_frame.columns:
        ordered[column] = rolling_frame[column].astype(float)

    previous_timestamp = profile_groups["timestamp_seconds"].shift(1)
    ordered["seconds_since_prev_tx"] = (ordered["timestamp_seconds"] - previous_timestamp).fillna(86400)
    ordered["seconds_since_prev_tx"] = ordered["seconds_since_prev_tx"].clip(lower=0, upper=86400 * 30)

    ordered["tx_velocity_1h"] = ordered["rolling_tx_count_1h"]
    ordered["tx_velocity_24h"] = ordered["rolling_tx_count_24h"]

    first_timestamp = profile_groups["timestamp_seconds"].transform("min")
    ordered["account_age_days"] = (
        (ordered["timestamp_seconds"] - first_timestamp) / 86400.0
    ).clip(lower=0.0)

    ordered["new_device_flag"] = (
        ordered.groupby(["profile_key", "device_key"], sort=False).cumcount() == 0
    ).astype(np.int8)
    ordered["new_location_flag"] = (
        ordered.groupby(["profile_key", "location_key"], sort=False).cumcount() == 0
    ).astype(np.int8)

    ordered["device_usage_count"] = ordered.groupby("device_key", sort=False).cumcount().astype(float)
    ordered["location_usage_count"] = ordered.groupby("location_key", sort=False).cumcount().astype(float)
    ordered["known_device_count"] = profile_groups["device_key"].transform(cumulative_prior_unique).fillna(0.0)
    ordered["known_location_count"] = profile_groups["location_key"].transform(cumulative_prior_unique).fillna(0.0)

    ordered["identity_record_present"] = (
        ordered.get("DeviceType", pd.Series(index=ordered.index)).notna()
        | ordered.get("id_31", pd.Series(index=ordered.index)).notna()
        | ordered.get("id_30", pd.Series(index=ordered.index)).notna()
    ).astype(np.int8)

    # ---- weekend flag ----
    # TransactionDT is seconds from a reference epoch. Day 0 = Thursday (epoch day 0 = Thu).
    # (day_number + 4) % 7: 0=Thu,1=Fri,2=Sat,3=Sun,4=Mon,5=Tue,6=Wed  → >=2 and <=3 = weekend
    ordered["is_weekend"] = (
        ((ordered["timestamp_seconds"] // 86400 + 4) % 7 >= 5).astype(np.int8)
    )

    # ---- card attributes ----
    def _card4_encode(val: Any) -> int:
        text = normalize_text(val, "unknown")
        return CARD4_MAP.get(text, len(CARD4_MAP))

    # Keep NaN for missing card attributes — "unknown card" ≠ "card value 0".
    ordered["card2_norm"] = ordered.get("card2", pd.Series(np.nan, index=ordered.index)).astype(float) / 1000.0
    ordered["card3_norm"] = ordered.get("card3", pd.Series(np.nan, index=ordered.index)).astype(float) / 150.0
    ordered["card4_code"] = ordered.get("card4", pd.Series("unknown", index=ordered.index)).apply(_card4_encode).astype(float)
    ordered["card5_norm"] = ordered.get("card5", pd.Series(np.nan, index=ordered.index)).astype(float) / 200.0
    # card1 frequency: cumulative count of how many times this card has appeared (sorted by time)
    ordered["card1_freq"] = ordered.groupby(
        ordered.get("card1", pd.Series("unknown", index=ordered.index)).fillna("unknown").astype(str),
        sort=False,
    ).cumcount().astype(float)

    # ---- individual D column timedeltas ----
    # D1=days since last transaction, D2=days since last txn on this device,
    # D3=days since last txn on this address, D10=days since last txn on billing addr,
    # D11=days since last txn (may overlap D1), D15=days since last addr change
    _D_FEATURES = [("D1", "d1_days"), ("D2", "d2_days"), ("D3", "d3_days"),
                   ("D4", "d4_days"), ("D5", "d5_days"), ("D10", "d10_days"),
                   ("D11", "d11_days"), ("D15", "d15_days")]
    for src_col, feat_name in _D_FEATURES:
        if src_col in ordered.columns:
            # Keep NaN — LightGBM learns optimal NaN branch direction natively.
            # Only clip real values; NaN passes through clip() unchanged.
            ordered[feat_name] = ordered[src_col].clip(upper=640.0).astype(float)
        else:
            ordered[feat_name] = np.nan

    # ---- V columns: Vesta anonymized transaction features ----
    # Keep NaN so LightGBM learns the optimal NaN branch direction during training.
    for v_col in _V_COLS:
        if v_col in ordered.columns:
            ordered[v_col] = ordered[v_col].astype(float)
        else:
            ordered[v_col] = np.nan

    # ===========================================================================
    # ADVANCED FEATURE ENGINEERING — target encoding, aggregation, interactions
    # ===========================================================================

    # ---- TARGET ENCODING: cumulative fraud rate per entity (Bayesian smoothed) ----
    # For each row, uses ONLY rows that appeared BEFORE it (leak-free).
    # Bayesian smoothing pulls rare entities toward the global fraud rate.
    _TE_SMOOTHING = 20
    _global_fraud_prior = ordered["isFraud"].expanding().mean().shift(1).fillna(
        ordered["isFraud"].mean()
    )
    _global_amt_prior = ordered["amount"].expanding().mean().shift(1).fillna(
        ordered["amount"].median()
    )

    for _raw_col, _feat_name in [
        ("card1", "card1_fraud_rate"),
        ("addr1", "addr1_fraud_rate"),
        ("P_emaildomain", "p_emaildomain_fraud_rate"),
    ]:
        _key = ordered.get(_raw_col, pd.Series("unknown", index=ordered.index)).fillna("unknown").astype(str)
        ordered["_te_grp"] = _key
        _grp = ordered.groupby("_te_grp", sort=False)
        _n = _grp.cumcount().astype(float)
        _fraud_sum = _grp["isFraud"].cumsum().astype(float) - ordered["isFraud"].astype(float)
        ordered[_feat_name] = (_fraud_sum + _TE_SMOOTHING * _global_fraud_prior) / (_n + _TE_SMOOTHING)

    # card1+addr1 combo target encoding (captures fraud clustering in card+address pairs)
    _combo_key = (
        ordered.get("card1", pd.Series("unk", index=ordered.index)).fillna("unk").astype(str)
        + "|"
        + ordered.get("addr1", pd.Series("unk", index=ordered.index)).fillna("unk").astype(str)
    )
    ordered["_te_grp"] = _combo_key
    _grp = ordered.groupby("_te_grp", sort=False)
    _n = _grp.cumcount().astype(float)
    _fraud_sum = _grp["isFraud"].cumsum().astype(float) - ordered["isFraud"].astype(float)
    ordered["card1_addr1_fraud_rate"] = (_fraud_sum + _TE_SMOOTHING * _global_fraud_prior) / (_n + _TE_SMOOTHING)
    ordered.drop(columns=["_te_grp"], inplace=True, errors="ignore")

    # ---- AGGREGATION: cumulative mean amount per entity ----
    for _raw_col, _feat_name in [
        ("card1", "card1_amt_mean"),
        ("addr1", "addr1_amt_mean"),
        ("P_emaildomain", "p_emaildomain_amt_mean"),
    ]:
        _key = ordered.get(_raw_col, pd.Series("unknown", index=ordered.index)).fillna("unknown").astype(str)
        ordered["_agg_grp"] = _key
        _grp = ordered.groupby("_agg_grp", sort=False)
        _n = _grp.cumcount().astype(float)
        _amt_sum = _grp["amount"].cumsum() - ordered["amount"]
        ordered[_feat_name] = np.where(_n > 0, _amt_sum / _n, _global_amt_prior)

    # card1+addr1 combo mean amount
    ordered["_agg_grp"] = _combo_key
    _grp = ordered.groupby("_agg_grp", sort=False)
    _n = _grp.cumcount().astype(float)
    _amt_sum = _grp["amount"].cumsum() - ordered["amount"]
    ordered["card1_addr1_amt_mean"] = np.where(_n > 0, _amt_sum / _n, _global_amt_prior)
    ordered.drop(columns=["_agg_grp"], inplace=True, errors="ignore")

    # How unusual is this amount for this card? (entity-level deviation)
    ordered["amt_deviation_from_card1"] = (
        ordered["amount"] / ordered["card1_amt_mean"].clip(lower=1.0)
    ).clip(lower=0.0, upper=50.0)

    # ---- FREQUENCY ENCODING: cumulative count per entity ----
    ordered["addr1_freq"] = ordered.groupby(
        ordered.get("addr1", pd.Series("unknown", index=ordered.index)).fillna("unknown").astype(str),
        sort=False,
    ).cumcount().astype(float)
    ordered["p_emaildomain_freq"] = ordered.groupby(
        ordered.get("P_emaildomain", pd.Series("unknown", index=ordered.index)).fillna("unknown").astype(str),
        sort=False,
    ).cumcount().astype(float)

    # ---- AMOUNT SPLITTING: fraud uses round numbers, legit has specific cents ----
    ordered["amount_dollars"] = np.floor(ordered["amount"]).astype(float)
    ordered["amount_cents"] = ((ordered["amount"] % 1) * 100).round(0).astype(float)

    # ---- FEATURE INTERACTIONS: explicit combinations for low colsample_bytree ----
    ordered["amount_x_new_device"] = ordered["amount"] * ordered["new_device_flag"]
    ordered["amount_x_new_location"] = ordered["amount"] * ordered["new_location_flag"]
    ordered["velocity_x_new_device"] = ordered["tx_velocity_1h"] * ordered["new_device_flag"]
    ordered["amount_deviation_x_is_night"] = ordered["amount_deviation"] * ordered["is_night"]

    ordered["device_missing_flag"] = (ordered["device_key"] == "unknown_device").astype(np.int8)
    ordered["missing_feature_count"] = ordered.isna().sum(axis=1).astype(float)

    email_left = ordered.get("P_emaildomain", pd.Series(index=ordered.index)).fillna("unknown")
    email_right = ordered.get("R_emaildomain", pd.Series(index=ordered.index)).fillna("unknown")
    ordered["email_domain_match"] = (email_left == email_right).astype(np.int8)

    # Keep NaN for missing distances — "unknown distance" ≠ "zero distance".
    dist1 = ordered.get("dist1", pd.Series(np.nan, index=ordered.index)).astype(float)
    dist2 = ordered.get("dist2", pd.Series(np.nan, index=ordered.index)).astype(float)
    ordered["dist1_proxy"] = dist1.clip(lower=0.0, upper=5000.0)
    ordered["dist2_proxy"] = dist2.clip(lower=0.0, upper=5000.0)

    ip_proxy = (
        ordered["new_location_flag"] * 25.0
        + (1 - ordered["email_domain_match"]) * 15.0
        + ordered["dist1_proxy"].clip(upper=1000.0) / 20.0
        + ordered["tx_velocity_1h"].clip(upper=20.0) * 2.5
    )
    ordered["ip_risk_score"] = ip_proxy.clip(lower=0.0, upper=100.0)

    device_proxy = (
        100.0
        - ordered["new_device_flag"] * 35.0
        - ordered["device_missing_flag"] * 20.0
        - (1 - ordered["identity_record_present"]) * 15.0
        - ordered["device_usage_count"].clip(upper=20.0) * 2.0
    )
    ordered["device_trust_score"] = device_proxy.clip(lower=0.0, upper=100.0)

    ordered["transaction_type_code"] = ordered.get("ProductCD", pd.Series("w", index=ordered.index)).apply(
        transaction_type_code
    )
    ordered["device_type_code"] = ordered.get("DeviceType", pd.Series("unknown", index=ordered.index)).apply(
        device_type_code
    )
    ordered["browser_code"] = ordered.get("id_31", pd.Series("unknown", index=ordered.index)).apply(browser_code)
    ordered["os_code"] = ordered.get("id_30", pd.Series("unknown", index=ordered.index)).apply(os_code)
    ordered["payment_method_code"] = ordered.get("card6", pd.Series("unknown", index=ordered.index)).apply(
        payment_method_code
    )
    ordered["email_domain_code"] = ordered.get("P_emaildomain", pd.Series("unknown", index=ordered.index)).apply(
        categorical_hash_code
    )

    c_columns = [col for col in [f"C{i}" for i in range(1, 15)] if col in ordered.columns]
    if c_columns:
        c_frame = ordered[c_columns].fillna(0.0).astype(float)
        ordered["activity_count_sum"] = c_frame.sum(axis=1)
        ordered["activity_count_mean"] = c_frame.mean(axis=1)
        ordered["activity_count_max"] = c_frame.max(axis=1)
        ordered["activity_count_nonzero"] = (c_frame > 0).sum(axis=1).astype(float)
    else:
        ordered["activity_count_sum"] = 0.0
        ordered["activity_count_mean"] = 0.0
        ordered["activity_count_max"] = 0.0
        ordered["activity_count_nonzero"] = 0.0

    d_columns = [col for col in [f"D{i}" for i in range(1, 16)] if col in ordered.columns]
    if d_columns:
        d_frame = ordered[d_columns].fillna(0.0).astype(float)
        ordered["recency_signal_mean"] = d_frame.mean(axis=1)
        ordered["recency_signal_max"] = d_frame.max(axis=1)
    else:
        ordered["recency_signal_mean"] = 0.0
        ordered["recency_signal_max"] = 0.0

    m_columns = [col for col in [f"M{i}" for i in range(1, 10)] if col in ordered.columns]
    if m_columns:
        m_frame = ordered[m_columns].apply(lambda col: col.map(map_match_signal))
        ordered["verification_match_count"] = m_frame.fillna(0.0).astype(float).sum(axis=1)
        ordered["verification_missing_count"] = ordered[m_columns].isna().sum(axis=1).astype(float)
    else:
        ordered["verification_match_count"] = 0.0
        ordered["verification_missing_count"] = 0.0

    identity_numeric_columns = [
        col
        for col in [
            "id_01", "id_02", "id_03", "id_04", "id_05", "id_06", "id_07", "id_08", "id_09", "id_10",
            "id_11", "id_13", "id_14", "id_17", "id_18", "id_19", "id_20", "id_32",
        ]
        if col in ordered.columns
    ]
    if identity_numeric_columns:
        identity_frame = ordered[identity_numeric_columns].astype(float)
        ordered["identity_signal_mean"] = identity_frame.fillna(0.0).mean(axis=1)
        ordered["identity_signal_std"] = identity_frame.fillna(0.0).std(axis=1)
        ordered["identity_signal_missing_count"] = identity_frame.isna().sum(axis=1).astype(float)
    else:
        ordered["identity_signal_mean"] = 0.0
        ordered["identity_signal_std"] = 0.0
        ordered["identity_signal_missing_count"] = 0.0

    features = ordered[MODEL_FEATURE_COLUMNS].astype(float)
    labels = ordered["isFraud"].astype(np.int8)
    return pd.concat([features, ordered["event_time_day"], labels.rename("isFraud")], axis=1)


def select_feature_matrix(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    X = df[MODEL_FEATURE_COLUMNS].astype(float).copy()
    y = df["isFraud"].astype(np.int8).copy()
    return X, y


def feature_row_to_frame(feature_row: dict[str, Any], feature_names: list[str]) -> pd.DataFrame:
    aligned: dict[str, float] = {}
    for name in feature_names:
        val = feature_row.get(name)
        if val is None:
            # Features in NAN_DEFAULT_FEATURES (V cols, D cols, dist, card) default
            # to NaN so the model follows its trained NaN branch direction.
            aligned[name] = np.nan if name in NAN_DEFAULT_FEATURES else 0.0
        else:
            try:
                aligned[name] = float(val)
            except (TypeError, ValueError):
                aligned[name] = np.nan if name in NAN_DEFAULT_FEATURES else 0.0
    return pd.DataFrame([aligned], columns=feature_names)


@dataclass
class RuntimeProfile:
    first_seen_ts: int
    last_seen_ts: int
    tx_count: int
    amount_sum: float
    amount_sum_sq: float
    recent_tx_timestamps: deque[int]
    recent_amounts: deque[tuple[int, float]]
    known_devices: set[str]
    known_locations: set[str]


def make_runtime_profile(now_ts: int) -> RuntimeProfile:
    return RuntimeProfile(
        first_seen_ts=now_ts,
        last_seen_ts=now_ts,
        tx_count=0,
        amount_sum=0.0,
        amount_sum_sq=0.0,
        recent_tx_timestamps=deque(),
        recent_amounts=deque(),
        known_devices=set(),
        known_locations=set(),
    )


def build_runtime_feature_row(
    payload: Any,
    profiles: dict[str, RuntimeProfile],
    device_registry: defaultdict[str, set[str]],
    location_registry: defaultdict[str, set[str]],
) -> tuple[dict[str, float], dict[str, Any]]:
    timestamp_seconds = to_epoch_seconds(getattr(payload, "timestamp", None))
    user_id = normalize_text(getattr(payload, "user_id", None), "guest")
    device_id = normalize_text(getattr(payload, "device_id", None), "unknown_device")
    location = normalize_text(getattr(payload, "location", None), "unknown_location")
    email_domain = normalize_text(getattr(payload, "email_domain", None), "unknown")
    recipient_email_domain = normalize_text(getattr(payload, "recipient_email_domain", None), email_domain)
    amount = max(float(getattr(payload, "amount", 0.0)), 0.0)

    profile = profiles.get(user_id) or make_runtime_profile(timestamp_seconds)
    historical_avg = (
        profile.amount_sum / profile.tx_count if profile.tx_count > 0 else float(getattr(payload, "user_avg_amount", 0.0) or amount or 1.0)
    )
    if profile.tx_count > 1:
        _mean = profile.amount_sum / profile.tx_count
        _variance = max(0.0, profile.amount_sum_sq / profile.tx_count - _mean ** 2)
        _computed_std = float(np.sqrt(_variance)) if _variance > 0.0 else max(historical_avg * 0.35, 1.0)
    else:
        _computed_std = max(historical_avg * 0.35, 1.0)
    profile_std_amount = max(_computed_std, 1.0)
    seconds_since_prev_tx = (
        timestamp_seconds - profile.last_seen_ts if profile.tx_count > 0 else 86400
    )
    seconds_since_prev_tx = float(np.clip(seconds_since_prev_tx, 0, 86400 * 30))

    while profile.recent_tx_timestamps and timestamp_seconds - profile.recent_tx_timestamps[0] > 3600:
        profile.recent_tx_timestamps.popleft()
    while profile.recent_amounts and timestamp_seconds - profile.recent_amounts[0][0] > 86400:
        profile.recent_amounts.popleft()

    inferred_velocity = len(profile.recent_tx_timestamps)
    tx_velocity_1h = int(getattr(payload, "transactions_last_hour", inferred_velocity) or inferred_velocity)
    rolling_tx_count_10m = float(
        getattr(
            payload,
            "transactions_last_10min",
            sum(1 for prev_ts, _ in profile.recent_amounts if timestamp_seconds - prev_ts <= 600),
        )
        or 0.0
    )
    rolling_tx_count_1h = float(tx_velocity_1h)
    rolling_tx_count_24h = float(
        getattr(payload, "transactions_last_day", len(profile.recent_amounts)) or len(profile.recent_amounts)
    )
    rolling_amount_sum_1h = float(
        getattr(
            payload,
            "amount_sum_last_hour",
            sum(prev_amount for prev_ts, prev_amount in profile.recent_amounts if timestamp_seconds - prev_ts <= 3600),
        )
        or 0.0
    )
    rolling_amount_sum_24h = float(
        getattr(payload, "amount_sum_last_day", sum(prev_amount for _, prev_amount in profile.recent_amounts))
        or 0.0
    )
    rolling_amount_avg_24h = float(
        rolling_amount_sum_24h / rolling_tx_count_24h if rolling_tx_count_24h > 0 else historical_avg
    )

    explicit_new_device = getattr(payload, "new_device_flag", None)
    new_device_flag = int(explicit_new_device) if explicit_new_device is not None else int(device_id not in profile.known_devices)

    explicit_location_change = getattr(payload, "location_change_flag", None)
    new_location_flag = int(explicit_location_change) if explicit_location_change is not None else int(location not in profile.known_locations)

    explicit_ip_risk = getattr(payload, "ip_risk_score", None)
    explicit_device_trust = getattr(payload, "device_trust_score", None)
    geo_distance_km = float(getattr(payload, "geo_distance_km", 0.0) or 0.0)
    previous_geo_distance_km = float(getattr(payload, "previous_geo_distance_km", 0.0) or 0.0)
    browser = getattr(payload, "browser", "unknown")
    operating_system = getattr(payload, "operating_system", "unknown")
    payment_method = getattr(payload, "payment_method", "unknown")

    inferred_ip_risk = clip_score(
        new_location_flag * 25.0
        + geo_distance_km / 20.0
        + tx_velocity_1h * 4.0
        + max(safe_amount_deviation(amount, historical_avg) - 1.0, 0.0) * 10.0
    )
    ip_risk_score = float(explicit_ip_risk) if explicit_ip_risk is not None else inferred_ip_risk

    inferred_device_trust = clip_score(
        100.0
        - new_device_flag * 35.0
        - min(len(device_registry[device_id]), 20) * 2.5
        - (0 if device_id != "unknown_device" else 20.0)
    )
    device_trust_score = (
        float(explicit_device_trust) if explicit_device_trust is not None else inferred_device_trust
    )

    activity_count_sum = float(getattr(payload, "activity_count_sum", tx_velocity_1h * 2.0) or 0.0)
    activity_count_mean = float(getattr(payload, "activity_count_mean", activity_count_sum / max(tx_velocity_1h or 1, 1)) or 0.0)
    activity_count_max = float(getattr(payload, "activity_count_max", activity_count_mean * 1.5) or 0.0)
    activity_count_nonzero = float(getattr(payload, "activity_count_nonzero", min(tx_velocity_1h + 1, 14)) or 0.0)
    recency_signal_mean = float(getattr(payload, "recency_signal_mean", max(0.0, 30 - tx_velocity_1h * 2)) or 0.0)
    recency_signal_max = float(getattr(payload, "recency_signal_max", recency_signal_mean * 1.5) or 0.0)
    verification_match_count = float(getattr(payload, "verification_match_count", 5.0 if email_domain == recipient_email_domain else 2.0) or 0.0)
    verification_missing_count = float(getattr(payload, "verification_missing_count", 0.0 if device_id != "unknown_device" else 3.0) or 0.0)
    identity_signal_mean = float(getattr(payload, "identity_signal_mean", device_trust_score / 10.0) or 0.0)
    identity_signal_std = float(getattr(payload, "identity_signal_std", max(0.5, abs(identity_signal_mean) * 0.2)) or 0.0)
    identity_signal_missing_count = float(getattr(payload, "identity_signal_missing_count", 0.0 if device_id != "unknown_device" else 4.0) or 0.0)

    device_type = getattr(payload, "device_type", "mobile")
    transaction_type = getattr(payload, "transaction_type", "transfer")

    # ---- new features: card, weekend, D columns ----
    card2_norm = float(getattr(payload, "card2_norm", 0.0) or 0.0)
    card3_norm = float(getattr(payload, "card3_norm", 0.0) or 0.0)
    card4_code = float(CARD4_MAP.get(normalize_text(getattr(payload, "card4", "unknown")), len(CARD4_MAP)))
    card5_norm = float(getattr(payload, "card5_norm", 0.0) or 0.0)
    card1_freq = float(getattr(payload, "card1_freq", 1.0) or 1.0)  # 1 = not brand-new, not high-frequency
    is_weekend = float(int((timestamp_seconds // 86400 + 4) % 7 >= 5))
    # D columns, V columns, dist, card: wallet doesn't provide these.
    # feature_row_to_frame defaults them to NaN via NAN_DEFAULT_FEATURES,
    # so the model follows its trained NaN branch direction.

    feature_row = {
        "amount": amount,
        "log_transaction_amt": float(np.log1p(amount)),
        "transaction_hour": float((timestamp_seconds // 3600) % 24),
        "is_night": float(int(((timestamp_seconds // 3600) % 24) in [0, 1, 2, 3, 4])),
        "profile_tx_count_before": float(profile.tx_count),
        "profile_avg_amount": float(max(historical_avg, 1.0)),
        "profile_std_amount": float(profile_std_amount),
        "profile_max_amount_before": float(max(getattr(payload, "profile_max_amount", historical_avg * 1.5) or historical_avg, 1.0)),
        "amount_deviation": float(safe_amount_deviation(amount, historical_avg)),
        "amount_zscore": float(
            np.clip((amount - historical_avg) / profile_std_amount, -20.0, 20.0)
        ),
        "amount_vs_profile_max": float(
            np.clip(amount / max(float(getattr(payload, "profile_max_amount", historical_avg * 1.5) or 1.0), 1.0), 0.0, 50.0)
        ),
        "seconds_since_prev_tx": seconds_since_prev_tx,
        "rolling_tx_count_10m": float(rolling_tx_count_10m),
        "rolling_tx_count_1h": float(rolling_tx_count_1h),
        "rolling_tx_count_24h": float(rolling_tx_count_24h),
        "rolling_amount_sum_1h": float(rolling_amount_sum_1h),
        "rolling_amount_sum_24h": float(rolling_amount_sum_24h),
        "rolling_amount_avg_24h": float(rolling_amount_avg_24h),
        "tx_velocity_1h": float(tx_velocity_1h),
        "tx_velocity_24h": float(rolling_tx_count_24h),
        "account_age_days": float(
            max((timestamp_seconds - profile.first_seen_ts) / 86400.0, float(getattr(payload, "account_age_days", 0.0) or 0.0))
        ),
        "new_device_flag": float(new_device_flag),
        "new_location_flag": float(new_location_flag),
        "device_usage_count": float(len(device_registry[device_id])),
        "location_usage_count": float(len(location_registry[location])),
        "known_device_count": float(max(len(profile.known_devices), float(getattr(payload, "known_device_count", 0.0) or 0.0))),
        "known_location_count": float(max(len(profile.known_locations), float(getattr(payload, "known_location_count", 0.0) or 0.0))),
        "identity_record_present": float(int(device_id != "unknown_device")),
        "device_missing_flag": float(int(device_id == "unknown_device")),
        "missing_feature_count": float(sum(1 for value in [payload.location, payload.device_id, payload.email_domain] if not value)),
        "email_domain_match": float(int(email_domain == recipient_email_domain)),
        "email_domain_code": float(categorical_hash_code(email_domain)),
        "device_trust_score": float(clip_score(device_trust_score)),
        "ip_risk_score": float(clip_score(ip_risk_score)),
        "transaction_type_code": float(transaction_type_code(transaction_type)),
        "device_type_code": float(device_type_code(device_type)),
        "browser_code": float(browser_code(browser)),
        "os_code": float(os_code(operating_system)),
        "payment_method_code": float(payment_method_code(payment_method)),
        "dist1_proxy": float(max(geo_distance_km, 0.0)),
        "dist2_proxy": float(max(previous_geo_distance_km, 0.0)),
        "activity_count_sum": float(activity_count_sum),
        "activity_count_mean": float(activity_count_mean),
        "activity_count_max": float(activity_count_max),
        "activity_count_nonzero": float(activity_count_nonzero),
        "recency_signal_mean": float(recency_signal_mean),
        "recency_signal_max": float(recency_signal_max),
        "verification_match_count": float(verification_match_count),
        "verification_missing_count": float(verification_missing_count),
        "identity_signal_mean": float(identity_signal_mean),
        "identity_signal_std": float(identity_signal_std),
        "identity_signal_missing_count": float(identity_signal_missing_count),
        # ---- new features ----
        "card2_norm": card2_norm,
        "card3_norm": card3_norm,
        "card4_code": card4_code,
        "card5_norm": card5_norm,
        "card1_freq": card1_freq,
        "is_weekend": is_weekend,
        # ---- target encoding defaults (global fraud rate ≈ 0.035 = neutral) ----
        "card1_fraud_rate": 0.035,
        "addr1_fraud_rate": 0.035,
        "p_emaildomain_fraud_rate": 0.035,
        "card1_addr1_fraud_rate": 0.035,
        # ---- aggregation defaults ----
        "card1_amt_mean": float(amount),
        "addr1_amt_mean": float(amount),
        "p_emaildomain_amt_mean": float(amount),
        "card1_addr1_amt_mean": float(amount),
        "amt_deviation_from_card1": 1.0,
        # ---- frequency defaults ----
        "addr1_freq": 1.0,
        "p_emaildomain_freq": 1.0,
        # ---- amount splitting ----
        "amount_dollars": float(np.floor(amount)),
        "amount_cents": float(round((amount % 1) * 100)),
        # ---- feature interactions ----
        "amount_x_new_device": float(amount * new_device_flag),
        "amount_x_new_location": float(amount * new_location_flag),
        "velocity_x_new_device": float(tx_velocity_1h * new_device_flag),
        "amount_deviation_x_is_night": float(
            safe_amount_deviation(amount, historical_avg)
            * int(((timestamp_seconds // 3600) % 24) in [0, 1, 2, 3, 4])
        ),
        # D columns, V columns omitted — feature_row_to_frame defaults them to NaN
    }

    telemetry = {
        "user_id": user_id,
        "device_id": device_id,
        "location": location,
        "timestamp_seconds": timestamp_seconds,
        "email_domain": email_domain,
        "recipient_email_domain": recipient_email_domain,
    }
    return feature_row, telemetry


def update_runtime_profile(
    telemetry: dict[str, Any],
    amount: float,
    profiles: dict[str, RuntimeProfile],
    device_registry: defaultdict[str, set[str]],
    location_registry: defaultdict[str, set[str]],
) -> None:
    user_id = telemetry["user_id"]
    device_id = telemetry["device_id"]
    location = telemetry["location"]
    timestamp_seconds = telemetry["timestamp_seconds"]

    profile = profiles.get(user_id)
    if profile is None:
        profile = make_runtime_profile(timestamp_seconds)
        profiles[user_id] = profile

    profile.last_seen_ts = timestamp_seconds
    profile.tx_count += 1
    profile.amount_sum += amount
    profile.amount_sum_sq += amount ** 2
    profile.recent_tx_timestamps.append(timestamp_seconds)
    profile.recent_amounts.append((timestamp_seconds, amount))
    profile.known_devices.add(device_id)
    profile.known_locations.add(location)

    while profile.recent_tx_timestamps and timestamp_seconds - profile.recent_tx_timestamps[0] > 3600:
        profile.recent_tx_timestamps.popleft()
    while profile.recent_amounts and timestamp_seconds - profile.recent_amounts[0][0] > 86400:
        profile.recent_amounts.popleft()

    device_registry[device_id].add(user_id)
    location_registry[location].add(user_id)


def build_reason_codes(feature_row: dict[str, float]) -> list[str]:
    reasons: list[tuple[float, str]] = []

    if feature_row["amount_deviation"] >= 3.0:
        reasons.append((feature_row["amount_deviation"], f"Amount is {feature_row['amount_deviation']:.1f}x above baseline"))
    if feature_row["new_device_flag"] >= 1:
        reasons.append((2.0, "New device detected"))
    if feature_row["new_location_flag"] >= 1:
        reasons.append((2.0, "Unseen location for this user"))
    if feature_row["tx_velocity_1h"] >= 5:
        reasons.append((feature_row["tx_velocity_1h"], "Rapid transaction velocity in the last hour"))
    if feature_row["rolling_tx_count_10m"] >= 3:
        reasons.append((feature_row["rolling_tx_count_10m"], "Multiple transactions within 10 minutes"))
    if feature_row["ip_risk_score"] >= 70:
        reasons.append((feature_row["ip_risk_score"], "High-risk IP or network reputation"))
    if feature_row["device_trust_score"] <= 35:
        reasons.append((100 - feature_row["device_trust_score"], "Low device trust score"))
    if feature_row["is_night"] >= 1 and feature_row["amount_deviation"] >= 1.5:
        reasons.append((1.5, "Transaction time is unusual for the user profile"))

    reasons.sort(key=lambda item: item[0], reverse=True)
    return [text for _, text in reasons[:3]]


def policy_risk_assessment(feature_row: dict[str, float]) -> dict[str, Any]:
    risk = 0.0
    strong_hits = 0
    moderate_hits = 0
    triggers: list[str] = []

    if feature_row["amount_deviation"] >= 8.0:
        risk += 0.28
        strong_hits += 1
        triggers.append("extreme_amount_deviation")
    elif feature_row["amount_deviation"] >= 3.0:
        risk += 0.14
        moderate_hits += 1
        triggers.append("high_amount_deviation")

    if feature_row["new_device_flag"] >= 1:
        risk += 0.12
        moderate_hits += 1
        triggers.append("new_device")

    if feature_row["new_location_flag"] >= 1:
        risk += 0.10
        moderate_hits += 1
        triggers.append("new_location")

    if feature_row["tx_velocity_1h"] >= 10:
        risk += 0.22
        strong_hits += 1
        triggers.append("extreme_velocity")
    elif feature_row["tx_velocity_1h"] >= 5:
        risk += 0.10
        moderate_hits += 1
        triggers.append("elevated_velocity")

    if feature_row["rolling_tx_count_10m"] >= 3:
        risk += 0.12
        moderate_hits += 1
        triggers.append("short_burst_velocity")

    if feature_row["rolling_amount_sum_1h"] >= feature_row["profile_avg_amount"] * 8:
        risk += 0.12
        moderate_hits += 1
        triggers.append("hourly_amount_spike")

    if feature_row["ip_risk_score"] >= 85:
        risk += 0.25
        strong_hits += 1
        triggers.append("high_ip_risk")
    elif feature_row["ip_risk_score"] >= 70:
        risk += 0.14
        moderate_hits += 1
        triggers.append("elevated_ip_risk")

    if feature_row["device_trust_score"] <= 15:
        risk += 0.24
        strong_hits += 1
        triggers.append("very_low_device_trust")
    elif feature_row["device_trust_score"] <= 30:
        risk += 0.12
        moderate_hits += 1
        triggers.append("low_device_trust")

    if feature_row["dist1_proxy"] >= 1000:
        risk += 0.10
        moderate_hits += 1
        triggers.append("long_distance_change")

    if feature_row["is_night"] >= 1 and feature_row["amount_deviation"] >= 2.0:
        risk += 0.08
        moderate_hits += 1
        triggers.append("nighttime_anomaly")

    hard_block = strong_hits >= 2 and moderate_hits >= 2
    hard_flag = hard_block or (strong_hits >= 1 and moderate_hits >= 2) or (moderate_hits >= 3)

    return {
        "policy_risk": float(np.clip(risk, 0.0, 0.98)),
        "hard_flag": hard_flag,
        "hard_block": hard_block,
        "triggers": triggers,
    }


def hybrid_risk_score(model_probability: float, feature_row: dict[str, float]) -> dict[str, Any]:
    assessment = policy_risk_assessment(feature_row)
    adjusted_probability = max(float(model_probability), float(assessment["policy_risk"]))

    if assessment["hard_block"]:
        adjusted_probability = max(adjusted_probability, 0.92)
    elif assessment["hard_flag"]:
        adjusted_probability = max(adjusted_probability, 0.55)

    assessment["hybrid_risk_score"] = float(np.clip(adjusted_probability, 0.0, 0.999))
    return assessment


def threshold_table(y_true: np.ndarray, probabilities: np.ndarray, thresholds: list[float]) -> list[dict[str, float]]:
    rows: list[dict[str, float]] = []
    y_true = np.asarray(y_true).astype(int)

    for threshold in thresholds:
        predictions = (probabilities >= threshold).astype(int)
        tp = float(((predictions == 1) & (y_true == 1)).sum())
        fp = float(((predictions == 1) & (y_true == 0)).sum())
        tn = float(((predictions == 0) & (y_true == 0)).sum())
        fn = float(((predictions == 0) & (y_true == 1)).sum())

        precision = tp / (tp + fp) if (tp + fp) else 0.0
        recall = tp / (tp + fn) if (tp + fn) else 0.0
        false_positive_rate = fp / (fp + tn) if (fp + tn) else 0.0
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) else 0.0

        rows.append(
            {
                "threshold": threshold,
                "precision": precision,
                "recall": recall,
                "f1": f1,
                "false_positive_rate": false_positive_rate,
                "tp": tp,
                "fp": fp,
                "tn": tn,
                "fn": fn,
            }
        )

    return rows


def choose_thresholds(rows: list[dict[str, float]]) -> dict[str, float]:
    flag_candidates = [
        row for row in rows if row["recall"] >= 0.75 and row["precision"] >= 0.12 and row["threshold"] >= 0.25
    ]
    block_candidates = [
        row for row in rows if row["precision"] >= 0.60 and row["threshold"] >= 0.60
    ]

    fallback_flag = next((row for row in rows if row["threshold"] >= 0.30), rows[2])
    fallback_block = next((row for row in reversed(rows) if row["threshold"] >= 0.75), rows[-1])

    flag_row = max(flag_candidates, key=lambda row: (row["precision"], row["f1"])) if flag_candidates else fallback_flag
    block_row = max(block_candidates, key=lambda row: (row["recall"], row["f1"])) if block_candidates else fallback_block

    if block_row["threshold"] <= flag_row["threshold"]:
        block_row = max(rows, key=lambda row: (row["precision"], row["threshold"]))
        if block_row["threshold"] <= flag_row["threshold"]:
            block_row = fallback_block

    return {
        "approve_max": float(flag_row["threshold"]),
        "flag_min": float(flag_row["threshold"]),
        "block_min": float(block_row["threshold"]),
    }


def default_training_paths(root_dir: Path) -> dict[str, Path]:
    model_dir = root_dir / "models"
    return {
        "model": model_dir / "fraud_model.pkl",
        "features": model_dir / "feature_names.pkl",
        "config": model_dir / "model_config.json",
    }
