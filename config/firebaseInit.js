// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI0btOrOoa_yw8-Z-qwKC6uVLtGqLg2B4",
  authDomain: "chess-arina.firebaseapp.com",
  projectId: "chess-arina",
  storageBucket: "chess-arina.appspot.com",
  messagingSenderId: "246671394519",
  appId: "1:246671394519:web:507f5e1a7bc6076fa89292"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app;
