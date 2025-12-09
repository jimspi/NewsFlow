# NewsFlow - Setup Guide

NewsFlow is a production-ready newsroom editorial workflow system with full authentication, role-based access control, and AI-powered story analysis.

## Features

- ✅ **Full Authentication System** with NextAuth.js
- ✅ **Sign Up/Sign In** with job position selection
- ✅ **Role-Based Access Control** (Reporter, Executive Producer, News Director)
- ✅ **PostgreSQL Database** with Prisma ORM
- ✅ **AI Story Analysis** using OpenAI GPT-4o-mini
- ✅ **Complete CRUD Operations** for stories
- ✅ **3-Tier Editorial Workflow**
- ✅ **Real-time Metrics Dashboard**
- ✅ **Secure API Endpoints**

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL database (local or cloud)
- OpenAI API key

## Quick Start

### 1. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_actual_openai_api_key

# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Environment
NODE_ENV=development
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Generate Prisma client (if engines are available):
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma migrate dev --name init
```

Or manually create tables:
```bash
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and you'll be redirected to the sign-in page.

## First Time Usage

### Create Your Account

1. Navigate to `http://localhost:3000`
2. You'll be redirected to the sign-in page
3. Click "Sign Up" to create a new account
4. Fill in your details:
   - **Full Name**: Your name
   - **Email**: Your email address
   - **Job Position**: Choose from:
     - Reporter: Submit and develop story pitches
     - Executive Producer: Review and approve story pitches
     - News Director: Final approval and oversight
   - **Department** (optional): e.g., Editorial, Investigative
   - **Password**: Minimum 8 characters

### User Roles & Permissions

#### Reporter
- Submit new story pitches
- View their own submitted stories
- See AI analysis and editorial feedback
- Edit stories that need development

#### Executive Producer
- Review stories at Level 2
- Approve stories to move to Level 3
- Send stories back for development
- Kill stories if needed
- Provide editorial feedback

#### News Director
- Final review at Level 3
- Approve stories for publication
- View all stories in the system
- Access dashboard metrics
- Override decisions at any level

## Database Schema

The application uses the following main tables:

- **User**: User accounts with authentication
- **Story**: Story pitches with workflow status
- **LevelHistory**: Audit trail of story reviews
- **Account/Session**: NextAuth.js authentication

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `GET /api/auth/session` - Get current session

### Stories
- `GET /api/stories` - List stories (filtered by role)
- `POST /api/stories` - Create new story (Reporter only)
- `GET /api/stories/[id]` - Get single story
- `PATCH /api/stories/[id]` - Update story or review
- `DELETE /api/stories/[id]` - Delete story

### AI Analysis
- `POST /api/analyze-story` - Analyze story pitch with AI

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Transform to production-ready SaaS"
git push origin your-branch
```

### 2. Set Up Database

Create a PostgreSQL database (recommended providers):
- [Supabase](https://supabase.com/) (Free tier)
- [Neon](https://neon.tech/) (Free tier)
- [Railway](https://railway.app/)
- [Heroku Postgres](https://www.heroku.com/postgres)

### 3. Deploy to Vercel

1. Import your repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
3. Deploy!

### 4. Run Database Migrations

After deployment, run migrations using Vercel CLI or database client:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

Or use your database provider's SQL editor to run the migration manually.

## Troubleshooting

### Prisma Engine Issues

If you encounter Prisma engine download errors:

```bash
# Set environment variable to skip checksum
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npx prisma generate
```

### Database Connection Issues

1. Verify your `DATABASE_URL` is correct
2. Ensure your database accepts connections from your IP
3. Check that the database exists and is accessible

### Authentication Issues

1. Ensure `NEXTAUTH_SECRET` is set and is a long random string
2. Verify `NEXTAUTH_URL` matches your domain (with protocol)
3. Clear browser cookies if experiencing session issues

### OpenAI API Issues

1. Verify your `OPENAI_API_KEY` is valid
2. Check your OpenAI account has API access
3. The app includes fallback analysis if OpenAI fails

## Development Tips

### View Database

```bash
npx prisma studio
```

This opens a browser-based database GUI at `http://localhost:5555`

### Reset Database

```bash
npx prisma migrate reset
```

### Update Schema

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description_of_change`
3. Prisma will generate new migration files

## Security Considerations

- All passwords are hashed with bcrypt
- API routes are protected with NextAuth session checks
- Role-based access control prevents unauthorized actions
- Environment variables are never exposed to the client
- Input validation on all user inputs
- SQL injection protection via Prisma ORM

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Prisma docs: https://www.prisma.io/docs
3. Review NextAuth docs: https://next-auth.js.org

## License

This project is proprietary software.
