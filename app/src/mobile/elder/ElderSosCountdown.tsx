import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form, triggerHaptic } from '../../rn-compat';
import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, Volume2, ShieldAlert } from 'lucide-react-native';
import { speakText, TRANSLATIONS } from '../../utils/speech';

export const ElderSosCountdown: React.FC = () => {
  const {
    sosCountdown,
    cancelSosCountdown,
    triggerImmediateSos,
    language,
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  // Haptic pulse on each countdown second
  useEffect(() => {
    triggerHaptic('medium');
  }, [sosCountdown]);

  const handleSpeakCountdown = () => {
    speakText(t.sosCountdown(sosCountdown), language);
  };

  return (
    <Div 
      id="elder-sos-countdown-screen"
      className="flex-1 flex flex-col justify-between p-4 bg-[#FF6B4A] text-white select-none animate-in fade-in duration-200"
    >
      {/* Top Header warning banner */}
      <Header className="w-full flex flex-row items-center justify-between">
        <Div className="flex flex-row items-center gap-2 bg-[#1A2B4C] text-white px-3 py-1.5 rounded-xl border border-white/20 shadow-[2px_2px_0px_#1A2B4C]">
          <ShieldAlert className="w-4 h-4 text-[#FFB84D] animate-pulse" />
          <Span className="text-xs font-black tracking-widest uppercase">
            SOS ALERT
          </Span>
        </Div>
        <Button
          id="elder-countdown-voice-btn"
          onClick={handleSpeakCountdown}
          aria-label="Repeat voice announcement"
          className="w-10 h-10 rounded-xl bg-[#1A2B4C] border border-white/30 flex items-center justify-center text-white active:scale-95 transition shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
        </Button>
      </Header>

      {/* Center Countdown Display with Ring */}
      <Main className="flex-1 flex flex-col items-center justify-center my-auto text-center">
        
        <P className="text-white text-[22px] font-black uppercase tracking-wider mb-4">
          {t.alertStartingText}
        </P>

        {/* Circular Ring with 2-digit numeral */}
        <Div className="w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center mb-4 bg-black/10 shadow-inner">
          <Span className="text-white text-[58px] font-black tracking-tight leading-none">
            {String(sosCountdown).padStart(2, '0')}
          </Span>
        </Div>

        <Div className="flex flex-row items-center gap-2 text-white font-black uppercase tracking-wider text-xs mb-1 bg-black/20 px-3.5 py-1.5 rounded-full border border-white/20">
          <AlertTriangle className="w-4 h-4 text-[#FFB84D]" />
          <Span>{t.autoDispatchInText(sosCountdown)}</Span>
        </Div>

        <P className="text-xs font-bold text-white/90 max-w-[260px] leading-snug mt-1">
          {t.volunteerWillBeAlertedText}
        </P>

        {/* Quick Send Button */}
        <Button
          id="elder-send-now-btn"
          onClick={() => {
            triggerHaptic('error');
            triggerImmediateSos();
          }}
          className="mt-3 text-[11px] font-black uppercase tracking-widest text-[#1A2B4C] bg-white px-3.5 py-1.5 rounded-lg border border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] hover:bg-slate-100 transition"
        >
          {t.sendImmediatelyText}
        </Button>
      </Main>

      {/* Bottom Cancel Button */}
      <Footer className="pt-2">
        <Button
          id="elder-sos-cancel-button"
          onClick={() => {
            triggerHaptic('light');
            cancelSosCountdown();
          }}
          aria-label="Cancel SOS alert"
          className="w-full h-[72px] bg-white hover:bg-slate-50 text-[#1A2B4C] rounded-2xl border-4 border-[#1A2B4C] text-[20px] font-black uppercase shadow-[6px_6px_0px_#1A2B4C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A2B4C] flex flex-row items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <X className="w-7 h-7 stroke-[3]" />
          <Span>{t.cancelText}</Span>
        </Button>
      </Footer>
    </Div>
  );
};
