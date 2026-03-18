import pandas as pd
import numpy as np
import networkx as nx
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score, precision_score, recall_score
from imblearn.over_sampling import SMOTE
from lightgbm import LGBMClassifier
import joblib
import os

# ==========================================
# 1. Data Loading & Standardization
# ==========================================
def load_and_standardize_data():
    print("Loading combined dataset...")
    # Load the unified dataset we generated in the previous step
    file_path = "../data/processed/combined_transactions.csv"
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Cannot find {file_path}. Please run prepare_data.py first.")
        
    df = pd.read_csv(file_path)
    
    # --- Hackathon Context Simulation ---
    # If standardizing dropped user/device IDs, we simulate them here 
    # so the Graph Risk Engine and Behavioral Profiler still function.
    np.random.seed(42)
    if "user_id" not in df.columns:
        df["user_id"] = np.random.randint(1000, 5000, len(df)).astype(str)
        df["user_id"] = "U_" + df["user_id"]
        
    if "device_id" not in df.columns:
        df["device_id"] = np.random.randint(100, 500, len(df)).astype(str)
        df["device_id"] = "DEV_" + df["device_id"]

    # Simulating contextual security features [cite: 318]
    if "ip_risk_score" not in df.columns:
        df["ip_risk_score"] = np.random.randint(0, 100, len(df))
    if "device_trust_score" not in df.columns:
        df["device_trust_score"] = np.random.randint(0, 100, len(df))
        
    # Create a unique transaction ID if missing
    if "transaction_id" not in df.columns:
        df["transaction_id"] = df.index
        
    # Subsampling for faster hackathon iteration (remove for final deep training)
    df = df.sample(frac=0.2, random_state=42).reset_index(drop=True)
    return df

# ==========================================
# 2. Behavioral Feature Engineering
# ==========================================
def engineer_behavioral_features(df):
    print("Engineering behavioral features...")
    # Time of day features [cite: 269]
    df["hour"] = df["timestamp"] % 24
    df["is_night"] = df["hour"].isin([0, 1, 2, 3, 4]).astype(int)
    
    # Balance discrepancy (crucial for digital wallets)
    if "oldbalance" in df.columns and "newbalance" in df.columns:
        df["balance_diff"] = df["oldbalance"] - df["newbalance"]
    
    # User spending behavior baseline 
    df["user_avg_amount"] = df.groupby("user_id")["amount"].transform("mean")
    df["amount_deviation"] = np.where(df["user_avg_amount"] > 0, 
                                      df["amount"] / df["user_avg_amount"], 0)
    
    # Transaction velocity (transactions per user) [cite: 267]
    df["tx_velocity"] = df.groupby("user_id")["transaction_id"].transform("count")
    
    # One-hot encode categorical transaction types (like CASH_IN, TRANSFER, card)
    if "transaction_type" in df.columns:
        df = pd.get_dummies(df, columns=["transaction_type"], drop_first=True)
    
    return df

# ==========================================
# 3. Graph Fraud Detection (NetworkX)
# ==========================================
def engineer_graph_features(df):
    print("Building Graph Network...")
    G = nx.Graph()
    
    # Build edges between users and devices [cite: 401]
    edges = list(zip(df["user_id"], df["device_id"]))
    G.add_edges_from(edges)
    
    # Calculate degree (detects multiple users sharing one device) [cite: 402]
    print("Extracting Graph Features...")
    df["device_degree"] = df["device_id"].apply(lambda x: G.degree(x) if x in G else 0)
    df["user_degree"] = df["user_id"].apply(lambda x: G.degree(x) if x in G else 0)
    
    return df

# ==========================================
# 4. Preprocessing & Model Training
# ==========================================
def train_fraud_model(df):
    print("Preparing data for training...")
    
    # Drop identifiers and strings before feeding into the ML model
    features_to_drop = ["transaction_id", "user_id", "device_id", "is_fraud"]
    
    # Ensure we only drop columns that actually exist
    cols_to_drop = [c for c in features_to_drop if c in df.columns]
    X = df.drop(columns=cols_to_drop)
    y = df["is_fraud"]
    
    # Scale numeric features [cite: 298]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
    
    # Train/Test Split, stratifying by fraud label [cite: 299]
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, stratify=y, random_state=42
    )
    
    # Handle Imbalanced Data using SMOTE [cite: 383]
    print("Applying SMOTE to balance classes...")
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
    
    # Train LightGBM Model [cite: 394]
    print("Training LightGBM Model...")
    model = LGBMClassifier(
        n_estimators=500,
        learning_rate=0.03,
        max_depth=8,
        num_leaves=50,
        random_state=42
    )
    
    model.fit(X_train_res, y_train_res)
    
    # Evaluation [cite: 304]
    print("\n--- Model Evaluation ---")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")
    print(f"Precision: {precision_score(y_test, y_pred):.4f}")
    print(f"Recall: {recall_score(y_test, y_pred):.4f}")
    
    return model, scaler, X.columns

# ==========================================
# 5. Save Artifacts
# ==========================================
def save_artifacts(model, scaler, feature_names):
    print("Saving model and artifacts...")
    os.makedirs("../models", exist_ok=True)
    
    joblib.dump(model, "../models/fraud_model.pkl")
    joblib.dump(scaler, "../models/scaler.pkl")
    joblib.dump(list(feature_names), "../models/feature_names.pkl")
    print("Pipeline complete. Artifacts saved in /models directory.")

# ==========================================
# Main Execution
# ==========================================
if __name__ == "__main__":
    df = load_and_standardize_data()
    df = engineer_behavioral_features(df)
    df = engineer_graph_features(df)
    model, scaler, feature_names = train_fraud_model(df)
    save_artifacts(model, scaler, feature_names)