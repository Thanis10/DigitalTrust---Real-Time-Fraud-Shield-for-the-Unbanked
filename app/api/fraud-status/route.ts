import { NextResponse } from 'next/server';

const RAW_FRAUD_API_URL = process.env.FRAUD_API_URL || 'http://127.0.0.1:8000';
const FRAUD_API_URL = RAW_FRAUD_API_URL.trim().replace(/\/+$/, '');

export async function GET() {
  const healthUrl = `${FRAUD_API_URL}/`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(healthUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({
        active: false,
        rawEnv: RAW_FRAUD_API_URL,
        normalizedBaseUrl: FRAUD_API_URL,
        checkedUrl: healthUrl,
        status: response.status,
        reason: `Health check returned ${response.status}`,
      });
    }

    const data = await response.json().catch(() => null);

    return NextResponse.json({
      active: true,
      rawEnv: RAW_FRAUD_API_URL,
      normalizedBaseUrl: FRAUD_API_URL,
      checkedUrl: healthUrl,
      upstream: data,
    });
  } catch (err: any) {
    return NextResponse.json({
      active: false,
      rawEnv: RAW_FRAUD_API_URL,
      normalizedBaseUrl: FRAUD_API_URL,
      checkedUrl: healthUrl,
      error: err?.name === 'AbortError' ? 'Request timed out' : err?.message || 'Unknown error',
    });
  }
}