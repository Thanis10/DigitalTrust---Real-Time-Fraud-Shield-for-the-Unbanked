import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, amount, location, device_id } = body;

    // Simulate AI evaluation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Basic heuristic simulation for the API
    let risk_score = 10;
    let decision: 'APPROVE' | 'FLAG' | 'BLOCK' = 'APPROVE';
    let reason = '';

    if (amount > 10000) {
      risk_score += 40;
      reason += 'High amount. ';
    }
    if (location === 'London (VPN)' || location === 'Moscow' || location === 'Lagos') {
      risk_score += 45;
      reason += 'Suspicious location. ';
    }
    if (device_id === 'Unknown Device' || device_id === 'Android Emulator') {
      risk_score += 30;
      reason += 'High-risk device. ';
    }

    if (risk_score >= 80) {
      decision = 'BLOCK';
      if (!reason) reason = 'Anomaly pattern detected by AI model.';
    } else if (risk_score >= 50) {
      decision = 'FLAG';
      if (!reason) reason = 'Unusual activity detected.';
    } else {
      reason = 'Transaction looks normal.';
    }

    // Add some random noise to make it feel organic
    risk_score += Math.floor(Math.random() * 10);
    risk_score = Math.min(100, risk_score);

    return NextResponse.json({
      risk_score,
      decision,
      reason: reason.trim()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
