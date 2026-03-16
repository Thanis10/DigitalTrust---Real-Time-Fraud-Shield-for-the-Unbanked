from __future__ import annotations

import json
import sys
import time
from collections import defaultdict
from pathlib import Path
from typing import Any

import joblib
from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from fraud_pipeline import MODEL_VERSION  # noqa: E402
from fraud_pipeline import build_reason_codes  # noqa: E402
from fraud_pipeline import build_runtime_feature_row  # noqa: E402
from fraud_pipeline import default_training_paths  # noqa: E402
from fraud_pipeline import feature_row_to_frame  # noqa: E402
from fraud_pipeline import hybrid_risk_score  # noqa: E402
from fraud_pipeline import update_runtime_profile  # noqa: E402


ARTIFACT_PATHS = default_training_paths(ROOT_DIR)

app = FastAPI(
    title="Digital Trust Fraud Shield API",
    description="Low-latency fraud scoring engine with behavioral profiling and contextual risk signals.",
    version="2.0.0",
)


class TransactionPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")

    user_id: str = Field(..., min_length=1)
    amount: float = Field(..., ge=0)
    timestamp: str | None = None
    location: str | None = None
    device_id: str | None = None
    device_type: str | None = "mobile"
    transaction_type: str | None = "transfer"
    ip_risk_score: float | None = Field(default=None, ge=0, le=100)
    device_trust_score: float | None = Field(default=None, ge=0, le=100)
    user_avg_amount: float | None = Field(default=None, ge=0)
    transactions_last_10min: int | None = Field(default=None, ge=0)
    transactions_last_hour: int | None = Field(default=None, ge=0)
    account_age_days: int | None = Field(default=None, ge=0)
    transactions_last_day: int | None = Field(default=None, ge=0)
    amount_sum_last_hour: float | None = Field(default=None, ge=0)
    amount_sum_last_day: float | None = Field(default=None, ge=0)
    geo_distance_km: float | None = Field(default=0.0, ge=0)
    previous_geo_distance_km: float | None = Field(default=0.0, ge=0)
    email_domain: str | None = None
    recipient_email_domain: str | None = None
    browser: str | None = None
    operating_system: str | None = None
    payment_method: str | None = None
    known_device_count: int | None = Field(default=None, ge=0)
    known_location_count: int | None = Field(default=None, ge=0)
    profile_max_amount: float | None = Field(default=None, ge=0)
    activity_count_sum: float | None = Field(default=None, ge=0)
    activity_count_mean: float | None = Field(default=None, ge=0)
    activity_count_max: float | None = Field(default=None, ge=0)
    activity_count_nonzero: float | None = Field(default=None, ge=0)
    recency_signal_mean: float | None = Field(default=None, ge=0)
    recency_signal_max: float | None = Field(default=None, ge=0)
    verification_match_count: float | None = Field(default=None, ge=0)
    verification_missing_count: float | None = Field(default=None, ge=0)
    identity_signal_mean: float | None = None
    identity_signal_std: float | None = Field(default=None, ge=0)
    identity_signal_missing_count: float | None = Field(default=None, ge=0)
    new_device_flag: int | None = Field(default=None, ge=0, le=1)
    location_change_flag: int | None = Field(default=None, ge=0, le=1)


MODEL: Any | None = None
FEATURE_NAMES: list[str] = []
MODEL_CONFIG: dict[str, Any] = {}
PROFILE_STORE: dict[str, Any] = {}
DEVICE_REGISTRY: defaultdict[str, set[str]] = defaultdict(set)
LOCATION_REGISTRY: defaultdict[str, set[str]] = defaultdict(set)


def load_artifacts() -> None:
    global MODEL
    global FEATURE_NAMES
    global MODEL_CONFIG

    if not ARTIFACT_PATHS["model"].exists():
        raise FileNotFoundError(
            f"Missing trained model artifact: {ARTIFACT_PATHS['model']}. "
            "Run `python src\\train_model.py --save-artifacts` first."
        )

    MODEL = joblib.load(ARTIFACT_PATHS["model"])
    FEATURE_NAMES = list(joblib.load(ARTIFACT_PATHS["features"]))
    MODEL_CONFIG = json.loads(ARTIFACT_PATHS["config"].read_text(encoding="ascii"))
    print("[OK] Fraud model bundle loaded.")


@app.on_event("startup")
def startup_event() -> None:
    try:
        load_artifacts()
    except Exception as exc:
        print(f"[ERROR] Failed to load fraud artifacts: {exc}")


@app.get("/")
def health_check() -> dict[str, Any]:
    return {
        "status": "Active" if MODEL is not None else "Artifacts Missing",
        "system": "Fraud Shield API",
        "model_version": MODEL_CONFIG.get("model_version", MODEL_VERSION),
        "thresholds": MODEL_CONFIG.get("decision_thresholds"),
    }


def decide(probability: float) -> str:
    thresholds = MODEL_CONFIG.get("decision_thresholds", {})
    flag_min = max(float(thresholds.get("flag_min", 0.35)), 0.25)
    block_min = max(float(thresholds.get("block_min", 0.75)), 0.75)

    if probability >= block_min:
        return "BLOCK"
    if probability >= flag_min:
        return "FLAG"
    return "APPROVE"


@app.post("/predict_fraud")
def predict_fraud(transaction: TransactionPayload) -> dict[str, Any]:
    if MODEL is None or not FEATURE_NAMES:
        raise HTTPException(
            status_code=503,
            detail="Model artifacts are not loaded. Train and save artifacts first.",
        )

    start = time.perf_counter()
    try:
        feature_row, telemetry = build_runtime_feature_row(
            payload=transaction,
            profiles=PROFILE_STORE,
            device_registry=DEVICE_REGISTRY,
            location_registry=LOCATION_REGISTRY,
        )
        inference_frame = feature_row_to_frame(feature_row, FEATURE_NAMES)
        model_probability = float(MODEL.predict_proba(inference_frame)[0][1])
        policy_state = hybrid_risk_score(model_probability, feature_row)
        probability = float(policy_state["hybrid_risk_score"])
        decision = decide(probability)
        reasons = build_reason_codes(feature_row)
        latency_ms = round((time.perf_counter() - start) * 1000, 2)

        if decision != "BLOCK":
            update_runtime_profile(
                telemetry=telemetry,
                amount=float(transaction.amount),
                profiles=PROFILE_STORE,
                device_registry=DEVICE_REGISTRY,
                location_registry=LOCATION_REGISTRY,
            )

        return {
            "risk_score": round(probability, 4),
            "model_score": round(model_probability, 4),
            "policy_score": round(float(policy_state["policy_risk"]), 4),
            "decision": decision,
            "reasons": reasons,
            "reason": reasons[0] if reasons else "No strong fraud indicators exceeded the decision threshold.",
            "policy_triggers": policy_state["triggers"],
            "latency_ms": latency_ms,
            "model_version": MODEL_CONFIG.get("model_version", MODEL_VERSION),
            "features_used": FEATURE_NAMES,
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
