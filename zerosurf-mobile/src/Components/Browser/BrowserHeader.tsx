import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

interface BrowserHeaderProps {
  currentUrl: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isVerified: boolean;
  onUrlSubmit: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  onVerificationBadgePress?: () => void;
}

const backIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const forwardIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const refreshIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M23 4V10H17M1 20V14H7M20.49 9A9 9 0 0 0 5.64 5.64L1 10M3.51 15A9 9 0 0 0 18.36 18.36L23 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const shieldIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  currentUrl,
  isLoading,
  canGoBack,
  canGoForward,
  isVerified,
  onUrlSubmit,
  onGoBack,
  onGoForward,
  onRefresh,
  onVerificationBadgePress,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const handleUrlInputSubmit = () => {
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim());
    }
    setIsEditingUrl(false);
    setUrlInput('');
  };

  const displayUrl = currentUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <View style={styles.container}>
      {/* navigation controls */}
      <View style={styles.navigationRow}>
        <TouchableOpacity
          style={[styles.navButton, !canGoBack && styles.disabledButton]}
          onPress={onGoBack}
          disabled={!canGoBack}
        >
          <SvgXml 
            xml={backIcon} 
            color={canGoBack ? '#007AFF' : '#C7C7CC'} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, !canGoForward && styles.disabledButton]}
          onPress={onGoForward}
          disabled={!canGoForward}
        >
          <SvgXml 
            xml={forwardIcon} 
            color={canGoForward ? '#007AFF' : '#C7C7CC'} 
          />
        </TouchableOpacity>

        <View style={styles.urlContainer}>
          {isEditingUrl ? (
            <TextInput
              style={styles.urlInput}
              value={urlInput}
              onChangeText={setUrlInput}
              onSubmitEditing={handleUrlInputSubmit}
              onBlur={() => setIsEditingUrl(false)}
              placeholder="Search or enter website"
              placeholderTextColor="#8E8E93"
              autoFocus
              selectTextOnFocus
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <TouchableOpacity
              style={styles.urlDisplay}
              onPress={() => {
                setIsEditingUrl(true);
                setUrlInput(currentUrl);
              }}
            >
              <Text style={styles.urlText} numberOfLines={1}>
                {displayUrl}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <SvgXml xml={refreshIcon} color="#007AFF" />
          )}
        </TouchableOpacity>

        {/* verification status */}
        <TouchableOpacity 
          style={[styles.verificationBadge, isVerified ? styles.verified : styles.unverified]}
          onPress={isVerified ? onVerificationBadgePress : undefined}
          disabled={!isVerified}
        >
          <SvgXml 
            xml={shieldIcon} 
            color={isVerified ? '#34C759' : '#FF3B30'} 
          />
          <Text style={[styles.verificationText, isVerified ? styles.verifiedText : styles.unverifiedText]}>
            {isVerified ? '18+' : '?'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  urlContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  urlDisplay: {
    flex: 1,
    justifyContent: 'center',
  },
  urlInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  urlText: {
    fontSize: 16,
    color: '#000000',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verified: {
    backgroundColor: '#E8F5E8',
  },
  unverified: {
    backgroundColor: '#FFE8E8',
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedText: {
    color: '#34C759',
  },
  unverifiedText: {
    color: '#FF3B30',
  },
});

export default BrowserHeader;