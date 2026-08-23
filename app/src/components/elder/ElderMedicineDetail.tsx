import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS, speakText } from '../../utils/speech';
import { MedicinePhotoUploaderModal } from '../common/MedicinePhotoUploaderModal';

export const ElderMedicineDetail: React.FC = () => {
  const { 
    selectedMedicineId, 
    medicines, 
    markMedicineTaken, 
    setElderScreen, 
    language 
  } = useApp();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];
  const med = medicines.find(m => m.id === selectedMedicineId) || medicines[0];

  if (!med) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Medicine not found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => setElderScreen('home')}>
            <Text style={styles.backBtnText}>← {t.backText}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleListen = () => {
    speakText(
      `${med.medicineName}. ${t.scheduledTimeText}: ${med.scheduledTime}. ${t.dosageText}: ${med.dosage}. ${t.instructionsText}: ${med.instructions}`,
      language
    );
  };

  const handleTakePill = async () => {
    await markMedicineTaken(med.id);
    setElderScreen('home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Navigation Bar */}
        <View style={styles.navRow}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => setElderScreen('home')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Back to Home Screen"
          >
            <Text style={styles.backBtnIcon}>⬅️</Text>
            <Text style={styles.backBtnText}>{t.backText}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.listenBtn} 
            onPress={handleListen}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Listen to medicine instructions"
          >
            <Text style={styles.listenIcon}>🔊</Text>
            <Text style={styles.listenText}>{t.listenText}</Text>
          </TouchableOpacity>
        </View>

        {/* Medicine Main Card */}
        <View style={styles.mainCard}>
          <Text style={styles.medTitle}>{med.medicineName}</Text>
          
          <View style={styles.timeBadgeRow}>
            <View style={[styles.timeBadge, med.taken ? styles.timeBadgeTaken : styles.timeBadgePending]}>
              <Text style={[styles.timeBadgeText, med.taken ? styles.timeBadgeTextTaken : styles.timeBadgeTextPending]}>
                ⏰ {med.scheduledTime} • {med.taken ? t.takenText : t.dueNowText}
              </Text>
            </View>
          </View>

          {/* Local Photo Card */}
          <View style={styles.photoContainer}>
            {med.localPhotoRef ? (
              <Image source={{ uri: med.localPhotoRef }} style={styles.medImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.placeholderEmoji}>💊</Text>
                <Text style={styles.placeholderLabel}>No photo uploaded yet</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.photoUploadBtn}
              onPress={() => setIsPhotoModalOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.photoUploadIcon}>📸</Text>
              <Text style={styles.photoUploadText}>
                {med.localPhotoRef ? 'Change Photo (Local)' : 'Add Photo (Local)'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dosage & Instructions */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>📋 {t.dosageText}:</Text>
            <Text style={styles.sectionValue}>{med.dosage}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>ℹ️ {t.instructionsText}:</Text>
            <Text style={styles.sectionValue}>{med.instructions}</Text>
          </View>
        </View>

        {/* Take Action Button */}
        <TouchableOpacity
          style={[styles.takeActionBtn, med.taken && styles.takeActionBtnTaken]}
          onPress={handleTakePill}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Confirm taking medicine"
        >
          <Text style={styles.takeActionIcon}>{med.taken ? '✓' : '💊'}</Text>
          <Text style={styles.takeActionText}>
            {med.taken ? 'Already Taken ✓ (Tap to refresh)' : t.takePillAction}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Photo Uploader Modal */}
      <MedicinePhotoUploaderModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        medicineId={med.id}
        medicineName={med.medicineName}
        currentPhotoUri={med.localPhotoRef}
      />
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
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 20,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 40,
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
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  medTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 32,
  },
  timeBadgeRow: {
    flexDirection: 'row',
  },
  timeBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  timeBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  timeBadgeTaken: {
    backgroundColor: '#DCFCE7',
  },
  timeBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeBadgeTextPending: {
    color: '#B45309',
  },
  timeBadgeTextTaken: {
    color: '#15803D',
  },
  photoContainer: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    position: 'relative',
  },
  medImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 56,
  },
  placeholderLabel: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },
  photoUploadBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  photoUploadIcon: {
    fontSize: 16,
  },
  photoUploadText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 18,
    color: '#334155',
    lineHeight: 24,
  },
  takeActionBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 72,
    borderWidth: 2,
    borderColor: '#15803D',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  takeActionBtnTaken: {
    backgroundColor: '#475569',
    borderColor: '#334155',
  },
  takeActionIcon: {
    fontSize: 28,
  },
  takeActionText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
});