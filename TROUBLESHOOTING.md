# 🔧 Troubleshooting Guide - Fix 405 & 500 Errors

## ❌ The Errors You're Seeing

```
/api/auth/signup:1 Failed to load resource: the server responded with a status of 405 ()
/api/auth/session:1 Failed to load resource: the server responded with a status of 500 ()
CLIENT_FETCH_ERROR Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## ✅ Root Cause

Your `.env` file was missing! I've created it for you, but **you need to update it with your actual credentials**.

---

## 🚀 Quick Fix (5 minutes)

### Step 1: Update Your `.env` File

Open `.env` in your NewsFlow directory and update these values:

#### Current `.env` (needs updating):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/newsflow?schema=public"
OPENAI_API_KEY=your_openai_api_key_here
```

#### ✏️ Update to YOUR actual values:

**Option A: Using Supabase (from your earlier setup)**
```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your_actual_openai_key_here

# Database Configuration - UPDATE THIS!
DATABASE_URL="postgresql://postgres.rgffppowaeavzwlratcf:Getitgetit12@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

# NextAuth.js Configuration (these are already set)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=twep86hffqsKgC5YUG8lUdcbfLMlk61PWWx00drFM1c=

# Environment
NODE_ENV=development
```

**IMPORTANT:** Replace `OPENAI_API_KEY` with your actual OpenAI API key!

**Option B: Using Local PostgreSQL**
```env
# If you have local PostgreSQL installed
DATABASE_URL="postgresql://your_postgres_user:your_password@localhost:5432/newsflow?schema=public"
OPENAI_API_KEY=sk-your_actual_openai_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=twep86hffqsKgC5YUG8lUdcbfLMlk61PWWx00drFM1c=
NODE_ENV=development
```

---

### Step 2: Set Up the Database

After updating your `.env`, run:

```bash
# This pushes the database schema to your database
npx prisma db push
```

**Expected output:**
```
✔ Your database is now in sync with your Prisma schema. Done in XXXs
```

**If you see an error:**
- Check your DATABASE_URL is correct
- Make sure your database is accessible
- For Supabase, verify the connection string

---

### Step 3: Restart Your Development Server

Stop your current server (Ctrl+C) and restart:

```bash
npm run dev
```

---

### Step 4: Test Signup Again

1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Fill in the form
4. Click "Create Account"

**It should work now!** ✅

---

## 🔍 Detailed Explanation

### Why Did This Happen?

1. **Missing `.env` file**: Next.js couldn't find your environment variables
2. **No DATABASE_URL**: Prisma couldn't connect to the database
3. **API routes failed**: Without database connection, the signup API returned errors
4. **405 errors**: The server couldn't process the requests properly

### What I Fixed

✅ Created `.env` file with proper structure
✅ Generated NEXTAUTH_SECRET for you
✅ Set up proper environment variable structure

### What You Need to Do

⚠️ Add your **OpenAI API key**
⚠️ Add your **database connection string**
⚠️ Run `npx prisma db push`
⚠️ Restart the dev server

---

## 📋 Verification Checklist

After following the steps above, verify:

- [ ] `.env` file exists in project root
- [ ] `DATABASE_URL` is updated with your actual database
- [ ] `OPENAI_API_KEY` is updated with your actual API key
- [ ] `npx prisma db push` ran successfully
- [ ] Dev server restarted (`npm run dev`)
- [ ] Visit `http://localhost:3000` - no console errors
- [ ] Sign up page loads without errors
- [ ] Can create a new account successfully

---

## 🆘 Still Having Issues?

### Issue 1: "Can't connect to database"

**Error message:**
```
Error: Can't reach database server at...
```

**Solution:**
1. Check your DATABASE_URL is correct
2. For Supabase:
   - Go to your Supabase project
   - Click "Database" → "Connection string"
   - Use the "Session mode" (pooled) connection string
   - Port should be 6543 for pooled, or 5432 for direct
3. Make sure there are no extra spaces in the connection string

### Issue 2: "OpenAI API error"

**Error message:**
```
OpenAI API error: Incorrect API key provided
```

**Solution:**
1. Go to https://platform.openai.com/api-keys
2. Copy your API key (starts with `sk-`)
3. Update `.env` with the correct key
4. Restart dev server

### Issue 3: "Prisma Client not initialized"

**Error message:**
```
PrismaClient is unable to run in this browser environment
```

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# If that fails with engine download errors, try:
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Issue 4: "Table does not exist"

**Error message:**
```
Error: Table 'User' does not exist in the current database
```

**Solution:**
```bash
# Push schema to database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name init
```

### Issue 5: Still getting 405 errors

**Possible causes:**
1. `.env` not loaded - Make sure you **restarted** the dev server after creating `.env`
2. Caching issue - Clear your browser cache (Ctrl+Shift+Delete)
3. Port conflict - Try running on a different port:
   ```bash
   PORT=3001 npm run dev
   ```

---

## 🎯 Need Your Database Connection String?

### For Supabase:

1. Go to https://supabase.com/dashboard
2. Select your NewsFlow project
3. Click **"Database"** in the left sidebar
4. Click **"Connection string"** tab
5. Select **"Session mode"** (recommended for serverless)
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your database password
8. Paste into `.env` as `DATABASE_URL`

**Example format:**
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
```

### For Local PostgreSQL:

```bash
# Install PostgreSQL (if not installed)
# On Mac: brew install postgresql
# On Ubuntu: sudo apt install postgresql

# Create database
createdb newsflow

# Connection string format:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/newsflow?schema=public"
```

---

## 📞 Quick Commands Reference

```bash
# Check if .env exists
ls -la .env

# View your environment variables (without showing values)
grep -o '^[^=]*' .env

# Generate new Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Restart dev server
npm run dev

# Check if app is running
curl http://localhost:3000
```

---

## ✅ Success Indicators

When everything is working, you should see:

1. **In Terminal:**
   ```
   ready - started server on 0.0.0.0:3000, url: http://localhost:3000
   ```

2. **In Browser Console:** No red errors

3. **Network Tab:**
   - `/api/auth/session` returns 200 (not 500)
   - `/api/auth/signup` accepts POST requests (not 405)

4. **Sign Up Page:** Creates account successfully and redirects

---

## 💡 Pro Tips

1. **Use Prisma Studio** to view your database:
   ```bash
   npx prisma studio
   ```
   Opens at `http://localhost:5555`

2. **Check logs** when signup fails:
   - Look in your terminal for server-side errors
   - Check browser console for client-side errors

3. **Test database connection:**
   ```bash
   npx prisma db push
   ```
   If this works, your database connection is good!

4. **Environment variables not loading?**
   - Make sure `.env` is in the project root (same directory as `package.json`)
   - Restart your dev server after ANY change to `.env`
   - Variables must start on a new line with NO spaces before the key

---

## 🎉 After It Works

Once signup is working:

1. **Create test accounts for each role:**
   - Reporter
   - Executive Producer
   - News Director

2. **Test the workflow:**
   - Log in as Reporter → Submit story
   - Log in as EP → Review story
   - Log in as News Director → Final approval

3. **Ready to deploy?**
   - Follow `DEPLOY_TO_VERCEL.md` for deployment instructions

---

Need more help? Check:
- `SETUP.md` - Complete setup guide
- `DEPLOY_TO_VERCEL.md` - Deployment instructions
- Prisma docs: https://www.prisma.io/docs
- NextAuth docs: https://next-auth.js.org
