import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, 
  Columns, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Pill, 
  KeyRound, 
  LayoutDashboard,
  CheckCircle,
  Clock,
  Loader2,
  BellOff,
  LogIn,
  HeartHandshake,
  User
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { SUPPORTED_LANGUAGES, speakText, TRANSLATIONS } from '../utils/speech';
import { SupportedLanguage } from '../types';

export type ViewLayout = 'dual_live' | 'elder_solo' | 'volunteer_solo' | 'login_view';

interface HeaderNavProps {
  viewLayout: ViewLayout;
  setViewLayout: (layout: ViewLayout) => void;
  showTouchGrid: boolean;
  setShowTouchGrid: (show: boolean) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  viewLayout,
  setViewLayout,
}) => {
  const {
    setActiveRole,
    elderScreen,
    setElderScreen,
    volunteerScreen,
    setVolunteerScreen,
    startSosCountdown,
    isSimulationLoading,
    setIsSimulationLoading,
    isSimulationEmpty,
    setIsSimulationEmpty,
    currentUser,
    setIsAuthModalOpen,
    language,
    setLanguage,
    volunteerLanguage,
    setVolunteerLanguage,
  } = useApp();

  const [isMuted, setIsMuted] = React.useState(soundFx.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  const activeLang = viewLayout === 'volunteer_solo' ? volunteerLanguage : language;
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === activeLang);

  return (
    <header className="w-full bg-[#1A2B4C] text-white border-b-2 border-[#1A2B4C] px-4 py-3 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Specification Tagline */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FF6B4A] border-2 border-white flex items-center justify-center text-white font-black text-xl shadow-[2px_2px_0px_#000000]">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase text-white leading-none">
                  WellCheck
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFB84D] text-[#1A2B4C] border border-[#1A2B4C] tracking-widest">
                  SPEC v1.0
                </span>
              </div>
              <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider mt-0.5">
                Two-Role Elder Safety & Volunteer Caregiver Specification
              </p>
            </div>
          </div>

          {/* Color Indicators */}
          <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-white/20">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-[#FF6B4A] rounded-full border border-white/30" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Coral Energy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-[#FFB84D] rounded-full border border-white/30" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Warm Gold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-[#1A2B4C] rounded-full border border-white" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Deep Navy</span>
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="md:hidden w-8 h-8 bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFB84D]" />}
          </button>
        </div>

        {/* View Mode Switcher & User Profile */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          
          {/* Main Layout Tabs */}
          <div className="flex items-center bg-[#0e192f] p-1 border-2 border-white/20 text-xs font-black shadow-[3px_3px_0px_#000000]">
            <button
              id="layout-dual-btn"
              onClick={() => setViewLayout('dual_live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition uppercase tracking-wider ${
                viewLayout === 'dual_live'
                  ? 'bg-[#FF6B4A] text-white border border-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>Dual Live View</span>
            </button>
            <button
              id="layout-elder-solo-btn"
              onClick={() => {
                setViewLayout('elder_solo');
                setActiveRole('elder');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition uppercase tracking-wider ${
                viewLayout === 'elder_solo'
                  ? 'bg-[#FF6B4A] text-white border border-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#FFB84D]" />
              <span>Elder Solo</span>
            </button>
            <button
              id="layout-volunteer-solo-btn"
              onClick={() => {
                setViewLayout('volunteer_solo');
                setActiveRole('volunteer');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition uppercase tracking-wider ${
                viewLayout === 'volunteer_solo'
                  ? 'bg-[#FF6B4A] text-white border border-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-300" />
              <span>Volunteer Solo</span>
            </button>
            <button
              id="layout-login-page-btn"
              onClick={() => {
                setViewLayout('login_view');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition uppercase tracking-wider ${
                viewLayout === 'login_view'
                  ? 'bg-[#FFB84D] text-[#1A2B4C] border border-white font-black shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Page</span>
            </button>
          </div>

          {/* Regional Language Quick Switcher */}
          <div className="flex items-center bg-[#0e192f] px-2 py-1 border-2 border-white/20 text-xs font-black shadow-[3px_3px_0px_#000000] gap-1.5">
            <span className="text-[11px] text-[#FFB84D] hidden sm:inline">
              {viewLayout === 'volunteer_solo' ? 'Vol Lang:' : viewLayout === 'elder_solo' ? 'Elder Lang:' : 'Lang:'}
            </span>
            <select
              aria-label="Select Application & Speech Language"
              value={activeLang}
              onChange={(e) => {
                const newLang = e.target.value as SupportedLanguage;
                if (viewLayout === 'volunteer_solo') {
                  setVolunteerLanguage(newLang);
                } else {
                  setLanguage(newLang);
                }
                soundFx.playTap();
                const prompt = TRANSLATIONS[newLang]?.checkinPrompt || 'WellCheck Safe';
                speakText(prompt, newLang);
              }}
              className="bg-[#1A2B4C] text-white text-xs font-bold px-2 py-1 rounded border border-white/30 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFB84D]"
            >
              <optgroup label="🇮🇳 Regional Languages of India">
                {SUPPORTED_LANGUAGES.filter(l => l.flag === '🇮🇳').map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌐 Global Locales">
                {SUPPORTED_LANGUAGES.filter(l => l.flag !== '🇮🇳').map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              onClick={() => {
                const prompt = TRANSLATIONS[activeLang]?.checkinPrompt || 'WellCheck Safe';
                speakText(prompt, activeLang);
              }}
              title="Test Voice Output in Selected Language"
              className="px-2 py-1 bg-[#FF6B4A] hover:bg-[#e05a3b] text-white text-[10px] font-black uppercase rounded flex items-center gap-1 border border-white/40 cursor-pointer transition active:scale-95"
            >
              <Volume2 className="w-3 h-3" />
              <span className="hidden sm:inline">Test Audio</span>
            </button>
          </div>

          {/* User Account / Profile Button */}
          <button
            id="user-profile-header-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded text-xs font-black shadow-[2px_2px_0px_#000000] transition"
            title="Edit User Profile & Regional Language"
          >
            <div className="w-5 h-5 rounded-full bg-[#FFB84D] text-[#1A2B4C] flex items-center justify-center font-black text-[11px]">
              {currentUser.role === 'elder' ? '👵' : '🧑‍⚕️'}
            </div>
            <div className="flex flex-col text-left">
              <span className="leading-tight text-[11px] truncate max-w-[110px]">
                {currentUser.name || 'Sign In'}
              </span>
              <span className="text-[9px] text-[#FFB84D] font-mono leading-none">
                {currentLangObj?.flag} {currentUser.phoneCountryCode} {currentLangObj?.nativeLabel}
              </span>
            </div>
          </button>

          {/* Sound Toggle (Desktop) */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="hidden md:flex w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/30 items-center justify-center text-white transition shadow-[2px_2px_0px_#000000]"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFB84D]" />}
          </button>
        </div>
      </div>

      {/* Sub-navigation bar for Screen State Switching */}
      <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-white/15 flex flex-wrap items-center justify-between text-xs gap-2 font-bold">
        {viewLayout === 'elder_solo' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[#FFB84D] uppercase tracking-wider text-[11px] mr-1">Elder Screen:</span>
            <button
              onClick={() => setElderScreen('home')}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border ${
                elderScreen === 'home' ? 'bg-[#FFB84D] text-[#1A2B4C] border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <span>1. Home Screen</span>
            </button>
            <button
              onClick={() => startSosCountdown()}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                elderScreen === 'sos_countdown' ? 'bg-[#FF6B4A] text-white border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>2. SOS 10s Countdown</span>
            </button>
            <button
              onClick={() => setElderScreen('sos_sent')}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                elderScreen === 'sos_sent' ? 'bg-[#4CAF50] text-white border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              <span>3. SOS Sent & Fallback</span>
            </button>
            <button
              onClick={() => setElderScreen('medicine_detail')}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                elderScreen === 'medicine_detail' ? 'bg-[#FFB84D] text-[#1A2B4C] border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <Pill className="w-3 h-3" />
              <span>4. Medicine Detail</span>
            </button>
            <button
              onClick={() => setElderScreen('pairing')}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                elderScreen === 'pairing' ? 'bg-[#FFB84D] text-[#1A2B4C] border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <KeyRound className="w-3 h-3" />
              <span>5. PIN Pairing</span>
            </button>
            <button
              onClick={() => setElderScreen('login')}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                elderScreen === 'login' ? 'bg-[#4CAF50] text-white border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <LogIn className="w-3 h-3" />
              <span>6. Login Page</span>
            </button>
          </div>
        ) : viewLayout === 'volunteer_solo' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[#FFB84D] uppercase tracking-wider text-[11px] mr-1">Volunteer State:</span>
            <button
              onClick={() => {
                setVolunteerScreen('dashboard');
                setIsSimulationLoading(false);
                setIsSimulationEmpty(false);
              }}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border ${
                volunteerScreen === 'dashboard' && !isSimulationLoading && !isSimulationEmpty ? 'bg-white text-[#1A2B4C] border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              Standard Live Feed
            </button>
            <button
              onClick={() => {
                setVolunteerScreen('loading_demo');
                setIsSimulationLoading(true);
              }}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                isSimulationLoading ? 'bg-[#FF6B4A] text-white border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading Skeleton</span>
            </button>
            <button
              onClick={() => {
                setVolunteerScreen('empty_demo');
                setIsSimulationLoading(false);
                setIsSimulationEmpty(true);
              }}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                isSimulationEmpty ? 'bg-[#FFB84D] text-[#1A2B4C] border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <BellOff className="w-3 h-3" />
              <span>Empty State</span>
            </button>
            <button
              onClick={() => setVolunteerScreen('login')}
              className={`px-2.5 py-1 text-xs uppercase font-extrabold tracking-wider border flex items-center gap-1 ${
                volunteerScreen === 'login' ? 'bg-[#4CAF50] text-white border-white shadow-[2px_2px_0px_#000]' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}
            >
              <LogIn className="w-3 h-3" />
              <span>Login Page</span>
            </button>
          </div>
        ) : viewLayout === 'login_view' ? (
          <div className="flex items-center gap-2 text-white/90 text-xs">
            <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-ping" />
            <span className="uppercase font-bold tracking-wide">
              <strong>Account Setup & Regional Languages:</strong> Configure Mail, Name, Phone Number with Country Code, and Regional Languages.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-ping" />
            <span className="uppercase font-bold tracking-wide">
              <strong>Dual Live Sync Mode:</strong> Tapping SOS, taking medicine, or checking in synchronizes in real-time.
            </span>
          </div>
        )}

        <div className="text-white/50 text-[10px] font-mono uppercase tracking-widest hidden sm:block">
          WellCheck Design System v1.0
        </div>
      </div>
    </header>
  );
};
