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
  const [photoUri, setPhotoUri] = useState<string | null>(null);

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

  const handleSave = () => {
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

            {/* Photo Section */}
            <Text style={styles.label}>Medicine Photo (Stored Locally):</Text>
            <View style={styles.photoBox}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.placeholderIcon}>📸</Text>
                  <Text style={styles.placeholderText}>No photo selected</Text>
                </View>
              )}

              <View style={styles.photoButtonsRow}>
                <TouchableOpacity 
                  style={styles.photoBtn} 
                  onPress={handleTakePhoto}
                  activeOpacity={0.8}
                >
                  <Text style={styles.photoBtnText}>📷 Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.photoBtn, styles.galleryBtn]} 
                  onPress={handlePickPhoto}
                  activeOpacity={0.8}
                >
                  <Text style={styles.photoBtnText}>🖼️ Gallery</Text>
                </TouchableOpacity>

                {photoUri ? (
                  <TouchableOpacity 
                    style={styles.removePhotoBtn} 
                    onPress={() => setPhotoUri(null)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.removePhotoText}>✕</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 6,
  },
  photoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  photoPreview: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
  },
  photoPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 28,
  },
  placeholderText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  photoBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  galleryBtn: {
    backgroundColor: '#0F172A',
  },
  photoBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  removePhotoBtn: {
    backgroundColor: '#EF4444',
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
    fontSize: 15,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
});