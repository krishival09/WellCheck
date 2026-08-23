<div align="center">

# 🛡️ WellCheck — Elder Care Safety & Independence

**A modern, accessibility-first mobile safety companion connecting seniors with family caregivers and volunteers in real-time.**

[![GitHub Release](https://img.shields.io/github/v/release/lanofgajanan/WellCheck?style=for-the-badge&color=2563EB&logo=github)](https://github.com/lanofgajanan/WellCheck/releases/tag/v1.0.0)
[![Android APK](https://img.shields.io/badge/Download-Android_APK_(v1.0.0)-16A34A?style=for-the-badge&logo=android)](https://github.com/lanofgajanan/WellCheck/releases/download/v1.0.0/WellCheck-v1.0.0.apk)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![Firestore](https://img.shields.io/badge/Google_Cloud-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

[📥 Download Android APK](https://github.com/lanofgajanan/WellCheck/releases/download/v1.0.0/WellCheck-v1.0.0.apk) • [📖 PRD Specification](elder-care-app-PRD-v2.md.txt) • [📊 Project Status](PROJECT_STATUS.md)

</div>

---

## 🌟 Overview

**WellCheck** is designed specifically to overcome the physical, visual, and cognitive barriers seniors face when using standard smartphones. It provides instant emergency dispatch, scheduled wellness check-ins, privacy-first local medication reminders, and real-time synchronization with family caregivers without complex logins or confusing menus.

---

## 🚀 Key Features

### 🚨 1-Tap Emergency SOS Dispatch
- **Unmistakable Trigger**: Massive emergency button with high-contrast crimson styling.
- **10-Second Safeguard Countdown**: Audible tick and voice countdown with instant one-tap cancellation to prevent false alarms.
- **Immediate Cloud Dispatch**: Broadcasts an active emergency alert with GPS coordinates to paired caregivers in real-time.
- **Native Phone & SMS Fallbacks**: One-tap direct dialer (`tel:`) and SMS emergency fallbacks when internet is unstable.

### 🔑 Real-Time PIN Device Pairing
- **Zero Complex Passwords**: Connect elder and caregiver devices using an instant 4-digit PIN (e.g. `7492`).
- **Live Sync Listener**: Elder device automatically detects when the caregiver inputs the PIN and updates pairing state instantly with a success chime and voice announcement.

### 🛡️ Daily Safety Check-In & 3-Min Escalation
- **"I'm OK" One-Tap Confirmation**: Simple green check-in button logging timestamped safety checks.
- **Automated Escalation**: If an elder does not respond to a scheduled check-in within the 3-minute window, the system triggers a priority missed check-in alert on the caregiver dashboard.

### 💊 Privacy-First Medication Manager
- **Camera & Gallery Photo Capture**: Snap pictures of pill boxes and prescription bottles directly inside the app (`expo-image-picker`).
- **Strict Local-Only Storage**: In accordance with medical privacy standards, medication photos remain strictly on the local device (`localPhotoRef`) and are never uploaded to cloud storage.
- **Compliance Logging**: "I Have Taken This" button logs completion timestamps and updates the caregiver's tracker.

### 🗣️ Multilingual Voice Guidance (TTS)
- **Native Voice Synthesis**: Spoken prompts powered by `expo-speech` with fallback for web.
- **20+ Regional Languages**: Full support for Hindi, Telugu, Tamil, Marathi, Bengali, Gujarati, Kannada, Malayalam, Punjabi, English, Spanish, French, and more.
- **Live Subtitle Banner**: Spoken audio is reflected in a real-time subtitle banner with an instant "STOP" audio button.

### 👩‍⚕️ Caregiver / Volunteer Safety Hub
- **Urgent Alert Takeover**: Fullscreen modal for active SOS alerts with one-tap emergency calling, ACK, and Resolve actions.
- **Live Alert Activity Feed**: Real-time `onSnapshot` feed from Firestore.
- **GPS Location & Safe Zones**: Real-time coordinates, landmark details, and geofence movement simulation (Home Zone, Park Walk, Pharmacy).
- **Check-in & Prescription Scheduler**: Configure daily check-in slots and medication schedules.

### 🔄 Dual-Role Switcher for Live Demos
- Toggle seamlessly between **👵 Elder Mode** and **👩‍⚕️ Caregiver Mode** directly from the top navigation bar for live presentations.

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
├── app/                        # React Native / Expo Mobile Application
│   ├── App.tsx                 # Root entry point & responsive viewport container
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeaderNav.tsx   # Top navigation, role toggle, PIN badge & language selector
│   │   │   ├── elder/          # Elder screens (Home, SOS Countdown, SOS Sent, Med Detail, Pairing)
│   │   │   ├── volunteer/      # Caregiver dashboard, SOS takeover, Med manager, Location tracker
│   │   │   └── common/         # Modals (Call, Auth, Login, Photo Uploader, Subtitle Banner)
│   │   ├── context/
│   │   │   └── AppContext.tsx  # Central state & real-time Firestore listeners
│   │   ├── lib/
│   │   │   ├── wellcheck.ts    # Firestore CRUD operations & retry logic
│   │   │   └── wellcheck-firebase.ts # Firebase App & Firestore singleton
│   │   └── utils/
│   │       ├── speech.ts       # expo-speech multi-language TTS engine
│   │       └── audio.ts        # Alarm, chime & tick sound synthesizers
│   └── eas.json                # EAS standalone APK build configuration
├── server/                     # Backend Cron Escalation Service
│   ├── checkin-escalation.js   # Automated missed check-in escalation runner
│   └── verify-app-flow.js      # End-to-end backend test verification script
└── firestore.rules             # Cloud Firestore security rules
```

- **Frontend**: React Native `0.81.5`, Expo SDK `54`, TypeScript `5.3`
- **Database & Cloud**: Google Cloud Firestore (`wellcheck` database in `asia-south1`)
- **Native Modules**: `expo-speech`, `expo-image-picker`, `expo-linking`, `expo-camera`
- **Build & CI/CD**: EAS Build, GitHub Actions (`.github/workflows/build-apk.yml`)

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app installed on your phone (Android/iOS)

### 1. Install & Run Development Server
```bash
# Navigate to the app directory
cd d:\wellcheck\batch\app

# Start the Expo development server
npm start
```

### 2. Preview on Your Preferred Target
- **📱 Physical Android / iOS Phone**: Scan the QR code in your terminal with the **Expo Go** app.
- **🌐 Web Browser**: Press `w` in the terminal to launch at `http://localhost:8081`.
- **🤖 Android Emulator**: Press `a` in the terminal.

---

## 📦 Standalone Android APK

You can download the prebuilt, standalone Android APK and install it directly on any Android device without needing Expo:

👉 **[Download WellCheck v1.0.0 APK](https://github.com/lanofgajanan/WellCheck/releases/download/v1.0.0/WellCheck-v1.0.0.apk)**

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
