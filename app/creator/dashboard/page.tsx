'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatorSidebar } from '@/components/dashboard/creator-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Briefcase,
  Users,
  ArrowRight,
} from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  email: string;
  followersCount: number;
  averageReelViews: number;
  pastCollaborations: number;
  subscriptionStatus: string;
  verificationStatus: string;
  instagramUsername: string;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?role=creator');
      return;
    }

    fetchProfile(token);
  }, [router]);

  async function fetchProfile(token: string) {
    try {
      const response = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        router.push('/login?role=creator');
        return;
      }

      const data = await response.json();
      setCreator(data.user);
    } catch (error) {
      console.error('[v0] Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Creator profile not found</p>
            <Button onClick={() => router.push('/login?role=creator')}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Followers',
      value: creator.followersCount.toLocaleString(),
      icon: Users,
      change: '+5.2%',
    },
    {
      title: 'Avg. Reel Views',
      value: creator.averageReelViews.toLocaleString(),
      icon: BarChart3,
      change: '+12.1%',
    },
    {
      title: 'Collaborations',
      value: creator.pastCollaborations.toString(),
      icon: Briefcase,
      change: '+2 this month',
    },
    {
      title: 'Growth Rate',
      value: '8.4%',
      icon: TrendingUp,
      change: 'Monthly',
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <CreatorSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 md:ml-0">
            <div className="flex items-center justify-between">
              <div className="ml-14 md:ml-0">
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {creator.name}!</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{creator.email}</p>
                <p className={`text-xs font-semibold ${
                  creator.verificationStatus === 'verified'
                    ? 'text-green-600'
                    : creator.verificationStatus === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}>
                  {creator.verificationStatus.charAt(0).toUpperCase() + creator.verificationStatus.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="hover:border-primary/30 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your public creator profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Content Niche(s)</p>
                      <div className="flex flex-wrap gap-2">
                        {creator.contentNiche.map((niche) => (
                          <span
                            key={niche}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Creator Type</p>
                      <p className="font-medium text-foreground">{creator.creatorType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium text-foreground">
                        {creator.city}, {creator.state} - {creator.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Subscription Status</p>
                      <p className="font-medium text-foreground capitalize">
                        {creator.subscriptionStatus}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with your creator journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Browse Available Campaigns
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Upload Portfolio
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    View Notifications
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Profile Details</CardTitle>
                  <CardDescription>All information from your signup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-medium text-foreground">{creator.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{creator.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium text-foreground">{creator.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Age</p>
                      <p className="font-medium text-foreground">{creator.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Instagram Username</p>
                      <p className="font-medium text-foreground">@{creator.instagramUsername}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Instagram Followers</p>
                      <p className="font-medium text-foreground">
                        {creator.followersCount.toLocaleString()}
                      </p>
                    </div>
                    {creator.youtubeLink && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">YouTube Subscribers</p>
                        <p className="font-medium text-foreground">
                          {creator.youtubeSubscribers?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
