import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Creator, Brand } from '@/lib/mongodb';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  hashPassword, 
  validatePassword,
  formatPhoneNumber 
} from '@/lib/auth';
import { db, generateId, getCurrentTimestamp } from '@/lib/database'; // Declare db, generateId, and getCurrentTimestamp

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, ...data } = body;

    // Validate role
    if (!['creator', 'brand'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    if (role === 'creator') {
      return await createCreatorAccount(data);
    } else {
      return await createBrandAccount(data);
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createCreatorAccount(data: any) {
  try {
    await connectDB();

    const {
      name,
      email,
      password,
      phone,
      whatsappNumber,
      instagramProfile,
      instagramUsername,
      followersCount,
      averageReelViews,
      pastCollaborations,
      age,
      gender,
      address,
      city,
      state,
      country = 'India',
      pincode,
      contentNiche,
      creatorType,
      youtubeLink,
      youtubeSubscribers,
    } = data;

    // Validate required fields
    const requiredFields = [
      name, email, password, phone, whatsappNumber,
      instagramProfile, instagramUsername, followersCount, averageReelViews, pastCollaborations,
      age, gender,
      address, city, state, pincode,
      contentNiche, creatorType
    ];

    if (requiredFields.some((field) => !field)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check email uniqueness
    const existingEmail = await Creator.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Check Instagram username uniqueness
    const existingUsername = await Creator.findOne({
      instagramUsername: instagramUsername.toLowerCase(),
    });
    if (existingUsername) {
      return NextResponse.json({ error: 'Instagram username already registered' }, { status: 409 });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Validate pincode format
    if (!/^\d{5,6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Pincode must be 5-6 digits' }, { status: 400 });
    }

    // Validate age
    if (Number(age) < 18) {
      return NextResponse.json({ error: 'Must be at least 18 years old' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const formattedPhone = formatPhoneNumber(phone);
    const formattedWhatsapp = formatPhoneNumber(whatsappNumber);

    // Create creator
    const creator = await Creator.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: formattedPhone,
      whatsappNumber: formattedWhatsapp,
      instagramProfile,
      instagramUsername: instagramUsername.toLowerCase(),
      followersCount: Number(followersCount),
      averageReelViews: Number(averageReelViews),
      pastCollaborations: Number(pastCollaborations),
      age: Number(age),
      gender,
      address,
      city,
      state,
      country,
      pincode,
      contentNiche: Array.isArray(contentNiche) ? contentNiche : [contentNiche],
      creatorType,
      youtubeLink,
      youtubeSubscribers: youtubeSubscribers ? Number(youtubeSubscribers) : undefined,
      role: 'creator',
      subscriptionStatus: 'free',
      verificationStatus: 'pending',
    });

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
        message: 'Creator account created successfully',
        accessToken,
        refreshToken,
        user: {
          id: creator._id.toString(),
          name: creator.name,
          email: creator.email,
          role: 'creator',
          verificationStatus: 'pending',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Creator signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}

async function createBrandAccount(data: any) {
  try {
    await connectDB();

    const { name, email, password, phone, companyName, website, industry, description, logo } = data;

    // Validate required fields
    if (!name || !email || !password || !phone || !companyName || !industry || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check email uniqueness
    const existingEmail = await Brand.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const formattedPhone = formatPhoneNumber(phone);

    // Create brand
    const brand = await Brand.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: formattedPhone,
      companyName,
      website,
      industry,
      description,
      logo,
      role: 'brand',
      verificationStatus: 'pending',
    });

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
        message: 'Brand account created successfully',
        accessToken,
        refreshToken,
        user: {
          id: brand._id.toString(),
          name: brand.companyName,
          email: brand.email,
          role: 'brand',
          verificationStatus: 'pending',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Brand signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
