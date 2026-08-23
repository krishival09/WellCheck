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

interface ElderAddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElderAddMedicineModal: React.FC<ElderAddMedicineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addMedicine, pairData } = useApp();
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [dosage, setDosage] = useState('1 tablet');
  const [instructions, setInstructions] = useState('Take with water after food');

  const handleSave = () => {
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
    onClose();
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
            <Text style={styles.title}>💊 Add Medication</Text>
            <Text style={styles.subtitle}>Schedule medication reminder for elder</Text>

            <Text style={styles.label}>Medicine Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Lisinopril 10mg"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Scheduled Time:</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 08:00 AM"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Dosage:</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="e.g. 1 tablet with water"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Instructions:</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. Take after breakfast. Stored in blue pill box."
              placeholderTextColor="#94A3B8"
              multiline
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Reminder</Text>
              </TouchableOpacity>
            </View>
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
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
  },
  scroll: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 50,
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 50,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});