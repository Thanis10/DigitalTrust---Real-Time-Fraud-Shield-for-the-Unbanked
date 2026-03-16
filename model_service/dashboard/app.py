from datetime import datetime

import requests
import streamlit as st


st.set_page_config(page_title="Digital Trust Fraud Shield", layout="wide", page_icon="shield")

API_URL = "http://127.0.0.1:8000/predict_fraud"

st.title("Digital Trust: Real-Time Fraud Shield")
st.markdown("Behavioral profiling, contextual risk signals, and low-latency fraud decisions.")

left, right = st.columns([1, 1.5])

with left:
    st.header("Simulate Wallet Transaction")
    user_id = st.text_input("User ID", value="USR-8821")
    amount = st.number_input("Amount (RM)", value=250.0, min_value=0.0, step=10.0)
    user_avg_amount = st.number_input("Historical Avg Amount (RM)", value=120.0, min_value=0.0, step=5.0)
    transaction_type = st.selectbox("Transaction Type", ["transfer", "payment", "cash_out", "purchase", "debit"])
    device_type = st.selectbox("Device Type", ["mobile", "desktop", "tablet", "unknown"])
    location = st.text_input("Location", value="Kuala Lumpur")
    device_id = st.text_input("Device ID", value="iphone-15-pro")

    col_a, col_b = st.columns(2)
    with col_a:
        ip_risk = st.slider("IP Risk Score", 0, 100, 18)
        velocity = st.slider("Transactions Last Hour", 0, 20, 1)
        geo_distance = st.slider("Distance From Last Location (km)", 0, 3000, 10)
    with col_b:
        device_trust = st.slider("Device Trust Score", 0, 100, 88)
        account_age_days = st.slider("Account Age (days)", 0, 3650, 420)
        new_device_flag = st.toggle("New Device", value=False)

    location_change_flag = st.toggle("New Location", value=False)
    email_domain = st.text_input("User Email Domain", value="gmail.com")
    recipient_email_domain = st.text_input("Recipient Email Domain", value="gmail.com")

    if st.button("Score Transaction", type="primary"):
        payload = {
            "user_id": user_id,
            "amount": amount,
            "timestamp": datetime.utcnow().isoformat(),
            "location": location,
            "device_id": device_id,
            "device_type": device_type,
            "transaction_type": transaction_type,
            "ip_risk_score": ip_risk,
            "device_trust_score": device_trust,
            "user_avg_amount": user_avg_amount,
            "transactions_last_hour": velocity,
            "account_age_days": account_age_days,
            "geo_distance_km": geo_distance,
            "previous_geo_distance_km": geo_distance / 2,
            "email_domain": email_domain,
            "recipient_email_domain": recipient_email_domain,
            "new_device_flag": int(new_device_flag),
            "location_change_flag": int(location_change_flag),
        }
        try:
            with st.spinner("Analyzing fraud risk..."):
                response = requests.post(API_URL, json=payload, timeout=10)
                response.raise_for_status()
                st.session_state["latest_payload"] = payload
                st.session_state["latest_result"] = response.json()
        except requests.exceptions.ConnectionError:
            st.error("Cannot connect to the API. Start FastAPI on port 8000 first.")
        except requests.exceptions.HTTPError as exc:
            st.error(f"API returned an error: {exc.response.text}")

with right:
    st.header("Risk Decision")
    if "latest_result" not in st.session_state:
        st.info("Submit a transaction to see the fraud decision.")
    else:
        result = st.session_state["latest_result"]
        metric_col1, metric_col2, metric_col3 = st.columns(3)
        metric_col1.metric("Risk Score", f"{result['risk_score']:.4f}")
        metric_col2.metric("Decision", result["decision"])
        metric_col3.metric("Latency", f"{result['latency_ms']} ms")

        st.subheader("Top Reasons")
        for reason in result.get("reasons") or [result.get("reason", "No explanation available.")]:
            st.write(f"- {reason}")

        st.subheader("Payload Sent")
        st.json(st.session_state["latest_payload"])

        st.subheader("API Response")
        st.json(result)
