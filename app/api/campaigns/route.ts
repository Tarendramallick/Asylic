import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Campaign, CampaignApplication } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const brandId = searchParams.get('brandId');
    const status = searchParams.get('status');

    let query: any = { status: { $ne: 'draft' } };

    if (brandId) {
      query.brandId = brandId;
    }

    if (status) {
      query.status = status;
    }

    const campaigns = await Campaign.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // If creatorId provided, add application status
    let campaignsWithStatus = campaigns;
    if (creatorId) {
      const applications = await CampaignApplication.find({
        creatorId,
        campaignId: { $in: campaigns.map((c) => c._id.toString()) },
      }).lean();

      const appMap = new Map(applications.map((app) => [app.campaignId.toString(), app]));

      campaignsWithStatus = campaigns.map((campaign) => ({
        ...campaign,
        _id: campaign._id.toString(),
        applicationStatus: appMap.get(campaign._id.toString())?.status,
      }));
    }

    return NextResponse.json({ campaigns: campaignsWithStatus }, { status: 200 });
  } catch (error) {
    console.error('[v0] Get campaigns error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'brand') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, budget, startDate, endDate, requiredNiches, requiredFollowers, status } =
      body;

    // Validate required fields
    if (!title || !description || !budget || !startDate || !endDate || !requiredNiches) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create campaign
    const campaign = await Campaign.create({
      brandId: payload.userId,
      title,
      description,
      budget: Number(budget),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      requiredNiches: Array.isArray(requiredNiches) ? requiredNiches : [requiredNiches],
      requiredFollowers: Number(requiredFollowers) || 0,
      status: status || 'active',
      applicantIds: [],
      approvedInfluencerIds: [],
    });

    return NextResponse.json(
      {
        message: 'Campaign created successfully',
        campaign: {
          id: campaign._id.toString(),
          title: campaign.title,
          status: campaign.status,
          budget: campaign.budget,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Create campaign error:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
