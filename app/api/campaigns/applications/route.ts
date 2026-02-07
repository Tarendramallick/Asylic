import { NextRequest, NextResponse } from 'next/server';
import { connectDB, CampaignApplication, Campaign } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query: any = {};

    if (role === 'creator') {
      query.creatorId = payload.userId;
    } else if (role === 'brand') {
      // Get campaigns for this brand first
      const brandCampaigns = await Campaign.find({ brandId: payload.userId }).select('_id').lean();
      const campaignIds = brandCampaigns.map((c) => c._id.toString());
      query.campaignId = { $in: campaignIds };
    }

    const applications = await CampaignApplication.find(query)
      .populate('campaignId', 'title budget status')
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    const formattedApplications = applications.map((app) => ({
      id: app._id.toString(),
      campaignId: typeof app.campaignId === 'string' ? app.campaignId : app.campaignId?._id?.toString(),
      campaignTitle: typeof app.campaignId === 'string' ? '' : app.campaignId?.title,
      creatorId: app.creatorId,
      status: app.status,
      submittedAssets: app.submittedAssets || [],
      submissionDate: app.submissionDate,
      approvalDate: app.approvalDate,
      createdAt: app.createdAt,
    }));

    return NextResponse.json({ applications: formattedApplications }, { status: 200 });
  } catch (error) {
    console.error('[v0] Get applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
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
    if (!payload || payload.role !== 'creator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { campaignId } = body;

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Check if already applied
    const existingApp = await CampaignApplication.findOne({
      campaignId,
      creatorId: payload.userId,
    });

    if (existingApp) {
      return NextResponse.json({ error: 'Already applied to this campaign' }, { status: 409 });
    }

    // Create application
    const application = await CampaignApplication.create({
      campaignId,
      creatorId: payload.userId,
      status: 'applied',
      createdAt: new Date(),
    });

    // Add creator to campaign applicants
    await Campaign.findByIdAndUpdate(campaignId, {
      $addToSet: { applicantIds: payload.userId },
    });

    return NextResponse.json(
      {
        message: 'Applied to campaign successfully',
        application: {
          id: application._id.toString(),
          campaignId,
          status: 'applied',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Apply to campaign error:', error);
    return NextResponse.json({ error: 'Failed to apply to campaign' }, { status: 500 });
  }
}
