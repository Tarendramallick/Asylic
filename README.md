# Influencer Hub - Creator & Brand Collaboration Platform

A comprehensive platform connecting creators with brands for influencer marketing campaigns. Built with Next.js 16, TypeScript, and a modern design system.

## 🎯 Project Overview

Influencer Hub is an MVP-ready platform designed to facilitate seamless collaboration between influencers (creators) and brands. The platform provides tools for creator onboarding, campaign management, file uploads, subscriptions, and notifications.

### Key Features

- **Creator Onboarding**: 5-step signup form collecting comprehensive profile data
- **Brand Dashboard**: Campaign creation and management interface
- **Campaign System**: Browse, apply, and manage influencer campaigns
- **Subscription Management**: Tiered access with Stripe integration ready
- **File Uploads**: Support for creator portfolio uploads (AWS S3 ready)
- **Notifications**: Email and real-time notification system
- **Secure Authentication**: JWT-based auth with refresh tokens
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🏗 Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (built into Next.js)
- **APIs**: RESTful routes in `/app/api`
- **Authentication**: JWT (access + refresh tokens)
- **Database**: In-memory store (ready for MongoDB/Neon migration)

### Database Schema
- **Creators**: User profiles with detailed information
- **Brands**: Company/brand profiles
- **Campaigns**: Campaign management and tracking
- **Campaign Applications**: Creator applications to campaigns
- **File Uploads**: Metadata for uploaded files
- **Notifications**: User notifications
- **Subscriptions**: Subscription tracking

## 📁 Project Structure

```
/app
  /api
    /auth
      /signup/route.ts      # Creator & Brand registration
      /login/route.ts       # Login endpoint
  /signup                    # Signup page
  /login                     # Login page
  /creator
    /dashboard/page.tsx      # Creator dashboard
    /campaigns/page.tsx      # Creator campaigns browse
    /uploads/page.tsx        # File uploads (ready to build)
    /notifications/page.tsx  # Notifications (ready to build)
  /brand
    /dashboard/page.tsx      # Brand dashboard
    /campaigns/page.tsx      # Brand campaign management
    /creators/page.tsx       # Creator discovery (ready to build)
    /analytics/page.tsx      # Analytics (ready to build)

/components
  /ui                        # shadcn/ui components
  /auth
    /creator-signup-form.tsx # 5-step creator signup
    /brand-signup-form.tsx   # Brand signup form
    /login-form.tsx          # Login form
  /dashboard
    /creator-sidebar.tsx     # Creator navigation
    /brand-sidebar.tsx       # Brand navigation
  /campaigns
    /create-campaign-form.tsx # Campaign creation

/lib
  /auth.ts                   # JWT, password hashing, validation
  /db.ts                     # Database types & in-memory store
  /utils.ts                  # Utility functions

/app
  /globals.css               # Global styles & design tokens
  /layout.tsx                # Root layout
  /page.tsx                  # Landing page
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for local development)
- npm or yarn

### Installation

1. **Install dependencies** (if running locally):
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```
   JWT_SECRET=your-super-secret-key-change-in-production
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## 📝 Usage Guide

### For Creators

1. **Sign Up**: Click "Get Started" → "I'm a Creator"
2. **Complete 5-Step Form**:
   - Step 1: Basic Info (name, email, password, phone)
   - Step 2: Instagram Info (profile, followers, average views)
   - Step 3: Personal Info (age, gender)
   - Step 4: Address (full address, city, state, pincode)
   - Step 5: Content & Platform (niche, creator type, YouTube link)
3. **View Dashboard**: Track profile, stats, and subscription
4. **Browse Campaigns**: Find and apply to brand campaigns
5. **Manage Uploads**: Upload portfolio and campaign deliverables

### For Brands

1. **Sign Up**: Click "Get Started" → "I'm a Brand"
2. **Complete Profile**: Company info, industry, description
3. **Create Campaigns**: Set budget, duration, required niches
4. **Manage Applications**: Review creator applications
5. **Track Performance**: View analytics and engagement metrics

## 🔐 Authentication Flow

```
User Signup/Login
    ↓
Validate credentials
    ↓
Generate JWT tokens (access + refresh)
    ↓
Store in localStorage
    ↓
Redirect to dashboard
    ↓
Access protected routes with token
```

### Access Token
- Duration: 15 minutes
- Used for API requests

### Refresh Token
- Duration: 7 days
- Used to get new access tokens

## 🗄 Data Models

### Creator
- Basic info: name, email, phone
- Social: Instagram profile, followers, views
- Personal: age, gender
- Address: full details with pincode
- Content: niches, creator type, YouTube link
- System: verification status, subscription tier

### Brand
- Contact: name, email, phone
- Company: name, website, industry, description
- System: verification status

### Campaign
- Details: title, description, budget
- Timeline: start/end dates
- Requirements: niches, minimum followers
- Tracking: applicants, approved creators
- Status: draft, active, closed, completed

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register creator or brand
- `POST /api/auth/login` - Login user

**Request Example** (Signup):
```json
{
  "role": "creator",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "instagramUsername": "johndoe",
  ...
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "creator"
  }
}
```

## 🎨 Design System

### Colors
- **Primary**: Purple/Violet (#6D28D9)
- **Background**: Light gray (#F8F8F8) / Dark (#0F0F0F)
- **Accent**: Primary variant
- **Neutrals**: Gray scale for borders, text, backgrounds

### Typography
- **Sans**: Geist (headings & body)
- **Mono**: Geist Mono (code)

### Components
- Buttons, Cards, Input fields
- Tabs, Dropdowns, Modals
- Alerts, Badges, Spinners
- Forms with validation

## 🚦 Next Steps & Future Development

### Immediate (Phase 2)
- [ ] File upload to AWS S3
- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Creator discovery for brands
- [ ] Campaign analytics

### Phase 3
- [ ] Instagram Graph API integration
- [ ] DM automation
- [ ] Advanced analytics dashboard
- [ ] AI-based creator-brand matching
- [ ] Telegram notifications

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Video content support
- [ ] Live streaming integration
- [ ] Performance tracking
- [ ] Custom reporting

## 🗂 Database Migration Path

Currently using in-memory store. To migrate to production:

### For MongoDB
```typescript
import { connect } from 'mongoose';
// Update lib/db.ts to use Mongoose models
```

### For Neon (PostgreSQL)
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
// Update lib/db.ts to use Drizzle ORM
```

## 🔒 Security Best Practices

✅ **Implemented**
- Password hashing (PBKDF2)
- JWT with expiration
- Email/phone uniqueness validation
- Strong password requirements
- Secure token storage

⚠️ **To Implement**
- HTTPS only
- CSRF protection
- Rate limiting
- API request validation
- Row-level security (RLS) with database
- Secure file upload URLs
- OAuth for social logins

## 📊 Scalability Considerations

- **Current**: In-memory store supports MVP testing
- **At Scale**: Migration to MongoDB Atlas or Neon
- **File Storage**: AWS S3 with signed URLs
- **Caching**: Implement with Redis/Upstash
- **Rate Limiting**: Upstash rate limiting
- **CDN**: Vercel Edge Network

## 🐛 Testing

```bash
# Run tests (when implemented)
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [JWT Authentication](https://jwt.io)
- [TypeScript Guide](https://www.typescriptlang.org/docs)

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For issues, feature requests, or questions:
1. Check existing documentation
2. Review code comments
3. Contact development team

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
# Asylic
