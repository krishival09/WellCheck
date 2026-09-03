import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid3X3, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  X
} from 'lucide-react';
import { TRANSLATIONS } from '../../utils/speech';
import { soundFx } from '../../utils/audio';

export const CallModal: React.FC = () => {
  const { 
    activeCall, 
    endCall, 
    toggleCallMute, 
    toggleCallSpeaker, 
    triggerCallDialogue,
    activeRole,
    language,
    volunteerLanguage
  } = useApp();

  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');

  if (!activeCall.isOpen) return null;

  const isElder = activeRole === 'elder';
  const currentLang = isElder ? language : volunteerLanguage;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['en-US'];

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const handleKeypadPress = (key: string) => {
    soundFx.playTap();
    setDialedDigits(prev => prev + key);
  };

  // Quick conversation prompts based on active role
  const quickElderResponses = [
    { label: "I am okay, thank you!", speech: "I am feeling okay now, thank you for checking on me." },
    { label: "Need help here", speech: "I need a little help at home, could you please assist me?" },
    { label: "Took my medicine", speech: "I have taken my scheduled medicine just now." },
    { label: "See you soon", speech: "Thank you so much Sarah, see you soon." },
  ];

  const quickVolunteerResponses = [
    { label: "Are you feeling okay?", speech: "Hi Eleanor, are you feeling okay right now?" },
    { label: "I am on my way!", speech: "Don't worry, I am on my way to your apartment now." },
    { label: "Did you take medicine?", speech: "Just checking in, did you take your scheduled medicine today?" },
    { label: "Call 911 dispatch", speech: "I am alerting emergency services to assist you right away." },
  ];

  const responses = isElder ? quickElderResponses : quickVolunteerResponses;
  const cleanPhone = activeCall.phoneNumber.replace(/[^\d+]/g, '');

  return (
    <Div 
      id="active-call-modal-overlay"
      className="fixed inset-0 z-50 bg-[#1A2B4C]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <Div 
        id="active-call-card"
        className="w-full max-w-md bg-[#FAF7F2] border-4 border-[#1A2B4C] rounded-3xl shadow-[8px_8px_0px_#1A2B4C] p-5 flex flex-col justify-between min-h-[580px] my-auto relative text-[#1A2B4C]"
      >
        {/* Top Status Header */}
        <Header className="flex items-center justify-between border-b-2 border-[#1A2B4C]/20 pb-3">
          <Div className="flex items-center gap-2">
            <Span className={`w-3 h-3 rounded-full ${
              activeCall.status === 'connected' 
                ? 'bg-[#4CAF50] animate-pulse' 
                : activeCall.status === 'ringing' 
                ? 'bg-[#FFB84D] animate-ping' 
                : 'bg-red-500'
            }`} />
            <Span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C]">
              {activeCall.status === 'dialing' && 'Connecting Network...'}
              {activeCall.status === 'ringing' && 'Ringing...'}
              {activeCall.status === 'connected' && `Call Connected • ${formatTime(activeCall.connectedDurationSec)}`}
              {activeCall.status === 'ended' && 'Call Ended'}
            </Span>
          </Div>
          <Div className="flex items-center gap-1.5">
            <Span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#1A2B4C] text-white rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#4CAF50]" />
              Secure VoIP
            </Span>
            <Button
              onClick={endCall}
              className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-[#1A2B4C] transition cursor-pointer"
              title="Close Call"
            >
              <X className="w-4 h-4" />
            </Button>
          </Div>
        </Header>

        {/* Callee / Caller Profile Details */}
        <Main className="my-auto flex flex-col items-center text-center py-4">
          {/* Avatar Ring */}
          <Div className="relative mb-3">
            {activeCall.status === 'connected' && (
              <Div className="absolute -inset-3 rounded-full bg-[#4CAF50]/30 animate-pulse" />
            )}
            {activeCall.status === 'ringing' && (
              <Div className="absolute -inset-3 rounded-full bg-[#FFB84D]/40 animate-ping" />
            )}
            <Div className="relative w-24 h-24 rounded-full bg-[#1A2B4C] text-white flex items-center justify-center text-3xl font-black border-4 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C]">
              {activeCall.contactName.charAt(0)}
            </Div>
          </Div>

          <H2 className="text-2xl font-black text-[#1A2B4C] uppercase tracking-tight leading-tight">
            {activeCall.contactName}
          </H2>
          <Span className="text-xs font-bold text-[#1A2B4C]/70 mt-0.5 uppercase tracking-wider">
            {activeCall.contactRole === 'caregiver' ? 'Primary Volunteer / Daughter' : 'Paired Elder • Apt 4B'}
          </Span>
          <Span className="text-xs font-mono font-black text-[#1A2B4C] bg-white px-2.5 py-0.5 rounded-full border border-[#1A2B4C] shadow-sm mt-1.5">
            {activeCall.phoneNumber}
          </Span>

          {/* Animated Audio Waveform when call is connected */}
          {activeCall.status === 'connected' ? (
            <Div className="w-full mt-4 p-3 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
              <Div className="flex items-center justify-center gap-1.5 h-8">
                {[40, 75, 100, 60, 90, 45, 80, 100, 65, 30].map((height, i) => (
                  <Span
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1.5 bg-[#4CAF50] rounded-full animate-pulse"
                  />
                ))}
              </Div>
              <P className="text-[11px] font-bold text-[#1A2B4C]/80">
                Voice channel active • Crystal Clear HD Audio
              </P>
            </Div>
          ) : (
            <Div className="w-full mt-4 p-2.5 bg-amber-50 rounded-xl border border-amber-300 text-xs font-bold text-amber-900 flex items-center justify-center gap-2">
              <Span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <Span>Contacting device ({activeCall.phoneNumber})...</Span>
            </Div>
          )}

          {/* Quick Voice Dialogue Simulator */}
          {activeCall.status === 'connected' && (
            <Div className="w-full mt-3 flex flex-col gap-1.5 text-left">
              <Div className="flex items-center justify-between px-1">
                <Span className="text-[10px] font-black uppercase tracking-wider text-[#1A2B4C]/70 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Quick Voice Prompts
                </Span>
                <Span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Tap to speak
                </Span>
              </Div>
              <Div className="grid grid-cols-2 gap-1.5">
                {responses.map((resp, idx) => (
                  <Button
                    key={idx}
                    onClick={() => triggerCallDialogue(resp.speech)}
                    className="min-h-[38px] p-2 bg-white hover:bg-slate-100 text-[#1A2B4C] rounded-xl border border-[#1A2B4C] shadow-[1px_1px_0px_#1A2B4C] text-[11px] font-black text-left leading-tight active:scale-95 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#FFB84D] shrink-0" />
                    <Span className="truncate">{resp.label}</Span>
                  </Button>
                ))}
              </Div>
            </Div>
          )}

          {/* Keypad View if opened */}
          {showKeypad && (
            <Div className="w-full mt-3 bg-white p-3 rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] animate-in fade-in">
              <Div className="text-center font-mono font-black text-lg text-[#1A2B4C] mb-2 min-h-[28px] border-b border-slate-200 pb-1">
                {dialedDigits || 'Tap digits for DTMF tone'}
              </Div>
              <Div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                  <Button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className="h-10 bg-[#FAF7F2] hover:bg-slate-100 border border-[#1A2B4C] rounded-xl font-black text-base active:scale-90 transition cursor-pointer"
                  >
                    {k}
                  </Button>
                ))}
              </Div>
            </Div>
          )}
        </Main>

        {/* Bottom Call Controls */}
        <Footer className="pt-2 flex flex-col gap-3">
          {/* Action Button Strip: Mute, Keypad, Speaker, Native Dial */}
          <Div className="grid grid-cols-4 gap-2">
            {/* Mute Button */}
            <Button
              id="call-mute-toggle-btn"
              onClick={toggleCallMute}
              className={`h-12 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer ${
                activeCall.isMuted ? 'bg-[#FF6B4A] text-white' : 'bg-white text-[#1A2B4C] hover:bg-slate-50'
              }`}
              title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {activeCall.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <Span className="text-[9px] font-black uppercase">{activeCall.isMuted ? 'Muted' : 'Mute'}</Span>
            </Button>

            {/* Keypad Button */}
            <Button
              id="call-keypad-toggle-btn"
              onClick={() => setShowKeypad(!showKeypad)}
              className={`h-12 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer ${
                showKeypad ? 'bg-[#1A2B4C] text-white' : 'bg-white text-[#1A2B4C] hover:bg-slate-50'
              }`}
              title="Toggle Keypad"
            >
              <Grid3X3 className="w-4 h-4" />
              <Span className="text-[9px] font-black uppercase">Keypad</Span>
            </Button>

            {/* Speaker Button */}
            <Button
              id="call-speaker-toggle-btn"
              onClick={toggleCallSpeaker}
              className={`h-12 rounded-2xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer ${
                activeCall.isSpeakerOn ? 'bg-[#4CAF50] text-white' : 'bg-white text-[#1A2B4C] hover:bg-slate-50'
              }`}
              title="Toggle Speakerphone"
            >
              {activeCall.isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <Span className="text-[9px] font-black uppercase">{activeCall.isSpeakerOn ? 'Speaker' : 'Earpiece'}</Span>
            </Button>

            {/* Native Cellular Dial Link */}
            <a
              id="call-cellular-dial-link"
              href={`tel:${cleanPhone}`}
              className="h-12 rounded-2xl bg-white hover:bg-slate-50 text-[#1A2B4C] border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition cursor-pointer"
              title="Launch Device Phone Dialer"
            >
              <ExternalLink className="w-4 h-4 text-[#1A2B4C]" />
              <Span className="text-[9px] font-black uppercase">Cellular</Span>
            </a>
          </Div>

          {/* Big End Call Button */}
          <Button
            id="call-hangup-btn"
            onClick={endCall}
            className="w-full min-h-[56px] bg-[#FF6B4A] hover:bg-[#e05333] active:bg-[#c94123] text-white font-black text-base uppercase tracking-wider rounded-2xl border-2 border-[#1A2B4C] shadow-[4px_4px_0px_#1A2B4C] flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
          >
            <PhoneOff className="w-5 h-5 stroke-[2.5]" />
            <Span>End Call</Span>
          </Button>
        </Footer>
      </Div>
    </Div>
  );
};
