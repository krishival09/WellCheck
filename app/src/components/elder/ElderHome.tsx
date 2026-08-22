import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  Languages, 
  ChevronRight, 
  KeyRound,
  Phone,
  Plus,
  Pill,
  Timer,
  BellRing,
  CheckCircle2
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, speakText, TRANSLATIONS } from '../../utils/speech';
import { SupportedLanguage } from '../../types';
import { TtsSubtitleBanner } from '../common/TtsSubtitleBanner';
import { ElderAddMedicineModal } from './ElderAddMedicineModal';
import { soundFx } from '../../utils/audio';

export const ElderHome: React.FC = () => {
  const {
    startSosCountdown,
    setElderScreen,
    setSelectedMedicineId,
    medicines,
    lastCheckinTime,
    respondCheckinOk,
    language,
    setLanguage,
    pairData,
    startCall,
    activeCheckinPrompt,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [remainingSec, setRemainingSec] = useState<number>(180);

  // Live countdown timer for active checkin prompt (3 minutes = 180s)
  useEffect(() => {
    if (!activeCheckinPrompt || activeCheckinPrompt.status !== 'pending') return;

    const updateTimer = () => {
      const remainingMs = Math.max(0, activeCheckinPrompt.expiresAtTimestamp - Date.now());
      setRemainingSec(Math.ceil(remainingMs / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeCheckinPrompt]);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];
  const pendingMedicine = medicines.find(m => !m.taken) || medicines[0];

  const handleCheckInClick = () => {
    respondCheckinOk();
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3500);
  };

  const handleSpeakCurrentStatus = () => {
    const text = `${t.checkinPrompt} ${
      pendingMedicine && !pendingMedicine.taken
        ? t.medicinePrompt('', pendingMedicine.scheduledTime)
        : t.medicineTaken
    }`;
    speakText(text, language);
  };

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="elder-home-screen" className="flex-1 flex flex-col p-3 bg-[#FAF7F2] text-[#1A2B4C]">
      
      {/* Top Header: Sleek Interface Navbar */}
      <header className="bg-[#1A2B4C] px-3.5 py-2.5 text-white rounded-xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#4CAF50] rounded-full border border-white" />
          <span className="text-xs font-black uppercase tracking-widest text-white truncate max-w-[140px]">
            {t.homeTitle}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* TTS Listen Button */}
          <button
            id="elder-tts-read-button"
            onClick={handleSpeakCurrentStatus}
            aria-label="Read screen aloud"
            title="Read screen aloud"
            className="w-8 h-8 flex items-center justify-center bg-[#FFB84D] text-[#1A2B4C] rounded-lg border border-white active:scale-95 transition shadow-sm"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="elder-lang-selector-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Select Language"
              className="h-8 px-2 flex items-center gap-1 bg-white hover:bg-slate-100 text-[#1A2B4C] rounded-lg border border-white text-xs font-black active:scale-95 transition shadow-sm"
            >
              <Languages className="w-3.5 h-3.5 text-[#1A2B4C]" />
              <span>{SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag || '🌐'}</span>
            </button>

            {showLangMenu && (
              <div 
                id="elder-lang-dropdown"
                className="absolute right-0 top-10 w-60 max-h-72 overflow-y-auto bg-white border-2 border-[#1A2B4C] rounded-xl shadow-[4px_4px_0px_#1A2B4C] z-50 p-1.5 flex flex-col gap-1"
              >
                <div className="px-3 py-1 text-[10px] font-black text-[#1A2B4C]/70 uppercase tracking-wider border-b border-slate-200 flex items-center justify-between">
                  <span>Select Language</span>
                  <span className="text-[9px] bg-amber-100 text-amber-900 px-1 rounded font-bold">10+ Regional</span>
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as SupportedLanguage);
                      setShowLangMenu(false);
                      const targetT = TRANSLATIONS[lang.code as SupportedLanguage] || TRANSLATIONS['en-US'];
                      speakText(targetT.checkinPrompt, lang.code as SupportedLanguage);
                    }}
                    className={`min-h-[40px] w-full px-3 py-1.5 text-left rounded-lg flex items-center gap-2.5 font-bold text-xs transition ${
                      language === lang.code
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

      {/* Real-time Visual TTS Subtitle Banner when voice plays */}
      <TtsSubtitleBanner />

      {/* ACTIVE SCHEDULED CHECK-IN PROMPT BANNER WITH 3-MINUTE COUNTDOWN */}
      {activeCheckinPrompt && activeCheckinPrompt.status === 'pending' && (
        <div 
          id="elder-active-checkin-prompt-banner"
          className="mb-2 bg-[#FFF8E7] rounded-2xl border-3 border-[#FFB84D] shadow-[4px_4px_0px_#1A2B4C] p-3.5 flex flex-col gap-2.5 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FFB84D] text-[#1A2B4C] flex items-center justify-center font-black animate-bounce shadow-xs">
                <BellRing className="w-4 h-4 stroke-[2.5]" />
              </span>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1A2B4C]/80 block">
                  Scheduled Check-In Time
                </span>
                <span className="text-sm font-black text-[#1A2B4C]">
                  {activeCheckinPrompt.scheduledTime} Safety Check
                </span>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="bg-[#FF6B4A] text-white px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-mono font-black border border-[#1A2B4C] shadow-xs">
              <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{formatRemaining(remainingSec)}</span>
            </div>
          </div>

          <p className="text-xs font-bold text-[#1A2B4C]">
            Please tap below to let {pairData.volunteerName || 'your caregiver'} know you are safe and doing well.
          </p>

          <button
            id="elder-prompt-checkin-now-btn"
            onClick={handleCheckInClick}
            className="w-full min-h-[52px] bg-[#4CAF50] hover:bg-[#43a047] text-white rounded-xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider active:scale-98 transition cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>✓ {t.imOkText || "I'M OK — CHECK IN NOW"}</span>
          </button>
        </div>
      )}

      {/* Main Vertically Scrolling List */}
      <main className="flex-1 flex flex-col gap-3 pb-2">
        
        {/* 1. SOS Button: Bold Coral with Hard Drop Shadow */}
        <section aria-label="Emergency SOS Action">
          <button
            id="elder-sos-main-button"
            onClick={startSosCountdown}
            aria-label="Emergency SOS — I Need Help"
            className="w-full min-h-[115px] bg-[#FF6B4A] hover:bg-[#ff5a36] text-white rounded-2xl p-4 border-4 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center text-center gap-0.5 transition-all cursor-pointer"
          >
            <span className="text-[32px] leading-tight font-black uppercase tracking-tight text-white drop-shadow-sm">
              {t.sosButtonText}
            </span>
            <span className="text-[14px] uppercase font-black tracking-widest text-white/95">
              {t.sosSubtext}
            </span>
            <span className="text-[10px] font-bold bg-black/25 px-3 py-0.5 rounded-full mt-1 border border-white/20">
              {t.sosTapPrompt}
            </span>
          </button>
        </section>

        {/* 2. Secondary Cards: "Take Medicine", "Add Medicine", & "Check In" (60dp+ Touch Targets) */}
        <section className="flex flex-col gap-2.5" aria-label="Daily Safety Actions">
          
          {/* Take Medicine Card */}
          <button
            id="elder-medicine-card-button"
            onClick={() => {
              if (pendingMedicine) {
                setSelectedMedicineId(pendingMedicine.id);
              }
              setElderScreen('medicine_detail');
            }}
            className="w-full min-h-[84px] bg-[#FAF7F2] hover:bg-white text-[#1A2B4C] rounded-2xl px-4 py-3 flex items-center justify-between border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1A2B4C] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5 text-left">
              {pendingMedicine?.localPhotoRef ? (
                <div className="w-12 h-12 rounded-xl border-2 border-[#1A2B4C] overflow-hidden bg-slate-100 shrink-0 shadow-[2px_2px_0px_#1A2B4C]">
                  <img
                    src={pendingMedicine.localPhotoRef}
                    alt="Scheduled Tablet"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-[#FFB84D] rounded-xl border-2 border-[#1A2B4C] flex items-center justify-center text-2xl font-black text-[#1A2B4C] shrink-0 shadow-[2px_2px_0px_#1A2B4C]">
                  💊
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[18px] font-black leading-tight text-[#1A2B4C]">
                  {t.takeMedicineText}
                </span>
                <span className="text-xs font-bold text-[#1A2B4C]/80 truncate max-w-[200px]">
                  {pendingMedicine 
                    ? `• ${pendingMedicine.scheduledTime} • ${pendingMedicine.dosage || 'Dose'}` 
                    : t.medicineTaken}
                </span>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-[#1A2B4C] shrink-0 stroke-[2.5]" />
          </button>

          {/* Add New Medicine Quick Card (Elder Side) */}
          <button
            id="elder-add-medicine-btn"
            onClick={() => {
              soundFx.playTap();
              setIsAddMedModalOpen(true);
            }}
            className="w-full min-h-[56px] bg-white hover:bg-emerald-50/50 text-[#1A2B4C] rounded-2xl px-4 py-2.5 flex items-center justify-between border-2 border-dashed border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1A2B4C] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#4CAF50] text-white flex items-center justify-center font-black border border-[#1A2B4C] shadow-xs">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black leading-tight text-[#1A2B4C]">
                  + Add New Medicine
                </span>
                <span className="text-[11px] font-bold text-[#1A2B4C]/70">
                  Set pill name, dose & photo reminder
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md">
              New
            </span>
          </button>

          {/* Check In — I'm OK Card */}
          <button
            id="elder-checkin-card-button"
            onClick={handleCheckInClick}
            className={`w-full min-h-[80px] rounded-2xl px-4 py-3 flex items-center justify-between border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1A2B4C] transition-all cursor-pointer ${
              justCheckedIn
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#FAF7F2] hover:bg-white text-[#1A2B4C]'
            }`}
          >
            <div className="flex items-center gap-3.5 text-left">
              <div
                className={`w-11 h-11 rounded-xl border border-[#1A2B4C] flex items-center justify-center text-2xl font-black shrink-0 shadow-[1px_1px_0px_#1A2B4C] ${
                  justCheckedIn
                    ? 'bg-white text-[#4CAF50]'
                    : 'bg-[#4CAF50] text-white'
                }`}
              >
                ✓
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-black leading-tight">
                  {justCheckedIn ? t.checkedInText : t.checkInText}
                </span>
                <span className={`text-xs font-bold ${justCheckedIn ? 'text-white/90' : 'text-[#1A2B4C]/70'}`}>
                  {justCheckedIn ? t.checkinConfirmed : t.imOkText}
                </span>
              </div>
            </div>
            {!justCheckedIn && <ChevronRight className="w-6 h-6 text-[#1A2B4C] shrink-0 stroke-[2.5]" />}
          </button>
        </section>

        {/* 3. Bottom Status Card */}
        <section className="mt-auto p-3.5 bg-[#1A2B4C] text-white rounded-xl text-center border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-1">
          <p className="text-[15px] font-black tracking-tight text-white">
            {t.lastCheckinText}: {lastCheckinTime}
          </p>
          <div className="flex items-center justify-between text-[11px] font-bold text-white/80 pt-1 border-t border-white/20">
            <button
              id="elder-call-volunteer-quick-btn"
              onClick={() => startCall({
                contactName: pairData.volunteerName || 'Sarah Chen (Daughter)',
                phoneNumber: '(555) 019-2834',
                contactRole: 'caregiver',
                reason: 'general'
              })}
              className="flex items-center gap-1 bg-[#4CAF50] hover:bg-[#43a047] text-white px-2.5 py-1 rounded-lg font-black text-[11px] uppercase tracking-wide border border-white/30 active:scale-95 transition cursor-pointer"
            >
              <Phone className="w-3 h-3" />
              <span>{t.callText || 'Call'} {pairData.volunteerName ? pairData.volunteerName.split(' ')[0] : 'Sarah'}</span>
            </button>
            <button
              id="elder-pairing-code-btn"
              onClick={() => setElderScreen('pairing')}
              className="text-[#FFB84D] hover:underline flex items-center gap-1 font-mono font-black uppercase"
            >
              <KeyRound className="w-3 h-3" />
              PIN {pairData.pinCode}
            </button>
          </div>
        </section>
      </main>

      {/* Elder Add Medicine Modal */}
      {isAddMedModalOpen && (
        <ElderAddMedicineModal
          isOpen={isAddMedModalOpen}
          onClose={() => setIsAddMedModalOpen(false)}
        />
      )}
    </div>
  );
};

