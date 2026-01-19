import { NextRequest, NextResponse } from 'next/server';
import { keisanClient, KEISAN_URLS } from '@/lib/external/keisan-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, params } = body;

    if (!type || !KEISAN_URLS[type as keyof typeof KEISAN_URLS]) {
      return NextResponse.json(
        { error: 'Invalid calculation type' },
        { status: 400 }
      );
    }

    const result = await keisanClient.calculate(
      type as keyof typeof KEISAN_URLS,
      params
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Calculation API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
