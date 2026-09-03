export type RoleMode = 'elder' | 'volunteer';

export type ElderScreen = 
  | 'home'
  | 'sos_countdown'
  | 'sos_sent'
  | 'sos_confirmation'
  | 'medicine_detail'
  | 'pairing'
  | 'login';

export type VolunteerScreen = 
  | 'dashboard'
  | 'pairing'
  | 'login'
  | 'loading_demo'
  | 'empty_demo';

export type AlertType = 'sos' | 'checkin_missed' | 'medicine_missed';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface AlertDoc {
  id: string;
  elderId: string;
  elderName: string;
  type: AlertType;
  status: AlertStatus;
  createdAt: string; // ISO string
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
  notes?: string;
}

export interface MedicineReminderDoc {
  id: string;
  elderId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string; // e.g. "08:00 AM"
  instructions: string;
  localPhotoRef: string; // Device-local only URI/base64
  photoUploadedBy?: 'elder' | 'volunteer' | 'default';
  photoUploadedAt?: string | null;
  taken: boolean;
  takenAt?: string | null;
}

export interface CheckinDoc {
  id: string;
  elderId: string;
  promptedAt: string;
  responded: boolean;
  respondedAt?: string | null;
}

export interface CheckinScheduleSlot {
  id: string;
  time: string; // e.g. "09:00 AM", "03:00 PM"
  label: string; // e.g. "Morning Check", "Afternoon Check"
  enabled: boolean;
}

export interface ActiveCheckinPrompt {
  id: string;
  scheduledTime: string;
  promptedAt: string;
  expiresAtTimestamp: number; // 3 minutes timeout timestamp
  status: 'pending' | 'responded' | 'missed';
}

export interface LocationHistoryPoint {
  id: string;
  time: string;
  address: string;
  status: string;
  lat: number;
  lng: number;
}

export interface ElderLocationData {
  latitude: number;
  longitude: number;
  address: string;
  landmark: string;
  lastUpdated: string;
  accuracyMeters: number;
  batteryLevel: number;
  isMoving: boolean;
  safeZoneStatus: 'inside_home' | 'safe_zone' | 'outside_area';
  history: LocationHistoryPoint[];
}

export interface MonitoredElder {
  id: string;
  name: string;
  age?: number;
  relationship?: string; // e.g. "Mother", "Father", "Grandparent", "Neighbor", "Client"
  phoneCountryCode?: string;
  phoneNumber?: string;
  preferredLanguage: SupportedLanguage;
  pinCode: string;
  avatarEmoji?: string;
  avatarColor?: string;
  isPaired: boolean;
  pairedAt: string;
  address: string;
  landmark: string;
  medicalConditions?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  lastCheckinTime: string;
  status: 'safe' | 'needs_checkin' | 'missed_checkin' | 'sos';
  batteryLevel: number;
  location: ElderLocationData;
  checkinSchedules: CheckinScheduleSlot[];
  medicines: MedicineReminderDoc[];
}

export interface PairDoc {
  pinCode: string;
  elderId: string;
  elderName: string;
  volunteerId: string | null;
  volunteerName?: string;
  createdAt: string;
  isPaired: boolean;
}

export type SupportedLanguage = 
  | 'en-US' // English
  | 'hi-IN' // Hindi
  | 'bn-IN' // Bengali
  | 'ta-IN' // Tamil
  | 'te-IN' // Telugu
  | 'mr-IN' // Marathi
  | 'gu-IN' // Gujarati
  | 'kn-IN' // Kannada
  | 'ml-IN' // Malayalam
  | 'pa-IN' // Punjabi
  | 'or-IN' // Odia
  | 'es-ES' // Spanish
  | 'zh-CN' // Mandarin
  | 'zh-HK' // Cantonese
  | 'vi-VN' // Vietnamese
  | 'tl-PH' // Tagalog
  | 'de-DE' // German
  | 'fr-FR' // French
  | 'ja-JP' // Japanese
  | 'ar-SA'; // Arabic

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
  region?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface CountryCodeOption {
  code: string; // "+91"
  country: string; // "India"
  iso: string; // "IN"
  flag: string; // "🇮🇳"
}

export interface UserProfile {
  name: string;
  email: string;
  phoneCountryCode: string; // e.g. "+91"
  phoneNumber: string; // e.g. "9876543210"
  role: RoleMode;
  preferredLanguage: SupportedLanguage;
  age?: number;
  address?: string;
  relationship?: string;
  organization?: string;
  medicalConditions?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  countryCode?: string;
  isLoggedIn: boolean;
}

export type CallReason = 'sos' | 'checkin' | 'medicine' | 'general';
export type CallStatus = 'dialing' | 'ringing' | 'connected' | 'ended';

export interface ActiveCallState {
  isOpen: boolean;
  contactName: string;
  contactRole: 'caregiver' | 'elder' | 'emergency';
  phoneNumber: string;
  status: CallStatus;
  reason?: CallReason;
  connectedDurationSec: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
}

export type ThemeMode = 'light' | 'dark';

