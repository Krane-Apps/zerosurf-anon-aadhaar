# ZeroSurf - Built on top of Anon Aadhaar

<video width="100%" controls>
  <source src="https://github.com/user-attachments/assets/303ea1ae-9dcc-422a-86f7-cc552f211f49" type="video/mp4">
  Your browser does not support the video tag.
</video>

<img src="https://img.shields.io/badge/Zero_Knowledge-Privacy_First-4ade80?style=for-the-badge&logo=shield" alt="Zero Knowledge">
<img src="https://img.shields.io/badge/Mobile-React_Native-61dafb?style=for-the-badge&logo=react" alt="React Native">
<img src="https://img.shields.io/badge/Backend-Express_JS-000000?style=for-the-badge&logo=express" alt="Express">
<img src="https://img.shields.io/badge/Deploy-Fluence-8b5cf6?style=for-the-badge" alt="Fluence">

**Privacy-first mobile browser with zero-knowledge age verification**

*No personal data • Cryptographic proofs • Decentralized backend*

## The Problem

Current age verification systems are fundamentally broken:

- Traditional systems collect and store sensitive personal data (ID documents, addresses, birthdates)
- Client-side checks can be disabled with simple browser tools  
- Single points of failure that can be compromised or censored
- No effective content filtering that respects user privacy

Parents need reliable content control without sacrificing their family's digital privacy.

## My Solution

ZeroSurf combines cutting-edge technologies to solve age verification while preserving privacy:

1. **Zero-Knowledge Age Proofs** using Aadhaar documents via Mopro
2. **AI-Powered Content Filtering** through decentralized Fluence backend  
3. **Enhanced Compliance** via Self Protocol onchain integration
4. **Web Integration** through our NPM package for any website

Users scan their Aadhaar QR code once to generate a cryptographic proof they're 18+ without revealing any personal information. Content filtering happens through an AI-powered backend deployed on Fluence's decentralized network.

## Ecosystem Components

### NPM Package for Websites

<img src="https://img.shields.io/npm/v/zerosurf-age-verify-button?style=for-the-badge&color=10b981" alt="NPM Version">
<img src="https://img.shields.io/npm/dt/zerosurf-age-verify-button?style=for-the-badge&color=3b82f6" alt="NPM Downloads">

**[zerosurf-age-verify-button](https://www.npmjs.com/package/zerosurf-age-verify-button)** - Drop-in React component for age verification

```bash
npm install zerosurf-age-verify-button
```

```tsx
import { ZeroSurfButton } from 'zerosurf-age-verify-button';

<ZeroSurfButton
  onSuccess={(result) => console.log('User verified!', result)}
  buttonText="Verify Age with ZeroSurf"
  theme="dark"
/>
```

### Mobile App

**ZeroSurf Mobile** - React Native browser with built-in content filtering and age verification

- Real-time NSFW content detection
- Zero-knowledge proof generation from Aadhaar
- Seamless deeplink integration with websites
- Privacy-preserving browsing experience

### Demo Website  

**[Live Demo](https://zerosurf-anon-aadhaar.vercel.app/)** - Test the complete verification flow

Experience the full ZeroSurf ecosystem in action. Click the verification button and see how users seamlessly move between web and mobile for privacy-first age verification.

### Decentralized Backend

**Express.js on Fluence** - AI-powered content analysis backend

- Web scraping and HTML parsing
- NSFW detection using multiple AI providers  
- Deployed on Fluence Virtual Servers for censorship resistance
- RESTful API for content safety analysis

## How It Works

<img src="https://img.shields.io/badge/Step_1-Click_Button-4f46e5?style=for-the-badge" alt="Step 1">
<img src="https://img.shields.io/badge/Step_2-Open_ZeroSurf-7c3aed?style=for-the-badge" alt="Step 2">
<img src="https://img.shields.io/badge/Step_3-Scan_Aadhaar-a855f7?style=for-the-badge" alt="Step 3">
<img src="https://img.shields.io/badge/Step_4-Generate_Proof-c084fc?style=for-the-badge" alt="Step 4">
<img src="https://img.shields.io/badge/Step_5-Return_Verified-10b981?style=for-the-badge" alt="Step 5">

1. **User clicks** verification button on any website using our NPM package
2. **Browser opens** ZeroSurf mobile app via deeplink
3. **User scans** their Aadhaar QR code (one-time setup)
4. **App generates** zero-knowledge proof of age without revealing personal data
5. **User returns** to website with cryptographic verification

**For Content Filtering:**
1. User visits URL in ZeroSurf browser
2. URL sent to Fluence backend for analysis  
3. AI-powered NSFW detection analyzes content
4. Safe/unsafe result returned to mobile app
5. Content blocked or allowed based on verification status

## Technology Stack

- **Frontend**: React Native + Expo
- **Age Verification**: Mopro + Anon-Aadhaar  
- **Compliance**: Self Protocol onchain SDK
- **Backend**: Express.js on Fluence Virtual Servers
- **Content Analysis**: AI-powered NSFW detection APIs
- **Web Integration**: TypeScript NPM package

## Repository Structure

```
├── zerosurf-mobile/                 # React Native mobile browser
├── zerosurf-age-verify-button/      # NPM package for websites  
├── backend/                         # Express.js Fluence backend
├── demo-site/                       # Example integration website
├── src/                             # Core anon-aadhaar library
└── context/                         # Project documentation
```

## Privacy Guarantees

- **Zero Personal Data**: Age verification data never leaves device
- **Cryptographic Proofs**: Mathematical verification without identity linkage
- **Decentralized Infrastructure**: No single point of failure via Fluence
- **No Tracking**: Browsing history stays private
- **Anonymous Analysis**: Content filtering without revealing user identity

## Quick Start

### For Websites (NPM Package)

```bash
npm install zerosurf-age-verify-button
```

### For Mobile Development

```bash
git clone https://github.com/your-repo/zerosurf-anon-aadhaar
cd zerosurf-anon-aadhaar
yarn install
cd zerosurf-mobile
npx expo start
```

### For Backend Development

```bash
cd backend
npm install
npm run dev
```

## Links

- **NPM Package**: [zerosurf-age-verify-button](https://www.npmjs.com/package/zerosurf-age-verify-button)
- **Live Demo**: [https://zerosurf-anon-aadhaar.vercel.app/](https://zerosurf-anon-aadhaar.vercel.app/)
- **Documentation**: [Project Context](context/ZEROSURF_PROJECT.md)

## License

MIT


