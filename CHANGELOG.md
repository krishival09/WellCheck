# Changelog

All notable changes to the **WellCheck** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1] - 2026-09-15

### 🐛 Android Stability & Layout Fixes
* **Safe-area support**: Added `react-native-safe-area-context` at the app root and applies dynamic top and bottom insets in `MobileApp.tsx`. Content no longer sits beneath Android status or three-button navigation bars.
* **Elder dashboard tuning**: Reduced oversized card heights, removed forced bottom alignment, and added scroll clearance so the SOS, medicine, check-in, and contact controls remain reachable on smaller Android screens.
* **Native-compatible mobile flows**: Replaced browser-only maps, sharing, SMS, confirmation, file-processing, and media patterns with React Native equivalents or safe fallbacks.
* **Single TTS overlay**: `TtsSubtitleBanner` is mounted once at the mobile root and positioned below the system inset.
* **Logout confirmation**: Elder and caregiver logout actions now require native confirmation.

### 🔧 Maintenance
* Standardized current user-facing documentation on Expo SDK 57, React Native 0.86, Android-first runtime support, and six-digit pairing PINs.
* GitHub Actions builds an Android APK, uploads it as an artifact, and publishes the `v2.0.1` release.

---

## [2.0.0] - 2026-09-03

### 🚀 Major Architectural Shift
* **React Native Web Transition**: Shifted the frontend architecture to **React Native Web** (`react-native-web`) powered by **Vite** and **Tailwind CSS v4** (`@tailwindcss/vite`), eliminating the risk of fragile manual JSX/StyleSheet conversions and ensuring pixel-perfect rendering across modern web and mobile browsers.
* **Pure Mobile UI (`src/mobile/`)**: Completely isolated the mobile experience with [`MobileApp.tsx`](app/src/mobile/MobileApp.tsx) as the direct application root. Discarded the desktop dual-phone preview simulator (`src/preview/` with `PhoneFrame.tsx`, `HeaderNav.tsx`, and `ViewLayout.tsx`).

### ✨ Added
* **👥 Multi-Elder Roster Switching**: Caregivers can monitor multiple elderly individuals from a single dashboard. Tapping an elder immediately swaps medication checklists, daily check-ins, location telemetry, and pairing PIN.
* **➕ Add Elder Onboarding Modal**: [`VolunteerAddElderModal.tsx`](app/src/mobile/volunteer/VolunteerAddElderModal.tsx) allows caregivers to register new seniors with customized emergency contacts, medical conditions, and phone numbers.
* **⏰ Check-In Schedule Matrix**: [`VolunteerCheckinScheduleModal.tsx`](app/src/mobile/volunteer/VolunteerCheckinScheduleModal.tsx) enables configuring multiple daily check-in slots (Morning, Afternoon, Evening) with individual alarm sound toggles.
* **⏳ 3-Minute Escalation Rule**:
  * Added a live 180-second countdown banner on [`ElderHome.tsx`](app/src/mobile/elder/ElderHome.tsx) when a scheduled check-in triggers.
  * Added [`VolunteerMissedCheckinModal.tsx`](app/src/mobile/volunteer/VolunteerMissedCheckinModal.tsx) urgent takeover on the caregiver dashboard with 3 instant actions (Call Elder Directly, Track GPS on Google Maps, Call Emergency Contact) if 3 minutes elapse without a response.
* **🗺️ Interactive Maps & Movement Simulator**: Integrated OpenStreetMap and Google Maps universal deep links in [`VolunteerLocationTrackerModal.tsx`](app/src/mobile/volunteer/VolunteerLocationTrackerModal.tsx) and [`GoogleMapView.tsx`](app/src/mobile/components/GoogleMapView.tsx) with movement simulation presets (Home Safe Zone, Community Park, Pharmacy).
* **💊 Enhanced Medication Manager**: Redesigned medication cards with photo thumbnails, dosage instructions, compliance checkboxes, and local photo upload modal ([`VolunteerMedicineManagerModal.tsx`](app/src/mobile/volunteer/VolunteerMedicineManagerModal.tsx)).
* **🚨 Full-Screen SOS Emergency Takeover**: Critical takeover modal ([`VolunteerSosModal.tsx`](app/src/mobile/volunteer/VolunteerSosModal.tsx)) with siren loops, instant acknowledgement, and resolution logging.
* **🌙 Dark Mode / High-Contrast Theming**: Added WCAG AA-compliant night theme toggling via Tailwind `dark:` tokens, reducing eye strain and conserving OLED battery.
* **📱 Real-Time Cross-Device Sync**: Integrated Cloud Firestore listeners (`listenToPairingDoc`, `listenToActiveAlerts`) into [`AppContext.tsx`](app/src/context/AppContext.tsx) to support seamless live testing between two separate physical phones.

### 🛑 Excluded
* **AI Health Summary**: Decoupled the experimental Gemini AI health insights feature (`/api/ai/health-summary`) from the UI as it requires further testing.

---

## [1.0.1] - 2026-08-30

### 🐛 Fixed
* **PIN Synchronization Mismatch**: Fixed a bug where a locally generated 4-digit PIN did not match the 6-digit PIN written to Firestore by the backend. The backend is now the single source of truth for pairing PINs.
* **Volunteer Identity Formatting**: Fixed `pairVolunteerWithPin` writing the caregiver's display name string to Firestore `pairs/{pin}.volunteerId`. Now derives a clean, unique identifier (`vol-<email-slug>`).
* **Removed Hardcoded IDs**: Cleaned up hardcoded `vol-3019` demo IDs from the initial state and fallback paths.
* **Pairing Listener Document Key**: Corrected `listenToPairingDoc` so it watches the matching Firestore document key, allowing the elder's device to instantly acknowledge pairing.
* **Test Document Pollution**: Identified and documented `elder-verify` documents resulting from interrupted backend verification scripts.

### 📦 Deliverables
* Compiled and published standalone Android APK: **`WellCheck-v1.0.1.apk`** on [GitHub Releases](https://github.com/lanofgajanan/WellCheck/releases/tag/v1.0.1).

---

## [1.0.0] - 2026-08-23

### 🌟 Initial Release
* **Accessibility-First Design System**: Built with $60\times 60\,\text{dp}$ touch targets, $20\,\text{sp}+$ typography, and high-contrast styling.
* **1-Tap SOS Emergency Dispatch**: 10-second audio countdown with instant cancel, emergency broadcast to Firestore, and phone/SMS fallbacks.
* **Daily Safety Check-In**: One-tap "I'M OK" safety check logging.
* **Privacy-First Medication Manager**: Camera and photo library capture (`expo-image-picker`) with strict local device storage (`localPhotoRef`).
* **Multilingual Text-to-Speech (TTS)**: Voice guidance in 20+ languages with synchronized subtitle caption banner.
* **Cloud Infrastructure**: Cloud Firestore database `wellcheck` live in `asia-south1`.
* **Escalation Cron**: Automated Node.js cron service for detecting missed check-in timeouts.
