import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface VolunteerLocationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerLocationTrackerModal: React.FC<VolunteerLocationTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    elderLocation, 
    refreshElderLocationPing, 
    simulateElderMovement, 
    selectedElder 
  } = useApp();

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>📍 GPS Live Location Tracking</Text>
            <Text style={styles.subtitle}>Real-time location & safe perimeter monitor</Text>

            {/* Current Location Card */}
            <View style={styles.locationCard}>
              <View style={styles.headerRow}>
                <Text style={styles.elderTitle}>👵 {selectedElder.name}</Text>
                <View style={styles.safeZoneBadge}>
                  <Text style={styles.safeZoneText}>
                    {elderLocation.safeZoneStatus === 'inside_home' ? '🟢 Inside Safe Zone' : '🟡 Outside Home Zone'}
                  </Text>
                </View>
              </View>

              <Text style={styles.addressText}>{elderLocation.address}</Text>
              <Text style={styles.landmarkText}>Landmark: {elderLocation.landmark}</Text>
              
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>🛰️ Lat: {elderLocation.latitude.toFixed(4)}, Lng: {elderLocation.longitude.toFixed(4)}</Text>
                <Text style={styles.metaText}>🎯 Accuracy: ±{elderLocation.accuracyMeters}m</Text>
              </View>
              <Text style={styles.lastUpdatedText}>⏱️ {elderLocation.lastUpdated}</Text>

              <TouchableOpacity 
                style={styles.pingBtn}
                onPress={refreshElderLocationPing}
              >
                <Text style={styles.pingBtnText}>🛰️ Ping GPS Satellite Now</Text>
              </TouchableOpacity>
            </View>

            {/* Movement Presets for Demo */}
            <View style={styles.presetsCard}>
              <Text style={styles.presetsTitle}>🗺️ Demo Movement Simulator</Text>
              <Text style={styles.presetsSub}>Simulate elder moving between geofenced zones:</Text>

              <View style={styles.presetsRow}>
                <TouchableOpacity 
                  style={styles.presetBtn}
                  onPress={() => simulateElderMovement('home')}
                >
                  <Text style={styles.presetIcon}>🏠</Text>
                  <Text style={styles.presetText}>Home Zone</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.presetBtn}
                  onPress={() => simulateElderMovement('park')}
                >
                  <Text style={styles.presetIcon}>🌳</Text>
                  <Text style={styles.presetText}>Park Walk</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.presetBtn}
                  onPress={() => simulateElderMovement('pharmacy')}
                >
                  <Text style={styles.presetIcon}>🏥</Text>
                  <Text style={styles.presetText}>Pharmacy</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Location History */}
            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>📜 Location Activity Log</Text>
              {elderLocation.history && elderLocation.history.length > 0 ? (
                elderLocation.history.map((pt) => (
                  <View key={pt.id} style={styles.historyItem}>
                    <Text style={styles.historyTime}>⏰ {pt.time}</Text>
                    <Text style={styles.historyAddress}>{pt.address}</Text>
                    <Text style={styles.historyStatus}>{pt.status}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyHistory}>No recent movement history recorded.</Text>
              )}
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Done / Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  elderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  safeZoneBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  safeZoneText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#15803D',
  },
  addressText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 4,
  },
  landmarkText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 6,
  },
  pingBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  pingBtnText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  presetsCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  presetsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  presetsSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  presetIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  presetText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  historyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  historyAddress: {
    fontSize: 13,
    color: '#0F172A',
    marginTop: 2,
  },
  historyStatus: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  emptyHistory: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 10,
  },
  closeBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});