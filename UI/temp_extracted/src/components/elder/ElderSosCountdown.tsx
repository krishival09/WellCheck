import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, Volume2, ShieldAlert } from 'lucide-react';
import { speakText, TRANSLATIONS } from '../../utils/speech';
import { TtsSubtitleBanner } from '../common/TtsSubtitleBanner';

export const ElderSosCountdown: React.FC = () => {
  const {
    sosCountdown,
    cancelSosCountdown,
    triggerImmediateSos,
    language,
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  const handleSpeakCountdown = () => {
    speakText(t.sosCountdown(sosCountdown), language);
  };

  return (
    <div 
      id="elder-sos-countdown-screen"
      className="flex-1 flex flex-col justify-between p-4 bg-[#FF6B4A] text-white select-none animate-in fade-in duration-200"
    >
      {/* Top Header warning banner */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#1A2B4C] text-white px-3 py-1 rounded-lg border border-white/20 shadow-[2px_2px_0px_#1A2B4C]">
          <ShieldAlert className="w-4 h-4 text-[#FFB84D] animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase">
            SOS ALERT
          </span>
        </div>
        <button
          id="elder-countdown-voice-btn"
          onClick={handleSpeakCountdown}
          aria-label="Repeat voice announcement"
          className="w-9 h-9 rounded-lg bg-[#1A2B4C] border border-white/30 flex items-center justify-center text-white active:scale-95 transition shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </header>

      <div className="mt-2">
        <TtsSubtitleBanner />
      </div>

      {/* Center Countdown Display with Ring */}
      <main className="flex flex-col items-center justify-center my-auto text-center">
        
        <p className="text-white text-[22px] font-black uppercase tracking-wider mb-4">
          {t.alertStartingText}
        </p>

        {/* Circular Ring with 2-digit numeral */}
        <div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center mb-4 bg-black/10 shadow-inner">
          <span className="text-white text-[58px] font-black tracking-tight leading-none">
            {String(sosCountdown).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-white font-black uppercase tracking-wider text-xs mb-1 bg-black/20 px-3 py-1.5 rounded-full border border-white/20">
          <AlertTriangle className="w-4 h-4 text-[#FFB84D]" />
          <span>{t.autoDispatchInText(sosCountdown)}</span>
        </div>

        <p className="text-xs font-bold text-white/90 max-w-[260px] leading-snug mt-1">
          {t.volunteerWillBeAlertedText}
        </p>

        {/* Quick Send Button */}
        <button
          id="elder-send-now-btn"
          onClick={triggerImmediateSos}
          className="mt-3 text-[11px] font-black uppercase tracking-widest text-[#1A2B4C] bg-white px-3.5 py-1.5 rounded-lg border border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] hover:bg-slate-100 transition"
        >
          {t.sendImmediatelyText}
        </button>
      </main>

      {/* Bottom Cancel Button */}
      <footer className="pt-2">
        <button
          id="elder-sos-cancel-button"
          onClick={cancelSosCountdown}
          aria-label="Cancel SOS alert"
          className="w-full h-[72px] bg-white hover:bg-slate-50 text-[#1A2B4C] rounded-2xl border-4 border-[#1A2B4C] text-[20px] font-black uppercase shadow-[6px_6px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <X className="w-7 h-7 stroke-[3]" />
          <span>{t.cancelText}</span>
        </button>
      </footer>
    </div>
  );
};
