import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDIAG_IMgGBAhTvv2E6fr3-rn84b7piznM",
  authDomain: "ask-gpt-5080a.firebaseapp.com",
  projectId: "ask-gpt-5080a",
  storageBucket: "ask-gpt-5080a.firebasestorage.app",
  messagingSenderId: "983920815743",
  appId: "1:983920815743:web:17facb330d7b0ddf61194a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
