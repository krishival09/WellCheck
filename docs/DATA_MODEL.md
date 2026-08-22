# WellCheck Data Model

All code must use these exact collection names and field types. 

## Collections

### 1. `pairs`
Holds the PIN-based connection between devices.
- **Path:** `pairs/{pinCode}` (Document ID is the 4-6 digit PIN)
- **Fields:**
  - `elderId`: string (unique device identifier)
  - `volunteerId`: string | null (volunteer's unique identifier)
  - `createdAt`: timestamp
  - `checkinIntervalMin`: number (elder prompt cadence)
  - `escalationThresholdMin`: number (server alert threshold)

### 2. `alerts`
High-priority notifications for the volunteer.
- **Path:** `alerts/{alertId}`
- **Fields:**
  - `elderId`: string (mapped to paired elder)
  - `type`: enum ("sos" | "checkin_missed")
  - `status`: enum ("active" | "acknowledged" | "resolved")
  - `createdAt`: timestamp
  - `acknowledgedAt`: timestamp | null
  - `location`: map | null (fields: `lat`: number, `lng`: number)

### 3. `medicineReminders`
Elder's medication schedule.
- **Path:** `medicineReminders/{reminderId}`
- **Fields:**
  - `elderId`: string
  - `medicineName`: string
  - `scheduledTime`: timestamp
  - `localPhotoRef`: string (URI for local-only device storage)
  - `taken`: boolean
  - `takenAt`: timestamp | null

### 4. `checkins`
Historical record of elder responses.
- **Path:** `checkins/{checkinId}`
- **Fields:**
  - `elderId`: string
  - `promptedAt`: timestamp
  - `responded`: boolean
  - `respondedAt`: timestamp | null
