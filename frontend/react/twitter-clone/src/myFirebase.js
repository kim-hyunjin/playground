import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
        apiKey: process.env.REACT_APP_apiKey,
        authDomain: process.env.REACT_APP_authDomain,
        projectId: process.env.REACT_APP_projectId,
        storageBucket: process.env.REACT_APP_storageBucket,
        messagingSenderId: process.env.REACT_APP_messagingSenderId,
        appId: process.env.REACT_APP_appId,
};

firebase.initializeApp(firebaseConfig);

export const authService = firebase.auth();
export const firebaseInstance = firebase;
export const dbService = firebase.firestore();
export const storageService = firebase.storage();