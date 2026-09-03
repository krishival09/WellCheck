<div align="center">

# 🛡️ WellCheck — Elder Care Safety & Independence

**A modern, accessibility-first mobile safety companion connecting seniors with family caregivers and volunteers in real-time.**

[![GitHub Release](https://img.shields.io/github/v/release/lanofgajanan/WellCheck?style=for-the-badge&color=2563EB&logo=github)](https://github.com/lanofgajanan/WellCheck/releases/tag/v1.0.1)
[![Android APK](https://img.shields.io/badge/Download-Android_APK_(v1.0.1)-16A34A?style=for-the-badge&logo=android)](https://github.com/lanofgajanan/WellCheck/releases/download/v1.0.1/WellCheck-v1.0.1.apk)
[![React Native Web](https://img.shields.io/badge/React_Native_Web-0.19-61DAFB?style=for-the-badge&logo=react)](https://necolas.github.io/react-native-web/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Firestore](https://img.shields.io/badge/Google_Cloud-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

[📥 Download Android APK (v1.0.1)](https://github.com/lanofgajanan/WellCheck/releases/download/v1.0.1/WellCheck-v1.0.1.apk) • [📋 Changelog](CHANGELOG.md) • [📖 PRD Specification](elder-care-app-PRD-v2.md.txt) • [📊 Project Status](PROJECT_STATUS.md)

</div>

---

## 🌟 Overview

**WellCheck** is engineered specifically to overcome the physical, visual, and cognitive barriers seniors face when using modern smartphones. It provides single-tap emergency SOS dispatch, scheduled daily check-ins with automated escalation, privacy-first local medication management, and real-time synchronization between elderly loved ones and family caregivers—without complex logins or confusing multi-layer menus.

---

## 🚀 Key Features

### 🚨 1-Tap Emergency SOS Dispatch
- **Unmistakable Trigger**: Massive emergency button with high-contrast crimson styling.
- **10-Second Safeguard Countdown**: Audible tick and voice countdown with instant one-tap cancellation to prevent false alarms.
- **Immediate Cloud Dispatch**: Broadcasts an active emergency alert with GPS coordinates to paired caregivers in real-time.
- **Native Phone & SMS Fallbacks**: One-tap direct dialer (`tel:`) and SMS emergency fallbacks when internet is unstable.

### 👥 Multi-Elder Roster Switching
- **Multi-Senior Support**: Caregivers can monitor multiple family members or community seniors from a single dashboard.
- **Instant Context Swap**: Tapping an elder in the roster immediately switches active medication logs, check-in statuses, location telemetry, and pairing PIN.
- **Add Elder Onboarding**: Register new seniors directly from the caregiver hub with custom medical conditions, emergency contacts, and schedules.

### ⏰ Check-In Schedule Matrix & 3-Minute Escalation
- **Customizable Daily Slots**: Configure multiple check-in times throughout the day (Morning 08:00 AM, Lunch 01:00 PM, Evening 08:00 PM) with alarm sound toggles.
- **180-Second Live Countdown**: Seniors receive a clear visual and audible prompt on their home screen.
- **Automated Escalation**: If 3 minutes elapse without confirmation, the caregiver's device triggers an **urgent takeover modal** with 3 immediate action buttons: **Call Elder Directly**, **Track Live GPS on Google Maps**, and **Call Emergency Family Contact**.

### 🗺️ Interactive Maps & Safe-Zone Geofencing
- **Real-Time Coordinates**: Displays live latitude, longitude, landmark, battery percentage, and accuracy in meters.
- **Movement Simulation Presets**: Live evaluation tools for "Home Safe Zone", "Community Park Walk", and "Pharmacy Perimeter".
- **Universal Navigation Deep Links**: One-tap deep links to Google Maps driving and walking directions, plus an embedded OpenStreetMap view.

### 💊 Privacy-First Medication Manager
- **Photo Verification**: Pill box and prescription bottle images displayed directly on the elder's medication cards.
- **Strict Local-Only Storage**: In accordance with healthcare privacy standards, medication photos remain strictly on the device (`localPhotoRef`) and are never uploaded to public cloud storage.
- **Compliance Logging**: "I Have Taken This" button logs completion timestamps and updates the caregiver's compliance tracker.

### 🔑 Real-Time PIN Device Pairing
- **Zero Passwords**: Connect senior and caregiver devices in seconds using an instant 4-digit PIN (e.g. `7492`).
- **Live Firestore Listener**: The senior's device automatically detects when the caregiver inputs the PIN and confirms pairing with a success chime and voice announcement.

### 🗣️ Multilingual Voice Guidance (TTS)
- **Native Voice Synthesis**: Spoken prompts powered by browser-standard Web Speech API.
- **20+ Regional Languages**: Full support for Hindi, Telugu, Tamil, Marathi, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Odia, English, Spanish, French, German, and more.
- **Live Subtitle Caption Banner**: Spoken audio is reflected in a real-time subtitle banner with an instant "STOP AUDIO" button.

### 🌙 Dark Mode & High-Contrast Theming
- **WCAG AA Compliant**: High-contrast night theme utilizing Tailwind `dark:` tokens (`bg-slate-900`, `border-slate-700`, `text-white`), reducing eye strain in low-light environments and conserving OLED battery.

---

## 🎨 Elder Accessibility Design System

WellCheck strictly adheres to senior accessibility guidelines (PRD §5):

| Design Constraint | WellCheck Implementation |
| :--- | :--- |
| **Touch Targets** | **Minimum $60\times 60\,\text{dp}$** for all interactive buttons. |
| **Typography** | **$20\,\text{sp}+$** for body text; **$38\,\text{sp}$** for critical SOS triggers. |
| **Color Contrast** | Dark Navy (`#0F172A`) on Cream (`#FAF7F2`), Vivid Crimson (`#DC2626`), and Emerald (`#16A34A`). Zero low-contrast gray-on-gray. |
| **Visual Cues** | Every icon is paired with a clear, bold text label. |
| **Navigation Depth** | Flat navigation model — all primary workflows reachable within 1–2 taps with no hidden hamburger menus. |

---

## 🏗️ Architecture & Tech Stack

```
WellCheck/
├── app/                        # React Native Web Mobile Application
│   ├── index.html              # Mobile HTML shell with PWA meta tags
│   ├── vite.config.ts          # Vite build configuration with React Native Web alias
│   ├── src/
│   │   ├── App.tsx             # Root container with mobile viewport centering
│   │   ├── main.tsx            # DOM mount entry point
│   │   ├── rn-compat.tsx       # React Native Web primitive exports & haptics
│   │   ├── types.ts            # TypeScript data contracts & schemas
│   │   ├── index.css           # Tailwind CSS v4 styling rules
│   │   ├── mobile/             # Pure Mobile UI Architecture
│   │   │   ├── MobileApp.tsx   # Mobile role router (Elder vs Volunteer)
│   │   │   ├── auth/           # Mobile login & onboarding screens
│   │   │   ├── elder/          # Elder screens (Home, SOS Countdown, SOS Sent, Med Detail, Pairing)
│   │   │   ├── volunteer/      # Caregiver hub (Roster, Matrix, Maps, Med Manager, SOS Takeover)
│   │   │   └── components/     # Modals (Call, Maps, Photo Uploader, Subtitle Banner)
│   │   ├── context/
│   │   │   └── AppContext.tsx  # Central state & real-time Firestore listeners
│   │   ├── lib/
│   │   │   ├── wellcheck.ts    # Firestore CRUD operations & retry logic
│   │   │   └── wellcheck-firebase.ts # Firebase App & Firestore singleton
│   │   └── utils/
│   │       ├── speech.ts       # Multilingual TTS engine & translation dictionary
│   │       └── audio.ts        # Alarm, chime & tick sound synthesizers
│   └── package.json            # Scripts & dependencies
├── server/                     # Backend Cron Escalation Service
│   ├── checkin-escalation.js   # Automated missed check-in escalation runner
│   └── verify-app-flow.js      # End-to-end backend test verification script
├── CHANGELOG.md                # Detailed release notes & changelog
├── PROJECT_STATUS.md           # Project completion status
└── firestore.rules             # Cloud Firestore security rules
```

- **Frontend Core**: React 18, React Native Web `0.19`, Vite `6.0`, Tailwind CSS `v4`
- **Database & Cloud**: Google Cloud Firestore (`wellcheck` database in `asia-south1`)
- **Speech Engine**: Web Speech API (`SpeechSynthesisUtterance`) with multi-language dictionary
- **Audio Synthesis**: Web Audio Context API (custom sirens, chimes, and tick oscillators)
- **Mapping**: OpenStreetMap embed + Google Maps universal deep links

---

## ⚡ Quick Start & Multi-Device Testing

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### 1. Install & Run Development Server
```bash
# Navigate to the app directory
cd d:\wellcheck\batch\app

# Install dependencies
npm install

# Start the Vite development server on your local network
npm run dev
```

The server will display your local network address:
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.15.53:3000/
```

### 2. Testing with Two Physical Phones (Real-World Simulation)
1. Connect your computer and both phones to the **same Wi-Fi network**.
2. **On Phone 1 (Senior / Elder 👵)**:
   - Open Chrome or Safari and go to the Network URL (e.g. `http://192.168.15.53:3000/`).
   - Select **Elder (👵)** $\rightarrow$ tap **Start Elder Experience**.
   - Note the 4-digit PIN displayed on screen (e.g. `7492`).
3. **On Phone 2 (Caregiver 👩‍⚕️)**:
   - Open Chrome or Safari and visit the same Network URL.
   - Select **Volunteer Caregiver (👩‍⚕️)** $\rightarrow$ tap **Open Caregiver Dashboard**.
   - Enter the 4-digit PIN in the **Quick Connect** box $\rightarrow$ both devices will immediately pair and chime!
4. **Test Live SOS**: Tap the red SOS button on Phone 1 $\rightarrow$ Phone 2 will immediately launch the emergency takeover modal with siren audio.

---

## 📦 Standalone Android APK (v1.0.1)

For native Android installation without a development server:

👉 **[Download WellCheck v1.0.1 APK](https://github.com/lanofgajanan/WellCheck/releases/download/v1.0.1/WellCheck-v1.0.1.apk)**

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
