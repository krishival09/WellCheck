import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, Volume2, ShieldAlert } from 'lucide-react-native';
import { speakText, TRANSLATIONS } from '../../utils/speech';
import { TtsSubtitleBanner } from '../common/TtsSubtitleBanner';

export const ElderSosCountdown: React.FC = () => {
  const {
    sosCountdown,
    cancelSosCountdown,
    triggerImmediateSos,
    language,
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  const handleSpeakCountdown = () => {
    speakText(t.sosCountdown(sosCountdown), language);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.warningBanner}>
          <ShieldAlert size={20} color="#FFB84D" />
          <Text style={styles.warningText}>SOS ALERT</Text>
        </View>
        <TouchableOpacity style={styles.voiceButton} onPress={handleSpeakCountdown}>
          <Volume2 size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <TtsSubtitleBanner />

      {/* Center Countdown */}
      <View style={styles.main}>
        <Text style={styles.title}>{t.alertStartingText}</Text>
        
        <View style={styles.circle}>
          <Text style={styles.countdown}>{String(sosCountdown).padStart(2, '0')}</Text>
        </View>

        <View style={styles.subTimer}>
          <AlertTriangle size={20} color="#FFB84D" />
          <Text style={styles.subTimerText}>{t.autoDispatchInText(sosCountdown)}</Text>
        </View>

        <Text style={styles.desc}>{t.volunteerWillBeAlertedText}</Text>

        <TouchableOpacity style={styles.sendNowButton} onPress={triggerImmediateSos}>
          <Text style={styles.sendNowText}>{t.sendImmediatelyText}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Cancel */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={cancelSosCountdown}>
          <X size={32} color="#1A2B4C" />
          <Text style={styles.cancelText}>{t.cancelText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FF6B4A', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  warningBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2B4C', padding: 8, borderRadius: 8, gap: 8 },
  warningText: { color: 'white', fontWeight: '900', fontSize: 12 },
  voiceButton: { width: 48, height: 48, backgroundColor: '#1A2B4C', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  main: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
  circle: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  countdown: { color: 'white', fontSize: 60, fontWeight: '900' },
  subTimer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 20, gap: 8 },
  subTimerText: { color: 'white', fontWeight: '900', fontSize: 14 },
  desc: { color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center', marginTop: 10 },
  sendNowButton: { marginTop: 15, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  sendNowText: { color: '#1A2B4C', fontWeight: '900', fontSize: 14, textTransform: 'uppercase' },
  footer: { paddingTop: 20 },
  cancelButton: { height: 80, backgroundColor: 'white', borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  cancelText: { color: '#1A2B4C', fontSize: 22, fontWeight: '900', textTransform: 'uppercase' }
});
