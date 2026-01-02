// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrk6Tbyd11h53JYKu5pNtwhEGKIpw23JQ",
  authDomain: "livsy-5f493.firebaseapp.com",
  projectId: "livsy-5f493",
  storageBucket: "livsy-5f493.firebasestorage.app",
  messagingSenderId: "668970176393",
  appId: "1:668970176393:web:ffcb8d82c4309808759b58",
  measurementId: "G-2XZS6YVYRQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
