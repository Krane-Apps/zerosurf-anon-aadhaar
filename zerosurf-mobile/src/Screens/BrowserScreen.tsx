import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAnonAadhaar, AnonAadhaarProve } from '@anon-aadhaar/react-native';
import { DeeplinkService, DeeplinkParams } from '../Services/DeeplinkService';

import BrowserHeader from '../Components/Browser/BrowserHeader';

// blocked domains for unverified users
const BLOCKED_DOMAINS = [
  'facebook.com',
  'fb.com',
  'instagram.com',
  'reddit.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'pornhub.com',
  'xvideos.com',
  'xnxx.com',
  'redtube.com',
  'youporn.com'
];

function isBlockedDomain(url: string): boolean {
  const lowercaseUrl = url.toLowerCase();
  return BLOCKED_DOMAINS.some(domain => lowercaseUrl.includes(domain));
}

export const BrowserScreen = ({ navigation, route }: { navigation: any, route?: any }) => {
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(false);
  const [showProveModal, setShowProveModal] = useState(false);
  const [deeplinkParams, setDeeplinkParams] = useState<DeeplinkParams | null>(null);
  
  const webViewRef = useRef<WebView>(null);
  const [anonAadhaarStatus, anonAadhaarProof, , useTestAadhaar] = useAnonAadhaar();
  
  const isVerified = anonAadhaarStatus.status === 'logged-in';
  
  // Handle deeplink verification requests from route params
  useEffect(() => {
    const params = route?.params?.deeplinkParams;
    
    if (params) {
      setDeeplinkParams(params);
      
      // if user is already verified, navigate to the original URL in browser
      if (isVerified && params.returnUrl) {
        setCurrentUrl(params.returnUrl);
        // Don't return to website, stay in ZeroSurf browser
      } else {
        // if not verified, show content blocked message and prove modal
        if (params.returnUrl || params.challenge) {
          setIsContentBlocked(true);
          setShowProveModal(true);
        }
      }
    }
  }, [route?.params?.deeplinkParams, isVerified, anonAadhaarStatus]);

  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url.toLowerCase();
    
    // check if this is a blocked site for unverified users
    if (!isVerified && isBlockedDomain(url)) {
      setIsContentBlocked(true);
      setShowProveModal(true);
      // prevent updating current url to blocked site
      return;
    }
    
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setIsLoading(navState.loading);
  };

  const handleShouldStartLoad = (request: any) => {
    const url = request.url.toLowerCase();
    
    // block sites for unverified users
    if (!isVerified && isBlockedDomain(url)) {
      setIsContentBlocked(true);
      setShowProveModal(true);
      return false;
    }
    
    return true;
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleGoBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  const handleUrlSubmit = (url: string) => {
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    
    // check if this is a blocked site for unverified users
    if (!isVerified && isBlockedDomain(formattedUrl)) {
      setIsContentBlocked(true);
      setShowProveModal(true);
      return;
    }
    
    setCurrentUrl(formattedUrl);
  };

  const handleVerificationComplete = () => {
    setIsContentBlocked(false);
    // if user was trying to access a blocked site, reload current URL now that they're verified
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleVerificationBadgePress = () => {
    if (isVerified) {
      // get the actual proof data from status object
      const actualProofData = (anonAadhaarStatus as any)?.anonAadhaarProof?.anonAadhaarProof;
      
      navigation.navigate('Proof', {
        anonAadhaarProof: actualProofData,
      });
    } else {
      // if not verified, show prove modal directly for manual verification
      // clear any existing deeplink params since this is manual verification
      setDeeplinkParams(null);
      setShowProveModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <BrowserHeader
        currentUrl={currentUrl}
        isLoading={isLoading}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isVerified={isVerified}
        onUrlSubmit={handleUrlSubmit}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onRefresh={handleRefresh}
        onVerificationBadgePress={handleVerificationBadgePress}
      />

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webView}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          allowsBackForwardNavigationGestures={true}
          startInLoadingState={true}
          renderLoading={() => <View style={styles.loadingPlaceholder} />}
        />
        
        {/* Content Blocked Overlay */}
        {isContentBlocked && (
          <View style={styles.contentBlockedOverlay}>
            <View style={styles.contentBlockedContainer}>
              <Text style={styles.contentBlockedTitle}>Content Blocked</Text>
              <Text style={styles.contentBlockedMessage}>
                {deeplinkParams?.returnUrl 
                  ? `This website requires age verification to access.\n\nOriginal URL: ${deeplinkParams.returnUrl}`
                  : 'This content requires age verification to access.'
                }
              </Text>
              <Text style={styles.contentBlockedSubtext}>
                Verify your age with Aadhaar to continue browsing.
              </Text>
            </View>
          </View>
        )}
      </View>


      {showProveModal && (
        <AnonAadhaarProve
          buttonMessage={isContentBlocked ? "Content Blocked - Verify Age with Aadhaar" : "Verify Age with Aadhaar"}
          nullifierSeed={1234}
          fieldsToRevealArray={['revealAgeAbove18']}
          signal="0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"
          useTestAadhaar={false}
          setProofs={(proofData: any) => {
            setShowProveModal(false);
            setIsContentBlocked(false);
            
            // if this was triggered by deeplink, return to the original website with verification params
            if (deeplinkParams?.returnUrl) {
              // extract proof hash from the proof data
              let proofHash = '';
              try {
                if (proofData && typeof proofData === 'object') {
                  // try to get a hash from the proof data - could be nullifier, signalHash, or pubkeyHash
                  proofHash = proofData.nullifier || proofData.signalHash || proofData.pubkeyHash || JSON.stringify(proofData).substring(0, 64);
                } else {
                  proofHash = Date.now().toString();
                }
              } catch (error) {
                proofHash = Date.now().toString();
              }
              
              // return to the demo site with verification parameters
              DeeplinkService.returnToWebsite(deeplinkParams.returnUrl, true, proofHash);
              
              setDeeplinkParams(null);
            } else {
              handleVerificationComplete();
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webView: {
    flex: 1,
  },
  loadingPlaceholder: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentBlockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  contentBlockedContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '90%',
  },
  contentBlockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentBlockedMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  contentBlockedSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});