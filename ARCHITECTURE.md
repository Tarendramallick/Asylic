# Influencer Hub - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     React 19 + Next.js 16                    │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │              Landing Page (/page.tsx)                 │ │   │
│  │  │  • Feature showcase                                   │ │   │
│  │  │  • CTA buttons (Get Started)                          │ │   │
│  │  │  • Navigation to signup/login                         │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │           Authentication Layer                         │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Creator Signup (/signup?role=creator)          │ │ │   │
│  │  │  │  • Step 1: Basic Info                           │ │ │   │
│  │  │  │  • Step 2: Instagram Info                       │ │ │   │
│  │  │  │  • Step 3: Personal Info                        │ │ │   │
│  │  │  │  • Step 4: Address                              │ │ │   │
│  │  │  │  • Step 5: Content Preferences                  │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  │                                                      │ │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Brand Signup (/signup?role=brand)              │ │ │   │
│  │  │  │  • Company Name                                 │ │ │   │
│  │  │  │  • Industry & Website                           │ │ │   │
│  │  │  │  • Contact Info                                 │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  │                                                      │ │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Login (/login)                                 │ │ │   │
│  │  │  │  • Email                                        │ │ │   │
│  │  │  │  • Password                                     │ │ │   │
│  │  │  │  • Role selector                                │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │           Creator Dashboard                           │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Dashboard (/creator/dashboard)                 │ │ │   │
│  │  │  │  • Profile Overview                             │ │ │   │
│  │  │  │  • Stats (followers, engagement)                │ │ │   │
│  │  │  │  • Subscription Status                          │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Campaigns (/creator/campaigns)                 │ │ │   │
│  │  │  │  • Browse all active campaigns                  │ │ │   │
│  │  │  │  • Search & Filter                              │ │ │   │
│  │  │  │  • Apply button                                 │ │ │   │
│  │  │  │  • Application status tracking                  │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Uploads (/creator/uploads) [Ready to build]    │ │ │   │
│  │  │  │  Notifications (/creator/notifications) [Ready] │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │           Brand Dashboard                             │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Dashboard (/brand/dashboard)                   │ │ │   │
│  │  │  │  • Company Overview                             │ │ │   │
│  │  │  │  • Campaign Stats                               │ │ │   │
│  │  │  │  • Application Tracking                         │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Campaigns (/brand/campaigns)                   │ │ │   │
│  │  │  │  • Create New Campaign                          │ │ │   │
│  │  │  │  • Set Budget & Duration                        │ │ │   │
│  │  │  │  • Define Requirements                          │ │ │   │
│  │  │  │  • View Applicants                              │ │ │   │
│  │  │  │  • Manage Approvals                             │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  │  ┌──────────────────────────────────────────────────┐ │ │   │
│  │  │  │  Creators (/brand/creators) [Ready to build]    │ │ │   │
│  │  │  │  Analytics (/brand/analytics) [Ready to build]  │ │ │   │
│  │  │  └──────────────────────────────────────────────────┘ │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  Storage: localStorage (JWT tokens)                         │   │
│  │  HTTP Client: Fetch API                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    API Calls (JSON over HTTPS)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Backend API (Next.js)                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  Middleware Layer                            │   │
│  │  • Token Verification                                       │   │
│  │  • CORS Configuration                                       │   │
│  │  • Request Validation                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  API Routes                                  │   │
│  │                                                              │   │
│  │  Auth Routes:                                               │   │
│  │  ├─ POST /api/auth/signup                                   │   │
│  │  │  ├─ Validate input (email, phone, password)             │   │
│  │  │  ├─ Check uniqueness (email, Instagram username)        │   │
│  │  │  ├─ Hash password with bcrypt                           │   │
│  │  │  ├─ Create user in MongoDB                              │   │
│  │  │  ├─ Generate JWT tokens                                 │   │
│  │  │  └─ Return tokens + user data                           │   │
│  │  │                                                          │   │
│  │  └─ POST /api/auth/login                                   │   │
│  │     ├─ Find user by email                                  │   │
│  │     ├─ Verify password with bcrypt                         │   │
│  │     ├─ Generate JWT tokens                                 │   │
│  │     └─ Return tokens + user data                           │   │
│  │                                                              │   │
│  │  Campaign Routes:                                            │   │
│  │  ├─ GET /api/campaigns                                      │   │
│  │  │  ├─ Filter by status, brand ID                          │   │
│  │  │  ├─ Join with applications (for creator view)           │   │
│  │  │  └─ Return campaign list                                │   │
│  │  │                                                          │   │
│  │  ├─ POST /api/campaigns                                     │   │
│  │  │  ├─ Verify creator is brand (token)                     │   │
│  │  │  ├─ Validate campaign data                              │   │
│  │  │  ├─ Create campaign in MongoDB                          │   │
│  │  │  └─ Return created campaign                             │   │
│  │  │                                                          │   │
│  │  └─ POST /api/campaigns/applications                        │   │
│  │     ├─ Verify creator (token)                              │   │
│  │     ├─ Check not already applied                           │   │
│  │     ├─ Create application in MongoDB                       │   │
│  │     ├─ Add creator to campaign applicants                  │   │
│  │     └─ Return application                                  │   │
│  │                                                              │   │
│  │  User Routes:                                                │   │
│  │  ├─ GET /api/users/profile                                 │   │
│  │  │  ├─ Verify token                                        │   │
│  │  │  ├─ Fetch user from MongoDB                             │   │
│  │  │  └─ Return user data (without password)                 │   │
│  │  │                                                          │   │
│  │  └─ PUT /api/users/profile                                 │   │
│  │     ├─ Verify token                                        │   │
│  │     ├─ Validate update data                                │   │
│  │     ├─ Update in MongoDB                                   │   │
│  │     └─ Return updated user                                 │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  Auth Layer                                  │   │
│  │  • JWT Token Generation/Verification                        │   │
│  │  • Password Hashing (bcryptjs)                              │   │
│  │  • Token Payload: {userId, email, role, type, exp}         │   │
│  │  • Access Token: 15 minutes                                 │   │
│  │  • Refresh Token: 7 days                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                     Database Operations
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MongoDB Database                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   Collections                                │   │
│  │                                                              │   │
│  │  creators {                                                 │   │
│  │    _id, name, email, phone, whatsappNumber,               │   │
│  │    instagramProfile, instagramUsername,                    │   │
│  │    followersCount, averageReelViews, pastCollaborations,  │   │
│  │    age, gender, address, city, state, country, pincode,   │   │
│  │    contentNiche[], creatorType, youtubeLink,              │   │
│  │    subscriptionStatus, verificationStatus,                │   │
│  │    passwordHash, timestamps                                │   │
│  │  }                                                          │   │
│  │                                                              │   │
│  │  brands {                                                   │   │
│  │    _id, name, email, phone,                               │   │
│  │    companyName, website, industry, description, logo,     │   │
│  │    verificationStatus, passwordHash, timestamps            │   │
│  │  }                                                          │   │
│  │                                                              │   │
│  │  campaigns {                                                │   │
│  │    _id, brandId, title, description, budget,              │   │
│  │    startDate, endDate, requiredNiches[],                  │   │
│  │    requiredFollowers, status,                              │   │
│  │    applicantIds[], approvedInfluencerIds[],               │   │
│  │    timestamps                                              │   │
│  │  }                                                          │   │
│  │                                                              │   │
│  │  campaignapplications {                                    │   │
│  │    _id, campaignId, creatorId, status,                    │   │
│  │    submittedAssets[], submissionDate,                      │   │
│  │    approvalDate, timestamps                                │   │
│  │  }                                                          │   │
│  │                                                              │   │
│  │  fileuploads, notifications, subscriptions                │   │
│  │  (Reserved for future implementation)                      │   │
│  │                                                              │   │
│  ├─ Indexes:                                                   │   │
│  │  • creators.email (unique)                                 │   │
│  │  • creators.phone (unique)                                 │   │
│  │  • creators.instagramUsername (unique)                     │   │
│  │  • brands.email (unique)                                   │   │
│  │  • brands.phone (unique)                                   │   │
│  │  • campaigns.brandId                                       │   │
│  │  • campaigns.status                                        │   │
│  │  • campaignapplications.campaignId, creatorId             │   │
│  │  • campaignapplications.creatorId                          │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  Features                                    │   │
│  │  • Connection Pooling                                       │   │
│  │  • Automatic Timestamps                                     │   │
│  │  • Validation on Save                                       │   │
│  │  • Query Optimization with Indexes                          │   │
│  │  • Backup & Recovery                                        │   │
│  │  • 99.99% Uptime SLA                                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Creator Signup Flow

```
┌──────────────────────┐
│ Creator Signup Form  │
└──────┬───────────────┘
       │
       │ 5 Steps
       │ (Collect Data)
       │
       ▼
┌──────────────────────────────┐
│ Validate All Fields          │
│ • Email format               │
│ • Password strength          │
│ • Phone E.164 format         │
│ • Pincode 5-6 digits         │
│ • Age 18+                    │
└──────┬───────────────────────┘
       │
       │ POST /api/auth/signup
       │
       ▼
┌──────────────────────────────┐
│ Backend Validation           │
│ • Check email unique         │
│ • Check phone unique         │
│ • Check Instagram username   │
└──────┬───────────────────────┘
       │
       │ All Valid
       │
       ▼
┌──────────────────────────────┐
│ Hash Password (bcryptjs)     │
│ 10 rounds                    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Create Creator in MongoDB    │
│ Save All Data to Database    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Generate Tokens              │
│ • Access Token (15 min)      │
│ • Refresh Token (7 days)     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Return Response              │
│ • Tokens                     │
│ • User Data                  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Store Tokens in localStorage │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Redirect to Dashboard        │
└──────────────────────────────┘
```

### Campaign Application Flow

```
Creator Views Campaign
       │
       ▼
┌──────────────────────┐
│ Click Apply Now      │
└──────┬───────────────┘
       │
       │ GET Authorization Token
       │
       ▼
┌──────────────────────────────┐
│ POST /api/campaigns/applications
│ {campaignId}
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Verify Creator Token         │
│ Extract userId from JWT      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Check Not Already Applied    │
│ Query existing applications  │
└──────┬───────────────────────┘
       │
       │ Not Applied
       │
       ▼
┌──────────────────────────────┐
│ Create Application Document  │
│ • campaignId                 │
│ • creatorId                  │
│ • status: "applied"          │
│ • timestamps                 │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Add Creator to Campaign      │
│ campaign.applicantIds.push() │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Return Success Response      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Refresh Campaign List        │
│ Show "Already Applied"       │
└──────────────────────────────┘
```

## Technology Stack

```
Frontend:
├─ React 19
├─ Next.js 16 (App Router)
├─ TypeScript
├─ Tailwind CSS
├─ shadcn/ui
├─ React Hook Form
├─ Zod (validation)
└─ Lucide Icons

Backend:
├─ Node.js (via Next.js)
├─ API Routes
├─ Middleware
├─ JWT (jose)
├─ bcryptjs
└─ Mongoose (ODM)

Database:
├─ MongoDB Atlas
├─ Mongoose 8.0
├─ Connection Pooling
├─ Proper Indexes
└─ Automated Backups

Deployment:
├─ Vercel
├─ GitHub (recommended)
├─ Environment Variables
└─ Custom Domain Support
```

## Security Architecture

```
┌─────────────────────────────┐
│    Client (Browser)         │
│  • localStorage for tokens  │
│  • HTTPS only (enforced)    │
└────────────┬────────────────┘
             │
    Authorization Header
    "Bearer {accessToken}"
             │
             ▼
┌─────────────────────────────┐
│    Backend API              │
│  • Verify JWT Signature     │
│  • Check Token Expiration   │
│  • Validate User ID         │
│  • Role-Based Access        │
└────────────┬────────────────┘
             │
    Database Query
    (with proper permissions)
             │
             ▼
┌─────────────────────────────┐
│    MongoDB Database         │
│  • Encrypted Connection     │
│  • Authentication Required  │
│  • IP Whitelist             │
│  • Backup & Recovery        │
└─────────────────────────────┘
```

## Scalability Path

```
Phase 1: MVP (Current)
├─ Next.js (Serverless)
├─ MongoDB Atlas (Shared Tier)
├─ Vercel Free/Pro
└─ 1000-5000 users

                ↓

Phase 2: Growth
├─ Next.js (Enterprise)
├─ MongoDB Atlas (Dedicated)
├─ Vercel Enterprise
├─ Redis (Caching)
├─ CDN (Static Assets)
└─ 5000-50000 users

                ↓

Phase 3: Enterprise
├─ Multi-Region Next.js
├─ Sharded MongoDB
├─ Advanced Analytics
├─ Premium Support
└─ 50000+ users
```

This architecture is designed for:
- Rapid development (MVP ready)
- Easy scalability (just upgrade services)
- High security (industry-standard practices)
- Cost efficiency (serverless + managed database)
- Maintainability (clean separation of concerns)
