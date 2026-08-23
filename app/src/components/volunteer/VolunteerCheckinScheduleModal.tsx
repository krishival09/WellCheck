import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Switch 
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface VolunteerCheckinScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerCheckinScheduleModal: React.FC<VolunteerCheckinScheduleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    checkinSchedules, 
    addCheckinScheduleTime, 
    deleteCheckinScheduleTime, 
    toggleCheckinScheduleTime,
    triggerCheckinPrompt,
    simulateMissedCheckinTimeout,
    pairData 
  } = useApp();

  const [newTime, setNewTime] = useState('12:00 PM');
  const [newLabel, setNewLabel] = useState('Midday Wellness Check');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newTime.trim()) return;
    addCheckinScheduleTime(newTime.trim(), newLabel.trim());
    setNewTime('');
    setNewLabel('');
    setIsAdding(false);
  };

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
            <Text style={styles.title}>📅 Daily Check-In Schedules</Text>
            <Text style={styles.subtitle}>
              Configure scheduled safety prompts for {pairData.elderName || 'Elder'}
            </Text>

            {/* Schedule Slots List */}
            <View style={styles.slotsList}>
              {checkinSchedules.map((slot) => (
                <View key={slot.id} style={styles.slotCard}>
                  <View style={styles.slotInfo}>
                    <Text style={styles.slotTime}>⏰ {slot.time}</Text>
                    <Text style={styles.slotLabel}>{slot.label}</Text>
                  </View>

                  <View style={styles.slotControls}>
                    <Switch
                      value={slot.enabled}
                      onValueChange={() => toggleCheckinScheduleTime(slot.id)}
                      trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                      thumbColor={slot.enabled ? '#16A34A' : '#94A3B8'}
                    />
                    <TouchableOpacity 
                      style={styles.deleteSlotBtn}
                      onPress={() => deleteCheckinScheduleTime(slot.id)}
                    >
                      <Text style={styles.deleteSlotText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Add Slot Form */}
            {isAdding ? (
              <View style={styles.addForm}>
                <Text style={styles.formTitle}>➕ Add Check-In Time</Text>
                
                <Text style={styles.inputLabel}>Time (e.g. 02:30 PM):</Text>
                <TextInput
                  style={styles.input}
                  value={newTime}
                  onChangeText={setNewTime}
                  placeholder="02:30 PM"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Label / Purpose:</Text>
                <TextInput
                  style={styles.input}
                  value={newLabel}
                  onChangeText={setNewLabel}
                  placeholder="Afternoon Tea & Safety Check"
                  placeholderTextColor="#94A3B8"
                />

                <View style={styles.formBtnRow}>
                  <TouchableOpacity 
                    style={styles.cancelAddBtn} 
                    onPress={() => setIsAdding(false)}
                  >
                    <Text style={styles.cancelAddText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.saveAddBtn} 
                    onPress={handleAdd}
                  >
                    <Text style={styles.saveAddText}>Save Time</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addSlotBtn}
                onPress={() => setIsAdding(true)}
              >
                <Text style={styles.addSlotBtnText}>+ Add Check-In Time Slot</Text>
              </TouchableOpacity>
            )}

            {/* Demo Simulation Controls (PRD §4.3, §7) */}
            <View style={styles.demoSection}>
              <Text style={styles.demoSectionTitle}>⚡ Live Demo Triggers</Text>
              
              <TouchableOpacity 
                style={styles.triggerPromptBtn}
                onPress={() => {
                  triggerCheckinPrompt();
                  onClose();
                }}
              >
                <Text style={styles.triggerPromptText}>🔔 Trigger Check-In Prompt Now</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.simulateMissedBtn}
                onPress={() => {
                  simulateMissedCheckinTimeout();
                  onClose();
                }}
              >
                <Text style={styles.simulateMissedText}>⚠️ Simulate 3-Min Missed Timeout</Text>
              </TouchableOpacity>
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
  slotsList: {
    gap: 10,
    marginBottom: 16,
  },
  slotCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotInfo: {
    flex: 1,
  },
  slotTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  slotLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  slotControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteSlotBtn: {
    padding: 6,
  },
  deleteSlotText: {
    fontSize: 18,
  },
  addSlotBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addSlotBtnText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  formBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  cancelAddBtn: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelAddText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveAddBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveAddText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  demoSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    marginBottom: 16,
    gap: 8,
  },
  demoSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  triggerPromptBtn: {
    backgroundColor: '#D97706',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  triggerPromptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  simulateMissedBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  simulateMissedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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