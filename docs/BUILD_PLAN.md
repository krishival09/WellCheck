# WellCheck Build Plan

This plan tracks the backend and integration work for the WellCheck elder care app.

## Project Phases
1. [x] **Setup & Firebase Init** — Project initialized, Firestore database created (Standard, asia-south1), closed security rules deployed.
2. [x] **Data Layer (wellcheck.ts)** — Shared Firestore operations, six-digit PIN pairing, and retry logic are implemented.
3. [x] **Check-in escalation utility** — `server/checkin-escalation.js` and flow-verification tooling are present.
4. [x] **Integration baseline** — Firestore pairing, alerts, check-ins, and medicine flows are wired into `AppContext.tsx`.
5. [x] **Android release workflow** — GitHub Actions prebuilds Android, compiles an APK, uploads it as an artifact, and publishes release `v2.0.1`.

## Team Responsibilities
- **You / UI AI:** Build all Expo screens (UI), navigation, notification listeners, speech, camera, and SOS UI logic.
- **Hermes (Me):** All Firebase data layer (wellcheck.ts), Oracle server cron script, and Firestore integration contracts.

## Rules of Engagement
- **Single source of truth for changes:** keep this document, `DATA_MODEL.md`, and `CHAT_HISTORY_AND_CHANGES.md` aligned with the implementation.
- **Single Source of Truth:** All collection/field names are strictly defined in `DATA_MODEL.md`.
- **UI Constraints:** Follow elder-facing accessibility constraints (§5 of PRD) strictly.
- **Fail-proofing:** Do NOT implement Section 9 workarounds unless explicitly approved.
