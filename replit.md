# Smart Student Transport Tracker

A mobile app (Expo/React Native) that helps students track bus routes, find stops, view service alerts, and calculate fares. Connects to Firebase for auth and Firestore data.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo (SDK 54), Expo Router (file-based routing), React Native
- API: Express 5
- Auth + Data: Firebase (Authentication + Firestore)
- Validation: Zod
- Build: esbuild (CJS bundle)

## Where things live

```
artifacts/mobile/
  app/
    _layout.tsx          # Root layout — Stack + AuthProvider
    index.tsx            # Auth redirect (login or tabs)
    login.tsx            # Login screen
    register.tsx         # Register screen
    (tabs)/
      _layout.tsx        # 5-tab layout (Home, Routes, Stops, Alerts, Fare)
      index.tsx          # Home screen
      routes.tsx         # Route Planner
      stops.tsx          # Stops browser
      alerts.tsx         # Service alerts
      fare.tsx           # Fare calculator
  context/
    AuthContext.tsx      # Firebase auth state + demo mode fallback
  lib/
    firebase.ts          # Firebase init (reads EXPO_PUBLIC_ env vars)
    sampleData.ts        # Sample routes, stops, alerts, fare rules
  constants/
    colors.ts            # Transit blue theme (light + dark)
```

## Firebase Setup

To enable real Firebase auth and Firestore, add these secrets in Replit (Settings → Secrets):

| Secret | Where to find it |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project settings |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project settings |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Project settings |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project settings |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project settings |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Project settings |

Without these secrets the app runs in **demo mode** — auth uses AsyncStorage and data uses sample records. This lets you develop UI without a live Firebase project.

## Firestore Sample Data

Seed these collections in your Firestore database. See `lib/sampleData.ts` for the full schema and sample values.

| Collection | Fields |
|---|---|
| `routes` | id, name, from, to, departureTime, arrivalTime, stops[], fare, status |
| `stops` | id, name, routes[], zone, facilities[] |
| `alerts` | id, title, message, type (info/warning/critical), createdAt, isActive |
| `fareRules` | id, fromZone, toZone, price, studentPrice |

## Architecture decisions

- **Auth-first flow**: App opens to Login → Register → Tabs. No tab content is accessible without a user session.
- **Demo mode fallback**: If Firebase env vars are not set, auth and data fall back to AsyncStorage + sample data, so the UI is always usable during development.
- **Sample data in code**: `lib/sampleData.ts` holds typed sample records that are used when Firestore is not configured.
- **NativeTabs + liquid glass**: iOS 26+ gets native liquid glass tab bar automatically; older iOS/Android/web gets the BlurView classic tab bar.
- **Dark mode ready**: `constants/colors.ts` defines both `light` and `dark` palettes; `useColors()` picks the right one automatically.

## Product

Students can: log in or register, view the home dashboard (upcoming departure, active alerts, quick actions), plan routes from a searchable list, browse stops filtered by zone, read service alerts filtered by severity, and calculate fares between any two zones (with student concession pricing).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Firebase auth requires `getReactNativePersistence(AsyncStorage)` — the web `getAuth()` does not work in React Native.
- Never hardcode Firebase config values — use `EXPO_PUBLIC_` env vars only.
- Only restart the Expo workflow when changing dependencies or hitting Metro errors — Hot Module Reloading handles code changes automatically.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `expo` skill for React Native patterns, safe area, and Expo Router guidance
