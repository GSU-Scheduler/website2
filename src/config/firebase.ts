// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import dotenv from 'dotenv';
dotenv.config();
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "gsu-scheduler.firebaseapp.com",
  projectId: "gsu-scheduler",
  storageBucket: "gsu-scheduler.appspot.com",
  messagingSenderId: "275025112031",
  appId: "1:275025112031:web:25409096c87bd24ccc726a",
  measurementId: "G-5FJ05SH71J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };