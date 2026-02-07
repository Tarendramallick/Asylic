'use client';

import React from 'react';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { OTPVerification } from './otp-verification';

const CREATOR_TYPES = ['Micro Influencer', 'Mid-tier Influencer', 'Macro Influencer', 'Mega Influencer'];
const CONTENT_NICHES = [
  'Fashion',
  'Beauty',
  'Fitness',
  'Food',
  'Travel',
  'Gaming',
  'Tech',
  'Lifestyle',
  'Photography',
  'Music',
];

interface FormData {
  // Step 1
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  whatsappNumber: string;
  // Step 2
  instagramProfile: string;
  instagramUsername: string;
  followersCount: string;
  averageReelViews: string;
  pastCollaborations: string;
  // Step 3
  age: string;
  gender: string;
  // Step 4
  address: string;
  city: string;
  state: string;
  pincode: string;
  // Step 5
  contentNiche: string[];
  creatorType: string;
  youtubeLink: string;
  youtubeSubscribers: string;
}

export function CreatorSignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsappNumber: '',
    instagramProfile: '',
    instagramUsername: '',
    followersCount: '',
    averageReelViews: '',
    pastCollaborations: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contentNiche: [],
    creatorType: '',
    youtubeLink: '',
    youtubeSubscribers: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) => {
      const updated = prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche];
      setFormData((f) => ({ ...f, contentNiche: updated }));
      return updated;
    });
  };

  const validateStep = () => {
    setError('');

    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.whatsappNumber) {
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
    } else if (currentStep === 2) {
      if (
        !formData.instagramProfile ||
        !formData.instagramUsername ||
        !formData.followersCount ||
        !formData.averageReelViews ||
        !formData.pastCollaborations
      ) {
        setError('Please fill all Instagram fields');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.age || !formData.gender) {
        setError('Please fill all personal information');
        return false;
      }
    } else if (currentStep === 4) {
      if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
        setError('Please fill all address fields');
        return false;
      }
      if (!/^\d{5,6}$/.test(formData.pincode)) {
        setError('Pincode must be 5-6 digits');
        return false;
      }
    } else if (currentStep === 5) {
      if (!formData.creatorType || formData.contentNiche.length === 0) {
        setError('Please select creator type and at least one content niche');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

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
          role: 'creator',
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
      router.push('/creator/dashboard');
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
          <CardTitle>Create Your Creator Account</CardTitle>
          <CardDescription>Step {currentStep} of 5</CardDescription>
          <div className="mt-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>
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
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          )}

          {/* Step 2: Instagram Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="instagramProfile">Instagram Profile URL *</Label>
                <Input
                  id="instagramProfile"
                  name="instagramProfile"
                  value={formData.instagramProfile}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="instagramUsername">Instagram Username *</Label>
                <Input
                  id="instagramUsername"
                  name="instagramUsername"
                  value={formData.instagramUsername}
                  onChange={handleInputChange}
                  placeholder="yourprofile (without @)"
                />
              </div>
              <div>
                <Label htmlFor="followersCount">Followers Count *</Label>
                <Input
                  id="followersCount"
                  name="followersCount"
                  type="number"
                  value={formData.followersCount}
                  onChange={handleInputChange}
                  placeholder="10000"
                />
              </div>
              <div>
                <Label htmlFor="averageReelViews">Average Reel Views *</Label>
                <Input
                  id="averageReelViews"
                  name="averageReelViews"
                  type="number"
                  value={formData.averageReelViews}
                  onChange={handleInputChange}
                  placeholder="5000"
                />
              </div>
              <div>
                <Label htmlFor="pastCollaborations">Past Brand Collaborations *</Label>
                <Input
                  id="pastCollaborations"
                  name="pastCollaborations"
                  type="number"
                  value={formData.pastCollaborations}
                  onChange={handleInputChange}
                  placeholder="5"
                />
              </div>
            </div>
          )}

          {/* Step 3: Personal Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Address */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Apt 4B"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="400001"
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value="India" disabled />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Content & Platform */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="creatorType">Creator Type *</Label>
                <Select value={formData.creatorType} onValueChange={(value) => handleSelectChange('creatorType', value)}>
                  <SelectTrigger id="creatorType">
                    <SelectValue placeholder="Select creator type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREATOR_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Content Niche(s) *</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {CONTENT_NICHES.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => toggleNiche(niche)}
                      className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                        selectedNiches.includes(niche)
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-background text-foreground hover:border-primary'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="youtubeLink">YouTube Link (Optional)</Label>
                <Input
                  id="youtubeLink"
                  name="youtubeLink"
                  value={formData.youtubeLink}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/@yourprofile"
                />
              </div>

              <div>
                <Label htmlFor="youtubeSubscribers">YouTube Subscribers (Optional)</Label>
                <Input
                  id="youtubeSubscribers"
                  name="youtubeSubscribers"
                  type="number"
                  value={formData.youtubeSubscribers}
                  onChange={handleInputChange}
                  placeholder="10000"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex-1 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {currentStep < 5 ? (
              <Button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? 'Creating Account...' : 'Complete Signup'}
              </Button>
            )}
          </div>
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
