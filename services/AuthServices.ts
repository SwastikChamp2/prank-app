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
        // Sign out from Firebase
        await auth.signOut();

        // Clear AsyncStorage
        await AsyncStorage.removeItem('userToken');

        // Clear any global state
        (global as any).confirmationResult = null;
        (global as any).signupUsername = null;

        console.log('User signed out successfully');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};