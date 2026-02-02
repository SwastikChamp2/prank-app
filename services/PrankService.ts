// services/PrankService.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface Prank {
    id: string;
    prankTitle: string;
    prankDescription: string;
    prankCategory: string;
    price: number;
    currency: string;
    coverImage: string;
    previewImage: string;
    createdAt: string;
    updatedAt: string;
}

export interface PrankCard {
    id: string;
    name: string;
    price: string;
    image: string;
}

/**
 * Fetch all pranks
 */
export const fetchAllPranks = async (): Promise<PrankCard[]> => {
    try {
        const pranksRef = collection(db, 'pranks');
        const snapshot = await getDocs(pranksRef);

        const pranks: PrankCard[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Prank;
            return {
                id: data.id,
                name: data.prankTitle,
                price: data.price.toString(),
                image: data.coverImage,
            };
        });

        return pranks;
    } catch (error) {
        console.error('Error fetching pranks:', error);
        throw error;
    }
};

/**
 * Fetch pranks by category
 */
export const fetchPranksByCategory = async (categoryName: string): Promise<PrankCard[]> => {
    try {
        const pranksRef = collection(db, 'pranks');
        const q = query(pranksRef, where('prankCategory', '==', categoryName));
        const snapshot = await getDocs(q);

        const pranks: PrankCard[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Prank;
            return {
                id: data.id,
                name: data.prankTitle,
                price: data.price.toString(),
                image: data.previewImage,
            };
        });

        return pranks;
    } catch (error) {
        console.error('Error fetching pranks by category:', error);
        throw error;
    }
};

/**
 * Fetch a single prank by ID
 */
export const fetchPrankById = async (prankId: string): Promise<Prank | null> => {
    try {
        const pranksRef = collection(db, 'pranks');
        const q = query(pranksRef, where('id', '==', prankId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const data = snapshot.docs[0].data() as Prank;
        return data;
    } catch (error) {
        console.error('Error fetching prank by ID:', error);
        throw error;
    }
};
