import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Verify OTP
    const result = await verifyOTP(email, otp);

    if (!result.isValid) {
      return NextResponse.json({ error: result.message }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: result.message,
        verified: true,
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
