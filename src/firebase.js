import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaHydIuuDSasqTTHLgA-OIJXGuQaO3ozI",
  authDomain: "frmw-gestion-clubs.firebaseapp.com",
  projectId: "frmw-gestion-clubs",
  storageBucket: "frmw-gestion-clubs.appspot.com",
  messagingSenderId: "901344467222",
  appId: "1:901344467222:web:34d98f5bfb9b6829765837",
  measurementId: "G-EZHD8PWZHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export const db = getFirestore(app);
export default app;