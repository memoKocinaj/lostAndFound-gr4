/* import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFnDZBtLYW_hrRybnZxszSP5E5CVGXk4M",
  authDomain: "find-lost-things-de6e1.firebaseapp.com",
  projectId: "find-lost-things-de6e1",
  storageBucket: "find-lost-things-de6e1.firebasestorage.app",
  messagingSenderId: "749423133861",
  appId: "1:749423133861:web:5a2ed9001308299027f94c",
  measurementId: "G-0XR40HG7LB",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export default app;       */

// Firebase per WEB
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFnDZBtLYW_hrRybnZxszSP5E5CVGXk4M",
  authDomain: "find-lost-things-de6e1.firebaseapp.com",
  projectId: "find-lost-things-de6e1",
  storageBucket: "find-lost-things-de6e1.firebasestorage.app",
  messagingSenderId: "749423133861",
  appId: "1:749423133861:web:5a2ed9001308299027f94c",
  measurementId: "G-0XR40HG7LB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
