import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { useApp } from '../../context/AppContext';

export const VolunteerMissedCheckinModal: React.FC = () => {
  const { 
    activeMissedCheckinModal, 
    closeMissedCheckinModal, 
    acknowledgeAlert, 
    resolveAlert, 
    startCall, 
    pairData 
  } = useApp();

  if (!activeMissedCheckinModal?.isOpen) return null;

  const handleCall = () => {
    startCall({ 
      contactName: pairData.elderName || 'Eleanor Vance', 
      contactRole: 'elder', 
      reason: 'checkin' 
    });
    closeMissedCheckinModal();
  };

  const handleAck = () => {
    if (activeMissedCheckinModal.alertId) {
      acknowledgeAlert(activeMissedCheckinModal.alertId);
    }
    closeMissedCheckinModal();
  };

  const handleResolve = () => {
    if (activeMissedCheckinModal.alertId) {
      resolveAlert(activeMissedCheckinModal.alertId);
    }
    closeMissedCheckinModal();
  };

  return (
    <Modal
      visible={activeMissedCheckinModal.isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={closeMissedCheckinModal}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Missed Check-In Alert</Text>
          
          <Text style={styles.description}>
            <Text style={styles.highlight}>{pairData.elderName || 'Elder'}</Text> did not respond to the safety check-in prompt scheduled for{' '}
            <Text style={styles.highlight}>{activeMissedCheckinModal.scheduledTime}</Text> within the 3-minute response window.
          </Text>

          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>Escalation Level: Caregiver Attention Required</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.callBtn} 
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Text style={styles.btnIcon}>📞</Text>
              <Text style={styles.btnText}>Call Elder Now</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.ackBtn} 
                onPress={handleAck}
              >
                <Text style={styles.ackBtnText}>Acknowledge</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resolveBtn} 
                onPress={handleResolve}
              >
                <Text style={styles.resolveBtnText}>Mark Resolved</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  icon: {
    fontSize: 52,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  badgeBox: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginVertical: 18,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B45309',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  callBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 56,
  },
  btnIcon: {
    fontSize: 22,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ackBtn: {
    flex: 1,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 50,
  },
  ackBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resolveBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 50,
  },
  resolveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});