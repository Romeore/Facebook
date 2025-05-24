// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2u2rn-72oUpHhw_PhduyseqT5SfgqTbk",
  authDomain: "socialmediaproject-55535.firebaseapp.com",
  projectId: "socialmediaproject-55535",
  storageBucket: "socialmediaproject-55535.firebasestorage.app",
  messagingSenderId: "374762228931",
  appId: "1:374762228931:web:0f8e3912a199fa822b2676",
  measurementId: "G-WQ6SVBJXC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app)
export {auth}
export default database
