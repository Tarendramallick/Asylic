# MongoDB Setup Guide - Influencer Hub

This document explains how to set up MongoDB for the Influencer Hub platform.

## Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (free tier available)
- Vercel account (for deployment)

## Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Click "Create a Project" → name it "Influencer Hub"
4. Click "Create a Cluster" and choose the free shared tier
5. Select your preferred region (closest to your users)
6. Wait for cluster to be created (5-10 minutes)

## Step 2: Create Database User

1. In MongoDB Atlas, go to "Database Access"
2. Click "Create Database User"
3. Create username: `influencer_admin`
4. Create a strong password (copy it for next step)
5. Set permissions to "Atlas Admin"

## Step 3: Get Connection String

1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (MongoDB+SRV)
4. Replace `<password>` with your database user password
5. Replace `<username>` with `influencer_admin`

Connection string format:
```
mongodb+srv://influencer_admin:<password>@cluster0.xxxxx.mongodb.net/influencer-hub?retryWrites=true&w=majority
```

## Step 4: Set Environment Variables

### Local Development

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://influencer_admin:<password>@cluster0.xxxxx.mongodb.net/influencer-hub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Vercel Deployment

1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add `MONGODB_URI` with your connection string
4. Add `JWT_SECRET` with a secure random string

## Step 5: Create IP Whitelist

In MongoDB Atlas:

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Add Current IP Address"
4. For production: Add Vercel's IP range or use "0.0.0.0/0" (less secure but works)

## Database Collections

The application automatically creates these collections:

### Creators
Stores creator/influencer profiles with:
- Personal information (name, email, phone)
- Instagram details (followers, views, etc.)
- Address and location
- Content niches and preferences
- Subscription status

### Brands
Stores brand/company profiles with:
- Company information
- Contact details
- Industry and description
- Verification status

### Campaigns
Stores brand campaigns with:
- Title, description, budget
- Timeline (start/end dates)
- Requirements (niches, follower count)
- Applicant tracking
- Status (draft, active, closed, completed)

### CampaignApplications
Tracks creator applications to campaigns:
- Application status (applied, approved, rejected, etc.)
- Submission assets
- Dates and approvals

### FileUploads
Tracks uploaded files:
- Creator portfolios
- Campaign submissions
- Profile pictures

### Notifications
Stores user notifications:
- Campaign invites
- Application updates
- System messages

### Subscriptions
Tracks subscription plans:
- Plan type (free, starter, professional)
- Stripe integration
- Status and dates

## Testing the Setup

After setting up MongoDB and deploying:

1. Go to your app's signup page
2. Create a test creator account
3. Create a test brand account
4. Create a campaign from the brand dashboard
5. Apply to campaign from creator account
6. Check MongoDB Atlas to see data being saved

## Troubleshooting

### Connection Error: "ENOTFOUND"
- Check your MONGODB_URI is correct
- Verify IP is whitelisted in Network Access
- Ensure internet connection

### "Authentication failed" Error
- Check username and password are correct
- Verify user exists in Database Access
- Check special characters are URL-encoded

### Collections Not Appearing
- Collections are created on first write
- Signup a creator/brand to trigger creation
- Use MongoDB Atlas UI to view collections

### Slow Performance
- Free tier has limitations
- Upgrade to paid tier for better performance
- Add indexes to frequently queried fields

## Best Practices

1. **Security**
   - Never commit .env files to git
   - Use strong, unique passwords
   - Rotate JWT_SECRET regularly

2. **Backups**
   - Enable automated backups in MongoDB Atlas
   - Test restore procedures

3. **Monitoring**
   - Use MongoDB Atlas Performance Advisor
   - Monitor connection pool usage
   - Set up alerts for quota limits

4. **Optimization**
   - Index frequently queried fields
   - Implement pagination for large result sets
   - Use lean() in queries when possible

## Production Checklist

- [ ] MONGODB_URI set in Vercel environment
- [ ] JWT_SECRET set to secure random string
- [ ] IP whitelist includes Vercel servers
- [ ] Automated backups enabled
- [ ] Performance monitoring set up
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] CORS properly configured

## Next Steps

1. Set up AWS S3 for file uploads
2. Integrate Stripe for subscriptions
3. Configure email notifications
4. Set up monitoring and analytics
5. Implement admin dashboard
