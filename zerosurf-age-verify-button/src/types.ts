export interface VerificationResult {
  verified: boolean;
  proof?: string;
  timestamp: number;
}

export interface ZeroSurfButtonProps {
  // callback functions
  onSuccess?: (result: VerificationResult) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  
  // customization
  buttonText?: string;
  loadingText?: string;
  theme?: 'light' | 'dark' | 'custom';
  className?: string;
  style?: React.CSSProperties;
  
  // behavior
  disabled?: boolean;
  timeout?: number; // timeout in ms for app launch fallback
  
  // advanced
  customDeeplinkScheme?: string;
  customChallenge?: string;
  enableAnalytics?: boolean;
}

export interface ZeroSurfConfig {
  appScheme: string;
  fallbackTimeout: number;
  analyticsEnabled: boolean;
}