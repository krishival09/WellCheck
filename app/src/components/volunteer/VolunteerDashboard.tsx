import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Bell, 
  Pill, 
  ShieldCheck, 
  Radio, 
  Languages, 
  KeyRound, 
  Camera, 
  Plus, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  MapPin,
  Compass,
  CalendarClock,
  Timer,
  Navigation,
  RefreshCw,
  Users,
  UserPlus,
  BatteryCharging
} from 'lucide-react-native';
import { VolunteerSosModal } from './VolunteerSosModal';
import { VolunteerPairingView } from './VolunteerPairingView';
import { VolunteerMedicineManagerModal } from './VolunteerMedicineManagerModal';
import { VolunteerCheckinScheduleModal } from './VolunteerCheckinScheduleModal';
import { VolunteerMissedCheckinModal } from './VolunteerMissedCheckinModal';
import { VolunteerLocationTrackerModal } from './VolunteerLocationTrackerModal';
import { VolunteerAddElderModal } from './VolunteerAddElderModal';
import { MedicinePhotoUploaderModal } from '../common/MedicinePhotoUploaderModal';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, speakText } from '../../utils/speech';
import { SupportedLanguage, MedicineReminderDoc } from '../../types';
import { soundFx } from '../../utils/audio';

export const VolunteerDashboard: React.FC = () => {
  const {
    activeSosAlert,
    alerts,
    medicines,
    lastCheckinTime,
    pairData,
    volunteerLanguage,
    setVolunteerLanguage,
    elderProfile,
    startCall,
    checkinSchedules,
    triggerCheckinPrompt,
    activeCheckinPrompt,
    activeMissedCheckinModal,
    closeMissedCheckinModal,
    elderLocation,
    refreshElderLocationPing,
    simulateMissedCheckinTimeout,
    monitoredElders,
    selectedElderId,
    selectedElder,
    selectElder,
  } = useApp();

  const recentAlerts = alerts || [];

  const [isSosTakeoverOpen, setIsSosTakeoverOpen] = useState(Boolean(activeSosAlert && activeSosAlert.status === 'active'));
  const [isPairingViewOpen, setIsPairingViewOpen] = useState(false);
  const [isMedManagerOpen, setIsMedManagerOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddElderModalOpen, setIsAddElderModalOpen] = useState(false);
  const [uploadTargetMed, setUploadTargetMed] = useState<MedicineReminderDoc | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isPingingGps, setIsPingingGps] = useState(false);

  // Automatically take over the Volunteer screen whenever an active SOS alert is received
  React.useEffect(() => {
    if (activeSosAlert && activeSosAlert.status === 'active') {
      setIsSosTakeoverOpen(true);
    }
  }, [activeSosAlert]);

  const t = TRANSLATIONS[volunteerLanguage] || TRANSLATIONS['en-US'];
  const currentVolLang = SUPPORTED_LANGUAGES.find(l => l.code === volunteerLanguage) || SUPPORTED_LANGUAGES[0];

  const elderPhone = elderProfile.phoneNumber
    ? `${elderProfile.phoneCountryCode || '+91'} ${elderProfile.phoneNumber}`
    : '(555) 018-9923';
  const elderName = activeSosAlert?.elderName || elderProfile.name || pairData.elderName || 'Eleanor Vance';

  // Handle direct call
  const handleDirectCallElder = () => {
    startCall({
      contactName: elderName,
      phoneNumber: elderPhone,
      contactRole: 'elder',
      reason: 'general'
    });
  };

  const handleRequestCheckin = () => {
    soundFx.playTap();
    triggerCheckinPrompt();
    setRequestSent(true);
    speakText(`Check-in request sent to ${elderName}`, volunteerLanguage);
    setTimeout(() => setRequestSent(false), 3500);
  };

  const handleQuickGpsPing = () => {
    setIsPingingGps(true);
    refreshElderLocationPing();
    setTimeout(() => setIsPingingGps(false), 1000);
  };

  const activeSlotsCount = checkinSchedules.filter(s => s.enabled).length;

  return (
    <View 
      id="volunteer-dashboard-screen" 
      
    >
      {/* Top Navbar */}
      <View >
        <View >
          <View >
            W
          </View>
          <View>
            <Text >
              {t.caregiverDashboardTitle || 'Caregiver Portal'}
            </Text>
            <Text >
              <Text  />
              Live Safety & Location Sync
            </Text>
          </View>
        </View>

        <View >
          {/* Track Location Button in Header */}
          <TouchableOpacity
            id="header-track-location-btn"
            onClick={() => {
              soundFx.playTap();
              setIsLocationModalOpen(true);
            }}
            
            title="Track Elder GPS Location"
          >
            <Compass  />
            <Text >GPS Live</Text>
          </TouchableOpacity>

          {/* Pairing Info Button */}
          <TouchableOpacity
            id="volunteer-open-pairing-btn"
            onClick={() => setIsPairingViewOpen(true)}
            title="Pairing Settings"
            
          >
            <KeyRound  />
            <Text>PIN: {pairData.pinCode}</Text>
          </TouchableOpacity>

          {/* Language Selector Dropdown */}
          <View >
            <TouchableOpacity
              id="volunteer-lang-selector-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Select Volunteer Language"
              
            >
              <Languages  />
              <Text>{currentVolLang?.flag || '🌐'}</Text>
            </TouchableOpacity>

            {showLangMenu && (
              <View 
                id="volunteer-lang-dropdown"
                
              >
                <View >
                  <Text>Select Language</Text>
                  <Text >10+ Regional</Text>
                </View>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onClick={() => {
                      setVolunteerLanguage(lang.code as SupportedLanguage);
                      setShowLangMenu(false);
                    }}
                    className={`min-h-[40px] w-full px-3 py-1.5 text-left rounded-lg flex items-center gap-2.5 font-bold text-xs transition cursor-pointer ${
                      volunteerLanguage === lang.code
                        ? 'bg-[#1A2B4C] text-white'
                        : 'hover:bg-slate-100 text-[#1A2B4C]'
                    }`}
                  >
                    <Text >{lang.flag}</Text>
                    <View >
                      <Text >{lang.nativeLabel}</Text>
                      <Text >{lang.label} {lang.region ? `(${lang.region})` : ''}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Persistent SOS Emergency Warning Banner if Active */}
      {activeSosAlert && (
        <View 
          id="volunteer-active-sos-banner"
          onClick={() => setIsSosTakeoverOpen(true)}
          
        >
          <View >
            <View >
              <AlertTriangle  />
            </View>
            <View>
              <Text >
                {t.sosTakeoverTitle || 'ACTIVE SOS EMERGENCY'}
              </Text>
              <Text >
                {activeSosAlert.elderName} Needs Help!
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            
          >
            Open Takeover
          </TouchableOpacity>
        </View>
      )}

      {/* Main Dashboard Content */}
      <View >
        
        {/* Multi-Elder Management Strip */}
        <View 
          id="volunteer-multi-elder-selector-strip"
          
        >
          <View >
            <View >
              <View >
                <Users  />
              </View>
              <View>
                <Text >
                  Monitored Elders ({monitoredElders.length})
                </Text>
                <Text >
                  Select elder to monitor location, medicines & schedules
                </Text>
              </View>
            </View>

            <TouchableOpacity
              id="volunteer-add-elder-btn"
              onClick={() => setIsAddElderModalOpen(true)}
              
            >
              <UserPlus  />
              <Text>Add Elder</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal list of elders */}
          <View >
            {monitoredElders.map((elder) => {
              const isSelected = elder.id === selectedElderId;
              return (
                <TouchableOpacity
                  key={elder.id}
                  id={`volunteer-select-elder-${elder.id}`}
                  onClick={() => selectElder(elder.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all shrink-0 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#1A2B4C] text-white border-[#1A2B4C] shadow-[2px_2px_0px_#FF6B4A]'
                      : 'bg-[#FAF7F2] text-[#1A2B4C] border-[#1A2B4C]/30 hover:border-[#1A2B4C] hover:bg-white'
                  }`}
                >
                  <Text >{elder.avatarEmoji || '👵'}</Text>
                  <View >
                    <View >
                      <Text >
                        {elder.name}
                      </Text>
                      <Text className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#4CAF50]' : 'bg-[#4CAF50]/70'}`} />
                    </View>
                    <Text className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-[#1A2B4C]/60'}`}>
                      {elder.relationship} • PIN: {elder.pinCode}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 1. Elder Profile & Health Status Card */}
        <View 
          id="volunteer-elder-status-card"
          
        >
          <View >
            <View >
              <View >
                {selectedElder?.avatarEmoji || selectedElder?.name?.charAt(0) || elderName.charAt(0)}
              </View>
              <View>
                <View >
                  <Text >
                    {selectedElder?.name || elderName}
                  </Text>
                  <Text  />
                </View>
                <Text >
                  {selectedElder?.relationship ? `${selectedElder.relationship} • ` : ''}Age {selectedElder?.age || 78} • PIN: {selectedElder?.pinCode || pairData.pinCode}
                </Text>
              </View>
            </View>
            <Text >
              {t.connectedLiveText || 'Live Paired'}
            </Text>
          </View>

          {/* Medical Conditions Badges if present */}
          {selectedElder?.medicalConditions && selectedElder.medicalConditions.length > 0 && (
            <View >
              {selectedElder.medicalConditions.map((cond, idx) => (
                <Text 
                  key={idx} 
                  
                >
                  {cond}
                </Text>
              ))}
            </View>
          )}

          {/* Quick Stats Grid */}
          <View >
            <View >
              <Text >
                <Clock  /> Last Check-In
              </Text>
              <Text >
                {lastCheckinTime}
              </Text>
            </View>
            <View >
              <Text >
                <Pill  /> Daily Medicines
              </Text>
              <Text >
                {medicines.filter(m => m.taken).length} of {medicines.length} Taken
              </Text>
            </View>
          </View>

          {/* Actions: Direct VoIP / Phone Call + Request Check-In */}
          <View >
            <TouchableOpacity
              id="volunteer-call-elder-btn"
              onClick={handleDirectCallElder}
              
            >
              <Phone  />
              <Text>{t.callText || 'Call'} {elderName.split(' ')[0]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              id="volunteer-request-checkin-btn"
              onClick={handleRequestCheckin}
              className={`min-h-[46px] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A2B4C] shadow-[2px_2px_0px_#1A2B4C] flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer ${
                requestSent 
                  ? 'bg-[#4CAF50] text-white border-[#4CAF50]' 
                  : 'bg-white hover:bg-slate-50 text-[#1A2B4C]'
              }`}
            >
              <Radio className={`w-4 h-4 ${requestSent ? 'animate-ping' : 'text-[#FF6B4A]'}`} />
              <Text>{requestSent ? 'Ping Transmitted!' : 'Ping Check-In'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Scheduled Check-Ins Manager (Feature for Volunteer to Set Multiple Times & 3-Min Alert) */}
        <View 
          id="volunteer-checkin-scheduler-card"
          
        >
          <View >
            <View >
              <View >
                <CalendarClock  />
              </View>
              <View>
                <Text >
                  Scheduled Check-In Times
                </Text>
                <Text >
                  {activeSlotsCount} daily times • 3-min missed check-in escalation
                </Text>
              </View>
            </View>

            <TouchableOpacity
              id="volunteer-manage-schedules-btn"
              onClick={() => {
                soundFx.playTap();
                setIsScheduleModalOpen(true);
              }}
              
            >
              <Plus  />
              <Text>Set Times</Text>
            </TouchableOpacity>
          </View>

          {/* Schedule Slots Chips */}
          <View >
            {checkinSchedules.slice(0, 3).map((slot) => (
              <View
                key={slot.id}
                
              >
                <View>
                  <Text >{slot.time}</Text>
                  <Text >{slot.label}</Text>
                </View>
                <Text className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  slot.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {slot.enabled ? 'Active' : 'Off'}
                </Text>
              </View>
            ))}
          </View>

          {/* 3-Min Escalation Indicator & Demo trigger */}
          <View >
            <View >
              <Timer  />
              <Text >
                Elder gets 3 mins to check in before pop-up escalation
              </Text>
            </View>

            <TouchableOpacity
              id="dashboard-simulate-missed-checkin-btn"
              onClick={() => {
                soundFx.playTap();
                simulateMissedCheckinTimeout();
              }}
              
              title="Test 3-Minute Missed Check-In Alert Pop-up"
            >
              Test Alert Pop-up
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Elder Live Location GPS Tracker Card */}
        <View 
          id="volunteer-location-tracking-card"
          
        >
          <View >
            <View >
              <View >
                <MapPin  />
              </View>
              <View>
                <Text >
                  Elder Location Tracking
                </Text>
                <Text >
                  Live GPS geofence & waypoint monitoring
                </Text>
              </View>
            </View>

            <TouchableOpacity
              id="volunteer-open-location-map-btn"
              onClick={() => {
                soundFx.playTap();
                setIsLocationModalOpen(true);
              }}
              
            >
              <Navigation  />
              <Text>Full Map</Text>
            </TouchableOpacity>
          </View>

          {/* Location Snapshot Card */}
          <View >
            <View >
              <View >
                <Compass  />
                <View>
                  <Text >
                    {elderLocation.address}
                  </Text>
                  <Text >
                    {elderLocation.landmark}
                  </Text>
                </View>
              </View>

              <Text className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                elderLocation.safeZoneStatus === 'inside_home'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : elderLocation.safeZoneStatus === 'safe_zone'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {elderLocation.safeZoneStatus === 'inside_home' ? 'Safe at Home' : elderLocation.safeZoneStatus === 'safe_zone' ? 'In Safe Zone' : 'Outside Area'}
              </Text>
            </View>

            <View >
              <Text>Updated: {elderLocation.lastUpdated}</Text>
              <Text>Accuracy: ±{elderLocation.accuracyMeters}m • Battery: {elderLocation.batteryLevel}%</Text>
              <TouchableOpacity
                onClick={handleQuickGpsPing}
                disabled={isPingingGps}
                
              >
                <RefreshCw className={`w-3 h-3 ${isPingingGps ? 'animate-spin' : ''}`} />
                <Text>{isPingingGps ? 'Pinging...' : 'Ping GPS'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. Medication Adherence & Photo Verification Section */}
        <View 
          id="volunteer-medicine-section"
          
        >
          <View >
            <View >
              <View >
                <Pill  />
              </View>
              <View>
                <Text >
                  Medication & Pill Verification
                </Text>
                <Text >
                  Live adherence & uploaded photos
                </Text>
              </View>
            </View>
            <TouchableOpacity
              id="volunteer-manage-meds-btn"
              onClick={() => setIsMedManagerOpen(true)}
              
            >
              <Camera  />
              <Text>Review & Photos</Text>
            </TouchableOpacity>
          </View>

          {/* Medicines Adherence List */}
          <View >
            {medicines.map((med) => (
              <View
                key={med.id}
                
              >
                <View >
                  {/* Photo thumbnail with upload trigger */}
                  <TouchableOpacity
                    type="button"
                    onClick={() => setUploadTargetMed(med)}
                    title="Click to change or upload pill photo"
                    
                  >
                    <Image
                      src={med.localPhotoRef}
                      alt={med.medicineName}
                      referrerPolicy="no-referrer"
                      
                    />
                    <View >
                      <Camera  />
                    </View>
                  </TouchableOpacity>

                  {/* Medicine Info */}
                  <View >
                    <View >
                      {med.medicineName}
                    </View>
                    <View >
                      {med.dosage} • <Text >{med.scheduledTime}</Text>
                    </View>
                    <View >
                      Photo: {med.photoUploadedBy === 'volunteer' ? '🧑‍⚕️ By You' : med.photoUploadedBy === 'elder' ? '👵 By Elder' : 'Verified'}
                    </View>
                  </View>
                </View>

                {/* Status Badge + Photo Upload Action */}
                <View >
                  <TouchableOpacity
                    type="button"
                    onClick={() => setUploadTargetMed(med)}
                    title="Upload photo for this pill"
                    
                  >
                    <Camera  />
                    <Text >Photo</Text>
                  </TouchableOpacity>

                  <Text
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-[#1A2B4C] ${
                      med.taken
                        ? 'bg-[#4CAF50] text-white'
                        : 'bg-[#FFB84D] text-[#1A2B4C]'
                    }`}
                  >
                    {med.taken ? '✓ Taken' : 'Pending'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 5. Safety Feed & Recent Alerts Log */}
        <View 
          id="volunteer-feed-section"
          
        >
          <View >
            <View >
              <View >
                <Bell  />
              </View>
              <Text >
                Activity Feed & Event History
              </Text>
            </View>
            <Text >
              {recentAlerts.length} Events
            </Text>
          </View>

          <View >
            {recentAlerts.length === 0 ? (
              <Text >No alerts logged yet.</Text>
            ) : (
              recentAlerts.map((alert) => (
                <View
                  key={alert.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                    alert.type === 'sos'
                      ? 'bg-red-50/80 border-red-300'
                      : alert.type === 'checkin_missed'
                      ? 'bg-rose-50 border-rose-300'
                      : alert.type === 'medicine_missed'
                      ? 'bg-amber-50/80 border-amber-300'
                      : 'bg-[#FAF7F2] border-slate-200'
                  }`}
                >
                  <View >
                    <Text >
                      {alert.type === 'sos' ? '🚨' : alert.type === 'checkin_missed' ? '⚠️' : alert.type === 'checkin_response' ? '✅' : '💊'}
                    </Text>
                    <View >
                      <View >
                        {alert.type === 'sos'
                          ? `SOS Alert: ${alert.elderName}`
                          : alert.type === 'checkin_missed'
                          ? `Missed Check-In Alert (${alert.elderName})`
                          : alert.type === 'checkin_response'
                          ? `Check-in OK from ${alert.elderName}`
                          : `Medication Adherence Event`}
                      </View>
                      <View >
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </View>
                    </View>
                  </View>

                  <Text className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    alert.status === 'active'
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {alert.status}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>

      {/* Volunteer SOS Takeover Modal */}
      {(isSosTakeoverOpen || Boolean(activeSosAlert && activeSosAlert.status === 'active')) && (
        <VolunteerSosModal
          onDismiss={() => setIsSosTakeoverOpen(false)}
        />
      )}

      {/* Volunteer Missed Check-In Escalation Pop-Up Modal (Triggers on 3-Min Timeout) */}
      {activeMissedCheckinModal && (
        <VolunteerMissedCheckinModal
          isOpen={activeMissedCheckinModal.isOpen}
          onClose={closeMissedCheckinModal}
          scheduledTime={activeMissedCheckinModal.scheduledTime}
          alertId={activeMissedCheckinModal.alertId}
          onOpenLocationTracker={() => setIsLocationModalOpen(true)}
        />
      )}

      {/* Volunteer Checkin Schedule Modal */}
      {isScheduleModalOpen && (
        <VolunteerCheckinScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}

      {/* Volunteer Location GPS Tracker Modal */}
      {isLocationModalOpen && (
        <VolunteerLocationTrackerModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
        />
      )}

      {/* Volunteer Pairing Modal */}
      {isPairingViewOpen && (
        <View >
          <View >
            <VolunteerPairingView onSuccess={() => setIsPairingViewOpen(false)} />
            <View >
              <TouchableOpacity
                onClick={() => setIsPairingViewOpen(false)}
                
              >
                Close
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Volunteer Add Elder Modal */}
      {isAddElderModalOpen && (
        <VolunteerAddElderModal
          isOpen={isAddElderModalOpen}
          onClose={() => setIsAddElderModalOpen(false)}
        />
      )}

      {/* Volunteer Medicine Manager Modal */}
      {isMedManagerOpen && (
        <VolunteerMedicineManagerModal
          isOpen={isMedManagerOpen}
          onClose={() => setIsMedManagerOpen(false)}
        />
      )}

      {/* Single Medicine Photo Uploader Modal */}
      {uploadTargetMed && (
        <MedicinePhotoUploaderModal
          medicine={uploadTargetMed}
          isOpen={true}
          uploaderRole="volunteer"
          onClose={() => setUploadTargetMed(null)}
          onPhotoSaved={() => setUploadTargetMed(null)}
        />
      )}
    </View>
  );
};
