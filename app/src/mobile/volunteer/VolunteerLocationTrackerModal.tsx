import { Div, Span, P, H1, H2, H3, H4, H5, H6, Label, Button, Img, Input, Main, Header, Footer, Section, Nav, Aside, Ul, Li, Form } from '../../rn-compat';
import React, { useState } from 'react';
import { Linking } from 'react-native';
import { 
  X, 
  MapPin, 
  Navigation, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Battery, 
  Compass, 
  Clock, 
  ExternalLink,
  Plus,
  Minus,
  Sparkles,
  Layers,
  Phone
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';
import { GoogleMapView } from '../components/GoogleMapView';

interface VolunteerLocationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerLocationTrackerModal: React.FC<VolunteerLocationTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    pairData,
    elderLocation,
    refreshElderLocationPing,
    simulateElderMovement,
    startCall,
    elderProfile,
    monitoredElders,
    selectedElderId,
    selectedElder,
    selectElder,
    darkMode,
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRefreshPing = () => {
    setIsScanning(true);
    refreshElderLocationPing();
    setTimeout(() => setIsScanning(false), 1200);
  };

  const handleOpenGoogleMaps = () => {
    soundFx.playTap();
    const url = `https://www.google.com/maps/search/?api=1&query=${elderLocation.latitude},${elderLocation.longitude}`;
    Linking.openURL(url);
  };

  const isHome = elderLocation.safeZoneStatus === 'inside_home';
  const isSafeZone = elderLocation.safeZoneStatus === 'safe_zone';

  return (
    <Div 
      id="volunteer-location-tracker-modal"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in"
      onClick={(e: any) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Div className="bg-[#FAF7F2] dark:bg-slate-900 w-full max-w-2xl rounded-3xl border-3 border-[#1A2B4C] dark:border-slate-700 shadow-[8px_8px_0px_#1A2B4C] max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <Div className="p-4 bg-white dark:bg-slate-800 border-b-2 border-[#1A2B4C] dark:border-slate-700 flex items-center justify-between gap-2">
          <Div className="flex items-center gap-3 min-w-0">
            <Div className="w-10 h-10 rounded-2xl bg-[#1A2B4C] text-white flex items-center justify-center font-black shadow-[2px_2px_0px_#1A2B4C] shrink-0">
              <Compass className="w-5 h-5 text-[#4CAF50] animate-spin" />
            </Div>
            <Div className="min-w-0">
              <Div className="flex items-center gap-2">
                <H2 className="text-base font-black text-[#1A2B4C] dark:text-white leading-tight truncate">
                  Elder Live Location GPS Tracker
                </H2>
                <Span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse shrink-0" />
              </Div>
              <P className="text-xs font-bold text-[#1A2B4C]/70 dark:text-slate-400 truncate">
                Tracking <Span className="font-black text-[#1A2B4C] dark:text-white">{pairData.elderName}</Span> in real-time
              </P>
            </Div>
          </Div>

          <Div className="flex items-center gap-2 shrink-0">
            <Button
              id="refresh-elder-gps-btn"
              onClick={handleRefreshPing}
              disabled={isScanning}
              className="px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-slate-700 hover:bg-emerald-50 text-[#1A2B4C] dark:text-white border-2 border-[#1A2B4C] dark:border-slate-600 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#1A2B4C] active:scale-95 transition cursor-pointer"
              title="Ping GPS satellites for live refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4CAF50] ${isScanning ? 'animate-spin' : ''}`} />
              <Span className="hidden sm:inline">{isScanning ? 'Scanning...' : 'Ping GPS'}</Span>
            </Button>

            <Button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-[#1A2B4C] dark:text-white border-2 border-[#1A2B4C] dark:border-slate-600 flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </Button>
          </Div>
        </Div>

        {/* Map View & Tracker Container */}
        <Div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          
          {/* Elder Quick-Switch Strip */}
          {monitoredElders.length > 1 && (
            <Div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <Span className="text-[11px] font-black uppercase text-slate-500 shrink-0 mr-1">
                Elders:
              </Span>
              {monitoredElders.map((elder) => {
                const isSelected = elder.id === selectedElderId;
                return (
                  <Button
                    key={elder.id}
                    onClick={() => selectElder(elder.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-[#1A2B4C] dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Span>{elder.avatarEmoji || '👵'}</Span>
                    <Span>{elder.name}</Span>
                  </Button>
                );
              })}
            </Div>
          )}
          
          {/* Interactive Google Map Visualizer */}
          <Div className="relative w-full h-[260px] sm:h-[320px]">
            <GoogleMapView
              elderLocation={elderLocation}
              elderName={pairData.elderName}
              avatarEmoji={selectedElder?.avatarEmoji || '👵'}
              zoomLevel={zoomLevel}
              darkMode={darkMode}
            />
          </Div>

          {/* Current Address & Telemetry Status Card */}
          <Div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2.5">
            <Div className="flex items-start justify-between gap-2">
              <Div className="flex items-start gap-2.5 min-w-0">
                <Div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </Div>
                <Div className="min-w-0">
                  <Span className="text-[10px] font-black uppercase tracking-wider text-[#1A2B4C]/60 dark:text-slate-400 block">
                    Current Verified Address
                  </Span>
                  <H3 className="text-sm font-black text-[#1A2B4C] dark:text-white leading-snug break-words">
                    {elderLocation.address}
                  </H3>
                  <P className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 break-words">
                    {elderLocation.landmark}
                  </P>
                </Div>
              </Div>

              <Button
                onClick={handleOpenGoogleMaps}
                className="px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-slate-600 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 active:scale-95 transition cursor-pointer"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <Span className="hidden sm:inline">Open Maps</Span>
              </Button>
            </Div>

            {/* Telemetry Row */}
            <Div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <Div className="bg-[#FAF7F2] dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
                <Span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                  <Battery className="w-3 h-3 text-emerald-600" /> Battery
                </Span>
                <Span className="text-xs font-black text-[#1A2B4C] dark:text-white mt-0.5">
                  {elderLocation.batteryLevel}% Normal
                </Span>
              </Div>

              <Div className="bg-[#FAF7F2] dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col min-w-0">
                <Span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" /> Last Ping
                </Span>
                <Span className="text-xs font-black text-[#1A2B4C] dark:text-white mt-0.5 truncate">
                  {elderLocation.lastUpdated}
                </Span>
              </Div>

              <Div className="bg-[#FAF7F2] dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col">
                <Span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-purple-600" /> Movement
                </Span>
                <Span className="text-xs font-black text-[#1A2B4C] dark:text-white mt-0.5">
                  {elderLocation.isMoving ? 'Walking' : 'Stationary'}
                </Span>
              </Div>
            </Div>
          </Div>

          {/* Simulate Elder Movement Presets (For Testing / Evaluation) */}
          <Div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
            <Span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
              Simulate Live Movement Locations (Tester Tool)
            </Span>
            <P className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Test how the tracker responds when {pairData.elderName} moves between destinations:
            </P>

            <Div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <Button
                onClick={() => simulateElderMovement('home')}
                className="min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center bg-[#FAF7F2] dark:bg-slate-900 hover:bg-slate-100 border-[#1A2B4C]/40 dark:border-slate-700 text-[#1A2B4C] dark:text-white active:scale-95"
              >
                <Span className="text-xs font-black truncate">🏠 Home (4B Elm St)</Span>
                <Span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Primary Residence</Span>
              </Button>

              <Button
                onClick={() => simulateElderMovement('park')}
                className="min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center bg-[#FAF7F2] dark:bg-slate-900 hover:bg-slate-100 border-[#1A2B4C]/40 dark:border-slate-700 text-[#1A2B4C] dark:text-white active:scale-95"
              >
                <Span className="text-xs font-black truncate">🌲 Central Park</Span>
                <Span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Walking Park</Span>
              </Button>

              <Button
                onClick={() => simulateElderMovement('pharmacy')}
                className="min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center bg-[#FAF7F2] dark:bg-slate-900 hover:bg-slate-100 border-[#1A2B4C]/40 dark:border-slate-700 text-[#1A2B4C] dark:text-white active:scale-95"
              >
                <Span className="text-xs font-black truncate">💊 Pharmacy Clinic</Span>
                <Span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Medical Center</Span>
              </Button>
            </Div>
          </Div>

          {/* Location History Trail */}
          <Div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
            <Span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1A2B4C] dark:text-slate-300" />
              Today&apos;s GPS Waypoint History ({elderLocation.history.length})
            </Span>

            <Div className="flex flex-col gap-2">
              {elderLocation.history.slice(0, 4).map((pt, idx) => (
                <Div key={pt.id} className="flex items-start gap-2.5 text-xs py-1 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <Span className="font-mono font-black text-[#1A2B4C] dark:text-white bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">
                    {pt.time}
                  </Span>
                  <Div className="flex flex-col flex-1 min-w-0">
                    <Span className="font-bold text-[#1A2B4C] dark:text-white truncate">{pt.address}</Span>
                    <Span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">{pt.status}</Span>
                  </Div>
                  {idx === 0 && (
                    <Span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded shrink-0">
                      Current
                    </Span>
                  )}
                </Div>
              ))}
            </Div>
          </Div>

        </Div>

        {/* Footer Actions */}
        <Div className="p-3.5 bg-white dark:bg-slate-800 border-t-2 border-[#1A2B4C] dark:border-slate-700 flex items-center justify-between gap-2">
          <Button
            onClick={() => {
              onClose();
              startCall({
                contactName: pairData.elderName,
                contactRole: 'elder',
                phoneNumber: elderProfile.phoneNumber || '(555) 018-9923',
                reason: 'checkin',
              });
            }}
            className="px-4 py-2.5 bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center gap-1.5 active:scale-95 transition cursor-pointer shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-[#4CAF50]" />
            <Span>Call {pairData.elderName.split(' ')[0]}</Span>
          </Button>

          <Button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#FAF7F2] dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A2B4C] dark:border-slate-600 shadow-[2px_2px_0px_#1A2B4C] cursor-pointer shrink-0"
          >
            Close Tracker
          </Button>
        </Div>

      </Div>
    </Div>
  );
};

