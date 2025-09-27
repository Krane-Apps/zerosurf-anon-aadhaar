/* eslint-disable react-native/no-inline-styles */
import { AnonAadhaarProve, useAnonAadhaar } from '@anon-aadhaar/react-native';
import React, { useEffect, type FunctionComponent } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Footer } from '../Components/Footer';
import { icons } from '../Components/illustrations';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HomeScreenProps = {
  navigation: any;
};

export const HomeScreen: FunctionComponent<HomeScreenProps> = ({
  navigation,
}) => {
  const [anonAadhaarStatus, anonAadhaarProof, , useTestAadhaar] = useAnonAadhaar();

  // function to check what's in local storage
  const checkLocalStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('HomeScreen - AsyncStorage keys:', JSON.stringify(keys, null, 2));
      
      // check common anon-aadhaar keys
      const anonKeys = keys.filter(key => key.includes('anon') || key.includes('proof') || key.includes('aadhaar'));
      console.log('HomeScreen - Anon-aadhaar related keys:', JSON.stringify(anonKeys, null, 2));
      
      for (const key of anonKeys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`HomeScreen - AsyncStorage[${key}]:`, JSON.stringify(value, null, 2));
      }
      
      // also check all keys that might be related
      const storageData: any = {};
      for (const key of keys) {
        storageData[key] = await AsyncStorage.getItem(key);
      }
      console.log('HomeScreen - Complete AsyncStorage contents:', JSON.stringify(storageData, null, 2));
    } catch (error) {
      console.error('HomeScreen - Error checking AsyncStorage:', error);
    }
  };

  useEffect(() => {
    console.log('HomeScreen - useAnonAadhaar data:', JSON.stringify({
      status: anonAadhaarStatus?.status,
      hasProof: !!anonAadhaarProof,
      proofType: typeof anonAadhaarProof,
      proofKeys: anonAadhaarProof ? Object.keys(anonAadhaarProof) : 'no proof',
      fullStatus: anonAadhaarStatus,
      fullProof: anonAadhaarProof,
    }, null, 2));
    
    // check local storage
    checkLocalStorage();
    
    if (anonAadhaarStatus.status === 'logged-in') {
      console.log('HomeScreen - User is verified and logged in');
      console.log('HomeScreen - Proof data available:', JSON.stringify(anonAadhaarProof, null, 2));
    }
  }, [anonAadhaarStatus, anonAadhaarProof]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.scrollView}>
        <Text style={styles.heading}>Hey Surfer,</Text>
        <View style={styles.greenSection}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.topImage}
          />

          <View style={{ padding: 15, marginTop: 10 }}>
            <TouchableHighlight
              onLongPress={() => navigation.navigate('Benchmark')}
              underlayColor="white"
            >
              <View style={styles.tag}>
                <Text style={styles.callout}>
                  {anonAadhaarStatus.status === 'logged-in'
                    ? 'Verified'
                    : 'Not Verified'}
                </Text>
              </View>
            </TouchableHighlight>
            <Text style={styles.title}>Proof of identity</Text>
            <Text style={styles.footnote}>
              A zero-knowledge proof generated for confirming the authenticity
              of your Aadhaar card without revealing any personal data.
            </Text>

            <AnonAadhaarProve
              buttonMessage="Start"
              signal="0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"
              nullifierSeed={1234}
              fieldsToRevealArray={['revealAgeAbove18', 'revealState']}
              useTestAadhaar={useTestAadhaar}
            />
          </View>
        </View>
        {anonAadhaarStatus.status === 'logged-in' && (
          <TouchableOpacity
            style={styles.proofSection}
            onPress={() => {
              // get the actual proof data from status object
              const actualProofData = (anonAadhaarStatus as any)?.anonAadhaarProof?.anonAadhaarProof;
              
              console.log('HomeScreen - Navigating to Proof screen with data:', JSON.stringify({
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
            }}
          >
            <View style={styles.aaLogoContainer}>
              <View style={styles.aaLogo}>
                <SvgXml xml={icons.logoFrame} width="40" height="40" />
              </View>
            </View>
            <Text style={[styles.proofSectionText, { marginLeft: 10 }]}>
              View my proof
            </Text>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                right: 10,
              }}
            >
              <SvgXml xml={icons.arrowRightLine} width="40" height="40" />
            </View>
          </TouchableOpacity>
        )}

        {/* browse web button */}
        <TouchableOpacity
          style={styles.browserSection}
          onPress={() => navigation.navigate('Browser')}
        >
          <View style={styles.browserIconContainer}>
            <View style={styles.browserIcon}>
              <SvgXml xml={icons.globeLine} width="40" height="40" />
            </View>
          </View>
          <Text style={[styles.proofSectionText, { marginLeft: 10 }]}>
            Browse Web Safely
          </Text>
          <View style={styles.arrowContainer}>
            <SvgXml xml={icons.arrowRightLine} width="40" height="40" />
          </View>
        </TouchableOpacity>
      </View>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  aaLogo: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
  aaLogoContainer: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  buttonText: {
    color: '#06753b',
    fontFamily: 'Outfit-Light',
    textAlign: 'center',
  },
  callout: {
    color: 'white',
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
  },
  footnote: {
    color: 'white',
    fontFamily: 'Outfit-Light',
    fontSize: 14,
    lineHeight: 15,
  },
  greenSection: {
    backgroundColor: '#06753B',
    borderRadius: 10,
    height: 480,
    marginVertical: 20,
  },
  heading: {
    color: '#000000',
    fontFamily: 'Outfit-Bold',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'left',
  },
  proofSection: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    marginVertical: 4,
    minHeight: 60,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    width: '100%',
  },
  proofSectionText: {
    color: '#000000',
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    textAlign: 'left',
  },
  roundButton: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    marginTop: 20,
    width: '100%',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  tag: {
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    padding: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '40%',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'left',
  },
  topImage: {
    alignSelf: 'center',
    height: '50%',
    resizeMode: 'contain',
    width: '100%',
  },
  browserSection: {
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'relative',
  },
  browserIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  browserIcon: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  arrowContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
  },
});
