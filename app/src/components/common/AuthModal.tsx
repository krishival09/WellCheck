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
import { RoleMode, SupportedLanguage } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../utils/speech';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, currentUser } = useApp();
  const [role, setRole] = useState<RoleMode>(currentUser.role || 'elder');
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phoneNumber || '');
  const [language, setLanguage] = useState<SupportedLanguage>(currentUser.preferredLanguage || 'hi-IN');

  const handleSubmit = () => {
    loginUser({
      name: name.trim() || (role === 'elder' ? 'Eleanor Vance' : 'Sarah Chen'),
      email: `${role}@wellcheck.app`,
      phoneCountryCode: '+91',
      phoneNumber: phone.trim() || (role === 'elder' ? '9845012345' : '9845067890'),
      role,
      preferredLanguage: language,
    });
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
            <Text style={styles.title}>👤 Profile Settings</Text>
            <Text style={styles.subtitle}>Configure user profile and preferences</Text>

            {/* Role Selection */}
            <Text style={styles.label}>Select Role:</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'elder' && styles.roleBtnActive]}
                onPress={() => setRole('elder')}
              >
                <Text style={styles.roleEmoji}>👵</Text>
                <Text style={[styles.roleText, role === 'elder' && styles.roleTextActive]}>
                  Elder
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleBtn, role === 'volunteer' && styles.roleBtnActive]}
                onPress={() => setRole('volunteer')}
              >
                <Text style={styles.roleEmoji}>👩‍⚕️</Text>
                <Text style={[styles.roleText, role === 'volunteer' && styles.roleTextActive]}>
                  Volunteer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Name Input */}
            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={role === 'elder' ? 'Eleanor Vance' : 'Sarah Chen'}
              placeholderTextColor="#94A3B8"
            />

            {/* Phone Input */}
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98450 12345"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />

            {/* Preferred Language */}
            <Text style={styles.label}>Preferred Language:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langScroll}>
              {SUPPORTED_LANGUAGES.slice(0, 10).map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.langChip, language === l.code && styles.langChipActive]}
                  onPress={() => setLanguage(l.code)}
                >
                  <Text style={styles.langFlag}>{l.flag}</Text>
                  <Text style={[styles.langText, language === l.code && styles.langTextActive]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveBtnText}>Save & Switch</Text>
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
    marginTop: 14,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  roleBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  roleEmoji: {
    fontSize: 28,
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 4,
  },
  roleTextActive: {
    color: '#2563EB',
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
  langScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  langChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  langFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  langTextActive: {
    color: '#FFFFFF',
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