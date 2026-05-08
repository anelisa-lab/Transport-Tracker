import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

interface DemoUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextValue {
  user: FirebaseUser | DemoUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER_KEY = "@smart_transport/demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      AsyncStorage.getItem(DEMO_USER_KEY)
        .then((stored) => {
          if (stored) setUser(JSON.parse(stored));
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isFirebaseConfigured && firebaseAuth) {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } else {
      const demoUser: DemoUser = {
        uid: "demo-" + email,
        email,
        displayName: email.split("@")[0],
      };
      await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      if (isFirebaseConfigured && firebaseAuth) {
        const cred = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );
        await updateProfile(cred.user, { displayName: name });
        setUser({ ...cred.user, displayName: name });
      } else {
        const demoUser: DemoUser = {
          uid: "demo-" + email,
          email,
          displayName: name,
        };
        await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    if (isFirebaseConfigured && firebaseAuth) {
      await firebaseSignOut(firebaseAuth);
    } else {
      await AsyncStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
    }
  }, []);

  const updateDisplayName = useCallback(
    async (name: string) => {
      if (isFirebaseConfigured && firebaseAuth && firebaseAuth.currentUser) {
        await updateProfile(firebaseAuth.currentUser, { displayName: name });
        setUser((prev) => (prev ? { ...prev, displayName: name } : prev));
      } else if (user) {
        const updated = { ...user, displayName: name };
        await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
        setUser(updated as DemoUser);
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateDisplayName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
