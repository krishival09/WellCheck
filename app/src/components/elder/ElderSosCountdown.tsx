import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS } from '../../utils/speech';

export const ElderSosCountdown: React.FC = () => {
  const { 
    sosCountdown, 
    cancelSosCountdown, 
    triggerImmediateSos, 
    language,
    pairData 
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Warning Banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningEmoji}>⚠️</Text>
          <Text style={styles.warningTitle}>{t.alertStartingText}</Text>
        </View>

        {/* Big Countdown Circle */}
        <View style={styles.timerCenter}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerNumber}>{sosCountdown}</Text>
            <Text style={styles.timerSecLabel}>SECONDS</Text>
          </View>

          <Text style={styles.autoDispatchText}>
            {t.autoDispatchInText(sosCountdown)}
          </Text>
          <Text style={styles.volunteerTargetText}>
            {t.volunteerWillBeAlertedText}
          </Text>
          <Text style={styles.caregiverTargetBadge}>
            Target: {pairData.volunteerName || 'Caregiver'}
          </Text>
        </View>

        {/* Bottom Actions: SEND NOW vs CANCEL */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.sendNowBtn}
            onPress={triggerImmediateSos}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Send SOS Alert Immediately"
          >
            <Text style={styles.sendNowIcon}>🚨</Text>
            <Text style={styles.sendNowText}>{t.sendImmediatelyText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={cancelSosCountdown}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Cancel SOS Alert"
          >
            <Text style={styles.cancelIcon}>✖️</Text>
            <Text style={styles.cancelText}>{t.cancelText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7F1D1D',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#991B1B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
    marginTop: 10,
  },
  warningEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  warningTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  timerCenter: {
    alignItems: 'center',
    width: '100%',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DC2626',
    borderWidth: 8,
    borderColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 24,
  },
  timerNumber: {
    fontSize: 84,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 90,
  },
  timerSecLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FEE2E2',
    letterSpacing: 2,
  },
  autoDispatchText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  volunteerTargetText: {
    fontSize: 16,
    color: '#FECACA',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  caregiverTargetBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FEF08A',
    backgroundColor: '#831843',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 12,
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 16,
  },
  sendNowBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 3,
    borderColor: '#F87171',
    minHeight: 70,
  },
  sendNowIcon: {
    fontSize: 28,
  },
  sendNowText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cancelBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 3,
    borderColor: '#475569',
    minHeight: 70,
  },
  cancelIcon: {
    fontSize: 24,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});