import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Linking 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS } from '../../utils/speech';

export const ElderSosConfirmation: React.FC = () => {
  const { setElderScreen, language, pairData, startCall } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];
  const emergencyPhone = '+91 98450 67890';

  const handleNativeCall = () => {
    Linking.openURL(`tel:${emergencyPhone}`).catch(() => {
      startCall({ contactName: pairData.volunteerName || 'Caregiver', contactRole: 'caregiver' });
    });
  };

  const handleNativeSms = () => {
    const message = encodeURIComponent(`EMERGENCY: WellCheck SOS triggered by ${pairData.elderName || 'Elder'}. Please assist immediately!`);
    Linking.openURL(`sms:${emergencyPhone}?body=${message}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Status Card */}
        <View style={styles.successCard}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
          <Text style={styles.alertSentTitle}>{t.alertSentText}</Text>
          <Text style={styles.alertSentSub}>{t.alertSentSubtext}</Text>
          
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>🟢 {t.notifiedCaregiverText}: {pairData.volunteerName || 'Sarah Chen'}</Text>
          </View>
          <Text style={styles.timestampText}>{t.transmittedJustNowText}</Text>
        </View>

        {/* Direct Emergency Fallback Section (PRD §4.1, §5) */}
        <View style={styles.fallbackCard}>
          <Text style={styles.fallbackTitle}>🚨 {t.directFallbackText}</Text>
          <Text style={styles.fallbackSub}>One-tap direct phone call or SMS message</Text>

          <View style={styles.fallbackButtonsRow}>
            <TouchableOpacity
              style={[styles.fallbackBtn, styles.callBtn]}
              onPress={handleNativeCall}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Call Emergency Contact"
            >
              <Text style={styles.fallbackBtnIcon}>📞</Text>
              <Text style={styles.fallbackBtnText}>{t.callText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fallbackBtn, styles.smsBtn]}
              onPress={handleNativeSms}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="SMS Emergency Contact"
            >
              <Text style={styles.fallbackBtnIcon}>💬</Text>
              <Text style={styles.fallbackBtnText}>{t.smsText}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Return Home Button */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => setElderScreen('home')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Return to Home Screen"
        >
          <Text style={styles.homeBtnIcon}>🏠</Text>
          <Text style={styles.homeBtnText}>{t.returnHomeText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 3,
    borderColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 10,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmarkIcon: {
    fontSize: 44,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  alertSentTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  alertSentSub: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  badgeRow: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803D',
  },
  timestampText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  fallbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  fallbackSub: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  fallbackButtonsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  fallbackBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 64,
  },
  callBtn: {
    backgroundColor: '#16A34A',
  },
  smsBtn: {
    backgroundColor: '#2563EB',
  },
  fallbackBtnIcon: {
    fontSize: 24,
  },
  fallbackBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  homeBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    width: '100%',
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 64,
    marginBottom: 10,
  },
  homeBtnIcon: {
    fontSize: 22,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});