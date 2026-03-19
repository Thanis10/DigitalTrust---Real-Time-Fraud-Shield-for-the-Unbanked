import { NextResponse } from 'next/server';

const FRAUD_API_URL = process.env.FRAUD_API_URL || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${FRAUD_API_URL}/`, { 
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(id);

    if (response.ok) {
      return NextResponse.json({ active: true });
    }
    return NextResponse.json({ active: false });
  } catch (err) {
    return NextResponse.json({ active: false });
  }
}
