import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, ArrowRight, UserCheck, Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../../utils/speech';
import { SupportedLanguage } from '../../types';

interface VolunteerPairingViewProps {
  onSuccess: () => void;
}

export const VolunteerPairingView: React.FC<VolunteerPairingViewProps> = ({ onSuccess }) => {
  const { pairData, pairVolunteerWithPin, volunteerLanguage, setVolunteerLanguage } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = TRANSLATIONS[volunteerLanguage] || TRANSLATIONS['en-US'];
  const currentVolLang = SUPPORTED_LANGUAGES.find(l => l.code === volunteerLanguage) || SUPPORTED_LANGUAGES[0];

  const handlePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().length < 4) {
      setErrorMsg('Please enter a valid 4-digit PIN code.');
      return;
    }
    const success = pairVolunteerWithPin(pinInput);
    if (success) {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('Pair not found. Check the PIN shown on Elder device.');
    }
  };

  return (
    <div 
      id="volunteer-pairing-screen" 
      className="flex-1 flex flex-col justify-between px-4 py-5 bg-[#FAF7F2] text-[#1A2B4C]"
    >
      <header className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#1A2B4C]">WellCheck</h1>
          <p className="text-xs font-semibold text-slate-500">{t.caregiverSetupText || 'Caregiver Setup'}</p>
        </div>
        
        {/* Volunteer Language Selector Dropdown (Identical to Elder UI) */}
        <div className="relative">
          <button
            id="volunteer-pairing-lang-btn"
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-label="Select Volunteer Language"
            className="h-8 px-2 flex items-center gap-1 bg-white hover:bg-slate-100 text-[#1A2B4C] rounded-lg border border-[#1A2B4C]/20 text-xs font-black active:scale-95 transition shadow-sm cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-[#1A2B4C]" />
            <span>{currentVolLang?.flag || '🌐'}</span>
          </button>

          {showLangMenu && (
            <div 
              id="volunteer-pairing-lang-dropdown"
              className="absolute right-0 top-10 w-60 max-h-72 overflow-y-auto bg-white border-2 border-[#1A2B4C] rounded-xl shadow-[4px_4px_0px_#1A2B4C] z-50 p-1.5 flex flex-col gap-1"
            >
              <div className="px-3 py-1 text-[10px] font-black text-[#1A2B4C]/70 uppercase tracking-wider border-b border-slate-200 flex items-center justify-between">
                <span>Select Language</span>
                <span className="text-[9px] bg-amber-100 text-amber-900 px-1 rounded font-bold">Volunteer Mode</span>
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
      </header>

      <main className="my-auto flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 mb-3">
          <KeyRound className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-slate-900">
          {t.connectToElderText || 'Connect to Elder'}
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 max-w-[260px]">
          {t.enter4DigitPinText || "Enter the 4-digit code generated on your family member's phone."}
        </p>

        <form onSubmit={handlePair} className="w-full max-w-[280px] mt-6 flex flex-col gap-3">
          <div>
            <input
              id="volunteer-pin-input"
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, ''));
                setErrorMsg('');
              }}
              placeholder={pairData.pinCode || '7492'}
              className="w-full h-16 text-center text-3xl font-black tracking-[0.25em] font-mono bg-white border-2 border-slate-300 focus:border-[#1A2B4C] rounded-2xl shadow-sm outline-none transition text-slate-900"
            />
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              Default demo PIN: <strong className="text-slate-700">{pairData.pinCode}</strong>
            </span>
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
              {errorMsg}
            </p>
          )}

          <button
            id="volunteer-submit-pin-btn"
            type="submit"
            className="w-full min-h-[56px] bg-[#1A2B4C] hover:bg-slate-900 text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
          >
            <span>{t.connectDeviceBtn || 'Connect Device'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 p-3.5 bg-white border border-slate-200 rounded-xl text-left w-full max-w-[300px] flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-800 block">Single Active Elder Scoped</span>
            <span className="text-slate-500 font-medium">Auto-queries alerts/{'{elderId}'} via Firestore</span>
          </div>
        </div>
      </main>

      <footer className="pt-2 text-center text-[11px] text-slate-400 font-medium">
        WellCheck Caregiver Sync Engine • Spark Plan Safe
      </footer>
    </div>
  );
};
