// services/AuthServices.ts
import {
    signInWithPhoneNumber,
    ConfirmationResult,
    ApplicationVerifier
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
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
    username?: string,
    referralCode?: string,
    gender?: string,
    dateOfBirth?: string
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
                gender: gender || "Others",
                dateOfBirth: dateOfBirth || null,
                address: [],
                orders: [],
                defaultAddress: {},
                languageSelection: "English",
                referralCode: generateReferralCode(),
                referredBy: referralCode || null,
                referralCodeUsedAt: referralCode ? serverTimestamp() : null,
                referralCount: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            
            // If referral code was used, update the referrer's count
            if (referralCode) {
                await handleReferralReward(referralCode);
            }
        } else {
            // Update existing user
            await setDoc(userRef, {
                updatedAt: serverTimestamp(),
                ...(username && { username }),
                ...(gender && { gender }),
                ...(dateOfBirth && { dateOfBirth }),
            }, { merge: true });
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
};

// Handle referral reward - update referrer's count
const handleReferralReward = async (referralCode: string) => {
    try {
        // Find the referrer using referral code
        const referrer = await getUserByReferralCode(referralCode);

        if (!referrer || !referrer.userId) {
            console.log('No referrer found for code:', referralCode);
            return;
        }

        const referrerRef = doc(db, 'users', referrer.userId);
        const referrerDoc = await getDoc(referrerRef);

        if (!referrerDoc.exists()) {
            console.log('Referrer document not found');
            return;
        }

        const referrerData = referrerDoc.data();
        const currentReferralCount = referrerData?.referralCount || 0;

        await setDoc(
            referrerRef,
            {
                referralCount: currentReferralCount + 1,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        console.log('Referral reward applied to:', referrer.userId);
    } catch (error) {
        console.error('Error handling referral reward:', error);
    }
};

/**
 * Generate a referral code
 */

const generateReferralCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Get user by referral code
 */
export const getUserByReferralCode = async (referralCode: string) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('referralCode', '==', referralCode), limit(1));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            return null;
        }
        
        const docData = snapshot.docs[0].data();
        return { id: snapshot.docs[0].id, userId: snapshot.docs[0].id, ...docData };
    } catch (error) {
        console.error('Error getting user by referral code:', error);
        throw error;
    }
};

/**
 * Apply referral code - track the referrer
 */
export const applyReferralCode = async (
    userId: string,
    referralCode: string
): Promise<{ success: boolean; message: string }> => {
    try {
        // Get the referrer user
        const referrer = await getUserByReferralCode(referralCode);
        
        if (!referrer) {
            return { success: false, message: 'Invalid referral code' };
        }
        
        if (referrer.userId === userId) {
            return { success: false, message: 'You cannot use your own referral code' };
        }
        
        // Update current user with referrer info
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            referredBy: referrer.userId,
            referralCodeUsedAt: serverTimestamp(),
        }, { merge: true });
        
        // Update referrer's referral count
        const referrerRef = doc(db, 'users', referrer.userId);
        const referrerDoc = await getDoc(referrerRef);
        const referrerData = referrerDoc.data();
        const currentReferralCount = referrerData?.referralCount || 0;
        
        await setDoc(referrerRef, {
            referralCount: currentReferralCount + 1,
        }, { merge: true });
        
        return { success: true, message: 'Referral code applied successfully!' };
    } catch (error) {
        console.error('Error applying referral code:', error);
        return { success: false, message: 'Failed to apply referral code' };
    }
};

/**
 * Get user referral stats
 */
export const getUserReferralStats = async (userId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            return null;
        }
        
        const userData = userDoc.data();
        return {
            referralCode: userData?.referralCode || '',
            referralCount: userData?.referralCount || 0,
            referredBy: userData?.referredBy || null,
        };
    } catch (error) {
        console.error('Error getting referral stats:', error);
        throw error;
    }
};

/**
 * Get the app's referral link base URL
 */
export const getReferralLink = (referralCode: string): string => {
    return `https://donttakecrap.app/ref/${referralCode}`;
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