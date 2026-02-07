'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, BarChart3, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                IH
              </div>
              <span className="text-xl font-bold text-foreground">Influencer Hub</span>
            </div>
            <div className="hidden gap-8 md:flex">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
                How it Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect with Brands.<br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Grow Your Influence.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              The all-in-one platform for creators and brands. Discover campaigns, build relationships, and grow your creator business with powerful tools and analytics.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row items-center justify-center">
              <Link href="/signup?role=creator">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  I&apos;m a Creator <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup?role=brand">
                <Button size="lg" variant="outline">
                  I&apos;m a Brand
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-card/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Why Choose Influencer Hub?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to succeed</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: 'Smart Matching',
                description: 'Find brands that align perfectly with your niche and audience.',
              },
              {
                icon: Users,
                title: 'Easy Collaboration',
                description: 'Streamlined workflow for campaign management and deliverables.',
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Track campaign performance and growth metrics in real-time.',
              },
              {
                icon: Shield,
                title: 'Secure & Trusted',
                description: 'Built with security and verified profiles for peace of mind.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-lg border border-border bg-background p-6 transition-all hover:border-primary/30 hover:bg-card"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of creators and brands already using Influencer Hub.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row items-center justify-center">
            <Link href="/signup?role=creator">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Sign Up as Creator
              </Button>
            </Link>
            <Link href="/signup?role=brand">
              <Button size="lg" variant="outline">
                Sign Up as Brand
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  IH
                </div>
                <span className="font-semibold text-foreground">Influencer Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">The platform for creators and brands.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition">Features</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition">About</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col gap-4 sm:flex-row sm:justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 Influencer Hub. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
