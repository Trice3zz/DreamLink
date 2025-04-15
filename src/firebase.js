// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmUhe6_ZhV5a-D7Ou4hgNHOejci_XHYyM",
  authDomain: "dreamlink-280e0.firebaseapp.com",
  projectId: "dreamlink-280e0",
  storageBucket: "dreamlink-280e0.firebasestorage.app",
  messagingSenderId: "402938584135",
  appId: "1:402938584135:web:b179827cd506013c26e562"
 
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

