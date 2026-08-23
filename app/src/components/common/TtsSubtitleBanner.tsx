import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { subscribeSpeech, stopSpeaking } from '../../utils/speech';
import { SupportedLanguage } from '../../types';

export const TtsSubtitleBanner: React.FC = () => {
  const [speechState, setSpeechState] = useState<{
    text: string;
    langCode: SupportedLanguage;
    isSpeaking: boolean;
  }>({
    text: '',
    langCode: 'en-US',
    isSpeaking: false,
  });

  useEffect(() => {
    const unsubscribe = subscribeSpeech((data) => {
      setSpeechState(data);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (!speechState.isSpeaking || !speechState.text) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.speakerIcon}>🔊</Text>
        <Text style={styles.text} numberOfLines={3}>
          "{speechState.text}"
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.stopButton} 
        onPress={stopSpeaking}
        accessibilityRole="button"
        accessibilityLabel="Stop audio"
      >
        <Text style={styles.stopText}>STOP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#F59E0B',
    minHeight: 60,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  speakerIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  text: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  stopButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 44,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});