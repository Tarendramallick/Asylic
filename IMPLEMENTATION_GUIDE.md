# Influencer Hub - Implementation & Development Guide

Complete guide for setting up, developing, and deploying the Influencer Hub platform.

## 📋 Quick Start Checklist

- [ ] Clone/download the project
- [ ] Install dependencies: `npm install`
- [ ] Set up environment variables
- [ ] Run development server: `npm run dev`
- [ ] Test signup and login flows
- [ ] Create test data
- [ ] Review API documentation
- [ ] Plan phase 2 features

## 🛠 Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn
- Git (for version control)
- Code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd influencer-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   touch .env.local
   ```

4. **Add environment variables**
   ```
   # JWT Secret (change in production!)
   JWT_SECRET=your-super-secret-key-please-change-this-in-production

   # Database (configure when ready)
   DATABASE_URL=

   # File Storage
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_S3_BUCKET=

   # Payment Processing
   STRIPE_PUBLIC_KEY=
   STRIPE_SECRET_KEY=

   # Email Service
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure Explained

### `/app` - Next.js App Router
```
app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout with metadata
├── globals.css           # Global styles & design tokens
├── api/                  # API routes
│   └── auth/
│       ├── signup/       # Registration endpoint
│       └── login/        # Login endpoint
├── signup/               # Signup page
├── login/                # Login page
├── creator/              # Creator routes
│   ├── dashboard/        # Main creator dashboard
│   ├── campaigns/        # Browse campaigns
│   ├── uploads/          # File management
│   ├── notifications/    # Notifications (ready)
│   └── settings/         # Settings (ready)
└── brand/                # Brand routes
    ├── dashboard/        # Brand dashboard
    ├── campaigns/        # Campaign management
    ├── creators/         # Creator discovery (ready)
    ├── analytics/        # Analytics (ready)
    └── settings/         # Settings (ready)
```

### `/components` - React Components
```
components/
├── ui/                   # shadcn/ui components (pre-installed)
├── auth/                 # Authentication forms
│   ├── creator-signup-form.tsx
│   ├── brand-signup-form.tsx
│   └── login-form.tsx
├── dashboard/            # Dashboard navigation
│   ├── creator-sidebar.tsx
│   └── brand-sidebar.tsx
└── campaigns/            # Campaign components
    └── create-campaign-form.tsx
```

### `/lib` - Utilities & Database
```
lib/
├── auth.ts              # JWT, password hashing, validation
├── db.ts                # Database types & in-memory store
└── utils.ts             # Helper functions (shadcn)
```

## 🔑 Key Features & Implementation

### 1. Authentication System

**Location**: `/lib/auth.ts`, `/app/api/auth/*`

**Features**:
- JWT tokens (15min access, 7day refresh)
- Password hashing with PBKDF2
- Email/phone uniqueness validation
- Password strength requirements
- Phone number formatting (E.164)

**Usage**:
```typescript
// Generate tokens
const accessToken = await generateAccessToken(payload);
const refreshToken = await generateRefreshToken(payload);

// Verify tokens
const decoded = await verifyToken(token);

// Password handling
const hash = hashPassword(password);
const match = verifyPassword(password, hash);
```

### 2. Creator Signup (5-Step Form)

**Location**: `/components/auth/creator-signup-form.tsx`

**Steps**:
1. Basic Info (name, email, password, phone)
2. Instagram Info (profile, followers, views)
3. Personal Info (age, gender)
4. Address (full address, city, state, pincode)
5. Content & Platform (niches, creator type, YouTube)

**Validation**:
- Email uniqueness
- Phone number format
- Instagram username uniqueness
- Password strength
- Pincode 5-6 digits
- Age >= 18

### 3. Dashboard Systems

**Creator Dashboard** (`/app/creator/dashboard/page.tsx`)
- Profile overview with stats
- Follower count, engagement rate, collaborations
- Quick actions for campaigns, uploads, notifications
- Subscription status display

**Brand Dashboard** (`/app/brand/dashboard/page.tsx`)
- Active campaign count
- Creator applications tracking
- Recent campaign activity
- Campaign creation button

### 4. Campaign Management

**Location**: `/components/campaigns/create-campaign-form.tsx`, `/app/brand/campaigns/page.tsx`

**Campaign Fields**:
- Title, description, budget
- Start/end dates
- Required niches, minimum followers
- Status (draft, active, closed, completed)

**Creator Campaign Browsing** (`/app/creator/campaigns/page.tsx`)
- Search campaigns
- Apply to campaigns
- Track applications
- View campaign details

### 5. Data Persistence

**Current**: In-memory store in `/lib/db.ts`

**Types Defined**:
- Creator
- Brand
- Campaign
- CampaignApplication
- FileUpload
- Notification
- Subscription

**Database Map Methods**:
```typescript
// Store
db.creators.set(id, creator);

// Retrieve
const creator = db.creators.get(id);

// List all
const all = Array.from(db.creators.values());

// Delete
db.creators.delete(id);
```

## 🎨 Styling & Design System

### Colors
- Primary: #6D28D9 (Purple)
- Background: #F8F8F8 (Light) / #0F0F0F (Dark)
- Text: #1A1A1A (Dark) / #E8E8E8 (Light)
- Border: #E5E5E5 (Light) / #2A2A2A (Dark)

### CSS Variables (in `/app/globals.css`)
```css
--background
--foreground
--card
--primary
--secondary
--muted
--accent
--destructive
--border
--input
```

### Tailwind Usage
```jsx
<div className="bg-background text-foreground border border-border">
  <Button className="bg-primary hover:bg-primary/90">Action</Button>
</div>
```

## 🚀 Testing & Debugging

### Manual Testing Flow

1. **Test Creator Signup**
   - Go to http://localhost:3000
   - Click "Get Started" → "I'm a Creator"
   - Fill all 5 steps with test data
   - Verify landing in dashboard

2. **Test Brand Signup**
   - Go to /signup?role=brand
   - Fill brand form
   - Verify dashboard

3. **Test Login**
   - Logout
   - Go to /login?role=creator
   - Login with created account
   - Verify dashboard access

4. **Test Campaigns**
   - As brand: Create campaign
   - As creator: Browse campaigns
   - As creator: Apply to campaign
   - As brand: View applications

### Browser Console Debugging
```javascript
// Check tokens
console.log(localStorage.getItem('accessToken'));
console.log(localStorage.getItem('refreshToken'));

// Check stored data
console.log(localStorage.getItem('creatorId'));
console.log(localStorage.getItem('userRole'));

// Verify database
// Open Network tab to see API requests
```

## 📦 Phase 2: Next Features

### File Upload System
- Create `/app/api/upload/route.ts`
- Integrate AWS S3
- Implement signed URLs
- Add file validation (5MB limit)

**Implementation**:
```typescript
// app/api/upload/route.ts
import { s3Client } from '@/lib/aws';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Upload to S3
  const key = `uploads/${uuid()}-${file.name}`;
  await s3Client.putObject({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file,
  });
  
  // Save metadata to database
  // Generate signed URL
}
```

### Stripe Integration
- Create `/app/api/subscription/route.ts`
- Implement checkout
- Handle webhooks
- Update subscription status

**Implementation**:
```typescript
// app/api/subscription/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { planType } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: PLAN_PRICES[planType],
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${baseUrl}/success`,
    cancel_url: `${baseUrl}/cancelled`,
  });
  
  return NextResponse.json({ sessionId: session.id });
}
```

### Email Notifications
- Create `/lib/email.ts`
- Integrate SendGrid/SES
- Create email templates
- Setup event triggers

**Implementation**:
```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, html: string) {
  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    html,
  });
}

// Usage
await sendEmail(
  creator.email,
  'Campaign Application Approved',
  emailTemplate.campaignApproved(campaign.title)
);
```

### Creator Discovery (for Brands)
- Create `/app/brand/creators/page.tsx`
- Implement search & filters
- Add pagination
- Show creator profiles

### Analytics Dashboard
- Create `/app/brand/analytics/page.tsx`
- Track campaign performance
- Visualize metrics
- Export reports

## 🗄 Database Migration Strategy

### Step 1: MongoDB (Recommended for MVP)

```typescript
// lib/db.ts
import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  // ... other fields
});

export const Creator = mongoose.model('Creator', creatorSchema);
```

### Step 2: PostgreSQL/Neon

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

const db = drizzle(sql`${process.env.DATABASE_URL}`);

export const creators = db.schema.table('creators', {
  // columns
});
```

## 📊 Deployment Checklist

Before deploying to production:

- [ ] Remove console.log statements
- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Setup AWS S3 bucket
- [ ] Configure Stripe production keys
- [ ] Setup email service
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Setup CORS properly
- [ ] Configure CSP headers
- [ ] Setup error tracking (Sentry)
- [ ] Configure logging
- [ ] Test all auth flows
- [ ] Verify file uploads
- [ ] Test payment flow
- [ ] Load test database
- [ ] Setup backups
- [ ] Configure CDN
- [ ] Setup monitoring

## 🔒 Security Checklist

- [ ] HTTPS enforced
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention (parameterized queries)
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Output encoding
- [ ] Secure password hashing (bcrypt recommended)
- [ ] JWT expiration enforced
- [ ] Refresh token rotation
- [ ] CORS properly configured
- [ ] Environment secrets not exposed
- [ ] File upload validation
- [ ] Admin panel secured
- [ ] API keys rotated
- [ ] Penetration testing done

## 🐛 Common Issues & Solutions

### Issue: "Module not found" error
**Solution**: 
```bash
npm install
# or
rm -rf node_modules package-lock.json && npm install
```

### Issue: Port 3000 already in use
**Solution**:
```bash
npm run dev -- -p 3001
# or
lsof -i :3000 && kill -9 <PID>
```

### Issue: Database connection error
**Solution**: Check environment variables and database URL

### Issue: JWT token expired
**Solution**: Implement refresh token rotation

### Issue: CORS errors
**Solution**: Configure CORS in API routes:
```typescript
const headers = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [JWT.io](https://jwt.io)
- [Mongoose Documentation](https://mongoosejs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [AWS S3 Guide](https://docs.aws.amazon.com/s3)
- [Stripe API Docs](https://stripe.com/docs/api)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

## 📞 Support & Questions

For help:
1. Check this guide
2. Review code comments
3. Check API documentation
4. Review error messages
5. Contact development team

---

**Happy Coding! 🚀**
