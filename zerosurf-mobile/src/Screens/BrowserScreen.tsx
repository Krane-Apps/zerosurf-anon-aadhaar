import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAnonAadhaar, AnonAadhaarProve } from '@anon-aadhaar/react-native';

import BrowserHeader from '../Components/Browser/BrowserHeader';
import VerificationOverlay from '../Components/Browser/VerificationOverlay';

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

export const BrowserScreen = ({ navigation }: { navigation: any }) => {
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(false);
  const [showProveModal, setShowProveModal] = useState(false);
  
  const webViewRef = useRef<WebView>(null);
  const [anonAadhaarStatus] = useAnonAadhaar();
  
  const isVerified = anonAadhaarStatus.status === 'logged-in';

  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url.toLowerCase();
    
    // check if this is a blocked site for unverified users
    if (!isVerified && isBlockedDomain(url)) {
      setShowVerificationOverlay(true);
      setIsContentBlocked(true);
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
      setShowVerificationOverlay(true);
      setIsContentBlocked(true);
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
      setShowVerificationOverlay(true);
      setIsContentBlocked(true);
      return;
    }
    
    setCurrentUrl(formattedUrl);
  };

  const handleVerificationComplete = () => {
    setShowVerificationOverlay(false);
    setIsContentBlocked(false);
    // if user was trying to access a blocked site, reload current URL now that they're verified
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleVerificationBadgePress = () => {
    if (isVerified) {
      navigation.navigate('Proof', {
        anonAadhaarProof: anonAadhaarStatus.anonAadhaarProof,
      });
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

      {showVerificationOverlay && (
        <VerificationOverlay
          onVerificationComplete={handleVerificationComplete}
          onClose={() => {
            setShowVerificationOverlay(false);
            setIsContentBlocked(false);
            // if content was blocked, go back to safe page instead of loading blocked site
            if (isContentBlocked) {
              setCurrentUrl('https://www.google.com');
            }
          }}
          onVerifyPress={() => {
            setShowVerificationOverlay(false);
            setShowProveModal(true);
          }}
          isContentBlocked={isContentBlocked}
        />
      )}

      {showProveModal && (
        <AnonAadhaarProve
          buttonMessage="Verify Age with Aadhaar"
          nullifierSeed={1234}
          fieldsToRevealArray={['revealAgeAbove18']}
          signal="0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"
          onComplete={() => {
            setShowProveModal(false);
            handleVerificationComplete();
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
});