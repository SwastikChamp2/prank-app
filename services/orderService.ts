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
    Timestamp
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

        // Generate unique IDs
        const orderId = generateId('PRK');
        const transactionId = generateId('TXN');

        // Calculate total cost
        const totalCost = productCost + deliveryFees;

        // Create order data
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
            status: 'Order Placed',
            progress: createInitialProgress(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, 'orders'), {
            orderId,
            ...orderData
        });

        console.log('Order created successfully:', docRef.id);

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