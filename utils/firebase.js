import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";

var firebaseApp = firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SERVICE_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const firestore = firebase.firestore();
const firestorage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { firebase, firebaseApp, firestore, firestorage, timestamp };
