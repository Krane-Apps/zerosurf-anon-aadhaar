import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { AnonAadhaarProve, useAnonAadhaar } from '@anon-aadhaar/react-native';

interface VerificationOverlayProps {
  onVerificationComplete: () => void;
  onClose: () => void;
  isContentBlocked?: boolean;
  onVerifyPress?: () => void;
}

const closeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const shieldIcon = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none">
  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#FF3B30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const { width: screenWidth } = Dimensions.get('window');

const VerificationOverlay: React.FC<VerificationOverlayProps> = ({
  onVerificationComplete,
  onClose,
  isContentBlocked = false,
  onVerifyPress,
}) => {
  const [anonAadhaarStatus] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaarStatus.status === 'logged-in') {
      onVerificationComplete();
    }
  }, [anonAadhaarStatus, onVerificationComplete]);
  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <SvgXml xml={closeIcon} color="#8E8E93" />
          </TouchableOpacity>


          {/* content blocked message */}
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={onVerifyPress}
          >
            <SvgXml xml={shieldIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>Content Blocked</Text>
          <Text style={styles.subtitle}>
            This content requires age verification to ensure you're 18 or older
          </Text>

          {/* verification component */}
          <View style={styles.verificationContainer}>
            <AnonAadhaarProve
              buttonMessage="Verify Age with Aadhaar"
              nullifierSeed={1234}
              fieldsToRevealArray={['revealAgeAbove18']}
              signal="0xa527e0029e720D5f31c8798DF7b107Fad54f40E6"
            />
          </View>

          <Text style={styles.privacyNote}>
            🔒 Your personal data stays private. Only age verification is shared.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    margin: 20,
    width: screenWidth - 40,
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  verificationContainer: {
    width: '100%',
    marginBottom: 24,
  },
  privacyNote: {
    fontSize: 14,
    color: '#34C759',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default VerificationOverlay;