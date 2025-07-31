# NewsFlow - Editorial Pipeline

AI-powered editorial workflow for journalism teams with OpenAI integration.

## 🚀 Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- OpenAI API key

### Step 1: GitHub Setup
1. Create a new repository on GitHub
2. Push all code to your repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/newsflow.git
git push -u origin main
```

### Step 2: Vercel Deployment
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty (default)

### Step 3: Environment Variables
In Vercel dashboard, go to Settings → Environment Variables and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `OPENAI_API_KEY` | your_openai_api_key | Production |
| `NODE_ENV` | production | Production |

### Step 4: Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account/sign in
3. Go to API Keys section
4. Create new secret key
5. Copy and paste into Vercel environment variables

### Step 5: Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Visit your live site!

## 🛠 Local Development

### Setup
```bash
# Clone repository
git clone https://github.com/yourusername/newsflow.git
cd newsflow

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your OpenAI API key to .env.local
# OPENAI_API_KEY=your_key_here

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📝 Features

### Core Functionality
- **Story Pitch Form**: Reporters submit stories with character, accountability angle, and focus
- **AI Analysis**: Automatic story analysis using OpenAI GPT-4
- **Editorial Workflow**: 3-tier approval (Reporter → Executive Producer → News Director)
- **Real-time Insights**: AI-generated news value, public interest, and editorial suggestions

### AI Analysis Includes
- News value scoring (1-10)
- Public interest assessment
- Editorial suggestions
- Editorial recommendations
- Urgency scoring
- Legal and competitive risk assessment
- Resource requirements

### User Roles
- **Reporter**: Submit and track story pitches
- **Executive Producer**: Review and approve/deny stories
- **News Director**: Final approval and analytics dashboard

## 🔧 Technical Stack

- **Frontend**: React with Next.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4 API
- **Deployment**: Vercel
- **Database**: None (in-memory for demo)

## 🔒 Security & Environment

### Production Environment Variables
Required in Vercel:
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to "production"

### API Route Security
- Input validation on all API endpoints
- Error handling with fallback analysis
- Rate limiting ready for implementation

## 📊 Cost Considerations

### OpenAI API Usage
- Uses GPT-4o-mini for cost efficiency
- Typical analysis: ~500-1000 tokens per story
- Estimated cost: $0.001-0.003 per story analysis
- Monthly cost for 1000 stories: ~$1-3

### Vercel Hosting
- Free tier: 100GB bandwidth, 6000 serverless function executions
- Pro tier ($20/month): If you exceed free limits

## 🚨 Troubleshooting

### Common Issues

**Build fails on Vercel:**
- Check that all dependencies are in package.json
- Verify Node.js version compatibility
- Check build logs for specific errors

**AI analysis not working:**
- Verify OPENAI_API_KEY is set in Vercel environment variables
- Check API quota and billing in OpenAI dashboard
- Review serverless function logs in Vercel

**Fallback analysis activating:**
- Normal behavior if OpenAI API is unavailable
- Provides keyword-based analysis as backup
- Check network connectivity and API status

## 📈 Future Enhancements

### Database Integration
Ready to add:
- PostgreSQL with Supabase
- User authentication
- Story persistence
- Analytics tracking

### Additional Features
- Real-time collaboration
- Document uploads
- Advanced analytics
- Integration with CMS systems

## 💡 Support

For issues or questions:
1. Check GitHub Issues
2. Review Vercel deployment logs
3. Verify OpenAI API status
4. Contact support team

---

Built with ❤️ for journalism teams
