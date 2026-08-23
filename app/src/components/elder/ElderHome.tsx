import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  Languages, 
  ChevronRight, 
  KeyRound,
  Phone,
  Plus,
  Pill,
  Timer,
  BellRing,
  CheckCircle2
} from 'lucide-react-native';
import { SUPPORTED_LANGUAGES, speakText, TRANSLATIONS } from '../../utils/speech';
import { SupportedLanguage } from '../../types';
import { TtsSubtitleBanner } from '../common/TtsSubtitleBanner';
import { ElderAddMedicineModal } from './ElderAddMedicineModal';
import { soundFx } from '../../utils/audio';

export const ElderHome: React.FC = () => {
  const {
    startSosCountdown,
    setElderScreen,
    setSelectedMedicineId,
    medicines,
    lastCheckinTime,
    respondCheckinOk,
    language,
    setLanguage,
    pairData,
    startCall,
    activeCheckinPrompt,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [remainingSec, setRemainingSec] = useState<number>(180);

  // Live countdown timer for active checkin prompt (3 minutes = 180s)
  useEffect(() => {
    if (!activeCheckinPrompt || activeCheckinPrompt.status !== 'pending') return;

    const updateTimer = () => {
      const remainingMs = Math.max(0, activeCheckinPrompt.expiresAtTimestamp - Date.now());
      setRemainingSec(Math.ceil(remainingMs / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeCheckinPrompt]);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];
  const pendingMedicine = medicines.find(m => !m.taken) || medicines[0];

  const handleCheckInClick = () => {
    respondCheckinOk();
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3500);
  };

  const handleSpeakCurrentStatus = () => {
    const text = `${t.checkinPrompt} ${
      pendingMedicine && !pendingMedicine.taken
        ? t.medicinePrompt('', pendingMedicine.scheduledTime)
        : t.medicineTaken
    }`;
    speakText(text, language);
  };

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View id="elder-home-screen" >
      
      {/* Top Header: Sleek Interface Navbar */}
      <View >
        <View >
          <View  />
          <Text >
            {t.homeTitle}
          </Text>
        </View>
        <View >
          {/* TTS Listen Button */}
          <TouchableOpacity
            id="elder-tts-read-button"
            onClick={handleSpeakCurrentStatus}
            aria-label="Read screen aloud"
            title="Read screen aloud"
            
          >
            <Volume2  />
          </TouchableOpacity>

          {/* Language Selector Dropdown */}
          <View >
            <TouchableOpacity
              id="elder-lang-selector-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Select Language"
              
            >
              <Languages  />
              <Text>{SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag || '🌐'}</Text>
            </TouchableOpacity>

            {showLangMenu && (
              <View 
                id="elder-lang-dropdown"
                
              >
                <View >
                  <Text>Select Language</Text>
                  <Text >10+ Regional</Text>
                </View>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as SupportedLanguage);
                      setShowLangMenu(false);
                      const targetT = TRANSLATIONS[lang.code as SupportedLanguage] || TRANSLATIONS['en-US'];
                      speakText(targetT.checkinPrompt, lang.code as SupportedLanguage);
                    }}
                    className={`min-h-[40px] w-full px-3 py-1.5 text-left rounded-lg flex items-center gap-2.5 font-bold text-xs transition ${
                      language === lang.code
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
      </View>

      {/* Real-time Visual TTS Subtitle Banner when voice plays */}
      <TtsSubtitleBanner />

      {/* ACTIVE SCHEDULED CHECK-IN PROMPT BANNER WITH 3-MINUTE COUNTDOWN */}
      {activeCheckinPrompt && activeCheckinPrompt.status === 'pending' && (
        <View 
          id="elder-active-checkin-prompt-banner"
          
        >
          <View >
            <View >
              <Text >
                <BellRing  />
              </Text>
              <View>
                <Text >
                  Scheduled Check-In Time
                </Text>
                <Text >
                  {activeCheckinPrompt.scheduledTime} Safety Check
                </Text>
              </View>
            </View>

            {/* Countdown Badge */}
            <View >
              <Timer  style={{ animationDuration: '4s' }} />
              <Text>{formatRemaining(remainingSec)}</Text>
            </View>
          </View>

          <Text >
            Please tap below to let {pairData.volunteerName || 'your caregiver'} know you are safe and doing well.
          </Text>

          <TouchableOpacity
            id="elder-prompt-checkin-now-btn"
            onClick={handleCheckInClick}
            
          >
            <CheckCircle2  />
            <Text>✓ {t.imOkText || "I'M OK — CHECK IN NOW"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Vertically Scrolling List */}
      <View >
        
        {/* 1. SOS Button: Bold Coral with Hard Drop Shadow */}
        <View aria-label="Emergency SOS Action">
          <TouchableOpacity
            id="elder-sos-main-button"
            onClick={startSosCountdown}
            aria-label="Emergency SOS — I Need Help"
            
          >
            <Text >
              {t.sosButtonText}
            </Text>
            <Text >
              {t.sosSubtext}
            </Text>
            <Text >
              {t.sosTapPrompt}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. Secondary Cards: "Take Medicine", "Add Medicine", & "Check In" (60dp+ Touch Targets) */}
        <View  aria-label="Daily Safety Actions">
          
          {/* Take Medicine Card */}
          <TouchableOpacity
            id="elder-medicine-card-button"
            onClick={() => {
              if (pendingMedicine) {
                setSelectedMedicineId(pendingMedicine.id);
              }
              setElderScreen('medicine_detail');
            }}
            
          >
            <View >
              {pendingMedicine?.localPhotoRef ? (
                <View >
                  <Image
                    src={pendingMedicine.localPhotoRef}
                    alt="Scheduled Tablet"
                    referrerPolicy="no-referrer"
                    
                  />
                </View>
              ) : (
                <View >
                  💊
                </View>
              )}
              <View >
                <Text >
                  {t.takeMedicineText}
                </Text>
                <Text >
                  {pendingMedicine 
                    ? `• ${pendingMedicine.scheduledTime} • ${pendingMedicine.dosage || 'Dose'}` 
                    : t.medicineTaken}
                </Text>
              </View>
            </View>
            <ChevronRight  />
          </TouchableOpacity>

          {/* Add New Medicine Quick Card (Elder Side) */}
          <TouchableOpacity
            id="elder-add-medicine-btn"
            onClick={() => {
              soundFx.playTap();
              setIsAddMedModalOpen(true);
            }}
            
          >
            <View >
              <View >
                <Plus  />
              </View>
              <View >
                <Text >
                  + Add New Medicine
                </Text>
                <Text >
                  Set pill name, dose & photo reminder
                </Text>
              </View>
            </View>
            <Text >
              New
            </Text>
          </TouchableOpacity>

          {/* Check In — I'm OK Card */}
          <TouchableOpacity
            id="elder-checkin-card-button"
            onClick={handleCheckInClick}
            className={`w-full min-h-[80px] rounded-2xl px-4 py-3 flex items-center justify-between border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1A2B4C] transition-all cursor-pointer ${
              justCheckedIn
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#FAF7F2] hover:bg-white text-[#1A2B4C]'
            }`}
          >
            <View >
              <View
                className={`w-11 h-11 rounded-xl border border-[#1A2B4C] flex items-center justify-center text-2xl font-black shrink-0 shadow-[1px_1px_0px_#1A2B4C] ${
                  justCheckedIn
                    ? 'bg-white text-[#4CAF50]'
                    : 'bg-[#4CAF50] text-white'
                }`}
              >
                ✓
              </View>
              <View >
                <Text >
                  {justCheckedIn ? t.checkedInText : t.checkInText}
                </Text>
                <Text className={`text-xs font-bold ${justCheckedIn ? 'text-white/90' : 'text-[#1A2B4C]/70'}`}>
                  {justCheckedIn ? t.checkinConfirmed : t.imOkText}
                </Text>
              </View>
            </View>
            {!justCheckedIn && <ChevronRight  />}
          </TouchableOpacity>
        </View>

        {/* 3. Bottom Status Card */}
        <View >
          <Text >
            {t.lastCheckinText}: {lastCheckinTime}
          </Text>
          <View >
            <TouchableOpacity
              id="elder-call-volunteer-quick-btn"
              onClick={() => startCall({
                contactName: pairData.volunteerName || 'Sarah Chen (Daughter)',
                phoneNumber: '(555) 019-2834',
                contactRole: 'caregiver',
                reason: 'general'
              })}
              
            >
              <Phone  />
              <Text>{t.callText || 'Call'} {pairData.volunteerName ? pairData.volunteerName.split(' ')[0] : 'Sarah'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              id="elder-pairing-code-btn"
              onClick={() => setElderScreen('pairing')}
              
            >
              <KeyRound  />
              PIN {pairData.pinCode}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Elder Add Medicine Modal */}
      {isAddMedModalOpen && (
        <ElderAddMedicineModal
          isOpen={isAddMedModalOpen}
          onClose={() => setIsAddMedModalOpen(false)}
        />
      )}
    </View>
  );
};

