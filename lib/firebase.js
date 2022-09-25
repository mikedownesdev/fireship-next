/**
 * Imports & Configs
 */
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


/**
 * Some service exports
 */
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;



/**
 * Gets a users/{uid} document with username
 * @param {*} username 
 */
export async function getUserWithUsername(username) {
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1)
    const userDoc = (await query.get()).docs[0]
return userDoc
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc 
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        /**
         * Gotcha! firestore timestamp NOT serializable to JSON.  
         * // Must convert to milliseconds
         */
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    }
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;

/**
 * A special function that tells Firestore to save a 
 * timestamp on a document on the server. 
 * 
 * Using it is much more reliable than a javascript date, 
 * and it will be saved in a consistent format because 
 * it doesn't rely on the user's client-side clock
 */
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

