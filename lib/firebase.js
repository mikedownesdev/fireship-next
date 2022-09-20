import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBTHhsTWCSQJMmErnO0E8DLGpmhgBv09wE",
    authDomain: "fireship-next-1e3dd.firebaseapp.com",
    projectId: "fireship-next-1e3dd",
    storageBucket: "fireship-next-1e3dd.appspot.com",
    messagingSenderId: "243217806251",
    appId: "1:243217806251:web:575a20bfb6542972e458ee",
    measurementId: "G-CW2ZN0JL1W"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();