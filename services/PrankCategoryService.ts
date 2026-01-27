// services/PrankCategoryService.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export interface PrankCategory {
    id?: string;
    prankCategoryName: string;
    prankCategoryImage: string;
    totalPranks: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CategoryCard {
    id: string;
    title: string;
    count: string;
    imageUrl: string;
}

/**
 * Fetch all prank categories from Firebase
 */
export const fetchPrankCategories = async (): Promise<CategoryCard[]> => {
    try {
        const categoriesRef = collection(db, 'prank-category');
        const snapshot = await getDocs(categoriesRef);

        const categories: CategoryCard[] = snapshot.docs.map((doc) => {
            const data = doc.data() as PrankCategory;
            return {
                id: doc.id,
                title: data.prankCategoryName,
                count: `${data.totalPranks.length} Pranks`,
                imageUrl: data.prankCategoryImage,
            };
        });

        return categories;
    } catch (error) {
        console.error('Error fetching prank categories:', error);
        throw error;
    }
};

/**
 * Fetch a specific prank category by ID
 */
export const fetchPrankCategoryById = async (categoryId: string): Promise<PrankCategory | null> => {
    try {
        const categoriesRef = collection(db, 'prank-category');
        const q = query(categoriesRef, where('prankCategoryName', '==', categoryId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data() as PrankCategory;
        return {
            id: doc.id,
            ...data,
        };
    } catch (error) {
        console.error('Error fetching prank category by ID:', error);
        throw error;
    }
};
