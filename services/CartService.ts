// services/CartService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
    prankId: string;
    prankTitle: string;
    prankPrice: number;
    prankImage: string;
    boxId: string;
    boxTitle: string;
    boxPrice: number | null;
    boxImage: string;
    wrapId: string;
    wrapTitle: string;
    wrapPrice: number | null;
    wrapImage: string;
    message?: string;
}

export interface CartData {
    items: CartItem[];
    lastUpdated: string;
}

const CART_STORAGE_KEY = '@prank_app_cart';

/**
 * Get cart items from local storage
 */
export const getCartItems = async (): Promise<CartItem[]> => {
    try {
        const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (data) {
            const cartData: CartData = JSON.parse(data);
            return cartData.items || [];
        }
        return [];
    } catch (error) {
        console.error('Error reading cart from storage:', error);
        return [];
    }
};

/**
 * Get total cart price
 */
export const getCartTotal = async (): Promise<number> => {
    try {
        const items = await getCartItems();
        let total = 0;
        items.forEach((item) => {
            total += item.prankPrice;
            if (item.boxPrice) total += item.boxPrice;
            if (item.wrapPrice) total += item.wrapPrice;
        });
        return total;
    } catch (error) {
        console.error('Error calculating cart total:', error);
        return 0;
    }
};

/**
 * Add or update cart item
 */
export const updateCartItem = async (item: CartItem): Promise<boolean> => {
    try {
        const items = await getCartItems();
        // Replace if prank already exists, otherwise add
        const existingIndex = items.findIndex((i) => i.prankId === item.prankId);
        if (existingIndex >= 0) {
            items[existingIndex] = item;
        } else {
            items.push(item);
        }

        const cartData: CartData = {
            items,
            lastUpdated: new Date().toISOString(),
        };

        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
        return true;
    } catch (error) {
        console.error('Error updating cart:', error);
        return false;
    }
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (prankId: string): Promise<boolean> => {
    try {
        const items = await getCartItems();
        const filteredItems = items.filter((item) => item.prankId !== prankId);

        const cartData: CartData = {
            items: filteredItems,
            lastUpdated: new Date().toISOString(),
        };

        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
        return true;
    } catch (error) {
        console.error('Error removing cart item:', error);
        return false;
    }
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
};

/**
 * Get cart item count
 */
export const getCartItemCount = async (): Promise<number> => {
    try {
        const items = await getCartItems();
        return items.length;
    } catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
};
