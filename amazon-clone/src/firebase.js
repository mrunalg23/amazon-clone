import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA4Cb2hDZtZvbJoV3jrnXV1LFwsvBIWNsk",
    authDomain: "challenge-4c39c.firebaseapp.com",
    projectId: "challenge-4c39c",
    storageBucket: "challenge-4c39c.appspot.com",
    messagingSenderId: "916091546307",
    appId: "1:916091546307:web:3d7679c4bf0e0d23839076",
    measurementId: "G-5TBVDZPQRJ"
  };
  
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth= firebase.auth();

  export {db,auth};