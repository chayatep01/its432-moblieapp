import * as firebase from 'firebase';

var firebaseConfig = {
  // put your firebase config here
  apiKey: "AIzaSyDlWXLPonklNIW2fZKOYlwvP3EakY8uI-8",
    authDomain: "its432-lab7.firebaseapp.com",
    databaseURL: "https://its432-lab7.firebaseio.com",
    projectId: "its432-lab7",
    storageBucket: "its432-lab7.appspot.com",
    messagingSenderId: "183722949148",
    appId: "1:183722949148:web:9a6a40db304b40619e3dd9",
    measurementId: "G-K5RM1FTCRD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();