import { NextResponse } from 'next/server';

const FRAUD_API_URL =
  process.env.FRAUD_API_URL || 'http://127.0.0.1:8000';

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
  if (score >= 35) return 'BLOCK';
  if (score >= 20) return 'FLAG';
  return 'APPROVE';
};

const edgeFallback = (payload: any) => {
  const {
    amount = 0,
    location = '',
    device_id = '',
    transaction_type = 'TRANSFER',
    account_type = 'MAIN',
    timestamp = new Date().toISOString(),
    phishing_flag = false,
  } = payload;

  let score = 8;
  const reasons: string[] = [];

  if (amount > 500) {
    score += 22;
    reasons.push('Amount is higher than typical daily spend.');
  }
  if (amount > 2000) {
    score += 20;
    reasons.push('Large cash-out request.');
  }
  if (/emulator|unknown|new/i.test(device_id)) {
    score += 18;
    reasons.push('New or emulated device detected.');
  }
  if (/cross-border|overseas|international/i.test(location)) {
    score += 14;
    reasons.push('Cross-border location for wallet.');
  }
  const hour = new Date(timestamp).getHours();
  if (hour < 6 || hour > 23) {
    score += 10;
    reasons.push('Unusual late-night transaction time.');
  }
  if (transaction_type === 'VAULT_WITHDRAWAL' || account_type === 'VAULT') {
    score += 12;
    reasons.push('Vault withdrawal gets stricter policy.');
  }
  if (phishing_flag) {
    score += 20;
    reasons.push('Recent phishing content detected.');
  }

  const normalizedScore = Math.min(100, Math.round(score));
  let decision: FraudDecision = 'APPROVE';
  if (normalizedScore >= 65) decision = 'BLOCK';
  else if (normalizedScore >= 40) decision = 'FLAG';

  return {
    risk_score: normalizedScore,
    decision,
    reason: reasons.join(' ') || 'Edge model heuristic applied due to offline mode.',
    confidence: Math.max(75, 100 - normalizedScore / 2),
    model_version: 'edge-fallback-v1',
    edge_fallback_used: true,
  };
};

async function generateAgentReport(payload: any, normalizedScore: number): Promise<AgentReport> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      summary: `Agent fallback: Blocked transfer of ${payload.amount} ${payload.currency || ''}. Reason: ${payload.device_id || 'Unknown device'} linked to multiple accounts recently.`,
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
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
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

    return { summary: text, model: 'gemini-pro', used_fallback: false };
  } catch (err) {
    return {
      summary: `Agent fallback: Blocked ${payload.amount} transfer. Device ${payload.device_id || 'unknown'} reused by multiple accounts in last hour. Keep Vault locked.`,
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

    let finalReason =
      modelResult.reason ||
      (edgeFallbackUsed ? 'Edge model heuristic applied due to offline mode.' : 'Model returned no explanation.');

    if (payload.phishing_flag) {
      finalReason = `${finalReason} Recent suspicious message detected: "${payload.phishing_text || 'phishing link'}".`;
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
          : Number(normalizedScore.toFixed(1)),
      decision: adjustedDecision,
      reason: finalReason,
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
