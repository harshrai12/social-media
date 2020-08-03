import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
 apiKey: "AIzaSyDWVcibkisVH7NOtP1SC9QYwFOZGOd5Fdw",
 authDomain: "social-space1.firebaseapp.com",
 databaseURL: "https://social-space1.firebaseio.com",
 projectId: "social-space1",
 storageBucket: "social-space1.appspot.com",
 messagingSenderId: "451114834959",
 appId: "1:451114834959:web:b1e28ce3e440819866177a"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage}