import { NextResponse } from 'next/server';

const FRAUD_API_URL=process.env.FRAUD_API_URL||'http://127.0.0.1:8000';

export async function GET() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${FRAUD_API_URL}/`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(id);

    if (!response.ok) {
      return NextResponse.json({
        active: false,
        checkedUrl: `${FRAUD_API_URL}/`,
        status: response.status,
      });
    }

    const data = await response.json().catch(() => null);

    return NextResponse.json({
      active: true,
      checkedUrl: `${FRAUD_API_URL}/`,
      upstream: data,
    });
  } catch (err: any) {
    return NextResponse.json({
      active: false,
      checkedUrl: `${FRAUD_API_URL}/`,
      error: err?.message || 'Unknown error',
    });
  }
}