// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3HTbgd__Yq9DmLY60r47Uv0qlIRj-ha4",
  authDomain: "speech-good.firebaseapp.com",
  projectId: "speech-good",
  storageBucket: "speech-good.appspot.com",
  messagingSenderId: "42546792293",
  appId: "1:42546792293:web:7796b7b9c0f4fb8f64838c",
  measurementId: "G-QPX27Z5Q36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export the app instance
export default app;
