import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form, triggerHaptic } from '../../rn-compat';
import React, { useState } from 'react';
import { Linking, Alert } from 'react-native';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Bell, 
  Pill, 
  ShieldCheck, 
  Radio, 
  Languages, 
  KeyRound, 
  Camera, 
  Plus, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  MapPin,
  Compass,
  CalendarClock,
  Timer,
  Navigation,
  RefreshCw,
  Users,
  UserPlus,
  BatteryCharging,
  LogOut
} from 'lucide-react-native';
import { VolunteerSosModal } from './VolunteerSosModal';
import { VolunteerPairingView } from './VolunteerPairingView';
import { VolunteerMedicineManagerModal } from './VolunteerMedicineManagerModal';
import { VolunteerCheckinScheduleModal } from './VolunteerCheckinScheduleModal';
import { VolunteerMissedCheckinModal } from './VolunteerMissedCheckinModal';
import { VolunteerLocationTrackerModal } from './VolunteerLocationTrackerModal';
import { VolunteerAddElderModal } from './VolunteerAddElderModal';
import { GoogleMapView } from '../components/GoogleMapView';
import { MedicinePhotoUploaderModal } from '../components/MedicinePhotoUploaderModal';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, speakText } from '../../utils/speech';
import { SupportedLanguage, MedicineReminderDoc } from '../../types';
import { soundFx } from '../../utils/audio';

export const VolunteerDashboard: React.FC = () => {
  const {
    activeSosAlert,
    alerts,
    medicines,
    lastCheckinTime,
    pairData,
    volunteerLanguage,
    setVolunteerLanguage,
    elderProfile,
    startCall,
    checkinSchedules,
    triggerCheckinPrompt,
    activeCheckinPrompt,
    activeMissedCheckinModal,
    closeMissedCheckinModal,
    elderLocation,
    refreshElderLocationPing,
    simulateMissedCheckinTimeout,
    monitoredElders,
    selectedElderId,
    selectedElder,
    selectElder,
    logoutUser,
  } = useApp();

  const recentAlerts = alerts || [];

  const [isSosTakeoverOpen, setIsSosTakeoverOpen] = useState(Boolean(activeSosAlert && activeSosAlert.status === 'active'));
  const [isPairingViewOpen, setIsPairingViewOpen] = useState(false);
  const [isMedManagerOpen, setIsMedManagerOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddElderModalOpen, setIsAddElderModalOpen] = useState(false);
  const [uploadTargetMed, setUploadTargetMed] = useState<MedicineReminderDoc | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isPingingGps, setIsPingingGps] = useState(false);

  // Automatically take over the Volunteer screen whenever an active SOS alert is received
  React.useEffect(() => {
    if (activeSosAlert && activeSosAlert.status === 'active') {
      setIsSosTakeoverOpen(true);
    }
  }, [activeSosAlert]);

  const t = TRANSLATIONS[volunteerLanguage] || TRANSLATIONS['en-US'];
  const currentVolLang = SUPPORTED_LANGUAGES.find(l => l.code === volunteerLanguage) || SUPPORTED_LANGUAGES[0];

  const elderPhone = elderProfile.phoneNumber
    ? `${elderProfile.phoneCountryCode || '+91'} ${elderProfile.phoneNumber}`
    : '(555) 018-9923';
  const elderName = activeSosAlert?.elderName || elderProfile.name || pairData.elderName || 'Eleanor Vance';

  // Real-time calculated metrics
  const takenMedsCount = medicines.filter(m => m.taken).length;
  const totalMedsCount = medicines.length;
  const activeSchedulesCount = checkinSchedules.filter(s => s.enabled).length;

  // Handle direct call
  const handleDirectCallElder = () => {
    triggerHaptic('medium');
    startCall({
      contactName: elderName,
      phoneNumber: elderPhone,
      contactRole: 'elder',
      reason: 'general'
    });
  };

  const handleRequestCheckin = () => {
    triggerHaptic('medium');
    soundFx.playTap();
    triggerCheckinPrompt();
    setRequestSent(true);
    speakText(`Check-in request sent to ${elderName}`, volunteerLanguage);
    setTimeout(() => setRequestSent(false), 3500);
  };

  const handleQuickGpsPing = () => {
    setIsPingingGps(true);
    refreshElderLocationPing();
    setTimeout(() => setIsPingingGps(false), 1000);
  };

  const activeSlotsCount = checkinSchedules.filter(s => s.enabled).length;

  return (
    <Div 
      id="volunteer-dashboard-screen" 
      className="flex-1 flex flex-col bg-[#FAF7F2] dark:bg-slate-900 text-[#1A2B4C] dark:text-white overflow-y-auto"
    >
      {/* Top Navbar */}
      <Header className="bg-[#1A2B4C] dark:bg-slate-800 text-white p-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md border-b border-[#1A2B4C] dark:border-slate-700">
        <Div className="flex items-center gap-2 min-w-0">
          <Div className="w-8 h-8 rounded-lg bg-[#FF6B4A] flex items-center justify-center font-black text-sm shrink-0">
            W
          </Div>
          <Div className="min-w-0">
            <H1 className="text-sm font-black tracking-tight leading-none text-white truncate">
              Caregiver Portal
            </H1>
            <Span className="text-[10px] text-white/70 font-semibold flex items-center gap-1 mt-0.5 truncate">
              <Span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse shrink-0" />
              Live Safety & Location Sync
            </Span>
          </Div>
        </Div>

        <Div className="flex items-center gap-2 shrink-0">
          {/* Track Location Button in Header */}
          <Button
            id="header-track-location-btn"
            onClick={() => {
              soundFx.playTap();
              setIsLocationModalOpen(true);
            }}
            className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-400 cursor-pointer shadow-xs"
            title="Track Elder GPS Location"
          >
            <Compass className="w-3.5 h-3.5 text-[#FFB84D]" />
            <Span className="hidden sm:inline">GPS Live</Span>
          </Button>

          {/* Pairing Info Button */}
          <Button
            id="volunteer-open-pairing-btn"
            onClick={() => setIsPairingViewOpen(true)}
            title="Pairing Settings"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 border border-white/20 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#FFB84D]" />
            <Span>PIN: {pairData.pinCode}</Span>
          </Button>

          {/* Language Selector Dropdown */}
          <Div className="relative">
            <Button
              id="volunteer-lang-selector-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Select Volunteer Language"
              className="h-8 px-2 flex items-center gap-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white rounded-lg border border-white dark:border-slate-600 text-xs font-black active:scale-95 transition shadow-sm cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#1A2B4C] dark:text-white" />
              <Span>{currentVolLang?.flag || '🌐'}</Span>
            </Button>

            {showLangMenu && (
              <Div 
                id="volunteer-lang-dropdown"
                className="absolute right-0 top-10 w-60 max-h-72 overflow-y-auto bg-white dark:bg-slate-800 border-2 border-[#1A2B4C] dark:border-slate-700 rounded-xl shadow-[4px_4px_0px_#1A2B4C] z-50 p-1.5 flex flex-col gap-1 text-[#1A2B4C] dark:text-white"
              >
                <Div className="px-3 py-1 text-[10px] font-black text-[#1A2B4C]/70 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <Span>Select Language</Span>
                  <Span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-1 rounded font-bold">10+ Regional</Span>
                </Div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <Button
                    key={lang.code}
                    onClick={() => {
                      setVolunteerLanguage(lang.code as SupportedLanguage);
                      setShowLangMenu(false);
                    }}
                    className={`min-h-[40px] w-full px-3 py-1.5 text-left rounded-lg flex items-center gap-2.5 font-bold text-xs transition cursor-pointer ${
                      volunteerLanguage === lang.code
                        ? 'bg-[#1A2B4C] dark:bg-slate-700 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-[#1A2B4C] dark:text-slate-200'
                    }`}
                  >
                    <Span className="text-base">{lang.flag}</Span>
                    <Div className="flex flex-col min-w-0">
                      <Span className="leading-tight font-black truncate">{lang.nativeLabel}</Span>
                      <Span className="text-[10px] opacity-75 font-normal truncate">{lang.label} {lang.region ? `(${lang.region})` : ''}</Span>
                    </Div>
                  </Button>
                ))}
              </Div>
            )}
          </Div>

          {/* Log Out / Switch Account Button */}
          <Button
            id="volunteer-logout-btn"
            onClick={() => {
              Alert.alert(
                'Log Out',
                'Are you sure you want to log out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => logoutUser(),
                  },
                ]
              );
            }}
            aria-label="Switch User / Log Out"
            title="Switch User / Log Out"
            className="h-8 px-2 flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 active:scale-95 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-white" />
            <Span className="hidden sm:inline">Logout</Span>
          </Button>
        </Div>
      </Header>

      {/* Persistent SOS Emergency Warning Banner if Active */}
      {activeSosAlert && (
        <Div 
          id="volunteer-active-sos-banner"
          onClick={() => setIsSosTakeoverOpen(true)}
          className="bg-[#FF6B4A] text-white p-3.5 flex items-center justify-between cursor-pointer border-b-2 border-[#1A2B4C] shadow-lg animate-pulse"
        >
          <Div className="flex items-center gap-2.5 min-w-0">
            <Div className="w-8 h-8 rounded-full bg-white text-[#FF6B4A] flex items-center justify-center font-black shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </Div>
            <Div className="min-w-0">
              <Span className="text-xs font-black uppercase tracking-wider block leading-tight truncate">
                {t.sosTakeoverTitle || 'ACTIVE SOS EMERGENCY'}
              </Span>
              <Span className="text-sm font-black truncate block">
                {activeSosAlert.elderName} Needs Help!
              </Span>
            </Div>
          </Div>
          <Button 
            className="px-3 py-1.5 bg-[#1A2B4C] text-white rounded-xl text-xs font-black uppercase tracking-wider border border-white shadow-sm shrink-0"
          >
            Open Takeover
          </Button>
        </Div>
      )}

      {/* Main Dashboard Content */}
      <Main className="p-3.5 flex flex-col gap-4 flex-1">
        
        {/* Multi-Elder Management Strip */}
        <Section 
          id="volunteer-multi-elder-selector-strip"
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2.5"
        >
          <Div className="flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2 min-w-0">
              <Div className="w-7 h-7 rounded-lg bg-[#1A2B4C] text-white flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#FFB84D]" />
              </Div>
              <Div className="min-w-0">
                <H3 className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] dark:text-white truncate">
                  Monitored Elders ({monitoredElders.length})
                </H3>
                <P className="text-[11px] text-[#1A2B4C]/60 dark:text-slate-400 font-bold truncate">
                  Select elder to monitor location, medicines & schedules
                </P>
              </Div>
            </Div>

            <Button
              id="volunteer-add-elder-btn"
              onClick={() => setIsAddElderModalOpen(true)}
              className="px-2.5 py-1.5 bg-[#4CAF50] hover:bg-[#3d9140] text-white rounded-xl text-xs font-black flex items-center gap-1 border border-[#1A2B4C] dark:border-slate-600 shadow-[1px_1px_0px_#1A2B4C] active:scale-95 transition cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <Span>Add Elder</Span>
            </Button>
          </Div>

          {/* Horizontal list of elders */}
          <Div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            {monitoredElders.map((elder) => {
              const isSelected = elder.id === selectedElderId;
              return (
                <Button
                  key={elder.id}
                  id={`volunteer-select-elder-${elder.id}`}
                  onClick={() => selectElder(elder.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all shrink-0 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#FF6B4A]'
                      : 'bg-[#FAF7F2] dark:bg-slate-900 text-[#1A2B4C] dark:text-white border-[#1A2B4C]/30 dark:border-slate-700 hover:border-[#1A2B4C] hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  <Span className="text-lg shrink-0">{elder.avatarEmoji || '👵'}</Span>
                  <Div className="flex flex-col min-w-0">
                    <Div className="flex items-center gap-1.5">
                      <Span className="text-xs font-black leading-tight truncate max-w-[120px]">
                        {elder.name}
                      </Span>
                      <Span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-[#4CAF50]' : 'bg-[#4CAF50]/70'}`} />
                    </Div>
                    <Span className={`text-[10px] font-bold truncate ${isSelected ? 'text-white/80' : 'text-[#1A2B4C]/60 dark:text-slate-400'}`}>
                      {elder.relationship} • PIN: {elder.pinCode}
                    </Span>
                  </Div>
                </Button>
              );
            })}
          </Div>
        </Section>

        {/* 1. Elder Profile & Health Status Card */}
        <Section 
          id="volunteer-elder-status-card"
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <Div className="flex items-start justify-between gap-2">
            <Div className="flex items-center gap-3 min-w-0">
              <Div className="w-12 h-12 rounded-2xl bg-[#1A2B4C] text-white flex items-center justify-center font-black text-xl border-2 border-[#1A2B4C] dark:border-slate-600 shrink-0">
                {selectedElder?.avatarEmoji || selectedElder?.name?.charAt(0) || elderName.charAt(0)}
              </Div>
              <Div className="min-w-0">
                <Div className="flex items-center gap-1.5">
                  <H2 className="text-base font-black text-[#1A2B4C] dark:text-white leading-tight truncate">
                    {selectedElder?.name || elderName}
                  </H2>
                  <Span className="w-2 h-2 rounded-full bg-[#4CAF50] shrink-0" />
                </Div>
                <P className="text-xs font-bold text-[#1A2B4C]/70 dark:text-slate-400 truncate">
                  {selectedElder?.relationship ? `${selectedElder.relationship} • ` : ''}Age {selectedElder?.age || 78} • PIN: {selectedElder?.pinCode || pairData.pinCode}
                </P>
              </Div>
            </Div>
            <Span className="text-[10px] font-black uppercase px-2.5 py-1 bg-[#FAF7F2] dark:bg-slate-700 text-[#1A2B4C] dark:text-white rounded-lg border border-[#1A2B4C] dark:border-slate-600 shrink-0">
              {t.connectedLiveText || 'Live Paired'}
            </Span>
          </Div>

          {/* Medical Conditions Badges if present */}
          {selectedElder?.medicalConditions && selectedElder.medicalConditions.length > 0 && (
            <Div className="flex flex-wrap gap-1.5">
              {selectedElder.medicalConditions.map((cond, idx) => (
                <Span 
                  key={idx} 
                  className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-md text-[10px] font-bold"
                >
                  {cond}
                </Span>
              ))}
            </Div>
          )}

          {/* Quick Stats Grid */}
          <Div className="grid grid-cols-2 gap-2 pt-1">
            <Div className="bg-[#FAF7F2] dark:bg-slate-900 p-2.5 rounded-xl border border-[#1A2B4C]/20 dark:border-slate-700 flex flex-col min-w-0">
              <Span className="text-[10px] font-bold uppercase text-[#1A2B4C]/60 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#4CAF50]" /> Last Check-In
              </Span>
              <Span className="text-xs font-black text-[#1A2B4C] dark:text-white mt-0.5 truncate">
                {lastCheckinTime}
              </Span>
            </Div>
            <Div className="bg-[#FAF7F2] dark:bg-slate-900 p-2.5 rounded-xl border border-[#1A2B4C]/20 dark:border-slate-700 flex flex-col min-w-0">
              <Span className="text-[10px] font-bold uppercase text-[#1A2B4C]/60 dark:text-slate-400 flex items-center gap-1">
                <Pill className="w-3 h-3 text-[#FF6B4A]" /> Daily Medicines
              </Span>
              <Span className="text-xs font-black text-[#1A2B4C] dark:text-white mt-0.5 truncate">
                {medicines.filter(m => m.taken).length} of {medicines.length} Taken
              </Span>
            </Div>
          </Div>

          {/* Actions: Direct VoIP / Phone Call + Request Check-In */}
          <Div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              id="volunteer-call-elder-btn"
              onClick={handleDirectCallElder}
              className="min-h-[46px] bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#4CAF50]" />
              <Span>{t.callText || 'Call'} {elderName.split(' ')[0]}</Span>
            </Button>

            <Button
              id="volunteer-request-checkin-btn"
              onClick={handleRequestCheckin}
              className={`min-h-[46px] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A2B4C] dark:border-slate-600 shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer ${
                requestSent 
                  ? 'bg-[#4CAF50] text-white border-[#4CAF50]' 
                  : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white'
              }`}
            >
              <Radio className={`w-4 h-4 ${requestSent ? 'animate-ping' : 'text-[#FF6B4A]'}`} />
              <Span>{requestSent ? 'Ping Transmitted!' : 'Ping Check-In'}</Span>
            </Button>
          </Div>
        </Section>

        {/* Elder Health & Status Highlights Overview */}
        <Section
          id="volunteer-status-highlights-card"
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <Div className="flex items-center justify-between">
            <Div className="flex items-center gap-2">
              <Div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-[#1A2B4C] dark:border-slate-700 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              </Div>
              <Div>
                <H3 className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] dark:text-white">
                  Daily Status Overview
                </H3>
                <P className="text-[11px] text-[#1A2B4C]/70 dark:text-slate-400 font-bold">
                  Live monitoring metrics for <Span className="text-[#1A2B4C] dark:text-white font-black">{selectedElder?.name || elderName}</Span>
                </P>
              </Div>
            </Div>
          </Div>

          <Div className="grid grid-cols-3 gap-2">
            <Div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#1A2B4C]/20 dark:border-slate-700 flex flex-col items-center text-center">
              <Span className="text-[10px] font-black uppercase text-[#1A2B4C]/70 dark:text-slate-400">Pills Taken</Span>
              <Span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {takenMedsCount} / {totalMedsCount}
              </Span>
              <Span className="text-[9px] font-bold text-slate-500 mt-0.5">
                {totalMedsCount === 0 ? 'No meds' : takenMedsCount === totalMedsCount ? 'All complete' : `${totalMedsCount - takenMedsCount} due`}
              </Span>
            </Div>

            <Div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#1A2B4C]/20 dark:border-slate-700 flex flex-col items-center text-center">
              <Span className="text-[10px] font-black uppercase text-[#1A2B4C]/70 dark:text-slate-400">Daily Check-Ins</Span>
              <Span className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {activeSchedulesCount}
              </Span>
              <Span className="text-[9px] font-bold text-slate-500 mt-0.5">Active slots</Span>
            </Div>

            <Div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#1A2B4C]/20 dark:border-slate-700 flex flex-col items-center text-center">
              <Span className="text-[10px] font-black uppercase text-[#1A2B4C]/70 dark:text-slate-400">Battery & GPS</Span>
              <Span className="text-base font-black text-[#1A2B4C] dark:text-white mt-0.5">
                {elderLocation.batteryLevel}%
              </Span>
              <Span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">GPS Live</Span>
            </Div>
          </Div>
        </Section>

        {/* 2. Scheduled Check-Ins Manager (Feature for Volunteer to Set Multiple Times & 3-Min Alert) */}
        <Section 
          id="volunteer-checkin-scheduler-card"
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <Div className="flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2 min-w-0">
              <Div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 border border-[#1A2B4C] dark:border-slate-700 flex items-center justify-center text-[#1A2B4C] dark:text-amber-300 shrink-0">
                <CalendarClock className="w-4 h-4 text-[#FFB84D]" />
              </Div>
              <Div className="min-w-0">
                <H3 className="text-sm font-black text-[#1A2B4C] dark:text-white uppercase tracking-tight truncate">
                  Scheduled Check-In Times
                </H3>
                <Span className="text-[11px] font-bold text-[#1A2B4C]/70 dark:text-slate-400 truncate block">
                  {activeSlotsCount} daily times • 3-min missed check-in escalation
                </Span>
              </Div>
            </Div>

            <Button
              id="volunteer-manage-schedules-btn"
              onClick={() => {
                soundFx.playTap();
                setIsScheduleModalOpen(true);
              }}
              className="px-2.5 py-1 bg-[#1A2B4C] dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#FFB84D]" />
              <Span>Set Times</Span>
            </Button>
          </Div>

          {/* Schedule Slots Chips */}
          <Div className="flex flex-col gap-2 mt-1">
            {checkinSchedules.slice(0, 3).map((slot) => (
              <Div
                key={slot.id}
                className="p-2.5 bg-[#FAF7F2] dark:bg-slate-900 rounded-xl border border-[#1A2B4C]/30 dark:border-slate-700 flex items-center justify-between gap-2"
              >
                <Div className="flex items-center gap-2.5 min-w-0">
                  <Span className="text-xs font-black text-[#1A2B4C] dark:text-white shrink-0 font-mono">{slot.time}</Span>
                  <Span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{slot.label}</Span>
                </Div>
                <Span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                  slot.enabled 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}>
                  {slot.enabled ? 'Active Daily' : 'Off'}
                </Span>
              </Div>
            ))}
          </Div>

          {/* 3-Min Escalation Indicator & Demo trigger */}
          <Div className="bg-[#FFF8E7] dark:bg-amber-950/40 rounded-xl p-2.5 border border-amber-300 dark:border-amber-700 flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2 min-w-0">
              <Timer className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <Span className="text-[11px] font-bold text-amber-950 dark:text-amber-200 truncate">
                Elder gets 3 mins to check in before pop-up escalation
              </Span>
            </Div>

            <Button
              id="dashboard-simulate-missed-checkin-btn"
              onClick={() => {
                soundFx.playTap();
                simulateMissedCheckinTimeout();
              }}
              className="px-2 py-1 bg-[#FF6B4A] hover:bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer shadow-xs active:scale-95 transition"
              title="Test 3-Minute Missed Check-In Alert Pop-up"
            >
              Test Alert Pop-up
            </Button>
          </Div>
        </Section>

        {/* 3. Elder Live Location GPS Tracker Card */}
        <Section 
          id="volunteer-location-tracking-card"
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <Div className="flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2 min-w-0">
              <Div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-[#1A2B4C] dark:border-slate-700 flex items-center justify-center text-[#1A2B4C] dark:text-emerald-300 shrink-0">
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </Div>
              <Div className="min-w-0">
                <H3 className="text-sm font-black text-[#1A2B4C] dark:text-white uppercase tracking-tight truncate">
                  Elder Live GPS & Google Maps
                </H3>
                <Span className="text-[11px] font-bold text-[#1A2B4C]/70 dark:text-slate-400 truncate block">
                  1-Tap open in Google Maps on caregiver's phone
                </Span>
              </Div>
            </Div>

            <Button
              id="volunteer-open-location-map-btn"
              onClick={() => {
                soundFx.playTap();
                setIsLocationModalOpen(true);
              }}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <Span>Full Screen</Span>
            </Button>
          </Div>

          {/* Embedded Live Map View */}
          <Div className="w-full h-48 rounded-xl overflow-hidden border border-[#1A2B4C]/30 dark:border-slate-700">
            <GoogleMapView
              elderLocation={elderLocation}
              elderName={pairData.elderName || 'Eleanor Vance'}
              avatarEmoji={selectedElder?.avatarEmoji || '👵'}
              zoomLevel={16}
              darkMode={false}
            />
          </Div>

          {/* Location Snapshot Card & Coordinates */}
          <Div className="p-3 bg-[#FAF7F2] dark:bg-slate-900 rounded-xl border border-[#1A2B4C]/30 dark:border-slate-700 flex flex-col gap-2">
            <Div className="flex items-start justify-between gap-2">
              <Div className="flex items-start gap-2 min-w-0">
                <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <Div className="min-w-0">
                  <Span className="text-xs font-black text-[#1A2B4C] dark:text-white block break-words">
                    {elderLocation.address}
                  </Span>
                  <Span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block break-words">
                    {elderLocation.landmark}
                  </Span>
                </Div>
              </Div>

              <Span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border shrink-0 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <Span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live GPS Active
              </Span>
            </Div>

            <Div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700 gap-1 flex-wrap">
              <Span className="font-mono text-slate-700 dark:text-slate-300">
                GPS: {elderLocation.latitude.toFixed(4)}°, {elderLocation.longitude.toFixed(4)}° (±{elderLocation.accuracyMeters}m)
              </Span>
              <Div className="flex items-center gap-2">
                <Button
                  id="dashboard-open-gmaps-link-btn"
                  onClick={() => {
                    soundFx.playTap();
                    const url = `https://www.google.com/maps/search/?api=1&query=${elderLocation.latitude},${elderLocation.longitude}`;
                    Linking.openURL(url);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-black shrink-0"
                  title="Open coordinates in Google Maps"
                >
                  <ExternalLink className="w-3 h-3" />
                  <Span>Open in Google Maps</Span>
                </Button>
                <Button
                  onClick={handleQuickGpsPing}
                  disabled={isPingingGps}
                  className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-black shrink-0"
                >
                  <RefreshCw className={`w-3 h-3 ${isPingingGps ? 'animate-spin' : ''}`} />
                  <Span>{isPingingGps ? 'Pinging...' : 'Ping GPS'}</Span>
                </Button>
              </Div>
            </Div>
          </Div>
        </Section>

        {/* 4. Medication Adherence & Photo Verification Section */}
        <Section 
          id="volunteer-medicine-section"
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <Div className="flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2 min-w-0">
              <Div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 border border-[#1A2B4C] dark:border-slate-700 flex items-center justify-center text-[#1A2B4C] dark:text-amber-300 shrink-0">
                <Pill className="w-4 h-4 text-[#FF6B4A]" />
              </Div>
              <Div className="min-w-0">
                <H3 className="text-sm font-black text-[#1A2B4C] dark:text-white uppercase tracking-tight truncate">
                  Medication & Pill Verification
                </H3>
                <Span className="text-[11px] font-bold text-[#1A2B4C]/70 dark:text-slate-400 truncate block">
                  Live adherence & uploaded photos
                </Span>
              </Div>
            </Div>
            <Button
              id="volunteer-manage-meds-btn"
              onClick={() => setIsMedManagerOpen(true)}
              className="px-2.5 py-1 bg-[#1A2B4C] dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer shrink-0"
            >
              <Camera className="w-3.5 h-3.5 text-[#FFB84D]" />
              <Span>Review & Photos</Span>
            </Button>
          </Div>

          {/* Medicines Adherence List */}
          <Div className="flex flex-col gap-2.5 mt-1">
            {medicines.map((med) => (
              <Div
                key={med.id}
                className="p-2.5 bg-[#FAF7F2] dark:bg-slate-900 rounded-xl border border-[#1A2B4C]/30 dark:border-slate-700 flex items-center justify-between gap-2.5 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition"
              >
                <Div className="flex items-center gap-2.5 min-w-0">
                  {/* Photo thumbnail with upload trigger */}
                  <Button
                    type="button"
                    onClick={() => setUploadTargetMed(med)}
                    title="Click to change or upload pill photo"
                    className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-[#1A2B4C] dark:border-slate-600 shrink-0 group cursor-pointer shadow-xs"
                  >
                    <Img
                      src={med.localPhotoRef}
                      alt={med.medicineName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <Div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </Div>
                  </Button>

                  {/* Medicine Info */}
                  <Div className="min-w-0">
                    <Div className="text-xs font-black text-[#1A2B4C] dark:text-white truncate leading-tight">
                      {med.medicineName}
                    </Div>
                    <Div className="text-[11px] font-bold text-[#1A2B4C]/70 dark:text-slate-400 truncate">
                      {med.dosage} • <Span className="font-mono">{med.scheduledTime}</Span>
                    </Div>
                    <Div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Photo: {med.photoUploadedBy === 'volunteer' ? '🧑‍⚕️ By You' : med.photoUploadedBy === 'elder' ? '👵 By Elder' : 'Verified'}
                    </Div>
                  </Div>
                </Div>

                {/* Status Badge + Photo Upload Action */}
                <Div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    onClick={() => setUploadTargetMed(med)}
                    title="Upload photo for this pill"
                    className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#1A2B4C] dark:text-white border border-[#1A2B4C] dark:border-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-[#FF6B4A]" />
                    <Span className="hidden sm:inline">Photo</Span>
                  </Button>

                  <Span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-[#1A2B4C] dark:border-slate-600 ${
                      med.taken
                        ? 'bg-[#4CAF50] text-white'
                        : 'bg-[#FFB84D] text-[#1A2B4C]'
                    }`}
                  >
                    {med.taken ? '✓ Taken' : 'Pending'}
                  </Span>
                </Div>
              </Div>
            ))}
          </Div>
        </Section>

        {/* 5. Safety Feed & Recent Alerts Log */}
        <Section 
          id="volunteer-feed-section"
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <Div className="flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2 min-w-0">
              <Div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-[#1A2B4C] dark:border-slate-700 flex items-center justify-center text-[#1A2B4C] dark:text-white shrink-0">
                <Bell className="w-4 h-4 text-[#1A2B4C] dark:text-white" />
              </Div>
              <H3 className="text-sm font-black text-[#1A2B4C] dark:text-white uppercase tracking-tight truncate">
                Activity Feed & Event History
              </H3>
            </Div>
            <Span className="text-[10px] font-mono font-bold bg-[#FAF7F2] dark:bg-slate-900 text-[#1A2B4C] dark:text-slate-300 px-2 py-0.5 rounded border border-[#1A2B4C] dark:border-slate-700 shrink-0">
              {recentAlerts.length} Events
            </Span>
          </Div>

          <Div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
            {recentAlerts.length === 0 ? (
              <P className="text-xs text-slate-500 dark:text-slate-400 italic p-3 text-center">No alerts logged yet.</P>
            ) : (
              recentAlerts.map((alert) => (
                <Div
                  key={alert.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    alert.type === 'sos'
                      ? 'bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                      : alert.type === 'checkin_missed'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                      : alert.type === 'medicine_missed'
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                      : 'bg-[#FAF7F2] dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Div className="flex items-center gap-2.5 min-w-0">
                    <Span className="text-base shrink-0">
                      {alert.type === 'sos' ? '🚨' : alert.type === 'checkin_missed' ? '⚠️' : '💊'}
                    </Span>
                    <Div className="min-w-0">
                      <Div className="text-xs font-black text-[#1A2B4C] dark:text-white truncate">
                        {alert.type === 'sos'
                          ? `SOS Alert: ${alert.elderName}`
                          : alert.type === 'checkin_missed'
                          ? `Missed Check-In Alert (${alert.elderName})`
                          : `Medication Adherence Event`}
                      </Div>
                      <Div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Div>
                    </Div>
                  </Div>

                  <Span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                    alert.status === 'active'
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  }`}>
                    {alert.status}
                  </Span>
                </Div>
              ))
            )}
          </Div>
        </Section>
      </Main>

      {/* Volunteer SOS Takeover Modal */}
      {(isSosTakeoverOpen || Boolean(activeSosAlert && activeSosAlert.status === 'active')) && (
        <VolunteerSosModal
          onDismiss={() => setIsSosTakeoverOpen(false)}
        />
      )}

      {/* Volunteer Missed Check-In Escalation Pop-Up Modal (Triggers on 3-Min Timeout) */}
      {activeMissedCheckinModal && (
        <VolunteerMissedCheckinModal
          isOpen={activeMissedCheckinModal.isOpen}
          onClose={closeMissedCheckinModal}
          scheduledTime={activeMissedCheckinModal.scheduledTime}
          alertId={activeMissedCheckinModal.alertId}
          onOpenLocationTracker={() => setIsLocationModalOpen(true)}
        />
      )}

      {/* Volunteer Checkin Schedule Modal */}
      {isScheduleModalOpen && (
        <VolunteerCheckinScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}

      {/* Volunteer Location GPS Tracker Modal */}
      {isLocationModalOpen && (
        <VolunteerLocationTrackerModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
        />
      )}

      {/* Volunteer Pairing Modal */}
      {isPairingViewOpen && (
        <Div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Div className="bg-[#FAF7F2] dark:bg-slate-900 w-full max-w-md rounded-3xl border-4 border-[#1A2B4C] dark:border-slate-700 shadow-[8px_8px_0px_#1A2B4C] overflow-hidden flex flex-col">
            <VolunteerPairingView onSuccess={() => setIsPairingViewOpen(false)} />
            <Div className="p-3 bg-white dark:bg-slate-800 border-t border-[#1A2B4C]/20 dark:border-slate-700 flex justify-end">
              <Button
                onClick={() => setIsPairingViewOpen(false)}
                className="px-4 py-1.5 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl"
              >
                Close
              </Button>
            </Div>
          </Div>
        </Div>
      )}

      {/* Volunteer Add Elder Modal */}
      {isAddElderModalOpen && (
        <VolunteerAddElderModal
          isOpen={isAddElderModalOpen}
          onClose={() => setIsAddElderModalOpen(false)}
        />
      )}

      {/* Volunteer Medicine Manager Modal */}
      {isMedManagerOpen && (
        <VolunteerMedicineManagerModal
          isOpen={isMedManagerOpen}
          onClose={() => setIsMedManagerOpen(false)}
        />
      )}

      {/* Single Medicine Photo Uploader Modal */}
      {uploadTargetMed && (
        <MedicinePhotoUploaderModal
          medicine={uploadTargetMed}
          isOpen={true}
          uploaderRole="volunteer"
          onClose={() => setUploadTargetMed(null)}
          onPhotoSaved={() => setUploadTargetMed(null)}
        />
      )}
    </Div>
  );
};
