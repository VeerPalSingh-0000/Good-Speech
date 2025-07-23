// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 1. Import Firestore
import { getAuth } from "firebase/auth";           // 2. Import Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3HTbgd__Yq9DmLY60r47Uv0qlIRj-ha4",
  authDomain: "speech-good.firebaseapp.com",
  projectId: "speech-good",
  storageBucket: "speech-good.appspot.com", // Corrected this for you
  messagingSenderId: "42546792293",
  appId: "1:42546792293:web:7796b7b9c0f4fb8f64838c",
  measurementId: "G-QPX27Z5Q36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export other Firebase services
const analytics = getAnalytics(app);
export const db = getFirestore(app); // 3. Initialize and EXPORT db
export const auth = getAuth(app);   // 4. Initialize and EXPORT auth
// Add these functions to save data to Firebase
const saveToFirebase = async (type, data) => {
  try {
    await addResult({
      type: type, // 'sound', 'reading', 'varnmala'
      data: data,
      userId: user.uid,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Firebase save error:', error);
  }
};

const loadHistoryFromFirebase = async () => {
  try {
    const results = await getResults();
    // Filter results by user and organize by type
    return results.filter(result => result.userId === user.uid);
  } catch (error) {
    console.error('Firebase load error:', error);
    return [];
  }
};

// You can also export the app if you need it elsewhere
export default app;