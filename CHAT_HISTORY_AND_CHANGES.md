# WellCheck Mobile — Master Reference Document
*For AI agents and developers. Updated: September 15, 2026.*

---

## 🗂️ Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | WellCheck |
| **App Type** | React Native + Expo (Android mobile app) |
| **Runtime** | Expo Go on physical Android device |
| **Dev Command** | `npx expo start --go --clear` |
| **Workspace Root** | `d:\wellcheck\batch\app` |
| **Entry Point (Metro/RN)** | `index.js` → `src/mobile/MobileApp.tsx` |
| **Entry Point (Vite/Web)** | `src/main.tsx` (web-only, not used for Android) |
| **Language** | TypeScript (`npx tsc --noEmit` must exit 0) |
| **State Management** | React Context (`src/context/AppContext.tsx`) |
| **Database** | Firebase Firestore (real-time, all platforms) |
| **Backend API** | `src/services/api.ts` — returns `null` on native; only Firestore is used |

---

## 📐 Architecture & Navigation State Machine

`
MobileApp.tsx
├── screen === 'login'          → LoginPage.tsx
├── screen === 'elder'
│   ├── elderScreen === 'home'             → ElderHome.tsx
│   ├── elderScreen === 'medicine-detail'  → ElderMedicineDetail.tsx
│   ├── elderScreen === 'sos-countdown'    → ElderSosCountdown.tsx
│   ├── elderScreen === 'sos-confirmation' → ElderSosConfirmation.tsx
│   └── elderScreen === 'pairing'          → ElderPairingView.tsx
└── screen === 'volunteer'
    ├── volunteerScreen === 'dashboard'    → VolunteerDashboard.tsx
    └── volunteerScreen === 'pairing'      → VolunteerPairingView.tsx
`

**Root-level components mounted always (in MobileApp.tsx):**
- `TtsSubtitleBanner` — floating TTS voice subtitle overlay (ONE instance only, at root)
- `CallModal` — incoming/outgoing call overlay

---

## 👤 User Roles & Login Flow

- **Elder** — the person being monitored (takes medicine, triggers SOS, gets check-in prompts)
- **Volunteer / Caregiver** — the person monitoring the elder (dashboard, maps, alerts)
- PIN is **6 digits** (e.g. `749281`). Set in `AppContext.tsx`.
- Login: `LoginPage.tsx` → user enters 6-digit PIN + selects role → `loginUser()` in AppContext
- Logout: calls `logoutUser()` → returns to login screen. **Both Elder and Volunteer logout require a native `Alert.alert` confirmation dialog first.**

---

## 🧩 Key Files Reference

### Core Compat Layer
| File | Purpose |
|------|---------|
| `src/rn-compat.tsx` | All HTML-to-RN shims (`Div`, `Span`, `P`, `H1`-`H6`, `Button`, `Input`, `Select`, `Option`, `Img`, `Label`, `Modal`, `ScrollView`, `TouchableOpacity`, `triggerHaptic`). Also contains `parseTailwind()` and `splitScrollViewStyles()`. |
| `src/global.d.ts` | CSS module type declaration (`declare module '*.css'`) |

### State & Data
| File | Purpose |
|------|---------|
| `src/context/AppContext.tsx` | Single global state: user profile, elder/volunteer data, medicine reminders, SOS alerts, pairing, navigation screens |
| `src/services/api.ts` | `API_BASE = null` on native. `apiFetch()` returns `null` on non-web platforms. All real data flows through Firestore. |
| `src/utils/speech.ts` | TTS via `expo-speech`. Translation API calls are skipped on native (`Platform.OS !== 'web'`). |
| `src/utils/audio.ts` | `soundFx` — `playTap()`, `playSuccessChime()`, etc. |

### Screens
| File | Role |
|------|------|
| `src/mobile/MobileApp.tsx` | Root router (login / elder / volunteer) |
| `src/mobile/auth/LoginPage.tsx` | Login/register with PIN + role selection |
| `src/mobile/elder/ElderHome.tsx` | Elder dashboard (SOS, medicine, check-in, language selector modal) |
| `src/mobile/elder/ElderMedicineDetail.tsx` | Medicine detail with pill tabs |
| `src/mobile/elder/ElderSosCountdown.tsx` | 10-second SOS countdown before alert fires |
| `src/mobile/elder/ElderSosConfirmation.tsx` | Post-SOS screen with call and SMS buttons |
| `src/mobile/elder/ElderPairingView.tsx` | Shows elder's 6-digit PIN for volunteer to scan |
| `src/mobile/elder/ElderAddMedicineModal.tsx` | Add medicine form with preset photo picker |
| `src/mobile/volunteer/VolunteerDashboard.tsx` | Caregiver main dashboard |
| `src/mobile/volunteer/VolunteerPairingView.tsx` | Enter elder 6-digit PIN to pair |
| `src/mobile/volunteer/VolunteerAddElderModal.tsx` | Add elder by 6-digit PIN |
| `src/mobile/volunteer/VolunteerCheckinScheduleModal.tsx` | Schedule automated check-ins |
| `src/mobile/volunteer/VolunteerLocationTrackerModal.tsx` | Map placeholder + Google Maps deep-link |
| `src/mobile/volunteer/VolunteerMedicineManagerModal.tsx` | Manage elder's medicine schedule |
| `src/mobile/volunteer/VolunteerMissedCheckinModal.tsx` | Handle missed check-in alerts |
| `src/mobile/volunteer/VolunteerSosModal.tsx` | Handle active SOS alerts |

### Components
| File | Purpose |
|------|---------|
| `src/mobile/components/TtsSubtitleBanner.tsx` | Floating TTS subtitle. Mount **once only** at root in MobileApp.tsx |
| `src/mobile/components/GoogleMapView.tsx` | Map placeholder that deep-links to Google Maps via `Linking.openURL` |
| `src/mobile/components/MedicinePhotoUploaderModal.tsx` | Photo picker: URL input tab + Preset library tab |
| `src/mobile/components/CallModal.tsx` | Incoming/outgoing call overlay |
| `src/mobile/components/EmptyState.tsx` | Empty list placeholder |
| `src/mobile/components/LoadingState.tsx` | Loading indicator |

---

## ⚠️ Critical Rules for Any AI Agent / Developer

### React Native Compatibility
1. **NEVER use lowercase HTML tags in JSX** — `<div>`, `<span>`, `<p>`, `<h1>`-`<h6>`, `<video>`, `<iframe>`, `<input>`, etc. are all invalid in React Native.
   - ✅ Use capitalized wrappers from `rn-compat`: `<Div>`, `<Span>`, `<P>`, `<H2>`, `<Button>`, `<Input>`, `<Img>` etc.
2. **NEVER use web-only APIs**:
   - ❌ `window.open(url)` → ✅ `Linking.openURL(url)` from `'react-native'`
   - ❌ `window.location.href = 'sms:...'` → ✅ `Linking.openURL('sms:...')`
   - ❌ `confirm()` / `alert()` → ✅ `Alert.alert(...)` from `'react-native'`
   - ❌ `navigator.clipboard` / `navigator.share` → ✅ `Share.share(...)` from `'react-native'`
   - ❌ `navigator.mediaDevices.getUserMedia` → not available; use `expo-camera` (not installed yet)
   - ❌ `document.createElement('canvas')` / `FileReader` → not available
   - ❌ `<iframe>` / `<video>` elements → not supported
3. **Flex direction**: React Native defaults to `column`, NOT `row` like the web. Always use `flex-row` in Tailwind classes when you want horizontal layout.
4. **Scrolling**: Use `overflow-y-auto` in className to trigger `<ScrollView>` (detected by `splitScrollViewStyles` in rn-compat). Do not assume content scrolls by default.
5. **Grid layout**: CSS `grid` / `grid-cols-N` does NOT work in React Native. Use `flex-row` + `flex-1` or hardcoded widths.
6. **Text must be in Text components**: Bare string literals cannot be direct children of View-like components. Wrap in `<P>`, `<Span>`, or `<H*>`.
7. **TTS Banner**: Only ONE instance of `<TtsSubtitleBanner />` — it lives in `MobileApp.tsx`. Never add it to child screens.
8. **`<Select>`/`<Option>`**: Use the `label` prop explicitly (e.g. `<Option value="hi-IN" label="हिन्दी (Hindi)">…</Option>`) to prevent undefined dropdown items.

### TypeScript
- Run `npx tsc --noEmit` after every change. Must exit with **code 0**.
- Untyped event handlers must use `(e: any) =>` signature.
- Do NOT use `React.ChangeEvent<HTMLInputElement>` or other DOM-specific types in mobile components.

### Navigation
- Navigate between screens by calling context setters: `setScreen('elder')`, `setElderScreen('home')`, `setVolunteerScreen('pairing')` etc. — all defined in `AppContext.tsx`.
- Logout requires **confirmation dialog** (`Alert.alert`) before calling `logoutUser()`.

### Backend / Data
- On Android, `API_BASE` is `null`. `apiFetch()` always returns `null`. Do not add new REST API calls without a native guard.
- All real-time data (elders, volunteers, medicine, SOS alerts) flows through **Firebase Firestore**.
- PIN system is **6 digits** everywhere.

---

## 📋 Full Change History by Session

### Session 1 — Platform Migration & Critical Crash Fixes
**Requests 1–13**

| File | Change |
|------|--------|
| `src/rn-compat.tsx` | Added `<Strong>` + all HTML element shims; fixed duplicate Strong declaration; replaced SafeAreaView; added window/Linking polyfills; added parseTailwind enhancements; added splitScrollViewStyles; added ButtonTextColorContext; added extractNodeText to Option |
| `src/services/api.ts` | `API_BASE = null` on native; apiFetch returns null; null guards on all methods |
| `src/utils/speech.ts` | Skip translateWithGoogleApi on native |
| `src/mobile/MobileApp.tsx` | Added overflow-y-auto to login wrapper |
| `src/mobile/auth/LoginPage.tsx` | Attached handleSubmit; 6-digit PIN; explicit Option labels; high-contrast role buttons; removed alert subscriptions section |
| `src/context/AppContext.tsx` | Default PIN `749281`; generateNewPin to 6 digits |
| `src/mobile/elder/ElderHome.tsx` | Added overflow-y-auto |
| `src/mobile/volunteer/VolunteerPairingView.tsx` | Added overflow-y-auto; 6-digit PIN validation |
| `src/mobile/elder/ElderPairingView.tsx` | Added overflow-y-auto |
| `src/mobile/elder/ElderSosConfirmation.tsx` | Added overflow-y-auto |
| `src/mobile/volunteer/VolunteerAddElderModal.tsx` | 6-digit demo PINs; explicit Option labels |

### Session 2 — UI Layout Fix (Flexbox, ScrollView, TTS Banner)
**Requests 14–15**

| File | Change |
|------|--------|
| `src/rn-compat.tsx` | parseTailwind: flex defaults to row; numeric w-N/h-N; bracket dimensions; decimal paddings; hex+opacity; drop-shadow; splitScrollViewStyles: fixed auto flex:1 injection |
| `src/mobile/components/TtsSubtitleBanner.tsx` | Refactored to floating absolute card; removed duplicates from child screens |
| `src/mobile/elder/ElderHome.tsx` | Full layout rewrite: flex-row headers, language Modal, SOS card, medicine card, check-in card |
| `src/mobile/elder/ElderMedicineDetail.tsx` | flex-row header, horizontal pill tabs, scheduled time banner |
| `src/mobile/elder/ElderSosCountdown.tsx` | flex-row header and countdown |
| `src/mobile/elder/ElderSosConfirmation.tsx` | flex-row header and action buttons |
| Multiple volunteer modals | Fixed `(e: any)` type annotations |

### Session 3 — Web-Only API Removal & TS Cleanup (Sep 15 2026)
**All web-only APIs replaced with React Native equivalents. TSC → exit 0.**

| File | Change |
|------|--------|
| `src/mobile/volunteer/VolunteerAddElderModal.tsx` | All 13 `(e)` → `(e: any)` |
| `src/mobile/volunteer/VolunteerDashboard.tsx` | `window.open` → `Linking.openURL`; added `Alert` import |
| `src/mobile/volunteer/VolunteerLocationTrackerModal.tsx` | `window.open` → `Linking.openURL` |
| `src/mobile/volunteer/VolunteerMedicineManagerModal.tsx` | `confirm()` → `Alert.alert` |
| `src/mobile/volunteer/VolunteerSosModal.tsx` | `window.open` → `Linking.openURL` |
| `src/mobile/components/GoogleMapView.tsx` | Full rewrite: removed `<iframe>`, `navigator.clipboard`, `navigator.share`; replaced with tappable map placeholder + `Share` module + `Linking.openURL` |
| `src/mobile/components/MedicinePhotoUploaderModal.tsx` | Removed `FileReader`, `<video>`, `document.createElement('canvas')`, drag-drop; replaced with URL input tab + Preset library tab |
| `src/mobile/elder/ElderAddMedicineModal.tsx` | Removed `FileReader`; handleFileUpload is now a no-op |
| `src/mobile/elder/ElderSosConfirmation.tsx` | `window.location.href = 'sms:...'` → `Linking.openURL('sms:...')` |
| `src/mobile/elder/ElderHome.tsx` | `(e)` → `(e: any)` in TouchableOpacity |
| `src/global.d.ts` | **NEW**: `declare module '*.css'` |
| `src/rn-compat.tsx` | Removed misplaced `declare module '*.css'` |

### Session 4 — Logout Confirmation (Sep 15 2026)
**Added native Alert.alert confirmation dialog before logout in both Elder and Volunteer screens.**

| File | Change |
|------|--------|
| `src/mobile/elder/ElderHome.tsx` | Added `Alert` import; logout button now shows `Alert.alert('Log Out', ...)` with Cancel/Log Out options before calling `logoutUser()` |
| `src/mobile/volunteer/VolunteerDashboard.tsx` | Added `Alert` to existing import; logout button now shows `Alert.alert('Log Out', ...)` with Cancel/Log Out options before calling `logoutUser()` |

### Session 5 — Android 3-Button Navigation & Aspect Ratio Tuning (Sep 15 2026)
**Resolved UI overlap for users with Android 3-button navigation (Back, Home, Recents software buttons) and tuned card aspect ratios.**

* **Issue:** Android 3-button software navigation bar overlapped the bottom card ("CALL Sarah" & "PIN 749281") because the app rendered edge-to-edge without hardware bottom insets. In addition, the voice subtitle banner (`TtsSubtitleBanner`) started at `top-3`, overlapping the Android status bar and completely covering the Header and top half of the SOS button.
* **Root Causes:**
  1. `react-native-safe-area-context` was not installed, and `SafeAreaView` in `rn-compat.tsx` was aliased to a plain `View`.
  2. `MobileApp.tsx` did not apply `insets.bottom` or `insets.top`.
  3. `ElderHome.tsx` had `mt-auto` on the bottom card, forcing it to the extreme bottom where navigation buttons sit, with insufficient scroll padding (`p-3`).
  4. Card heights (`min-h-[115px]`, `min-h-[85px]`, etc.) were vertically oversized, pushing content off-screen.
* **Resolution:**
  1. Installed `react-native-safe-area-context` (built into Expo Go).
  2. Wrapped `src/App.tsx` with `<SafeAreaProvider>`.
  3. Re-exported `SafeAreaProvider`, `SafeAreaView`, `useSafeAreaInsets` from `src/rn-compat.tsx`.
  4. In `src/mobile/MobileApp.tsx`, applied dynamic safe area insets (`paddingTop: insets.top`, `paddingBottom: insets.bottom`) to the root container.
  5. In `src/mobile/components/TtsSubtitleBanner.tsx`, positioned with `top: Math.max(insets.top, 8) + 4` and streamlined into a sleek toast (height ~46px) so it never covers the Header or SOS card.
  6. In `src/mobile/elder/ElderHome.tsx`, tuned card proportions:
     - Header: `px-3 py-2`, `mb-1.5`
     - SOS Button: `min-h-[96px]`, `text-[28px]` (high contrast, accessible, but doesn't waste 30px)
     - Take Medicine Card: `min-h-[72px] px-3.5 py-2.5`
     - Add New Medicine: `min-h-[46px] px-3.5 py-2`
     - Check In: `min-h-[68px] px-3.5 py-2.5`
     - Bottom Card: `mt-1.5 p-3` (removed `mt-auto` and added `pb-6` on `Main` for generous scroll clearance).

---

## 🚀 Running the App

`powershell
# Start Metro bundler (run in d:\wellcheck\batch\app)
npx expo start --go --clear

# Then scan the QR code with the Expo Go app on your Android phone.
# Press 'r' in the Metro terminal to reload after code changes.
# Do NOT run npx expo start as a background daemon.
`

---

## ✅ Current Status (Sep 15 2026)
- `npx tsc --noEmit` → **exit code 0** (zero errors)
- App builds and runs on Android via Expo Go
- No web-only APIs in any mobile source file
- All logout actions require user confirmation
- 6-digit PIN system enforced everywhere
- Single TtsSubtitleBanner at root level
- Google Maps deep-links open native Maps app
- Medicine photos: Preset library + URL input (no camera/file picker until expo-image-picker is added)

---

## Session 6 — Release Documentation Alignment (Sep 15 2026)

**Documentation was brought into line with the Android-first `v2.0.1` implementation.**

| File | Change |
|------|--------|
| `README.md` | Documents six-digit pairing, Expo SDK 57 / React Native 0.86, Android Expo Go startup, and the current APK release workflow. |
| `PROJECT_STATUS.md` | Identifies `v2.0.1` as Android-first and documents safe-area support, native-compatible flows, and current medication-photo limits. |
| `CHANGELOG.md` | Adds the `v2.0.1` Android stability, safe-area, and logout-confirmation release notes. |
| `docs/DATA_MODEL.md` | Clarifies that pairing PINs are six digits. |
| `docs/BUILD_PLAN.md` | Records completed data-layer, integration, and release-workflow milestones. |
| `app/docs/UI_INTEGRATION_GUIDE.md` | Clarifies the shared Firestore integration boundary. |
