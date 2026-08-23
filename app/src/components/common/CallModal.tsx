import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  SafeAreaView 
} from 'react-native';
import { useApp } from '../../context/AppContext';

export const CallModal: React.FC = () => {
  const { activeCall, endCall, toggleCallMute, toggleCallSpeaker } = useApp();

  if (!activeCall.isOpen) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNativeCall = () => {
    if (activeCall.phoneNumber) {
      Linking.openURL(`tel:${activeCall.phoneNumber}`).catch(() => {});
    }
  };

  return (
    <Modal
      visible={activeCall.isOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={endCall}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Status */}
          <View style={styles.header}>
            <Text style={styles.callBadge}>
              {activeCall.status === 'ringing' ? '🔔 CALLING...' : '🟢 CONNECTED (LIVE AUDIO)'}
            </Text>
            <Text style={styles.contactName}>{activeCall.contactName}</Text>
            <Text style={styles.phoneNumber}>{activeCall.phoneNumber}</Text>
            <Text style={styles.callStatus}>
              {activeCall.status === 'connected'
                ? formatDuration(activeCall.connectedDurationSec)
                : 'Ringing caregiver phone...'}
            </Text>
          </View>

          {/* Avatar / Animation Center */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>
                {activeCall.contactRole === 'caregiver' ? '👩‍⚕️' : '👵'}
              </Text>
            </View>
          </View>

          {/* Native Dialer Shortcut */}
          <TouchableOpacity 
            style={styles.nativeDialButton}
            onPress={handleNativeCall}
            activeOpacity={0.8}
          >
            <Text style={styles.nativeDialText}>📞 Open Native Phone Dialer</Text>
          </TouchableOpacity>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlBtn, activeCall.isMuted && styles.controlBtnActive]}
              onPress={toggleCallMute}
            >
              <Text style={styles.controlIcon}>{activeCall.isMuted ? '🔇' : '🎙️'}</Text>
              <Text style={styles.controlLabel}>{activeCall.isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, activeCall.isSpeakerOn && styles.controlBtnActive]}
              onPress={toggleCallSpeaker}
            >
              <Text style={styles.controlIcon}>{activeCall.isSpeakerOn ? '🔊' : '🔈'}</Text>
              <Text style={styles.controlLabel}>Speaker</Text>
            </TouchableOpacity>
          </View>

          {/* End Call Button */}
          <View style={styles.endCallContainer}>
            <TouchableOpacity 
              style={styles.endCallBtn} 
              onPress={endCall}
              activeOpacity={0.8}
            >
              <Text style={styles.endCallIcon}>📵</Text>
              <Text style={styles.endCallText}>END CALL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  callBadge: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  phoneNumber: {
    color: '#94A3B8',
    fontSize: 18,
    marginTop: 6,
  },
  callStatus: {
    color: '#E2E8F0',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1E293B',
    borderWidth: 4,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 64,
  },
  nativeDialButton: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeDialText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  controlBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
  },
  controlIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  endCallContainer: {
    width: '100%',
    marginBottom: 20,
  },
  endCallBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  endCallIcon: {
    fontSize: 30,
  },
  endCallText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});