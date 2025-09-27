import { Linking } from 'react-native';

export interface DeeplinkParams {
  returnUrl?: string;
  challenge?: string;
}

export class DeeplinkService {
  private static listeners: Array<(params: DeeplinkParams) => void> = [];

  // Initialize deeplink handling
  static initialize() {
    // Handle app opened from deeplink
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleDeeplink(url);
      }
    });

    // Handle deeplinks when app is already running
    const linkingListener = Linking.addEventListener('url', (event) => {
      this.handleDeeplink(event.url);
    });

    return () => {
      linkingListener?.remove();
    };
  }

  // Parse and handle deeplink URL
  private static handleDeeplink(url: string) {
    console.log('DeeplinkService received URL:', url);
    
    try {
      const urlObj = new URL(url);
      
      // Check if it's a zerosurf scheme
      if (urlObj.protocol !== 'zerosurf:') {
        console.log('Invalid scheme, ignoring:', urlObj.protocol);
        return;
      }

      // Parse path and query parameters
      const path = urlObj.hostname; // e.g., "verify"
      const params: DeeplinkParams = {};
      
      urlObj.searchParams.forEach((value, key) => {
        if (key === 'returnUrl') {
          params.returnUrl = decodeURIComponent(value);
        } else if (key === 'challenge') {
          params.challenge = value;
        }
      });

      console.log('Parsed deeplink:', { path, params, listenerCount: this.listeners.length });

      // Notify listeners
      this.listeners.forEach(listener => listener(params));
      
    } catch (error) {
      console.error('Error parsing deeplink:', error);
    }
  }

  // Add listener for deeplink events
  static addListener(listener: (params: DeeplinkParams) => void) {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Return to website with verification result
  static async returnToWebsite(returnUrl: string, verified: boolean, proofHash?: string) {
    try {
      // Construct return URL with parameters
      const url = new URL(returnUrl);
      url.searchParams.set('verified', verified.toString());
      
      if (verified && proofHash) {
        url.searchParams.set('proof', proofHash);
      }
      
      const finalUrl = url.toString();
      console.log('DeeplinkService returning to website:', { finalUrl, verified, proofHash });
      
      // Open the website URL
      const canOpen = await Linking.canOpenURL(finalUrl);
      if (canOpen) {
        await Linking.openURL(finalUrl);
        console.log('Successfully opened return URL');
      } else {
        console.error('Cannot open return URL:', finalUrl);
      }
    } catch (error) {
      console.error('Error returning to website:', error);
    }
  }
}