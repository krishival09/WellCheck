import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  UserCheck 
} from 'lucide-react';
import { TRANSLATIONS } from '../../utils/speech';
import { TtsSubtitleBanner } from '../components/TtsSubtitleBanner';

export const ElderSosConfirmation: React.FC = () => {
  const { setElderScreen, pairData, language, startCall } = useApp();
  const [smsSimulated, setSmsSimulated] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-US'];
  const emergencyPhone = '(555) 019-2834';
  const contactName = pairData.volunteerName || 'Sarah Chen (Daughter)';

  const handleStartElderCall = () => {
    startCall({
      contactName,
      phoneNumber: emergencyPhone,
      contactRole: 'caregiver',
      reason: 'sos'
    });
  };

  const handleSimulateSms = () => {
    setSmsSimulated(true);
    // Also trigger native sms: protocol handler if clicked on phone
    window.location.href = `sms:5550192834?body=${encodeURIComponent(`EMERGENCY SOS: Eleanor Vance needs immediate assistance at Apt 4B. WellCheck Alert.`)}`;
    setTimeout(() => setSmsSimulated(false), 3500);
  };

  return (
    <Div 
      id="elder-sos-confirmation-screen" 
      className="flex-1 flex flex-col justify-between p-4 bg-[#FAF7F2] text-[#1A2B4C]"
    >
      {/* Top Header / Back */}
      <Header className="flex items-center justify-between pb-3 border-b-2 border-[#1A2B4C]/20">
        <Button
          id="elder-confirmation-back-btn"
          onClick={() => setElderScreen('home')}
          className="min-h-[44px] px-3 bg-white border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] rounded-xl flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-[#1A2B4C] active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <Span>{t.backText}</Span>
        </Button>
        <Span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-[#4CAF50] text-white border border-[#1A2B4C] shadow-[1px_1px_0px_#1A2B4C] rounded-lg flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Transmitted
        </Span>
      </Header>

      <Div className="mt-2">
        <TtsSubtitleBanner />
      </Div>

      {/* Main Confirmation Content */}
      <Main className="flex-1 flex flex-col items-center justify-center my-3 text-center">
        
        {/* Alert Sent Banner */}
        <Div className="w-16 h-16 rounded-2xl bg-[#4CAF50] text-white flex items-center justify-center shadow-[3px_3px_0px_#1A2B4C] border-2 border-[#1A2B4C] mb-3">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </Div>
        <H2 className="text-3xl font-black tracking-tight text-[#1A2B4C] uppercase leading-tight">
          {t.alertSentText}
        </H2>
        <P className="text-xs font-bold text-[#1A2B4C]/80 mt-1 max-w-[280px]">
          {t.alertSentSubtext}
        </P>

        {/* Volunteer Notice Card */}
        <Div className="w-full mt-4 p-3.5 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] text-left flex flex-col gap-1.5">
          <Div className="flex items-center gap-1.5 text-[#4CAF50] font-black text-xs uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <Span>{t.notifiedCaregiverText}</Span>
          </Div>
          <Div className="text-xl font-black text-[#1A2B4C]">
            {contactName}
          </Div>
          <Div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A2B4C]/70">
            <Clock className="w-3.5 h-3.5" />
            <Span>{t.transmittedJustNowText} ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</Span>
          </Div>
        </Div>

        {/* Direct Phone/SMS Fallback Section */}
        <Div className="w-full mt-3.5 flex flex-col gap-2">
          <P className="text-[10px] font-black uppercase tracking-wider text-[#1A2B4C]/70 text-left px-1">
            {t.directFallbackText}
          </P>

          {/* Call Preset Contact */}
          <Button
            id="elder-direct-call-btn"
            onClick={handleStartElderCall}
            aria-label={`Call ${contactName} at ${emergencyPhone}`}
            className="w-full min-h-[58px] bg-[#1A2B4C] hover:bg-black text-white rounded-2xl px-4 py-2.5 flex items-center justify-between border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
          >
            <Div className="flex items-center gap-3 text-left">
              <Div className="w-9 h-9 rounded-xl bg-[#4CAF50] text-white border border-white/20 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </Div>
              <Div className="flex flex-col">
                <Span className="text-base font-black leading-tight uppercase tracking-tight">
                  {`${t.callText} ${contactName.split(' ')[0]}`}
                </Span>
                <Span className="text-xs font-mono text-white/80 font-bold">{emergencyPhone}</Span>
              </Div>
            </Div>
            <Span className="text-[10px] font-black uppercase bg-[#FFB84D] text-[#1A2B4C] px-2.5 py-1 rounded-lg border border-black">
              {t.callText}
            </Span>
          </Button>

          {/* SMS Preset Contact */}
          <Button
            id="elder-direct-sms-btn"
            onClick={handleSimulateSms}
            aria-label="Send emergency text"
            className="w-full min-h-[54px] bg-white hover:bg-slate-50 text-[#1A2B4C] rounded-2xl px-4 py-2 flex items-center justify-between border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
          >
            <Div className="flex items-center gap-3 text-left">
              <Div className="w-8 h-8 rounded-xl bg-[#FFB84D] text-[#1A2B4C] border border-[#1A2B4C] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </Div>
              <Div className="flex flex-col">
                <Span className="text-sm font-black leading-tight uppercase">
                  {smsSimulated ? 'SMS App Opened' : t.smsText}
                </Span>
                <Span className="text-[10px] text-[#1A2B4C]/70 font-bold">Auto-populated location text</Span>
              </Div>
            </Div>
            <Span className="text-[10px] font-black text-[#1A2B4C] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#1A2B4C]">
              {t.smsText}
            </Span>
          </Button>
        </Div>
      </Main>

      {/* Footer Return to Home */}
      <Footer className="pt-2">
        <Button
          id="elder-return-home-btn"
          onClick={() => setElderScreen('home')}
          className="w-full min-h-[52px] bg-[#1A2B4C] hover:bg-black text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
        >
          {t.returnHomeText}
        </Button>
      </Footer>
    </Div>
  );
};
