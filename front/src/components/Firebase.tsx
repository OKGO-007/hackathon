// インポート対象のFirebaseApp,Auth,Firestore,FirebaseStorageはJavaScriptのモジュールです
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";

// process.env~で先ほど.envファイルに入力したfirebaseConfigの値を参照しています
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// NOTE >> Firebaseの初期化を行います。
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export { db, provider, };
