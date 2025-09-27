import { setupProver, AnonAadhaarProvider } from '@anon-aadhaar/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { DeeplinkService } from './Services/DeeplinkService';

import { AboutScreen } from './Screens/AboutScreen';
import BenchmarkView from './Screens/BenchmarkScreen';
import { BrowserScreen } from './Screens/BrowserScreen';
import { HomeScreen } from './Screens/HomeScreen';
import { OnboardingScreen } from './Screens/OnboardingScreen';
import { ProofScreen } from './Screens/ProofScreen';
import { DeeplinkHandler } from './Components/DeeplinkHandler';

const Stack = createNativeStackNavigator();

export default function App() {
  const [setupReady, setSetupReady] = useState<boolean>(false);

  useEffect(() => {
    console.log('App - Starting setup process...');
    setupProver().then(() => {
      console.log('App - Prover setup completed successfully');
      setSetupReady(true);
    }).catch((error) => {
      console.error('App - Prover setup failed:', error);
      setSetupReady(true); // still allow app to continue
    });
    
    // Initialize deeplink handling
    console.log('App - Initializing deeplink service...');
    const removeDeeplinkListener = DeeplinkService.initialize();
    
    return () => {
      console.log('App - Cleaning up deeplink listener...');
      removeDeeplinkListener?.();
    };
  }, []);

  useEffect(() => {
    console.log('App - Setup ready state changed:', setupReady);
  }, [setupReady]);

  return (
    <AnonAadhaarProvider>
      <NavigationContainer>
        {/* Global deeplink handler */}
        <DeeplinkHandler />
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => <OnboardingScreen {...props} setupReady={setupReady} />}
          </Stack.Screen>

          <Stack.Screen name="Proof" options={{ headerShown: false }}>
            {(props) => <ProofScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Benchmark"
            component={BenchmarkView}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Browser"
            component={BrowserScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AnonAadhaarProvider>
  );
}
