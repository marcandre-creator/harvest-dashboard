# 📹 Harvest Videos Dashboard

Real-time monitoring dashboard for video harvester processing on Vercel.

## 🎯 Features

- **Real-time Queue Monitoring** - Watch video processing status in live time
- **Stats Dashboard** - Total, processing, completed, pending, and failed jobs
- **Knowledge Base Viewer** - See all processed videos with extracted insights
- **Auto-refresh** - Updates every 5 seconds
- **Beautiful UI** - Dark theme with gradient stats cards
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Deployment on Vercel

### 1️⃣ Prerequisites

- Git account and repository
- Supabase project with `video_harvest_queue` and `personal_knowledge` tables
- Vercel account (free tier works!)

### 2️⃣ Get Supabase Credentials

1. Go to your Supabase project → Settings → API
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3️⃣ Push to GitHub

```bash
cd C:/Users/marca/harvest-dashboard
git init
git add .
git commit -m "Initial commit: harvest videos dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/harvest-dashboard.git
git push -u origin main
```

### 4️⃣ Deploy to Vercel

#### Option A: Via GitHub (Recommended)

1. Go to https://vercel.com/import
2. Select your GitHub repository
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_supabase_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_anon_key
4. Click Deploy!

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel --prod --env NEXT_PUBLIC_SUPABASE_URL=YOUR_URL --env NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

### 5️⃣ Access Your Dashboard

- Vercel will give you a URL like: `https://harvest-dashboard.vercel.app`
- Open it and watch the magic! ✨

## 📊 What You'll See

### Stats Cards
- **Total**: All jobs in queue
- **En cours**: Currently processing videos
- **Complétées**: Successfully processed videos
- **En attente**: Pending jobs
- **Erreurs**: Failed jobs with retry counts

### Queue Section
- Real-time job status
- Error messages if failed
- Retry counts
- File names

### Knowledge Base Section
- All processed videos
- Titles and categories
- Number of extracted insights (nuggets)
- Processing date

## 🔄 Auto-refresh

The dashboard automatically refreshes every 5 seconds to show the latest status. No manual refresh needed!

## 📝 Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🏃 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Supabase** - Real-time database
- **Vercel** - Deployment

## 📦 Build for Production

```bash
npm run build
npm run start
```

## 🐛 Troubleshooting

### Dashboard shows "Chargement..." indefinitely
- Check Supabase credentials in `.env.local`
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check browser console for errors (F12)

### Can't connect to Supabase
- Ensure your Supabase project is active
- Check RLS policies allow anonymous access (for the specific tables)
- Verify tables exist: `video_harvest_queue` and `personal_knowledge`

### Vercel deployment fails
- Check Environment Variables are set correctly
- Run `npm run build` locally to test
- Check Vercel logs for detailed errors

## 📞 Support

Need help? Check:
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs

---

**Made with ❤️ for Harvest Videos**
