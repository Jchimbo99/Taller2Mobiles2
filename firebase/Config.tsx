// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZs9pQ2ibNEldUvjBEqqpuOezAlRnrRJ0",
  authDomain: "mi-proyecto-de73d.firebaseapp.com",
  databaseURL: "https://mi-proyecto-de73d-default-rtdb.firebaseio.com",
  projectId: "mi-proyecto-de73d",
  storageBucket: "mi-proyecto-de73d.firebasestorage.app",
  messagingSenderId: "45113966134",
  appId: "1:45113966134:web:7cf5bbdde4fdc6f86de297"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);