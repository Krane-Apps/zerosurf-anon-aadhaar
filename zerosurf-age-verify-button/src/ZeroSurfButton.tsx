import React, { useState, useEffect } from 'react';
import { ZeroSurfButtonProps, VerificationResult } from './types';
import { 
  createDeeplinkUrl, 
  parseVerificationResult, 
  cleanUrlParameters, 
  launchZeroSurfApp, 
  isMobileDevice,
  trackEvent 
} from './utils';

export const ZeroSurfButton: React.FC<ZeroSurfButtonProps> = ({
  onSuccess,
  onError,
  onCancel,
  buttonText = "🙋‍♂️ I swear I am 18+ years old",
  loadingText = "Opening ZeroSurf...",
  theme = 'light',
  className = '',
  style = {},
  disabled = false,
  timeout = 3000,
  customDeeplinkScheme,
  customChallenge,
  enableAnalytics = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // check for verification result on component mount
  useEffect(() => {
    const result = parseVerificationResult();
    if (result) {
      if (result.verified) {
        setIsVerified(true);
        onSuccess?.(result);
        if (enableAnalytics) {
          trackEvent('verification_success', { proof: !!result.proof });
        }
      } else {
        onError?.(new Error('Verification failed'));
        if (enableAnalytics) {
          trackEvent('verification_failed');
        }
      }
      
      // clean url parameters
      cleanUrlParameters();
    }
  }, [onSuccess, onError, enableAnalytics]);

  const handleVerifyAge = () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    
    if (enableAnalytics) {
      trackEvent('verification_started', { 
        isMobile: isMobileDevice(),
        customScheme: !!customDeeplinkScheme 
      });
    }
    
    try {
      // create deeplink to zerosurf app
      const currentUrl = window.location.origin + window.location.pathname;
      const deeplinkUrl = createDeeplinkUrl(
        currentUrl, 
        customChallenge, 
        customDeeplinkScheme
      );
      
      // launch the app with fallback
      launchZeroSurfApp(
        deeplinkUrl,
        () => {
          setIsLoading(false);
          const errorMsg = 'Please install ZeroSurf app to verify your age.';
          onError?.(new Error(errorMsg));
          
          if (enableAnalytics) {
            trackEvent('app_launch_failed', { timeout });
          }
          
          // optionally redirect to app store
          if (isMobileDevice()) {
            // could redirect to play store/app store here
            console.log('Redirect to app store...');
          }
        },
        timeout
      );
      
    } catch (error) {
      setIsLoading(false);
      onError?.(error as Error);
      
      if (enableAnalytics) {
        trackEvent('verification_error', { error: (error as Error).message });
      }
    }
  };

  const resetVerification = () => {
    setIsVerified(false);
    if (enableAnalytics) {
      trackEvent('verification_reset');
    }
  };

  // theme styles
  const getThemeStyles = () => {
    const baseStyles: React.CSSProperties = {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: disabled ? 0.6 : 1,
      ...style,
    };

    switch (theme) {
      case 'dark':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          color: '#ffffff',
        };
      case 'light':
      default:
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
        };
    }
  };

  if (isVerified) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ 
          color: '#10b981', 
          fontSize: '18px', 
          fontWeight: '600',
          marginBottom: '12px' 
        }}>
          ✅ Age Verified Successfully!
        </div>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px',
          marginBottom: '16px' 
        }}>
          Your age has been verified using zero-knowledge proof.
        </p>
        <button
          onClick={resetVerification}
          style={{
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Reset Verification
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleVerifyAge}
      disabled={disabled || isLoading}
      className={className}
      style={getThemeStyles()}
    >
      {isLoading ? (
        <>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          {loadingText}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ) : (
        buttonText
      )}
    </button>
  );
};