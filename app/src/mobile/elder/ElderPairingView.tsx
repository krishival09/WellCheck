import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { TRANSLATIONS } from '../../utils/speech';

export const ElderPairingView: React.FC = () => {
  const { pairData, generateNewPin, setElderScreen, language } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];

  return (
    <Div 
      id="elder-pairing-view"
      className="flex-1 flex flex-col justify-between p-4 bg-[#FAF7F2] text-[#1A2B4C] overflow-y-auto"
    >
      {/* Top Header */}
      <Header className="flex items-center justify-between pb-3 border-b-2 border-[#1A2B4C]/20">
        <Button
          id="elder-pairing-back-btn"
          onClick={() => setElderScreen('home')}
          className="min-h-[44px] px-3 bg-white border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] rounded-xl flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-[#1A2B4C] active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <Span>{t.backText}</Span>
        </Button>
        <Span className="text-[10px] font-black uppercase tracking-wider text-[#1A2B4C] bg-[#FFB84D] border border-[#1A2B4C] shadow-[1px_1px_0px_#1A2B4C] px-3 py-1 rounded-lg">
          Device Pairing
        </Span>
      </Header>

      {/* Main Content */}
      <Main className="flex-1 flex flex-col items-center justify-center my-3 text-center">
        
        <Div className="w-14 h-14 rounded-2xl bg-[#FFB84D] border-2 border-[#1A2B4C] flex items-center justify-center text-[#1A2B4C] mb-2 shadow-[2px_2px_0px_#1A2B4C]">
          <KeyRound className="w-8 h-8" />
        </Div>

        <H2 className="text-2xl font-black text-[#1A2B4C] leading-tight uppercase tracking-tight">
          {t.pairWithVolunteerText}
        </H2>
        <P className="text-xs font-bold text-[#1A2B4C]/80 mt-1 max-w-[280px]">
          {t.sharePinSubtext}
        </P>

        {/* Big PIN Display */}
        <Div className="my-5 w-full max-w-[280px] bg-white border-4 border-[#1A2B4C] rounded-2xl p-4 shadow-[4px_4px_0px_#1A2B4C] flex flex-col items-center justify-center">
          <Span className="text-[10px] font-black uppercase tracking-widest text-[#1A2B4C]/70 mb-1">
            {t.yourPinText}
          </Span>
          <Div className="text-5xl font-black tracking-[0.25em] text-[#1A2B4C] pl-2 font-mono">
            {pairData.pinCode}
          </Div>
          <Span className="text-[10px] font-mono font-bold text-[#1A2B4C]/60 mt-1">
            Document: pairs/{pairData.pinCode}
          </Span>
        </Div>

        {/* Pairing Status Card */}
        <Div className="w-full bg-white border-2 border-[#1A2B4C] rounded-2xl p-3.5 text-left shadow-[3px_3px_0px_#1A2B4C] flex items-center gap-3">
          <Div className="w-10 h-10 rounded-xl bg-[#4CAF50] text-white border border-[#1A2B4C] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </Div>
          <Div>
            <Span className="text-[10px] font-black text-[#4CAF50] uppercase tracking-wider">
              {t.connectionStatusText}
            </Span>
            <Div className="text-base font-black text-[#1A2B4C]">
              {pairData.isPaired ? t.connectedLiveText : t.waitingVolunteerText}
            </Div>
            <Div className="text-xs font-bold text-[#1A2B4C]/70">
              Caregiver: {pairData.volunteerName || 'Sarah Chen'}
            </Div>
          </Div>
        </Div>

        {/* Generate New PIN Button */}
        <Button
          id="elder-regenerate-pin-btn"
          onClick={generateNewPin}
          className="mt-3 flex items-center gap-1.5 text-xs font-black text-[#1A2B4C] hover:text-[#FF6B4A] uppercase tracking-wider p-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <Span>{t.generateNewPinText}</Span>
        </Button>
      </Main>

      {/* Footer Return Home */}
      <Footer className="pt-2">
        <Button
          id="elder-pair-done-btn"
          onClick={() => setElderScreen('home')}
          className="w-full min-h-[54px] bg-[#1A2B4C] hover:bg-black text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
        >
          {t.returnHomeText}
        </Button>
      </Footer>
    </Div>
  );
};
