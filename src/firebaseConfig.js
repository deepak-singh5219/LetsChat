
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlKiC274wKofGwWFDeOzdD70CkGSTLHLY",
  authDomain: "letschat-7345c.firebaseapp.com",
  projectId: "letschat-7345c",
  storageBucket: "letschat-7345c.appspot.com",
  messagingSenderId: "87638720920",
  appId: "1:87638720920:web:908e585a12f33baf45ebed"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);