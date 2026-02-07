# OTP Email Verification Setup Guide

This guide explains how to setup and use the OTP (One-Time Password) email verification system for the Influencer Hub platform.

## Overview

The OTP system provides secure email verification for new user signups. Users receive a 6-digit OTP via email, which they must verify before completing registration.

### Features

- ✅ 6-digit OTP generation
- ✅ Email delivery via Nodemailer
- ✅ 10-minute expiration time
- ✅ Resend OTP functionality (30-second rate limit)
- ✅ Maximum 5 verification attempts
- ✅ MongoDB persistence
- ✅ Beautiful email templates
- ✅ Real-time countdown timers
- ✅ Automatic cleanup of expired OTPs

## Setup Instructions

### 1. Install Dependencies

The required packages are already in `package.json`:
- `nodemailer`: ^6.9.7
- `otplib`: ^12.0.1

Run:
```bash
npm install
```

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Email Configuration (Gmail Example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# For other providers, adjust EMAIL_SERVICE accordingly
# Examples: 'outlook', 'yahoo', 'sendgrid', 'mailgun', etc.
```

### 3. Gmail Setup (If using Gmail)

1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password**:
   - Go to myaccount.google.com
   - Click "Security" in the left menu
   - Enable 2-Step Verification if not enabled
   - Search for "App passwords"
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated password
3. **Use the app password** as `EMAIL_PASSWORD` in `.env.local`

### 4. Alternative Email Providers

#### Outlook/Hotmail
```bash
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### SendGrid
```bash
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### Custom SMTP Server
Modify `lib/otp.ts` to use custom configuration:
```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## How It Works

### OTP Flow

1. **User Signup**
   - User fills signup form and clicks "Complete Signup"
   - System sends OTP to their email
   - OTP verification modal appears

2. **Email Verification**
   - User enters 6-digit OTP
   - System verifies OTP against database
   - Shows countdown timer (10 minutes)
   - Maximum 5 attempts allowed

3. **Account Creation**
   - After OTP verification, user account is created
   - User is logged in automatically
   - Redirected to dashboard

4. **Resend OTP**
   - User can resend OTP after 30 seconds
   - New OTP generated and sent
   - Timer resets to 10 minutes

### Database Schema

```javascript
OTPVerification {
  email: String (unique, indexed)
  otp: String (6 digits)
  expiresAt: Date (TTL index)
  attempts: Number (default: 0)
  isVerified: Boolean
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Send OTP

**POST** `/api/auth/send-otp`

Request:
```json
{
  "email": "user@example.com",
  "userName": "John Doe",
  "isResend": false
}
```

Response:
```json
{
  "message": "OTP sent successfully",
  "email": "user@example.com"
}
```

### Verify OTP

**POST** `/api/auth/verify-otp`

Request:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response (Success):
```json
{
  "message": "OTP verified successfully",
  "verified": true,
  "email": "user@example.com"
}
```

Response (Error):
```json
{
  "error": "Invalid OTP. Please try again"
}
```

## Components

### OTPVerification Component

Location: `components/auth/otp-verification.tsx`

Features:
- 6-digit OTP input with auto-focus
- Real-time countdown timer
- Resend OTP button with rate limiting
- Error messages
- Success state
- Auto-close after verification

Usage:
```tsx
<OTPVerification
  email="user@example.com"
  userName="John Doe"
  onVerified={(verified) => handleVerified(verified)}
  onClose={() => closeModal()}
/>
```

## Utility Functions

### `lib/otp.ts`

- `generateOTP()`: Generates random 6-digit OTP
- `storeOTP(email, otp, expiresIn)`: Saves OTP to database
- `sendOTPEmail(email, otp, userName)`: Sends email with OTP
- `verifyOTP(email, otp)`: Verifies OTP against database
- `isOTPVerified(email)`: Checks if email is already verified
- `resendOTP(email, userName)`: Handles OTP resend with rate limiting
- `cleanupExpiredOTPs()`: Removes expired OTPs

## Email Template

The OTP email includes:
- Professional header with brand colors
- User's name personalization
- Large, easy-to-read 6-digit OTP
- Expiration time warning
- Security notice
- Company branding

HTML email template with proper styling and responsive design.

## Security Features

1. **Password Hashing**: Passwords are hashed with bcrypt before storage
2. **Attempt Limiting**: Maximum 5 OTP verification attempts
3. **Rate Limiting**: 30-second cooldown before resending OTP
4. **TTL Index**: Expired OTPs automatically deleted from database
5. **Email Verification**: Only verified emails can complete signup
6. **Secure Storage**: OTPs stored in database, not in cookies/localStorage

## Testing

### Manual Testing

1. **Test Signup with OTP**
   ```
   - Go to /signup?role=creator or /signup?role=brand
   - Fill the form
   - Click "Complete Signup"
   - Check your email for OTP
   - Enter OTP in the modal
   - Account should be created
   ```

2. **Test Resend OTP**
   ```
   - Wait for "Resend OTP" button to be enabled (30 seconds)
   - Click "Resend OTP"
   - Should receive new OTP in email
   ```

3. **Test OTP Expiration**
   ```
   - Request OTP
   - Wait 10 minutes
   - Try to verify with OTP
   - Should show "OTP has expired"
   ```

4. **Test Attempt Limit**
   ```
   - Request OTP
   - Enter wrong OTP 5 times
   - Should show "Too many attempts" message
   ```

### Automated Testing (Example)

```typescript
import { generateOTP, storeOTP, verifyOTP } from '@/lib/otp';

test('OTP flow', async () => {
  const email = 'test@example.com';
  const otp = generateOTP();
  
  // Store OTP
  await storeOTP(email, otp);
  
  // Verify OTP
  const result = await verifyOTP(email, otp);
  expect(result.isValid).toBe(true);
});
```

## Troubleshooting

### OTP Email Not Received

1. **Check Environment Variables**
   - Ensure `EMAIL_USER`, `EMAIL_PASSWORD` are set correctly
   - Verify `EMAIL_SERVICE` matches your provider

2. **Check Gmail**
   - Generate new App Password
   - Ensure 2FA is enabled
   - Check spam folder

3. **Check Logs**
   - Look for errors in console
   - Check MongoDB connection
   - Verify email service configuration

### OTP Expired Immediately

1. Check system time is correct
2. Verify `expiresAt` is set to future time
3. Check MongoDB connection and schema

### Cannot Resend OTP

1. Wait at least 30 seconds from first OTP
2. Check if OTP already verified
3. Verify email is correct

### Email Template Not Rendering

1. Check if `nodemailer` is properly configured
2. Verify email provider supports HTML emails
3. Check email service logs

## Production Deployment

### Vercel Deployment

1. Add environment variables to Vercel:
   - Go to Project Settings > Environment Variables
   - Add `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`

2. Redeploy after adding variables

### Self-Hosted

1. Set environment variables on server:
   ```bash
   export EMAIL_SERVICE=gmail
   export EMAIL_USER=your-email@gmail.com
   export EMAIL_PASSWORD=app-password
   ```

2. Restart application

### Database Cleanup

Run periodic cleanup job to remove expired OTPs:

```typescript
// Run daily at 2 AM
import cron from 'node-cron';
import { cleanupExpiredOTPs } from '@/lib/otp';

cron.schedule('0 2 * * *', async () => {
  await cleanupExpiredOTPs();
});
```

## Configuration Options

Customize OTP settings in `lib/otp.ts`:

```typescript
// OTP expiration time (minutes)
const expiresIn = 10;

// Resend cooldown (seconds)
const resendCooldown = 30;

// Maximum attempts
const maxAttempts = 5;
```

## Future Enhancements

- [ ] SMS OTP support (Twilio integration)
- [ ] 2FA for existing users
- [ ] OTP history and audit logging
- [ ] Customizable email templates
- [ ] OTP backup codes
- [ ] WhatsApp OTP delivery
- [ ] Dynamic OTP length

## Support

For issues or questions:
1. Check this documentation
2. Review troubleshooting section
3. Check application logs
4. Review MongoDB schemas
5. Test email provider configuration
