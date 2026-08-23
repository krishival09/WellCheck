import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';

interface MedicinePhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicineId: string;
  medicineName: string;
  currentPhotoUri?: string;
}

export const MedicinePhotoUploaderModal: React.FC<MedicinePhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  medicineId,
  medicineName,
  currentPhotoUri,
}) => {
  const { updateMedicinePhoto, activeRole } = useApp();
  const [selectedImage, setSelectedImage] = useState<string | null>(currentPhotoUri || null);

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos of medicine.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        setSelectedImage(localUri);
      }
    } catch (err) {
      console.warn('Camera error:', err);
    }
  };

  const handlePickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Gallery permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        setSelectedImage(localUri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      updateMedicinePhoto(medicineId, selectedImage, activeRole);
      onClose();
    }
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
          <Text style={styles.title}>📷 Medicine Photo</Text>
          <Text style={styles.subtitle}>{medicineName}</Text>
          <Text style={styles.privacyNote}>
            🔒 Local Only: This photo stays on this device for security and privacy.
          </Text>

          {/* Photo Preview */}
          <View style={styles.previewContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderIcon}>💊</Text>
                <Text style={styles.placeholderText}>No photo selected yet</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleTakePhoto}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>📸</Text>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.galleryButton]} 
              onPress={handlePickPhoto}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>🖼️</Text>
              <Text style={styles.buttonText}>From Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Save / Cancel */}
          <View style={styles.footerRow}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveBtn, !selectedImage && styles.saveBtnDisabled]} 
              onPress={handleSave}
              disabled={!selectedImage}
              activeOpacity={0.8}
            >
              <Text style={styles.saveText}>Save Photo</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  privacyNote: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    backgroundColor: '#DCFCE7',
    padding: 6,
    borderRadius: 6,
  },
  previewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#64748B',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 50,
  },
  galleryButton: {
    backgroundColor: '#0F172A',
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 50,
  },
  cancelText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 50,
  },
  saveBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});