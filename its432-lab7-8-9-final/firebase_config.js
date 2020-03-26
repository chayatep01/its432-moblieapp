import * as firebase from 'firebase';

var firebaseConfig = {
  // put your firebase config here
 };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();