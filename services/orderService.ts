// services/orderService.ts
import { db, auth } from '../config/firebase.config'; // Adjust path according to your firebase config
import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    updateDoc,
    increment
} from 'firebase/firestore';
import { AddressData } from './addressService';

export interface OrderProgress {
    stage: 'Order Placed' | 'Order Picked' | 'On the Way' | 'Delivered' | 'Cancelled';
    completedAt: string; // Format: "1:00 PM - 30 Jan 2026" or empty string
}

export interface OrderItem {
    prankId: string;
    prankTitle: string;
    prankImage: string;
    prankPrice: number;
    boxTitle: string;
    boxImage?: string;
    boxPrice: number;
    wrapTitle: string;
    wrapImage?: string;
    wrapPrice: number;
    totalPrice: number;
    message?: string;
}

export interface OrderData {
    orderId: string; // 8-character order ID (e.g., "PRK10245")
    transactionId: string; // 8-character transaction ID
    userId: string;
    orderNumber: string; // Display format: "#PRK10245"

    // Order Items
    items: OrderItem[];

    // Pricing
    productCost: number;
    deliveryFees: number;
    totalCost: number;

    // Delivery Information
    deliveryLocation: AddressData; // Complete address object

    // Payment Information
    paymentMethod: string; // e.g., "Master Card", "UPI", etc.
    paymentStatus: 'pending' | 'completed' | 'failed';

    // User Information
    userPhoneNumber: string; // Phone number of the user placing the order

    // Order Status
    status: 'Order Placed' | 'Order Picked' | 'On the Way' | 'Delivered' | 'Cancelled';

    // Progress Tracking
    progress: OrderProgress[];

    // Timestamps
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Generate a random 8-character alphanumeric ID
 */
const generateId = (prefix: string = ''): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    const length = 8 - prefix.length;

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};

/**
 * Format current date and time
 */
const formatDateTime = (): string => {
    const now = new Date();

    // Format time (12-hour format)
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = `${hours}:${minutesStr} ${ampm}`;

    // Format date
    const day = now.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    return `${timeStr} - ${day} ${month} ${year}`;
};

/**
 * Create initial progress tracking array
 */
const createInitialProgress = (): OrderProgress[] => {
    const currentDateTime = formatDateTime();

    return [
        {
            stage: 'Order Placed',
            completedAt: currentDateTime
        },
        {
            stage: 'Order Picked',
            completedAt: ''
        },
        {
            stage: 'On the Way',
            completedAt: ''
        },
        {
            stage: 'Delivered',
            completedAt: ''
        },
        {
            stage: 'Cancelled',
            completedAt: ''
        }
    ];
};

/**
 * Create a new order in Firebase
 */
export const createOrder = async (
    items: OrderItem[],
    deliveryAddress: AddressData,
    paymentMethod: string,
    productCost: number,
    deliveryFees: number = 0
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        // Fetch user's phone number from users collection
        let userPhoneNumber = '';
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                userPhoneNumber = userDocSnap.data()?.phoneNumber || '';
            }
        } catch (error) {
            console.warn('Error fetching user phone number:', error);
            userPhoneNumber = '';
        }

        // ── Inventory validation ──
        // Count how many times each prank/box/wrap appears in the order
        const prankIdCounts: Record<string, number> = {};
        const boxTitleCounts: Record<string, number> = {};
        const wrapTitleCounts: Record<string, number> = {};

        for (const item of items) {
            if (item.prankId) {
                prankIdCounts[item.prankId] = (prankIdCounts[item.prankId] || 0) + 1;
            }
            if (item.boxTitle) {
                boxTitleCounts[item.boxTitle] = (boxTitleCounts[item.boxTitle] || 0) + 1;
            }
            if (item.wrapTitle) {
                wrapTitleCounts[item.wrapTitle] = (wrapTitleCounts[item.wrapTitle] || 0) + 1;
            }
        }

        // Validate prank stock (query by 'id' field, not Firestore doc ID)
        const prankDocMap: Record<string, { firestoreDocId: string; available: number }> = {};
        for (const [prankId, needed] of Object.entries(prankIdCounts)) {
            const prankQuery = query(collection(db, 'pranks'), where('id', '==', prankId));
            const prankSnap = await getDocs(prankQuery);
            if (prankSnap.empty) {
                // Fallback: try direct doc ID lookup
                const directRef = doc(db, 'pranks', prankId);
                const directSnap = await getDoc(directRef);
                if (!directSnap.exists()) {
                    return { success: false, error: `Prank not found in inventory` };
                }
                const available = directSnap.data()?.quantity ?? 0;
                if (available < needed) {
                    const prankName = directSnap.data()?.prankTitle || 'This prank';
                    return {
                        success: false,
                        error: available === 0
                            ? `"${prankName}" is out of stock`
                            : `"${prankName}" only has ${available} left in stock (you need ${needed})`
                    };
                }
                prankDocMap[prankId] = { firestoreDocId: directSnap.id, available };
            } else {
                const prankDoc = prankSnap.docs[0];
                const available = prankDoc.data()?.quantity ?? 0;
                if (available < needed) {
                    const prankName = prankDoc.data()?.prankTitle || 'This prank';
                    return {
                        success: false,
                        error: available === 0
                            ? `"${prankName}" is out of stock`
                            : `"${prankName}" only has ${available} left in stock (you need ${needed})`
                    };
                }
                prankDocMap[prankId] = { firestoreDocId: prankDoc.id, available };
            }
        }

        // Validate box stock
        const boxDocMap: Record<string, { firestoreDocId: string; available: number }> = {};
        for (const boxTitle of Object.keys(boxTitleCounts)) {
            const boxQuery = query(collection(db, 'boxes'), where('boxTitle', '==', boxTitle));
            const boxSnap = await getDocs(boxQuery);
            if (boxSnap.empty) {
                return { success: false, error: `Box "${boxTitle}" not found in inventory` };
            }
            const boxDoc = boxSnap.docs[0];
            const available = boxDoc.data()?.quantity ?? 0;
            const needed = boxTitleCounts[boxTitle];
            if (available < needed) {
                return {
                    success: false,
                    error: available === 0
                        ? `Box "${boxTitle}" is out of stock`
                        : `Box "${boxTitle}" only has ${available} left in stock (you need ${needed})`
                };
            }
            boxDocMap[boxTitle] = { firestoreDocId: boxDoc.id, available };
        }

        // Validate wrap stock
        const wrapDocMap: Record<string, { firestoreDocId: string; available: number }> = {};
        for (const wrapTitle of Object.keys(wrapTitleCounts)) {
            const wrapQuery = query(collection(db, 'wraps'), where('wrapTitle', '==', wrapTitle));
            const wrapSnap = await getDocs(wrapQuery);
            if (wrapSnap.empty) {
                return { success: false, error: `Wrap "${wrapTitle}" not found in inventory` };
            }
            const wrapDoc = wrapSnap.docs[0];
            const available = wrapDoc.data()?.quantity ?? 0;
            const needed = wrapTitleCounts[wrapTitle];
            if (available < needed) {
                return {
                    success: false,
                    error: available === 0
                        ? `Wrap "${wrapTitle}" is out of stock`
                        : `Wrap "${wrapTitle}" only has ${available} left in stock (you need ${needed})`
                };
            }
            wrapDocMap[wrapTitle] = { firestoreDocId: wrapDoc.id, available };
        }

        // ── Create order + decrement stock ──
        const orderId = generateId('PRK');
        const transactionId = generateId('TXN');
        const totalCost = productCost + deliveryFees;

        const orderData: Omit<OrderData, 'orderId'> = {
            transactionId,
            userId: currentUser.uid,
            orderNumber: `#${orderId}`,
            items,
            productCost,
            deliveryFees,
            totalCost,
            deliveryLocation: deliveryAddress,
            paymentMethod,
            paymentStatus: 'completed',
            userPhoneNumber,
            status: 'Order Placed',
            progress: createInitialProgress(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        // Add the order document
        await addDoc(collection(db, 'orders'), {
            orderId,
            stockDeducted: true,
            ...orderData
        });

        // Decrement stock for each prank
        for (const [prankId, needed] of Object.entries(prankIdCounts)) {
            const { firestoreDocId } = prankDocMap[prankId];
            const prankDocRef = doc(db, 'pranks', firestoreDocId);
            await updateDoc(prankDocRef, { quantity: increment(-needed) });
            console.log(`Prank "${prankId}" stock decremented by ${needed}`);
        }

        // Decrement stock for each box
        for (const [boxTitle, needed] of Object.entries(boxTitleCounts)) {
            const { firestoreDocId } = boxDocMap[boxTitle];
            const boxDocRef = doc(db, 'boxes', firestoreDocId);
            await updateDoc(boxDocRef, { quantity: increment(-needed) });
            console.log(`Box "${boxTitle}" stock decremented by ${needed}`);
        }

        // Decrement stock for each wrap
        for (const [wrapTitle, needed] of Object.entries(wrapTitleCounts)) {
            const { firestoreDocId } = wrapDocMap[wrapTitle];
            const wrapDocRef = doc(db, 'wraps', firestoreDocId);
            await updateDoc(wrapDocRef, { quantity: increment(-needed) });
            console.log(`Wrap "${wrapTitle}" stock decremented by ${needed}`);
        }

        console.log('Order created and stock deducted successfully:', orderId);

        return {
            success: true,
            orderId: orderId
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create order'
        };
    }
};

/**
 * Get all orders for the current user
 */
export const getUserOrders = async (): Promise<OrderData[]> => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const orders: OrderData[] = [];

        querySnapshot.forEach((doc) => {
            orders.push({
                ...doc.data() as OrderData,
            });
        });

        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

/**
 * Get a specific order by order ID
 */
export const getOrderById = async (orderId: string): Promise<OrderData | null> => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('orderId', '==', orderId),
            where('userId', '==', currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const orderDoc = querySnapshot.docs[0];
        return orderDoc.data() as OrderData;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

/**
 * Get order statistics for the user
 */
export const getOrderStats = async (): Promise<{
    total: number;
    delivered: number;
    inTransit: number;
    cancelled: number;
}> => {
    try {
        const orders = await getUserOrders();

        return {
            total: orders.length,
            delivered: orders.filter(o => o.status === 'Delivered').length,
            inTransit: orders.filter(o =>
                o.status === 'Order Picked' || o.status === 'On the Way'
            ).length,
            cancelled: orders.filter(o => o.status === 'Cancelled').length,
        };
    } catch (error) {
        console.error('Error fetching order stats:', error);
        return { total: 0, delivered: 0, inTransit: 0, cancelled: 0 };
    }
};

/**
 * Map order status to display format
 */
export const mapOrderStatus = (status: OrderData['status']): {
    label: string;
    status: 'order-placed' | 'order-picked' | 'in-transit' | 'delivered' | 'cancelled';
} => {
    switch (status) {
        case 'Order Placed':
            return { label: 'Order Placed', status: 'order-placed' };
        case 'Order Picked':
            return { label: 'Order Picked', status: 'order-picked' };
        case 'On the Way':
            return { label: 'In Transit', status: 'in-transit' };
        case 'Delivered':
            return { label: 'Delivered', status: 'delivered' };
        case 'Cancelled':
            return { label: 'Cancelled', status: 'cancelled' };
        default:
            return { label: 'In Transit', status: 'in-transit' };
    }
};