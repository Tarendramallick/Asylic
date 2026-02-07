'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CreatorSignupForm } from '@/components/auth/creator-signup-form';
import { BrandSignupForm } from '@/components/auth/brand-signup-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

function SignupContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'creator';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Role Selector */}
          <div className="mb-8 flex gap-4 justify-center">
            <Link
              href="/signup?role=creator"
              className={`rounded-lg border-2 px-6 py-3 font-medium transition-colors ${
                role === 'creator'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary'
              }`}
            >
              I&apos;m a Creator
            </Link>
            <Link
              href="/signup?role=brand"
              className={`rounded-lg border-2 px-6 py-3 font-medium transition-colors ${
                role === 'brand'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary'
              }`}
            >
              I&apos;m a Brand
            </Link>
          </div>

          {/* Forms */}
          <div className="mt-12">
            {role === 'creator' ? <CreatorSignupForm /> : <BrandSignupForm />}
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignupContent />
    </Suspense>
  );
}
