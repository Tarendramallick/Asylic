import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Creator, Brand } from '@/lib/mongodb';
import { generateAccessToken, generateRefreshToken, verifyPassword } from '@/lib/auth';

const db = {
  creators: new Map([
    ['creator1@example.com', { id: '1', email: 'creator1@example.com', passwordHash: 'hashedPassword1', name: 'Creator One', verificationStatus: 'verified', subscriptionStatus: 'active' }],
    ['creator2@example.com', { id: '2', email: 'creator2@example.com', passwordHash: 'hashedPassword2', name: 'Creator Two', verificationStatus: 'unverified', subscriptionStatus: 'inactive' }]
  ]),
  brands: new Map([
    ['brand1@example.com', { id: '3', email: 'brand1@example.com', passwordHash: 'hashedPassword3', companyName: 'Brand One', verificationStatus: 'verified' }],
    ['brand2@example.com', { id: '4', email: 'brand2@example.com', passwordHash: 'hashedPassword4', companyName: 'Brand Two', verificationStatus: 'unverified' }]
  ])
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    if (role === 'creator') {
      return await loginCreator(email, password);
    } else if (role === 'brand') {
      return await loginBrand(email, password);
    } else {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function loginCreator(email: string, password: string) {
  try {
    await connectDB();

    const creator = await Creator.findOne({ email: email.toLowerCase() });

    if (!creator) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, creator.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate tokens
    const accessToken = await generateAccessToken({
      userId: creator._id.toString(),
      email: creator.email,
      role: 'creator',
    });

    const refreshToken = await generateRefreshToken({
      userId: creator._id.toString(),
      email: creator.email,
      role: 'creator',
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: creator._id.toString(),
          name: creator.name,
          email: creator.email,
          role: 'creator',
          verificationStatus: creator.verificationStatus,
          subscriptionStatus: creator.subscriptionStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Creator login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

async function loginBrand(email: string, password: string) {
  try {
    await connectDB();

    const brand = await Brand.findOne({ email: email.toLowerCase() });

    if (!brand) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, brand.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate tokens
    const accessToken = await generateAccessToken({
      userId: brand._id.toString(),
      email: brand.email,
      role: 'brand',
    });

    const refreshToken = await generateRefreshToken({
      userId: brand._id.toString(),
      email: brand.email,
      role: 'brand',
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: brand._id.toString(),
          name: brand.companyName,
          email: brand.email,
          role: 'brand',
          verificationStatus: brand.verificationStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Brand login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
