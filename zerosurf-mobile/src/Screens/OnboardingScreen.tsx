import LottieView from 'lottie-react-native';
import React, { useState, type FunctionComponent, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import * as messages from '../../assets/messages.json';
import { ProgressBar } from '../Components/ProgressBar';
import { icons } from '../Components/illustrations';

export type OnboardingScreenProps = {
  setupReady?: boolean;
  navigation: any;
};

const lotties = [
  require('../../assets/lotties/1.Validate.json'),
  require('../../assets/lotties/2.Leveraging.json'),
  require('../../assets/lotties/3.Authenticate.json'),
  require('../../assets/lotties/4.Embrace.json'),
  require('../../assets/lotties/5.Foster.json'),
];

const setupTime = 120000; // 120 seconds in milliseconds (2 minutes)

export const OnboardingScreen: FunctionComponent<OnboardingScreenProps> = ({
  setupReady,
  navigation,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setupProgress, setSetupProgress] = useState<number>(0);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState<string>('');

  // loading messages for setup process
  const loadingMessages = [
    'Initializing ZeroSurf...',
    'Downloading proof bindings...',
    'Setting up cryptographic modules...',
    'Preparing verification system...',
    'Almost ready...',
  ];

  useEffect(() => {
    if (setupReady) setSetupProgress(1);
  }, [setupReady]);

  const incrementCounter = () => {
    setIsLoading(true);
    setActiveIndex((prevCounter) => (prevCounter === 4 ? 0 : prevCounter + 1));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      incrementCounter();
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  // update loading messages based on progress
  useEffect(() => {
    if (!setupReady) {
      const messageIndex = Math.floor(setupProgress * loadingMessages.length);
      const currentIndex = Math.min(messageIndex, loadingMessages.length - 1);
      setCurrentLoadingMessage(loadingMessages[currentIndex]);
    }
  }, [setupProgress, setupReady]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSetupProgress((prevProgress) => {
        if (prevProgress < 1) {
          return prevProgress + 1 / (setupTime / 1000);
        } else {
          clearInterval(interval);
          return 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setupReady]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.scrollView}>
          <LottieView
            source={lotties[activeIndex]}
            style={styles.topImage}
            autoPlay
            loop
          />

          <Text style={styles.heading}>
            {messages[activeIndex.toString() as keyof typeof messages].headline}
          </Text>
          
          <ProgressBar currentIndex={activeIndex} itemCount={5} />
          
          {/* loading status section */}
          <View style={styles.loadingSection}>
            {!setupReady && (
              <Text style={styles.loadingMessage}>
                {currentLoadingMessage}
              </Text>
            )}
            
            {setupReady && (
              <Text style={styles.readyMessage}>
                Ready to browse safely!
              </Text>
            )}
            
            {/* progress bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${setupProgress * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(setupProgress * 100)}%
              </Text>
            </View>
          </View>
        </View>
        
        {/* centered get started button */}
        <View style={styles.buttonContainer}>
          {setupReady ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Browser')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <SvgXml xml={icons.arrowRightLine} width="20" height="20" style={styles.buttonIcon} />
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonDisabled}>
              <Text style={styles.buttonTextDisabled}>Get Started</Text>
              <SvgXml xml={icons.arrowRightLine} width="20" height="20" style={styles.buttonIcon} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#06753b',
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#51785a',
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginRight: 8,
  },
  buttonTextDisabled: {
    color: '#CCCCCC',
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  heading: {
    color: '#000000',
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  loadingMessage: {
    color: '#666666',
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  readyMessage: {
    color: '#06753b',
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  topImage: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * (416 / 390),
    resizeMode: 'contain',
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '80%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#06753b',
    borderRadius: 4,
  },
  progressText: {
    color: '#666666',
    fontFamily: 'Outfit-Bold',
    fontSize: 14,
    marginTop: 10,
  },
});
