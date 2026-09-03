import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form, triggerHaptic } from '../../rn-compat';
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
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, speakText, TRANSLATIONS } from '../../utils/speech';
import { SupportedLanguage } from '../../types';
import { TtsSubtitleBanner } from '../components/TtsSubtitleBanner';
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
    logoutUser,
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
    triggerHaptic('heavy');
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
    <Div id="elder-home-screen" className="flex-1 flex flex-col p-3 bg-[#FAF7F2] dark:bg-slate-900 text-[#1A2B4C] dark:text-white">
      
      {/* Top Header: Sleek Interface Navbar */}
      <Header className="bg-[#1A2B4C] dark:bg-slate-800 px-3.5 py-2.5 text-white rounded-xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-between mb-2">
        <Div className="flex items-center gap-2 min-w-0">
          <Div className="w-2.5 h-2.5 bg-[#4CAF50] rounded-full border border-white shrink-0" />
          <Span className="text-xs font-black uppercase tracking-widest text-white truncate max-w-[130px]">
            {t.homeTitle}
          </Span>
        </Div>
        <Div className="flex items-center gap-1.5 shrink-0">
          {/* TTS Listen Button */}
          <Button
            id="elder-tts-read-button"
            onClick={handleSpeakCurrentStatus}
            aria-label="Read screen aloud"
            title="Read screen aloud"
            className="w-8 h-8 flex items-center justify-center bg-[#FFB84D] text-[#1A2B4C] rounded-lg border border-white active:scale-95 transition shadow-sm cursor-pointer"
          >
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
          </Button>

          {/* Language Selector Dropdown */}
          <Div className="relative">
            <Button
              id="elder-lang-selector-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Select Language"
              className="h-8 px-2 flex items-center gap-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white rounded-lg border border-white dark:border-slate-600 text-xs font-black active:scale-95 transition shadow-sm cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#1A2B4C] dark:text-white" />
              <Span>{SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag || '🌐'}</Span>
            </Button>

            {showLangMenu && (
              <Div 
                id="elder-lang-dropdown"
                className="absolute right-0 top-10 w-60 max-h-72 overflow-y-auto bg-white dark:bg-slate-800 border-2 border-[#1A2B4C] dark:border-slate-700 rounded-xl shadow-[4px_4px_0px_#1A2B4C] z-50 p-1.5 flex flex-col gap-1"
              >
                <Div className="px-3 py-1 text-[10px] font-black text-[#1A2B4C]/70 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <Span>Select Language</Span>
                  <Span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-1 rounded font-bold">10+ Regional</Span>
                </Div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <Button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as SupportedLanguage);
                      setShowLangMenu(false);
                      const targetT = TRANSLATIONS[lang.code as SupportedLanguage] || TRANSLATIONS['en-US'];
                      speakText(targetT.checkinPrompt, lang.code as SupportedLanguage);
                    }}
                    className={`min-h-[40px] w-full px-3 py-1.5 text-left rounded-lg flex items-center gap-2.5 font-bold text-xs transition cursor-pointer ${
                      language === lang.code
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

          {/* Log Out / Switch Role Button */}
          <Button
            id="elder-logout-btn"
            onClick={logoutUser}
            aria-label="Switch User / Log Out"
            title="Switch User / Log Out"
            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 active:scale-95 transition shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-white" />
          </Button>
        </Div>
      </Header>

      {/* Real-time Visual TTS Subtitle Banner when voice plays */}
      <TtsSubtitleBanner />

      {/* ACTIVE SCHEDULED CHECK-IN PROMPT BANNER WITH 3-MINUTE COUNTDOWN */}
      {activeCheckinPrompt && activeCheckinPrompt.status === 'pending' && (
        <Div 
          id="elder-active-checkin-prompt-banner"
          className="mb-2 bg-[#FFF8E7] dark:bg-amber-950/40 rounded-2xl border-3 border-[#FFB84D] shadow-[4px_4px_0px_#1A2B4C] p-3.5 flex flex-col gap-2.5 animate-in slide-in-from-top-2"
        >
          <Div className="flex items-center justify-between gap-2">
            <Div className="flex items-center gap-2 min-w-0">
              <Span className="w-8 h-8 rounded-xl bg-[#FFB84D] text-[#1A2B4C] flex items-center justify-center font-black animate-bounce shadow-xs shrink-0">
                <BellRing className="w-4 h-4 stroke-[2.5]" />
              </Span>
              <Div className="min-w-0">
                <Span className="text-[11px] font-black uppercase tracking-wider text-[#1A2B4C]/80 dark:text-amber-200 block truncate">
                  Scheduled Check-In Time
                </Span>
                <Span className="text-sm font-black text-[#1A2B4C] dark:text-white truncate block">
                  {activeCheckinPrompt.scheduledTime} Safety Check
                </Span>
              </Div>
            </Div>

            {/* Countdown Badge */}
            <Div className="bg-[#FF6B4A] text-white px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-mono font-black border border-[#1A2B4C] shadow-xs shrink-0">
              <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <Span>{formatRemaining(remainingSec)}</Span>
            </Div>
          </Div>

          <P className="text-xs font-bold text-[#1A2B4C] dark:text-amber-100">
            Please tap below to let {pairData.volunteerName || 'your caregiver'} know you are safe and doing well.
          </P>

          <Button
            id="elder-prompt-checkin-now-btn"
            onClick={handleCheckInClick}
            className="w-full min-h-[52px] bg-[#4CAF50] hover:bg-[#43a047] text-white rounded-xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider active:scale-98 transition cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <Span>✓ {t.imOkText || "I'M OK — CHECK IN NOW"}</Span>
          </Button>
        </Div>
      )}

      {/* Main Vertically Scrolling List */}
      <Main className="flex-1 flex flex-col gap-3 pb-2">
        
        {/* 1. SOS Button: Bold Coral with Hard Drop Shadow */}
        <Section aria-label="Emergency SOS Action">
          <Button
            id="elder-sos-main-button"
            onClick={() => {
              triggerHaptic('error');
              startSosCountdown();
            }}
            aria-label="Emergency SOS — I Need Help"
            className="w-full min-h-[115px] bg-[#FF6B4A] hover:bg-[#ff5a36] text-white rounded-2xl p-4 border-4 border-[#1A2B4C] dark:border-slate-600 shadow-[4px_4px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center text-center gap-0.5 transition-all cursor-pointer"
          >
            <Span className="text-[32px] leading-tight font-black uppercase tracking-tight text-white drop-shadow-sm">
              {t.sosButtonText}
            </Span>
            <Span className="text-[14px] uppercase font-black tracking-widest text-white/95">
              {t.sosSubtext}
            </Span>
            <Span className="text-[10px] font-bold bg-black/25 px-3 py-0.5 rounded-full mt-1 border border-white/20">
              {t.sosTapPrompt}
            </Span>
          </Button>
        </Section>

        {/* 2. Secondary Cards: "Take Medicine", "Add Medicine", & "Check In" (60dp+ Touch Targets) */}
        <Section className="flex flex-col gap-2.5" aria-label="Daily Safety Actions">
          
          {/* Take Medicine Card */}
          <Button
            id="elder-medicine-card-button"
            onClick={() => {
              if (pendingMedicine) {
                setSelectedMedicineId(pendingMedicine.id);
              }
              setElderScreen('medicine_detail');
            }}
            className="w-full min-h-[84px] bg-[#FAF7F2] dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 text-[#1A2B4C] dark:text-white rounded-2xl px-4 py-3 flex items-center justify-between border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1A2B4C] transition-all cursor-pointer"
          >
            <Div className="flex items-center gap-3.5 text-left min-w-0">
              {pendingMedicine?.localPhotoRef ? (
                <Div className="w-12 h-12 rounded-xl border-2 border-[#1A2B4C] dark:border-slate-600 overflow-hidden bg-slate-100 shrink-0 shadow-[2px_2px_0px_#1A2B4C]">
                  <Img
                    src={pendingMedicine.localPhotoRef}
                    alt="Scheduled Tablet"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </Div>
              ) : (
                <Div className="w-12 h-12 bg-[#FFB84D] rounded-xl border-2 border-[#1A2B4C] dark:border-slate-600 flex items-center justify-center text-2xl font-black text-[#1A2B4C] shrink-0 shadow-[2px_2px_0px_#1A2B4C]">
                  💊
                </Div>
              )}
              <Div className="flex flex-col min-w-0">
                <Span className="text-[18px] font-black leading-tight text-[#1A2B4C] dark:text-white truncate">
                  {t.takeMedicineText}
                </Span>
                <Span className="text-xs font-bold text-[#1A2B4C]/80 dark:text-slate-300 truncate">
                  {pendingMedicine 
                    ? `• ${pendingMedicine.scheduledTime} • ${pendingMedicine.dosage || 'Dose'}` 
                    : t.medicineTaken}
                </Span>
              </Div>
            </Div>
            <ChevronRight className="w-6 h-6 text-[#1A2B4C] dark:text-white shrink-0 stroke-[2.5]" />
          </Button>

          {/* Add New Medicine Quick Card (Elder Side) */}
          <Button
            id="elder-add-medicine-btn"
            onClick={() => {
              soundFx.playTap();
              setIsAddMedModalOpen(true);
            }}
            className="w-full min-h-[56px] bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-slate-700 text-[#1A2B4C] dark:text-white rounded-2xl px-4 py-2.5 flex items-center justify-between border-2 border-dashed border-[#1A2B4C] dark:border-slate-600 shadow-[2px_2px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1A2B4C] transition-all cursor-pointer"
          >
            <Div className="flex items-center gap-3 text-left min-w-0">
              <Div className="w-9 h-9 rounded-xl bg-[#4CAF50] text-white flex items-center justify-center font-black border border-[#1A2B4C] shadow-xs shrink-0">
                <Plus className="w-5 h-5 stroke-[3]" />
              </Div>
              <Div className="flex flex-col min-w-0">
                <Span className="text-[15px] font-black leading-tight text-[#1A2B4C] dark:text-white truncate">
                  + Add New Medicine
                </Span>
                <Span className="text-[11px] font-bold text-[#1A2B4C]/70 dark:text-slate-300 truncate">
                  Set pill name, dose & photo reminder
                </Span>
              </Div>
            </Div>
            <Span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-md shrink-0">
              New
            </Span>
          </Button>

          {/* Check In — I'm OK Card */}
          <Button
            id="elder-checkin-card-button"
            onClick={handleCheckInClick}
            className={`w-full min-h-[80px] rounded-2xl px-4 py-3 flex items-center justify-between border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#1A2B4C] transition-all cursor-pointer ${
              justCheckedIn
                ? 'bg-[#4CAF50] text-white'
                : 'bg-[#FAF7F2] dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 text-[#1A2B4C] dark:text-white'
            }`}
          >
            <Div className="flex items-center gap-3.5 text-left min-w-0">
              <Div
                className={`w-11 h-11 rounded-xl border border-[#1A2B4C] dark:border-slate-600 flex items-center justify-center text-2xl font-black shrink-0 shadow-[1px_1px_0px_#1A2B4C] ${
                  justCheckedIn
                    ? 'bg-white text-[#4CAF50]'
                    : 'bg-[#4CAF50] text-white'
                }`}
              >
                ✓
              </Div>
              <Div className="flex flex-col min-w-0">
                <Span className="text-[18px] font-black leading-tight truncate">
                  {justCheckedIn ? t.checkedInText : t.checkInText}
                </Span>
                <Span className={`text-xs font-bold truncate ${justCheckedIn ? 'text-white/90' : 'text-[#1A2B4C]/70 dark:text-slate-300'}`}>
                  {justCheckedIn ? t.checkinConfirmed : t.imOkText}
                </Span>
              </Div>
            </Div>
            {!justCheckedIn && <ChevronRight className="w-6 h-6 text-[#1A2B4C] dark:text-white shrink-0 stroke-[2.5]" />}
          </Button>
        </Section>

        {/* 3. Bottom Status Card */}
        <Section className="mt-auto p-3.5 bg-[#1A2B4C] dark:bg-slate-800 text-white rounded-xl text-center border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-1">
          <P className="text-[15px] font-black tracking-tight text-white truncate">
            {t.lastCheckinText}: {lastCheckinTime}
          </P>
          <Div className="flex items-center justify-between text-[11px] font-bold text-white/80 pt-1 border-t border-white/20">
            <Button
              id="elder-call-volunteer-quick-btn"
              onClick={() => startCall({
                contactName: pairData.volunteerName || 'Sarah Chen (Daughter)',
                phoneNumber: '(555) 019-2834',
                contactRole: 'caregiver',
                reason: 'general'
              })}
              className="flex items-center gap-1 bg-[#4CAF50] hover:bg-[#43a047] text-white px-2.5 py-1 rounded-lg font-black text-[11px] uppercase tracking-wide border border-white/30 active:scale-95 transition cursor-pointer shrink-0"
            >
              <Phone className="w-3 h-3" />
              <Span>{t.callText || 'Call'} {pairData.volunteerName ? pairData.volunteerName.split(' ')[0] : 'Sarah'}</Span>
            </Button>
            <Button
              id="elder-pairing-code-btn"
              onClick={() => setElderScreen('pairing')}
              className="text-[#FFB84D] hover:underline flex items-center gap-1 font-mono font-black uppercase shrink-0"
            >
              <KeyRound className="w-3 h-3" />
              PIN {pairData.pinCode}
            </Button>
          </Div>
        </Section>
      </Main>

      {/* Elder Add Medicine Modal */}
      {isAddMedModalOpen && (
        <ElderAddMedicineModal
          isOpen={isAddMedModalOpen}
          onClose={() => setIsAddMedModalOpen(false)}
        />
      )}
    </Div>
  );
};

