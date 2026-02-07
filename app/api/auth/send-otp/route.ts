import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP, sendOTPEmail, resendOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email, userName, isResend } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (isResend) {
      const result = await resendOTP(email, userName);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 429 });
      }
      return NextResponse.json({
        message: result.message,
        email,
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database
    await storeOTP(email, otp);

    // Send OTP via email
    await sendOTPEmail(email, otp, userName);

    return NextResponse.json(
      {
        message: 'OTP sent successfully',
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please check your email configuration.' },
      { status: 500 }
    );
  }
}
