// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1evgzxltNAGq2-7QbPNL-Anp1R0sfaCU",
  authDomain: "dr-web-b037b.firebaseapp.com",
  projectId: "dr-web-b037b",
  storageBucket: "dr-web-b037b.firebasestorage.app",
  messagingSenderId: "583351023688",
  appId: "1:583351023688:web:c14bf68b71f5a810da407d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
