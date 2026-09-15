import { MonitoredElder, MedicineReminderDoc, CheckinScheduleSlot, ElderLocationData, AlertDoc, ActiveCheckinPrompt } from '../types';
import { Platform } from 'react-native';

// On native (Android/iOS via Expo Go), there is no local backend server.
// All real-time data flows through Firestore. REST API calls are silently skipped.
const API_BASE = Platform.OS === 'web' ? '/api' : null;

// apiFetch: returns null immediately on native (no backend server).
// On web it behaves exactly like fetch(). All callers handle null/error.
async function apiFetch(path: string, options?: RequestInit): Promise<Response | null> {
  if (!API_BASE) return null;
  return fetch(`${API_BASE}${path}`, options);
}

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await apiFetch('/health');
      if (!res) return { status: 'offline' };
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Elders
  getElders: async (): Promise<MonitoredElder[] | null> => {
    try {
      const res = await apiFetch('/elders');
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('API getElders error:', err);
      return null;
    }
  },

  getElderById: async (id: string): Promise<MonitoredElder | null> => {
    try {
      const res = await apiFetch(`/elders/${id}`);
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  createElder: async (elderData: Partial<MonitoredElder>): Promise<MonitoredElder | null> => {
    try {
      const res = await apiFetch('/elders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(elderData),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  updateElder: async (id: string, updates: Partial<MonitoredElder>): Promise<MonitoredElder | null> => {
    try {
      const res = await apiFetch(`/elders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  deleteElder: async (id: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`/elders/${id}`, { method: 'DELETE' });
      return !!res && res.ok;
    } catch {
      return false;
    }
  },

  pairWithPin: async (pinCode: string, customName?: string, relationship?: string) => {
    try {
      const res = await apiFetch('/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinCode, customName, relationship }),
      });
      if (!res || !res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  generatePin: async (elderId?: string): Promise<string | null> => {
    try {
      const res = await apiFetch('/generate-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elderId }),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.pinCode;
    } catch {
      return null;
    }
  },

  // Medicines
  getMedicines: async (elderId: string): Promise<MedicineReminderDoc[] | null> => {
    try {
      const res = await apiFetch(`/elders/${elderId}/medicines`);
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || [];
    } catch {
      return null;
    }
  },

  addMedicine: async (elderId: string, med: Partial<MedicineReminderDoc>): Promise<MedicineReminderDoc | null> => {
    try {
      const res = await apiFetch(`/elders/${elderId}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(med),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  updateMedicine: async (medId: string, updates: Partial<MedicineReminderDoc>): Promise<MedicineReminderDoc | null> => {
    try {
      const res = await apiFetch(`/medicines/${medId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  deleteMedicine: async (medId: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`/medicines/${medId}`, { method: 'DELETE' });
      return !!res && res.ok;
    } catch {
      return false;
    }
  },

  takeMedicine: async (medId: string): Promise<MedicineReminderDoc | null> => {
    try {
      const res = await apiFetch(`/medicines/${medId}/take`, { method: 'POST' });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  resetMedicine: async (medId: string): Promise<MedicineReminderDoc | null> => {
    try {
      const res = await apiFetch(`/medicines/${medId}/reset`, { method: 'POST' });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  // Checkins & Schedules
  getSchedules: async (elderId: string): Promise<CheckinScheduleSlot[] | null> => {
    try {
      const res = await apiFetch(`/elders/${elderId}/schedules`);
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || [];
    } catch {
      return null;
    }
  },

  updateSchedules: async (elderId: string, schedules: CheckinScheduleSlot[]): Promise<CheckinScheduleSlot[] | null> => {
    try {
      const res = await apiFetch(`/elders/${elderId}/schedules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedules }),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  triggerCheckinPrompt: async (elderId: string, slotLabel?: string): Promise<ActiveCheckinPrompt | null> => {
    try {
      const res = await apiFetch('/checkins/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elderId, slotLabel }),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  respondToCheckin: async (promptId: string, mood?: string, voiceMemo?: string) => {
    try {
      const res = await apiFetch('/checkins/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, mood, voiceMemo }),
      });
      if (!res || !res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  triggerMissedCheckinTimeout: async (elderId: string, promptId?: string): Promise<AlertDoc | null> => {
    try {
      const res = await apiFetch('/checkins/missed-timeout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elderId, promptId }),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  // Location
  updateLocation: async (elderId: string, locUpdates: Partial<ElderLocationData>): Promise<ElderLocationData | null> => {
    try {
      const res = await apiFetch(`/elders/${elderId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locUpdates),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  pingLocation: async (elderId: string): Promise<ElderLocationData | null> => {
    try {
      const res = await apiFetch(`/elders/${elderId}/location/ping`, { method: 'POST' });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  // SOS & Alerts
  triggerSos: async (elderId: string, reason?: string): Promise<AlertDoc | null> => {
    try {
      const res = await apiFetch('/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elderId, reason }),
      });
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  resolveSos: async (elderId: string): Promise<boolean> => {
    try {
      const res = await apiFetch('/sos/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elderId }),
      });
      return !!res && res.ok;
    } catch {
      return false;
    }
  },

  getAlerts: async (): Promise<AlertDoc[] | null> => {
    try {
      const res = await apiFetch('/alerts');
      if (!res || !res.ok) return null;
      const data = await res.json();
      return data.data || [];
    } catch {
      return null;
    }
  },

  dismissAlert: async (alertId: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`/alerts/${alertId}`, { method: 'DELETE' });
      return !!res && res.ok;
    } catch {
      return false;
    }
  },
};
