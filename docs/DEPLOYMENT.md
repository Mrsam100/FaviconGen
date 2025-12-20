# Deployment Checklist

Follow this checklist to deploy FaviconGen to production.

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Get Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Create `.env` file locally with `VITE_GEMINI_API_KEY=your_key`
- [ ] Test the app locally with `npm run dev`
- [ ] Verify all features work (icon generation, download, AI analysis)

### 2. Code Quality
- [ ] Remove any console.logs or debug code
- [ ] Check that `.env` is in `.gitignore`
- [ ] Verify no API keys are hardcoded in source files
- [ ] Run `npm run build` locally to test production build
- [ ] Test the production build with `npm run preview`

### 3. Git Repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Create GitHub/GitLab repository
- [ ] Push code: `git push -u origin main`

## 🚀 Vercel Deployment Steps

### Option A: One-Click Deploy Button

1. Click the **Deploy to Vercel** button in README.md
2. Follow the prompts to import repository
3. Add `VITE_GEMINI_API_KEY` when prompted
4. Wait for deployment to complete
5. ✅ Done! Your app is live

### Option B: Manual Vercel Deployment

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your FaviconGen repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add variable:
     ```
     Name: VITE_GEMINI_API_KEY
     Value: your_actual_gemini_api_key_here
     ```
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - ✅ Your app is live at `https://your-project.vercel.app`

## 📦 Post-Deployment Checklist

### Verify Production App
- [ ] Visit your deployed URL
- [ ] Test uploading a logo
- [ ] Verify AI analysis works
- [ ] Test downloading single icons
- [ ] Test downloading ZIP bundle
- [ ] Test on mobile device
- [ ] Check browser console for errors

### Performance & SEO
- [ ] Run [Lighthouse](https://pagespeed.web.dev/) audit
- [ ] Check loading speed
- [ ] Verify all images load correctly
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### Monitoring & Maintenance
- [ ] Bookmark [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Monitor [Gemini API usage](https://aistudio.google.com/)
- [ ] Set up API quota alerts if needed
- [ ] Star the GitHub repo for updates

## 🔧 Updating Your Deployment

### Push Changes
```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push

# Vercel automatically redeploys on push
```

### Update Environment Variables
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Edit or add new variables
4. Redeploy for changes to take effect

## 🐛 Common Deployment Issues

### Build Fails
- **Error**: "Module not found"
  - **Fix**: Run `npm install` locally, commit `package-lock.json`

- **Error**: "Out of memory"
  - **Fix**: Not common with this project, but increase Node memory if needed

### Runtime Errors
- **Error**: "API key not found"
  - **Fix**: Check environment variables in Vercel dashboard
  - **Fix**: Ensure variable name is exactly `VITE_GEMINI_API_KEY`

- **Error**: "Failed to analyze logo"
  - **Fix**: Check Gemini API key is valid
  - **Fix**: Check API quota hasn't been exceeded

### Performance Issues
- **Slow Loading**: Check network tab in browser DevTools
- **Large Bundle**: Already optimized with Vite code-splitting
- **API Slow**: Gemini API can be slow sometimes, this is normal

## 📊 Production Monitoring

### Vercel Analytics (Free)
1. Go to Vercel Dashboard → Your Project
2. Click "Analytics" tab
3. View page views, performance metrics

### Gemini API Usage
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Check "API Usage" section
3. Monitor daily/monthly quotas

## 🎉 You're Live!

Your FaviconGen app is now deployed and ready to use!

Share your deployment URL:
- `https://your-project.vercel.app`

Consider:
- Adding a custom domain in Vercel settings
- Sharing on social media
- Contributing improvements back to the project
