import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertOctagon, 
  Phone, 
  Check, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Volume2, 
  VolumeX,
  User,
  Heart,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { TRANSLATIONS, speakText } from '../../utils/speech';

interface VolunteerSosModalProps {
  onDismiss: () => void;
}

export const VolunteerSosModal: React.FC<VolunteerSosModalProps> = ({ onDismiss }) => {
  const { 
    activeSosAlert, 
    acknowledgeAlert, 
    pairData, 
    volunteerLanguage, 
    startCall,
    elderProfile,
    elderLocation,
  } = useApp();
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  const t = TRANSLATIONS[volunteerLanguage] || TRANSLATIONS['en-US'];
  const elderName = activeSosAlert?.elderName || elderProfile.name || pairData.elderName || 'Eleanor Vance';
  const elderPhone = elderProfile.phoneNumber 
    ? `${elderProfile.phoneCountryCode || '+91'} ${elderProfile.phoneNumber}`
    : '(555) 018-9923';
  const elderAddress = elderProfile.address || 'Apartment 4B, Maple Green Lane';
  const emergencyContactName = elderProfile.emergencyContactName || 'Sarah Chen (Daughter)';
  const emergencyContactPhone = elderProfile.emergencyContactPhone || '+91 98450 67890';

  // Sound Siren loop on Volunteer side when SOS is active
  useEffect(() => {
    if (!isMuted) {
      soundFx.startSosSirenLoop();
      // Speak emergency alert in the volunteer's selected language
      const alertMsg = `${t.criticalEmergencyText || 'Critical Emergency'}: ${t.sosTakeoverTitle || 'SOS Alert'} - ${elderName}`;
      speakText(alertMsg, volunteerLanguage);
    }
    return () => {
      soundFx.stopSosSirenLoop();
    };
  }, [isMuted, volunteerLanguage, elderName, t.criticalEmergencyText, t.sosTakeoverTitle]);

  const handleCallElder = () => {
    soundFx.stopSosSirenLoop();
    startCall({
      contactName: elderName,
      phoneNumber: elderPhone,
      contactRole: 'elder',
      reason: 'sos'
    });
  };

  const handleCallEmergencyContact = () => {
    soundFx.stopSosSirenLoop();
    startCall({
      contactName: emergencyContactName,
      phoneNumber: emergencyContactPhone,
      contactRole: 'caregiver',
      reason: 'sos'
    });
  };

  const handleAcknowledgeAndDismiss = () => {
    soundFx.stopSosSirenLoop();
    if (activeSosAlert) {
      acknowledgeAlert(activeSosAlert.id);
    }
    onDismiss();
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (next) {
      soundFx.stopSosSirenLoop();
    } else {
      soundFx.startSosSirenLoop();
    }
  };

  return (
    <Div 
      id="volunteer-sos-takeover-modal"
      className="absolute inset-0 z-50 bg-[#FF6B4A] text-white p-4 sm:p-5 flex flex-col justify-between overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Urgent Header */}
      <Header className="flex items-center justify-between shrink-0 pb-2">
        <Div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/20">
          <ShieldAlert className="w-4 h-4 text-amber-300 animate-pulse" />
          <Span className="text-[11px] font-black uppercase tracking-widest text-white">
            {t.criticalEmergencyText || 'CRITICAL EMERGENCY'}
          </Span>
        </Div>
        <Button
          id="volunteer-sos-mute-btn"
          onClick={toggleSound}
          className="w-9 h-9 rounded-full bg-black/25 flex items-center justify-center text-white hover:bg-black/40 transition cursor-pointer"
          aria-label={isMuted ? 'Unmute alarm' : 'Mute alarm'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse text-[#FFB84D]" />}
        </Button>
      </Header>

      {/* Center Alert Body */}
      <Main className="my-auto flex flex-col items-center text-center py-2">
        
        {/* Pulsing Siren Icon */}
        <Div className="relative mb-3">
          <Div className="absolute -inset-3 rounded-full bg-white/25 animate-ping" />
          <Div className="relative w-20 h-20 rounded-full bg-white text-[#FF6B4A] flex items-center justify-center shadow-2xl border-4 border-black/10">
            <AlertOctagon className="w-12 h-12 stroke-[2.5]" />
          </Div>
        </Div>

        <Span className="text-[10px] font-black uppercase tracking-widest text-white/90 bg-black/25 px-3 py-0.5 rounded-full mb-1">
          High-Urgency Siren Active
        </Span>
        <H1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-md">
          {t.sosTakeoverTitle || 'SOS ALERT'}
        </H1>
        <P className="text-lg font-black text-white mt-0.5">
          {elderName} Needs Help!
        </P>

        {/* Location & Time Info Card */}
        <Div className="w-full mt-3 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 text-left flex flex-col gap-2 shadow-sm">
          <Div className="flex items-center justify-between text-xs font-bold text-white/90">
            <Span className="flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5" /> Triggered: Just now
            </Span>
            <Span className="bg-red-900/70 text-amber-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide">
              Live Alert
            </Span>
          </Div>

          <Div className="flex items-start justify-between gap-2 text-xs font-semibold text-white border-t border-white/15 pt-1.5">
            <Div className="flex items-start gap-2 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
              <Div className="min-w-0">
                <Span className="leading-snug block">{elderAddress}</Span>
                <Span className="text-[10px] font-mono text-white/80 block mt-0.5">
                  GPS: {elderLocation.latitude.toFixed(4)}°, {elderLocation.longitude.toFixed(4)}°
                </Span>
              </Div>
            </Div>
            <Button
              id="sos-open-gmaps-btn"
              onClick={() => {
                soundFx.playTap();
                const url = `https://www.google.com/maps/search/?api=1&query=${elderLocation.latitude},${elderLocation.longitude}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#1A2B4C] rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
              title="Open Google Maps"
            >
              <ExternalLink className="w-3 h-3 text-blue-600" />
              <Span>Google Maps</Span>
            </Button>
          </Div>

          {emergencyContactName && (
            <Div className="flex items-center gap-2 text-[11px] font-semibold text-white/90 border-t border-white/15 pt-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <Span>Contact: {emergencyContactName}</Span>
            </Div>
          )}
        </Div>

        {/* Action Buttons */}
        <Div className="w-full mt-3 flex flex-col gap-2">
          {/* Primary VoIP Call Button to Elder */}
          <Button
            id="volunteer-sos-call-button"
            onClick={handleCallElder}
            className="w-full min-h-[56px] bg-white hover:bg-slate-50 text-[#1A2B4C] rounded-2xl p-3 shadow-[4px_4px_0px_#1A2B4C] border-3 border-[#1A2B4C] flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Div className="w-9 h-9 rounded-xl bg-[#4CAF50] text-white flex items-center justify-center shrink-0 border border-[#1A2B4C]">
              <Phone className="w-4 h-4" />
            </Div>
            <Div className="flex flex-col text-left">
              <Span className="text-base font-black uppercase tracking-tight leading-tight text-[#1A2B4C]">
                {`${t.callText || 'Call'} ${elderName.split(' ')[0]}`}
              </Span>
              <Span className="text-[11px] font-mono font-black text-[#1A2B4C]/70">{elderPhone}</Span>
            </Div>
          </Button>

          {/* Quick Call Emergency Contact */}
          {emergencyContactPhone && (
            <Button
              id="volunteer-sos-call-contact-btn"
              onClick={handleCallEmergencyContact}
              className="w-full py-2 bg-black/20 hover:bg-black/30 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/30 transition cursor-pointer"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <Span>Call Emergency Contact ({emergencyContactPhone})</Span>
            </Button>
          )}
        </Div>
      </Main>

      {/* Footer Acknowledge Action */}
      <Footer className="pt-2 flex flex-col gap-1.5 shrink-0">
        <Button
          id="volunteer-sos-ack-button"
          onClick={handleAcknowledgeAndDismiss}
          className="w-full min-h-[48px] bg-[#1A2B4C] hover:bg-black active:bg-slate-950 text-white rounded-2xl px-4 py-2.5 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider border-2 border-white/40 shadow-[3px_3px_0px_#000] active:scale-[0.98] transition cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3] text-[#4CAF50]" />
          <Span>{t.acknowledgeBtnText} & {t.resolveBtnText}</Span>
        </Button>
        <P className="text-[10px] text-center font-bold text-white/90 uppercase tracking-wider">
          Acknowledging stops siren & confirms safety
        </P>
      </Footer>
    </Div>
  );
};
