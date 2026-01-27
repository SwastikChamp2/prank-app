// services/BoxService.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface Box {
    id: string;
    boxTitle: string;
    price: number;
    currency: string;
    boxImage: string;
    createdAt: string;
    updatedAt: string;
}

export interface BoxCard {
    id: string;
    name: string;
    price: string | null;
    image: string;
}

/**
 * Fetch all boxes
 */
export const fetchAllBoxes = async (): Promise<BoxCard[]> => {
    try {
        const boxesRef = collection(db, 'boxes');
        const snapshot = await getDocs(boxesRef);

        const boxes: BoxCard[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Box;
            return {
                id: data.id,
                name: data.boxTitle,
                price: data.price ? data.price.toString() : null,
                image: data.boxImage,
            };
        });

        return boxes;
    } catch (error) {
        console.error('Error fetching boxes:', error);
        throw error;
    }
};

/**
 * Fetch a single box by ID
 */
export const fetchBoxById = async (boxId: string): Promise<Box | null> => {
    try {
        const boxesRef = collection(db, 'boxes');
        const snapshot = await getDocs(boxesRef);

        const box = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Box))
            .find((b) => b.id === boxId);

        return box || null;
    } catch (error) {
        console.error('Error fetching box by ID:', error);
        throw error;
    }
};
