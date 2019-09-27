import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Add the Firebase services that you want to use
var firebaseConfig = {
    apiKey: "AIzaSyD8W2bWTooeN_ULFPa0tNFmwMbFdJS5ICM",
    authDomain: "proof-of-beer.firebaseapp.com",
    databaseURL: "https://proof-of-beer.firebaseio.com",
    projectId: "proof-of-beer",
    storageBucket: "",
    messagingSenderId: "508986271300",
    appId: "1:508986271300:web:8cbc068a562a558013be11"
};

// Initialize Firebase
firebase.default.initializeApp(firebaseConfig)

export default firebase;