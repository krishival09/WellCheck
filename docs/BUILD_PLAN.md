# WellCheck Build Plan

This plan tracks the backend and integration work for the WellCheck elder care app.

## Project Phases
1. [x] **Setup & Firebase Init** — Project initialized, Firestore database created (Standard, asia-south1), closed security rules deployed.
2. [ ] **Data Layer (wellcheck.ts)** — Develop shared TypeScript module for Firestore operations, PIN-based pairing, and retry logic.
3. [ ] **Backend Cron** — Develop and deploy the Oracle Realms Server script for check-in escalation.
4. [ ] **Integration & Verification** — Verify end-to-end flow: Pairing → Data Writes → Server Cron → Alert Feed.
5. [ ] **Cleanup** — .gitignore secrets, commit final code, finalize documentation.

## Team Responsibilities
- **You / UI AI:** Build all Expo screens (UI), navigation, notification listeners, speech, camera, and SOS UI logic.
- **Hermes (Me):** All Firebase data layer (wellcheck.ts), Oracle server cron script, and Firestore integration contracts.

## Rules of Engagement
- **NO production code until reviewed.**
- **Single Source of Truth:** All collection/field names are strictly defined in `DATA_MODEL.md`.
- **UI Constraints:** Follow elder-facing accessibility constraints (§5 of PRD) strictly.
- **Fail-proofing:** Do NOT implement Section 9 workarounds unless explicitly approved.
