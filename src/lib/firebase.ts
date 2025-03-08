// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhMK3FUFKN_VRYyxr-mDLV3XEyrk_4OyM",
  authDomain: "lunaris-d258d.firebaseapp.com",
  projectId: "lunaris-d258d",
  storageBucket: "lunaris-d258d.firebasestorage.app",
  messagingSenderId: "455807716228",
  appId: "1:455807716228:web:08ac57f69cf2bbd7c6ebd1",
  measurementId: "G-7H9DNYN0JT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };