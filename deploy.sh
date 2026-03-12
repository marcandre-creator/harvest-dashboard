#!/bin/bash

# 🚀 HARVEST DASHBOARD DEPLOYMENT HELPER
# This script helps you deploy the dashboard to Vercel

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🚀 HARVEST VIDEOS DASHBOARD - VERCEL DEPLOYMENT       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ ERROR: .env.local not found!"
    echo ""
    echo "Please create .env.local with:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here"
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "🚀 Initial commit: Harvest Videos Dashboard"
    echo "✅ Git repository initialized"
    echo ""
fi

# Show next steps
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              NEXT STEPS FOR DEPLOYMENT                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  CREATE GITHUB REPOSITORY:"
echo "   • Go to https://github.com/new"
echo "   • Name: harvest-dashboard"
echo "   • Create repository"
echo ""
echo "2️⃣  PUSH TO GITHUB:"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/harvest-dashboard.git"
echo "   git push -u origin main"
echo ""
echo "3️⃣  DEPLOY TO VERCEL:"
echo "   • Go to https://vercel.com/import"
echo "   • Select your GitHub repo"
echo "   • Add Environment Variables:"
echo "      ✓ NEXT_PUBLIC_SUPABASE_URL"
echo "      ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   • Click Deploy!"
echo ""
echo "4️⃣  OPEN YOUR DASHBOARD:"
echo "   • Vercel will give you a URL"
echo "   • Visit and watch it monitor your videos in real-time! 🎬"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   HAPPY DEPLOYING! 🚀                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
