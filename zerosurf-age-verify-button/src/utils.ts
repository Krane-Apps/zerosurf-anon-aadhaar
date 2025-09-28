import { ZeroSurfConfig, VerificationResult } from './types';

// default configuration
export const DEFAULT_CONFIG: ZeroSurfConfig = {
  appScheme: 'zerosurf',
  fallbackTimeout: 3000,
  analyticsEnabled: false,
};

// generate unique challenge for verification
export function generateChallenge(): string {
  return `verification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// create deeplink url for zerosurf app
export function createDeeplinkUrl(
  returnUrl: string, 
  challenge?: string, 
  customScheme?: string
): string {
  const scheme = customScheme || DEFAULT_CONFIG.appScheme;
  const encodedReturnUrl = encodeURIComponent(returnUrl);
  const finalChallenge = challenge || generateChallenge();
  
  return `${scheme}://verify?returnUrl=${encodedReturnUrl}&challenge=${finalChallenge}`;
}

// parse verification result from url parameters
export function parseVerificationResult(): VerificationResult | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const verified = urlParams.get('verified');
  const proof = urlParams.get('proof');
  
  if (verified === 'true') {
    return {
      verified: true,
      proof: proof || undefined,
      timestamp: Date.now(),
    };
  } else if (verified === 'false') {
    return {
      verified: false,
      timestamp: Date.now(),
    };
  }
  
  return null;
}

// clean url parameters after processing
export function cleanUrlParameters(): void {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.searchParams.delete('verified');
  url.searchParams.delete('proof');
  
  window.history.replaceState({}, document.title, url.toString());
}

// launch zerosurf app with fallback
export function launchZeroSurfApp(
  deeplinkUrl: string,
  onTimeout?: () => void,
  timeout: number = DEFAULT_CONFIG.fallbackTimeout
): void {
  // attempt to launch the app
  window.location.href = deeplinkUrl;
  
  // set fallback timeout
  if (onTimeout) {
    setTimeout(() => {
      onTimeout();
    }, timeout);
  }
}

// detect if user is on mobile device
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// analytics helper (placeholder for future implementation)
export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  if (DEFAULT_CONFIG.analyticsEnabled) {
    console.log(`ZeroSurf Analytics: ${eventName}`, properties);
    // implement actual analytics here (google analytics, mixpanel, etc.)
  }
}