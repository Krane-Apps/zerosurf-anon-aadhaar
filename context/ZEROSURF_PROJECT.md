# ZeroSurf

A mobile browser that blocks adult content using zero-knowledge age verification. Users prove they're 18+ without revealing personal information.

## The Problem

Current age verification systems either:
- Collect and store sensitive personal data
- Use easily bypassed client-side checks
- Rely on centralized authorities that can be compromised

Parents struggle with effective content filtering that doesn't invade privacy.

## Solution

ZeroSurf combines three technologies:
1. **Anonymous age verification** using Indian Aadhaar documents via Mopro
2. **Enhanced compliance checking** via Self Protocol onchain integration
3. **Decentralized backend deployment** on Fluence compute network

Users scan their Aadhaar QR code once. The system proves they're 18+ without storing personal details. Content filtering happens through an Express.js backend with AI-powered NSFW detection deployed on Fluence.

## Architecture

### Core Components

**Age Verification Flow:**
```
1. User scans Aadhaar QR → 2. Generate ZK proof → 3. Store proof locally → 4. Access granted
```

**Content Filtering:**
```
1. User visits URL → 2. Send to Fluence backend → 3. Scrape HTML → 4. AI NSFW analysis → 5. Return safe/unsafe JSON
```

**Backend Processing:**
```
1. Express.js receives URL → 2. Scrape website HTML → 3. AI content analysis → 4. NSFW detection API → 5. Return boolean result
```

### Technology Stack

- **Frontend:** React Native + Expo
- **Age Verification:** Mopro + Anon-Aadhaar React Native library
- **Compliance:** Self Protocol onchain SDK
- **Backend:** Express.js deployed on Fluence Virtual Servers
- **Content Analysis:** AI-powered NSFW detection APIs + web scraping
- **Deployment:** Fluence decentralized compute network

## Implementation

### 1. Age Verification (Anon-Aadhaar)

```typescript
import { AnonAadhaarProve, useAnonAadhaar } from 'anon-aadhaar-react-native';

const AgeCheck = () => {
  const [anonAadhaar] = useAnonAadhaar();
  
  return (
    <AnonAadhaarProve
      buttonMessage="Verify Age 18+"
      nullifierSeed={12345}
      fieldsToRevealArray={['revealAgeAbove18']}
    />
  );
};
```

### 2. Enhanced Verification (Self Protocol)

```typescript
import { SelfQRcodeWrapper, SelfAppBuilder } from '@selfxyz/qrcode';

const selfApp = new SelfAppBuilder({
  version: 2,
  appName: "ZeroSurf",
  scope: "zerosurf-v1",
  disclosures: {
    minimumAge: 18,
    ofac: true,
    nationality: true
  }
}).build();
```

### 3. Fluence Backend (Express.js)

```typescript
// Express.js backend deployed on Fluence
import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();

app.post('/check-content', async (req, res) => {
  const { url } = req.body;
  
  try {
    // Scrape website HTML
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const content = $('body').text();
    
    // AI-powered NSFW detection
    const isNSFW = await analyzeContent(content);
    
    res.json({ safe: !isNSFW, url });
  } catch (error) {
    res.status(500).json({ error: 'Content analysis failed' });
  }
});

async function analyzeContent(content: string) {
  // NSFW detection API call
  const nsfwResponse = await axios.post('https://api.nsfwdetection.com/analyze', {
    text: content
  });
  return nsfwResponse.data.isNSFW;
}
```

### 4. Content Filtering

```typescript
class ContentFilter {
  private fluenceBackend = 'https://your-fluence-vm.fluence.dev';
  
  async checkURL(url: string) {
    try {
      // Send URL to Fluence backend for analysis
      const response = await fetch(`${this.fluenceBackend}/check-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const result = await response.json();
      
      if (!result.safe) {
        return { allowed: false, reason: 'nsfw_content_detected' };
      }
      
      return { allowed: true };
    } catch (error) {
      // Fallback to allow if backend is unavailable
      return { allowed: true, reason: 'analysis_failed' };
    }
  }
}
```

## Content Analysis

### NSFW Detection Stack
- **Web Scraping:** Cheerio.js for HTML parsing
- **AI Content Analysis:** NSFW detection APIs (e.g., Sightengine, Google Vision AI)
- **Text Analysis:** Natural language processing for text content
- **Fallback Systems:** Multiple detection layers for accuracy

### Fluence Deployment
```bash
# Deploy Express.js backend on Fluence VM
fvm-cli vm create zerosurf-backend --cpu 2 --memory 4 --wait

# Backend runs on Fluence decentralized infrastructure
# Provides resilient, censorship-resistant content filtering
```

### Implementation Example
```typescript
// NSFW detection with multiple providers
const analyzeContent = async (content: string, images: string[]) => {
  const textAnalysis = await analyzeText(content);
  const imageAnalysis = await analyzeImages(images);
  
  return {
    isNSFW: textAnalysis.isNSFW || imageAnalysis.hasAdultContent,
    confidence: Math.max(textAnalysis.confidence, imageAnalysis.confidence)
  };
};
```

## File Structure

```
zerosurf-mobile/
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx     # Age verification setup
│   │   ├── BrowserScreen.tsx        # Main browser with filtering
│   │   └── ParentalControlScreen.tsx # Admin dashboard
│   ├── components/
│   │   ├── AgeVerification.tsx      # Mopro + Anon-Aadhaar integration
│   │   ├── SelfVerification.tsx     # Self Protocol onchain integration
│   │   └── ContentFilter.tsx        # Fluence backend integration
│   └── utils/
│       ├── fluenceAPI.ts            # Fluence backend communication
│       └── storage.ts               # Local data management
backend/
├── src/
│   ├── app.ts                       # Express.js main server
│   ├── routes/
│   │   └── content.ts              # Content analysis endpoints
│   ├── services/
│   │   ├── scraper.ts              # Web scraping logic
│   │   └── nsfwDetector.ts         # NSFW analysis service
│   └── utils/
│       └── fluenceConfig.ts        # Fluence VM configuration
├── package.json
└── fluence-deploy.sh               # Deployment script
```

## Partner Integration Benefits

### Ethereum Foundation (Mopro)
- Zero-knowledge age proofs
- Privacy-preserving verification
- Offline verification after setup
- **Prize Target:** $1,500 (Best Infrastructure on Client-Side Privacy)

### Self Protocol  
- OFAC sanctions screening
- International document support
- Regulatory compliance features
- **Prize Target:** $5,000 (Best onchain SDK Integration)

### Fluence
- Decentralized compute infrastructure
- Censorship-resistant backend deployment
- CPU-optimized AI inference for content analysis
- **Prize Target:** $5,000 (Best Use of Fluence Virtual Servers)

## Development Timeline

**Week 1:** Basic browser with Mopro + Anon-Aadhaar integration
**Week 2:** Express.js backend with NSFW detection APIs
**Week 3:** Fluence VM deployment and backend optimization
**Week 4:** Self Protocol onchain integration
**Week 5:** Advanced content analysis and parental controls

## Key Features

1. **Anonymous Verification:** Prove age without revealing identity using Mopro
2. **AI-Powered Filtering:** Real-time NSFW detection via Fluence backend
3. **Decentralized Infrastructure:** Censorship-resistant compute on Fluence
4. **Onchain Compliance:** Self Protocol integration for regulatory requirements
5. **Smart Content Analysis:** Web scraping + AI for comprehensive detection
6. **Resilient Architecture:** Distributed backend prevents single points of failure

## Privacy Guarantees

- Age verification data never leaves device (Mopro local proving)
- Zero-knowledge proofs prevent identity linkage
- Decentralized Fluence compute prevents single point of failure
- No browsing history stored on external servers
- Content analysis happens without revealing user identity
- Onchain compliance through Self Protocol maintains regulatory compliance

This system gives parents effective content control while protecting user privacy through cryptographic proofs and decentralized infrastructure. The Fluence backend ensures censorship-resistant content filtering while maintaining user anonymity.