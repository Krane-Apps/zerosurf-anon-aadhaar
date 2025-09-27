# ZeroSurf Demo Website

A demonstration website showcasing deeplink integration with ZeroSurf mobile app for privacy-first age verification using Aadhaar-based zero-knowledge proofs.

## Features

🔞 **Age Verification Gate**: Blocks access to age-restricted content until verified
🛡️ **Privacy-First**: Uses zero-knowledge proofs - no personal data shared
📱 **Deeplink Integration**: Seamlessly opens ZeroSurf app for verification
🔄 **Return Flow**: Handles verification completion and returns users to website
✨ **Modern UI**: Clean, responsive design with Tailwind CSS

## How It Works

### 1. Initial State
- User lands on age verification page
- Shows warning about age-restricted content
- Displays privacy protection features

### 2. Verification Flow
1. User clicks "Verify Age with Aadhaar" button
2. Website creates deeplink: `zerosurf://verify?returnUrl=${siteUrl}&challenge=age-verification-demo`
3. Opens ZeroSurf mobile app
4. User completes Aadhaar-based age verification in app
5. App returns to website with verification status

### 3. Post-Verification
- Website checks URL parameters for verification status
- If verified, grants access to age-restricted content
- Shows verified features and demo content sections

## Deeplink URL Structure

```
zerosurf://verify?returnUrl=${encodedSiteUrl}&challenge=${challengeId}
```

**Parameters:**
- `returnUrl`: The website URL to return to after verification
- `challenge`: Unique identifier for this verification request

## Return URL Structure

After successful verification, the app returns to:

```
${returnUrl}?verified=true&proof=${zkProofHash}
```

**Parameters:**
- `verified`: Boolean indicating verification status
- `proof`: Hash/identifier of the zero-knowledge proof

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment
- **Development**: http://localhost:3000
- **Production**: Deploy to Vercel, Netlify, or any hosting platform

## Testing the Integration

### With ZeroSurf App (Production)
1. Deploy this demo site to a public URL
2. Install ZeroSurf app on mobile device
3. Open demo site in mobile browser
4. Click verification button - should open ZeroSurf app
5. Complete verification in app
6. Should return to demo site with verified status

### Local Testing
1. Run `npm run dev`
2. Open http://localhost:3000
3. Click verification button 
4. Will show fallback message (app not installed)
5. For testing, manually add URL params: `?verified=true&proof=demo123`

## Integration Guide

To integrate ZeroSurf verification into your website:

### 1. Add Verification Button
```typescript
const handleVerifyAge = () => {
  const returnUrl = encodeURIComponent(window.location.origin);
  const deeplink = `zerosurf://verify?returnUrl=${returnUrl}&challenge=your-challenge-id`;
  window.location.href = deeplink;
};
```

### 2. Handle Return Flow
```typescript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const verified = urlParams.get('verified');
  const proof = urlParams.get('proof');
  
  if (verified === 'true' && proof) {
    // User is verified, grant access
    setIsVerified(true);
  }
}, []);
```

### 3. Fallback Handling
```typescript
// Detect if app didn't open (fallback after timeout)
setTimeout(() => {
  // Show app store link or installation instructions
}, 3000);
```

## Security Considerations

- **Proof Verification**: In production, verify the returned proof hash on your backend
- **Challenge Validation**: Use unique challenge IDs to prevent replay attacks  
- **HTTPS Only**: Ensure all communications happen over HTTPS
- **Session Management**: Implement proper session handling for verified users

## Demo Scenarios

### Adult Content Sites
- Age verification before accessing 18+ content
- Gaming sites with mature content
- Dating platforms
- Educational content with age restrictions

### Benefits
- **Privacy**: No personal data collection
- **Compliance**: Meets age verification requirements
- **User Experience**: One-tap verification
- **Trust**: Cryptographic proof of age

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Deployment**: Ready for Vercel/Netlify

## Support

For integration support or questions:
- Check ZeroSurf documentation
- Review mobile app deeplink implementation
- Test with demo scenarios provided