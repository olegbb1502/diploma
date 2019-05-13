import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDyiv8VFc3SiJNsatPGY_uzri2UzQpWlAw",
    authDomain: "macro-anchor-227911.firebaseapp.com",
    databaseURL: "https://macro-anchor-227911.firebaseio.com",
    projectId: "macro-anchor-227911",
    storageBucket: "macro-anchor-227911.appspot.com",
    messagingSenderId: "443145465938",
    appId: "1:443145465938:web:759aaa4b1e52f0fb"
};

firebase.initializeApp(config);
export default firebase;