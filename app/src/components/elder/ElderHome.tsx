import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS, speakText } from '../../utils/speech';

export const ElderHome: React.FC = () => {
  const { 
    startSosCountdown, 
    respondCheckinOk, 
    lastCheckinTime, 
    medicines, 
    setElderScreen, 
    setSelectedMedicineId,
    language,
    pairData,
    generateNewPin,
    startCall,
    activeCheckinPrompt
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  // Find next pending medicine or most recent
  const pendingMed = medicines.find(m => !m.taken) || medicines[0];

  const handleReadHome = () => {
    const textToSpeak = `${t.homeTitle}. ${t.sosButtonText}: ${t.sosSubtext}. ${t.takeMedicineText}: ${pendingMed ? pendingMed.medicineName : 'None pending'}. ${t.checkInText}: ${t.imOkText}. Your PIN is ${pairData.pinCode.split('').join(' ')}.`;
    speakText(textToSpeak, language);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header Card */}
      <View style={styles.topCard}>
        <View style={styles.topCardInfo}>
          <Text style={styles.topCardTitle}>👵 {pairData.elderName || 'Eleanor'}</Text>
          <Text style={styles.topCardCaregiver}>
            Caregiver: <Text style={styles.caregiverName}>{pairData.volunteerName || 'Sarah Chen'}</Text>
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.listenHeaderBtn} 
          onPress={handleReadHome}
          accessibilityRole="button"
          accessibilityLabel="Listen to page contents"
        >
          <Text style={styles.listenHeaderIcon}>🔊</Text>
          <Text style={styles.listenHeaderText}>LISTEN</Text>
        </TouchableOpacity>
      </View>

      {/* ========================================================================= */}
      {/* PROMINENT PIN PAIRING CARD (PRD §2, §3)                                    */}
      {/* ========================================================================= */}
      <View style={styles.pinCard}>
        <View style={styles.pinCardTop}>
          <View style={styles.pinTitleGroup}>
            <Text style={styles.pinCardEmoji}>🔑</Text>
            <Text style={styles.pinCardTitle}>Device Pairing PIN</Text>
          </View>
          <TouchableOpacity 
            style={styles.generatePinSmallBtn}
            onPress={generateNewPin}
            activeOpacity={0.8}
          >
            <Text style={styles.generatePinSmallText}>🔄 New PIN</Text>
          </TouchableOpacity>
        </View>

        {/* Big Digit Boxes */}
        <TouchableOpacity 
          style={styles.pinDigitsRow}
          onPress={() => setElderScreen('pairing')}
          activeOpacity={0.85}
        >
          {pairData.pinCode.split('').map((digit, idx) => (
            <View key={idx} style={styles.digitBox}>
              <Text style={styles.digitText}>{digit}</Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* Live Pairing Status */}
        <View style={[styles.pinStatusBadge, pairData.isPaired ? styles.pinStatusPaired : styles.pinStatusWaiting]}>
          <Text style={[styles.pinStatusText, pairData.isPaired ? styles.pinStatusTextPaired : styles.pinStatusTextWaiting]}>
            {pairData.isPaired 
              ? `🟢 Live Connected with ${pairData.volunteerName || 'Caregiver'}`
              : '⏳ Tell Caregiver to enter this PIN to connect'}
          </Text>
        </View>
      </View>

      {/* Check-in Notification Banner if Prompt Active */}
      {activeCheckinPrompt ? (
        <View style={styles.activeCheckinCard}>
          <Text style={styles.activeCheckinEmoji}>⏰</Text>
          <View style={styles.activeCheckinInfo}>
            <Text style={styles.activeCheckinTitle}>Safety Check-In Prompt!</Text>
            <Text style={styles.activeCheckinSub}>Please confirm you are safe & doing well.</Text>
          </View>
          <TouchableOpacity 
            style={styles.activeCheckinBtn}
            onPress={respondCheckinOk}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Confirm I am OK"
          >
            <Text style={styles.activeCheckinBtnText}>I'M OK ✓</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* ========================================================================= */}
      {/* 1. HUGE SOS EMERGENCY BUTTON (PRD §5: Minimum 32sp+ label, min 60x60dp)     */}
      {/* ========================================================================= */}
      <View style={styles.sosCard}>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={startSosCountdown}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Emergency SOS Button, Tap for instant help"
        >
          <Text style={styles.sosEmoji}>🚨</Text>
          <Text style={styles.sosText}>{t.sosButtonText}</Text>
          <Text style={styles.sosSubtext}>{t.sosSubtext}</Text>
          <View style={styles.sosTapPromptBadge}>
            <Text style={styles.sosTapPromptText}>{t.sosTapPrompt}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ========================================================================= */}
      {/* 2. DAILY SAFETY CHECK-IN BUTTON ("I'M OK") (PRD §4.3)                     */}
      {/* ========================================================================= */}
      <View style={styles.checkinCard}>
        <View style={styles.checkinHeaderRow}>
          <View style={styles.checkinTitleGroup}>
            <Text style={styles.cardEmoji}>🛡️</Text>
            <Text style={styles.cardSectionTitle}>{t.imOkText}</Text>
          </View>
          <TouchableOpacity 
            style={styles.cardSpeakBtn}
            onPress={() => speakText(`${t.imOkText}. ${t.lastCheckinText}: ${lastCheckinTime}`, language)}
          >
            <Text style={styles.cardSpeakIcon}>🔊</Text>
            <Text style={styles.cardSpeakText}>Listen</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.checkinButton}
          onPress={respondCheckinOk}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Check-in button, tap to notify caregiver you are OK"
        >
          <Text style={styles.checkinButtonIcon}>👍</Text>
          <View style={styles.checkinButtonTextGroup}>
            <Text style={styles.checkinButtonTitle}>{t.checkInText}</Text>
            <Text style={styles.checkinButtonSub}>Tap to log safety check</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.lastCheckinLabel}>
          ⏱️ {t.lastCheckinText}: <Text style={styles.lastCheckinValue}>{lastCheckinTime}</Text>
        </Text>
      </View>

      {/* ========================================================================= */}
      {/* 3. MEDICINE REMINDER CARD (PRD §4.2)                                      */}
      {/* ========================================================================= */}
      {pendingMed ? (
        <View style={styles.medCard}>
          <View style={styles.medHeaderRow}>
            <View style={styles.medTitleGroup}>
              <Text style={styles.cardEmoji}>💊</Text>
              <Text style={styles.cardSectionTitle}>{t.takeMedicineText}</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardSpeakBtn}
              onPress={() => speakText(t.medicinePrompt(pendingMed.medicineName, pendingMed.scheduledTime), language)}
            >
              <Text style={styles.cardSpeakIcon}>🔊</Text>
              <Text style={styles.cardSpeakText}>Listen</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medContentRow}>
            {pendingMed.localPhotoRef ? (
              <Image source={{ uri: pendingMed.localPhotoRef }} style={styles.medThumbnail} />
            ) : (
              <View style={styles.medThumbnailPlaceholder}>
                <Text style={styles.medPillIcon}>💊</Text>
              </View>
            )}

            <View style={styles.medDetails}>
              <Text style={styles.medName} numberOfLines={2}>{pendingMed.medicineName}</Text>
              <Text style={styles.medTime}>⏰ {pendingMed.scheduledTime} • {pendingMed.dosage}</Text>
              <Text style={styles.medStatusBadge}>
                {pendingMed.taken ? '✅ TAKEN' : '⏳ DUE NOW'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.medActionButton, pendingMed.taken && styles.medActionButtonTaken]}
            onPress={() => {
              setSelectedMedicineId(pendingMed.id);
              setElderScreen('medicine_detail');
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`View medicine details for ${pendingMed.medicineName}`}
          >
            <Text style={styles.medActionIcon}>{pendingMed.taken ? '✓' : '👁️'}</Text>
            <Text style={styles.medActionText}>
              {pendingMed.taken ? 'View Taken Medicine' : 'Take Medicine Details'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* ========================================================================= */}
      {/* 4. DIRECT CALL & PAIRING SHORTCUTS (PRD §2, §4.1)                         */}
      {/* ========================================================================= */}
      <View style={styles.bottomShortcutsRow}>
        <TouchableOpacity
          style={[styles.shortcutBtn, styles.callCaregiverBtn]}
          onPress={() => startCall({ contactName: pairData.volunteerName, contactRole: 'caregiver' })}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Call caregiver"
        >
          <Text style={styles.shortcutIcon}>📞</Text>
          <Text style={styles.shortcutText}>Call Caregiver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shortcutBtn, styles.pairingBtn]}
          onPress={() => setElderScreen('pairing')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="View device pairing PIN"
        >
          <Text style={styles.shortcutIcon}>🔗</Text>
          <Text style={styles.shortcutText}>Pairing PIN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  topCardInfo: {
    flex: 1,
  },
  topCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  topCardCaregiver: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  caregiverName: {
    fontWeight: 'bold',
    color: '#1E293B',
  },
  listenHeaderBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  listenHeaderIcon: {
    fontSize: 18,
  },
  listenHeaderText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pinCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pinTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinCardEmoji: {
    fontSize: 20,
  },
  pinCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  generatePinSmallBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  generatePinSmallText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  pinDigitsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 6,
  },
  digitBox: {
    width: 52,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  pinStatusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  pinStatusWaiting: {
    backgroundColor: '#FEF3C7',
  },
  pinStatusPaired: {
    backgroundColor: '#DCFCE7',
  },
  pinStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pinStatusTextWaiting: {
    color: '#B45309',
  },
  pinStatusTextPaired: {
    color: '#15803D',
  },
  activeCheckinCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 3,
    borderColor: '#D97706',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activeCheckinEmoji: {
    fontSize: 28,
  },
  activeCheckinInfo: {
    flex: 1,
  },
  activeCheckinTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  activeCheckinSub: {
    fontSize: 13,
    color: '#B45309',
    marginTop: 2,
  },
  activeCheckinBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  activeCheckinBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sosCard: {
    alignItems: 'center',
  },
  sosButton: {
    backgroundColor: '#DC2626',
    borderRadius: 22,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#991B1B',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  sosEmoji: {
    fontSize: 42,
    marginBottom: 4,
  },
  sosText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  sosSubtext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEE2E2',
    marginTop: 2,
    letterSpacing: 1,
  },
  sosTapPromptBadge: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  sosTapPromptText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  checkinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  checkinHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkinTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardSpeakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minHeight: 36,
  },
  cardSpeakIcon: {
    fontSize: 14,
  },
  cardSpeakText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  checkinButton: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 64,
    borderWidth: 2,
    borderColor: '#15803D',
  },
  checkinButtonIcon: {
    fontSize: 28,
  },
  checkinButtonTextGroup: {
    alignItems: 'flex-start',
  },
  checkinButtonTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  checkinButtonSub: {
    color: '#DCFCE7',
    fontSize: 14,
    fontWeight: '500',
  },
  lastCheckinLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
  },
  lastCheckinValue: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  medTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  medThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  medThumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  medPillIcon: {
    fontSize: 32,
  },
  medDetails: {
    flex: 1,
  },
  medName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  medTime: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  medStatusBadge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  medActionButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
  },
  medActionButtonTaken: {
    backgroundColor: '#475569',
  },
  medActionIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  medActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomShortcutsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    borderWidth: 2,
  },
  callCaregiverBtn: {
    backgroundColor: '#1E293B',
    borderColor: '#0F172A',
  },
  pairingBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  shortcutIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  shortcutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});