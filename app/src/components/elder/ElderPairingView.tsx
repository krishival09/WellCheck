import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS, speakText } from '../../utils/speech';

export const ElderPairingView: React.FC = () => {
  const { pairData, generateNewPin, setElderScreen, language } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  const handleListen = () => {
    speakText(
      `${t.yourPinText}: ${pairData.pinCode.split('').join(' ')}. ${pairData.isPaired ? t.connectedLiveText : t.waitingVolunteerText}`,
      language
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navRow}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => setElderScreen('home')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
          >
            <Text style={styles.backBtnIcon}>⬅️</Text>
            <Text style={styles.backBtnText}>{t.backText}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.listenBtn} 
            onPress={handleListen}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Listen to PIN readout"
          >
            <Text style={styles.listenIcon}>🔊</Text>
            <Text style={styles.listenText}>{t.listenText}</Text>
          </TouchableOpacity>
        </View>

        {/* Pairing Card */}
        <View style={styles.pairingCard}>
          <Text style={styles.cardHeaderEmoji}>🔗</Text>
          <Text style={styles.cardTitle}>{t.pairWithVolunteerText}</Text>
          <Text style={styles.cardSub}>{t.sharePinSubtext}</Text>

          {/* Big PIN Box */}
          <View style={styles.pinContainer}>
            <Text style={styles.pinLabel}>{t.yourPinText}</Text>
            <View style={styles.digitsRow}>
              {pairData.pinCode.split('').map((digit, idx) => (
                <View key={idx} style={styles.digitBox}>
                  <Text style={styles.digitText}>{digit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Status Badge */}
          <View style={[styles.statusBadge, pairData.isPaired ? styles.statusBadgePaired : styles.statusBadgeWaiting]}>
            <Text style={[styles.statusText, pairData.isPaired ? styles.statusTextPaired : styles.statusTextWaiting]}>
              {pairData.isPaired ? `🟢 ${t.connectedLiveText} (${pairData.volunteerName || 'Caregiver'})` : `⏳ ${t.waitingVolunteerText}`}
            </Text>
          </View>

          {/* Generate New PIN Button */}
          <TouchableOpacity 
            style={styles.generateBtn} 
            onPress={generateNewPin}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Generate New Pairing PIN"
          >
            <Text style={styles.generateBtnIcon}>🔄</Text>
            <Text style={styles.generateBtnText}>{t.generateNewPinText}</Text>
          </TouchableOpacity>
        </View>

        {/* Reassurance Footer */}
        <View style={styles.footerBox}>
          <Text style={styles.footerText}>
            🔒 Once paired, your caregiver receives instant emergency SOS alerts and daily safety updates.
          </Text>
        </View>
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
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
  },
  backBtnIcon: {
    fontSize: 18,
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  listenBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
  },
  listenIcon: {
    fontSize: 18,
  },
  listenText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  pairingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeaderEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  pinContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  pinLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  digitsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  digitBox: {
    width: 60,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  digitText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 18,
    width: '100%',
    alignItems: 'center',
  },
  statusBadgeWaiting: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgePaired: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusTextWaiting: {
    color: '#B45309',
  },
  statusTextPaired: {
    color: '#15803D',
  },
  generateBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 56,
    width: '100%',
  },
  generateBtnIcon: {
    fontSize: 18,
  },
  generateBtnText: {
    color: '#334155',
    fontSize: 17,
    fontWeight: 'bold',
  },
  footerBox: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
});