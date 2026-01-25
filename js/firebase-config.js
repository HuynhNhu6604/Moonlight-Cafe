// Firebase Configuration for Moonlight Cafe
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getDatabase, ref, push, set, get, update, remove, onValue, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Firebase config for Moonlight Cafe project
const firebaseConfig = {
    apiKey: "AIzaSyBhND1gGt1v0_hIBvda-YuOI5jGSqy2Jn8",
    authDomain: "moonlight-cafe-57e5d.firebaseapp.com",
    databaseURL: "https://moonlight-cafe-57e5d-default-rtdb.firebaseio.com",
    projectId: "moonlight-cafe-57e5d",
    storageBucket: "moonlight-cafe-57e5d.firebasestorage.app",
    messagingSenderId: "304081978863",
    appId: "1:304081978863:web:ee97854f5015ecf601221a",
    measurementId: "G-PRSNTZ81C3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Export để sử dụng ở các file khác
export {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    ref,
    push,
    set,
    get,
    update,
    remove,
    onValue,
    query,
    orderByChild,
    equalTo
};

// Cloudinary Config
export const cloudinaryConfig = {
    cloudName: 'djxg1c2da',
    uploadPreset: 'YOUR_UPLOAD_PRESET'
};
