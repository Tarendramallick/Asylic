'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  userName?: string;
  onVerified: (verified: boolean) => void;
  onClose?: () => void;
}

export function OTPVerification({
  email,
  userName,
  onVerified,
  onClose,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify OTP');
        setLoading(false);
        return;
      }

      setSuccess(true);
      onVerified(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      setError('Failed to verify OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userName, isResend: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to resend OTP');
        setLoading(false);
        return;
      }

      setTimeLeft(600);
      setCanResend(false);
      setOtp('');
      setError('');
    } catch (err) {
      setError('Failed to resend OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div>
              <h3 className="font-semibold text-lg">Email Verified!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your email has been verified successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit OTP to <span className="font-semibold">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono mt-2"
              disabled={loading || success}
            />
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            OTP expires in: <span className="font-semibold text-foreground">{formatTime(timeLeft)}</span>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading || otp.length !== 6 || success}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">Didn&apos;t receive the OTP? </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-primary hover:text-primary/90"
              onClick={handleResend}
              disabled={!canResend || loading}
            >
              {canResend ? 'Resend OTP' : `Resend in ${formatTime(30 - (600 - timeLeft) % 30)}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
