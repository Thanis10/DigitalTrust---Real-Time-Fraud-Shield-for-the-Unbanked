import { NextResponse } from 'next/server';

const RAW_FRAUD_API_URL = process.env.FRAUD_API_URL || 'http://127.0.0.1:8000';
const FRAUD_API_URL = RAW_FRAUD_API_URL.trim().replace(/\/+$/, '');

type FraudDecision = 'APPROVE' | 'FLAG' | 'BLOCK';
type AccountType = 'MAIN' | 'VAULT';
type AgentReport = { summary: string; model?: string; used_fallback?: boolean };

const buildUserMessage = (decision: FraudDecision, account: AccountType, reason?: string) => {
  if (decision === 'APPROVE') {
    return account === 'VAULT'
      ? 'Vault release cleared by AI shield. Funds stay protected until confirmation is shown.'
      : 'All good! Your transfer matches your usual pattern.';
  }
  if (decision === 'FLAG') {
    return 'Hold on! Shield is checking. This transfer looks a little unusual for you. To keep your daily earnings safe, please verify it is really you.';
  }
  return 'Your Secure Vault is locked to protect today\'s wages. Please verify to continue.';
};

const applyVaultPolicy = (score: number, baseDecision: FraudDecision, account: AccountType): FraudDecision => {
  if (account !== 'VAULT') return baseDecision;
  // Vault uses stricter thresholds (~50% of model thresholds) to protect daily wages.
  // Model trained: flag=50, block=80 → vault: flag=25, block=40
  if (score >= 40) return 'BLOCK';
  if (score >= 25) return 'FLAG';
  return 'APPROVE';
};

function edgeFallback(payload: any) {
  let risk = 8;
  const signals: string[] = [];

  if (payload.amount >= 3000) {
    risk += 25;
    signals.push('high amount');
  }

  if (payload.account_type === 'VAULT') {
    risk += 20;
    signals.push('vault withdrawal');
  }

  if (payload.phishing_flag) {
    risk += 30;
    signals.push('recent suspicious message');
  }

  const decision =
    risk >= 70 ? 'BLOCK' :
    risk >= 40 ? 'FLAG' :
    'APPROVE';

  const activityLabel =
    decision === 'APPROVE'
      ? `Transfer to ${payload.recipient || 'recipient'}`
      : decision === 'FLAG'
      ? `Transfer to ${payload.recipient || 'recipient'} flagged`
      : `Transfer to ${payload.recipient || 'recipient'} blocked`;

  const reason =
    decision === 'APPROVE'
      ? payload.phishing_flag
        ? 'Transfer approved, but recent suspicious activity was detected and reviewed.'
        : 'Transfer approved. No strong fraud indicators were detected.'
      : decision === 'FLAG'
      ? 'This transfer looks unusual, so extra verification is required before proceeding.'
      : 'This transfer was blocked because the risk level was too high.';

  const agentReport =
    decision === 'BLOCK'
      ? `Fallback review: blocked ${payload.amount} ${payload.currency || ''} transfer to ${payload.recipient || 'recipient'} due to elevated risk signals${signals.length ? ` (${signals.join(', ')})` : ''}.`
      : null;

  return {
    risk_score: Math.min(risk, 99),
    decision,
    confidence: 0.72,
    reason,
    activity_label: activityLabel,
    edge_fallback_used: true,
    vault_locked: decision === 'BLOCK' && payload.account_type === 'VAULT',
    verification: {
      method: decision === 'FLAG' ? 'biometric' : 'none',
    },
    user_message:
      decision === 'APPROVE'
        ? 'Transaction approved.'
        : decision === 'FLAG'
        ? 'We noticed unusual activity and need verification.'
        : 'This transaction was blocked to protect your wallet.',
    agent_report: agentReport,
  };
}

async function generateAgentReport(payload: any, normalizedScore: number): Promise<AgentReport> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      summary: `Risk review: blocked ${payload.amount} ${payload.currency || ''} transfer to ${payload.recipient || 'recipient'}${payload.account_type === 'VAULT' ? ' from Vault balance' : ''}${payload.phishing_flag ? ' after suspicious message activity was detected' : ''}. Recommended next step: verify identity before retrying.`,
      used_fallback: true,
    };
  }

  const prompt = `
You are a fraud investigator. Write a concise case report (<=80 words) for a dashboard.
Include: amount, device, user_id, recipient, location, reason tied to fraud-ring behavior, and a suggested next step.
Payload: ${JSON.stringify(payload)} | Risk score: ${normalizedScore}
If phishing_flag is true, connect it to the decision.
Return only the report sentence(s), no formatting.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }],
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error('Empty response');

    return { summary: text, model: 'gemini-1.5-flash', used_fallback: false };
  } catch (err) {
    return {
      summary: `Risk review: blocked ${payload.amount} ${payload.currency || ''} transfer to ${payload.recipient || 'recipient'} due to elevated risk signals. Recommended next step: verify identity and review recent account activity.`,
      used_fallback: true,
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      user_id,
      amount,
      location,
      device_id,
      recipient,
      transaction_type = 'TRANSFER',
      currency = 'USD',
      timestamp = new Date().toISOString(),
      oldbalance,
      newbalance,
      account_type = 'MAIN',
      phishing_flag = false,
      phishing_text,
    } = body;

    const accountType = (account_type as string || 'MAIN').toUpperCase() === 'VAULT' ? 'VAULT' : 'MAIN';

    const payload = {
      user_id,
      recipient,
      amount: Number(amount),
      location,
      device_id,
      transaction_type,
      account_type: accountType,
      currency,
      timestamp,
      oldbalance: Number(oldbalance ?? 0),
      newbalance: Number(newbalance ?? 0),
      phishing_flag: Boolean(phishing_flag),
      phishing_text,
    };

    let modelResult: any;
    let edgeFallbackUsed = false;

    try {
      const response = await fetch(`${FRAUD_API_URL}/predict_fraud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text() || response.statusText);
      }

      modelResult = await response.json();
    } catch (err) {
      modelResult = edgeFallback(payload);
      edgeFallbackUsed = true;
    }

    const rawScore: number = typeof modelResult.risk_score === 'number' ? modelResult.risk_score : 0;
    let normalizedScore = Math.max(0, Math.min(100, Math.round(rawScore <= 1 ? rawScore * 100 : rawScore)));

    if (payload.phishing_flag) {
      normalizedScore = Math.min(100, normalizedScore + 20);
    }

    const adjustedDecision = applyVaultPolicy(
      normalizedScore,
      ((modelResult.decision || 'FLAG') as string).toUpperCase() as FraudDecision,
      accountType,
    );

    const activityLabel =
      adjustedDecision === 'APPROVE'
        ? `Transfer to ${recipient || 'recipient'}`
        : adjustedDecision === 'FLAG'
        ? `Transfer to ${recipient || 'recipient'} flagged`
        : `Transfer to ${recipient || 'recipient'} blocked`;

    let finalReason = '';

    if (adjustedDecision === 'APPROVE') {
      finalReason = payload.phishing_flag
        ? 'Transfer approved, but recent suspicious activity was detected and reviewed.'
        : 'Transfer approved. No strong fraud indicators were detected.';
    } else if (adjustedDecision === 'FLAG') {
      finalReason = payload.phishing_flag
        ? 'This transfer appears unusual and may be linked to a suspicious message, so verification is required.'
        : 'This transfer appears unusual, so verification is required.';
    } else {
      finalReason = payload.phishing_flag
        ? 'This transfer was blocked because the risk level was high and suspicious message activity was detected.'
        : 'This transfer was blocked because the risk level was too high.';
    }

    const user_message = buildUserMessage(adjustedDecision, accountType, finalReason);

    const verification =
      adjustedDecision === 'APPROVE'
        ? { method: 'none', alt: null }
        : { method: 'biometric', alt: 'whatsapp_otp' };

    let agentReport: AgentReport | null = null;
    if (adjustedDecision === 'BLOCK') {
      agentReport = await generateAgentReport(payload, normalizedScore);
    }

    return NextResponse.json({
      risk_score: normalizedScore,
      confidence:
        typeof modelResult.confidence === 'number'
          ? Number(modelResult.confidence)
          : Math.round(Math.max(Math.abs(normalizedScore - 50) * 2, 55)),
      decision: adjustedDecision,
      reason: finalReason,
      activity_label: activityLabel,
      model_version: modelResult.model_version || (edgeFallbackUsed ? 'edge-fallback-v1' : undefined),
      timestamp: modelResult.timestamp || timestamp,
      channel: accountType,
      user_message,
      verification,
      vault_locked: adjustedDecision !== 'APPROVE' && accountType === 'VAULT',
      edge_fallback_used: edgeFallbackUsed || modelResult.edge_fallback_used || false,
      agent_report: agentReport?.summary,
      agent_model: agentReport?.model,
      upstream_raw: modelResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', detail: error?.message },
      { status: 500 },
    );
  }
}
