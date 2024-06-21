import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQx0s0ZuKnfVyebHUQatkgW8O8fJ9t2_o",
  authDomain: "odyssey-6f30f.firebaseapp.com",
  projectId: "odyssey-6f30f",
  storageBucket: "odyssey-6f30f.appspot.com",
  messagingSenderId: "937608328711",
  appId: "1:937608328711:web:1a2a04f7a90878da4e1ca2"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };