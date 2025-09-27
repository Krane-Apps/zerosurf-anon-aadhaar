import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { DeeplinkService } from '../Services/DeeplinkService';

export const DeeplinkHandler: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const removeListener = DeeplinkService.addListener((params) => {
      console.log('DeeplinkHandler received params, navigating to Browser:', params);
      
      // if we receive a verification request, navigate to browser with params
      if (params.returnUrl || params.challenge) {
        (navigation as any).navigate('Browser', { deeplinkParams: params });
      }
    });
    
    return removeListener;
  }, [navigation]);

  return null; // this component doesn't render anything
};