import React, { useState } from 'react';
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
  BatteryCharging
} from 'lucide-react';
import { VolunteerSosModal } from './VolunteerSosModal';
import { VolunteerPairingView } from './VolunteerPairingView';
import { VolunteerMedicineManagerModal } from './VolunteerMedicineManagerModal';
import { VolunteerCheckinScheduleModal } from './VolunteerCheckinScheduleModal';
import { VolunteerMissedCheckinModal } from './VolunteerMissedCheckinModal';
import { VolunteerLocationTrackerModal } from './VolunteerLocationTrackerModal';
import { VolunteerAddElderModal } from './VolunteerAddElderModal';
import { MedicinePhotoUploaderModal } from '../common/MedicinePhotoUploaderModal';
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

  // Handle direct call
  const handleDirectCallElder = () => {
    startCall({
      contactName: elderName,
      phoneNumber: elderPhone,
      contactRole: 'elder',
      reason: 'general'
    });
  };

  const handleRequestCheckin = () => {
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
    <div 
      id="volunteer-dashboard-screen" 
      className="flex-1 flex flex-col bg-[#FAF7F2] text-[#1A2B4C] overflow-y-auto"
    >
      {/* Top Navbar */}
      <header className="bg-[#1A2B4C] text-white p-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B4A] flex items-center justify-center font-black text-sm">
            W
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none text-white">
              {t.caregiverDashboardTitle || 'Caregiver Portal'}
            </h1>
            <span className="text-[10px] text-white/70 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
              Live Safety & Location Sync
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Track Location Button in Header */}
          <button
            id="header-track-location-btn"
            onClick={() => {
              soundFx.playTap();
              setIsLocationModalOpen(true);
            }}
            className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-400 cursor-pointer shadow-xs"
            title="Track Elder GPS Location"
          >
            <Compass className="w-3.5 h-3.5 text-[#FFB84D]" />
            <span className="hidden sm:inline">GPS Live</span>
          </button>

          {/* Pairing Info Button */}
          <button
            id="volunteer-open-pairing-btn"
            onClick={() => setIsPairingViewOpen(true)}
            title="Pairing Settings"
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 border border-white/20 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#FFB84D]" />
            <span>PIN: {pairData.pinCode}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="volunteer-lang-selector-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Select Volunteer Language"
              className="h-8 px-2 flex items-center gap-1 bg-white hover:bg-slate-100 text-[#1A2B4C] rounded-lg border border-white text-xs font-black active:scale-95 transition shadow-sm cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#1A2B4C]" />
              <span>{currentVolLang?.flag || '🌐'}</span>
            </button>

            {showLangMenu && (
              <div 
                id="volunteer-lang-dropdown"
                className="absolute right-0 top-10 w-60 max-h-72 overflow-y-auto bg-white border-2 border-[#1A2B4C] rounded-xl shadow-[4px_4px_0px_#1A2B4C] z-50 p-1.5 flex flex-col gap-1 text-[#1A2B4C]"
              >
                <div className="px-3 py-1 text-[10px] font-black text-[#1A2B4C]/70 uppercase tracking-wider border-b border-slate-200 flex items-center justify-between">
                  <span>Select Language</span>
                  <span className="text-[9px] bg-amber-100 text-amber-900 px-1 rounded font-bold">10+ Regional</span>
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setVolunteerLanguage(lang.code as SupportedLanguage);
                      setShowLangMenu(false);
                    }}
                    className={`min-h-[40px] w-full px-3 py-1.5 text-left rounded-lg flex items-center gap-2.5 font-bold text-xs transition cursor-pointer ${
                      volunteerLanguage === lang.code
                        ? 'bg-[#1A2B4C] text-white'
                        : 'hover:bg-slate-100 text-[#1A2B4C]'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="leading-tight font-black">{lang.nativeLabel}</span>
                      <span className="text-[10px] opacity-75 font-normal">{lang.label} {lang.region ? `(${lang.region})` : ''}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Persistent SOS Emergency Warning Banner if Active */}
      {activeSosAlert && (
        <div 
          id="volunteer-active-sos-banner"
          onClick={() => setIsSosTakeoverOpen(true)}
          className="bg-[#FF6B4A] text-white p-3.5 flex items-center justify-between cursor-pointer border-b-2 border-[#1A2B4C] shadow-lg animate-pulse"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#FF6B4A] flex items-center justify-center font-black">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider block leading-tight">
                {t.sosTakeoverTitle || 'ACTIVE SOS EMERGENCY'}
              </span>
              <span className="text-sm font-black">
                {activeSosAlert.elderName} Needs Help!
              </span>
            </div>
          </div>
          <button 
            className="px-3 py-1.5 bg-[#1A2B4C] text-white rounded-xl text-xs font-black uppercase tracking-wider border border-white shadow-sm"
          >
            Open Takeover
          </button>
        </div>
      )}

      {/* Main Dashboard Content */}
      <main className="p-3.5 flex flex-col gap-4 flex-1">
        
        {/* Multi-Elder Management Strip */}
        <section 
          id="volunteer-multi-elder-selector-strip"
          className="bg-white rounded-2xl p-3.5 border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1A2B4C] text-white flex items-center justify-center">
                <Users className="w-4 h-4 text-[#FFB84D]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1A2B4C]">
                  Monitored Elders ({monitoredElders.length})
                </h3>
                <p className="text-[11px] text-[#1A2B4C]/60 font-bold">
                  Select elder to monitor location, medicines & schedules
                </p>
              </div>
            </div>

            <button
              id="volunteer-add-elder-btn"
              onClick={() => setIsAddElderModalOpen(true)}
              className="px-2.5 py-1.5 bg-[#4CAF50] hover:bg-[#3d9140] text-white rounded-xl text-xs font-black flex items-center gap-1 border border-[#1A2B4C] shadow-[1px_1px_0px_#1A2B4C] active:scale-95 transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Elder</span>
            </button>
          </div>

          {/* Horizontal list of elders */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            {monitoredElders.map((elder) => {
              const isSelected = elder.id === selectedElderId;
              return (
                <button
                  key={elder.id}
                  id={`volunteer-select-elder-${elder.id}`}
                  onClick={() => selectElder(elder.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all shrink-0 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#FF6B4A]'
                      : 'bg-[#FAF7F2] text-[#1A2B4C] border-[#1A2B4C]/30 hover:border-[#1A2B4C] hover:bg-white'
                  }`}
                >
                  <span className="text-lg">{elder.avatarEmoji || '👵'}</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black leading-tight truncate max-w-[120px]">
                        {elder.name}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#4CAF50]' : 'bg-[#4CAF50]/70'}`} />
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-[#1A2B4C]/60'}`}>
                      {elder.relationship} • PIN: {elder.pinCode}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 1. Elder Profile & Health Status Card */}
        <section 
          id="volunteer-elder-status-card"
          className="bg-white rounded-2xl p-4 border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A2B4C] text-white flex items-center justify-center font-black text-xl border-2 border-[#1A2B4C]">
                {selectedElder?.avatarEmoji || selectedElder?.name?.charAt(0) || elderName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black text-[#1A2B4C] leading-tight">
                    {selectedElder?.name || elderName}
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                </div>
                <p className="text-xs font-bold text-[#1A2B4C]/70">
                  {selectedElder?.relationship ? `${selectedElder.relationship} • ` : ''}Age {selectedElder?.age || 78} • PIN: {selectedElder?.pinCode || pairData.pinCode}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-[#FAF7F2] text-[#1A2B4C] rounded-lg border border-[#1A2B4C]">
              {t.connectedLiveText || 'Live Paired'}
            </span>
          </div>

          {/* Medical Conditions Badges if present */}
          {selectedElder?.medicalConditions && selectedElder.medicalConditions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedElder.medicalConditions.map((cond, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-[10px] font-bold"
                >
                  {cond}
                </span>
              ))}
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#1A2B4C]/20 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-[#1A2B4C]/60 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#4CAF50]" /> Last Check-In
              </span>
              <span className="text-xs font-black text-[#1A2B4C] mt-0.5 truncate">
                {lastCheckinTime}
              </span>
            </div>
            <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#1A2B4C]/20 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-[#1A2B4C]/60 flex items-center gap-1">
                <Pill className="w-3 h-3 text-[#FF6B4A]" /> Daily Medicines
              </span>
              <span className="text-xs font-black text-[#1A2B4C] mt-0.5">
                {medicines.filter(m => m.taken).length} of {medicines.length} Taken
              </span>
            </div>
          </div>

          {/* Actions: Direct VoIP / Phone Call + Request Check-In */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id="volunteer-call-elder-btn"
              onClick={handleDirectCallElder}
              className="min-h-[46px] bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#4CAF50]" />
              <span>{t.callText || 'Call'} {elderName.split(' ')[0]}</span>
            </button>

            <button
              id="volunteer-request-checkin-btn"
              onClick={handleRequestCheckin}
              className={`min-h-[46px] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer ${
                requestSent 
                  ? 'bg-[#4CAF50] text-white border-[#4CAF50]' 
                  : 'bg-white hover:bg-slate-50 text-[#1A2B4C]'
              }`}
            >
              <Radio className={`w-4 h-4 ${requestSent ? 'animate-ping' : 'text-[#FF6B4A]'}`} />
              <span>{requestSent ? 'Ping Transmitted!' : 'Ping Check-In'}</span>
            </button>
          </div>
        </section>

        {/* 2. Scheduled Check-Ins Manager (Feature for Volunteer to Set Multiple Times & 3-Min Alert) */}
        <section 
          id="volunteer-checkin-scheduler-card"
          className="bg-white rounded-2xl p-4 border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C]">
                <CalendarClock className="w-4 h-4 text-[#FFB84D]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1A2B4C] uppercase tracking-tight">
                  Scheduled Check-In Times
                </h3>
                <span className="text-[11px] font-bold text-[#1A2B4C]/70">
                  {activeSlotsCount} daily times • 3-min missed check-in escalation
                </span>
              </div>
            </div>

            <button
              id="volunteer-manage-schedules-btn"
              onClick={() => {
                soundFx.playTap();
                setIsScheduleModalOpen(true);
              }}
              className="px-2.5 py-1 bg-[#1A2B4C] hover:bg-black text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FFB84D]" />
              <span>Set Times</span>
            </button>
          </div>

          {/* Schedule Slots Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
            {checkinSchedules.slice(0, 3).map((slot) => (
              <div
                key={slot.id}
                className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C]/30 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-black text-[#1A2B4C] block">{slot.time}</span>
                  <span className="text-[10px] font-bold text-slate-500 truncate block max-w-[110px]">{slot.label}</span>
                </div>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  slot.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {slot.enabled ? 'Active' : 'Off'}
                </span>
              </div>
            ))}
          </div>

          {/* 3-Min Escalation Indicator & Demo trigger */}
          <div className="bg-[#FFF8E7] rounded-xl p-2.5 border border-amber-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Timer className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-[11px] font-bold text-amber-950 truncate">
                Elder gets 3 mins to check in before pop-up escalation
              </span>
            </div>

            <button
              id="dashboard-simulate-missed-checkin-btn"
              onClick={() => {
                soundFx.playTap();
                simulateMissedCheckinTimeout();
              }}
              className="px-2 py-1 bg-[#FF6B4A] hover:bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer shadow-xs active:scale-95 transition"
              title="Test 3-Minute Missed Check-In Alert Pop-up"
            >
              Test Alert Pop-up
            </button>
          </div>
        </section>

        {/* 3. Elder Live Location GPS Tracker Card */}
        <section 
          id="volunteer-location-tracking-card"
          className="bg-white rounded-2xl p-4 border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C]">
                <MapPin className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1A2B4C] uppercase tracking-tight">
                  Elder Location Tracking
                </h3>
                <span className="text-[11px] font-bold text-[#1A2B4C]/70">
                  Live GPS geofence & waypoint monitoring
                </span>
              </div>
            </div>

            <button
              id="volunteer-open-location-map-btn"
              onClick={() => {
                soundFx.playTap();
                setIsLocationModalOpen(true);
              }}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Full Map</span>
            </button>
          </div>

          {/* Location Snapshot Card */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C]/30 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-[#1A2B4C] block">
                    {elderLocation.address}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {elderLocation.landmark}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                elderLocation.safeZoneStatus === 'inside_home'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : elderLocation.safeZoneStatus === 'safe_zone'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {elderLocation.safeZoneStatus === 'inside_home' ? 'Safe at Home' : elderLocation.safeZoneStatus === 'safe_zone' ? 'In Safe Zone' : 'Outside Area'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 pt-1 border-t border-slate-200">
              <span>Updated: {elderLocation.lastUpdated}</span>
              <span>Accuracy: ±{elderLocation.accuracyMeters}m • Battery: {elderLocation.batteryLevel}%</span>
              <button
                onClick={handleQuickGpsPing}
                disabled={isPingingGps}
                className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-black"
              >
                <RefreshCw className={`w-3 h-3 ${isPingingGps ? 'animate-spin' : ''}`} />
                <span>{isPingingGps ? 'Pinging...' : 'Ping GPS'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. Medication Adherence & Photo Verification Section */}
        <section 
          id="volunteer-medicine-section"
          className="bg-white rounded-2xl p-4 border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C]">
                <Pill className="w-4 h-4 text-[#FF6B4A]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1A2B4C] uppercase tracking-tight">
                  Medication & Pill Verification
                </h3>
                <span className="text-[11px] font-bold text-[#1A2B4C]/70">
                  Live adherence & uploaded photos
                </span>
              </div>
            </div>
            <button
              id="volunteer-manage-meds-btn"
              onClick={() => setIsMedManagerOpen(true)}
              className="px-2.5 py-1 bg-[#1A2B4C] hover:bg-black text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#FFB84D]" />
              <span>Review & Photos</span>
            </button>
          </div>

          {/* Medicines Adherence List */}
          <div className="flex flex-col gap-2.5 mt-1">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#1A2B4C]/30 flex items-center justify-between gap-2.5 hover:bg-amber-50/50 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Photo thumbnail with upload trigger */}
                  <button
                    type="button"
                    onClick={() => setUploadTargetMed(med)}
                    title="Click to change or upload pill photo"
                    className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 border-2 border-[#1A2B4C] shrink-0 group cursor-pointer shadow-xs"
                  >
                    <img
                      src={med.localPhotoRef}
                      alt={med.medicineName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Camera className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Medicine Info */}
                  <div className="min-w-0">
                    <div className="text-xs font-black text-[#1A2B4C] truncate leading-tight">
                      {med.medicineName}
                    </div>
                    <div className="text-[11px] font-bold text-[#1A2B4C]/70 truncate">
                      {med.dosage} • <span className="font-mono">{med.scheduledTime}</span>
                    </div>
                    <div className="text-[9px] font-semibold text-slate-500 mt-0.5">
                      Photo: {med.photoUploadedBy === 'volunteer' ? '🧑‍⚕️ By You' : med.photoUploadedBy === 'elder' ? '👵 By Elder' : 'Verified'}
                    </div>
                  </div>
                </div>

                {/* Status Badge + Photo Upload Action */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setUploadTargetMed(med)}
                    title="Upload photo for this pill"
                    className="p-1.5 bg-white hover:bg-slate-100 text-[#1A2B4C] border border-[#1A2B4C] rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-[#FF6B4A]" />
                    <span className="hidden sm:inline">Photo</span>
                  </button>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-[#1A2B4C] ${
                      med.taken
                        ? 'bg-[#4CAF50] text-white'
                        : 'bg-[#FFB84D] text-[#1A2B4C]'
                    }`}
                  >
                    {med.taken ? '✓ Taken' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Safety Feed & Recent Alerts Log */}
        <section 
          id="volunteer-feed-section"
          className="bg-white rounded-2xl p-4 border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C]">
                <Bell className="w-4 h-4 text-[#1A2B4C]" />
              </div>
              <h3 className="text-sm font-black text-[#1A2B4C] uppercase tracking-tight">
                Activity Feed & Event History
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#1A2B4C]">
              {recentAlerts.length} Events
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
            {recentAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">No alerts logged yet.</p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    alert.type === 'sos'
                      ? 'bg-red-50/80 border-red-300'
                      : alert.type === 'checkin_missed'
                      ? 'bg-rose-50 border-rose-300'
                      : alert.type === 'medicine_missed'
                      ? 'bg-amber-50/80 border-amber-300'
                      : 'bg-[#FAF7F2] border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base">
                      {alert.type === 'sos' ? '🚨' : alert.type === 'checkin_missed' ? '⚠️' : alert.type === 'checkin_response' ? '✅' : '💊'}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-[#1A2B4C] truncate">
                        {alert.type === 'sos'
                          ? `SOS Alert: ${alert.elderName}`
                          : alert.type === 'checkin_missed'
                          ? `Missed Check-In Alert (${alert.elderName})`
                          : alert.type === 'checkin_response'
                          ? `Check-in OK from ${alert.elderName}`
                          : `Medication Adherence Event`}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    alert.status === 'active'
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-3xl border-4 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] overflow-hidden flex flex-col">
            <VolunteerPairingView onSuccess={() => setIsPairingViewOpen(false)} />
            <div className="p-3 bg-white border-t border-[#1A2B4C]/20 flex justify-end">
              <button
                onClick={() => setIsPairingViewOpen(false)}
                className="px-4 py-1.5 bg-[#1A2B4C] text-white font-black text-xs uppercase rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
    </div>
  );
};
