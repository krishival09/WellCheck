/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { Smartphone, LayoutDashboard, Shield, HeartHandshake, CheckCircle2, UserCheck } from 'lucide-react';

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
        <div className="flex-1 p-4 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1A2B4C] text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] mb-3 shadow-[2px_2px_0px_#1A2B4C]">
            <Smartphone className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight">Elder Device Active</h2>
          <p className="text-xs font-bold text-[#1A2B4C]/80 mt-1 max-w-xs">
            Senior mode with voice guidance and single-tap SOS.
          </p>
          <button
            onClick={() => setElderScreen('home')}
            className="mt-4 px-4 py-2 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1A2B4C] cursor-pointer"
          >
            Go to Home Screen
          </button>
        </div>
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

  // If there is an active SOS emergency, immediately show the Volunteer Dashboard / Full SOS Takeover
  if (activeSosAlert && activeSosAlert.status === 'active') {
    return <VolunteerDashboard />;
  }

  if (isSimulationLoading || volunteerScreen === 'loading_demo') {
    return (
      <div className="flex-1 flex flex-col bg-[#FAF7F2]">
        <LoadingState message="Connecting to Elder live stream..." />
        <div className="p-3 bg-white border-t border-[#1A2B4C]/20 flex justify-center">
          <button
            onClick={() => {
              setIsSimulationLoading(false);
              setVolunteerScreen('dashboard');
            }}
            className="px-3 py-1.5 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl cursor-pointer"
          >
            Exit Loading Demo
          </button>
        </div>
      </div>
    );
  }

  if (isSimulationEmpty || volunteerScreen === 'empty_demo') {
    return (
      <div className="flex-1 p-4 bg-[#FAF7F2] flex flex-col justify-center items-center">
        <EmptyState 
          type="alerts" 
          title="No Active Alerts" 
          description="Elder Eleanor is safe and checking in on schedule. No emergency signals pending." 
          actionText="Back to Dashboard"
          onAction={() => {
            setIsSimulationEmpty(false);
            setVolunteerScreen('dashboard');
          }}
        />
      </div>
    );
  }

  if (volunteerScreen === 'pairing') {
    return (
      <div className="flex-1 flex flex-col bg-[#FAF7F2]">
        <VolunteerPairingView onSuccess={() => setVolunteerScreen('dashboard')} />
      </div>
    );
  }

  if (volunteerScreen === 'login') {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1A2B4C] text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#4CAF50] text-white border-2 border-[#1A2B4C] flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1A2B4C]">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight">Caregiver Portal</h2>
        <p className="text-xs font-bold text-[#1A2B4C]/80 mt-1 max-w-xs">
          Monitoring elder check-ins, medication logs, and real-time SOS signals.
        </p>
        <button
          onClick={() => setVolunteerScreen('dashboard')}
          className="mt-4 px-4 py-2 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl shadow-[2px_2px_0px_#1A2B4C] cursor-pointer"
        >
          Open Dashboard
        </button>
      </div>
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
    <div id="wellcheck-app-container" className="min-h-screen bg-[#F0EBE1] flex flex-col font-sans select-none antialiased">
      {/* Top Header & Simulation Navigation Controls */}
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

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-x-auto">
        
        {/* Floating Voice Audio Subtitles Banner */}
        <div className="w-full max-w-2xl px-2">
          <TtsSubtitleBanner />
        </div>

        {/* 1. ELDER SOLO VIEW */}
        {viewLayout === 'elder_solo' && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <PhoneFrame 
              title={`Elder Device • ${elderProfile.name}`}
              roleBadge="Elder Mode"
              badgeColor="elder"
              modeTag="Senior Mode"
              statusText="60dp Touch Targets"
              showInspectionOverlay={showTouchGrid}
            >
              <ElderScreenRenderer />
            </PhoneFrame>
            <div className="text-center text-xs font-bold text-[#1A2B4C]/70 max-w-sm">
              <span className="font-black text-[#1A2B4C]">Senior Mode:</span> High contrast, large touch targets, simplified photo pills, multi-language speech output, zero complex menus.
            </div>
          </div>
        )}

        {/* 2. VOLUNTEER SOLO VIEW */}
        {viewLayout === 'volunteer_solo' && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <PhoneFrame 
              title={`Volunteer Device • ${volunteerProfile.name}`}
              roleBadge="Volunteer Mode"
              badgeColor="volunteer"
              modeTag="Caregiver Mode"
              statusText="Live Sync Active"
              showInspectionOverlay={showTouchGrid}
            >
              <VolunteerScreenRenderer />
            </PhoneFrame>
            <div className="text-center text-xs font-bold text-[#1A2B4C]/70 max-w-sm">
              <span className="font-black text-[#1A2B4C]">Caregiver Mode:</span> Real-time Firestore adherence feed, full-screen SOS takeover with siren, photo verification.
            </div>
          </div>
        )}

        {/* 3. DUAL LIVE SIMULATOR (Side-by-Side) */}
        {viewLayout === 'dual_live' && (
          <div className="w-full max-w-6xl flex flex-col items-center gap-5 animate-in fade-in duration-300">
            
            {/* Live Interactive Sync Status Banner */}
            <div className="w-full max-w-4xl bg-white p-3 sm:p-4 rounded-2xl border-2 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3.5 w-3.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
                <div>
                  <span className="font-black text-[#1A2B4C] uppercase tracking-wider block leading-tight">
                    Dual Device Live Testing Mode
                  </span>
                  <span className="text-slate-600 font-semibold text-[11px]">
                    Actions taken on the Elder device update the Volunteer screen in real time.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-[#1A2B4C] bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#1A2B4C]">
                <span>Paired PIN: <strong className="font-mono">{pairData.pinCode}</strong></span>
                <span>•</span>
                <span className={activeSosAlert ? 'text-red-600 font-black animate-pulse' : 'text-emerald-700 font-bold'}>
                  {activeSosAlert ? '🚨 ACTIVE SOS' : '✅ Systems Normal'}
                </span>
              </div>
            </div>

            {/* Side-by-Side Phone Mockups */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 w-full">
              
              {/* Elder Phone */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1A2B4C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A]" />
                  <span>Elder Device • Senior UI</span>
                </div>
                <PhoneFrame 
                  title={`Elder • ${elderProfile.name}`}
                  roleBadge="Elder Mode"
                  badgeColor="elder"
                  modeTag="Senior Mode"
                  statusText="60dp Touch Targets"
                  showInspectionOverlay={showTouchGrid}
                >
                  <ElderScreenRenderer />
                </PhoneFrame>
              </div>

              {/* Volunteer Phone */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1A2B4C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
                  <span>Caregiver Device • Volunteer UI</span>
                </div>
                <PhoneFrame 
                  title={`Volunteer • ${volunteerProfile.name}`}
                  roleBadge="Volunteer Mode"
                  badgeColor="volunteer"
                  modeTag="Caregiver Mode"
                  statusText="Live Sync Active"
                  showInspectionOverlay={showTouchGrid}
                >
                  <VolunteerScreenRenderer />
                </PhoneFrame>
              </div>

            </div>
          </div>
        )}

        {/* 4. UNIFIED LOGIN & ACCOUNT DETAILS VIEW */}
        {viewLayout === 'login_view' && (
          <LoginPage />
        )}

      </main>

      {/* Global Interactive Phone/VoIP Modal */}
      <CallModal />

      {/* Global Profile & Role Switcher Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
