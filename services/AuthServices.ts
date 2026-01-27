// services/AuthServices.ts
import {
    signInWithPhoneNumber,
    ConfirmationResult,
    ApplicationVerifier
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendOTP = async (
    phoneNumber: string,
    appVerifier: ApplicationVerifier
): Promise<ConfirmationResult> => {
    try {
        const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            appVerifier
        );
        return confirmationResult;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

export const verifyOTP = async (
    confirmationResult: ConfirmationResult,
    otp: string
) => {
    try {
        const result = await confirmationResult.confirm(otp);
        const user = result.user;

        console.log('OTP verified successfully for user:', user.uid);

        return user;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};

export const createOrUpdateUser = async (
    userId: string,
    phoneNumber: string,
    username?: string
) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(userRef, {
                userId: userId,
                phoneNumber: phoneNumber,
                username: username || '',
                gender: "Others",
                address: [],
                orders: [],
                defaultAddress: {},
                languageSelection: "English",
                referralCode: generateReferralCode(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } else {
            // Update existing user
            await setDoc(userRef, {
                updatedAt: serverTimestamp(),
                ...(username && { username }),
            }, { merge: true });
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
};

const generateReferralCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const signOutUser = async () => {
    try {
        console.log('Signing out user...');

        // Sign out from Firebase - this will automatically clear AsyncStorage
        await auth.signOut();

        // Clear any global state
        (global as any).confirmationResult = null;
        (global as any).signupUsername = null;

        console.log('User signed out successfully');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

/**
 * Enable persistent login - user will remain logged in across app sessions
 * Call this after successful authentication
 */
export const enablePersistentLogin = async (phoneNumber?: string) => {
    try {
        await AsyncStorage.setItem('persistLogin', 'true');
        if (phoneNumber) {
            await AsyncStorage.setItem('lastLoginPhone', phoneNumber);
        }
        console.log('Persistent login enabled');
    } catch (error) {
        console.error('Error enabling persistent login:', error);
        throw error;
    }
};

/**
 * Disable persistent login - user will be logged out on next app restart
 */
export const disablePersistentLogin = async () => {
    try {
        await AsyncStorage.setItem('persistLogin', 'false');
        await AsyncStorage.removeItem('lastLoginPhone');
        console.log('Persistent login disabled');
    } catch (error) {
        console.error('Error disabling persistent login:', error);
        throw error;
    }
};

/**
 * Check if persistent login is enabled
 */
export const isPersistentLoginEnabled = async (): Promise<boolean> => {
    try {
        const persistLogin = await AsyncStorage.getItem('persistLogin');
        return persistLogin === 'true';
    } catch (error) {
        console.error('Error checking persistent login status:', error);
        return false;
    }
};

/**
 * Get the last logged-in phone number (if available)
 */
export const getLastLoginPhone = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('lastLoginPhone');
    } catch (error) {
        console.error('Error getting last login phone:', error);
        return null;
    }
};