import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ScrollView,
  Platform 
} from 'react-native';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, speakText } from '../utils/speech';

export const HeaderNav: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    language, 
    setLanguage, 
    pairData, 
    setIsAuthModalOpen,
    voicePromptEnabled,
    setVoicePromptEnabled,
    setElderScreen
  } = useApp();

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <View style={styles.header}>
      {/* Top row: Brand + Role Switcher */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandEmoji}>🛡️</Text>
          <Text style={styles.brandTitle}>WellCheck</Text>
        </View>

        {/* Role Toggle Pills */}
        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[styles.rolePill, activeRole === 'elder' && styles.rolePillActiveElder]}
            onPress={() => setActiveRole('elder')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Switch to Elder Mode"
          >
            <Text style={[styles.rolePillText, activeRole === 'elder' && styles.rolePillTextActive]}>
              👵 Elder
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rolePill, activeRole === 'volunteer' && styles.rolePillActiveVolunteer]}
            onPress={() => setActiveRole('volunteer')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Switch to Caregiver Dashboard"
          >
            <Text style={[styles.rolePillText, activeRole === 'volunteer' && styles.rolePillTextActive]}>
              👩‍⚕️ Caregiver
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom row: Quick action indicators */}
      <View style={styles.bottomRow}>
        {/* Pairing Status Badge (Clickable) */}
        <TouchableOpacity 
          style={styles.pairingBadge}
          onPress={() => {
            if (activeRole === 'elder') {
              setElderScreen('pairing');
            }
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.statusDot, pairData.isPaired ? styles.dotGreen : styles.dotOrange]} />
          <Text style={styles.pairingText}>
            {pairData.isPaired ? `PIN: ${pairData.pinCode} • Paired` : `PIN: ${pairData.pinCode} • Tap to view`}
          </Text>
        </TouchableOpacity>

        {/* Language & Voice buttons */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity 
            style={styles.actionChip} 
            onPress={() => setIsLangModalOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Select language"
          >
            <Text style={styles.actionChipText}>
              {currentLangObj.flag} {currentLangObj.label}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionChip, !voicePromptEnabled && styles.actionChipMuted]} 
            onPress={() => {
              const next = !voicePromptEnabled;
              setVoicePromptEnabled(next);
              if (next) {
                speakText('Voice prompts enabled', language);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Toggle voice prompts"
          >
            <Text style={styles.actionChipText}>
              {voicePromptEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => setIsAuthModalOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="User settings"
          >
            <Text style={styles.profileBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selector Modal */}
      <Modal
        visible={isLangModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsLangModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌐 Choose Elder Language</Text>
            <Text style={styles.modalSubtitle}>All voice alerts & prompts will speak in this language</Text>
            
            <ScrollView style={styles.langList}>
              {SUPPORTED_LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.langItem, language === l.code && styles.langItemActive]}
                  onPress={() => {
                    setLanguage(l.code);
                    setIsLangModalOpen(false);
                    speakText(`Language changed to ${l.label}`, l.code);
                  }}
                >
                  <Text style={styles.langItemFlag}>{l.flag}</Text>
                  <View style={styles.langItemInfo}>
                    <Text style={[styles.langItemName, language === l.code && styles.langItemNameActive]}>
                      {l.label} ({l.nativeLabel})
                    </Text>
                    {l.region ? <Text style={styles.langItemRegion}>{l.region}</Text> : null}
                  </View>
                  {language === l.code ? <Text style={styles.checkmark}>✓</Text> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setIsLangModalOpen(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandEmoji: {
    fontSize: 22,
    marginRight: 6,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    padding: 3,
  },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rolePillActiveElder: {
    backgroundColor: '#DC2626',
  },
  rolePillActiveVolunteer: {
    backgroundColor: '#2563EB',
  },
  rolePillText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  rolePillTextActive: {
    color: '#FFFFFF',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pairingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 36,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotGreen: {
    backgroundColor: '#16A34A',
  },
  dotOrange: {
    backgroundColor: '#EA580C',
  },
  pairingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 36,
    justifyContent: 'center',
  },
  actionChipMuted: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  profileBtn: {
    padding: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  profileBtnText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  langList: {
    maxHeight: 360,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  langItemActive: {
    backgroundColor: '#EFF6FF',
  },
  langItemFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  langItemInfo: {
    flex: 1,
  },
  langItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  langItemNameActive: {
    color: '#2563EB',
  },
  langItemRegion: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  closeBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 50,
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});