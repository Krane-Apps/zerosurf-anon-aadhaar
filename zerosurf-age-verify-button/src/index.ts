// main exports
export { ZeroSurfButton } from './ZeroSurfButton';
export type { 
  ZeroSurfButtonProps, 
  VerificationResult, 
  ZeroSurfConfig 
} from './types';
export {
  createDeeplinkUrl,
  parseVerificationResult,
  cleanUrlParameters,
  launchZeroSurfApp,
  isMobileDevice,
  trackEvent,
  generateChallenge,
  DEFAULT_CONFIG,
} from './utils';