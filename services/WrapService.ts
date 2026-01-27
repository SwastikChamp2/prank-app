// services/WrapService.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface Wrap {
    id: string;
    wrapTitle: string;
    price: number;
    currency: string;
    wrapImage: string;
    createdAt: string;
    updatedAt: string;
}

export interface WrapCard {
    id: string;
    name: string;
    price: string | null;
    image: string;
}

/**
 * Fetch all wraps
 */
export const fetchAllWraps = async (): Promise<WrapCard[]> => {
    try {
        const wrapsRef = collection(db, 'wraps');
        const snapshot = await getDocs(wrapsRef);

        const wraps: WrapCard[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Wrap;
            return {
                id: data.id,
                name: data.wrapTitle,
                price: data.price ? data.price.toString() : null,
                image: data.wrapImage,
            };
        });

        return wraps;
    } catch (error) {
        console.error('Error fetching wraps:', error);
        throw error;
    }
};

/**
 * Fetch a single wrap by ID
 */
export const fetchWrapById = async (wrapId: string): Promise<Wrap | null> => {
    try {
        const wrapsRef = collection(db, 'wraps');
        const snapshot = await getDocs(wrapsRef);

        const wrap = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Wrap))
            .find((w) => w.id === wrapId);

        return wrap || null;
    } catch (error) {
        console.error('Error fetching wrap by ID:', error);
        throw error;
    }
};
