// Database initialization and types
// Note: This is a simplified in-memory store for MVP
// Replace with MongoDB/Neon for production

interface Creator {
  id: string;
  // Step 1: Basic Info
  name: string;
  email: string;
  passwordHash: string;
  phone: string; // E.164 format
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
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface Brand {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  requiredNiches: string[];
  requiredFollowers: number;
  status: 'draft' | 'active' | 'closed' | 'completed';
  applicantIds: string[];
  approvedInfluencerIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface CampaignApplication {
  id: string;
  campaignId: string;
  creatorId: string;
  status: 'applied' | 'approved' | 'rejected' | 'in-progress' | 'submitted' | 'completed';
  submittedAssets?: string[];
  submissionDate?: string;
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface FileUpload {
  id: string;
  creatorId: string;
  campaignId?: string;
  fileName: string;
  fileUrl: string; // S3 signed URL
  fileSize: number; // in bytes
  fileType: string;
  uploadType: 'profile' | 'campaign-submission' | 'portfolio';
  createdAt: string;
}

interface Notification {
  id: string;
  userId: string;
  type: 'campaign' | 'profile' | 'subscription' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  planType: 'free' | 'starter' | 'professional';
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory database store (replace with real DB)
export const db = {
  creators: new Map<string, Creator>(),
  brands: new Map<string, Brand>(),
  campaigns: new Map<string, Campaign>(),
  campaignApplications: new Map<string, CampaignApplication>(),
  fileUploads: new Map<string, FileUpload>(),
  notifications: new Map<string, Notification>(),
  subscriptions: new Map<string, Subscription>(),
};

// Helper functions
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export type { Creator, Brand, Campaign, CampaignApplication, FileUpload, Notification, Subscription };
