import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, ArrowRight, UserCheck, Languages } from 'lucide-react-native';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../../utils/speech';
import { SupportedLanguage } from '../../types';

interface VolunteerPairingViewProps {
  onSuccess: () => void;
}

export const VolunteerPairingView: React.FC<VolunteerPairingViewProps> = ({ onSuccess }) => {
  const { pairData, pairVolunteerWithPin, volunteerLanguage, setVolunteerLanguage } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[volunteerLanguage] || TRANSLATIONS['en-US'];
  const currentVolLang = SUPPORTED_LANGUAGES.find(l => l.code === volunteerLanguage) || SUPPORTED_LANGUAGES[0];

  const handlePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length < 4) {
      setErrorMsg('Please enter a valid 4-digit PIN code.');
      return;
    }
    const success = pairVolunteerWithPin(pinInput);
    if (success) {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('Pair not found. Check the PIN shown on Elder device.');
    }
  };

  return (
    <View 
      id="volunteer-pairing-screen" 
      
    >
      <View >
        <View>
          <Text >WellCheck</Text>
          <Text >{t.caregiverSetupText || 'Caregiver Setup'}</Text>
        </View>
        
        {/* Volunteer Language Selector Dropdown (Identical to Elder UI) */}
        <View >
          <TouchableOpacity
            id="volunteer-pairing-lang-btn"
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-label="Select Volunteer Language"
            
          >
            <Languages  />
            <Text>{currentVolLang?.flag || '🌐'}</Text>
          </TouchableOpacity>

          {showLangMenu && (
            <View 
              id="volunteer-pairing-lang-dropdown"
              
            >
              <View >
                <Text>Select Language</Text>
                <Text >Volunteer Mode</Text>
              </View>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onClick={() => {
                    setVolunteerLanguage(lang.code as SupportedLanguage);
                    setShowLangMenu(false);
                  }}
                  className={`min-h-[40px] w-full px-3 py-1.5 text-left rounded-lg flex items-center gap-2.5 font-bold text-xs transition cursor-pointer ${
                    volunteerLanguage === lang.code
                      ? 'bg-[#1A2B4C] text-white'
                      : 'hover:bg-slate-100 text-[#1A2B4C]'
                  }`}
                >
                  <Text >{lang.flag}</Text>
                  <View >
                    <Text >{lang.nativeLabel}</Text>
                    <Text >{lang.label} {lang.region ? `(${lang.region})` : ''}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View >
        <View >
          <KeyRound  />
        </View>

        <Text >
          {t.connectToElderText || 'Connect to Elder'}
        </Text>
        <Text >
          {t.enter4DigitPinText || "Enter the 4-digit code generated on your family member's phone."}
        </Text>

        <form onSubmit={handlePair} >
          <View>
            <input
              id="volunteer-pin-input"
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, ''));
                setErrorMsg('');
              }}
              placeholder={pairData.pinCode || '7492'}
              
            />
            <Text >
              Default demo PIN: <Text >{pairData.pinCode}</Text>
            </Text>
          </View>

          {errorMsg && (
            <Text >
              {errorMsg}
            </Text>
          )}

          <TouchableOpacity
            id="volunteer-submit-pin-btn"
            type="submit"
            
          >
            <Text>{t.connectDeviceBtn || 'Connect Device'}</Text>
            <ArrowRight  />
          </TouchableOpacity>
        </form>

        <View >
          <UserCheck  />
          <View >
            <Text >Single Active Elder Scoped</Text>
            <Text >Auto-queries alerts/{'{elderId}'} via Firestore</Text>
          </View>
        </View>
      </View>

      <View >
        WellCheck Caregiver Sync Engine • Spark Plan Safe
      </View>
    </View>
  );
};
