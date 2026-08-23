import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { TRANSLATIONS } from '../../utils/speech';

export const ElderPairingView: React.FC = () => {
  const { pairData, generateNewPin, setElderScreen, language } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  return (
    <View 
      id="elder-pairing-view"
      
    >
      {/* Top Header */}
      <View >
        <TouchableOpacity
          id="elder-pairing-back-btn"
          onClick={() => setElderScreen('home')}
          
        >
          <ArrowLeft  />
          <Text>{t.backText}</Text>
        </TouchableOpacity>
        <Text >
          Device Pairing
        </Text>
      </View>

      {/* Main Content */}
      <View >
        
        <View >
          <KeyRound  />
        </View>

        <Text >
          {t.pairWithVolunteerText}
        </Text>
        <Text >
          {t.sharePinSubtext}
        </Text>

        {/* Big PIN Display */}
        <View >
          <Text >
            {t.yourPinText}
          </Text>
          <View >
            {pairData.pinCode}
          </View>
          <Text >
            Document: pairs/{pairData.pinCode}
          </Text>
        </View>

        {/* Pairing Status Card */}
        <View >
          <View >
            <CheckCircle2  />
          </View>
          <View>
            <Text >
              {t.connectionStatusText}
            </Text>
            <View >
              {pairData.isPaired ? t.connectedLiveText : t.waitingVolunteerText}
            </View>
            <View >
              Caregiver: {pairData.volunteerName || 'Sarah Chen'}
            </View>
          </View>
        </View>

        {/* Generate New PIN Button */}
        <TouchableOpacity
          id="elder-regenerate-pin-btn"
          onClick={generateNewPin}
          
        >
          <RefreshCw  />
          <Text>{t.generateNewPinText}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Return Home */}
      <View >
        <TouchableOpacity
          id="elder-pair-done-btn"
          onClick={() => setElderScreen('home')}
          
        >
          {t.returnHomeText}
        </TouchableOpacity>
      </View>
    </View>
  );
};
