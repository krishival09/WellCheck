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

const getStoredElderProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem('wellcheck_elder_profile');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ELDER_PROFILE;
};

const getStoredVolunteerProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem('wellcheck_volunteer_profile');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_VOLUNTEER_PROFILE;
};

const getStoredActiveRole = (): RoleMode => {
  try {
    const raw = localStorage.getItem('wellcheck_active_role');
    if (raw === 'elder' || raw === 'volunteer') return raw;
  } catch {}
  return 'elder';
};

const getStoredPairData = (elder: UserProfile, volunteer: UserProfile): PairDoc => {
  try {
    const raw = localStorage.getItem('wellcheck_pair_data');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    pinCode: '7492',
    elderId: 'elder-8841',
    elderName: elder.name || 'Eleanor Vance',
    volunteerId: 'vol-3019',
    volunteerName: volunteer.name || 'Sarah Chen (Daughter)',
    createdAt: new Date().toISOString(),
    isPaired: true,
  };
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

const getStoredCheckinSchedules = (): CheckinScheduleSlot[] => {
  try {
    const raw = localStorage.getItem('wellcheck_checkin_schedules');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_CHECKIN_SCHEDULES;
};

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
    { id: 'loc-4', time: '02:45 PM', address: 'Apartment 4B (Home)', status: 'Inside Safe Zone', lat: 37.7749, lng: -122.4194 },
  ],
};

const getStoredElderLocation = (): ElderLocationData => {
  try {
    const raw = localStorage.getItem('wellcheck_elder_location');
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_ELDER_LOCATION;
};

const getStoredMedicines = (): MedicineReminderDoc[] => {
  try {
    const raw = localStorage.getItem('wellcheck_medicines_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_MEDICINES;
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
  {
    id: 'elder-9922',
    name: 'Arthur Pendelton',
    age: 82,
    relationship: 'Father',
    phoneCountryCode: '+1',
    phoneNumber: '4155558912',
    preferredLanguage: 'en-US',
    pinCode: '1234',
    avatarEmoji: '👴',
    avatarColor: '#4CAF50',
    isPaired: true,
    pairedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    address: '108 Oakwood Lane, Apt 2A, Sunnyvale',
    landmark: 'Near Sunnyvale Seniors Community Center',
    medicalConditions: ['High Cholesterol', 'Mild Arthritis'],
    emergencyContactName: 'Sarah Chen (Daughter)',
    emergencyContactPhone: '+1 (415) 555-2671',
    lastCheckinTime: '45 mins ago',
    status: 'safe',
    batteryLevel: 94,
    location: {
      latitude: 37.3688,
      longitude: -122.0363,
      address: '108 Oakwood Lane, Apt 2A, Sunnyvale',
      landmark: 'Sunnyvale Seniors Community Center',
      lastUpdated: '12 mins ago (GPS Live)',
      accuracyMeters: 5,
      batteryLevel: 94,
      isMoving: false,
      safeZoneStatus: 'inside_home',
      history: [
        { id: 'loc-ap-1', time: '07:30 AM', address: '108 Oakwood Lane (Home)', status: 'Inside Safe Zone', lat: 37.3688, lng: -122.0363 },
        { id: 'loc-ap-2', time: '11:00 AM', address: 'Sunnyvale Library & Park', status: 'In Safe Zone (Walking)', lat: 37.3695, lng: -122.0345 },
        { id: 'loc-ap-3', time: '01:45 PM', address: '108 Oakwood Lane (Home)', status: 'Inside Safe Zone', lat: 37.3688, lng: -122.0363 },
      ],
    },
    checkinSchedules: [
      { id: 'chk-ap-1', time: '08:30 AM', label: 'Morning Safety Check', enabled: true },
      { id: 'chk-ap-2', time: '02:00 PM', label: 'Afternoon Check-In', enabled: true },
      { id: 'chk-ap-3', time: '07:30 PM', label: 'Evening Night Check', enabled: true },
    ],
    medicines: [
      {
        id: 'med-ap-1',
        elderId: 'elder-9922',
        medicineName: 'Atorvastatin 20mg (Cholesterol)',
        dosage: '1 tablet before bed',
        scheduledTime: '09:00 PM',
        instructions: 'Take nightly with water. Cholesterol control.',
        localPhotoRef: DEFAULT_MED_BOTTLE_PHOTO,
        taken: false,
        takenAt: null,
      },
      {
        id: 'med-ap-2',
        elderId: 'elder-9922',
        medicineName: 'Amlodipine 5mg (Blood Pressure)',
        dosage: '1 tablet in morning',
        scheduledTime: '08:30 AM',
        instructions: 'Take with breakfast.',
        localPhotoRef: DEFAULT_MED_PILL_PHOTO,
        taken: true,
        takenAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'elder-7733',
    name: 'Grace Hopper-Chen',
    age: 76,
    relationship: 'Aunt',
    phoneCountryCode: '+1',
    phoneNumber: '4155554321',
    preferredLanguage: 'en-US',
    pinCode: '5521',
    avatarEmoji: '🧓',
    avatarColor: '#9C27B0',
    isPaired: true,
    pairedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    address: '450 Pine Valley Road, Palo Alto',
    landmark: 'Near Green Meadows Clinic & Trail',
    medicalConditions: ['Thyroid support', 'Joint supplement'],
    emergencyContactName: 'Sarah Chen (Niece)',
    emergencyContactPhone: '+1 (415) 555-2671',
    lastCheckinTime: '1 hr ago',
    status: 'safe',
    batteryLevel: 79,
    location: {
      latitude: 37.4419,
      longitude: -122.1430,
      address: '450 Pine Valley Road, Palo Alto',
      landmark: 'Green Meadows Clinic & Trail',
      lastUpdated: '18 mins ago (GPS Live)',
      accuracyMeters: 6,
      batteryLevel: 79,
      isMoving: false,
      safeZoneStatus: 'inside_home',
      history: [
        { id: 'loc-gh-1', time: '09:00 AM', address: '450 Pine Valley Road (Home)', status: 'Inside Safe Zone', lat: 37.4419, lng: -122.1430 },
        { id: 'loc-gh-2', time: '01:00 PM', address: 'Green Meadows Walking Path', status: 'In Safe Zone (Walking)', lat: 37.4428, lng: -122.1415 },
      ],
    },
    checkinSchedules: [
      { id: 'chk-gh-1', time: '09:00 AM', label: 'Morning Wellness Check', enabled: true },
      { id: 'chk-gh-2', time: '06:00 PM', label: 'Evening Check-In', enabled: true },
    ],
    medicines: [
      {
        id: 'med-gh-1',
        elderId: 'elder-7733',
        medicineName: 'Levothyroxine 50mcg',
        dosage: '1 tablet 30m before breakfast',
        scheduledTime: '07:30 AM',
        instructions: 'Take on empty stomach with full glass of water.',
        localPhotoRef: DEFAULT_MED_BOTTLE_PHOTO,
        taken: true,
        takenAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
      {
        id: 'med-gh-2',
        elderId: 'elder-7733',
        medicineName: 'Omega-3 Fish Oil 1000mg',
        dosage: '1 softgel with lunch',
        scheduledTime: '12:30 PM',
        instructions: 'Heart & cognitive health supplement.',
        localPhotoRef: DEFAULT_MED_PILL_PHOTO,
        taken: true,
        takenAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

const getStoredMonitoredElders = (): MonitoredElder[] => {
  try {
    const raw = localStorage.getItem('wellcheck_monitored_elders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_MONITORED_ELDERS;
};

const getStoredSelectedElderId = (): string => {
  try {
    const raw = localStorage.getItem('wellcheck_selected_elder_id');
    if (raw) return raw;
  } catch {}
  return 'elder-8841';
};

interface AppContextType {
  // Authentication & Profile
  currentUser: UserProfile;
  elderProfile: UserProfile;
  volunteerProfile: UserProfile;
  updateElderProfile: (updates: Partial<UserProfile>) => void;
  updateVolunteerProfile: (updates: Partial<UserProfile>) => void;
  loginUser: (profile: Omit<UserProfile, 'isLoggedIn'>) => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Multi-Elder Management for Volunteer
  monitoredElders: MonitoredElder[];
  selectedElderId: string;
  selectedElder: MonitoredElder;
  selectElder: (id: string) => void;
  addElderByPin: (pin: string, name?: string, relationship?: string) => { success: boolean; elder?: MonitoredElder; message: string };
  addNewElder: (elderData: Partial<MonitoredElder>) => string;
  removeElder: (id: string) => void;
  updateElderData: (elderId: string, updates: Partial<MonitoredElder>) => void;

  // Mode & Active views
  activeRole: RoleMode;
  setActiveRole: (role: RoleMode) => void;
  elderScreen: ElderScreen;
  setElderScreen: (screen: ElderScreen) => void;
  volunteerScreen: VolunteerScreen;
  setVolunteerScreen: (screen: VolunteerScreen) => void;
  selectedMedicineId: string | null;
  setSelectedMedicineId: (id: string | null) => void;

  // Language & Accessibility
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  volunteerLanguage: SupportedLanguage;
  setVolunteerLanguage: (lang: SupportedLanguage) => void;
  voicePromptEnabled: boolean;
  setVoicePromptEnabled: (enabled: boolean) => void;

  // Pairing State
  pairData: PairDoc;
  generateNewPin: () => void;
  pairVolunteerWithPin: (pin: string) => boolean;

  // SOS Flow
  sosCountdown: number;
  isSosCountingDown: boolean;
  startSosCountdown: () => void;
  cancelSosCountdown: () => void;
  triggerImmediateSos: () => void;
  activeSosAlert: AlertDoc | null;

  // Alerts
  alerts: AlertDoc[];
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  triggerMissedCheckinAlert: () => void;
  triggerMissedMedicineAlert: () => void;

  // Check-In Schedules & 3-Minute Timeout Escalation
  checkinSchedules: CheckinScheduleSlot[];
  addCheckinScheduleTime: (time: string, label?: string) => void;
  updateCheckinScheduleTime: (id: string, updates: Partial<CheckinScheduleSlot>) => void;
  deleteCheckinScheduleTime: (id: string) => void;
  toggleCheckinScheduleTime: (id: string) => void;
  activeCheckinPrompt: ActiveCheckinPrompt | null;
  triggerCheckinPrompt: (scheduledTime?: string) => void;
  dismissCheckinPrompt: () => void;
  simulateMissedCheckinTimeout: () => void;
  activeMissedCheckinModal: {
    isOpen: boolean;
    scheduledTime: string;
    alertId?: string;
  } | null;
  closeMissedCheckinModal: () => void;

  // Elder Location Tracking
  elderLocation: ElderLocationData;
  updateElderLocation: (updates: Partial<ElderLocationData>) => void;
  refreshElderLocationPing: () => void;
  simulateElderMovement: (preset: 'home' | 'park' | 'pharmacy') => void;

  // Medicines
  medicines: MedicineReminderDoc[];
  markMedicineTaken: (id: string) => void;
  updateMedicinePhoto: (id: string, photoUrl: string, uploaderRole?: RoleMode) => void;
  addMedicine: (medicine: Omit<MedicineReminderDoc, 'id'>) => void;
  editMedicine: (id: string, updates: Partial<MedicineReminderDoc>) => void;
  deleteMedicine: (id: string) => void;
  resetMedicineStatus: (id: string) => void;

  // Checkins
  checkins: CheckinDoc[];
  lastCheckinTime: string;
  respondCheckinOk: () => void;
  requestCheckinFromVolunteer: () => void;

  // Active Calling Engine
  activeCall: ActiveCallState;
  startCall: (options?: {
    contactName?: string;
    contactRole?: 'caregiver' | 'elder' | 'emergency';
    phoneNumber?: string;
    reason?: CallReason;
  }) => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallSpeaker: () => void;
  triggerCallDialogue: (speakerText: string) => void;

  // State inspection & Simulation controls
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
  phoneNumber: '(555) 019-2834',
  status: 'dialing',
  reason: 'general',
  connectedDurationSec: 0,
  isMuted: false,
  isSpeakerOn: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Stored Profiles for Elder & Volunteer separately (prevents data crossover)
  const [elderProfile, setElderProfile] = useState<UserProfile>(getStoredElderProfile);
  const [volunteerProfile, setVolunteerProfile] = useState<UserProfile>(getStoredVolunteerProfile);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // App screens and active mode
  const [activeRole, setActiveRoleState] = useState<RoleMode>(getStoredActiveRole);
  const [elderScreen, setElderScreen] = useState<ElderScreen>('home');
  const [volunteerScreen, setVolunteerScreen] = useState<VolunteerScreen>('dashboard');
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>('med-2');

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return elderProfile.preferredLanguage || 'hi-IN';
  });
  const [volunteerLanguage, setVolunteerLanguageState] = useState<SupportedLanguage>(() => {
    return volunteerProfile.preferredLanguage || 'en-US';
  });
  const [voicePromptEnabled, setVoicePromptEnabled] = useState<boolean>(true);

  // Wrapper for setActiveRole to persist
  const setActiveRole = useCallback((newRole: RoleMode) => {
    setActiveRoleState(newRole);
    try {
      localStorage.setItem('wellcheck_active_role', newRole);
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    setElderProfile(prev => {
      const updated = { ...prev, preferredLanguage: lang };
      try {
        localStorage.setItem('wellcheck_elder_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const setVolunteerLanguage = useCallback((lang: SupportedLanguage) => {
    setVolunteerLanguageState(lang);
    setVolunteerProfile(prev => {
      const updated = { ...prev, preferredLanguage: lang };
      try {
        localStorage.setItem('wellcheck_volunteer_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Pair state initialized with persistent values
  const [pairData, setPairData] = useState<PairDoc>(() => 
    getStoredPairData(elderProfile, volunteerProfile)
  );

  // Derive currentUser based on active role
  const currentUser = activeRole === 'elder' ? elderProfile : volunteerProfile;

  // Multi-Elder Management for Volunteer State
  const [monitoredElders, setMonitoredElders] = useState<MonitoredElder[]>(getStoredMonitoredElders);
  const [selectedElderId, setSelectedElderId] = useState<string>(getStoredSelectedElderId);

  // Selected Elder helper
  const selectedElder: MonitoredElder = 
    monitoredElders.find(e => e.id === selectedElderId) || 
    monitoredElders[0] || 
    INITIAL_MONITORED_ELDERS[0];

  const saveMonitoredElders = (elders: MonitoredElder[]) => {
    setMonitoredElders(elders);
    try {
      localStorage.setItem('wellcheck_monitored_elders', JSON.stringify(elders));
    } catch {}
  };

  // SOS Countdown state
  const [sosCountdown, setSosCountdown] = useState<number>(10);
  const [isSosCountingDown, setIsSosCountingDown] = useState<boolean>(false);

  // Alerts state
  const [alerts, setAlerts] = useState<AlertDoc[]>(INITIAL_ALERTS);

  // Medicines state
  const [medicines, setMedicines] = useState<MedicineReminderDoc[]>(getStoredMedicines);

  // Checkins state
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

  // Check-In Schedules State (Volunteer configured)
  const [checkinSchedules, setCheckinSchedules] = useState<CheckinScheduleSlot[]>(getStoredCheckinSchedules);

  // Active Check-In Prompt with 3-Minute Timeout
  const [activeCheckinPrompt, setActiveCheckinPrompt] = useState<ActiveCheckinPrompt | null>(null);

  // Missed Check-In Alert Modal for Volunteer
  const [activeMissedCheckinModal, setActiveMissedCheckinModal] = useState<{
    isOpen: boolean;
    scheduledTime: string;
    alertId?: string;
  } | null>(null);

  // Elder Location Tracking State
  const [elderLocation, setElderLocation] = useState<ElderLocationData>(getStoredElderLocation);

  // Save schedules & location to localStorage on updates
  const saveCheckinSchedules = (schedules: CheckinScheduleSlot[]) => {
    setCheckinSchedules(schedules);
    try {
      localStorage.setItem('wellcheck_checkin_schedules', JSON.stringify(schedules));
    } catch {}
  };

  const saveElderLocation = (loc: ElderLocationData) => {
    setElderLocation(loc);
    try {
      localStorage.setItem('wellcheck_elder_location', JSON.stringify(loc));
    } catch {}
  };

  // 3-Minute Timeout Monitor for Active Check-In Prompt
  useEffect(() => {
    if (!activeCheckinPrompt || activeCheckinPrompt.status !== 'pending') return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= activeCheckinPrompt.expiresAtTimestamp) {
        // 3 minutes elapsed without response! Escalate alert to volunteer!
        soundFx.playSosAlarm();
        const alertId = `alert-chk-missed-${Date.now()}`;
        const newAlert: AlertDoc = {
          id: alertId,
          elderId: pairData.elderId,
          elderName: pairData.elderName,
          type: 'checkin_missed',
          status: 'active',
          createdAt: new Date().toISOString(),
          notes: `Missed Check-In: ${pairData.elderName} did not respond within 3 minutes of the ${activeCheckinPrompt.scheduledTime} prompt.`,
        };
        setAlerts(prev => [newAlert, ...prev]);
        setActiveCheckinPrompt(prev => prev ? { ...prev, status: 'missed' } : null);
        setActiveMissedCheckinModal({
          isOpen: true,
          scheduledTime: activeCheckinPrompt.scheduledTime,
          alertId,
        });
        speakText(
          `Attention: ${pairData.elderName} did not respond to the check-in within three minutes.`,
          volunteerLanguage
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCheckinPrompt, pairData.elderId, pairData.elderName, volunteerLanguage]);

  // Active Calling State
  const [activeCall, setActiveCall] = useState<ActiveCallState>(DEFAULT_CALL_STATE);

  // Call duration interval timer
  useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;
    if (activeCall.isOpen && activeCall.status === 'connected') {
      callTimer = setInterval(() => {
        setActiveCall(prev => ({
          ...prev,
          connectedDurationSec: prev.connectedDurationSec + 1,
        }));
      }, 1000);
    }
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [activeCall.isOpen, activeCall.status]);

  // Simulation controls
  const [isSimulationEmpty, setIsSimulationEmpty] = useState<boolean>(false);
  const [isSimulationLoading, setIsSimulationLoading] = useState<boolean>(false);
  const [isNetworkErrorSimulated, setIsNetworkErrorSimulated] = useState<boolean>(false);

  // Active SOS alert doc
  const activeSosAlert = alerts.find(a => a.type === 'sos' && a.status === 'active') || null;

  const fireSosAlert = useCallback(() => {
    soundFx.playSosAlarm();
    const newAlert: AlertDoc = {
      id: `alert-sos-${Date.now()}`,
      elderId: pairData.elderId,
      elderName: pairData.elderName,
      type: 'sos',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setAlerts(prev => [newAlert, ...prev]);
    setElderScreen('sos_sent');
    if (voicePromptEnabled) {
      speakText(TRANSLATIONS[language]?.sosSent || TRANSLATIONS['en-US'].sosSent, language);
    }
  }, [pairData.elderId, pairData.elderName, language, voicePromptEnabled]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSosCountingDown) {
      if (sosCountdown > 0) {
        timer = setTimeout(() => {
          soundFx.playCountdownTick(sosCountdown <= 3);
          setSosCountdown(prev => prev - 1);
        }, 1000);
      } else {
        // Countdown reached 0 -> Fire SOS!
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

  const triggerImmediateSos = useCallback(() => {
    fireSosAlert();
  }, [fireSosAlert]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    soundFx.stopSosSirenLoop();
    soundFx.playTap();
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? { ...a, status: 'acknowledged', acknowledgedAt: new Date().toISOString() }
          : a
      )
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    soundFx.stopSosSirenLoop();
    soundFx.playTap();
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? { ...a, status: 'resolved', resolvedAt: new Date().toISOString() }
          : a
      )
    );
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
    };
    setAlerts(prev => [newAlert, ...prev]);
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
      notes: 'Lisinopril 10mg scheduled for 08:00 AM not confirmed after 45 mins.',
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, [pairData.elderId, pairData.elderName]);

  // Check-In Schedule Actions
  const addCheckinScheduleTime = useCallback((time: string, label: string = 'Scheduled Check-In') => {
    soundFx.playSuccessChime();
    const newSlot: CheckinScheduleSlot = {
      id: `chk-slot-${Date.now()}`,
      time: time.trim(),
      label: label.trim() || 'Scheduled Check-In',
      enabled: true,
    };
    setCheckinSchedules(prev => {
      const next = [...prev, newSlot].sort((a, b) => a.time.localeCompare(b.time));
      saveCheckinSchedules(next);
      return next;
    });
  }, []);

  const updateCheckinScheduleTime = useCallback((id: string, updates: Partial<CheckinScheduleSlot>) => {
    soundFx.playTap();
    setCheckinSchedules(prev => {
      const next = prev.map(slot => slot.id === id ? { ...slot, ...updates } : slot);
      saveCheckinSchedules(next);
      return next;
    });
  }, []);

  const deleteCheckinScheduleTime = useCallback((id: string) => {
    soundFx.playTap();
    setCheckinSchedules(prev => {
      const next = prev.filter(slot => slot.id !== id);
      saveCheckinSchedules(next);
      return next;
    });
  }, []);

  const toggleCheckinScheduleTime = useCallback((id: string) => {
    soundFx.playTap();
    setCheckinSchedules(prev => {
      const next = prev.map(slot => slot.id === id ? { ...slot, enabled: !slot.enabled } : slot);
      saveCheckinSchedules(next);
      return next;
    });
  }, []);

  // Trigger active check-in prompt with 3-minute countdown window
  const triggerCheckinPrompt = useCallback((scheduledTime?: string) => {
    soundFx.playTap();
    const timeLabel = scheduledTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newPrompt: ActiveCheckinPrompt = {
      id: `prompt-${Date.now()}`,
      scheduledTime: timeLabel,
      promptedAt: new Date().toISOString(),
      expiresAtTimestamp: Date.now() + 3 * 60 * 1000, // 3 minutes = 180,000 ms
      status: 'pending',
    };
    setActiveCheckinPrompt(newPrompt);

    // Audio & voice alert to elder
    if (voicePromptEnabled) {
      speakText(
        `Time to check in! Please tap I'm OK to let your caregiver know you are safe.`,
        language
      );
    }
  }, [language, voicePromptEnabled]);

  const dismissCheckinPrompt = useCallback(() => {
    soundFx.playTap();
    setActiveCheckinPrompt(null);
  }, []);

  // Instant simulation of 3-minute timeout for live evaluation
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
    setAlerts(prev => [newAlert, ...prev]);
    setActiveCheckinPrompt(prev => prev ? { ...prev, status: 'missed' } : null);
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

  // Location Tracking Handlers
  const updateElderLocation = useCallback((updates: Partial<ElderLocationData>) => {
    setElderLocation(prev => {
      const next = { ...prev, ...updates };
      saveElderLocation(next);
      return next;
    });
  }, []);

  const refreshElderLocationPing = useCallback(() => {
    soundFx.playSuccessChime();
    // Simulate real-time GPS satellite ping with slight natural jitter
    const latOffset = (Math.random() - 0.5) * 0.0002;
    const lngOffset = (Math.random() - 0.5) * 0.0002;
    setElderLocation(prev => {
      const next: ElderLocationData = {
        ...prev,
        latitude: +(prev.latitude + latOffset).toFixed(6),
        longitude: +(prev.longitude + lngOffset).toFixed(6),
        lastUpdated: 'Just now (GPS ping confirmed)',
        accuracyMeters: Math.floor(3 + Math.random() * 4),
      };
      saveElderLocation(next);
      return next;
    });
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
        statusLabel: 'Inside Home Perimeter (Safe Zone)',
      },
      park: {
        latitude: 37.7758,
        longitude: -122.4182,
        address: 'Springfield Central Community Park & Walking Trail',
        landmark: 'Near North Fountain Bench',
        safeZoneStatus: 'safe_zone' as const,
        isMoving: true,
        statusLabel: 'Safe Walking Zone (Community Park)',
      },
      pharmacy: {
        latitude: 37.7785,
        longitude: -122.4230,
        address: 'St. Jude Community Pharmacy & Health Clinic',
        landmark: 'Main Street & 4th Avenue',
        safeZoneStatus: 'outside_area' as const,
        isMoving: false,
        statusLabel: 'Outside Home Zone (Pharmacy Visit)',
      },
    };

    const target = presets[preset];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newPoint: LocationHistoryPoint = {
      id: `loc-${Date.now()}`,
      time: nowTime,
      address: target.address,
      status: target.statusLabel,
      lat: target.latitude,
      lng: target.longitude,
    };

    setElderLocation(prev => {
      const next: ElderLocationData = {
        ...prev,
        latitude: target.latitude,
        longitude: target.longitude,
        address: target.address,
        landmark: target.landmark,
        safeZoneStatus: target.safeZoneStatus,
        isMoving: target.isMoving,
        lastUpdated: 'Just now (Live Update)',
        history: [newPoint, ...prev.history.slice(0, 7)],
      };
      saveElderLocation(next);
      return next;
    });
  }, []);

  const respondCheckinOk = useCallback(() => {
    soundFx.playSuccessChime();
    const now = new Date();
    const newCheckin: CheckinDoc = {
      id: `chk-${Date.now()}`,
      elderId: pairData.elderId,
      promptedAt: now.toISOString(),
      responded: true,
      respondedAt: now.toISOString(),
    };
    setCheckins(prev => [newCheckin, ...prev]);
    setLastCheckinTime('Just now');
    setActiveCheckinPrompt(null);
    setActiveMissedCheckinModal(null);

    // Auto-resolve any active checkin_missed alerts
    setAlerts(prev =>
      prev.map(a =>
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

  const markMedicineTaken = useCallback((id: string) => {
    soundFx.playSuccessChime();
    const now = new Date().toISOString();
    setMedicines(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, taken: true, takenAt: now } : m));
      try {
        localStorage.setItem('wellcheck_medicines_data', JSON.stringify(next));
      } catch {}
      return next;
    });
    // Auto-resolve any active medicine_missed alerts
    setAlerts(prev =>
      prev.map(a =>
        a.type === 'medicine_missed' && a.status === 'active'
          ? { ...a, status: 'resolved', resolvedAt: now }
          : a
      )
    );
    if (voicePromptEnabled) {
      speakText(TRANSLATIONS[language]?.medicineTaken || TRANSLATIONS['en-US'].medicineTaken, language);
    }
  }, [voicePromptEnabled, language]);

  const updateMedicinePhoto = useCallback((id: string, photoUrl: string, uploaderRole: RoleMode = 'elder') => {
    soundFx.playSuccessChime();
    const now = new Date().toISOString();
    setMedicines(prev => {
      const next = prev.map(m => (m.id === id ? { 
        ...m, 
        localPhotoRef: photoUrl,
        photoUploadedBy: uploaderRole,
        photoUploadedAt: now
      } : m));
      try {
        localStorage.setItem('wellcheck_medicines_data', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const addMedicine = useCallback((medicineData: Omit<MedicineReminderDoc, 'id'>) => {
    soundFx.playSuccessChime();
    const newMed: MedicineReminderDoc = {
      ...medicineData,
      id: `med-${Date.now()}`,
    };
    setMedicines(prev => {
      const next = [...prev, newMed];
      try {
        localStorage.setItem('wellcheck_medicines_data', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const editMedicine = useCallback((id: string, updates: Partial<MedicineReminderDoc>) => {
    soundFx.playTap();
    setMedicines(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, ...updates } : m));
      try {
        localStorage.setItem('wellcheck_medicines_data', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const deleteMedicine = useCallback((id: string) => {
    soundFx.playTap();
    setMedicines(prev => {
      const next = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem('wellcheck_medicines_data', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetMedicineStatus = useCallback((id: string) => {
    soundFx.playTap();
    setMedicines(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, taken: false, takenAt: null } : m));
      try {
        localStorage.setItem('wellcheck_medicines_data', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const selectElder = useCallback((id: string) => {
    soundFx.playTap();
    setSelectedElderId(id);
    try {
      localStorage.setItem('wellcheck_selected_elder_id', id);
    } catch {}
    const target = monitoredElders.find(e => e.id === id);
    if (target) {
      setMedicines(target.medicines);
      setCheckinSchedules(target.checkinSchedules);
      setElderLocation(target.location);
      setPairData(prev => ({
        ...prev,
        elderId: target.id,
        elderName: target.name,
        pinCode: target.pinCode,
      }));
      setElderProfile(prev => ({
        ...prev,
        name: target.name,
        preferredLanguage: target.preferredLanguage,
        phoneNumber: target.phoneNumber || prev.phoneNumber,
        phoneCountryCode: target.phoneCountryCode || prev.phoneCountryCode,
        emergencyContactName: target.emergencyContactName || prev.emergencyContactName,
        emergencyContactPhone: target.emergencyContactPhone || prev.emergencyContactPhone,
      }));
    }
  }, [monitoredElders]);

  const updateElderData = useCallback((elderId: string, updates: Partial<MonitoredElder>) => {
    setMonitoredElders(prev => {
      const next = prev.map(e => e.id === elderId ? { ...e, ...updates } : e);
      saveMonitoredElders(next);
      return next;
    });
  }, []);

  const addElderByPin = useCallback((pin: string, customName?: string, relationship: string = 'Mother') => {
    soundFx.playSuccessChime();
    const trimmedPin = pin.trim();

    // Check if this elder is already in monitored list
    const existing = monitoredElders.find(e => e.pinCode === trimmedPin);
    if (existing) {
      selectElder(existing.id);
      return { success: true, elder: existing, message: `Connected to ${existing.name}` };
    }

    // Pre-set demo elders check
    const preset = INITIAL_MONITORED_ELDERS.find(e => e.pinCode === trimmedPin);
    if (preset) {
      const updated = [preset, ...monitoredElders];
      saveMonitoredElders(updated);
      selectElder(preset.id);
      return { success: true, elder: preset, message: `Connected to ${preset.name}` };
    }

    // Otherwise, create a new monitored elder dynamically with this PIN code
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
      location: {
        latitude: +(37.7749 + (Math.random() - 0.5) * 0.05).toFixed(6),
        longitude: +(-122.4194 + (Math.random() - 0.5) * 0.05).toFixed(6),
        address: 'Apartment 2B, 108 Oakwood Lane',
        landmark: 'Near Community Health Clinic',
        lastUpdated: 'Just now (GPS Live)',
        accuracyMeters: 5,
        batteryLevel: 92,
        isMoving: false,
        safeZoneStatus: 'inside_home',
        history: [
          { id: `loc-${Date.now()}`, time: '08:00 AM', address: 'Home Safe Zone', status: 'Inside Safe Zone', lat: 37.7749, lng: -122.4194 }
        ]
      },
      checkinSchedules: [
        { id: `chk-slot-${Date.now()}-1`, time: '09:00 AM', label: 'Morning Safety Check', enabled: true },
        { id: `chk-slot-${Date.now()}-2`, time: '03:00 PM', label: 'Afternoon Check-In', enabled: true },
        { id: `chk-slot-${Date.now()}-3`, time: '08:00 PM', label: 'Evening Safety Check', enabled: true },
      ],
      medicines: [
        {
          id: `med-${Date.now()}-1`,
          elderId: newId,
          medicineName: 'Daily Multivitamin & Calcium',
          dosage: '1 tablet with breakfast',
          scheduledTime: '08:30 AM',
          instructions: 'Take in morning with food.',
          localPhotoRef: DEFAULT_MED_BOTTLE_PHOTO,
          taken: false,
          takenAt: null,
        }
      ]
    };

    const nextList = [newElder, ...monitoredElders];
    saveMonitoredElders(nextList);
    selectElder(newId);
    return { success: true, elder: newElder, message: `Successfully connected ${elderName} to your account.` };
  }, [monitoredElders, selectElder, volunteerProfile.name, volunteerProfile.phoneNumber]);

  const addNewElder = useCallback((elderData: Partial<MonitoredElder>) => {
    soundFx.playSuccessChime();
    const newId = `elder-${Date.now().toString().slice(-4)}`;
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    const elderName = elderData.name || 'New Elder';
    
    const newElder: MonitoredElder = {
      id: newId,
      name: elderName,
      age: elderData.age || 75,
      relationship: elderData.relationship || 'Mother',
      phoneCountryCode: elderData.phoneCountryCode || '+1',
      phoneNumber: elderData.phoneNumber || '4155550192',
      preferredLanguage: elderData.preferredLanguage || 'en-US',
      pinCode: newPin,
      avatarEmoji: elderData.relationship === 'Father' || elderData.relationship === 'Grandfather' ? '👴' : '👵',
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
      location: {
        latitude: +(37.7749 + (Math.random() - 0.5) * 0.04).toFixed(6),
        longitude: +(-122.4194 + (Math.random() - 0.5) * 0.04).toFixed(6),
        address: elderData.address || '108 Oakwood Lane, Apt 2B',
        landmark: elderData.landmark || 'Near Community Park',
        lastUpdated: 'Just now (GPS Live)',
        accuracyMeters: 4,
        batteryLevel: 95,
        isMoving: false,
        safeZoneStatus: 'inside_home',
        history: [
          { id: `loc-${Date.now()}`, time: '08:00 AM', address: elderData.address || 'Home Safe Zone', status: 'Inside Safe Zone', lat: 37.7749, lng: -122.4194 }
        ]
      },
      checkinSchedules: [
        { id: `chk-slot-${Date.now()}-1`, time: '09:00 AM', label: 'Morning Safety Check', enabled: true },
        { id: `chk-slot-${Date.now()}-2`, time: '03:00 PM', label: 'Afternoon Check-In', enabled: true },
        { id: `chk-slot-${Date.now()}-3`, time: '08:00 PM', label: 'Evening Safety Check', enabled: true },
      ],
      medicines: [
        {
          id: `med-${Date.now()}-1`,
          elderId: newId,
          medicineName: 'Daily Multivitamin & Calcium',
          dosage: '1 tablet with breakfast',
          scheduledTime: '08:30 AM',
          instructions: 'Take in morning with food.',
          localPhotoRef: DEFAULT_MED_BOTTLE_PHOTO,
          taken: false,
          takenAt: null,
        }
      ]
    };

    const nextList = [newElder, ...monitoredElders];
    saveMonitoredElders(nextList);
    return newId;
  }, [monitoredElders, volunteerProfile.name, volunteerProfile.phoneNumber]);

  const removeElder = useCallback((id: string) => {
    soundFx.playTap();
    const nextList = monitoredElders.filter(e => e.id !== id);
    if (nextList.length === 0) return;
    saveMonitoredElders(nextList);
    if (selectedElderId === id) {
      selectElder(nextList[0].id);
    }
  }, [monitoredElders, selectedElderId, selectElder]);

  const generateNewPin = useCallback(() => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPairData(prev => ({
      ...prev,
      pinCode: newPin,
      isPaired: false,
      volunteerId: null,
      volunteerName: undefined,
    }));
  }, []);

  const pairVolunteerWithPin = useCallback((pin: string) => {
    const res = addElderByPin(pin);
    if (res.success) {
      setPairData(prev => ({
        ...prev,
        isPaired: true,
        volunteerId: 'vol-3019',
        volunteerName: 'Sarah Chen (Family)',
      }));
      return true;
    }
    return false;
  }, [addElderByPin]);

  const retryNetworkSync = useCallback(() => {
    setIsNetworkErrorSimulated(false);
    soundFx.playSuccessChime();
  }, []);

  // Calling Handlers
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
    const targetPhone = options?.phoneNumber || (isElder ? '(555) 019-2834' : '(555) 018-9923');
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

    // Ring for 2.2 seconds then auto-connect with voice greeting
    setTimeout(() => {
      soundFx.stopRingingLoop();
      soundFx.playCallConnected();
      setActiveCall(prev => ({
        ...prev,
        status: 'connected',
      }));

      // Speak automatic initial pickup phrase based on who is calling and why
      const targetLang = isElder ? language : volunteerLanguage;
      let greeting = '';
      if (isElder) {
        if (reason === 'sos') {
          greeting = `Hello Mom, this is Sarah. I received your SOS alert. I am right here on the line with you, are you safe?`;
        } else {
          greeting = `Hello Eleanor, Sarah here! I see your call. How are you feeling right now?`;
        }
      } else {
        if (reason === 'sos') {
          greeting = `Sarah, thank goodness you called. I pressed the emergency button earlier.`;
        } else {
          greeting = `Hello Sarah, Eleanor here! Thank you for calling to check on me. Everything is peaceful here.`;
        }
      }
      speakText(greeting, targetLang);
    }, 2200);
  }, [activeRole, pairData.volunteerName, pairData.elderName, language, volunteerLanguage]);

  const endCall = useCallback(() => {
    soundFx.stopRingingLoop();
    soundFx.playCallEnded();
    setActiveCall(prev => ({
      ...prev,
      status: 'ended',
    }));
    setTimeout(() => {
      setActiveCall(DEFAULT_CALL_STATE);
    }, 1200);
  }, []);

  const toggleCallMute = useCallback(() => {
    soundFx.playTap();
    setActiveCall(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  }, []);

  const toggleCallSpeaker = useCallback(() => {
    soundFx.playTap();
    setActiveCall(prev => ({
      ...prev,
      isSpeakerOn: !prev.isSpeakerOn,
    }));
  }, []);

  const triggerCallDialogue = useCallback((phrase: string) => {
    soundFx.playTap();
    const targetLang = activeRole === 'elder' ? language : volunteerLanguage;
    speakText(phrase, targetLang);
  }, [activeRole, language, volunteerLanguage]);

  const loginUser = useCallback((profile: Omit<UserProfile, 'isLoggedIn'>) => {
    soundFx.playSuccessChime();
    const fullProfile: UserProfile = {
      ...profile,
      isLoggedIn: true,
    };
    
    if (profile.role === 'elder') {
      setElderProfile(fullProfile);
      try {
        localStorage.setItem('wellcheck_elder_profile', JSON.stringify(fullProfile));
      } catch {}
      setLanguageState(profile.preferredLanguage);
      setPairData(prev => {
        const next = { ...prev, elderName: profile.name };
        try { localStorage.setItem('wellcheck_pair_data', JSON.stringify(next)); } catch {}
        return next;
      });
      setActiveRoleState('elder');
      try { localStorage.setItem('wellcheck_active_role', 'elder'); } catch {}
      setElderScreen('home');
    } else {
      setVolunteerProfile(fullProfile);
      try {
        localStorage.setItem('wellcheck_volunteer_profile', JSON.stringify(fullProfile));
      } catch {}
      setVolunteerLanguageState(profile.preferredLanguage);
      setPairData(prev => {
        const next = { ...prev, volunteerName: profile.name };
        try { localStorage.setItem('wellcheck_pair_data', JSON.stringify(next)); } catch {}
        return next;
      });
      setActiveRoleState('volunteer');
      try { localStorage.setItem('wellcheck_active_role', 'volunteer'); } catch {}
      setVolunteerScreen('dashboard');
    }
    setIsAuthModalOpen(false);
  }, []);

  const updateElderProfile = useCallback((updates: Partial<UserProfile>) => {
    setElderProfile(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('wellcheck_elder_profile', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (updates.name) {
      setPairData(prev => {
        const next = { ...prev, elderName: updates.name! };
        try { localStorage.setItem('wellcheck_pair_data', JSON.stringify(next)); } catch {}
        return next;
      });
    }
    if (updates.preferredLanguage) {
      setLanguageState(updates.preferredLanguage);
    }
  }, []);

  const updateVolunteerProfile = useCallback((updates: Partial<UserProfile>) => {
    setVolunteerProfile(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('wellcheck_volunteer_profile', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (updates.name) {
      setPairData(prev => {
        const next = { ...prev, volunteerName: updates.name! };
        try { localStorage.setItem('wellcheck_pair_data', JSON.stringify(next)); } catch {}
        return next;
      });
    }
    if (updates.preferredLanguage) {
      setVolunteerLanguageState(updates.preferredLanguage);
    }
  }, []);

  const logoutUser = useCallback(() => {
    soundFx.playTap();
    if (activeRole === 'elder') {
      setElderProfile(prev => {
        const next = { ...prev, isLoggedIn: false };
        try { localStorage.setItem('wellcheck_elder_profile', JSON.stringify(next)); } catch {}
        return next;
      });
    } else {
      setVolunteerProfile(prev => {
        const next = { ...prev, isLoggedIn: false };
        try { localStorage.setItem('wellcheck_volunteer_profile', JSON.stringify(next)); } catch {}
        return next;
      });
    }
    setIsAuthModalOpen(true);
  }, [activeRole]);

  const resetAllDemoData = useCallback(() => {
    setAlerts(INITIAL_ALERTS);
    setMedicines(INITIAL_MEDICINES);
    setCheckinSchedules(INITIAL_CHECKIN_SCHEDULES);
    setElderLocation(INITIAL_ELDER_LOCATION);
    setActiveCheckinPrompt(null);
    setActiveMissedCheckinModal(null);
    try {
      localStorage.setItem('wellcheck_medicines_data', JSON.stringify(INITIAL_MEDICINES));
      localStorage.setItem('wellcheck_checkin_schedules', JSON.stringify(INITIAL_CHECKIN_SCHEDULES));
      localStorage.setItem('wellcheck_elder_location', JSON.stringify(INITIAL_ELDER_LOCATION));
    } catch {}
    setElderScreen('home');
    setVolunteerScreen('dashboard');
    setIsSosCountingDown(false);
    setSosCountdown(10);
    setIsSimulationEmpty(false);
    setIsSimulationLoading(false);
    setIsNetworkErrorSimulated(false);
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
