// firebase-client.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAJSlylMfDIgED1lCOEMoZwU68Mfar2aNM",
  authDomain: "fit-fusion-934c5.firebaseapp.com",
  projectId: "fit-fusion-934c5",
  storageBucket: "fit-fusion-934c5.appspot.com",
  messagingSenderId: "444551416447",
  appId: "1:444551416447:web:d0db4cc58e184022c40d4a",
  measurementId: "G-FT5GTSYWXV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Ensure Analytics is only initialized on the client

export { db, auth, analytics };
