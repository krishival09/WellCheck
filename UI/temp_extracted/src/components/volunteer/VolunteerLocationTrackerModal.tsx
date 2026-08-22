import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/audio';

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
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [mapTheme, setMapTheme] = useState<'street' | 'satellite' | 'terrain'>('street');

  if (!isOpen) return null;

  const handleRefreshPing = () => {
    setIsScanning(true);
    refreshElderLocationPing();
    setTimeout(() => setIsScanning(false), 1200);
  };

  const handleOpenGoogleMaps = () => {
    soundFx.playTap();
    const url = `https://www.google.com/maps/search/?api=1&query=${elderLocation.latitude},${elderLocation.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isHome = elderLocation.safeZoneStatus === 'inside_home';
  const isSafeZone = elderLocation.safeZoneStatus === 'safe_zone';

  return (
    <div 
      id="volunteer-location-tracker-modal"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border-3 border-[#1A2B4C] shadow-[8px_8px_0px_#1A2B4C] max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-white border-b-2 border-[#1A2B4C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A2B4C] text-white flex items-center justify-center font-black shadow-[2px_2px_0px_#1A2B4C]">
              <Compass className="w-5 h-5 text-[#4CAF50] animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-[#1A2B4C] leading-tight">
                  Elder Live Location GPS Tracker
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
              </div>
              <p className="text-xs font-bold text-[#1A2B4C]/70">
                Tracking <span className="font-black text-[#1A2B4C]">{pairData.elderName}</span> in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-elder-gps-btn"
              onClick={handleRefreshPing}
              disabled={isScanning}
              className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-emerald-50 text-[#1A2B4C] border-2 border-[#1A2B4C] rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#1A2B4C] active:scale-95 transition cursor-pointer"
              title="Ping GPS satellites for live refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4CAF50] ${isScanning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isScanning ? 'Scanning...' : 'Ping GPS'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A2B4C] border-2 border-[#1A2B4C] flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map View & Tracker Container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          
          {/* Elder Quick-Switch Strip */}
          {monitoredElders.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-black uppercase text-slate-500 shrink-0 mr-1">
                Elders:
              </span>
              {monitoredElders.map((elder) => {
                const isSelected = elder.id === selectedElderId;
                return (
                  <button
                    key={elder.id}
                    onClick={() => selectElder(elder.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-xs'
                        : 'bg-white text-[#1A2B4C] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{elder.avatarEmoji || '👵'}</span>
                    <span>{elder.name}</span>
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Interactive Map Visualizer */}
          <div className="relative w-full h-[260px] sm:h-[320px] bg-[#E5E3DF] rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] overflow-hidden">
            
            {/* SVG Map Canvas */}
            <svg 
              className="w-full h-full"
              viewBox="0 0 600 360"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}
            >
              {/* Background Roads & Terrains */}
              <rect width="600" height="360" fill={mapTheme === 'satellite' ? '#243224' : mapTheme === 'terrain' ? '#e2e8c0' : '#F2EFE9'} />
              
              {/* Park green zones */}
              <path d="M 50 40 Q 140 20 220 70 T 320 60 L 300 160 L 80 140 Z" fill={mapTheme === 'satellite' ? '#1c381c' : '#D1E7DD'} opacity="0.8" />
              <path d="M 380 200 Q 480 180 540 240 L 520 320 L 350 310 Z" fill={mapTheme === 'satellite' ? '#1c381c' : '#D1E7DD'} opacity="0.8" />
              
              {/* Waterway */}
              <path d="M 0 280 C 150 250, 300 330, 600 290" stroke="#B8D5E5" strokeWidth="24" fill="none" />
              
              {/* Secondary Streets */}
              <line x1="60" y1="0" x2="60" y2="360" stroke="#FFFFFF" strokeWidth="8" />
              <line x1="200" y1="0" x2="200" y2="360" stroke="#FFFFFF" strokeWidth="10" />
              <line x1="380" y1="0" x2="380" y2="360" stroke="#FFFFFF" strokeWidth="8" />
              <line x1="500" y1="0" x2="500" y2="360" stroke="#FFFFFF" strokeWidth="8" />
              
              <line x1="0" y1="80" x2="600" y2="80" stroke="#FFFFFF" strokeWidth="8" />
              <line x1="0" y1="180" x2="600" y2="180" stroke="#FFFFFF" strokeWidth="14" />
              <line x1="0" y1="260" x2="600" y2="260" stroke="#FFFFFF" strokeWidth="8" />

              {/* Main Arterial Road (Evergreen Blvd) */}
              <line x1="0" y1="180" x2="600" y2="180" stroke="#FFE082" strokeWidth="8" />

              {/* Street Names */}
              <text x="70" y="72" fontSize="10" fontWeight="bold" fill="#718096">Maple Avenue</text>
              <text x="210" y="172" fontSize="11" fontWeight="bold" fill="#2D3748">Evergreen Terrace Blvd</text>
              <text x="390" y="252" fontSize="10" fontWeight="bold" fill="#718096">4th Community Way</text>
              <text x="100" y="110" fontSize="11" fontWeight="bold" fill="#276749">🌲 Springfield Central Park</text>
              <text x="400" y="270" fontSize="11" fontWeight="bold" fill="#2B6CB0">🏥 St. Jude Care Center</text>

              {/* Geofence Safe Home Radius Circle (150m) */}
              <circle cx="280" cy="180" r="85" fill="#4CAF50" fillOpacity="0.15" stroke="#4CAF50" strokeWidth="2" strokeDasharray="6 4" />
              <text x="220" y="115" fontSize="10" fontWeight="bold" fill="#2E7D32">🏠 Safe Home Geofence (150m)</text>

              {/* Past Location Trail Points */}
              {elderLocation.history.slice(0, 3).map((pt, i) => {
                const cx = 280 + (i * 24) * (i % 2 === 0 ? 1 : -1);
                const cy = 180 + (i * 18);
                return (
                  <g key={pt.id} opacity={0.6 - i * 0.15}>
                    <circle cx={cx} cy={cy} r="4" fill="#1A2B4C" />
                    <line x1={cx} y1={cy} x2={280} y2={180} stroke="#1A2B4C" strokeWidth="1" strokeDasharray="3 3" />
                  </g>
                );
              })}

              {/* Active Radar Wave Pulse Animation on Elder Marker */}
              <circle cx="280" cy="180" r="32" fill="#4CAF50" fillOpacity="0.25">
                <animate attributeName="r" from="16" to="48" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Elder Pin Marker */}
              <g transform="translate(280, 180)">
                <circle cx="0" cy="0" r="16" fill="#1A2B4C" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx="0" cy="0" r="12" fill="#4CAF50" />
                <text x="0" y="4" fontSize="11" fontWeight="black" fill="#FFFFFF" textAnchor="middle">
                  {pairData.elderName.charAt(0)}
                </text>
              </g>

              {/* Scanning Beam if Refreshing */}
              {isScanning && (
                <line x1="0" y1="0" x2="600" y2="360" stroke="#4CAF50" strokeWidth="3" opacity="0.7">
                  <animate attributeName="y1" from="0" to="360" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="y2" from="0" to="360" dur="1s" repeatCount="indefinite" />
                </line>
              )}
            </svg>

            {/* Top Left Floating Status Pill */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#1A2B4C] shadow-sm flex items-center gap-2">
              {isHome ? (
                <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Inside Home Safe Zone
                </span>
              ) : isSafeZone ? (
                <span className="flex items-center gap-1.5 text-xs font-black text-blue-700">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Safe Zone Area
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-black text-amber-700">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Outside Perimeter
                </span>
              )}
            </div>

            {/* Map Controls (Zoom & Theme) */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
              <div className="bg-white rounded-xl border border-[#1A2B4C] shadow-sm overflow-hidden flex flex-col">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-[#1A2B4C] font-black cursor-pointer border-b border-slate-200"
                  title="Zoom in"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-[#1A2B4C] font-black cursor-pointer"
                  title="Zoom out"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setMapTheme(mapTheme === 'street' ? 'satellite' : mapTheme === 'satellite' ? 'terrain' : 'street')}
                className="w-8 h-8 bg-white rounded-xl border border-[#1A2B4C] shadow-sm flex items-center justify-center hover:bg-slate-100 text-[#1A2B4C] cursor-pointer"
                title="Toggle Map Style"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Left GPS Coordinates Pill */}
            <div className="absolute bottom-3 left-3 bg-[#1A2B4C]/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/20">
              {elderLocation.latitude.toFixed(4)}° N, {Math.abs(elderLocation.longitude).toFixed(4)}° W • ±{elderLocation.accuracyMeters}m
            </div>
          </div>

          {/* Current Address & Telemetry Status Card */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1A2B4C]/60 block">
                    Current Verified Address
                  </span>
                  <h3 className="text-sm font-black text-[#1A2B4C] leading-snug">
                    {elderLocation.address}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    {elderLocation.landmark}
                  </p>
                </div>
              </div>

              <button
                onClick={handleOpenGoogleMaps}
                className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-blue-50 text-blue-900 border border-blue-300 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 active:scale-95 transition cursor-pointer"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open Maps</span>
              </button>
            </div>

            {/* Telemetry Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <div className="bg-[#FAF7F2] p-2 rounded-xl border border-slate-200 flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Battery className="w-3 h-3 text-emerald-600" /> Battery
                </span>
                <span className="text-xs font-black text-[#1A2B4C] mt-0.5">
                  {elderLocation.batteryLevel}% Normal
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-2 rounded-xl border border-slate-200 flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" /> Last Ping
                </span>
                <span className="text-xs font-black text-[#1A2B4C] mt-0.5 truncate">
                  {elderLocation.lastUpdated}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-2 rounded-xl border border-slate-200 flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-purple-600" /> Movement
                </span>
                <span className="text-xs font-black text-[#1A2B4C] mt-0.5">
                  {elderLocation.isMoving ? 'Walking' : 'Stationary'}
                </span>
              </div>
            </div>
          </div>

          {/* Simulate Elder Movement Presets (For Testing / Evaluation) */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
              Simulate Live Movement Locations (Tester Tool)
            </span>
            <p className="text-[11px] font-bold text-slate-600">
              Test how the tracker responds when {pairData.elderName} moves between destinations:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => simulateElderMovement('home')}
                className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center ${
                  isHome
                    ? 'bg-emerald-50 border-[#4CAF50] text-[#1A2B4C] shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-slate-100 border-[#1A2B4C]/40 text-[#1A2B4C]'
                }`}
              >
                <span className="text-xs font-black">🏠 Home Apt 4B</span>
                <span className="text-[10px] font-bold text-emerald-700">Safe Home Zone</span>
              </button>

              <button
                onClick={() => simulateElderMovement('park')}
                className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center ${
                  isSafeZone && !isHome
                    ? 'bg-blue-50 border-blue-500 text-[#1A2B4C] shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-slate-100 border-[#1A2B4C]/40 text-[#1A2B4C]'
                }`}
              >
                <span className="text-xs font-black">🌲 Central Park</span>
                <span className="text-[10px] font-bold text-blue-700">Walking Trail</span>
              </button>

              <button
                onClick={() => simulateElderMovement('pharmacy')}
                className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center ${
                  !isSafeZone && !isHome
                    ? 'bg-amber-50 border-amber-500 text-[#1A2B4C] shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-slate-100 border-[#1A2B4C]/40 text-[#1A2B4C]'
                }`}
              >
                <span className="text-xs font-black">💊 Pharmacy Clinic</span>
                <span className="text-[10px] font-bold text-amber-700">Outside Perimeter</span>
              </button>
            </div>
          </div>

          {/* Location History Trail */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-[#1A2B4C] shadow-[3px_3px_0px_#1A2B4C] flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#1A2B4C] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1A2B4C]" />
              Today&apos;s GPS Waypoint History ({elderLocation.history.length})
            </span>

            <div className="flex flex-col gap-2">
              {elderLocation.history.slice(0, 4).map((pt, idx) => (
                <div key={pt.id} className="flex items-start gap-2.5 text-xs py-1 border-b border-slate-100 last:border-0">
                  <span className="font-mono font-black text-[#1A2B4C] bg-slate-100 px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">
                    {pt.time}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold text-[#1A2B4C] truncate">{pt.address}</span>
                    <span className="text-[10px] font-medium text-slate-500">{pt.status}</span>
                  </div>
                  {idx === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-white border-t-2 border-[#1A2B4C] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              startCall({
                contactName: pairData.elderName,
                contactRole: 'elder',
                phoneNumber: elderProfile.phoneNumber || '(555) 018-9923',
                reason: 'checkin',
              });
            }}
            className="px-4 py-2 bg-[#1A2B4C] hover:bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#1A2B4C] flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
          >
            <span>Call {pairData.elderName.split(' ')[0]}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FAF7F2] hover:bg-slate-100 text-[#1A2B4C] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] cursor-pointer"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
