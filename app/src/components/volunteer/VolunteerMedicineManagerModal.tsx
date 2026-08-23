import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { MedicineReminderDoc } from '../../types';

interface VolunteerMedicineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerMedicineManagerModal: React.FC<VolunteerMedicineManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    medicines, 
    addMedicine, 
    deleteMedicine, 
    resetMedicineStatus, 
    pairData 
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [dosage, setDosage] = useState('1 tablet');
  const [instructions, setInstructions] = useState('Take with meal and full glass of water');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!name.trim()) return;

    addMedicine({
      elderId: pairData.elderId,
      medicineName: name.trim(),
      dosage: dosage.trim() || '1 tablet',
      scheduledTime: time.trim() || '08:00 AM',
      instructions: instructions.trim() || 'Take with water',
      localPhotoRef: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      taken: false,
      takenAt: null,
    });

    setName('');
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
            <Text style={styles.title}>💊 Medication Manager</Text>
            <Text style={styles.subtitle}>
              Manage daily prescriptions for {pairData.elderName || 'Elder'}
            </Text>

            {/* List of existing medicines */}
            <View style={styles.medsList}>
              {medicines.map((med) => (
                <View key={med.id} style={styles.medCard}>
                  <View style={styles.medHeaderRow}>
                    <Text style={styles.medName}>{med.medicineName}</Text>
                    <View style={[styles.statusBadge, med.taken ? styles.statusBadgeTaken : styles.statusBadgePending]}>
                      <Text style={[styles.statusBadgeText, med.taken ? styles.statusTextTaken : styles.statusTextPending]}>
                        {med.taken ? 'Taken ✓' : 'Due / Pending'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.medTime}>⏰ {med.scheduledTime} • {med.dosage}</Text>
                  <Text style={styles.medInstructions}>{med.instructions}</Text>

                  <View style={styles.medActionsRow}>
                    <TouchableOpacity 
                      style={styles.resetBtn}
                      onPress={() => resetMedicineStatus(med.id)}
                    >
                      <Text style={styles.resetBtnText}>🔄 Reset Status</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.deleteBtn}
                      onPress={() => deleteMedicine(med.id)}
                    >
                      <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Add Medicine Form */}
            {isAdding ? (
              <View style={styles.addForm}>
                <Text style={styles.formTitle}>➕ Add New Medication</Text>
                
                <Text style={styles.inputLabel}>Medicine Name:</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Metformin 500mg"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Scheduled Time:</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="e.g. 01:00 PM"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Dosage:</Text>
                <TextInput
                  style={styles.input}
                  value={dosage}
                  onChangeText={setDosage}
                  placeholder="e.g. 1 tablet with food"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Instructions:</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder="Special instructions or storage location"
                  placeholderTextColor="#94A3B8"
                  multiline
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
                    <Text style={styles.saveAddText}>Save Schedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addNewMedBtn}
                onPress={() => setIsAdding(true)}
              >
                <Text style={styles.addNewMedBtnText}>+ Add New Prescription</Text>
              </TouchableOpacity>
            )}

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
  medsList: {
    gap: 12,
    marginBottom: 16,
  },
  medCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  medName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeTaken: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusTextTaken: {
    color: '#15803D',
  },
  statusTextPending: {
    color: '#B45309',
  },
  medTime: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  medInstructions: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  medActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  resetBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  addNewMedBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addNewMedBtnText: {
    color: '#2563EB',
    fontSize: 16,
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
    marginBottom: 10,
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
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
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