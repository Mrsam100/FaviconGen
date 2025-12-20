<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FaviconGen

**AI-Powered Favicon & App Icon Generator**

Upload your logo. AI analyzes it and generates perfect app icons and favicons for all platforms—iOS, Android, and web. One upload, every size.

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/FaviconGen&env=VITE_GEMINI_API_KEY&envDescription=Gemini%20API%20key%20required%20for%20AI%20features&envLink=https://aistudio.google.com/app/apikey&project-name=favicongen&repository-name=favicongen)

</div>

## ✨ Features

- **🎨 AI-Powered Analysis**: Gemini AI automatically detects optimal colors, padding, and contrast
- **📱 Multi-Platform Support**: Generates icons for iOS, Android, PWA, and legacy browsers
- **⚡ One-Click Download**: Export all icons as a ZIP file with HTML integration snippets
- **🔒 Secure & Private**: All processing happens client-side; your images never leave your browser
- **♿ Accessible**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **📦 Additional Tools**:
  - Business card scanner with AI OCR
  - File summarization tool
  - AI literacy assistant chatbot

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Gemini API key ([Get one free here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FaviconGen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🔐 Security

FaviconGen has been built with security as a top priority:

### Security Features

- ✅ **No API Key Exposure**: API keys are properly secured using Vite environment variables
- ✅ **Content Security Policy**: XSS protection via CSP headers
- ✅ **Input Sanitization**: All user inputs are sanitized before processing
- ✅ **Secure ID Generation**: Uses `crypto.randomUUID()` instead of `Math.random()`
- ✅ **File Validation**: Strict file type and size validation (10MB max)
- ✅ **Error Handling**: Comprehensive error boundaries prevent crashes
- ✅ **Rate Limiting**: API calls are rate-limited to prevent quota exhaustion
- ✅ **Retry Logic**: Exponential backoff for failed API calls
- ✅ **Secure Storage**: Safe localStorage wrapper with error handling

### Important Security Notes

1. **Never commit your `.env` file** - It contains your API key
2. **Use environment variables only** - Don't hardcode API keys in source code
3. **Validate all uploads** - The app validates file types and sizes automatically
4. **Monitor API usage** - Keep an eye on your Gemini API quota

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **AI**: Google Gemini API (gemini-3-flash-preview)
- **Styling**: Tailwind CSS with glassmorphism design
- **Canvas API**: For image manipulation and icon generation
- **JSZip**: For bundling generated icons

## 📦 Project Structure

```
FaviconGen/
├── components/          # React components
│   ├── IconGenerator.tsx    # Main icon generation interface
│   ├── ResultView.tsx       # Results and download UI
│   ├── Hero.tsx            # Landing page hero
│   ├── Features.tsx        # Features showcase
│   ├── Toast.tsx           # Toast notifications
│   ├── ErrorBoundary.tsx   # Error handling
│   └── ...
├── services/           # External service integrations
│   └── geminiService.ts    # Gemini AI API wrapper
├── utils/              # Utility functions
│   ├── sanitization.ts     # Input sanitization
│   ├── storage.ts          # Secure localStorage wrapper
│   ├── idGenerator.ts      # Secure ID generation
│   └── errorHandling.ts    # Error handling utilities
├── types.ts            # TypeScript type definitions
├── .env.example        # Environment variable template
└── index.html          # Entry point with CSP headers
```

## 🎯 Usage Guide

### Generating Icons

1. Click "Start Creation" on the homepage
2. Upload your logo (PNG, JPG, or SVG)
3. Wait for AI analysis (automatically detects colors and padding)
4. Customize if needed (optional)
5. Click "Download Production Bundle" to get all icons in a ZIP file

### Icon Sizes Generated

- **iOS**: 180x180, 152x152, 120x120, 76x76
- **Android**: 192x192, 512x512, 144x144, 96x96, 48x48
- **Web**: 32x32, 16x16
- **Microsoft**: 144x144, 70x70
- **Legacy**: favicon.ico

### Integration

The downloaded ZIP includes:
- All icon files (PNG format)
- `integration.html` - Copy-paste HTML snippet for your `<head>`
- `manifest.json` - Web app manifest for PWAs

## 🚀 Deploy to Vercel

### One-Click Deployment

The easiest way to deploy FaviconGen is using Vercel:

1. **Push your code to GitHub** (or GitLab/Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect it's a Vite project

3. **Add Environment Variables**
   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**
   - Add: `VITE_GEMINI_API_KEY` with your Gemini API key
   - Click "Save"

4. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Manual Deployment via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# Add environment variable
vercel env add VITE_GEMINI_API_KEY

# Deploy to production
vercel --prod
```

### Build Locally and Deploy

```bash
# Build the project
npm run build

# The dist/ folder is ready to deploy
# Upload dist/ to any static hosting service
```

### Important Notes for Deployment

- ✅ **Environment Variables**: Make sure to set `VITE_GEMINI_API_KEY` in your Vercel project settings
- ✅ **Build Command**: `npm run build` (auto-detected by Vercel)
- ✅ **Output Directory**: `dist` (auto-detected by Vercel)
- ✅ **Framework**: Vite (auto-detected by Vercel)
- ✅ **Node Version**: 18.x or higher (set in Vercel if needed)
- ⚠️ **API Key Security**: Never commit your `.env` file to Git
- ⚠️ **Quota Management**: Monitor your Gemini API usage on Google AI Studio

## 🐛 Troubleshooting

### Common Issues

**Problem**: "API key not found" error

**Solution**:
1. Make sure you created a `.env` file (not `.env.local`)
2. Check that the variable name is exactly `VITE_GEMINI_API_KEY`
3. Restart the dev server after adding the API key

---

**Problem**: "Failed to analyze logo" error

**Solution**:
1. Check your internet connection
2. Verify your API key is valid at [AI Studio](https://aistudio.google.com/)
3. Ensure the image file is under 10MB
4. Try with a different image format (PNG recommended)

---

**Problem**: Download button doesn't work

**Solution**:
1. Check browser console for errors
2. Ensure pop-ups are not blocked
3. Try a different browser (Chrome/Firefox recommended)

---

**Problem**: Icons look cut off

**Solution**:
1. Increase padding percentage in the customization panel
2. Ensure your logo has transparent background
3. Try uploading a higher resolution image

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

Apache-2.0

## 🔗 Links

- **[📋 Deployment Guide](./DEPLOYMENT.md)** - Complete step-by-step deployment checklist
- **[🚀 Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/FaviconGen)** - One-click deployment
- **[🔑 Get Gemini API Key](https://aistudio.google.com/app/apikey)** - Free API key for AI features
- **[🐛 Report Issues](https://github.com/your-repo/issues)** - Bug reports and feature requests

---

Made with ❤️ using React, TypeScript, and Gemini AI
