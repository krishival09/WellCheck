import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';
import { useApp } from '../../context/AppContext';

interface VolunteerPairingViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerPairingView: React.FC<VolunteerPairingViewProps> = ({
  isOpen,
  onClose,
}) => {
  const { pairVolunteerWithPin } = useApp();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  if (!isOpen) return null;

  const handlePair = async () => {
    if (pin.trim().length < 4) {
      setMessage({ text: 'Please enter a valid 4-digit PIN code.', error: true });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const success = await pairVolunteerWithPin(pin.trim());
      if (success) {
        setMessage({ text: 'Device successfully paired and synchronized!', error: false });
        setTimeout(() => {
          onClose();
          setPin('');
          setMessage(null);
        }, 1500);
      } else {
        setMessage({ text: 'Pair not found. Please verify the PIN on the elder phone.', error: true });
      }
    } catch (err) {
      setMessage({ text: 'Error connecting device. Please check PIN.', error: true });
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>🔗 Connect to Elder Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit PIN displayed on the elder's WellCheck screen:
          </Text>

          {/* PIN Input */}
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={(val) => {
              setPin(val);
              if (message) setMessage(null);
            }}
            placeholder="e.g. 7492"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          {message ? (
            <View style={[styles.messageBox, message.error ? styles.errorBox : styles.successBox]}>
              <Text style={[styles.messageText, message.error ? styles.errorText : styles.successText]}>
                {message.text}
              </Text>
            </View>
          ) : null}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.connectBtn, loading && styles.connectBtnDisabled]} 
              onPress={handlePair}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.connectText}>Connect Device</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            💡 Tip: Open Elder Mode on the second device, tap 'Pairing PIN' to view the active code.
          </Text>
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
    padding: 24,
    width: '100%',
    maxWidth: 420,
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
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  pinInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 3,
    borderColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 16,
  },
  messageBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
  },
  successBox: {
    backgroundColor: '#DCFCE7',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: '#991B1B',
  },
  successText: {
    color: '#15803D',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  cancelText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectBtn: {
    flex: 1.5,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  connectBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  connectText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 18,
  },
});