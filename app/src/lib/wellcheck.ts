import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './wellcheck-firebase';

// ============================================================================
// Shared TypeScript Interfaces (Matches DATA_MODEL.md)
// ============================================================================

export interface PairDoc {
  elderId: string;
  volunteerId: string | null;
  createdAt: Timestamp;
  checkinIntervalMin: number;
  escalationThresholdMin: number;
}

export interface AlertDoc {
  id?: string;
  elderId: string;
  type: 'sos' | 'checkin_missed';
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Timestamp;
  acknowledgedAt: Timestamp | null;
  location?: { lat: number; lng: number };
}

export interface MedicineReminderDoc {
  id?: string;
  elderId: string;
  medicineName: string;
  scheduledTime: Timestamp;
  localPhotoRef: string; // Device-local only, never uploaded
  taken: boolean;
  takenAt: Timestamp | null;
}

export interface CheckinDoc {
  id?: string;
  elderId: string;
  promptedAt: Timestamp;
  responded: boolean;
  respondedAt: Timestamp | null;
}

// ============================================================================
// Retry Logic Wrapper (PRD §6)
// ============================================================================

async function withRetry<T>(operation: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, delay * 2);
  }
}

// ============================================================================
// Core Operations: Pairing (PRD §2)
// ============================================================================

/**
 * Elder: Generates a random 4-6 digit PIN and creates the pairing document.
 */
export async function generatePairingPin(
  elderId: string, 
  checkinIntervalMin = 15, 
  escalationThresholdMin = 20
): Promise<string> {
  const pinCode = Math.floor(100000 + Math.random() * 900000).toString(); // Secure-enough random 6 digit PIN
  
  const pairData: PairDoc = {
    elderId,
    volunteerId: null,
    createdAt: Timestamp.now(),
    checkinIntervalMin,
    escalationThresholdMin
  };

  await withRetry(() => setDoc(doc(db, 'pairs', pinCode), pairData));
  return pinCode;
}

/**
 * Volunteer: Pairs with an Elder using the generated PIN.
 * Writes volunteerId to pairs/{pin} if it exists.
 */
export async function pairVolunteer(pinCode: string, volunteerId: string): Promise<PairDoc | null> {
  const pairDocRef = doc(db, 'pairs', pinCode);
  
  return await withRetry(async () => {
    const docSnap = await getDoc(pairDocRef);
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as PairDoc;
    if (data.volunteerId !== null) {
      throw new Error('This PIN has already been used.');
    }

    await updateDoc(pairDocRef, { volunteerId });
    return { ...data, volunteerId };
  });
}

// ============================================================================
// Core Operations: SOS (PRD §4.1)
// ============================================================================

/**
 * Elder: Triggers the SOS alarm. Writes an active SOS alert with optional location.
 */
export async function sendSOS(
  elderId: string, 
  location?: { lat: number; lng: number }
): Promise<string> {
  const alertsCollection = collection(db, 'alerts');
  const alertData: AlertDoc = {
    elderId,
    type: 'sos',
    status: 'active',
    createdAt: Timestamp.now(),
    acknowledgedAt: null,
    ...(location && { location }) // Conditionally add location
  };

  const docRef = await withRetry(() => addDoc(alertsCollection, alertData));
  return docRef.id;
}

/**
 * Volunteer: Listens to real-time unresolved alerts (SOS + missed check-ins) for the paired Elder.
 */
export function listenToActiveAlerts(elderId: string, callback: (alerts: AlertDoc[]) => void) {
  const alertsCollection = collection(db, 'alerts');
  const q = query(
    alertsCollection, 
    where('elderId', '==', elderId),
    where('status', 'in', ['active', 'acknowledged'])
  );

  return onSnapshot(q, (snapshot) => {
    const alerts: AlertDoc[] = [];
    snapshot.forEach((doc) => {
      alerts.push({ id: doc.id, ...doc.data() } as AlertDoc);
    });
    callback(alerts);
  });
}

/**
 * Fetch all medicine reminders for an elder.
 */
export async function getMedicineReminders(elderId: string): Promise<MedicineReminderDoc[]> {
  const q = query(collection(db, 'medicineReminders'), where('elderId', '==', elderId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicineReminderDoc));
}

/**
 * Fetch all checkins for an elder.
 */
export async function getCheckins(elderId: string): Promise<CheckinDoc[]> {
  const q = query(collection(db, 'checkins'), where('elderId', '==', elderId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CheckinDoc));
}

/**
 * Volunteer: Acknowledges an active alert.
 */
export async function acknowledgeAlert(alertId: string): Promise<void> {
  const alertDocRef = doc(db, 'alerts', alertId);
  await withRetry(() => updateDoc(alertDocRef, {
    status: 'acknowledged',
    acknowledgedAt: Timestamp.now()
  }));
}

/**
 * Volunteer: Resolves an alert completely.
 */
export async function resolveAlert(alertId: string): Promise<void> {
  const alertDocRef = doc(db, 'alerts', alertId);
  await withRetry(() => updateDoc(alertDocRef, {
    status: 'resolved'
  }));
}

// ============================================================================
// Core Operations: Medicine Reminders (PRD §4.2)
// ============================================================================

/**
 * Schedule/Add a new medicine reminder.
 */
export async function addMedicineReminder(
  elderId: string, 
  medicineName: string, 
  scheduledTime: Date, 
  localPhotoRef: string
): Promise<string> {
  const remindersCollection = collection(db, 'medicineReminders');
  const reminderData: MedicineReminderDoc = {
    elderId,
    medicineName,
    scheduledTime: Timestamp.fromDate(scheduledTime),
    localPhotoRef, // Kept device-local, never uploaded
    taken: false,
    takenAt: null
  };

  const docRef = await withRetry(() => addDoc(remindersCollection, reminderData));
  return docRef.id;
}

/**
 * Elder: Mark a medicine as taken.
 */
export async function markMedicineAsTaken(reminderId: string): Promise<void> {
  const reminderDocRef = doc(db, 'medicineReminders', reminderId);
  await withRetry(() => updateDoc(reminderDocRef, {
    taken: true,
    takenAt: Timestamp.now()
  }));
}

// ============================================================================
// Core Operations: Check-in (PRD §4.3)
// ============================================================================

/**
 * Elder: Creates a record that a check-in was prompted on-device.
 */
export async function createCheckinPromptRecord(elderId: string): Promise<string> {
  const checkinsCollection = collection(db, 'checkins');
  const checkinData: CheckinDoc = {
    elderId,
    promptedAt: Timestamp.now(),
    responded: false,
    respondedAt: null
  };

  const docRef = await withRetry(() => addDoc(checkinsCollection, checkinData));
  return docRef.id;
}

/**
 * Elder: Respond to a check-in prompt ("I'm OK").
 */
export async function respondToCheckin(checkinId: string): Promise<void> {
  const checkinDocRef = doc(db, 'checkins', checkinId);
  await withRetry(() => updateDoc(checkinDocRef, {
    responded: true,
    respondedAt: Timestamp.now()
  }));
}
