'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandSidebar } from '@/components/dashboard/brand-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { db } from '@/db'; // Declare the db variable here

interface Brand {
  id: string;
  name: string;
  email: string;
  companyName: string;
  industry: string;
  description: string;
  verificationStatus: string;
  phone?: string;
  website?: string;
}

export default function BrandDashboard() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?role=brand');
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
        router.push('/login?role=brand');
        return;
      }

      const data = await response.json();
      setBrand(data.user);
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

  if (!brand) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Brand profile not found</p>
            <Button onClick={() => router.push('/login?role=brand')}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeCampaigns = Array.from(db.campaigns.values()).filter(
    (c) => c.brandId === brand.id && c.status === 'active'
  ).length;

  const totalApplications = Array.from(db.campaignApplications.values()).filter(
    (app) => {
      const campaign = db.campaigns.get(app.campaignId);
      return campaign?.brandId === brand.id;
    }
  ).length;

  const stats = [
    {
      title: 'Active Campaigns',
      value: activeCampaigns.toString(),
      icon: Briefcase,
      change: 'Running now',
    },
    {
      title: 'Creator Applications',
      value: totalApplications.toString(),
      icon: Users,
      change: 'This month',
    },
    {
      title: 'Engagement Rate',
      value: '8.4%',
      icon: TrendingUp,
      change: '+2.5% from last month',
    },
    {
      title: 'Pending Approvals',
      value: '3',
      icon: Users,
      change: 'Needs your attention',
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <BrandSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 md:ml-0">
            <div className="flex items-center justify-between">
              <div className="ml-14 md:ml-0">
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {brand.name}!</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
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
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Management</CardTitle>
                  <CardDescription>
                    Create and manage campaigns to find the right creators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Create New Campaign
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    View All Campaigns
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Browse Creators
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Your latest campaign activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(db.campaigns.values())
                      .filter((c) => c.brandId === brand.id)
                      .slice(0, 3)
                      .map((campaign) => (
                        <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-medium text-foreground">{campaign.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.applicantIds.length} applications
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : campaign.status === 'draft'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                      ))}
                    {Array.from(db.campaigns.values()).filter((c) => c.brandId === brand.id).length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No campaigns yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Tab */}
            <TabsContent value="company" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Your brand profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Company Name</p>
                      <p className="font-medium text-foreground">{brand.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
                      <p className="font-medium text-foreground">{brand.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{brand.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium text-foreground">{brand.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Industry</p>
                      <p className="font-medium text-foreground">{brand.industry}</p>
                    </div>
                    {brand.website && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Website</p>
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          {brand.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground">{brand.description}</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Company Information
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
