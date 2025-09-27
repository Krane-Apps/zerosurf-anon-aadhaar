/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { AadhaarScanner } from './aadhaarScanner';
import { modalStyles } from './modalStyles';
import { icons } from '../icons';
import { uploadAadhaarPNG } from '../uploadPNG';

export const UploadQR = ({
  setCurrentScreen,
  setQrCodeValue,
  setIsVerifyingSig,
}: {
  setCurrentScreen: any;
  setQrCodeValue: React.Dispatch<React.SetStateAction<string>>;
  setIsVerifyingSig: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [cameraOn, setCameraOn] = useState<boolean>(false);

  return (
    <>
      <View>
        <Text style={modalStyles.headerQr}>
          Create a proof of your Aadhaar ID.
        </Text>
        <Text style={modalStyles.footnote}>
          This process is local in your device for privacy, and QR images are
          not uploaded to any server.
        </Text>
      </View>

      <View style={{ marginTop: 15 }}>
        {/* Upload QR Image Option - First */}
        <TouchableOpacity
          style={[modalStyles.scanQrButton, { flexDirection: 'column' }]}
          onPress={() => uploadAadhaarPNG(setQrCodeValue, setIsVerifyingSig)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={modalStyles.uploadPNGIcon}>
              <SvgXml xml={`<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M14.5 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V9.5L14.5 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 4V9H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11L9 14L12 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`} width="32" height="32" />
            </View>
            <Text style={modalStyles.scanQrText}>
              Upload QR image from mAadhaar app
            </Text>
          </View>
          <Text
            style={[modalStyles.footnote, { fontSize: 12, lineHeight: 13, marginTop: 8 }]}
          >
            How to:{'\n'} &nbsp;1. &nbsp;Enter your Aadhaar card number & OTP verification.
            {'\n'} &nbsp;2. Save the QR code using the "Share" button.
          </Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginVertical: 20 
        }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#C6C6C8' }} />
          <Text style={[modalStyles.subhead, { 
            marginHorizontal: 16, 
            fontSize: 16, 
            fontWeight: '600' 
          }]}>OR</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#C6C6C8' }} />
        </View>

        {/* Scan QR Code Option - Second */}
        <TouchableOpacity
          style={modalStyles.scanQrButton}
          onPress={() => setCameraOn(true)}
        >
          <View style={modalStyles.scanQrIcon}>
            <SvgXml xml={`<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="5" height="5" rx="1" stroke="white" stroke-width="2"/>
              <rect x="16" y="3" width="5" height="5" rx="1" stroke="white" stroke-width="2"/>
              <rect x="3" y="16" width="5" height="5" rx="1" stroke="white" stroke-width="2"/>
              <path d="M21 16H16V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13 13H16V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13 8H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 13H11" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>`} width="32" height="32" />
          </View>
          <Text style={modalStyles.scanQrText}>
            Scan QR code from letter or PDF
          </Text>
        </TouchableOpacity>

        <View>
          <AadhaarScanner
            cameraOn={cameraOn}
            setCameraOn={setCameraOn}
            setQrCodeValue={setQrCodeValue}
            setCurrentScreen={setCurrentScreen}
            setIsVerifyingSig={setIsVerifyingSig}
          />
        </View>
      </View>
    </>
  );
};