import mongoose, { Schema, Document, Model } from 'mongoose';

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('[v0] MONGODB_URI environment variable is not set. Database features will not work.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Creator Schema
export interface ICreator extends Document {
  // Step 1: Basic Info
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  whatsappNumber: string;
  // Step 2: Instagram Info
  instagramProfile: string;
  instagramUsername: string;
  followersCount: number;
  averageReelViews: number;
  pastCollaborations: number;
  // Step 3: Personal Info
  age: number;
  gender: 'male' | 'female' | 'other';
  // Step 4: Address
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  // Step 5: Content & Platform
  contentNiche: string[];
  creatorType: string;
  youtubeLink?: string;
  youtubeSubscribers?: number;
  // System fields
  role: 'creator';
  subscriptionStatus: 'free' | 'premium';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const creatorSchema = new Schema<ICreator>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    whatsappNumber: { type: String, required: true },
    instagramProfile: { type: String, required: true },
    instagramUsername: { type: String, required: true },
    followersCount: { type: Number, required: true, default: 0 },
    averageReelViews: { type: Number, required: true, default: 0 },
    pastCollaborations: { type: Number, required: true, default: 0 },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    contentNiche: { type: [String], required: true },
    creatorType: { type: String, required: true },
    youtubeLink: String,
    youtubeSubscribers: Number,
    role: { type: String, default: 'creator' },
    subscriptionStatus: { type: String, enum: ['free', 'premium'], default: 'free' },
    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

creatorSchema.index({ email: 1 });
creatorSchema.index({ phone: 1 });

// Brand Schema
export interface IBrand extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  companyName: string;
  website?: string;
  industry: string;
  description: string;
  logo?: string;
  role: 'brand';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    website: String,
    industry: { type: String, required: true },
    description: { type: String, required: true },
    logo: String,
    role: { type: String, default: 'brand' },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

brandSchema.index({ email: 1 });
brandSchema.index({ phone: 1 });

// Campaign Schema
export interface ICampaign extends Document {
  brandId: string;
  title: string;
  description: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  requiredNiches: string[];
  requiredFollowers: number;
  status: 'draft' | 'active' | 'closed' | 'completed';
  applicantIds: string[];
  approvedInfluencerIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    brandId: { type: String, required: true, ref: 'Brand' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    requiredNiches: { type: [String], required: true },
    requiredFollowers: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['draft', 'active', 'closed', 'completed'], default: 'draft' },
    applicantIds: { type: [String], default: [] },
    approvedInfluencerIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

campaignSchema.index({ brandId: 1 });
campaignSchema.index({ status: 1 });

// Campaign Application Schema
export interface ICampaignApplication extends Document {
  campaignId: string;
  creatorId: string;
  status: 'applied' | 'approved' | 'rejected' | 'in-progress' | 'submitted' | 'completed';
  submittedAssets?: string[];
  submissionDate?: Date;
  approvalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const campaignApplicationSchema = new Schema<ICampaignApplication>(
  {
    campaignId: { type: String, required: true, ref: 'Campaign' },
    creatorId: { type: String, required: true, ref: 'Creator' },
    status: {
      type: String,
      enum: ['applied', 'approved', 'rejected', 'in-progress', 'submitted', 'completed'],
      default: 'applied',
    },
    submittedAssets: { type: [String], default: [] },
    submissionDate: Date,
    approvalDate: Date,
  },
  { timestamps: true }
);

campaignApplicationSchema.index({ campaignId: 1, creatorId: 1 });
campaignApplicationSchema.index({ creatorId: 1 });

// File Upload Schema
export interface IFileUpload extends Document {
  creatorId: string;
  campaignId?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadType: 'profile' | 'campaign-submission' | 'portfolio';
  createdAt: Date;
}

const fileUploadSchema = new Schema<IFileUpload>(
  {
    creatorId: { type: String, required: true, ref: 'Creator' },
    campaignId: String,
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    uploadType: {
      type: String,
      enum: ['profile', 'campaign-submission', 'portfolio'],
      required: true,
    },
  },
  { timestamps: true }
);

fileUploadSchema.index({ creatorId: 1 });
fileUploadSchema.index({ campaignId: 1 });

// Notification Schema
export interface INotification extends Document {
  userId: string;
  type: 'campaign' | 'profile' | 'subscription' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ['campaign', 'profile', 'subscription', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    actionUrl: String,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1 });

// Subscription Schema
export interface ISubscription extends Document {
  userId: string;
  planType: 'free' | 'starter' | 'professional';
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true },
    planType: { type: String, enum: ['free', 'starter', 'professional'], required: true },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1 });

// OTP Verification Schema
export interface IOTPVerification extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const otpVerificationSchema = new Schema<IOTPVerification>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Automatically delete expired OTP documents after 10 minutes
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Export Models
export const Creator: Model<ICreator> =
  mongoose.models?.Creator || mongoose.model<ICreator>('Creator', creatorSchema);
export const Brand: Model<IBrand> = mongoose.models?.Brand || mongoose.model<IBrand>('Brand', brandSchema);
export const Campaign: Model<ICampaign> =
  mongoose.models?.Campaign || mongoose.model<ICampaign>('Campaign', campaignSchema);
export const CampaignApplication: Model<ICampaignApplication> =
  mongoose.models?.CampaignApplication ||
  mongoose.model<ICampaignApplication>('CampaignApplication', campaignApplicationSchema);
export const FileUpload: Model<IFileUpload> =
  mongoose.models?.FileUpload || mongoose.model<IFileUpload>('FileUpload', fileUploadSchema);
export const Notification: Model<INotification> =
  mongoose.models?.Notification || mongoose.model<INotification>('Notification', notificationSchema);
export const Subscription: Model<ISubscription> =
  mongoose.models?.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema);
export const OTPVerification: Model<IOTPVerification> =
  mongoose.models?.OTPVerification ||
  mongoose.model<IOTPVerification>('OTPVerification', otpVerificationSchema);

// Type definitions
export type {
  ICreator,
  IBrand,
  ICampaign,
  ICampaignApplication,
  IFileUpload,
  INotification,
  ISubscription,
  IOTPVerification,
};
