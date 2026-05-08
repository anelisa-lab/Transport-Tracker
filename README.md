# 1. Clone the repository
git clone https://github.com/anelisa-lab/Transport-Tracker.git
cd Transport-Tracker

# 2. Install dependencies
pnpm install

# 3. (Optional) Add Firebase secrets to .env or Replit Secrets:
#    EXPO_PUBLIC_FIREBASE_API_KEY=...
#    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
#    EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
#    (Without these, the app runs in demo mode — fully functional)

# 4. Start the Expo dev server
pnpm --filter @workspace/mobile run dev

# 5. Scan the QR code with Expo Go (Android/iOS)
#    OR press 'i' for iOS Simulator / 'a' for Android Emulator
Demo Mode: If no Firebase environment variables are set, the app operates fully in demo mode — authentication uses a local AsyncStorage account and all data comes from lib/sampleData.ts. No Firebase project is needed to evaluate the UI.
