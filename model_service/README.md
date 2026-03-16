# 🛡️ Digital Trust: Real-Time Fraud Shield for the Unbanked

**Varsity Hackathon (V HACK) 2026 Submission** ## 📌 Project Concept
[cite_start]Across Southeast Asia, millions of unbanked individuals rely on Super Apps and digital wallets[cite: 91]. [cite_start]If fraud occurs, they risk losing their entire financial safety net[cite: 92]. [cite_start]"Digital Trust" is an AI-powered real-time fraud detection engine that analyzes transaction behavior and assigns a risk score before approving a payment[cite: 95].

## 🧠 AI Innovation & Architecture
[cite_start]Our hybrid intelligence system scores transactions in milliseconds [cite: 101] using:
1. **Behavioral Profiling Engine:** Learns baseline transaction habits for individual users.
2. **Graph Risk Engine (`NetworkX`):** Detects suspicious device-sharing and fraud rings.
3. [cite_start]**Machine Learning Classifier (`LightGBM`):** Trained using SMOTE on highly imbalanced financial datasets[cite: 104, 105].

## ⚙️ Tech Stack
* [cite_start]**AI/ML:** Python, Scikit-learn, LightGBM, NetworkX, Imbalanced-learn [cite: 106, 107]
* [cite_start]**Backend API:** FastAPI, Uvicorn (Sub-100ms latency inference) [cite: 106]
* **Frontend Demo:** Streamlit (Real-time analyst dashboard)

## 🚀 How to Run the Project locally
1. Clone the repository.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the FastAPI Risk Engine:
   ```bash
   cd api
   uvicorn main:app --reload
4. Start the Streamlit Dashboard (in a new terminal):
    streamlit run dashboard/app.py
