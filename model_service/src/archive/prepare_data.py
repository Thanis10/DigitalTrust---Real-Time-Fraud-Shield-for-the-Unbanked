import pandas as pd
import numpy as np
import os
import glob

def prepare_combined_dataset():
    print("Loading raw datasets...")
    # Load PaySim and Credit Card
    paysim = pd.read_csv("../data/paysim/PS_20174392719_1491204439457_log.csv")
    credit = pd.read_csv("../data/creditcard/creditcard.csv")
    
    # Load AML dynamically (finds whatever CSV is in the aml folder)
    aml_files = glob.glob("../data/aml/*.csv")
    if aml_files:
        print(f"Found AML dataset: {aml_files[0]}")
        aml = pd.read_csv(aml_files[0])
    else:
        print("No AML dataset found in ../data/aml/. Make sure it's extracted!")
        aml = pd.DataFrame()

    print("Standardizing schemas...")
    
    # 1. Map PaySim Schema
    paysim_df = pd.DataFrame()
    paysim_df["amount"] = paysim["amount"]
    paysim_df["oldbalance"] = paysim["oldbalanceOrg"]
    paysim_df["newbalance"] = paysim["newbalanceOrig"]
    paysim_df["transaction_type"] = paysim["type"]
    paysim_df["timestamp"] = paysim["step"]
    paysim_df["is_fraud"] = paysim["isFraud"]

    # 2. Map Credit Card Schema
    credit_df = pd.DataFrame()
    credit_df["amount"] = credit["Amount"]
    credit_df["timestamp"] = credit["Time"]
    credit_df["oldbalance"] = np.nan
    credit_df["newbalance"] = np.nan
    credit_df["transaction_type"] = "card"
    credit_df["is_fraud"] = credit["Class"]

    # 3. Map AML Schema
    aml_df = pd.DataFrame()
    if not aml.empty:
        # Handling the common column names found in the Kaggle AML dataset
        aml_df["amount"] = aml.get("Amount", aml.get("amount", np.nan))
        aml_df["timestamp"] = aml.get("Timestamp", aml.get("timestamp", np.nan))
        aml_df["oldbalance"] = np.nan
        aml_df["newbalance"] = np.nan
        aml_df["transaction_type"] = "aml_transfer"
        
        # The fraud label in the AML dataset is usually 'Is Laundering'
        if "Is Laundering" in aml.columns:
            aml_df["is_fraud"] = aml["Is Laundering"]
        elif "is_fraud" in aml.columns:
            aml_df["is_fraud"] = aml["is_fraud"]
        else:
            aml_df["is_fraud"] = 0

    print("Combining datasets...")
    # Combine all mapped datasets into one master DataFrame
    combined = pd.concat([paysim_df, credit_df, aml_df], ignore_index=True)

    print("Cleaning data...")
    # Clean up the combined dataset
    combined = combined.drop_duplicates()
    
    # Fill missing amounts with median, and missing timestamps with 0
    combined["amount"] = combined["amount"].fillna(combined["amount"].median())
    combined["timestamp"] = combined["timestamp"].fillna(0)
    
    # Fill missing balances with 0 
    combined["oldbalance"] = combined["oldbalance"].fillna(0)
    combined["newbalance"] = combined["newbalance"].fillna(0)

    # Save the processed master dataset
    os.makedirs("../data/processed", exist_ok=True)
    save_path = "../data/processed/combined_transactions.csv"
    combined.to_csv(save_path, index=False)
    
    print(f"Success! Master dataset saved to: {save_path}")
    print(f"Total Transactions: {len(combined)}")
    print(f"Total Fraud Cases: {combined['is_fraud'].sum()}")

if __name__ == "__main__":
    prepare_combined_dataset()