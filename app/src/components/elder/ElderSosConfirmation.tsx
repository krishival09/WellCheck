import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  UserCheck 
} from 'lucide-react-native';
import { TRANSLATIONS } from '../../utils/speech';
import { TtsSubtitleBanner } from '../common/TtsSubtitleBanner';

export const ElderSosConfirmation: React.FC = () => {
  const { setElderScreen, pairData, language, startCall } = useApp();
  const [smsSimulated, setSmsSimulated] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];
  const emergencyPhone = '(555) 019-2834';
  const contactName = pairData.volunteerName || 'Sarah Chen (Daughter)';

  const handleStartElderCall = () => {
    startCall({
      contactName,
      phoneNumber: emergencyPhone,
      contactRole: 'caregiver',
      reason: 'sos'
    });
  };

  const handleSimulateSms = () => {
    setSmsSimulated(true);
    // Also trigger native sms: protocol handler if clicked on phone
    window.location.href = `sms:5550192834?body=${encodeURIComponent(`EMERGENCY SOS: Eleanor Vance needs immediate assistance at Apt 4B. WellCheck Alert.`)}`;
    setTimeout(() => setSmsSimulated(false), 3500);
  };

  return (
    <View 
      id="elder-sos-confirmation-screen" 
      
    >
      {/* Top Header / Back */}
      <View >
        <TouchableOpacity
          id="elder-confirmation-back-btn"
          onClick={() => setElderScreen('home')}
          
        >
          <ArrowLeft  />
          <Text>{t.backText}</Text>
        </TouchableOpacity>
        <Text >
          <ShieldCheck  /> Transmitted
        </Text>
      </View>

      <View >
        <TtsSubtitleBanner />
      </View>

      {/* Main Confirmation Content */}
      <View >
        
        {/* Alert Sent Banner */}
        <View >
          <CheckCircle2  />
        </View>
        <Text >
          {t.alertSentText}
        </Text>
        <Text >
          {t.alertSentSubtext}
        </Text>

        {/* Volunteer Notice Card */}
        <View >
          <View >
            <UserCheck  />
            <Text>{t.notifiedCaregiverText}</Text>
          </View>
          <View >
            {contactName}
          </View>
          <View >
            <Clock  />
            <Text>{t.transmittedJustNowText} ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</Text>
          </View>
        </View>

        {/* Direct Phone/SMS Fallback Section */}
        <View >
          <Text >
            {t.directFallbackText}
          </Text>

          {/* Call Preset Contact */}
          <TouchableOpacity
            id="elder-direct-call-btn"
            onClick={handleStartElderCall}
            aria-label={`Call ${contactName} at ${emergencyPhone}`}
            
          >
            <View >
              <View >
                <Phone  />
              </View>
              <View >
                <Text >
                  {`${t.callText} ${contactName.split(' ')[0]}`}
                </Text>
                <Text >{emergencyPhone}</Text>
              </View>
            </View>
            <Text >
              {t.callText}
            </Text>
          </TouchableOpacity>

          {/* SMS Preset Contact */}
          <TouchableOpacity
            id="elder-direct-sms-btn"
            onClick={handleSimulateSms}
            aria-label="Send emergency text"
            
          >
            <View >
              <View >
                <MessageSquare  />
              </View>
              <View >
                <Text >
                  {smsSimulated ? 'SMS App Opened' : t.smsText}
                </Text>
                <Text >Auto-populated location text</Text>
              </View>
            </View>
            <Text >
              {t.smsText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Return to Home */}
      <View >
        <TouchableOpacity
          id="elder-return-home-btn"
          onClick={() => setElderScreen('home')}
          
        >
          {t.returnHomeText}
        </TouchableOpacity>
      </View>
    </View>
  );
};
