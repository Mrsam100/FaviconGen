# 🚀 Quick Deploy Guide

## Deploy to Vercel in 3 Minutes

### Step 1: Get Your API Key (1 minute)
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

### Step 2: Push to GitHub (1 minute)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/FaviconGen.git
git push -u origin main
```

### Step 3: Deploy to Vercel (1 minute)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variable:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key from Step 1
4. Click "Deploy"
5. ✅ Done! Your app is live!

---

## Alternative: Deploy with CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable when prompted:
# VITE_GEMINI_API_KEY=your_key_here

# Deploy to production
vercel --prod
```

---

## ✅ Verify Deployment

After deployment, test your app:
- [ ] Upload a logo
- [ ] Check AI analysis works
- [ ] Download single icon
- [ ] Download ZIP bundle
- [ ] Test on mobile

---

## 📚 Need Help?

- **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Troubleshooting**: See [README.md](./README.md#troubleshooting)
- **Issues**: Open an issue on GitHub

---

**Your app will be live at**: `https://your-project.vercel.app`

Enjoy! 🎉
