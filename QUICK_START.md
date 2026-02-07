# Influencer Hub - Quick Start Guide

Get the fully functional platform running in 5 minutes!

## 1. Set Up MongoDB (2 minutes)

### Create Free MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account or log in
3. Create a new cluster (select free tier)
4. Wait 5-10 minutes for cluster creation
5. Create database user: `influencer_admin` with a strong password
6. Get your connection string (looks like: `mongodb+srv://...`)

### Copy Connection String
In Network Access → Add Current IP Address to whitelist

## 2. Add Environment Variables (1 minute)

Create `.env.local` in project root:

```env
MONGODB_URI=mongodb+srv://influencer_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/influencer-hub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-in-production
```

Replace `YOUR_PASSWORD` with your database password.

## 3. Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test the Platform (5 minutes)

### Create Creator Account
1. Click "Get Started" → "I'm a Creator"
2. Fill 5-step signup form
3. Click "Sign Up"
4. View creator dashboard

### Create Brand Account
1. Go to `/login?role=brand`
2. Click "Sign up here"
3. Fill brand signup form
4. Click "Sign Up"
5. View brand dashboard

### Create & Apply to Campaign
1. As brand: Go to "Campaigns" → Click "Create Campaign"
2. Fill campaign details, set budget, choose niches
3. Click "Create"
4. As creator: Go to "Campaigns" → Find the campaign
5. Click "Apply Now"
6. Check MongoDB Atlas - data is saved!

## 5. Verify MongoDB (1 minute)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Database" → "Collections"
3. You'll see:
   - `creators` collection with your creator data
   - `brands` collection with your brand data
   - `campaigns` collection with your campaign
   - `campaignapplications` with applications

## 🚀 Deploy to Vercel (Optional)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/influencer-hub.git
git push -u origin main
```

### Step 2: Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Add environment variables:
   - `MONGODB_URI` - Your connection string
   - `JWT_SECRET` - Random 32+ character string
5. Click "Deploy"

## 📋 Feature Checklist

✅ **Authentication**
- Creator signup (5-step form)
- Brand signup
- Secure login
- JWT tokens
- Password hashing with bcrypt

✅ **Creator Features**
- Complete profile
- Browse campaigns
- Apply to campaigns
- View dashboard

✅ **Brand Features**
- Create campaigns
- Set requirements (niches, followers)
- Track applications
- View dashboard

✅ **Database**
- MongoDB integration
- Secure data persistence
- Collections for all entities
- Proper indexes

## 🔍 Testing Checklist

Run through this to verify everything works:

- [ ] Can sign up as creator
- [ ] Can sign up as brand
- [ ] Creator data saves to MongoDB
- [ ] Brand data saves to MongoDB
- [ ] Can login with created accounts
- [ ] Can create campaign as brand
- [ ] Campaign appears in creator list
- [ ] Can apply to campaign as creator
- [ ] Application data saves to MongoDB
- [ ] Dashboard shows correct data

## 🐛 Troubleshooting

**"ENOTFOUND" error when signing up?**
- Check your MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas
- Make sure connection string includes password

**"Cannot find module 'mongoose'?**
- Run `npm install mongoose bcryptjs`
- Restart dev server: `npm run dev`

**Login fails?**
- Check email is exactly as you signed up
- Make sure password is correct
- Try signing up again

**Data not appearing in MongoDB?**
- Go to MongoDB Atlas → Collections
- Refresh page
- Check cluster is running (not paused)
- Look in correct database (influencer-hub)

## 📚 Documentation

- **Full Setup**: See `MONGODB_SETUP.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`
- **API Docs**: See `API_DOCUMENTATION.md`
- **Full Architecture**: See `README.md`

## 💡 Next Steps

After testing, you can:

1. **Customize Colors**: Edit `/app/globals.css`
2. **Add Logo**: Replace logo in `page.tsx`
3. **Customize Text**: Update copy in components
4. **Add S3 Upload**: Implement file upload API
5. **Add Stripe**: Integrate payments
6. **Add Email**: Set up notification emails

## 🎯 What's Included

- ✅ Production-ready Next.js 16 app
- ✅ MongoDB integration with Mongoose
- ✅ Secure authentication (JWT + bcrypt)
- ✅ Creator & brand roles
- ✅ Campaign management
- ✅ Beautiful UI with shadcn/ui
- ✅ Responsive mobile design
- ✅ Complete API routes
- ✅ TypeScript throughout
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

## 🆘 Need Help?

**Common Issues**:
1. Check MongoDB is running (green status in Atlas)
2. Verify connection string has correct password
3. Ensure .env.local has MONGODB_URI
4. Restart dev server after env changes
5. Clear browser cache (Ctrl+Shift+Delete)

**Questions**:
- Check README.md for architecture
- See API_DOCUMENTATION.md for endpoints
- Review DEPLOYMENT_GUIDE.md for production

## 🎉 You're Ready!

The platform is fully functional with:
- ✅ Real database (MongoDB)
- ✅ Real authentication
- ✅ Real data persistence
- ✅ Complete creator & brand flows
- ✅ Campaign management
- ✅ Application tracking

Start building! 🚀
