'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatorSidebar } from '@/components/dashboard/creator-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Campaign {
  _id: string;
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  requiredNiches: string[];
  requiredFollowers: number;
  status: string;
  applicationStatus?: string;
}

interface Application {
  id: string;
  campaignId: string;
  campaignTitle: string;
  status: string;
  createdAt: string;
}

export default function CreatorCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const allCampaigns = campaigns; // Declare allCampaigns variable
  const myApplications = applications; // Declare myApplications variable
  const db = { campaigns: new Map(applications.map(app => [app.campaignId, campaigns.find(c => c._id === app.campaignId)])) }; // Declare db variable

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?role=creator');
      return;
    }

    fetchCampaigns(token);
    fetchApplications(token);
  }, [router]);

  async function fetchCampaigns(token: string) {
    try {
      const response = await fetch('/api/campaigns', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('[v0] Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchApplications(token: string) {
    try {
      const response = await fetch('/api/campaigns/applications?role=creator', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('[v0] Error fetching applications:', error);
    }
  }

  async function applyCampaign(campaignId: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setApplyingTo(campaignId);
    try {
      const response = await fetch('/api/campaigns/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId }),
      });

      if (response.ok) {
        fetchApplications(token);
        fetchCampaigns(token);
      }
    } catch (error) {
      console.error('[v0] Error applying to campaign:', error);
    } finally {
      setApplyingTo(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const appliedCampaignIds = new Set(applications.map((app) => app.campaignId));
  const availableCampaigns = campaigns.filter((c) => !appliedCampaignIds.has(c._id));

  const filteredCampaigns = availableCampaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CampaignCard = ({ campaign, isApplied }: { campaign: Campaign; isApplied?: boolean }) => (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <CardDescription className="mt-1">{campaign.description.slice(0, 80)}...</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Budget</p>
            <p className="font-semibold text-foreground">₹{campaign.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Min Followers</p>
            <p className="font-semibold text-foreground">{campaign.requiredFollowers.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-semibold text-foreground text-xs">
              {Math.ceil(
                (new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Required Niches</p>
          <div className="flex flex-wrap gap-2">
            {campaign.requiredNiches.slice(0, 3).map((niche) => (
              <span key={niche} className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {niche}
              </span>
            ))}
            {campaign.requiredNiches.length > 3 && (
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                +{campaign.requiredNiches.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="pt-2">
          {isApplied ? (
            <Button disabled className="w-full opacity-50">
              Already Applied
            </Button>
          ) : (
            <Button
              onClick={() => applyCampaign(campaign._id)}
              disabled={applyingTo === campaign._id}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {applyingTo === campaign._id ? 'Applying...' : 'Apply Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <CreatorSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 md:ml-0">
            <div className="ml-14 md:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Browse Campaigns</h1>
              <p className="text-sm text-muted-foreground">Find campaigns that match your profile</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="available" className="w-full">
            <TabsList>
              <TabsTrigger value="available">Available ({filteredCampaigns.length})</TabsTrigger>
              <TabsTrigger value="applied">Applied ({myApplications.length})</TabsTrigger>
            </TabsList>

            {/* Available Campaigns */}
            <TabsContent value="available" className="mt-6">
              {filteredCampaigns.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard key={campaign._id} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? 'No campaigns match your search' : 'No campaigns available right now'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Applied Campaigns */}
            <TabsContent value="applied" className="mt-6">
              {myApplications.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myApplications
                    .map((app) => db.campaigns.get(app.campaignId))
                    .filter((c): c is Campaign => c !== undefined)
                    .map((campaign) => (
                      <CampaignCard key={campaign._id} campaign={campaign} isApplied={true} />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground mb-4">You haven't applied to any campaigns yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
