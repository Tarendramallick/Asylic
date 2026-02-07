'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

function LoginContent() {
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
      <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginContent />
    </Suspense>
  );
}
