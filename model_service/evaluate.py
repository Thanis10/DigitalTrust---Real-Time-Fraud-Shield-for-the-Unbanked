import copy
from datetime import datetime

import requests


BASE = "http://localhost:8000/predict_fraud"


def predict(payload, label=""):
    response = requests.post(BASE, json=payload, timeout=10)
    response.raise_for_status()
    data = response.json()
    score = data["risk_score"]
    decision = data["decision"]
    filled = int(score * 30)
    bar = "#" * filled + "." * (30 - filled)
    print(f"  [{bar}] {score:.4f} -> {decision:7s}  | {label}")
    for reason in data.get("reasons", [])[:2]:
        print(f"     - {reason}")
    return data


def section(title):
    print()
    print("=" * 70)
    print("  " + title)
    print("=" * 70)


BASELINE = {
    "user_id": "USR-8821",
    "amount": 250,
    "timestamp": datetime.utcnow().isoformat(),
    "location": "Kuala Lumpur",
    "device_id": "iphone-15-pro",
    "device_type": "mobile",
    "transaction_type": "transfer",
    "ip_risk_score": 12,
    "device_trust_score": 90,
    "user_avg_amount": 180,
    "transactions_last_hour": 1,
    "account_age_days": 420,
    "geo_distance_km": 5,
    "previous_geo_distance_km": 1,
    "email_domain": "gmail.com",
    "recipient_email_domain": "gmail.com",
    "new_device_flag": 0,
    "location_change_flag": 0,
}

FRAUD = {
    "user_id": "USR-8821",
    "amount": 48000,
    "timestamp": datetime.utcnow().isoformat(),
    "location": "Moscow",
    "device_id": "android-emulator",
    "device_type": "unknown",
    "transaction_type": "transfer",
    "ip_risk_score": 96,
    "device_trust_score": 5,
    "user_avg_amount": 180,
    "transactions_last_hour": 16,
    "account_age_days": 420,
    "geo_distance_km": 3200,
    "previous_geo_distance_km": 1800,
    "email_domain": "gmail.com",
    "recipient_email_domain": "proton.me",
    "new_device_flag": 1,
    "location_change_flag": 1,
}


section("LEVEL 1 - NORMAL TRANSACTIONS")
predict(BASELINE, "trusted device, normal amount")

n2 = copy.copy(BASELINE)
n2.update({"amount": 50, "user_avg_amount": 160})
predict(n2, "small payment")

n3 = copy.copy(BASELINE)
n3.update({"transaction_type": "purchase", "device_trust_score": 95, "ip_risk_score": 5})
predict(n3, "low-risk purchase")


section("LEVEL 2 - SUSPICIOUS BUT NOT DEFINITE")
s1 = copy.copy(BASELINE)
s1.update({"transactions_last_hour": 6, "ip_risk_score": 58})
predict(s1, "velocity spike")

s2 = copy.copy(BASELINE)
s2.update({"amount": 2200, "user_avg_amount": 180, "geo_distance_km": 400, "location_change_flag": 1})
predict(s2, "high deviation from normal spending")

s3 = copy.copy(BASELINE)
s3.update({"new_device_flag": 1, "device_trust_score": 35, "ip_risk_score": 48})
predict(s3, "new device with moderate risk")


section("LEVEL 3 - CLEAR FRAUD SIGNALS")
predict(FRAUD, "account drain from new device and remote location")

f2 = copy.copy(FRAUD)
f2.update({"amount": 9999, "transactions_last_hour": 22, "transaction_type": "cash_out"})
predict(f2, "cash-out burst with untrusted device")

f3 = copy.copy(FRAUD)
f3.update({"amount": 1, "transactions_last_hour": 40, "transaction_type": "purchase"})
predict(f3, "card testing pattern")


section("LEVEL 4 - THRESHOLD SENSITIVITY")
for value in [10, 30, 50, 70, 90]:
    payload = copy.copy(BASELINE)
    payload.update({"ip_risk_score": value})
    predict(payload, f"ip_risk_score={value}")

for value in [1, 3, 5, 10, 20]:
    payload = copy.copy(BASELINE)
    payload.update({"transactions_last_hour": value})
    predict(payload, f"transactions_last_hour={value}")

for value in [100, 300, 1000, 5000, 15000]:
    payload = copy.copy(BASELINE)
    payload.update({"amount": value})
    predict(payload, f"amount={value}")


print()
print("=" * 70)
print("  ALL TESTS COMPLETE")
print("=" * 70)
