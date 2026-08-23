import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
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
} from 'lucide-react-native';
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
    <View 
      id="volunteer-location-tracker-modal"
      
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <View >
        
        {/* Header */}
        <View >
          <View >
            <View >
              <Compass  style={{ animationDuration: '12s' }} />
            </View>
            <View>
              <View >
                <Text >
                  Elder Live Location GPS Tracker
                </Text>
                <Text  />
              </View>
              <Text >
                Tracking <Text >{pairData.elderName}</Text> in real-time
              </Text>
            </View>
          </View>

          <View >
            <TouchableOpacity
              id="refresh-elder-gps-btn"
              onClick={handleRefreshPing}
              disabled={isScanning}
              
              title="Ping GPS satellites for live refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4CAF50] ${isScanning ? 'animate-spin' : ''}`} />
              <Text >{isScanning ? 'Scanning...' : 'Ping GPS'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onClick={onClose}
              aria-label="Close modal"
              
            >
              <X  />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map View & Tracker Container */}
        <View >
          
          {/* Elder Quick-Switch Strip */}
          {monitoredElders.length > 1 && (
            <View >
              <Text >
                Elders:
              </Text>
              {monitoredElders.map((elder) => {
                const isSelected = elder.id === selectedElderId;
                return (
                  <TouchableOpacity
                    key={elder.id}
                    onClick={() => selectElder(elder.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-xs'
                        : 'bg-white text-[#1A2B4C] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Text>{elder.avatarEmoji || '👵'}</Text>
                    <Text>{elder.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          
          {/* Interactive Map Visualizer */}
          <View >
            
            {/* SVG Map Canvas */}
            <svg 
              
              viewBox="0 0 600 360"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}
            >
              {/* Background Roads & Terrains */}
              <rect width="600" height="360" fill={mapTheme === 'satellite' ? '#243224' : mapTheme === 'terrain' ? '#e2e8c0' : '#F2EFE9'} />
              
              {/* Park green zones */}
              <Textath d="M 50 40 Q 140 20 220 70 T 320 60 L 300 160 L 80 140 Z" fill={mapTheme === 'satellite' ? '#1c381c' : '#D1E7DD'} opacity="0.8" />
              <Textath d="M 380 200 Q 480 180 540 240 L 520 320 L 350 310 Z" fill={mapTheme === 'satellite' ? '#1c381c' : '#D1E7DD'} opacity="0.8" />
              
              {/* Waterway */}
              <Textath d="M 0 280 C 150 250, 300 330, 600 290" stroke="#B8D5E5" strokeWidth="24" fill="none" />
              
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
            <View >
              {isHome ? (
                <Text >
                  <ShieldCheck  />
                  Inside Home Safe Zone
                </Text>
              ) : isSafeZone ? (
                <Text >
                  <ShieldCheck  />
                  Safe Zone Area
                </Text>
              ) : (
                <Text >
                  <AlertTriangle  />
                  Outside Perimeter
                </Text>
              )}
            </View>

            {/* Map Controls (Zoom & Theme) */}
            <View >
              <View >
                <TouchableOpacity
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
                  
                  title="Zoom in"
                >
                  <Plus  />
                </TouchableOpacity>
                <TouchableOpacity
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  
                  title="Zoom out"
                >
                  <Minus  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onClick={() => setMapTheme(mapTheme === 'street' ? 'satellite' : mapTheme === 'satellite' ? 'terrain' : 'street')}
                
                title="Toggle Map Style"
              >
                <Layers  />
              </TouchableOpacity>
            </View>

            {/* Bottom Left GPS Coordinates Pill */}
            <View >
              {elderLocation.latitude.toFixed(4)}° N, {Math.abs(elderLocation.longitude).toFixed(4)}° W • ±{elderLocation.accuracyMeters}m
            </View>
          </View>

          {/* Current Address & Telemetry Status Card */}
          <View >
            <View >
              <View >
                <View >
                  <MapPin  />
                </View>
                <View>
                  <Text >
                    Current Verified Address
                  </Text>
                  <Text >
                    {elderLocation.address}
                  </Text>
                  <Text >
                    {elderLocation.landmark}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onClick={handleOpenGoogleMaps}
                
                title="Open in Google Maps"
              >
                <ExternalLink  />
                <Text >Open Maps</Text>
              </TouchableOpacity>
            </View>

            {/* Telemetry Row */}
            <View >
              <View >
                <Text >
                  <Battery  /> Battery
                </Text>
                <Text >
                  {elderLocation.batteryLevel}% Normal
                </Text>
              </View>

              <View >
                <Text >
                  <Clock  /> Last Ping
                </Text>
                <Text >
                  {elderLocation.lastUpdated}
                </Text>
              </View>

              <View >
                <Text >
                  <Navigation  /> Movement
                </Text>
                <Text >
                  {elderLocation.isMoving ? 'Walking' : 'Stationary'}
                </Text>
              </View>
            </View>
          </View>

          {/* Simulate Elder Movement Presets (For Testing / Evaluation) */}
          <View >
            <Text >
              <Sparkles  />
              Simulate Live Movement Locations (Tester Tool)
            </Text>
            <Text >
              Test how the tracker responds when {pairData.elderName} moves between destinations:
            </Text>

            <View >
              <TouchableOpacity
                onClick={() => simulateElderMovement('home')}
                className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center ${
                  isHome
                    ? 'bg-emerald-50 border-[#4CAF50] text-[#1A2B4C] shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-slate-100 border-[#1A2B4C]/40 text-[#1A2B4C]'
                }`}
              >
                <Text >🏠 Home Apt 4B</Text>
                <Text >Safe Home Zone</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onClick={() => simulateElderMovement('park')}
                className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center ${
                  isSafeZone && !isHome
                    ? 'bg-blue-50 border-blue-500 text-[#1A2B4C] shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-slate-100 border-[#1A2B4C]/40 text-[#1A2B4C]'
                }`}
              >
                <Text >🌲 Central Park</Text>
                <Text >Walking Trail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onClick={() => simulateElderMovement('pharmacy')}
                className={`min-h-[44px] p-2 rounded-xl text-left border-2 transition cursor-pointer flex flex-col justify-center ${
                  !isSafeZone && !isHome
                    ? 'bg-amber-50 border-amber-500 text-[#1A2B4C] shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-slate-100 border-[#1A2B4C]/40 text-[#1A2B4C]'
                }`}
              >
                <Text >💊 Pharmacy Clinic</Text>
                <Text >Outside Perimeter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location History Trail */}
          <View >
            <Text >
              <Clock  />
              Today&apos;s GPS Waypoint History ({elderLocation.history.length})
            </Text>

            <View >
              {elderLocation.history.slice(0, 4).map((pt, idx) => (
                <View key={pt.id} >
                  <Text >
                    {pt.time}
                  </Text>
                  <View >
                    <Text >{pt.address}</Text>
                    <Text >{pt.status}</Text>
                  </View>
                  {idx === 0 && (
                    <Text >
                      Current
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>

        </View>

        {/* Footer Actions */}
        <View >
          <TouchableOpacity
            onClick={() => {
              onClose();
              startCall({
                contactName: pairData.elderName,
                contactRole: 'elder',
                phoneNumber: elderProfile.phoneNumber || '(555) 018-9923',
                reason: 'checkin',
              });
            }}
            
          >
            <Text>Call {pairData.elderName.split(' ')[0]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onClick={onClose}
            
          >
            Close Tracker
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};
