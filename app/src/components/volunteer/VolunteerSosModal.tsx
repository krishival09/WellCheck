import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Linking 
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface VolunteerSosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerSosModal: React.FC<VolunteerSosModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    activeSosAlert, 
    acknowledgeAlert, 
    resolveAlert, 
    elderLocation, 
    startCall,
    pairData 
  } = useApp();

  if (!isOpen) return null;

  const handleCall = () => {
    startCall({ 
      contactName: pairData.elderName || 'Eleanor Vance', 
      contactRole: 'elder', 
      reason: 'sos' 
    });
  };

  const handleNativeCall = () => {
    Linking.openURL(`tel:+919845012345`).catch(() => {});
  };

  const handleAck = async () => {
    if (activeSosAlert?.id) {
      await acknowledgeAlert(activeSosAlert.id);
    }
  };

  const handleResolve = async () => {
    if (activeSosAlert?.id) {
      await resolveAlert(activeSosAlert.id);
    }
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Urgent Header */}
          <View style={styles.header}>
            <Text style={styles.sirenIcon}>🚨</Text>
            <Text style={styles.headerTitle}>CRITICAL SOS ALERT</Text>
            <Text style={styles.headerSubtitle}>Elder triggered emergency assistance</Text>
          </View>

          {/* Elder Details Card */}
          <View style={styles.card}>
            <View style={styles.elderInfoRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>👵</Text>
              </View>
              <View style={styles.elderTextGroup}>
                <Text style={styles.elderName}>{pairData.elderName || 'Eleanor Vance'}</Text>
                <Text style={styles.statusLabel}>Status: 🔴 EMERGENCY ACTIVE</Text>
                <Text style={styles.timeLabel}>
                  Triggered: {activeSosAlert?.createdAt ? new Date(activeSosAlert.createdAt).toLocaleTimeString() : 'Just now'}
                </Text>
              </View>
            </View>

            {/* GPS Location Details */}
            <View style={styles.locationBox}>
              <Text style={styles.locationTitle}>📍 Current GPS Coordinates:</Text>
              <Text style={styles.locationAddress}>{elderLocation.address}</Text>
              <Text style={styles.locationCoords}>
                Lat: {elderLocation.latitude.toFixed(4)}, Lng: {elderLocation.longitude.toFixed(4)} ({elderLocation.landmark})
              </Text>
            </View>
          </View>

          {/* Rapid Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.callBtn} 
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Text style={styles.btnIcon}>📞</Text>
              <Text style={styles.btnText}>Call Elder (App)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nativeDialBtn} 
              onPress={handleNativeCall}
              activeOpacity={0.8}
            >
              <Text style={styles.btnIcon}>📱</Text>
              <Text style={styles.btnText}>Open Phone Dialer</Text>
            </TouchableOpacity>

            <View style={styles.ackResolveRow}>
              <TouchableOpacity 
                style={styles.ackBtn} 
                onPress={handleAck}
                activeOpacity={0.8}
              >
                <Text style={styles.ackText}>ACKNOWLEDGE</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resolveBtn} 
                onPress={handleResolve}
                activeOpacity={0.8}
              >
                <Text style={styles.resolveText}>RESOLVE & CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7F1D1D',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  sirenIcon: {
    fontSize: 54,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FEE2E2',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  elderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  elderTextGroup: {
    flex: 1,
  },
  elderName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 2,
  },
  timeLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  locationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  locationAddress: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 4,
  },
  locationCoords: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 10,
  },
  callBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 64,
  },
  nativeDialBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
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
  ackResolveRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  ackBtn: {
    flex: 1,
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  ackText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resolveBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  resolveText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
});