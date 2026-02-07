'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandSidebar } from '@/components/dashboard/brand-sidebar';
import { CreateCampaignForm } from '@/components/campaigns/create-campaign-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { db } from '@/lib/db'; // Declare db variable
import { brand } from '@/lib/brand'; // Declare brand variable

interface Campaign {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  applicantIds: string[];
  createdAt: string;
  startDate: string;
  endDate: string;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Declare refreshKey variable

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login?role=brand');
      return;
    }

    fetchCampaigns(token);
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

  const handleCampaignCreated = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setShowCreateForm(false);
      fetchCampaigns(token);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === 'active');
  const draftCampaigns = campaigns.filter((c) => c.status === 'draft');
  const completedCampaigns = campaigns.filter((c) => c.status === 'completed');

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      db.campaigns.delete(campaignId);
      setRefreshKey((prev) => prev + 1);
    }
  };

  const CampaignCard = ({ campaign }: { campaign: (typeof campaigns)[0] }) => (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <CardDescription className="mt-1">{campaign.description.slice(0, 100)}...</CardDescription>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            campaign.status === 'active'
              ? 'bg-green-100 text-green-700'
              : campaign.status === 'draft'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Budget</p>
            <p className="font-semibold text-foreground">₹{campaign.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Applications</p>
            <p className="font-semibold text-foreground">{campaign.applicantIds.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-semibold text-foreground">
              {new Date(campaign.startDate).toLocaleDateString()} -{' '}
              {new Date(campaign.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive bg-transparent"
            onClick={() => handleDeleteCampaign(campaign._id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <BrandSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 md:ml-0">
            <div className="flex items-center justify-between">
              <div className="ml-14 md:ml-0">
                <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
                <p className="text-sm text-muted-foreground">Manage your brand campaigns</p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showCreateForm ? 'Cancel' : 'New Campaign'}
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          {showCreateForm ? (
            <div className="max-w-2xl">
              <CreateCampaignForm brandId={brand.id} onSuccess={handleCreateSuccess} />
            </div>
          ) : (
            <Tabs defaultValue="active" className="w-full" key={refreshKey}>
              <TabsList>
                <TabsTrigger value="active">
                  Active ({activeCampaigns.length})
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Draft ({draftCampaigns.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedCampaigns.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                {activeCampaigns.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeCampaigns.map((campaign) => (
                      <CampaignCard key={campaign._id} campaign={campaign} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-8 text-center">
                      <p className="text-muted-foreground mb-4">No active campaigns</p>
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => setShowCreateForm(true)}
                      >
                        Create First Campaign
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="draft" className="mt-6">
                {draftCampaigns.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {draftCampaigns.map((campaign) => (
                      <CampaignCard key={campaign._id} campaign={campaign} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-8 text-center">
                      <p className="text-muted-foreground">No draft campaigns</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {completedCampaigns.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {completedCampaigns.map((campaign) => (
                      <CampaignCard key={campaign._id} campaign={campaign} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-8 text-center">
                      <p className="text-muted-foreground">No completed campaigns</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
