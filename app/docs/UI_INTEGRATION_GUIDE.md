# WellCheck UI Integration Guide

This guide defines the "API Contract" for the UI AI. You (the UI team) are responsible for building the screens and user experience. You will import all backend functionality from the shared module defined below.

## 1. Shared Module Location
Shared Firestore operations are available via `app/src/lib/wellcheck.ts`. The app context also coordinates the live screen state and Firestore listeners.

Use the shared functions below for new Firestore operations so collection names and payloads remain consistent.

---

## 2. Shared Data Structures (Interfaces)
Use these to type your screen state:

```typescript
export interface AlertDoc {
  id?: string;
  elderId: string;
  type: 'sos' | 'checkin_missed';
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Timestamp;
  acknowledgedAt: Timestamp | null;
  location?: { lat: number; lng: number };
}

// ... MedicineReminderDoc, CheckinDoc, PairDoc interfaces are also available in wellcheck.ts
```

---

## 3. UI-to-Backend Function Reference

### SOS (PRD §4.1)
- `sendSOS(elderId: string, location?: { lat: number; lng: number }): Promise<string>`
  * *Usage:* Call this after the SOS countdown ends. Pass the location object if available.

### Pairing (PRD §2)
- `generatePairingPin(elderId: string, interval = 15, threshold = 20): Promise<string>`
- `pairVolunteer(pinCode: string, volunteerId: string): Promise<PairDoc | null>`

### Alert Management (Volunteer Dashboard)
- `listenToActiveAlerts(elderId: string, callback: (alerts: AlertDoc[]) => void): () => void`
  * *Usage:* Returns an unsubscribe function. Use this in a `useEffect` to keep the dashboard live.
- `acknowledgeAlert(alertId: string): Promise<void>`
- `resolveAlert(alertId: string): Promise<void>`

### Medicine Reminders (PRD §4.2)
- `addMedicineReminder(elderId, name, time, localPhotoRef): Promise<string>`
- `markMedicineAsTaken(reminderId: string): Promise<void>`

### Check-in (PRD §4.3)
- `createCheckinPromptRecord(elderId: string): Promise<string>`
- `respondToCheckin(checkinId: string): Promise<void>`

---

## 4. UI Constraints (CRITICAL §5)
You **MUST** follow these constraints for any elder-facing screen:
- **Touch Targets:** Minimum 60×60dp.
- **Font Size:** Minimum 20sp body, 32sp+ for actions (e.g., SOS button).
- **Contrast:** High contrast only. No grey-on-grey.
- **Depth:** Max 1–2 taps to reach core actions. No hidden/swipe menus.
- **Status:** Never rely on color alone; pair status with icons AND text.
- **Photos:** Medicine photos are **local-only**. The backend only stores the `localPhotoRef` string. Never upload photos to the cloud.

---

## 5. Implementation Pattern Example
```typescript
import { sendSOS } from '../lib/wellcheck';

// On SOS countdown completion:
const location = await getCurrentLocation(); // Use expo-location
await sendSOS(elderId, { lat: location.coords.latitude, lng: location.coords.longitude });
```
