import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React from 'react';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  X, 
  Clock, 
  CheckCircle2,
  Battery,
  Navigation
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

interface VolunteerMissedCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledTime: string;
  alertId?: string;
  onOpenLocationTracker: () => void;
}

export const VolunteerMissedCheckinModal: React.FC<VolunteerMissedCheckinModalProps> = ({
  isOpen,
  onClose,
  scheduledTime,
  alertId,
  onOpenLocationTracker,
}) => {
  const {
    pairData,
    elderProfile,
    elderLocation,
    startCall,
    acknowledgeAlert,
    resolveAlert,
  } = useApp();

  if (!isOpen) return null;

  const handleCallElder = () => {
    soundFx.playTap();
    onClose();
    startCall({
      contactName: pairData.elderName || 'Eleanor Vance',
      contactRole: 'elder',
      phoneNumber: elderProfile.phoneNumber || '(555) 018-9923',
      reason: 'checkin',
    });
  };

  const handleCallEmergencyContact = () => {
    soundFx.playTap();
    onClose();
    startCall({
      contactName: elderProfile.emergencyContactName || 'Sarah Chen (Daughter)',
      contactRole: 'emergency',
      phoneNumber: elderProfile.emergencyContactPhone || '(555) 019-2834',
      reason: 'checkin',
    });
  };

  const handleTrackLocation = () => {
    soundFx.playTap();
    onClose();
    onOpenLocationTracker();
  };

  const handleResolveAndDismiss = () => {
    soundFx.playSuccessChime();
    if (alertId) {
      resolveAlert(alertId);
    }
    onClose();
  };

  return (
    <Div 
      id="volunteer-missed-checkin-alert-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in"
    >
      <Div className="bg-white w-full max-w-md rounded-3xl border-3 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Urgent Alert Header */}
        <Div className="bg-[#FF6B4A] text-white p-4.5 border-b-3 border-[#1A2B4C] flex items-center justify-between">
          <Div className="flex items-center gap-3">
            <Div className="w-12 h-12 rounded-2xl bg-white text-[#FF6B4A] flex items-center justify-center font-black shadow-[2px_2px_0px_#1A2B4C] animate-bounce">
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
            </Div>
            <Div>
              <Span className="text-[11px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded text-white inline-block mb-1">
                URGENT ESCALATION
              </Span>
              <H2 className="text-lg font-black leading-tight tracking-tight">
                Missed Check-In Alert!
              </H2>
            </Div>
          </Div>

          <Button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </Button>
        </Div>

        {/* Content Body */}
        <Div className="p-4.5 flex flex-col gap-3.5 bg-[#FAF7F2]">
          
          {/* Main Notice Box */}
          <Div className="p-3.5 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
            <Div className="flex items-center justify-between">
              <Div className="flex items-center gap-2">
                <Div className="w-8 h-8 rounded-full bg-[#1A2B4C] text-white flex items-center justify-center text-xs font-black">
                  {pairData.elderName.charAt(0)}
                </Div>
                <Span className="text-sm font-black text-[#1A2B4C]">
                  {pairData.elderName}
                </Span>
              </Div>
              <Span className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {scheduledTime} Check-In
              </Span>
            </Div>

            <P className="text-xs font-bold text-[#1A2B4C] leading-relaxed">
              <Span className="font-black text-red-600">{pairData.elderName} did not check in</Span> within the required <Span className="underline font-black">3-minute response window</Span> for the {scheduledTime} safety check.
            </P>
          </Div>

          {/* Elder Live Location & Battery Snapshot */}
          <Div className="p-3 bg-white rounded-2xl border border-[#1A2B4C] flex items-center justify-between shadow-xs">
            <Div className="flex items-center gap-2.5 min-w-0">
              <Div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </Div>
              <Div className="flex flex-col min-w-0">
                <Span className="text-[10px] font-black uppercase text-[#1A2B4C]/70">
                  Last Known GPS Location
                </Span>
                <Span className="text-xs font-black text-[#1A2B4C] truncate">
                  {elderLocation.address}
                </Span>
              </Div>
            </Div>

            <Div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg shrink-0 text-slate-700 text-xs font-black border border-slate-300">
              <Battery className="w-3.5 h-3.5 text-emerald-600" />
              <Span>{elderLocation.batteryLevel}%</Span>
            </Div>
          </Div>

          {/* Action Buttons Grid */}
          <Div className="flex flex-col gap-2 pt-1">
            
            {/* Primary Action 1: Call Elder Directly */}
            <Button
              id="missed-checkin-call-elder-btn"
              onClick={handleCallElder}
              className="w-full min-h-[48px] bg-[#1A2B4C] hover:bg-black text-white rounded-2xl border-2 border-black shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#4CAF50]" />
              <Span>Call {pairData.elderName.split(' ')[0]} Directly</Span>
            </Button>

            {/* Primary Action 2: Track Live GPS Location */}
            <Button
              id="missed-checkin-track-location-btn"
              onClick={handleTrackLocation}
              className="w-full min-h-[46px] bg-[#4CAF50] hover:bg-[#43a047] text-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-white" />
              <Span>Track Live GPS Location on Map</Span>
            </Button>

            {/* Primary Action 3: Call Emergency Family Contact */}
            <Button
              id="missed-checkin-call-emergency-btn"
              onClick={handleCallEmergencyContact}
              className="w-full min-h-[44px] bg-white hover:bg-rose-50 text-rose-800 rounded-2xl border-2 border-rose-300 shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <Span>Call Emergency Contact ({elderProfile.emergencyContactName?.split(' ')[0] || 'Family'})</Span>
            </Button>
          </Div>

          {/* Dismiss & Acknowledge */}
          <Div className="flex items-center justify-between pt-1 border-t border-[#1A2B4C]/20">
            <Span className="text-[11px] font-bold text-[#1A2B4C]/60">
              Check in confirmed in person?
            </Span>
            <Button
              onClick={handleResolveAndDismiss}
              className="text-xs font-black text-[#4CAF50] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <Span>Mark Resolved & Safe</Span>
            </Button>
          </Div>

        </Div>

      </Div>
    </Div>
  );
};
