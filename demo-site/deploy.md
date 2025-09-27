# Deployment Guide

## Quick Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from demo-site directory
vercel

# Follow prompts and your site will be live at:
# https://your-project-name.vercel.app
```

### 2. Netlify
```bash
# Build the project
npm run build

# Deploy build folder to Netlify
# Upload 'out' folder or connect GitHub repo
```

### 3. Manual Testing
```bash
# Run locally
npm run dev

# Test deeplink locally (add URL params manually):
# http://localhost:3000?verified=true&proof=demo123
```

## Environment Variables (Optional)

Create `.env.local` for custom configuration:

```bash
NEXT_PUBLIC_APP_SCHEME=zerosurf
NEXT_PUBLIC_CHALLENGE_PREFIX=demo
```

## Testing Deeplinks

### iOS Simulator
1. Deploy site to public URL
2. Open Safari in iOS Simulator
3. Navigate to your deployed site
4. Click verification button
5. Should show app not installed (expected in simulator)

### Android Emulator
1. Install ZeroSurf APK in emulator
2. Open deployed site in Chrome
3. Click verification button
4. Should open ZeroSurf app

### Real Device Testing
1. Install ZeroSurf app on phone
2. Open deployed site URL
3. Click verification - app should open
4. Complete verification in app
5. Should return to site with verified status

## Production Checklist

- [ ] Deploy to public HTTPS URL
- [ ] Test deeplink opens app correctly
- [ ] Verify return flow works
- [ ] Test fallback for users without app
- [ ] Check mobile responsive design
- [ ] Validate proof verification logic