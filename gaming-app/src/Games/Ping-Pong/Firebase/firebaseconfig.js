import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB-s_NpdUzkZcKe_V3kW6j7x6RVPtVPOmE",
  authDomain: "game-dev-b6652.firebaseapp.com",
  projectId: "game-dev-b6652",
  storageBucket: "game-dev-b6652.appspot.com",
  messagingSenderId: "820409525706",
  appId: "1:820409525706:web:0610c3139b54d1e4075b33",
  databaseURL:
    "https://game-dev-b6652-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth  = getAuth(app);
const db = getDatabase(app);

export {db, auth}