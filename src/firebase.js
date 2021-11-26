import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "projects-2-e89ca.firebaseapp.com",
    projectId: "projects-2-e89ca",
    storageBucket: "projects-2-e89ca.appspot.com",
    messagingSenderId: "187471994128",
    appId: "1:187471994128:web:c689561ebd0375bf4a5995",
});

const db = firebase.firestore();

export { db };
