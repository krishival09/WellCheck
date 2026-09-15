import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form, useSafeAreaInsets } from '../rn-compat';
import React from 'react';
import { useApp } from '../context/AppContext';
import { ElderHome } from './elder/ElderHome';
import { ElderSosCountdown } from './elder/ElderSosCountdown';
import { ElderSosConfirmation } from './elder/ElderSosConfirmation';
import { ElderMedicineDetail } from './elder/ElderMedicineDetail';
import { ElderPairingView } from './elder/ElderPairingView';
import { VolunteerDashboard } from './volunteer/VolunteerDashboard';
import { VolunteerPairingView } from './volunteer/VolunteerPairingView';
import { LoginPage } from './auth/LoginPage';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { CallModal } from './components/CallModal';
import { TtsSubtitleBanner } from './components/TtsSubtitleBanner';
import { Smartphone, HeartHandshake } from 'lucide-react-native';

/**
 * MobileApp — Pure Mobile Container
 * 
 * Renders the pure mobile application edge-to-edge for native mobile devices (iOS / Android)
 * with hardware safe area insets to prevent overlap with status bar and 3-button navigation.
 */
export const MobileApp: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { 
    currentUser, 
    activeRole, 
    elderScreen, 
    setElderScreen, 
    volunteerScreen, 
    setVolunteerScreen, 
    activeSosAlert,
    isSimulationLoading,
    isSimulationEmpty,
    setIsSimulationLoading,
    setIsSimulationEmpty,
    activeCall,
  } = useApp();

  // If not logged in yet, render the Mobile First-Time Login / Onboarding screen
  if (!currentUser.isLoggedIn) {
    return (
      <Div 
        className="w-full flex-1 bg-[#FAF7F2] flex flex-col overflow-y-auto"
        style={{
          paddingTop: Math.max(insets.top, 0),
          paddingBottom: Math.max(insets.bottom, 0),
        }}
      >
        <Div className="p-3 sm:p-5 flex flex-col items-center justify-start w-full">
          <LoginPage />
        </Div>
        <TtsSubtitleBanner />
      </Div>
    );
  }

  // Elder Screen Renderer
  const renderElderMobile = () => {
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
          <Div className="flex-1 p-4 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1A2B4C] text-center">
            <Div className="w-14 h-14 rounded-2xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] mb-3 shadow-[2px_2px_0px_#1A2B4C]">
              <Smartphone className="w-8 h-8" />
            </Div>
            <H2 className="text-xl font-black uppercase tracking-tight">Elder Mode Active</H2>
            <P className="text-xs font-bold text-[#1A2B4C]/80 mt-1 max-w-xs">
              Senior mode with voice guidance and single-tap SOS.
            </P>
            <Button
              onClick={() => setElderScreen('home')}
              className="mt-4 px-4 py-2 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1A2B4C] cursor-pointer"
            >
              Go to Home Screen
            </Button>
          </Div>
        );
      case 'home':
      default:
        return <ElderHome />;
    }
  };

  // Volunteer Screen Renderer
  const renderVolunteerMobile = () => {
    if (activeSosAlert && activeSosAlert.status === 'active') {
      return <VolunteerDashboard />;
    }

    if (isSimulationLoading || volunteerScreen === 'loading_demo') {
      return (
        <Div className="flex-1 flex flex-col bg-[#FAF7F2]">
          <LoadingState message="Connecting to Elder live stream..." />
          <Div className="p-3 bg-white border-t border-[#1A2B4C]/20 flex justify-center">
            <Button
              onClick={() => {
                setIsSimulationLoading(false);
                setVolunteerScreen('dashboard');
              }}
              className="px-3 py-1.5 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              Exit Loading Demo
            </Button>
          </Div>
        </Div>
      );
    }

    if (isSimulationEmpty || volunteerScreen === 'empty_demo') {
      return (
        <Div className="flex-1 p-4 bg-[#FAF7F2] flex flex-col justify-center items-center">
          <EmptyState 
            type="alerts" 
            title="No Active Alerts" 
            description="Elder is safe and checking in on schedule. No emergency signals pending." 
            actionText="Back to Dashboard"
            onAction={() => {
              setIsSimulationEmpty(false);
              setVolunteerScreen('dashboard');
            }}
          />
        </Div>
      );
    }

    if (volunteerScreen === 'pairing') {
      return (
        <Div className="flex-1 flex flex-col bg-[#FAF7F2]">
          <VolunteerPairingView onSuccess={() => setVolunteerScreen('dashboard')} />
        </Div>
      );
    }

    if (volunteerScreen === 'login') {
      return (
        <Div className="flex-1 p-4 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1A2B4C] text-center">
          <Div className="w-14 h-14 rounded-2xl bg-[#4CAF50] text-white border-2 border-[#1A2B4C] flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1A2B4C]">
            <HeartHandshake className="w-8 h-8" />
          </Div>
          <H2 className="text-xl font-black uppercase tracking-tight">Caregiver Portal</H2>
          <P className="text-xs font-bold text-[#1A2B4C]/80 mt-1 max-w-xs">
            Monitoring elder check-ins, medication logs, and real-time SOS signals.
          </P>
          <Button
            onClick={() => setVolunteerScreen('dashboard')}
            className="mt-4 px-4 py-2 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1A2B4C] cursor-pointer"
          >
            Open Dashboard
          </Button>
        </Div>
      );
    }

    return <VolunteerDashboard />;
  };

  return (
    <Div 
      className="w-full h-full flex-1 bg-[#FAF7F2] flex flex-col overflow-hidden select-none"
      style={{
        paddingTop: Math.max(insets.top, 0),
        paddingBottom: Math.max(insets.bottom, 0),
      }}
    >
      {activeRole === 'elder' ? renderElderMobile() : renderVolunteerMobile()}
      
      {/* Universal In-App Call Overlay */}
      {activeCall && <CallModal />}
      
      {/* Universal Speech Subtitle Banner */}
      <TtsSubtitleBanner />
    </Div>
  );
};
