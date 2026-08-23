import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Volume2, X, RotateCcw } from 'lucide-react-native';
import { subscribeSpeech, speakText, stopSpeaking, SUPPORTED_LANGUAGES } from '../../utils/speech';
import { SupportedLanguage } from '../../types';

export const TtsSubtitleBanner: React.FC = () => {
  const [speechData, setSpeechData] = useState<{
    text: string;
    langCode: SupportedLanguage;
    isSpeaking: boolean;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSpeech((data) => {
      if (data.isSpeaking && data.text) {
        setSpeechData(data);
      } else if (!data.isSpeaking) {
        // Auto-fade after small delay
        const timer = setTimeout(() => {
          setSpeechData(prev => prev && !prev.isSpeaking ? null : prev);
        }, 3000);
        return () => clearTimeout(timer);
      }
    });
    return unsubscribe;
  }, []);

  if (!speechData || !speechData.text) {
    return null;
  }

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === speechData.langCode);

  return (
    <View 
      id="tts-live-subtitle-banner"
      
    >
      <View >
        <View >
          <View >
            <Volume2  />
          </View>
          <Text >
            <Text>{langInfo?.flag || '🌐'}</Text>
            <Text>{langInfo?.nativeLabel} ({langInfo?.label}) Voice Prompt</Text>
          </Text>
        </View>
        <View >
          {/* Replay voice button */}
          <TouchableOpacity
            onClick={() => speakText(speechData.text, speechData.langCode)}
            title="Replay audio"
            
          >
            <RotateCcw  />
            <Text>Replay</Text>
          </TouchableOpacity>
          {/* Close subtitle */}
          <TouchableOpacity
            onClick={() => {
              stopSpeaking();
              setSpeechData(null);
            }}
            title="Dismiss voice banner"
            
          >
            <X  />
          </TouchableOpacity>
        </View>
      </View>
      {/* Subtitle text in native script */}
      <Text >
        &ldquo;{speechData.text}&rdquo;
      </Text>
      {/* Sound wave visualizer bars */}
      <View >
        <View  />
        <View  />
        <View  />
        <View  />
        <Text >
          TTS Audio Active
        </Text>
      </View>
    </View>
  );
};
