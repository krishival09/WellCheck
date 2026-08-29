import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  AlertDoc, 
  CheckinDoc, 
  CheckinScheduleSlot, 
  ActiveCheckinPrompt, 
  ElderLocationData, 
  LocationHistoryPoint, 
  MedicineReminderDoc, 
  MonitoredElder, 
  PairDoc, 
  SupportedLanguage, 
  RoleMode, 
  UserProfile, 
  ElderScreen, 
  VolunteerScreen, 
  ActiveCallState, 
  CallReason 
} from '../types';
import { soundFx } from '../utils/audio';
import { speakText, TRANSLATIONS } from '../utils/speech';
import { 
  sendSOS as sendSosBackend, 
  acknowledgeAlert as acknowledgeAlertBackend, 
  resolveAlert as resolveAlertBackend,
  generatePairingPin as generatePinBackend,
  pairVolunteer as pairVolunteerBackend,
  markMedicineAsTaken as markMedBackend,
  createCheckinPromptRecord,
  respondToCheckin as respondCheckinBackend,
  listenToActiveAlerts,
  listenToPairingDoc
} from '../lib/wellcheck';

const DEFAULT_MED_PILL_PHOTO = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80';
const DEFAULT_MED_BOTTLE_PHOTO = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80';

const DEFAULT_ELDER_PROFILE: UserProfile = {
  name: 'Eleanor Vance',
  email: 'eleanor.vance@wellcheck.app',
  phoneCountryCode: '+91',
  phoneNumber: '9845012345',
  role: 'elder',
  preferredLanguage: 'hi-IN',
  emergencyContactName: 'Sarah Chen (Daughter)',
  emergencyContactPhone: '+91 98450 67890',
  isLoggedIn: true,
};

const DEFAULT_VOLUNTEER_PROFILE: UserProfile = {
  name: 'Sarah Chen',
  email: 'sarah.chen@wellcheck.org',
  phoneCountryCode: '+1',
  phoneNumber: '4155552671',
  role: 'volunteer',
  preferredLanguage: 'en-US',
  emergencyContactName: 'Central Dispatch',
  emergencyContactPhone: '911',
  isLoggedIn: true,
};

const INITIAL_MEDICINES: MedicineReminderDoc[] = [
  {
    id: 'med-1',
    elderId: 'elder-8841',
    medicineName: 'Lisinopril 10mg (Blood Pressure)',
    dosage: '1 tablet with a full glass of water',
    scheduledTime: '08:00 AM',
    instructions: 'Take in morning before breakfast. Stored in blue box.',
    localPhotoRef: DEFAULT_MED_BOTTLE_PHOTO,
    taken: true,
    takenAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'med-2',
    elderId: 'elder-8841',
    medicineName: 'Metformin 500mg (Blood Sugar)',
    dosage: '1 tablet with meal',
    scheduledTime: '01:00 PM',
    instructions: 'Take with lunch. Helps balance glucose.',
    localPhotoRef: DEFAULT_MED_PILL_PHOTO,
    taken: false,
    takenAt: null,
  },
  {
    id: 'med-3',
    elderId: 'elder-8841',
    medicineName: 'Calcium + Vitamin D3',
    dosage: '2 softgels after dinner',
    scheduledTime: '08:00 PM',
    instructions: 'Evening bone strength supplement.',
    localPhotoRef: DEFAULT_MED_BOTTLE_PHOTO,
    taken: false,
    takenAt: null,
  },
];

const INITIAL_ALERTS: AlertDoc[] = [
  {
    id: 'alert-1',
    elderId: 'elder-8841',
    elderName: 'Eleanor Vance',
    type: 'checkin_missed',
    status: 'acknowledged',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    acknowledgedAt: new Date(Date.now() - 17 * 3600 * 1000).toISOString(),
    notes: 'Called Eleanor — she was outside in the garden.',
  },
];

const INITIAL_CHECKIN_SCHEDULES: CheckinScheduleSlot[] = [
  { id: 'chk-slot-1', time: '09:00 AM', label: 'Morning Safety Check', enabled: true },
  { id: 'chk-slot-2', time: '03:00 PM', label: 'Afternoon Check-In', enabled: true },
  { id: 'chk-slot-3', time: '08:00 PM', label: 'Evening Night Check', enabled: true },
];

const INITIAL_ELDER_LOCATION: ElderLocationData = {
  latitude: 37.7749,
  longitude: -122.4194,
  address: 'Apartment 4B, 742 Evergreen Terrace, Springfield',
  landmark: 'Near Springfield Central Community Park',
  lastUpdated: 'Just now (GPS Live)',
  accuracyMeters: 4,
  batteryLevel: 88,
  isMoving: false,
  safeZoneStatus: 'inside_home',
  history: [
    { id: 'loc-1', time: '08:00 AM', address: 'Apartment 4B (Home)', status: 'Inside Safe Zone', lat: 37.7749, lng: -122.4194 },
    { id: 'loc-2', time: '10:30 AM', address: 'Green View Garden Walk', status: 'In Safe Zone (Walking)', lat: 37.7758, lng: -122.4182 },
    { id: 'loc-3', time: '01:15 PM', address: 'Community Care Center & Pharmacy', status: 'Safe Zone Perimeter', lat: 37.7765, lng: -122.4210 },
  ],
};

const INITIAL_MONITORED_ELDERS: MonitoredElder[] = [
  {
    id: 'elder-8841',
    name: 'Eleanor Vance',
    age: 78,
    relationship: 'Mother',
    phoneCountryCode: '+91',
    phoneNumber: '9845012345',
    preferredLanguage: 'hi-IN',
    pinCode: '7492',
    avatarEmoji: '👵',
    avatarColor: '#FFB84D',
    isPaired: true,
    pairedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    address: 'Apartment 4B, 742 Evergreen Terrace, Springfield',
    landmark: 'Near Springfield Central Community Park',
    medicalConditions: ['Hypertension', 'Type 2 Diabetes', 'Osteoporosis'],
    emergencyContactName: 'Sarah Chen (Daughter)',
    emergencyContactPhone: '+1 (415) 555-2671',
    lastCheckinTime: '2 hours ago',
    status: 'safe',
    batteryLevel: 88,
    location: INITIAL_ELDER_LOCATION,
    checkinSchedules: INITIAL_CHECKIN_SCHEDULES,
    medicines: INITIAL_MEDICINES,
  },
];

interface AppContextType {
  currentUser: UserProfile;
  elderProfile: UserProfile;
  volunteerProfile: UserProfile;
  updateElderProfile: (updates: Partial<UserProfile>) => void;
  updateVolunteerProfile: (updates: Partial<UserProfile>) => void;
  loginUser: (profile: Omit<UserProfile, 'isLoggedIn'>) => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  monitoredElders: MonitoredElder[];
  selectedElderId: string;
  selectedElder: MonitoredElder;
  selectElder: (id: string) => void;
  addElderByPin: (pin: string, name?: string, relationship?: string) => { success: boolean; elder?: MonitoredElder; message: string };
  addNewElder: (elderData: Partial<MonitoredElder>) => string;
  removeElder: (id: string) => void;
  updateElderData: (elderId: string, updates: Partial<MonitoredElder>) => void;

  activeRole: RoleMode;
  setActiveRole: (role: RoleMode) => void;
  elderScreen: ElderScreen;
  setElderScreen: (screen: ElderScreen) => void;
  volunteerScreen: VolunteerScreen;
  setVolunteerScreen: (screen: VolunteerScreen) => void;
  selectedMedicineId: string | null;
  setSelectedMedicineId: (id: string | null) => void;

  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  volunteerLanguage: SupportedLanguage;
  setVolunteerLanguage: (lang: SupportedLanguage) => void;
  voicePromptEnabled: boolean;
  setVoicePromptEnabled: (enabled: boolean) => void;

  pairData: PairDoc;
  generateNewPin: () => void;
  pairVolunteerWithPin: (pin: string) => Promise<boolean>;

  sosCountdown: number;
  isSosCountingDown: boolean;
  startSosCountdown: () => void;
  cancelSosCountdown: () => void;
  triggerImmediateSos: () => Promise<void>;
  activeSosAlert: AlertDoc | null;

  alerts: AlertDoc[];
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  triggerMissedCheckinAlert: () => void;
  triggerMissedMedicineAlert: () => void;

  checkinSchedules: CheckinScheduleSlot[];
  addCheckinScheduleTime: (time: string, label?: string) => void;
  updateCheckinScheduleTime: (id: string, updates: Partial<CheckinScheduleSlot>) => void;
  deleteCheckinScheduleTime: (id: string) => void;
  toggleCheckinScheduleTime: (id: string) => void;
  activeCheckinPrompt: ActiveCheckinPrompt | null;
  triggerCheckinPrompt: (scheduledTime?: string) => void;
  dismissCheckinPrompt: () => void;
  simulateMissedCheckinTimeout: () => void;
  activeMissedCheckinModal: { isOpen: boolean; scheduledTime: string; alertId?: string } | null;
  closeMissedCheckinModal: () => void;

  elderLocation: ElderLocationData;
  updateElderLocation: (updates: Partial<ElderLocationData>) => void;
  refreshElderLocationPing: () => void;
  simulateElderMovement: (preset: 'home' | 'park' | 'pharmacy') => void;

  medicines: MedicineReminderDoc[];
  markMedicineTaken: (id: string) => Promise<void>;
  updateMedicinePhoto: (id: string, photoUrl: string, uploaderRole?: RoleMode) => void;
  addMedicine: (medicine: Omit<MedicineReminderDoc, 'id'>) => void;
  editMedicine: (id: string, updates: Partial<MedicineReminderDoc>) => void;
  deleteMedicine: (id: string) => void;
  resetMedicineStatus: (id: string) => void;

  checkins: CheckinDoc[];
  lastCheckinTime: string;
  respondCheckinOk: () => Promise<void>;
  requestCheckinFromVolunteer: () => void;

  activeCall: ActiveCallState;
  startCall: (options?: { contactName?: string; contactRole?: 'caregiver' | 'elder' | 'emergency'; phoneNumber?: string; reason?: CallReason }) => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallSpeaker: () => void;
  triggerCallDialogue: (speakerText: string) => void;

  isSimulationEmpty: boolean;
  setIsSimulationEmpty: (empty: boolean) => void;
  isSimulationLoading: boolean;
  setIsSimulationLoading: (loading: boolean) => void;
  isNetworkErrorSimulated: boolean;
  setIsNetworkErrorSimulated: (error: boolean) => void;
  retryNetworkSync: () => void;
  resetAllDemoData: () => void;
}

const DEFAULT_CALL_STATE: ActiveCallState = {
  isOpen: false,
  contactName: 'Sarah Chen (Daughter)',
  contactRole: 'caregiver',
  phoneNumber: '+91 98450 67890',
  status: 'dialing',
  reason: 'general',
  connectedDurationSec: 0,
  isMuted: false,
  isSpeakerOn: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elderProfile, setElderProfile] = useState<UserProfile>(DEFAULT_ELDER_PROFILE);
  const [volunteerProfile, setVolunteerProfile] = useState<UserProfile>(DEFAULT_VOLUNTEER_PROFILE);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [activeRole, setActiveRole] = useState<RoleMode>('elder');
  const [elderScreen, setElderScreen] = useState<ElderScreen>('home');
  const [volunteerScreen, setVolunteerScreen] = useState<VolunteerScreen>('dashboard');
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>('med-2');

  const [language, setLanguage] = useState<SupportedLanguage>('hi-IN');
  const [volunteerLanguage, setVolunteerLanguage] = useState<SupportedLanguage>('en-US');
  const [voicePromptEnabled, setVoicePromptEnabled] = useState<boolean>(true);

  const [pairData, setPairData] = useState<PairDoc>({
    pinCode: '7492',
    elderId: 'elder-8841',
    elderName: 'Eleanor Vance',
    // Derived from the default volunteer profile email — consistent with Bug 2+3 fix
    volunteerId: 'vol-sarah-chen-wellcheck-org',
    volunteerName: 'Sarah Chen (Daughter)',
    createdAt: new Date().toISOString(),
    isPaired: true,
  });

  const currentUser = activeRole === 'elder' ? elderProfile : volunteerProfile;

  const [monitoredElders, setMonitoredElders] = useState<MonitoredElder[]>(INITIAL_MONITORED_ELDERS);
  const [selectedElderId, setSelectedElderId] = useState<string>('elder-8841');

  const selectedElder: MonitoredElder =
    monitoredElders.find((e) => e.id === selectedElderId) || monitoredElders[0] || INITIAL_MONITORED_ELDERS[0];

  const [sosCountdown, setSosCountdown] = useState<number>(10);
  const [isSosCountingDown, setIsSosCountingDown] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertDoc[]>(INITIAL_ALERTS);
  const [medicines, setMedicines] = useState<MedicineReminderDoc[]>(INITIAL_MEDICINES);
  const [checkins, setCheckins] = useState<CheckinDoc[]>([
    {
      id: 'chk-1',
      elderId: 'elder-8841',
      promptedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      responded: true,
      respondedAt: new Date(Date.now() - 2 * 3600 * 1000 + 45000).toISOString(),
    },
  ]);
  const [lastCheckinTime, setLastCheckinTime] = useState<string>('2 hours ago');
  const [checkinSchedules, setCheckinSchedules] = useState<CheckinScheduleSlot[]>(INITIAL_CHECKIN_SCHEDULES);
  const [activeCheckinPrompt, setActiveCheckinPrompt] = useState<ActiveCheckinPrompt | null>(null);
  const [activeMissedCheckinModal, setActiveMissedCheckinModal] = useState<{
    isOpen: boolean;
    scheduledTime: string;
    alertId?: string;
  } | null>(null);
  const [elderLocation, setElderLocation] = useState<ElderLocationData>(INITIAL_ELDER_LOCATION);

  const [activeCall, setActiveCall] = useState<ActiveCallState>(DEFAULT_CALL_STATE);
  const [isSimulationEmpty, setIsSimulationEmpty] = useState<boolean>(false);
  const [isSimulationLoading, setIsSimulationLoading] = useState<boolean>(false);
  const [isNetworkErrorSimulated, setIsNetworkErrorSimulated] = useState<boolean>(false);

  // Firestore Realtime Listener for Alerts
  useEffect(() => {
    try {
      const unsubscribe = listenToActiveAlerts(pairData.elderId, (liveAlerts) => {
        if (liveAlerts && liveAlerts.length > 0) {
          setAlerts((prev) => {
            const merged = [...liveAlerts.map(a => ({
              id: a.id || `alert-${Date.now()}`,
              elderId: a.elderId,
              elderName: pairData.elderName,
              type: a.type,
              status: a.status,
              createdAt: a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : new Date().toISOString(),
              acknowledgedAt: a.acknowledgedAt?.toDate ? a.acknowledgedAt.toDate().toISOString() : null,
            })), ...prev.filter(p => !liveAlerts.some(la => la.id === p.id))];
            return merged;
          });
        }
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch {
      // Offline fallback
    }
  }, [pairData.elderId, pairData.elderName]);

  // Firestore Realtime Listener for PIN Pairing
  useEffect(() => {
    if (!pairData.pinCode) return;
    try {
      const unsub = listenToPairingDoc(pairData.pinCode, (docData) => {
        if (docData && docData.volunteerId) {
          setPairData((prev) => {
            if (!prev.isPaired) {
              soundFx.playSuccessChime();
              speakText('Device successfully paired with your Caregiver.', language);
            }
            return {
              ...prev,
              isPaired: true,
              // Use the real volunteerId from Firestore — no hardcoded fallback
              volunteerId: docData.volunteerId,
              // volunteerName comes from existing local profile if already set,
              // otherwise keep whatever was stored in the pair doc
              volunteerName: prev.volunteerName || volunteerProfile.name || 'Caregiver',
            };
          });
        }
      });
      return () => {
        if (typeof unsub === 'function') unsub();
      };
    } catch (err) {
      console.warn('Pairing doc listener notice:', err);
    }
  }, [pairData.pinCode, language, volunteerProfile.name]);

  // Call timer interval
  useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;
    if (activeCall.isOpen && activeCall.status === 'connected') {
      callTimer = setInterval(() => {
        setActiveCall((prev) => ({
          ...prev,
          connectedDurationSec: prev.connectedDurationSec + 1,
        }));
      }, 1000);
    }
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [activeCall.isOpen, activeCall.status]);

  const activeSosAlert = alerts.find((a) => a.type === 'sos' && a.status === 'active') || null;

  const fireSosAlert = useCallback(async () => {
    soundFx.playSosAlarm();
    const alertId = `alert-sos-${Date.now()}`;
    const newAlert: AlertDoc = {
      id: alertId,
      elderId: pairData.elderId,
      elderName: pairData.elderName,
      type: 'sos',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setElderScreen('sos_sent');

    if (voicePromptEnabled) {
      speakText(TRANSLATIONS[language]?.sosSent || TRANSLATIONS['en-US'].sosSent, language);
    }

    try {
      await sendSosBackend(pairData.elderId, { lat: elderLocation.latitude, lng: elderLocation.longitude });
    } catch {
      // Handled locally
    }
  }, [pairData.elderId, pairData.elderName, language, voicePromptEnabled, elderLocation.latitude, elderLocation.longitude]);

  // SOS Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSosCountingDown) {
      if (sosCountdown > 0) {
        timer = setTimeout(() => {
          soundFx.playCountdownTick(sosCountdown <= 3);
          setSosCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        setIsSosCountingDown(false);
        fireSosAlert();
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSosCountingDown, sosCountdown, fireSosAlert]);

  const startSosCountdown = useCallback(() => {
    soundFx.playCountdownTick();
    setSosCountdown(10);
    setIsSosCountingDown(true);
    setElderScreen('sos_countdown');
    if (voicePromptEnabled) {
      speakText(TRANSLATIONS[language]?.sosPrompt || TRANSLATIONS['en-US'].sosPrompt, language);
    }
  }, [language, voicePromptEnabled]);

  const cancelSosCountdown = useCallback(() => {
    soundFx.playTap();
    setIsSosCountingDown(false);
    setSosCountdown(10);
    setElderScreen('home');
  }, []);

  const triggerImmediateSos = useCallback(async () => {
    setIsSosCountingDown(false);
    await fireSosAlert();
  }, [fireSosAlert]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    soundFx.stopSosSirenLoop();
    soundFx.playTap();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'acknowledged', acknowledgedAt: new Date().toISOString() } : a
      )
    );
    try {
      await acknowledgeAlertBackend(alertId);
    } catch {}
  }, []);

  const resolveAlert = useCallback(async (alertId: string) => {
    soundFx.stopSosSirenLoop();
    soundFx.playTap();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, status: 'resolved', resolvedAt: new Date().toISOString() } : a
      )
    );
    try {
      await resolveAlertBackend(alertId);
    } catch {}
  }, []);

  const triggerMissedCheckinAlert = useCallback(() => {
    soundFx.playTap();
    const newAlert: AlertDoc = {
      id: `alert-chk-${Date.now()}`,
      elderId: pairData.elderId,
      elderName: pairData.elderName,
      type: 'checkin_missed',
      status: 'active',
      createdAt: new Date().toISOString(),
      notes: 'Scheduled safety check-in was missed.',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, [pairData.elderId, pairData.elderName]);

  const triggerMissedMedicineAlert = useCallback(() => {
    soundFx.playTap();
    const newAlert: AlertDoc = {
      id: `alert-med-${Date.now()}`,
      elderId: pairData.elderId,
      elderName: pairData.elderName,
      type: 'medicine_missed',
      status: 'active',
      createdAt: new Date().toISOString(),
      notes: 'Scheduled medication not confirmed after 45 mins.',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, [pairData.elderId, pairData.elderName]);

  const triggerCheckinPrompt = useCallback((scheduledTime?: string) => {
    soundFx.playTap();
    const timeLabel = scheduledTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newPrompt: ActiveCheckinPrompt = {
      id: `prompt-${Date.now()}`,
      scheduledTime: timeLabel,
      promptedAt: new Date().toISOString(),
      expiresAtTimestamp: Date.now() + 3 * 60 * 1000,
      status: 'pending',
    };
    setActiveCheckinPrompt(newPrompt);
    if (voicePromptEnabled) {
      speakText(`Time to check in! Please tap I'm OK to let your caregiver know you are safe.`, language);
    }
    try {
      createCheckinPromptRecord(pairData.elderId);
    } catch {}
  }, [language, voicePromptEnabled, pairData.elderId]);

  const dismissCheckinPrompt = useCallback(() => {
    soundFx.playTap();
    setActiveCheckinPrompt(null);
  }, []);

  const simulateMissedCheckinTimeout = useCallback(() => {
    soundFx.playSosAlarm();
    const alertId = `alert-chk-missed-${Date.now()}`;
    const targetTime = activeCheckinPrompt?.scheduledTime || '09:00 AM';
    const newAlert: AlertDoc = {
      id: alertId,
      elderId: pairData.elderId,
      elderName: pairData.elderName,
      type: 'checkin_missed',
      status: 'active',
      createdAt: new Date().toISOString(),
      notes: `Missed Check-In Alert: ${pairData.elderName} did not respond within 3 minutes of the ${targetTime} check-in prompt.`,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setActiveCheckinPrompt((prev) => (prev ? { ...prev, status: 'missed' } : null));
    setActiveMissedCheckinModal({
      isOpen: true,
      scheduledTime: targetTime,
      alertId,
    });
    speakText(
      `Emergency notification: ${pairData.elderName} has missed the 3-minute check-in timeout.`,
      volunteerLanguage
    );
  }, [activeCheckinPrompt, pairData.elderId, pairData.elderName, volunteerLanguage]);

  const closeMissedCheckinModal = useCallback(() => {
    soundFx.playTap();
    setActiveMissedCheckinModal(null);
  }, []);

  const respondCheckinOk = useCallback(async () => {
    soundFx.playSuccessChime();
    const now = new Date();
    const newCheckin: CheckinDoc = {
      id: `chk-${Date.now()}`,
      elderId: pairData.elderId,
      promptedAt: now.toISOString(),
      responded: true,
      respondedAt: now.toISOString(),
    };
    setCheckins((prev) => [newCheckin, ...prev]);
    setLastCheckinTime('Just now');
    setActiveCheckinPrompt(null);
    setActiveMissedCheckinModal(null);

    setAlerts((prev) =>
      prev.map((a) =>
        a.type === 'checkin_missed' && a.status === 'active'
          ? { ...a, status: 'resolved', resolvedAt: now.toISOString() }
          : a
      )
    );

    if (voicePromptEnabled) {
      speakText(TRANSLATIONS[language]?.checkinConfirmed || TRANSLATIONS['en-US'].checkinConfirmed, language);
    }
  }, [pairData.elderId, voicePromptEnabled, language]);

  const requestCheckinFromVolunteer = useCallback(() => {
    soundFx.playTap();
    triggerCheckinPrompt();
  }, [triggerCheckinPrompt]);

  const markMedicineTaken = useCallback(async (id: string) => {
    soundFx.playSuccessChime();
    const now = new Date().toISOString();
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, taken: true, takenAt: now } : m)));

    setAlerts((prev) =>
      prev.map((a) =>
        a.type === 'medicine_missed' && a.status === 'active'
          ? { ...a, status: 'resolved', resolvedAt: now }
          : a
      )
    );

    if (voicePromptEnabled) {
      speakText(TRANSLATIONS[language]?.medicineTaken || TRANSLATIONS['en-US'].medicineTaken, language);
    }

    try {
      await markMedBackend(id);
    } catch {}
  }, [voicePromptEnabled, language]);

  const updateMedicinePhoto = useCallback((id: string, photoUrl: string, uploaderRole: RoleMode = 'elder') => {
    soundFx.playSuccessChime();
    const now = new Date().toISOString();
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, localPhotoRef: photoUrl, photoUploadedBy: uploaderRole, photoUploadedAt: now }
          : m
      )
    );
  }, []);

  const addMedicine = useCallback((medicineData: Omit<MedicineReminderDoc, 'id'>) => {
    soundFx.playSuccessChime();
    const newMed: MedicineReminderDoc = {
      ...medicineData,
      id: `med-${Date.now()}`,
    };
    setMedicines((prev) => [...prev, newMed]);
  }, []);

  const editMedicine = useCallback((id: string, updates: Partial<MedicineReminderDoc>) => {
    soundFx.playTap();
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMedicine = useCallback((id: string) => {
    soundFx.playTap();
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const resetMedicineStatus = useCallback((id: string) => {
    soundFx.playTap();
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, taken: false, takenAt: null } : m)));
  }, []);

  const selectElder = useCallback((id: string) => {
    soundFx.playTap();
    setSelectedElderId(id);
    const target = monitoredElders.find((e) => e.id === id);
    if (target) {
      setMedicines(target.medicines);
      setCheckinSchedules(target.checkinSchedules);
      setElderLocation(target.location);
      setPairData((prev) => ({
        ...prev,
        elderId: target.id,
        elderName: target.name,
        pinCode: target.pinCode,
      }));
    }
  }, [monitoredElders]);

  const updateElderData = useCallback((elderId: string, updates: Partial<MonitoredElder>) => {
    setMonitoredElders((prev) => prev.map((e) => (e.id === elderId ? { ...e, ...updates } : e)));
  }, []);

  const addElderByPin = useCallback((pin: string, customName?: string, relationship: string = 'Mother') => {
    soundFx.playSuccessChime();
    const trimmedPin = pin.trim();
    const existing = monitoredElders.find((e) => e.pinCode === trimmedPin);
    if (existing) {
      selectElder(existing.id);
      return { success: true, elder: existing, message: `Connected to ${existing.name}` };
    }
    const newId = `elder-${Date.now().toString().slice(-4)}`;
    const elderName = customName || `Elder (${trimmedPin})`;
    const newElder: MonitoredElder = {
      id: newId,
      name: elderName,
      age: 78,
      relationship,
      phoneCountryCode: '+1',
      phoneNumber: '4155550192',
      preferredLanguage: 'en-US',
      pinCode: trimmedPin,
      avatarEmoji: '🧓',
      avatarColor: '#2196F3',
      isPaired: true,
      pairedAt: new Date().toISOString(),
      address: 'Apartment 2B, 108 Oakwood Lane',
      landmark: 'Near Community Health Clinic',
      medicalConditions: ['General Safety Monitoring'],
      emergencyContactName: volunteerProfile.name || 'Sarah Chen',
      emergencyContactPhone: volunteerProfile.phoneNumber || '(555) 019-2834',
      lastCheckinTime: 'Just paired',
      status: 'safe',
      batteryLevel: 92,
      location: INITIAL_ELDER_LOCATION,
      checkinSchedules: INITIAL_CHECKIN_SCHEDULES,
      medicines: INITIAL_MEDICINES,
    };
    setMonitoredElders((prev) => [newElder, ...prev]);
    selectElder(newId);
    return { success: true, elder: newElder, message: `Successfully connected ${elderName}.` };
  }, [monitoredElders, selectElder, volunteerProfile.name, volunteerProfile.phoneNumber]);

  const addNewElder = useCallback((elderData: Partial<MonitoredElder>) => {
    soundFx.playSuccessChime();
    const newId = `elder-${Date.now().toString().slice(-4)}`;
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newElder: MonitoredElder = {
      id: newId,
      name: elderData.name || 'New Elder',
      age: elderData.age || 75,
      relationship: elderData.relationship || 'Mother',
      phoneCountryCode: elderData.phoneCountryCode || '+1',
      phoneNumber: elderData.phoneNumber || '4155550192',
      preferredLanguage: elderData.preferredLanguage || 'en-US',
      pinCode: newPin,
      avatarEmoji: '🧓',
      avatarColor: '#4CAF50',
      isPaired: true,
      pairedAt: new Date().toISOString(),
      address: elderData.address || '108 Oakwood Lane, Apt 2B',
      landmark: elderData.landmark || 'Near Community Park',
      medicalConditions: elderData.medicalConditions || ['General Monitoring'],
      emergencyContactName: elderData.emergencyContactName || volunteerProfile.name || 'Sarah Chen',
      emergencyContactPhone: elderData.emergencyContactPhone || volunteerProfile.phoneNumber || '(555) 019-2834',
      lastCheckinTime: 'Just added',
      status: 'safe',
      batteryLevel: 95,
      location: INITIAL_ELDER_LOCATION,
      checkinSchedules: INITIAL_CHECKIN_SCHEDULES,
      medicines: INITIAL_MEDICINES,
    };
    setMonitoredElders((prev) => [newElder, ...prev]);
    return newId;
  }, [volunteerProfile.name, volunteerProfile.phoneNumber]);

  const removeElder = useCallback((id: string) => {
    soundFx.playTap();
    setMonitoredElders((prev) => {
      const next = prev.filter((e) => e.id !== id);
      if (next.length > 0 && selectedElderId === id) {
        selectElder(next[0].id);
      }
      return next;
    });
  }, [selectedElderId, selectElder]);

  const generateNewPin = useCallback(async () => {
    soundFx.playSuccessChime();
    // Bug 1 fix: backend is the single source of truth for the PIN.
    // We use the PIN it writes to Firestore as our local state too.
    let newPin = Math.floor(1000 + Math.random() * 9000).toString(); // local fallback
    try {
      const backendPin = await generatePinBackend(pairData.elderId);
      if (backendPin) newPin = backendPin;
    } catch (err) {
      console.warn('generatePinBackend notice (using local fallback):', err);
    }
    setPairData((prev) => ({
      ...prev,
      pinCode: newPin,
      isPaired: false,
      volunteerId: null,
      volunteerName: undefined,
    }));
    speakText(`New pairing PIN generated: ${newPin.split('').join(' ')}`, language);
  }, [pairData.elderId, language]);

  const pairVolunteerWithPin = useCallback(async (pin: string) => {
    const trimmed = pin.trim();
    // Bug 2+3 fix: derive a stable, consistent volunteerId from the volunteer's
    // profile rather than using the display name or a hardcoded placeholder.
    // This ID is what gets written to Firestore pairs/{pin}.volunteerId.
    const volunteerId =
      volunteerProfile.email
        ? `vol-${volunteerProfile.email.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
        : `vol-${Date.now().toString().slice(-6)}`;

    let backendSuccess = false;
    try {
      const docData = await pairVolunteerBackend(trimmed, volunteerId);
      if (docData) {
        backendSuccess = true;
      }
    } catch (err) {
      console.warn('pairVolunteerBackend notice:', err);
    }
    const res = addElderByPin(trimmed);
    if (res.success || backendSuccess) {
      setPairData((prev) => ({
        ...prev,
        pinCode: trimmed,
        isPaired: true,
        volunteerId: volunteerId,                          // real derived ID, not hardcoded
        volunteerName: volunteerProfile.name || 'Caregiver',
      }));
      soundFx.playSuccessChime();
      return true;
    }
    return false;
  }, [addElderByPin, volunteerProfile.name, volunteerProfile.email]);

  const retryNetworkSync = useCallback(() => {
    setIsNetworkErrorSimulated(false);
    soundFx.playSuccessChime();
  }, []);

  const addCheckinScheduleTime = useCallback((time: string, label: string = 'Scheduled Check-In') => {
    soundFx.playSuccessChime();
    const newSlot: CheckinScheduleSlot = {
      id: `chk-slot-${Date.now()}`,
      time: time.trim(),
      label: label.trim() || 'Scheduled Check-In',
      enabled: true,
    };
    setCheckinSchedules((prev) => [...prev, newSlot].sort((a, b) => a.time.localeCompare(b.time)));
  }, []);

  const updateCheckinScheduleTime = useCallback((id: string, updates: Partial<CheckinScheduleSlot>) => {
    soundFx.playTap();
    setCheckinSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const deleteCheckinScheduleTime = useCallback((id: string) => {
    soundFx.playTap();
    setCheckinSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleCheckinScheduleTime = useCallback((id: string) => {
    soundFx.playTap();
    setCheckinSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }, []);

  const updateElderLocation = useCallback((updates: Partial<ElderLocationData>) => {
    setElderLocation((prev) => ({ ...prev, ...updates }));
  }, []);

  const refreshElderLocationPing = useCallback(() => {
    soundFx.playSuccessChime();
    setElderLocation((prev) => ({
      ...prev,
      lastUpdated: 'Just now (GPS ping confirmed)',
      accuracyMeters: 4,
    }));
  }, []);

  const simulateElderMovement = useCallback((preset: 'home' | 'park' | 'pharmacy') => {
    soundFx.playSuccessChime();
    const presets = {
      home: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'Apartment 4B, 742 Evergreen Terrace, Springfield',
        landmark: 'Safe Home Residence',
        safeZoneStatus: 'inside_home' as const,
        isMoving: false,
      },
      park: {
        latitude: 37.7758,
        longitude: -122.4182,
        address: 'Springfield Central Community Park',
        landmark: 'Near North Fountain Bench',
        safeZoneStatus: 'safe_zone' as const,
        isMoving: true,
      },
      pharmacy: {
        latitude: 37.7785,
        longitude: -122.4230,
        address: 'St. Jude Community Pharmacy',
        landmark: 'Main Street & 4th Avenue',
        safeZoneStatus: 'outside_area' as const,
        isMoving: false,
      },
    };
    const target = presets[preset];
    const newPoint: LocationHistoryPoint = {
      id: `loc-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      address: target.address,
      status: target.safeZoneStatus,
      lat: target.latitude,
      lng: target.longitude,
    };
    setElderLocation((prev) => ({
      ...prev,
      ...target,
      lastUpdated: 'Just now (Live Update)',
      history: [newPoint, ...prev.history.slice(0, 5)],
    }));
  }, []);

  const startCall = useCallback((options?: {
    contactName?: string;
    contactRole?: 'caregiver' | 'elder' | 'emergency';
    phoneNumber?: string;
    reason?: CallReason;
  }) => {
    soundFx.stopSosSirenLoop();
    soundFx.startRingingLoop();
    const isElder = activeRole === 'elder';
    const targetName = options?.contactName || (isElder ? pairData.volunteerName || 'Sarah Chen (Daughter)' : pairData.elderName || 'Eleanor Vance');
    const targetPhone = options?.phoneNumber || (isElder ? '+91 98450 67890' : '+91 98450 12345');
    const targetRole = options?.contactRole || (isElder ? 'caregiver' : 'elder');
    const reason = options?.reason || 'general';

    setActiveCall({
      isOpen: true,
      contactName: targetName,
      contactRole: targetRole,
      phoneNumber: targetPhone,
      status: 'ringing',
      reason,
      connectedDurationSec: 0,
      isMuted: false,
      isSpeakerOn: true,
    });

    setTimeout(() => {
      soundFx.stopRingingLoop();
      soundFx.playCallConnected();
      setActiveCall((prev) => ({ ...prev, status: 'connected' }));
      const greeting = isElder
        ? `Hello Mom, this is Sarah. I see your call. Are you safe?`
        : `Hello Sarah, Eleanor here! Everything is peaceful here.`;
      speakText(greeting, isElder ? language : volunteerLanguage);
    }, 2200);
  }, [activeRole, pairData.volunteerName, pairData.elderName, language, volunteerLanguage]);

  const endCall = useCallback(() => {
    soundFx.stopRingingLoop();
    soundFx.playCallEnded();
    setActiveCall((prev) => ({ ...prev, status: 'ended' }));
    setTimeout(() => {
      setActiveCall(DEFAULT_CALL_STATE);
    }, 1200);
  }, []);

  const toggleCallMute = useCallback(() => {
    soundFx.playTap();
    setActiveCall((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const toggleCallSpeaker = useCallback(() => {
    soundFx.playTap();
    setActiveCall((prev) => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn }));
  }, []);

  const triggerCallDialogue = useCallback((phrase: string) => {
    soundFx.playTap();
    speakText(phrase, activeRole === 'elder' ? language : volunteerLanguage);
  }, [activeRole, language, volunteerLanguage]);

  const loginUser = useCallback((profile: Omit<UserProfile, 'isLoggedIn'>) => {
    soundFx.playSuccessChime();
    const fullProfile: UserProfile = { ...profile, isLoggedIn: true };
    if (profile.role === 'elder') {
      setElderProfile(fullProfile);
      setLanguage(profile.preferredLanguage);
      setActiveRole('elder');
      setElderScreen('home');
    } else {
      setVolunteerProfile(fullProfile);
      setVolunteerLanguage(profile.preferredLanguage);
      setActiveRole('volunteer');
      setVolunteerScreen('dashboard');
    }
    setIsAuthModalOpen(false);
  }, []);

  const logoutUser = useCallback(() => {
    soundFx.playTap();
    setElderProfile((prev) => ({ ...prev, isLoggedIn: false }));
    setVolunteerProfile((prev) => ({ ...prev, isLoggedIn: false }));
  }, []);

  const updateElderProfile = useCallback((updates: Partial<UserProfile>) => {
    setElderProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateVolunteerProfile = useCallback((updates: Partial<UserProfile>) => {
    setVolunteerProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetAllDemoData = useCallback(() => {
    soundFx.playSuccessChime();
    setAlerts(INITIAL_ALERTS);
    setMedicines(INITIAL_MEDICINES);
    setCheckins([
      {
        id: 'chk-1',
        elderId: 'elder-8841',
        promptedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        responded: true,
        respondedAt: new Date(Date.now() - 2 * 3600 * 1000 + 45000).toISOString(),
      },
    ]);
    setElderLocation(INITIAL_ELDER_LOCATION);
    setCheckinSchedules(INITIAL_CHECKIN_SCHEDULES);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        elderProfile,
        volunteerProfile,
        updateElderProfile,
        updateVolunteerProfile,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,

        monitoredElders,
        selectedElderId,
        selectedElder,
        selectElder,
        addElderByPin,
        addNewElder,
        removeElder,
        updateElderData,

        activeRole,
        setActiveRole,
        elderScreen,
        setElderScreen,
        volunteerScreen,
        setVolunteerScreen,
        selectedMedicineId,
        setSelectedMedicineId,

        language,
        setLanguage,
        volunteerLanguage,
        setVolunteerLanguage,
        voicePromptEnabled,
        setVoicePromptEnabled,

        pairData,
        generateNewPin,
        pairVolunteerWithPin,

        sosCountdown,
        isSosCountingDown,
        startSosCountdown,
        cancelSosCountdown,
        triggerImmediateSos,
        activeSosAlert,

        alerts,
        acknowledgeAlert,
        resolveAlert,
        triggerMissedCheckinAlert,
        triggerMissedMedicineAlert,

        checkinSchedules,
        addCheckinScheduleTime,
        updateCheckinScheduleTime,
        deleteCheckinScheduleTime,
        toggleCheckinScheduleTime,
        activeCheckinPrompt,
        triggerCheckinPrompt,
        dismissCheckinPrompt,
        simulateMissedCheckinTimeout,
        activeMissedCheckinModal,
        closeMissedCheckinModal,

        elderLocation,
        updateElderLocation,
        refreshElderLocationPing,
        simulateElderMovement,

        medicines,
        markMedicineTaken,
        updateMedicinePhoto,
        addMedicine,
        editMedicine,
        deleteMedicine,
        resetMedicineStatus,

        checkins,
        lastCheckinTime,
        respondCheckinOk,
        requestCheckinFromVolunteer,

        activeCall,
        startCall,
        endCall,
        toggleCallMute,
        toggleCallSpeaker,
        triggerCallDialogue,

        isSimulationEmpty,
        setIsSimulationEmpty,
        isSimulationLoading,
        setIsSimulationLoading,
        isNetworkErrorSimulated,
        setIsNetworkErrorSimulated,
        retryNetworkSync,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};