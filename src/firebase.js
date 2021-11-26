import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCOZMSnSCCNV9jKrkjoKiccAdEdlKzzbhA",
    authDomain: "warehouse-proje.firebaseapp.com",
    projectId: "warehouse-proje",
    storageBucket: "warehouse-proje.appspot.com",
    messagingSenderId: "660569509659",
    appId: "1:660569509659:web:516dda6f4710abffbdcdbe",
    measurementId: "G-E1876TZGFJ"
});


const db = firebase.firestore();

export { db }