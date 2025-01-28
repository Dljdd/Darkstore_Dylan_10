// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDDNW3KR3872IhzmVynQi9BZyonk34_QVw",
    authDomain: "mumbaihacks-d25ec.firebaseapp.com",
    databaseURL: "https://mumbaihacks-d25ec-default-rtdb.firebaseio.com",
    projectId: "mumbaihacks-d25ec",
    storageBucket: "mumbaihacks-d25ec.appspot.com",
    messagingSenderId: "1021560488594",
    appId: "1:1021560488594:web:10cef061a0b13ce988dc4b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
