import nodemailer from 'nodemailer';
import { connectDB, OTPVerification } from './mongodb';

// Create Nodemailer transporter
function createTransporter() {
  // Using Gmail - you can use any email service
  // For production, use environment variables
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in database
export async function storeOTP(email: string, otp: string, expiresIn: number = 10) {
  try {
    await connectDB();

    // Delete existing OTP for this email
    await OTPVerification.deleteOne({ email: email.toLowerCase() });

    // Create new OTP record
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000); // Default 10 minutes

    await OTPVerification.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
      attempts: 0,
      isVerified: false,
    });

    return true;
  } catch (error) {
    console.error('[v0] Error storing OTP:', error);
    throw error;
  }
}

// Send OTP via email
export async function sendOTPEmail(
  email: string,
  otp: string,
  userName?: string
): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Influencer Hub Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to Influencer Hub!</h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Hi ${userName || 'there'},
            </p>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Your One-Time Password (OTP) for email verification is:
            </p>
            
            <div style="background-color: #6D28D9; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
              This OTP will expire in 10 minutes. Do not share this code with anyone.
            </p>
            
            <p style="color: #999; font-size: 14px; margin-bottom: 20px;">
              If you didn't request this OTP, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2024 Influencer Hub. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[v0] OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('[v0] Error sending OTP email:', error);
    throw error;
  }
}

// Verify OTP
export async function verifyOTP(email: string, otp: string): Promise<{ isValid: boolean; message: string }> {
  try {
    await connectDB();

    const otpRecord = await OTPVerification.findOne({ email: email.toLowerCase() });

    if (!otpRecord) {
      return { isValid: false, message: 'OTP not found or expired' };
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTPVerification.deleteOne({ email: email.toLowerCase() });
      return { isValid: false, message: 'OTP has expired' };
    }

    // Check attempts (max 5)
    if (otpRecord.attempts >= 5) {
      await OTPVerification.deleteOne({ email: email.toLowerCase() });
      return { isValid: false, message: 'Too many attempts. Please request a new OTP' };
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return { isValid: false, message: 'Invalid OTP. Please try again' };
    }

    // OTP is valid
    otpRecord.isVerified = true;
    await otpRecord.save();

    return { isValid: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('[v0] Error verifying OTP:', error);
    throw error;
  }
}

// Check if OTP is already verified
export async function isOTPVerified(email: string): Promise<boolean> {
  try {
    await connectDB();

    const otpRecord = await OTPVerification.findOne({
      email: email.toLowerCase(),
      isVerified: true,
    });

    return !!otpRecord;
  } catch (error) {
    console.error('[v0] Error checking OTP verification:', error);
    return false;
  }
}

// Clean up expired OTPs (run periodically)
export async function cleanupExpiredOTPs(): Promise<number> {
  try {
    await connectDB();

    const result = await OTPVerification.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    console.log(`[v0] Cleaned up ${result.deletedCount} expired OTPs`);
    return result.deletedCount;
  } catch (error) {
    console.error('[v0] Error cleaning up expired OTPs:', error);
    throw error;
  }
}

// Resend OTP
export async function resendOTP(email: string, userName?: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if previous OTP exists and is not expired
    await connectDB();
    
    const existingOTP = await OTPVerification.findOne({ email: email.toLowerCase() });
    
    // Calculate time difference (in seconds)
    const timeDiff = existingOTP 
      ? Math.floor((Date.now() - existingOTP.createdAt.getTime()) / 1000)
      : 0;

    // Allow resend only if 30 seconds have passed
    if (existingOTP && timeDiff < 30) {
      return {
        success: false,
        message: `Please wait ${30 - timeDiff} seconds before requesting a new OTP`,
      };
    }

    // Generate and send new OTP
    const newOTP = generateOTP();
    await storeOTP(email, newOTP);
    await sendOTPEmail(email, newOTP, userName);

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('[v0] Error resending OTP:', error);
    return { success: false, message: 'Failed to resend OTP' };
  }
}
