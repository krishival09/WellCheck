<div align="center">

# 🛡️ WellCheck
### *A safety companion for seniors — built with love*

</div>

---

## 👨‍👩‍👧 For Families & Caretakers

> **You don't need to be tech-savvy to use this. This section is just for you.**

WellCheck helps you stay connected with your elderly loved ones — even when you're not in the same room. It lets seniors check in daily, gives you instant alerts if something seems wrong, and lets them call for help with one tap.

### 📲 Option 1 — Try it right now (no installation needed)

You can open WellCheck directly in the phone's browser. No downloading, no sign-up.

1. Open the link in Chrome or Safari on your phone:
   👉 **[Open WellCheck App](https://lanofgajanan.github.io/WellCheck/)**  
   *(or scan the QR code below if you have one)*

2. You'll be asked to choose a role:
   - **Senior / Elder** 👴 — for your elderly family member's phone
   - **Volunteer Caregiver** 🙋 — for your phone

3. That's it. Both phones connect automatically.

---

### 📱 Option 2 — Install the app on Android

For a smoother experience, install it as a proper app:

1. Go to: **[Download WellCheck APK](https://github.com/lanofgajanan/WellCheck/releases/latest)**
2. Tap **`app-release.apk`** to download it
3. On your phone go to **Settings → Install unknown apps** → allow your browser
4. Open the downloaded file and tap **Install**

> ℹ️ This is a safe file built directly from our source code. It's not on the Play Store yet — we're working on it!

---

### 🧓 What can WellCheck do?

| Feature | What it means for you |
|---|---|
| ✅ Daily Check-Ins | Senior taps "I'm okay" each day. You get notified if they miss it. |
| 🚨 SOS Button | One big red button. Instantly alerts you with location. |
| ⏱️ 3-Minute Escalation | If no response in 3 minutes, alert escalates automatically. |
| 🗣️ Voice Guidance | Speaks instructions aloud in 20+ languages — great for seniors. |
| 🌙 Dark Mode | Easy on the eyes, day or night. |
| 📍 Location Sharing | Know where your loved one is at all times. |
| 💊 Medication Reminders | Track medicines with photos and schedules. |

---

### 📞 Testing with Two Phones (step by step)

> This is how we recommend you test it with a family member before daily use.

1. Make sure **both phones are on the same Wi-Fi network**
2. On **Phone 1 (the senior's phone)**:
   - Open the app link
   - Select **Elder** 👴 → tap **Start Elder Experience**
   - A 4-digit PIN will appear on screen (e.g. `7492`)
3. On **Phone 2 (your phone)**:
   - Open the same link
   - Select **Volunteer Caregiver** 🙋
   - Enter the PIN in the **Quick Connect** box → both phones pair instantly!
4. Test the **SOS button** on Phone 1 — your phone will immediately show the emergency takeover screen with a siren alert

---

---

## 🧑‍💻 For Developers & Contributors

> Want to build on top of WellCheck, fix bugs, or add features? This section is for you.

### 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native Web + Vite + Tailwind CSS v4 |
| Backend | Firebase Firestore (`wellcheck` db, `asia-south1`) |
| Auth / State | Custom AppContext with localStorage persistence |
| Native Build | Expo SDK 54 + Gradle (Android) |
| CI/CD | GitHub Actions (`.github/workflows/build-apk.yml`) |
| Maps | Google Maps universal deep links |

### 📁 Project Structure

```
wellcheck/
├── batch/
│   ├── app/                        # Main Expo + React Native Web app
│   │   ├── src/
│   │   │   ├── mobile/
│   │   │   │   ├── elder/          # Elder UI screens
│   │   │   │   └── volunteer/      # Volunteer/caregiver UI screens
│   │   │   ├── context/
│   │   │   │   └── AppContext.tsx   # Global state, login, pairing logic
│   │   │   └── lib/
│   │   │       └── wellcheck-firebase.ts  # Firebase integration
│   │   ├── index.js                # Expo native entry point
│   │   ├── app.json                # Expo config
│   │   └── package.json
│   ├── .github/workflows/
│   │   └── build-apk.yml           # Auto APK build + GitHub Release
│   ├── CHANGELOG.md
│   └── README.md
└── (legacy web tools in root)
```

### 🚀 Getting Started (Local Dev)

```bash
# Clone the repo
git clone https://github.com/lanofgajanan/WellCheck.git
cd WellCheck/batch/app

# Install dependencies
npm install --legacy-peer-deps

# Run the web version (opens in browser)
npm run dev

# OR run on Android device via Expo Go
npx expo start
```

> **Web dev server** runs at `http://localhost:3000` (and broadcasts on your local network IP for phone testing)

### 🔥 Firebase Setup

The app uses Firestore. Create a `.env` file in `batch/app/`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 🔧 Building the APK

Every push to `main` automatically triggers a GitHub Actions build that:
1. Runs `npx expo prebuild`
2. Compiles via `./gradlew assembleRelease`
3. Publishes the APK to GitHub Releases

To trigger manually: go to **Actions → Build Android APK & Publish Release → Run workflow**

### 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes with clear messages
4. Open a Pull Request describing what you changed and why

---

---

## 👨‍💻 The Team

> *Built with late nights, chai, and a lot of love for grandparents everywhere.*

<br>

| Role | Name |
|---|---|
| 🎨 **Frontend Development** | [Rachit Rajput](https://github.com/rachitrajput18) |
| 🎨 **Frontend Development** | [Krishival Reddy Palley](https://github.com/krishival09) |
| ⚙️ **Backend & Architecture** | [Gajanan Lohar](https://github.com/lanofgajanan) |

<br>

---

<div align="center">

Made for the people who matter most — our elders. 🧡

</div>
