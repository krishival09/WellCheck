import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid3X3, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  X
} from 'lucide-react-native';
import { TRANSLATIONS } from '../../utils/speech';
import { soundFx } from '../../utils/audio';

export const CallModal: React.FC = () => {
  const { 
    activeCall, 
    endCall, 
    toggleCallMute, 
    toggleCallSpeaker, 
    triggerCallDialogue,
    activeRole,
    language,
    volunteerLanguage
  } = useApp();

  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');

  if (!activeCall.isOpen) return null;

  const isElder = activeRole === 'elder';
  const currentLang = isElder ? language : volunteerLanguage;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['en-US'];

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const handleKeypadPress = (key: string) => {
    soundFx.playTap();
    setDialedDigits(prev => prev + key);
  };

  // Quick conversation prompts based on active role
  const quickElderResponses = [
    { label: "I am okay, thank you!", speech: "I am feeling okay now, thank you for checking on me." },
    { label: "Need help here", speech: "I need a little help at home, could you please assist me?" },
    { label: "Took my medicine", speech: "I have taken my scheduled medicine just now." },
    { label: "See you soon", speech: "Thank you so much Sarah, see you soon." },
  ];

  const quickVolunteerResponses = [
    { label: "Are you feeling okay?", speech: "Hi Eleanor, are you feeling okay right now?" },
    { label: "I am on my way!", speech: "Don't worry, I am on my way to your apartment now." },
    { label: "Did you take medicine?", speech: "Just checking in, did you take your scheduled medicine today?" },
    { label: "Call 911 dispatch", speech: "I am alerting emergency services to assist you right away." },
  ];

  const responses = isElder ? quickElderResponses : quickVolunteerResponses;
  const cleanPhone = activeCall.phoneNumber.replace(/[^\d+]/g, '');

  return (
    <View 
      id="active-call-modal-overlay"
      
    >
      <View 
        id="active-call-card"
        
      >
        {/* Top Status Header */}
        <View >
          <View >
            <Text className={`w-3 h-3 rounded-full ${
              activeCall.status === 'connected' 
                ? 'bg-[#4CAF50] animate-pulse' 
                : activeCall.status === 'ringing' 
                ? 'bg-[#FFB84D] animate-ping' 
                : 'bg-red-500'
            }`} />
            <Text >
              {activeCall.status === 'dialing' && 'Connecting Network...'}
              {activeCall.status === 'ringing' && 'Ringing...'}
              {activeCall.status === 'connected' && `Call Connected • ${formatTime(activeCall.connectedDurationSec)}`}
              {activeCall.status === 'ended' && 'Call Ended'}
            </Text>
          </View>
          <View >
            <Text >
              <ShieldCheck  />
              Secure VoIP
            </Text>
            <TouchableOpacity
              onClick={endCall}
              
              title="Close Call"
            >
              <X  />
            </TouchableOpacity>
          </View>
        </View>

        {/* Callee / Caller Profile Details */}
        <View >
          {/* Avatar Ring */}
          <View >
            {activeCall.status === 'connected' && (
              <View  />
            )}
            {activeCall.status === 'ringing' && (
              <View  />
            )}
            <View >
              {activeCall.contactName.charAt(0)}
            </View>
          </View>

          <Text >
            {activeCall.contactName}
          </Text>
          <Text >
            {activeCall.contactRole === 'caregiver' ? 'Primary Volunteer / Daughter' : 'Paired Elder • Apt 4B'}
          </Text>
          <Text >
            {activeCall.phoneNumber}
          </Text>

          {/* Animated Audio Waveform when call is connected */}
          {activeCall.status === 'connected' ? (
            <View >
              <View >
                {[40, 75, 100, 60, 90, 45, 80, 100, 65, 30].map((height, i) => (
                  <Text
                    key={i}
                    style={{ height: `${height}%` }}
                    
                  />
                ))}
              </View>
              <Text >
                Voice channel active • Crystal Clear HD Audio
              </Text>
            </View>
          ) : (
            <View >
              <Text  />
              <Text>Contacting device ({activeCall.phoneNumber})...</Text>
            </View>
          )}

          {/* Quick Voice Dialogue Simulator */}
          {activeCall.status === 'connected' && (
            <View >
              <View >
                <Text >
                  <MessageSquare  /> Quick Voice Prompts
                </Text>
                <Text >
                  Tap to speak
                </Text>
              </View>
              <View >
                {responses.map((resp, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onClick={() => triggerCallDialogue(resp.speech)}
                    
                  >
                    <Sparkles  />
                    <Text >{resp.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Keypad View if opened */}
          {showKeypad && (
            <View >
              <View >
                {dialedDigits || 'Tap digits for DTMF tone'}
              </View>
              <View >
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                  <TouchableOpacity
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    
                  >
                    {k}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Bottom Call Controls */}
        <View >
          {/* Action Button Strip: Mute, Keypad, Speaker, Native Dial */}
          <View >
            {/* Mute Button */}
            <TouchableOpacity
              id="call-mute-toggle-btn"
              onClick={toggleCallMute}
              className={`h-12 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer ${
                activeCall.isMuted ? 'bg-[#FF6B4A] text-white' : 'bg-white text-[#1A2B4C] hover:bg-slate-50'
              }`}
              title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {activeCall.isMuted ? <MicOff  /> : <Mic  />}
              <Text >{activeCall.isMuted ? 'Muted' : 'Mute'}</Text>
            </TouchableOpacity>

            {/* Keypad Button */}
            <TouchableOpacity
              id="call-keypad-toggle-btn"
              onClick={() => setShowKeypad(!showKeypad)}
              className={`h-12 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer ${
                showKeypad ? 'bg-[#1A2B4C] text-white' : 'bg-white text-[#1A2B4C] hover:bg-slate-50'
              }`}
              title="Toggle Keypad"
            >
              <Grid3X3  />
              <Text >Keypad</Text>
            </TouchableOpacity>

            {/* Speaker Button */}
            <TouchableOpacity
              id="call-speaker-toggle-btn"
              onClick={toggleCallSpeaker}
              className={`h-12 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer ${
                activeCall.isSpeakerOn ? 'bg-[#4CAF50] text-white' : 'bg-white text-[#1A2B4C] hover:bg-slate-50'
              }`}
              title="Toggle Speakerphone"
            >
              {activeCall.isSpeakerOn ? <Volume2  /> : <VolumeX  />}
              <Text >{activeCall.isSpeakerOn ? 'Speaker' : 'Earpiece'}</Text>
            </TouchableOpacity>

            {/* Native Cellular Dial Link */}
            <a
              id="call-cellular-dial-link"
              href={`tel:${cleanPhone}`}
              
              title="Launch Device Phone Dialer"
            >
              <ExternalLink  />
              <Text >Cellular</Text>
            </a>
          </View>

          {/* Big End Call Button */}
          <TouchableOpacity
            id="call-hangup-btn"
            onClick={endCall}
            
          >
            <PhoneOff  />
            <Text>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
