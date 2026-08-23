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
  Image,
  Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';
import { MedicinePhotoUploaderModal } from '../common/MedicinePhotoUploaderModal';

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
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Photo uploader state for editing existing medicine photo
  const [activePhotoMed, setActivePhotoMed] = useState<{ id: string; name: string; photo?: string } | null>(null);

  if (!isOpen) return null;

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to photograph medicine.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Camera error:', err);
    }
  };

  const handlePickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Gallery access is needed to select a photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const handleAdd = () => {
    if (!name.trim()) return;

    addMedicine({
      elderId: pairData.elderId,
      medicineName: name.trim(),
      dosage: dosage.trim() || '1 tablet',
      scheduledTime: time.trim() || '08:00 AM',
      instructions: instructions.trim() || 'Take with water',
      localPhotoRef: photoUri || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      taken: false,
      takenAt: null,
    });

    setName('');
    setPhotoUri(null);
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
                  <View style={styles.medCardTopRow}>
                    <Image 
                      source={{ uri: med.localPhotoRef || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80' }} 
                      style={styles.medThumb} 
                    />
                    <View style={styles.medDetailsGroup}>
                      <View style={styles.medHeaderRow}>
                        <Text style={styles.medName}>{med.medicineName}</Text>
                        <View style={[styles.statusBadge, med.taken ? styles.statusBadgeTaken : styles.statusBadgePending]}>
                          <Text style={[styles.statusBadgeText, med.taken ? styles.statusTextTaken : styles.statusTextPending]}>
                            {med.taken ? 'Taken ✓' : 'Due / Pending'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.medTime}>⏰ {med.scheduledTime} • {med.dosage}</Text>
                    </View>
                  </View>

                  <Text style={styles.medInstructions}>{med.instructions}</Text>

                  <View style={styles.medActionsRow}>
                    <TouchableOpacity 
                      style={styles.photoBtnSmall}
                      onPress={() => setActivePhotoMed({ id: med.id, name: med.medicineName, photo: med.localPhotoRef })}
                    >
                      <Text style={styles.photoBtnSmallText}>📷 Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.resetBtn}
                      onPress={() => resetMedicineStatus(med.id)}
                    >
                      <Text style={styles.resetBtnText}>🔄 Reset</Text>
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
                
                {/* Photo Selection */}
                <Text style={styles.inputLabel}>Medicine Photo:</Text>
                <View style={styles.photoBox}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.formPhotoPreview} />
                  ) : (
                    <View style={styles.formPhotoPlaceholder}>
                      <Text style={styles.placeholderIcon}>📸</Text>
                      <Text style={styles.placeholderText}>No photo selected</Text>
                    </View>
                  )}

                  <View style={styles.photoActionsRow}>
                    <TouchableOpacity style={styles.photoActionBtn} onPress={handleTakePhoto}>
                      <Text style={styles.photoActionBtnText}>📷 Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.photoActionBtn, styles.galleryActionBtn]} onPress={handlePickPhoto}>
                      <Text style={styles.photoActionBtnText}>🖼️ Gallery</Text>
                    </TouchableOpacity>
                    {photoUri ? (
                      <TouchableOpacity style={styles.removePhotoBtn} onPress={() => setPhotoUri(null)}>
                        <Text style={styles.removePhotoText}>✕</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

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
                  placeholder="e.g. Take with warm water after lunch"
                  placeholderTextColor="#94A3B8"
                  multiline
                />

                <View style={styles.formButtonsRow}>
                  <TouchableOpacity 
                    style={styles.formCancelBtn} 
                    onPress={() => {
                      setIsAdding(false);
                      setPhotoUri(null);
                    }}
                  >
                    <Text style={styles.formCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.formSaveBtn} 
                    onPress={handleAdd}
                  >
                    <Text style={styles.formSaveText}>Save Medication</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addMedTriggerBtn}
                onPress={() => setIsAdding(true)}
              >
                <Text style={styles.addMedTriggerIcon}>➕</Text>
                <Text style={styles.addMedTriggerText}>Add New Medication</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Done / Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Existing Med Photo Uploader Modal */}
      {activePhotoMed ? (
        <MedicinePhotoUploaderModal
          isOpen={Boolean(activePhotoMed)}
          onClose={() => setActivePhotoMed(null)}
          medicineId={activePhotoMed.id}
          medicineName={activePhotoMed.name}
          currentPhotoUri={activePhotoMed.photo}
        />
      ) : null}
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
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  medCardTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  medThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#CBD5E1',
  },
  medDetailsGroup: {
    flex: 1,
  },
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 11,
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
    marginTop: 2,
  },
  medInstructions: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  medActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  photoBtnSmall: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  photoBtnSmallText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addMedTriggerBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addMedTriggerIcon: {
    fontSize: 18,
  },
  addMedTriggerText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 10,
    marginBottom: 4,
  },
  photoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 10,
    alignItems: 'center',
    marginBottom: 6,
  },
  formPhotoPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  formPhotoPlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 24,
  },
  placeholderText: {
    fontSize: 11,
    color: '#64748B',
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  photoActionBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  galleryActionBtn: {
    backgroundColor: '#0F172A',
  },
  photoActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  removePhotoBtn: {
    backgroundColor: '#EF4444',
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
  formButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  formCancelBtn: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  formCancelText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formSaveBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  formSaveText: {
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