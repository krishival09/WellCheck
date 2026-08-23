import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const { setActiveRole, setElderScreen, setVolunteerScreen } = useApp();

  const handleSelectElder = () => {
    setActiveRole('elder');
    setElderScreen('home');
  };

  const handleSelectVolunteer = () => {
    setActiveRole('volunteer');
    setVolunteerScreen('dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brandEmoji}>🛡️</Text>
          <Text style={styles.title}>WellCheck</Text>
          <Text style={styles.subtitle}>Elder Care & Rapid Emergency Response</Text>
        </View>

        <Text style={styles.prompt}>Select your role to get started:</Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[styles.roleCard, styles.elderCard]} 
            onPress={handleSelectElder}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Elder Mode"
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>👵</Text>
              <Text style={styles.cardTitle}>Elder Mode</Text>
            </View>
            <Text style={styles.cardDescription}>
              Large text, 1-tap SOS emergency button, medicine reminders, and daily safety check-ins.
            </Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>⭐ Simplified Accessibility</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleCard, styles.volunteerCard]} 
            onPress={handleSelectVolunteer}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Volunteer and Caregiver Mode"
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>👩‍⚕️</Text>
              <Text style={styles.cardTitle}>Volunteer / Caregiver</Text>
            </View>
            <Text style={styles.cardDescription}>
              Real-time SOS alarm feed, check-in monitoring, GPS location, and medication manager.
            </Text>
            <View style={[styles.badgeContainer, styles.volunteerBadge]}>
              <Text style={[styles.badgeText, styles.volunteerBadgeText]}>
                📊 Live Safety Dashboard
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          ✨ Designed for live hackathon evaluation & high-reliability testing
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },
  prompt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 18,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  elderCard: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF5F5',
  },
  volunteerCard: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F7FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardDescription: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 14,
  },
  badgeContainer: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#991B1B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  volunteerBadge: {
    backgroundColor: '#DBEAFE',
  },
  volunteerBadgeText: {
    color: '#1E40AF',
  },
  footerNote: {
    marginTop: 32,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});