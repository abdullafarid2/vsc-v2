// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgJauMbugaTkJ_VKcd1oA8UoUTGwNqpjE",
  authDomain: "virtual-shopping-centre.firebaseapp.com",
  projectId: "virtual-shopping-centre",
  storageBucket: "virtual-shopping-centre.appspot.com",
  messagingSenderId: "709973525158",
  appId: "1:709973525158:web:79e53cd2d6a92ddfb4aa67",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
