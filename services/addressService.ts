// services/addressService.ts
import { db, auth } from '../config/firebase.config';
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

export interface AddressData {
    id: string;
    addressLabel: string;
    buildingName: string;
    streetName: string;
    pincode: string;
    flatNumber: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    autofetchedAddress: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
    createdAt: Timestamp;
}

/**
 * Save a new address to the user's document
 */
export const saveAddress = async (addressData: Omit<AddressData, 'id' | 'createdAt' | 'isDefault'>): Promise<boolean> => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const userDocRef = doc(db, 'users', currentUser.uid);

        // Check if user document exists
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error('User document not found');
        }

        // Generate unique ID for the address
        const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create the address object with all required fields
        const newAddress: AddressData = {
            id: addressId,
            ...addressData,
            isDefault: false,
            createdAt: Timestamp.now(),
        };

        // Add the new address to the addresses array
        await updateDoc(userDocRef, {
            addresses: arrayUnion(newAddress)
        });

        console.log('Address saved successfully:', newAddress);
        return true;
    } catch (error) {
        console.error('Error saving address:', error);
        throw error;
    }
};

/**
 * Get all addresses for the current user
 */
export const getUserAddresses = async (): Promise<AddressData[]> => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error('User document not found');
        }

        const userData = userDocSnap.data();
        const addresses: AddressData[] = userData.addresses || [];

        // Sort by createdAt (most recent first)
        addresses.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        return addresses;
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (addressId: string): Promise<boolean> => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error('User document not found');
        }

        const userData = userDocSnap.data();
        let addresses: AddressData[] = userData.addresses || [];

        // Update isDefault for all addresses
        addresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));

        // Update the document
        await updateDoc(userDocRef, {
            addresses: addresses
        });

        console.log('Default address updated successfully');
        return true;
    } catch (error) {
        console.error('Error setting default address:', error);
        throw error;
    }
};

/**
 * Ensure at least one address is set as default
 */
export const ensureDefaultAddress = async (): Promise<AddressData[]> => {
    try {
        const addresses = await getUserAddresses();

        if (addresses.length === 0) {
            return [];
        }

        // Check if any address is marked as default
        const hasDefault = addresses.some(addr => addr.isDefault);

        if (!hasDefault) {
            // Set the most recent address as default
            const mostRecentAddress = addresses[0];
            await setDefaultAddress(mostRecentAddress.id);

            // Update local array
            addresses[0].isDefault = true;
        }

        return addresses;
    } catch (error) {
        console.error('Error ensuring default address:', error);
        throw error;
    }
};