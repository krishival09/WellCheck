import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertOctagon, 
  Phone, 
  Check, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Volume2, 
  VolumeX,
  User,
  Heart
} from 'lucide-react-native';
import { soundFx } from '../../utils/audio';
import { TRANSLATIONS, speakText } from '../../utils/speech';

interface VolunteerSosModalProps {
  onDismiss: () => void;
}

export const VolunteerSosModal: React.FC<VolunteerSosModalProps> = ({ onDismiss }) => {
  const { 
    activeSosAlert, 
    acknowledgeAlert, 
    pairData, 
    volunteerLanguage, 
    startCall,
    elderProfile 
  } = useApp();
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  const t = TRANSLATIONS[volunteerLanguage] || TRANSLATIONS['en-US'];
  const elderName = activeSosAlert?.elderName || elderProfile.name || pairData.elderName || 'Eleanor Vance';
  const elderPhone = elderProfile.phoneNumber 
    ? `${elderProfile.phoneCountryCode || '+91'} ${elderProfile.phoneNumber}`
    : '(555) 018-9923';
  const elderAddress = elderProfile.address || 'Apartment 4B, Maple Green Lane';
  const emergencyContactName = elderProfile.emergencyContactName || 'Sarah Chen (Daughter)';
  const emergencyContactPhone = elderProfile.emergencyContactPhone || '+91 98450 67890';

  // Sound Siren loop on Volunteer side when SOS is active
  useEffect(() => {
    if (!isMuted) {
      soundFx.startSosSirenLoop();
      // Speak emergency alert in the volunteer's selected language
      const alertMsg = `${t.criticalEmergencyText || 'Critical Emergency'}: ${t.sosTakeoverTitle || 'SOS Alert'} - ${elderName}`;
      speakText(alertMsg, volunteerLanguage);
    }
    return () => {
      soundFx.stopSosSirenLoop();
    };
  }, [isMuted, volunteerLanguage, elderName, t.criticalEmergencyText, t.sosTakeoverTitle]);

  const handleCallElder = () => {
    soundFx.stopSosSirenLoop();
    startCall({
      contactName: elderName,
      phoneNumber: elderPhone,
      contactRole: 'elder',
      reason: 'sos'
    });
  };

  const handleCallEmergencyContact = () => {
    soundFx.stopSosSirenLoop();
    startCall({
      contactName: emergencyContactName,
      phoneNumber: emergencyContactPhone,
      contactRole: 'caregiver',
      reason: 'sos'
    });
  };

  const handleAcknowledgeAndDismiss = () => {
    soundFx.stopSosSirenLoop();
    if (activeSosAlert) {
      acknowledgeAlert(activeSosAlert.id);
    }
    onDismiss();
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (next) {
      soundFx.stopSosSirenLoop();
    } else {
      soundFx.startSosSirenLoop();
    }
  };

  return (
    <View 
      id="volunteer-sos-takeover-modal"
      
    >
      {/* Top Urgent Header */}
      <View >
        <View >
          <ShieldAlert  />
          <Text >
            {t.criticalEmergencyText || 'CRITICAL EMERGENCY'}
          </Text>
        </View>
        <TouchableOpacity
          id="volunteer-sos-mute-btn"
          onClick={toggleSound}
          
          aria-label={isMuted ? 'Unmute alarm' : 'Mute alarm'}
        >
          {isMuted ? <VolumeX  /> : <Volume2  />}
        </TouchableOpacity>
      </View>

      {/* Center Alert Body */}
      <View >
        
        {/* Pulsing Siren Icon */}
        <View >
          <View  />
          <View >
            <AlertOctagon  />
          </View>
        </View>

        <Text >
          High-Urgency Siren Active
        </Text>
        <Text >
          {t.sosTakeoverTitle || 'SOS ALERT'}
        </Text>
        <Text >
          {elderName} Needs Help!
        </Text>

        {/* Location & Time Info Card */}
        <View >
          <View >
            <Text >
              <Clock  /> Triggered: Just now
            </Text>
            <Text >
              Live Alert
            </Text>
          </View>

          <View >
            <MapPin  />
            <Text >{elderAddress}</Text>
          </View>

          {emergencyContactName && (
            <View >
              <Heart  />
              <Text>Contact: {emergencyContactName}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View >
          {/* Primary VoIP Call Button to Elder */}
          <TouchableOpacity
            id="volunteer-sos-call-button"
            onClick={handleCallElder}
            
          >
            <View >
              <Phone  />
            </View>
            <View >
              <Text >
                {`${t.callText || 'Call'} ${elderName.split(' ')[0]}`}
              </Text>
              <Text >{elderPhone}</Text>
            </View>
          </TouchableOpacity>

          {/* Quick Call Emergency Contact */}
          {emergencyContactPhone && (
            <TouchableOpacity
              id="volunteer-sos-call-contact-btn"
              onClick={handleCallEmergencyContact}
              
            >
              <Phone  />
              <Text>Call Emergency Contact ({emergencyContactPhone})</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Footer Acknowledge Action */}
      <View >
        <TouchableOpacity
          id="volunteer-sos-ack-button"
          onClick={handleAcknowledgeAndDismiss}
          
        >
          <Check  />
          <Text>{t.acknowledgeBtnText} & {t.resolveBtnText}</Text>
        </TouchableOpacity>
        <Text >
          Acknowledging stops siren & confirms safety
        </Text>
      </View>
    </View>
  );
};
