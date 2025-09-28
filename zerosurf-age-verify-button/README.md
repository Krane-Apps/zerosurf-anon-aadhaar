<div align="center">

# ZeroSurf Age Verification Button

<img src="https://img.shields.io/npm/v/zerosurf-age-verify-button?style=for-the-badge&color=10b981" alt="NPM Version">
<img src="https://img.shields.io/npm/dt/zerosurf-age-verify-button?style=for-the-badge&color=3b82f6" alt="NPM Downloads">
<img src="https://img.shields.io/github/license/Krane-Apps/zerosurf-anon-aadhaar?style=for-the-badge&color=8b5cf6" alt="License">
<img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript">

**Zero-knowledge age verification component for React applications**

*Privacy-first • Aadhaar-powered • Mobile-optimized*

[NPM Package](https://www.npmjs.com/package/zerosurf-age-verify-button) • 
[Mobile App](https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/zerosurf-mobile) • 
[Live Demo](https://zerosurf-anon-aadhaar.vercel.app/) • 
[Backend](https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/backend)

</div>

---

## Features

<table>
<tr>
<td>

**Zero-Knowledge Proof**  
Age verification without revealing personal data

**Easy Integration**  
Drop-in React component with TypeScript support

</td>
<td>

**Mobile Optimized**  
Seamless deeplink integration with ZeroSurf app

**Customizable**  
Multiple themes and styling options

</td>
</tr>
</table>

## Quick Start

### Installation

```bash
npm install zerosurf-age-verify-button
```

### Basic Usage

```tsx
import { ZeroSurfButton } from 'zerosurf-age-verify-button';

function App() {
  return (
    <ZeroSurfButton
      onSuccess={(result) => {
        console.log('User verified!', result);
        // redirect to age-restricted content
      }}
      onError={(error) => {
        console.error('Verification failed:', error);
      }}
      buttonText="Verify Age with ZeroSurf"
      theme="dark"
    />
  );
}
```

## How It Works

<div align="center">
<img src="https://img.shields.io/badge/Step_1-User_Clicks_Button-4f46e5?style=for-the-badge" alt="Step 1">
<img src="https://img.shields.io/badge/Step_2-Opens_ZeroSurf_App-7c3aed?style=for-the-badge" alt="Step 2">
<img src="https://img.shields.io/badge/Step_3-Scans_Aadhaar_QR-a855f7?style=for-the-badge" alt="Step 3">
</div>

<div align="center">
<img src="https://img.shields.io/badge/Step_4-Generates_ZK_Proof-c084fc?style=for-the-badge" alt="Step 4">
<img src="https://img.shields.io/badge/Step_5-Returns_to_Website-ddd6fe?style=for-the-badge" alt="Step 5">
<img src="https://img.shields.io/badge/Step_6-Verification_Complete-10b981?style=for-the-badge" alt="Step 6">
</div>

1. **User clicks** the verification button on your website
2. **Browser opens** ZeroSurf mobile app via deeplink  
3. **User scans** their Aadhaar QR code in the app
4. **App generates** zero-knowledge proof of age (18+)
5. **User returns** to website with verification result
6. **Website receives** proof without any personal data

## Try It Live

<div align="center">

### [**Live Demo Website**](https://zerosurf-anon-aadhaar.vercel.app/)

*Test the complete flow with the ZeroSurf mobile app*

**Demo Site Source:** [View Code](https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/demo-site)

</div>

## Component API

### Props

<table>
<tr>
<th>Prop</th>
<th>Type</th>
<th>Default</th>
<th>Description</th>
</tr>
<tr>
<td><code>onSuccess</code></td>
<td><code>(result: VerificationResult) => void</code></td>
<td>-</td>
<td>Called when verification succeeds</td>
</tr>
<tr>
<td><code>onError</code></td>
<td><code>(error: Error) => void</code></td>
<td>-</td>
<td>Called when verification fails</td>
</tr>
<tr>
<td><code>buttonText</code></td>
<td><code>string</code></td>
<td>"I swear I am 18+ years old"</td>
<td>Button display text</td>
</tr>
<tr>
<td><code>theme</code></td>
<td><code>'light' | 'dark' | 'custom'</code></td>
<td><code>'light'</code></td>
<td>Visual theme</td>
</tr>
<tr>
<td><code>className</code></td>
<td><code>string</code></td>
<td><code>''</code></td>
<td>CSS class name</td>
</tr>
<tr>
<td><code>style</code></td>
<td><code>React.CSSProperties</code></td>
<td><code>{}</code></td>
<td>Inline styles</td>
</tr>
<tr>
<td><code>disabled</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Disable interaction</td>
</tr>
<tr>
<td><code>timeout</code></td>
<td><code>number</code></td>
<td><code>3000</code></td>
<td>App launch timeout (ms)</td>
</tr>
<tr>
<td><code>enableAnalytics</code></td>
<td><code>boolean</code></td>
<td><code>false</code></td>
<td>Enable event tracking</td>
</tr>
</table>

## Types

```tsx
interface VerificationResult {
  verified: boolean;
  proof?: string;
  timestamp: number;
}
```

## Styling

### Themes

```tsx
// Light theme (default)
<ZeroSurfButton theme="light" />

// Dark theme
<ZeroSurfButton theme="dark" />

// Custom styling
<ZeroSurfButton 
  theme="custom"
  style={{
    background: 'linear-gradient(45deg, #purple, #pink)',
    color: 'white',
    borderRadius: '20px'
  }}
/>
```

### CSS Classes

```tsx
<ZeroSurfButton 
  className="my-custom-button"
  style={{ width: '100%' }}
/>
```

## Advanced Usage

### Custom Analytics

```tsx
<ZeroSurfButton
  enableAnalytics={true}
  onSuccess={(result) => {
    // your analytics
    gtag('event', 'age_verification_success');
  }}
/>
```

### Custom Deeplink Scheme

```tsx
<ZeroSurfButton
  customDeeplinkScheme="myapp"
  customChallenge="custom-verification-id"
/>
```

### Error Handling

```tsx
<ZeroSurfButton
  onError={(error) => {
    if (error.message.includes('install')) {
      // show app installation instructions
      showAppInstallModal();
    } else {
      // handle other errors
      showErrorMessage(error.message);
    }
  }}
/>
```

## Utility Functions

```tsx
import { 
  createDeeplinkUrl, 
  parseVerificationResult,
  isMobileDevice 
} from 'zerosurf-age-verify-button';

// create custom deeplink
const url = createDeeplinkUrl('https://mysite.com', 'my-challenge');

// check if on mobile
if (isMobileDevice()) {
  // show mobile-specific UI
}

// manually parse verification result
const result = parseVerificationResult();
```

## Requirements

- React 16.8+
- ZeroSurf mobile app installed on user's device
- Website must be served over HTTPS (required for deeplinks)

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Security Notes

- Zero personal data is transmitted to your website
- Only age verification (18+) status and proof hash are shared
- Proof is cryptographically verifiable but reveals no identity
- No tracking or storage of user information

## License

MIT

## Architecture

<div align="center">
<table>
<tr>
<th>Component</th>
<th>Repository</th>
<th>Description</th>
</tr>
<tr>
<td><strong>NPM Package</strong></td>
<td><a href="https://www.npmjs.com/package/zerosurf-age-verify-button">NPM Registry</a></td>
<td>React component for websites</td>
</tr>
<tr>
<td><strong>Mobile App</strong></td>
<td><a href="https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/zerosurf-mobile">Source Code</a></td>
<td>React Native app for proof generation</td>
</tr>
<tr>
<td><strong>Demo Site</strong></td>
<td><a href="https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/demo-site">Source Code</a> | <a href="https://zerosurf-anon-aadhaar.vercel.app/">Live Demo</a></td>
<td>Example implementation</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td><a href="https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/backend">Source Code</a></td>
<td>Fluence-deployed verification backend</td>
</tr>
</table>
</div>

## Security & Privacy

<div align="center">
<table>
<tr>
<td align="center">
<img src="https://img.shields.io/badge/Zero_Knowledge-Proof-4ade80?style=for-the-badge&logo=shield" alt="Zero Knowledge">
<br><strong>Zero Personal Data</strong><br>No identity information transmitted
</td>
<td align="center">
<img src="https://img.shields.io/badge/Cryptographic-Verification-06b6d4?style=for-the-badge&logo=lock" alt="Cryptographic">
<br><strong>Cryptographically Secure</strong><br>Mathematically verifiable proofs
</td>
<td align="center">
<img src="https://img.shields.io/badge/Privacy-First-8b5cf6?style=for-the-badge&logo=eye-slash" alt="Privacy">
<br><strong>No Tracking</strong><br>Zero user data storage
</td>
</tr>
</table>
</div>

## Requirements

- **React 16.8+** with Hooks support
- **HTTPS Website** (required for deeplinks)  
- **ZeroSurf Mobile App** installed on user's device

## Browser Support

<div align="center">
<img src="https://img.shields.io/badge/Chrome-70+-4285f4?style=for-the-badge&logo=googlechrome" alt="Chrome">
<img src="https://img.shields.io/badge/Firefox-65+-ff7139?style=for-the-badge&logo=firefox" alt="Firefox">
<img src="https://img.shields.io/badge/Safari-12+-000000?style=for-the-badge&logo=safari" alt="Safari">
<img src="https://img.shields.io/badge/Edge-79+-0078d4?style=for-the-badge&logo=microsoftedge" alt="Edge">
</div>

## Support & Links

<div align="center">

**Quick Links**
  
[NPM Package](https://www.npmjs.com/package/zerosurf-age-verify-button) • 
[Mobile App](https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/zerosurf-mobile) • 
[Live Demo](https://zerosurf-anon-aadhaar.vercel.app/) • 
[Backend](https://github.com/Krane-Apps/zerosurf-anon-aadhaar/tree/main/backend)

**Documentation**

[Full Documentation](https://github.com/Krane-Apps/zerosurf-anon-aadhaar) • 
[Report Issues](https://github.com/Krane-Apps/zerosurf-anon-aadhaar/issues) • 
[Feature Requests](https://github.com/Krane-Apps/zerosurf-anon-aadhaar/discussions)

**License:** MIT

</div>

---

<div align="center">

**Made with ❤️ by [bluntbrain](https://github.com/bluntbrain)**

*Empowering privacy-first age verification for the modern web*

</div>