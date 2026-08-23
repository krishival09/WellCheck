import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { ElderHome } from './src/components/elder/ElderHome';
import { VolunteerDashboard } from './src/components/volunteer/VolunteerDashboard';
import { HeaderNav } from './src/components/HeaderNav';
import { TtsSubtitleBanner } from './src/components/common/TtsSubtitleBanner';
import { CallModal } from './src/components/common/CallModal';
import { AuthModal } from './src/components/common/AuthModal';
import { LoginPage } from './src/components/common/LoginPage';

const MainContent = () => {
  const { activeRole, isAuthModalOpen, setIsAuthModalOpen } = useApp();
  const [viewLayout, setViewLayout] = useState('dual_live');

  if (!activeRole) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.welcome}>Welcome to WellCheck</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {activeRole === 'elder' ? <ElderHome /> : <VolunteerDashboard />}
      <CallModal />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#1A2B4C', marginBottom: 30 },
});
