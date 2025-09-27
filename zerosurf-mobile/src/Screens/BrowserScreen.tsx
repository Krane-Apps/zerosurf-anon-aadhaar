import React, { useState, useRef, useEffect } from 'react';
import {
  View,
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
  
  // log proof data whenever it changes
  useEffect(() => {
    console.log('BrowserScreen - useAnonAadhaar data:', JSON.stringify({
      status: anonAadhaarStatus?.status,
      isVerified,
      hasProof: !!anonAadhaarProof,
      proofType: typeof anonAadhaarProof,
      proofKeys: anonAadhaarProof ? Object.keys(anonAadhaarProof) : 'no proof',
      fullStatus: anonAadhaarStatus,
      fullProof: anonAadhaarProof,
    }, null, 2));
  }, [anonAadhaarStatus, anonAadhaarProof, isVerified]);
  
  // Handle deeplink verification requests from route params
  useEffect(() => {
    const params = route?.params?.deeplinkParams;
    if (params) {
      console.log('deeplink flow:', { params, isVerified });
      setDeeplinkParams(params);
      
      // if user is already verified, immediately return to website
      if (isVerified && params.returnUrl) {
        const proofHash = 'verified';
        console.log('auto-returning verified user to website:', params.returnUrl);
        DeeplinkService.returnToWebsite(params.returnUrl, true, proofHash);
      } else {
        // if not verified, show prove modal directly for deeplink flows
        console.log('opening prove modal directly for unverified deeplink user');
        setShowProveModal(true);
      }
    }
  }, [route?.params?.deeplinkParams, isVerified, anonAadhaarStatus]);

  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url.toLowerCase();
    
    // check if this is a blocked site for unverified users
    if (!isVerified && isBlockedDomain(url)) {
      console.log('content blocked - opening prove modal directly');
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
      console.log('content blocked - opening prove modal directly');
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
      console.log('content blocked - opening prove modal directly');
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
    console.log('BrowserScreen - Verification badge pressed:', JSON.stringify({
      isVerified,
      status: anonAadhaarStatus?.status,
      hasProof: !!anonAadhaarProof,
      proofData: anonAadhaarProof,
    }, null, 2));
    
    if (isVerified) {
      // get the actual proof data from status object
      const actualProofData = (anonAadhaarStatus as any)?.anonAadhaarProof?.anonAadhaarProof;
      
      console.log('BrowserScreen - Navigating to proof screen with data:', JSON.stringify({
        hasProof: !!anonAadhaarProof,
        proofData: anonAadhaarProof,
        proofType: typeof anonAadhaarProof,
        proofKeys: anonAadhaarProof ? Object.keys(anonAadhaarProof) : 'no proof',
        actualProofData: actualProofData,
        actualProofType: typeof actualProofData,
        actualProofKeys: actualProofData ? Object.keys(actualProofData) : 'no actual proof'
      }, null, 2));
      
      navigation.navigate('Proof', {
        anonAadhaarProof: actualProofData,
      });
    } else {
      // if not verified, show prove modal directly for manual verification
      // clear any existing deeplink params since this is manual verification
      console.log('red shield pressed - opening prove modal directly');
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
      </View>


      {showProveModal && (
        <>
          {console.log('rendering AnonAadhaarProve modal with props:', { showProveModal, useTestAadhaar, hasDeeplinkParams: !!deeplinkParams })}
          <AnonAadhaarProve
          buttonMessage={isContentBlocked ? "Content Blocked - Verify Age with Aadhaar" : "Verify Age with Aadhaar"}
          nullifierSeed={1234}
          fieldsToRevealArray={['revealAgeAbove18']}
          signal={deeplinkParams?.challenge || "0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"}
          useTestAadhaar={useTestAadhaar}
          setProofs={(proofData: any) => {
            console.log('BrowserScreen - Proof generation completed!', JSON.stringify({
              hasDeeplink: !!deeplinkParams?.returnUrl,
              wasContentBlocked: isContentBlocked,
              proofData: proofData,
              proofType: typeof proofData,
              proofKeys: proofData ? Object.keys(proofData) : 'no proof data',
              fullProofData: proofData,
            }, null, 2));
            
            // check if proof was stored in context/local storage
            setTimeout(() => {
              console.log('BrowserScreen - Checking updated state after proof generation:', JSON.stringify({
                newStatus: anonAadhaarStatus?.status,
                newProof: anonAadhaarProof,
                hasNewProof: !!anonAadhaarProof,
              }, null, 2));
            }, 100);
            
            setShowProveModal(false);
            setIsContentBlocked(false);
            
            // if this was triggered by deeplink, return to website
            if (deeplinkParams?.returnUrl) {
              const proofHash = 'verified';
              console.log('BrowserScreen - Returning to website with proof:', deeplinkParams.returnUrl);
              DeeplinkService.returnToWebsite(deeplinkParams.returnUrl, true, proofHash);
              setDeeplinkParams(null);
            } else {
              console.log('BrowserScreen - Manual verification completed - staying in app');
              handleVerificationComplete();
            }
          }}
        />
        </>
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
});