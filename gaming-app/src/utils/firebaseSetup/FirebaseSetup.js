// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//-firebase setup details
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
export const db = getDatabase(app);

export const auth = getAuth();

export const provider = new GoogleAuthProvider();
export const gameListRef = ref(db, "GameSession/");
