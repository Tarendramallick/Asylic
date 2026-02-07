import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Creator, Brand } from '@/lib/mongodb';
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

    let user;

    if (payload.role === 'creator') {
      user = await Creator.findById(payload.userId)
        .select('-passwordHash -__v')
        .lean();
      if (user) {
        user.id = user._id.toString();
        delete user._id;
      }
    } else if (payload.role === 'brand') {
      user = await Brand.findById(payload.userId)
        .select('-passwordHash -__v')
        .lean();
      if (user) {
        user.id = user._id.toString();
        delete user._id;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('[v0] Get profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    // Remove sensitive fields from update
    delete body.passwordHash;
    delete body.role;
    delete body.email;

    let user;

    if (payload.role === 'creator') {
      user = await Creator.findByIdAndUpdate(payload.userId, body, {
        new: true,
        runValidators: true,
      })
        .select('-passwordHash -__v')
        .lean();
    } else if (payload.role === 'brand') {
      user = await Brand.findByIdAndUpdate(payload.userId, body, {
        new: true,
        runValidators: true,
      })
        .select('-passwordHash -__v')
        .lean();
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user) {
      user.id = user._id.toString();
      delete user._id;
    }

    return NextResponse.json({ message: 'Profile updated', user }, { status: 200 });
  } catch (error) {
    console.error('[v0] Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
