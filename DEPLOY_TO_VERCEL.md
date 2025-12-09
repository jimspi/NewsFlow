# 🚀 Deploy NewsFlow to Vercel - Step-by-Step Guide

Your code is ready to deploy! Follow these exact steps to deploy your production-ready NewsFlow app to Vercel.

## ✅ Pre-Deployment Checklist

You should have:
- [x] Supabase database configured
- [x] Database connection string: `postgresql://postgres.rgffppowaeavzwlratcf:[Getitgetit12]@aws-0-us-west-2.pooler.supabase.com:5432/postgres`
- [x] Code pushed to GitHub branch: `claude/implement-job-signup-system-01TJH1a8DSYj7SJPUvqod7C5`
- [ ] OpenAI API key
- [ ] NextAuth secret (we'll generate this)

---

## Step 1: Generate NextAuth Secret

Before deploying, generate your NextAuth secret:

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**Example output:**
```
kJ8mN2pQ9xR4tY7wZ3vC5bN6xR9tY2wZ
```

**Save this output** - you'll need it for Vercel environment variables.

---

## Step 2: Prepare Your Environment Variables

You'll need these 4 environment variables for Vercel:

### 1. DATABASE_URL
```
postgresql://postgres.rgffppowaeavzwlratcf:Getitgetit12@aws-0-us-west-2.pooler.supabase.com:5432/postgres
```
*(Note: I removed the brackets from your password - if your actual password has brackets, add them back)*

### 2. OPENAI_API_KEY
```
sk-YOUR_OPENAI_API_KEY_HERE
```
*Get this from: https://platform.openai.com/api-keys*

### 3. NEXTAUTH_SECRET
```
[The value you generated in Step 1]
```

### 4. NEXTAUTH_URL
```
[Leave blank for now - we'll update after first deployment]
```

---

## Step 3: Deploy to Vercel

### 3.1 - Go to Vercel

1. Open https://vercel.com in your browser
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub repositories

### 3.2 - Import Your Repository

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Find your **"NewsFlow"** repository in the list
4. Click **"Import"**

### 3.3 - Configure Project

You'll see a configuration screen:

**Framework Preset:**
- Should auto-detect as **"Next.js"** ✅
- If not, select it from dropdown

**Root Directory:**
- Leave as `./` (default) ✅

**Build Command:**
- Leave as default ✅

**Install Command:**
- Leave as default ✅

### 3.4 - Configure Git Settings

**Important:** Set the branch to deploy from:

1. Look for **"Git Configuration"** or **"Git Branch"** section
2. Change the branch from `main` to:
   ```
   claude/implement-job-signup-system-01TJH1a8DSYj7SJPUvqod7C5
   ```

### 3.5 - Add Environment Variables

Click **"Environment Variables"** section (you should see an expandable section)

Add these variables **ONE BY ONE**:

#### Variable 1: DATABASE_URL

- **Key:** `DATABASE_URL`
- **Value:** `postgresql://postgres.rgffppowaeavzwlratcf:Getitgetit12@aws-0-us-west-2.pooler.supabase.com:5432/postgres`
- **Environments:** Check ✅ Production, ✅ Preview, ✅ Development

Click **"Add"** or press Enter

#### Variable 2: OPENAI_API_KEY

- **Key:** `OPENAI_API_KEY`
- **Value:** `sk-your_actual_openai_key_here`
- **Environments:** Check ✅ Production, ✅ Preview, ✅ Development

Click **"Add"** or press Enter

#### Variable 3: NEXTAUTH_SECRET

- **Key:** `NEXTAUTH_SECRET`
- **Value:** [Paste the secret you generated in Step 1]
- **Environments:** Check ✅ Production, ✅ Preview, ✅ Development

Click **"Add"** or press Enter

#### Variable 4: NEXTAUTH_URL

- **Key:** `NEXTAUTH_URL`
- **Value:** [Leave blank for now]
- **Environments:** Check ✅ Production only

Click **"Add"** or press Enter

### 3.6 - Deploy!

1. Review your settings:
   - ✅ Framework: Next.js
   - ✅ Branch: `claude/implement-job-signup-system-01TJH1a8DSYj7SJPUvqod7C5`
   - ✅ 4 environment variables added
2. Click the blue **"Deploy"** button
3. Wait 2-5 minutes while Vercel builds your app

You'll see:
- Building... (installing dependencies)
- Building... (running build command)
- Deploying...
- ✅ Deployment completed!

---

## Step 4: Post-Deployment Configuration

### 4.1 - Get Your Deployment URL

After deployment completes, you'll see your app URL:

**Example:** `https://news-flow-xxxxx.vercel.app`

**Copy this URL!**

### 4.2 - Update NEXTAUTH_URL

1. In Vercel, go to your project
2. Click **"Settings"** tab (top navigation)
3. Click **"Environment Variables"** in left sidebar
4. Find **"NEXTAUTH_URL"**
5. Click the **"⋯"** (three dots) → **"Edit"**
6. Update the value to your deployment URL:
   ```
   https://news-flow-xxxxx.vercel.app
   ```
   *(Replace with your actual URL - include `https://` but NO trailing slash)*
7. Make sure it's set for **"Production"** environment
8. Click **"Save"**

### 4.3 - Redeploy with Updated Environment Variable

1. Go to **"Deployments"** tab
2. Find your latest deployment (the one at the top)
3. Click the **"⋯"** (three dots) on the right
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again
6. Wait 1-2 minutes for redeployment

---

## Step 5: Set Up Database Schema

Now that your app is deployed, you need to create the database tables in Supabase.

### Option A: Using Local Environment (Recommended)

1. **On your local machine**, make sure your `.env` file has the Supabase URL:
   ```bash
   # Edit .env file
   DATABASE_URL="postgresql://postgres.rgffppowaeavzwlratcf:Getitgetit12@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
   ```

2. **Push the schema to Supabase:**
   ```bash
   npx prisma db push
   ```

3. **You should see:**
   ```
   Your database is now in sync with your Prisma schema. Done in XXXs
   ```

### Option B: Using Supabase SQL Editor

If Option A doesn't work, manually create tables:

1. Go to your Supabase project
2. Click **"SQL Editor"** in left sidebar
3. Copy the SQL from `prisma/schema.prisma` and convert to SQL
4. Or use Prisma Studio to push schema

---

## Step 6: Test Your Production App! 🎉

### 6.1 - Visit Your App

Open your Vercel URL: `https://news-flow-xxxxx.vercel.app`

### 6.2 - Sign Up

1. You should be redirected to `/auth/signin`
2. Click **"Sign Up"**
3. Fill in the form:
   - **Name:** Your name
   - **Email:** Your email
   - **Job Position:** Choose "Reporter" first (to test story creation)
   - **Password:** At least 8 characters
4. Click **"Create Account"**
5. You should be automatically logged in! ✅

### 6.3 - Test Story Creation

1. Click **"+ New Story"** button
2. Fill in a test story:
   - **Headline:** "Local Business Owner Wins Award"
   - **Pitch:** "Interviewing local entrepreneur about their community impact..."
3. Click **"Submit Story"**
4. Wait for AI analysis to complete
5. Story should appear in your pipeline! ✅

### 6.4 - Test Different Roles

1. Sign out (logout button)
2. Sign up with a different email as "Executive Producer"
3. You should see stories awaiting your review
4. Click **"Review Story"**
5. Provide feedback and approve/reject

---

## Step 7: Verify Everything Works

### Checklist:

- [ ] App loads at your Vercel URL
- [ ] Sign up page works
- [ ] New user creation successful
- [ ] Sign in works with credentials
- [ ] Dashboard loads for logged-in user
- [ ] Reporters can submit stories
- [ ] AI analysis runs (OpenAI integration works)
- [ ] Executive Producers can review stories
- [ ] News Directors see all stories and metrics
- [ ] Logout works

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Check your `DATABASE_URL` in Vercel environment variables
2. Make sure password doesn't have brackets or special characters are encoded
3. Test connection from local machine first

### Issue: "NextAuth configuration error"

**Solution:**
1. Verify `NEXTAUTH_URL` exactly matches your Vercel URL
2. Must include `https://`
3. No trailing slash
4. Redeploy after updating

### Issue: "OpenAI API error"

**Solution:**
1. Verify your OpenAI API key is valid
2. Check you have credits at https://platform.openai.com/usage
3. API key should start with `sk-`

### Issue: "Tables don't exist"

**Solution:**
Run `npx prisma db push` with your Supabase DATABASE_URL in `.env`

### Issue: "Can't sign up"

**Solution:**
1. Check browser console for errors (F12)
2. Verify all environment variables are set in Vercel
3. Check Vercel function logs: **Deployments** → Click deployment → **Functions** tab

---

## 📊 Monitor Your Deployment

### View Logs

1. Go to your Vercel project
2. Click **"Deployments"**
3. Click your latest deployment
4. Click **"Functions"** or **"Logs"** tab
5. See real-time logs and errors

### View Analytics

1. Go to **"Analytics"** tab in Vercel
2. See page views, performance metrics
3. Monitor API route performance

### View Database

1. Go to Supabase dashboard
2. Click **"Table Editor"**
3. See your `User` and `Story` tables with real data
4. Click **"Database"** → **"Backups"** to see automatic backups

---

## 🎯 Next Steps

### Set Up Custom Domain (Optional)

1. In Vercel, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `newsflow.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

### Set Up Monitoring

1. Add Sentry for error tracking
2. Set up Vercel Analytics
3. Monitor Supabase usage

### Create More Accounts

1. Create test accounts for all 3 roles
2. Test the full workflow end-to-end
3. Invite your team members

---

## 🚀 You're Live!

Your NewsFlow app is now deployed and ready for production use!

**Your App:** https://your-app.vercel.app (replace with your actual URL)

**What you have:**
✅ Full authentication system
✅ PostgreSQL database with Supabase
✅ AI-powered story analysis
✅ 3-tier editorial workflow
✅ Role-based access control
✅ Production-ready deployment

**Need help?** Check:
- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Supabase docs: https://supabase.com/docs

---

## 📝 Your Credentials

**Supabase:**
- Project: NewsFlow (or your project name)
- Region: us-west-2
- Database URL: `postgresql://postgres.rgffppowaeavzwlratcf:Getitgetit12@aws-0-us-west-2.pooler.supabase.com:5432/postgres`

**Vercel:**
- Project: NewsFlow
- Branch: `claude/implement-job-signup-system-01TJH1a8DSYj7SJPUvqod7C5`
- Framework: Next.js

**Environment Variables:**
- DATABASE_URL ✅
- OPENAI_API_KEY ✅
- NEXTAUTH_SECRET ✅
- NEXTAUTH_URL ✅

---

Congratulations! 🎉 Your app is live!
