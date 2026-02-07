# Developer Reference Card - Influencer Hub

Quick reference for developers working on the Influencer Hub platform.

## Quick Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clear node_modules & reinstall
rm -rf node_modules package-lock.json && npm install
```

## Environment Setup

Create `.env.local`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your-secure-random-string-min-32-chars
```

## API Endpoints

### Authentication
```
POST /api/auth/signup
  Body: { role, email, password, name, ... }
  Returns: { accessToken, refreshToken, user }

POST /api/auth/login
  Body: { email, password, role }
  Returns: { accessToken, refreshToken, user }
```

### Campaigns
```
GET /api/campaigns?status=active&role=creator
  Headers: { Authorization: Bearer TOKEN }
  Returns: { campaigns: [...] }

POST /api/campaigns
  Headers: { Authorization: Bearer TOKEN, Content-Type: application/json }
  Body: { title, description, budget, startDate, endDate, requiredNiches, requiredFollowers }
  Returns: { campaign: {...} }

GET /api/campaigns/applications?role=creator
  Headers: { Authorization: Bearer TOKEN }
  Returns: { applications: [...] }

POST /api/campaigns/applications
  Headers: { Authorization: Bearer TOKEN, Content-Type: application/json }
  Body: { campaignId }
  Returns: { application: {...} }
```

### Users
```
GET /api/users/profile
  Headers: { Authorization: Bearer TOKEN }
  Returns: { user: {...} }

PUT /api/users/profile
  Headers: { Authorization: Bearer TOKEN, Content-Type: application/json }
  Body: { field: value, ... }
  Returns: { user: {...} }
```

## Database Models

### Creator
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  phone: string (unique, E.164),
  whatsappNumber: string,
  instagramProfile: string,
  instagramUsername: string (unique),
  followersCount: number,
  averageReelViews: number,
  pastCollaborations: number,
  age: number,
  gender: string,
  address: string,
  city: string,
  state: string,
  country: string,
  pincode: string,
  contentNiche: string[],
  creatorType: string,
  youtubeLink: string,
  youtubeSubscribers: number,
  subscriptionStatus: string,
  verificationStatus: string,
  passwordHash: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Brand
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  phone: string (unique),
  companyName: string,
  website: string,
  industry: string,
  description: string,
  logo: string,
  verificationStatus: string,
  passwordHash: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Campaign
```typescript
{
  _id: ObjectId,
  brandId: ObjectId,
  title: string,
  description: string,
  budget: number,
  startDate: Date,
  endDate: Date,
  requiredNiches: string[],
  requiredFollowers: number,
  status: 'draft' | 'active' | 'closed' | 'completed',
  applicantIds: ObjectId[],
  approvedInfluencerIds: ObjectId[],
  createdAt: Date,
  updatedAt: Date
}
```

### CampaignApplication
```typescript
{
  _id: ObjectId,
  campaignId: ObjectId,
  creatorId: ObjectId,
  status: 'applied' | 'reviewed' | 'approved' | 'rejected',
  submittedAssets: string[],
  submissionDate: Date,
  approvalDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Utility Functions

### Authentication (`lib/auth.ts`)
```typescript
// Hash password
hashPassword(password: string): Promise<string>

// Verify password
verifyPassword(password: string, hash: string): Promise<boolean>

// Generate tokens
generateTokens(userId: string, email: string, role: string): {
  accessToken: string
  refreshToken: string
}

// Verify token
verifyToken(token: string): { userId: string, email: string, role: string }
```

### Validation (`lib/auth.ts`)
```typescript
// Validate email
isValidEmail(email: string): boolean

// Validate password
isValidPassword(password: string): { valid: boolean, errors: string[] }

// Format phone to E.164
formatPhoneNumber(phone: string): string
```

## Common Code Patterns

### Creating a Protected API Route
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1]
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = verifyToken(token)
    // Your logic here
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

### Using MongoDB in API Route
```typescript
// app/api/example/route.ts
import { connectDB } from '@/lib/mongodb'
import { Creator } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const creators = await Creator.find().lean()
    return NextResponse.json({ creators })
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
```

### Frontend API Call with Auth
```typescript
// components/example.tsx
const token = localStorage.getItem('accessToken')

const response = await fetch('/api/campaigns', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
})

const result = await response.json()
```

## File Organization Rules

```
/app
  Route: pages or API endpoints
  
/components
  UI: Reusable React components
  
/lib
  auth.ts: Authentication utilities
  mongodb.ts: Database connection & models
  globals.ts: Global types & constants
  utils.ts: Helper functions
  
/public
  Static assets (images, icons, etc)
```

## TypeScript Tips

### Type Definitions Location
- Global types: `/lib/globals.ts`
- API request/response types: In the route file
- Component prop types: In the component file

### Common Types
```typescript
// User roles
type UserRole = 'creator' | 'brand'

// Campaign status
type CampaignStatus = 'draft' | 'active' | 'closed' | 'completed'

// Application status
type ApplicationStatus = 'applied' | 'reviewed' | 'approved' | 'rejected'
```

## Tailwind CSS Patterns

### Responsive Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

### Form Input
```tsx
<input 
  type="email"
  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
/>
```

### Card Layout
```tsx
<div className="bg-card rounded-lg shadow-sm p-6">
  {/* Card content */}
</div>
```

## Testing Accounts

Create test accounts with:
- Creator: email ending in +creator
- Brand: email ending in +brand

Example:
- test+creator@example.com
- test+brand@example.com

Password: SecurePass123! (meets requirements)

## Common Issues & Solutions

### Issue: "Cannot find module 'mongoose'"
**Solution:** 
```bash
npm install mongoose
npm run dev
```

### Issue: "ENOTFOUND error"
**Solution:** 
- Verify MONGODB_URI in .env.local
- Check MongoDB IP whitelist
- Test connection locally first

### Issue: "JWT token invalid"
**Solution:**
- Verify JWT_SECRET is set
- Check token hasn't expired
- Ensure token is in Authorization header

### Issue: "Data not saving to MongoDB"
**Solution:**
- Verify MongoDB is running
- Check connection string
- Verify database credentials
- Check collection permissions

## Performance Tips

1. Use `.lean()` for read-only queries
2. Select only needed fields: `find({}, { field1: 1, field2: 1 })`
3. Add indexes for frequently queried fields
4. Use async/await properly
5. Cache repeated queries

## Security Checklist

- [ ] Never expose API keys in client code
- [ ] Always hash passwords before storing
- [ ] Validate all user input
- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET (32+ chars)
- [ ] Don't log sensitive data
- [ ] Use parameterized queries (done via Mongoose)
- [ ] Check user permissions on protected routes

## Debugging Tips

```typescript
// Log without debugging tools
console.log('[v0] Variable:', variable)

// Check environment
console.log('[v0] Env:', process.env.MONGODB_URI?.slice(0, 20))

// Verify token payload
console.log('[v0] Token payload:', verifyToken(token))

// Check database connection
console.log('[v0] DB connected:', mongoose.connection.readyState)
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "Add feature description"

# Push to GitHub
git push origin feature/feature-name

# Create pull request on GitHub
```

## Deployment Checklist

Before deploying:
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Environment variables set
- [ ] MongoDB connection works
- [ ] All APIs tested
- [ ] Mobile responsive
- [ ] Security review passed

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/mongodb.ts` | Database connection & models |
| `lib/auth.ts` | Authentication utilities |
| `app/api/auth/signup/route.ts` | User registration |
| `app/api/auth/login/route.ts` | User login |
| `app/api/campaigns/route.ts` | Campaign CRUD |
| `components/auth/creator-signup-form.tsx` | Creator signup form |
| `app/globals.css` | Design tokens & styles |
| `.env.local` | Environment variables |

## Quick Links

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Mongoose Docs: https://mongoosejs.com

## Support

- Check `/lib` for utilities
- Review existing components
- Follow established patterns
- Read inline code comments
- Check documentation files

---

**Remember**: Keep code clean, test thoroughly, and follow the established patterns!
