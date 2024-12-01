import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  // Add Firebase Config here
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
