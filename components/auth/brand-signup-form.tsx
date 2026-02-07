'use client';

import React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { OTPVerification } from './otp-verification';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  companyName: string;
  website: string;
  industry: string;
  description: string;
}

export function BrandSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    website: '',
    industry: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.companyName ||
      !formData.industry ||
      !formData.description
    ) {
      setError('Please fill all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // First, send OTP to email
      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          userName: formData.name,
        }),
      });

      if (!otpResponse.ok) {
        const data = await otpResponse.json();
        setError(data.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      // Show OTP verification modal
      setOtpEmail(formData.email);
      setShowOTPVerification(true);
      setLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleOTPVerified = async (verified: boolean) => {
    if (!verified) return;

    setLoading(true);
    setError('');
    setShowOTPVerification(false);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'brand',
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Redirect to dashboard
      router.push('/brand/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Brand Account</CardTitle>
          <CardDescription>Setup takes just a few minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex gap-3 rounded-lg bg-destructive/10 p-3 text-destructive">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Contact Person Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="brand@company.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min 8 chars, 1 letter, 1 number, 1 special char"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company Inc."
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="Fashion, Tech, Food, etc."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <Label htmlFor="description">Company Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your brand, what you do, and what you're looking for..."
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? 'Creating Account...' : 'Create Brand Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <OTPVerification
                email={otpEmail}
                userName={formData.name}
                onVerified={handleOTPVerified}
                onClose={() => setShowOTPVerification(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
