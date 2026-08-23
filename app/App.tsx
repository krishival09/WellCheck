import React from 'react';
import { 
  SafeAreaView, 
  View, 
  StyleSheet, 
  StatusBar,
  Platform 
} from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { HeaderNav } from './src/components/HeaderNav';
import { TtsSubtitleBanner } from './src/components/common/TtsSubtitleBanner';
import { CallModal } from './src/components/common/CallModal';
import { AuthModal } from './src/components/common/AuthModal';
import { LoginPage } from './src/components/common/LoginPage';
import { ElderHome } from './src/components/elder/ElderHome';
import { ElderSosCountdown } from './src/components/elder/ElderSosCountdown';
import { ElderSosConfirmation } from './src/components/elder/ElderSosConfirmation';
import { ElderMedicineDetail } from './src/components/elder/ElderMedicineDetail';
import { ElderPairingView } from './src/components/elder/ElderPairingView';
import { VolunteerDashboard } from './src/components/volunteer/VolunteerDashboard';
import { VolunteerMissedCheckinModal } from './src/components/volunteer/VolunteerMissedCheckinModal';

const MainScreen: React.FC = () => {
  const { 
    activeRole, 
    elderScreen, 
    isAuthModalOpen, 
    setIsAuthModalOpen 
  } = useApp();

  const renderElderContent = () => {
    switch (elderScreen) {
      case 'sos_countdown':
        return <ElderSosCountdown />;
      case 'sos_sent':
        return <ElderSosConfirmation />;
      case 'medicine_detail':
        return <ElderMedicineDetail />;
      case 'pairing':
        return <ElderPairingView />;
      case 'login':
        return <LoginPage />;
      case 'home':
      default:
        return <ElderHome />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Mobile-constrained centered wrapper (Max width 480px) */}
      <View style={styles.centerContainer}>
        {/* Universal Top Header & Role Switcher */}
        <HeaderNav />

        {/* Realtime TTS Subtitles Bar */}
        <TtsSubtitleBanner />

        {/* Main View Area */}
        <View style={styles.mainContainer}>
          {activeRole === 'elder' ? renderElderContent() : <VolunteerDashboard />}
        </View>

        {/* Global Modals */}
        <CallModal />
        <VolunteerMissedCheckinModal />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark stylish backdrop on web/tablet borders
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 4 : 0,
  },
  centerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: '#FAF7F2',
    overflow: 'hidden',
  },
  mainContainer: {
    flex: 1,
  },
});
