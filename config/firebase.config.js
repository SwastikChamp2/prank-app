import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyC3YQpcvTOIPNbcjzQQDIaTQBTMd1pI7G8",
    authDomain: "dont-take-crap-app.firebaseapp.com",
    projectId: "dont-take-crap-app",
    storageBucket: "dont-take-crap-app.firebasestorage.app",
    messagingSenderId: "734885561426",
    appId: "1:734885561426:web:b98c54375134c58aae8b8b",
    measurementId: "G-N06T13TJ1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;