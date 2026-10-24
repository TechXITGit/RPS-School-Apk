// Firebase App, Authentication & Firestore Configuration for RPS Admin Panel
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Web & Mobile Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMn7zVPgjZGSJkG0eLErKc4zWxANLeAro",
  authDomain: "rpsadminpanel.firebaseapp.com",
  projectId: "rpsadminpanel",
  storageBucket: "rpsadminpanel.firebasestorage.app",
  messagingSenderId: "586835546790",
  appId: "1:586835546790:web:f733b7d32b56b1a910da67",
};

// Initialize or retrieve existing Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Cross-platform Auth instance with persistence
let auth;
try {
  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch (e) {
  // If already initialized (e.g. during Hot Reload / Fast Refresh), get active instance
  auth = getAuth(app);
}

// Firestore Database instance
const db = getFirestore(app);

export { app, auth, db };
export default app;


