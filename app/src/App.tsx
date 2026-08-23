import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav, ViewLayout } from './components/HeaderNav';
import { PhoneFrame } from './components/PhoneFrame';
import { ElderHome } from './components/elder/ElderHome';
import { ElderSosCountdown } from './components/elder/ElderSosCountdown';
import { ElderSosConfirmation } from './components/elder/ElderSosConfirmation';
import { ElderMedicineDetail } from './components/elder/ElderMedicineDetail';
import { ElderPairingView } from './components/elder/ElderPairingView';
import { VolunteerDashboard } from './components/volunteer/VolunteerDashboard';
import { VolunteerPairingView } from './components/volunteer/VolunteerPairingView';
import { LoadingState } from './components/shared/LoadingState';
import { EmptyState } from './components/shared/EmptyState';
import { CallModal } from './components/common/CallModal';
import { AuthModal } from './components/common/AuthModal';
import { LoginPage } from './components/common/LoginPage';
import { TtsSubtitleBanner } from './components/common/TtsSubtitleBanner';
import { Smartphone, HeartHandshake } from 'lucide-react-native';

const ElderScreenRenderer: React.FC = () => {
  const { elderScreen, setElderScreen } = useApp();

  switch (elderScreen) {
    case 'sos_countdown':
      return <ElderSosCountdown />;
    case 'sos_confirmation':
    case 'sos_sent':
      return <ElderSosConfirmation />;
    case 'medicine_detail':
      return <ElderMedicineDetail />;
    case 'pairing':
      return <ElderPairingView />;
    case 'login':
      return (
        <View style={styles.centerView}>
          <View style={styles.iconContainer}>
            <Smartphone color="#1A2B4C" />
          </View>
          <Text style={styles.titleText}>Elder Device Active</Text>
          <Text style={styles.descText}>
            Senior mode with voice guidance and single-tap SOS.
          </Text>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setElderScreen('home')}
          >
            <Text style={styles.buttonText}>Go to Home Screen</Text>
          </TouchableOpacity>
        </View>
      );
    case 'home':
    default:
      return <ElderHome />;
  }
};

const VolunteerScreenRenderer: React.FC = () => {
  const { 
    volunteerScreen, 
    setVolunteerScreen, 
    isSimulationLoading, 
    isSimulationEmpty,
    setIsSimulationLoading,
    setIsSimulationEmpty,
    activeSosAlert,
  } = useApp();

  if (activeSosAlert && activeSosAlert.status === 'active') {
    return <VolunteerDashboard />;
  }

  if (isSimulationLoading || volunteerScreen === 'loading_demo') {
    return (
      <View style={styles.centerView}>
        <LoadingState message="Connecting to Elder live stream..." />
        <TouchableOpacity
          style={[styles.mainButton, { marginTop: 20 }]}
          onPress={() => {
            setIsSimulationLoading(false);
            setVolunteerScreen('dashboard');
          }}
        >
          <Text style={styles.buttonText}>Exit Loading Demo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isSimulationEmpty || volunteerScreen === 'empty_demo') {
    return (
      <View style={styles.centerView}>
        <EmptyState 
          type="alerts" 
          title="No Active Alerts" 
          description="Elder Eleanor is safe and checking in on schedule." 
          actionText="Back to Dashboard"
          onAction={() => {
            setIsSimulationEmpty(false);
            setVolunteerScreen('dashboard');
          }}
        />
      </View>
    );
  }

  if (volunteerScreen === 'pairing') {
    return <VolunteerPairingView onSuccess={() => setVolunteerScreen('dashboard')} />;
  }

  if (volunteerScreen === 'login') {
    return (
      <View style={styles.centerView}>
        <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
          <HeartHandshake color="white" />
        </View>
        <Text style={styles.titleText}>Caregiver Portal</Text>
        <Text style={styles.descText}>
          Monitoring elder check-ins, medication logs, and real-time SOS signals.
        </Text>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setVolunteerScreen('dashboard')}
        >
          <Text style={styles.buttonText}>Open Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <VolunteerDashboard />;
};

const MainContent: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole,
    activeSosAlert, 
    pairData, 
    isAuthModalOpen, 
    setIsAuthModalOpen,
    elderProfile,
    volunteerProfile,
  } = useApp();

  const [viewLayout, setViewLayout] = useState<ViewLayout>('dual_live');
  const [showTouchGrid, setShowTouchGrid] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <HeaderNav 
        viewLayout={viewLayout}
        setViewLayout={(layout: ViewLayout) => {
          setViewLayout(layout);
          if (layout === 'elder_solo') {
            setActiveRole('elder');
          } else if (layout === 'volunteer_solo') {
            setActiveRole('volunteer');
          }
        }}
        showTouchGrid={showTouchGrid}
        setShowTouchGrid={setShowTouchGrid}
      />

      <View style={styles.viewport}>
        <TtsSubtitleBanner />

        {viewLayout === 'elder_solo' && (
          <View style={styles.soloFrame}>
            <PhoneFrame 
              title={`Elder • ${elderProfile.name}`}
              badgeColor="elder"
              modeTag="Senior Mode"
              statusText="60dp Targets"
              showInspectionOverlay={showTouchGrid}
            >
              <ElderScreenRenderer />
            </PhoneFrame>
          </View>
        )}

        {viewLayout === 'volunteer_solo' && (
          <View style={styles.soloFrame}>
            <PhoneFrame 
              title={`Volunteer • ${volunteerProfile.name}`}
              badgeColor="volunteer"
              modeTag="Caregiver Mode"
              statusText="Live Sync"
              showInspectionOverlay={showTouchGrid}
            >
              <VolunteerScreenRenderer />
            </PhoneFrame>
          </View>
        )}

        {viewLayout === 'dual_live' && (
          <View style={styles.dualContainer}>
            <View style={styles.dualBanner}>
               <Text style={styles.dualTitle}>Dual Device Testing</Text>
               <Text style={styles.dualDesc}>Actions sync in real-time.</Text>
            </View>
            <ScrollView horizontal contentContainerStyle={styles.dualScroll}>
              <View style={styles.phoneWrapper}>
                <PhoneFrame title="Elder Device" badgeColor="elder" modeTag="Senior">
                   <ElderScreenRenderer />
                </PhoneFrame>
              </View>
              <View style={styles.phoneWrapper}>
                <PhoneFrame title="Volunteer Device" badgeColor="volunteer" modeTag="Caregiver">
                   <VolunteerScreenRenderer />
                </PhoneFrame>
              </View>
            </ScrollView>
          </View>
        )}

        {viewLayout === 'login_view' && <LoginPage />}
      </View>

      <CallModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </View>
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
  container: { flex: 1, backgroundColor: '#F0EBE1' },
  viewport: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerView: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  iconContainer: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#FFB84D', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  titleText: { fontSize: 18, fontWeight: 'bold', color: '#1A2B4C' },
  descText: { fontSize: 14, color: '#1A2B4C', textAlign: 'center', marginVertical: 8, opacity: 0.8 },
  mainButton: { backgroundColor: '#FF6B4A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  soloFrame: { flex: 1, padding: 10 },
  dualContainer: { flex: 1, width: '100%' },
  dualBanner: { padding: 12, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#DDD' },
  dualTitle: { fontWeight: '900', color: '#1A2B4C' },
  dualDesc: { fontSize: 11, opacity: 0.7 },
  dualScroll: { padding: 20, gap: 20 },
  phoneWrapper: { width: 360 }
});
