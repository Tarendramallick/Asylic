# Influencer Hub - Deployment Guide

This guide covers deploying the fully functional Influencer Hub platform to production.

## Prerequisites

- MongoDB Atlas account with cluster created
- Vercel account
- GitHub account (recommended)
- Domain name (optional)

## Step 1: Prepare Your Code

### Install Dependencies

```bash
npm install
```

All required dependencies are already in package.json:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jose` - JWT authentication

### Test Locally

```bash
# Set up .env.local
echo "MONGODB_URI=your_connection_string" > .env.local
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.local

# Run development server
npm run dev
```

Access the app at `http://localhost:3000`

## Step 2: Push to GitHub (Recommended)

```bash
git init
git add .
git commit -m "Initial commit: Influencer Hub platform"
git remote add origin https://github.com/yourusername/influencer-hub.git
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set up environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string (generate: `openssl rand -base64 32`)
5. Click "Deploy"

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Then follow the prompts to deploy.

## Step 4: Configure Environment Variables

In Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add the following:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | mongodb+srv://user:pass@cluster.mongodb.net/db |
| `JWT_SECRET` | 32+ character random string | Use `openssl rand -base64 32` |

## Step 5: Verify Deployment

After deployment completes:

1. Visit your Vercel deployment URL
2. Test signup as creator
3. Test signup as brand
4. Create a campaign
5. Apply to campaign
6. Check MongoDB Atlas to verify data is saved

## Step 6: Configure Custom Domain (Optional)

In Vercel dashboard:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait 5-10 minutes for DNS propagation

## Production Checklist

### Security

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB IP whitelist includes Vercel servers
- [ ] CORS is configured for your domain
- [ ] Rate limiting is implemented
- [ ] Sensitive data is not logged

### Performance

- [ ] MongoDB has appropriate indexes
- [ ] Images are optimized
- [ ] API responses are paginated
- [ ] Caching is configured
- [ ] CDN is enabled (Vercel automatic)

### Monitoring

- [ ] Error tracking is set up
- [ ] Performance monitoring is enabled
- [ ] Database monitoring is active
- [ ] Uptime monitoring is configured
- [ ] Alerts are configured

### Database

- [ ] Automated backups are enabled
- [ ] Backup retention is set (30+ days)
- [ ] Database is secured with strong user credentials
- [ ] Connection string is not hardcoded anywhere

### API

- [ ] All endpoints have authentication
- [ ] Rate limiting prevents abuse
- [ ] Request validation is implemented
- [ ] Error messages don't leak sensitive info
- [ ] API documentation is complete

## Monitoring & Maintenance

### Monitor MongoDB Performance

```javascript
// In MongoDB Atlas dashboard:
// - Check Connection Pool status
// - Monitor network access
// - Review performance advisor recommendations
```

### Monitor Vercel Deployment

```bash
# View logs
vercel logs

# Check deployment status
vercel status
```

### Regular Maintenance

- [ ] Review error logs weekly
- [ ] Update dependencies monthly
- [ ] Test disaster recovery procedures
- [ ] Review security logs
- [ ] Optimize slow queries

## Troubleshooting

### Deployment Issues

**Problem: "ENOTFOUND" errors**
- Verify MONGODB_URI is correct
- Check MongoDB IP whitelist includes Vercel IPs
- Test connection locally first

**Problem: "TypeError: Mongoose is undefined"**
- Ensure mongoose is installed: `npm install mongoose`
- Check package.json has mongoose dependency
- Rebuild and redeploy

**Problem: JWT token errors**
- Verify JWT_SECRET is set in environment
- Check token is being sent in Authorization header
- Ensure token hasn't expired

### Performance Issues

**Slow API responses**
- Check MongoDB query performance
- Add database indexes
- Implement pagination
- Enable caching
- Consider upgrading MongoDB tier

**High memory usage**
- Review API memory limits
- Optimize data structures
- Implement request pooling
- Monitor memory leaks

## Scaling Considerations

### Phase 1: MVP (Current)
- MongoDB Atlas shared tier
- Vercel free/pro tier
- 1000-5000 users

### Phase 2: Growth
- MongoDB Atlas dedicated tier
- Vercel enterprise tier
- Implement Redis caching
- Add CDN for static assets
- 5000-50000 users

### Phase 3: Enterprise
- Sharded MongoDB cluster
- Multi-region Vercel deployment
- Advanced analytics
- Premium support
- 50000+ users

## Backup & Disaster Recovery

### Enable MongoDB Backups

1. In MongoDB Atlas, go to "Backup"
2. Enable "Continuous Backup"
3. Set retention to 30+ days
4. Test restore procedure monthly

### Database Restoration

```javascript
// To restore from backup:
// 1. In MongoDB Atlas backup section
// 2. Click "Restore" on desired backup
// 3. Choose "Restore to a New Cluster"
// 4. Wait for restoration to complete
// 5. Update MONGODB_URI in Vercel
```

## Next Steps

1. Set up automated testing
2. Implement CI/CD pipeline
3. Add monitoring & analytics
4. Set up logging system
5. Configure email notifications
6. Implement payment processing
7. Add file upload system (S3)
8. Create admin dashboard
9. Set up API rate limiting
10. Implement caching strategy

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com)

## Useful Commands

```bash
# Build for production
npm run build

# Start production server locally
npm start

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update

# Clean install
rm -rf node_modules package-lock.json
npm install
```
