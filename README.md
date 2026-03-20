Here is a **clean, judge-ready, professional README** rewritten to sound stronger, more technical, and more hackathon-polished while keeping all your content.
(I improved wording, flow, formatting, and impact, but did not change your features.)

---

# DigitalTrust — Real-Time Fraud Shield for the Unbanked

**Hackathon Submission — Real-Time Fraud Protection with Explainable AI**

DigitalTrust is a demo digital wallet combined with a real-time fraud detection engine designed to protect gig workers, small vendors, and unbanked users from financial scams.
The system integrates a **Next.js mobile-first wallet UI**, a **FastAPI + LightGBM risk scoring backend**, and an **LLM-powered agentic investigator** that generates human-readable fraud reports.

The goal is simple:

> Protect daily income with strict, explainable, and reliable fraud controls — even when offline.

---

## TL;DR

* **Problem**
  Low-literacy users and gig workers are highly vulnerable to scams and phishing, and most fraud tools are too complex.

* **Solution**
  A wallet that enforces:

  * Daily Wage Vault protection
  * Pre-transaction phishing detection
  * Offline fraud scoring fallback
  * Agentic AI fraud investigation reports

Run the demo locally, open

```
http://localhost:3000
```

and follow the demo steps below.

---

## Why this matters (For Judges)

* Protects daily wages using stricter Vault rules
* Shows clear reasons for fraud decisions (Explainable AI)
* Works even if backend/model is offline
* Generates AI case reports for auditors
* Designed for low-literacy / unbanked users

This is not just fraud detection —
it is **fraud prevention + trust UX + human review automation**.

---

## Key Features (Judge-Facing)

### Daily Wage Vault

* Separate secure vault for daily income
* Stricter risk thresholds
* Auto-lock on suspicious activity
* Guided unlock flow

### Real-Time Fraud Scoring

* FastAPI backend
* LightGBM model
* Returns:

  * SAFE
  * FLAG
  * BLOCK
  * Explanation tokens

### Agentic AI Investigator

* Gemini LLM generates case reports
* Triggered only on BLOCK events
* Produces human-readable audit summary

### Multilingual Voice-to-Transfer

Supports Malay / Indonesian phrases

Example:

```
Tolong hantar lima puluh ringgit kat Ali
```

Auto-parses to:

```
{
  amount: 50,
  receiver: "Ali"
}
```

### Pre-Transaction Phishing Shield

Uses recent message signals to increase risk score.

### Edge / Offline Safe Mode

If API fails:

* Heuristic fraud scorer runs locally
* UI shows Safe Mode badge

### Panic-Free UX

* Large buttons
* Calm messaging
* Trust badges
* Shield Coach guidance

---

## Architecture (High Level)

<img width="4817" height="1158" alt="image" src="https://github.com/user-attachments/assets/40b4bcab-a923-48ba-8bd6-01ccb846c196" />


Important files:

```
fraud-detection-project/api/main.py
app/api/risk-score/route.ts
components/wallet/SendMoneyModal.tsx
components/wallet/RiskResultModal.tsx
```

---

## Tech Stack

Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* Zustand

Backend

* FastAPI
* LightGBM

AI / Agent

* Gemini LLM

Tools

* Node.js
* Python
* npm
* uvicorn

---

## Quickstart (For Judges)

### Requirements

* Node >= 16
* Python >= 3.10
* npm
* pip

Windows users can use PowerShell or cmd.

---

### 1. Install frontend

```bash
npm install
```

---

### 2. Environment

Create `.env.local`

```
FRAUD_API_URL=http://localhost:8000
GEMINI_API_KEY=your_key_here
```

---

### 3. Start backend

Go to:

```
fraud-detection-project/api
```

Run:

```bash
uvicorn main:app --reload --port 8000
```

---

### 4. Start frontend

From root:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

### Optional (Windows)

Use:

```
run.bat
```

to start everything.

---

## Demo Scripts (For Judges)

### 1. Voice-to-Transfer

Say:

```
Tolong hantar lima puluh ringgit kat Ali
```

Expected:

* Amount detected
* Receiver detected
* JSON preview
* Fraud scoring triggered

---

### 2. Phishing Shield + Vault Lock

In console:

```js
localStorage.setItem(
  'recent_msg_text',
  'Your parcel stuck pay RM5 now'
)
```

Try Vault withdrawal.

Expected:

* Risk increased
* Possible BLOCK
* Vault locked

---

### 3. Agentic AI Report

Force high amount.

Expected:

* BLOCK decision
* AI case report appears

---

### 4. Offline Mode

Stop backend.

Try transfer.

Expected:

* Safe Mode badge
* Heuristic scoring

---

## Judging Checklist

* Real-time scoring works
* Risk modal shows reasons
* Voice NLP works
* Offline fallback works
* AI report generated

---

## Implementation Notes

* Models in:

```
fraud-detection-project/models
```

* Gemini called only for BLOCK

* Vault rules in:

```
app/api/risk-score/route.ts
```

---

## Performance Testing

Use browser Network tab.

Expected:

* FastAPI response < 100ms
* UI updates instantly

---

## License

MIT License — hackathon demo project.

Contributors listed in `package.json`.

---

## Demo Video

Watch here:

[https://drive.google.com/file/d/1IA_hq-3EUt7DUhPzXzmHYa0d7N4P0wLG/view](https://drive.google.com/file/d/1IA_hq-3EUt7DUhPzXzmHYa0d7N4P0wLG/view)

---

## Final Note

DigitalTrust focuses on:

* Protecting daily income
* Preventing scams before money moves
* Explaining every decision
* Working even without internet
* Helping auditors review cases faster

This makes it ideal for:

* Gig workers
* Rural vendors
* First-time digital wallet users
* Low-literacy communities
