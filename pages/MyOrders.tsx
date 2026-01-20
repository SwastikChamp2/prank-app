// pages/MyOrders.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    useColorScheme,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import Footer from '../components/Footer/Footer';

const { width } = Dimensions.get('window');

interface Order {
    id: string;
    orderNumber: string;
    productName: string;
    box: string;
    wrapper: string;
    quantity: number;
    price: number;
    status: 'delivered' | 'in-transit' | 'cancelled';
    imageUrl: string;
}

const MyOrders = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const orders: Order[] = [
        {
            id: '1',
            orderNumber: '#PRK1024',
            productName: 'Spider in a Box Prank',
            box: 'Simple Cardboard Box',
            wrapper: 'Simple Packing Wrap',
            quantity: 1,
            price: 499,
            status: 'delivered',
            imageUrl: 'https://ichef.bbci.co.uk/news/480/cpsprodpb/15AE2/production/_125820888_45fda8df-fa8b-4b70-b711-e45dfd2151d6.jpg.webp',
        },
        {
            id: '2',
            orderNumber: '#PRK1017',
            productName: 'Rubber Snake Prank',
            box: 'Simple Cardboard Box',
            wrapper: 'Festive Gift Wrap',
            quantity: 1,
            price: 699,
            status: 'in-transit',
            imageUrl: 'https://images-cdn.ubuy.co.in/634f5fd9e239ce64f93a53c9-snake-toy-130cm-long-realistic.jpg',
        },
        {
            id: '3',
            orderNumber: '#PRK1005',
            productName: 'Rubber Mouse Prank',
            box: 'Simple Cardboard Box',
            wrapper: 'Golden Gift Wrap',
            quantity: 1,
            price: 399,
            status: 'cancelled',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCjQF343O1TcopCol8GatwYo4QtYIAxV5Gug&s',
        },
    ];

    const getStatusConfig = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return {
                    label: 'Delivered',
                    icon: 'checkmark-circle',
                    bgColor: theme.deliveredBg,
                    textColor: theme.deliveredText,
                };
            case 'in-transit':
                return {
                    label: 'In Transit',
                    icon: 'time',
                    bgColor: theme.inTransitBg,
                    textColor: theme.inTransitText,
                };
            case 'cancelled':
                return {
                    label: 'Cancelled',
                    icon: 'close-circle',
                    bgColor: theme.cancelledBg,
                    textColor: theme.cancelledText,
                };
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleViewDetails = (orderId: string) => {
        console.log('View details:', orderId);
        // Navigate to order details
        router.push(`/order-detail`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    My Orders
                </Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Orders List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {orders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);

                    return (
                        <View key={order.id} style={[styles.orderCard, { backgroundColor: theme.background }]}>
                            {/* Order Header */}
                            <View style={styles.orderHeader}>
                                <Text style={[styles.orderNumber, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                    Order {order.orderNumber}
                                </Text>
                                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                                    <Ionicons name={statusConfig.icon as any} size={14} color={statusConfig.textColor} />
                                    <Text style={[styles.statusText, { color: statusConfig.textColor, fontFamily: Fonts.medium }]}>
                                        {statusConfig.label}
                                    </Text>
                                </View>
                            </View>

                            {/* Order Content */}
                            <View style={styles.orderContent}>
                                {/* Product Image */}
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: order.imageUrl }}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />
                                </View>

                                {/* Product Details */}
                                <View style={styles.productDetails}>
                                    <Text style={[styles.productName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                        {order.productName}
                                    </Text>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.emoji}>📦</Text>
                                        <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            Box: <Text style={{ color: theme.text }}>{order.box}</Text>
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.emoji}>🎁</Text>
                                        <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            Wrapper: <Text style={{ color: theme.text }}>{order.wrapper}</Text>
                                        </Text>
                                    </View>

                                    <Text style={[styles.priceText, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                        Qty: {order.quantity} · ₹{order.price}
                                    </Text>
                                </View>
                            </View>

                            {/* View Details Button */}
                            <TouchableOpacity
                                style={[styles.viewDetailsButton, { backgroundColor: theme.primary }]}
                                activeOpacity={0.8}
                                onPress={() => handleViewDetails(order.id)}
                            >
                                <Text style={[styles.viewDetailsText, { fontFamily: Fonts.semiBold }]}>
                                    View Details
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {/* Bottom spacing */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Footer Navigation */}
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    orderCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 15,
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    orderContent: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F9F9F9',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    emoji: {
        fontSize: 14,
    },
    detailText: {
        fontSize: 13,
        lineHeight: 18,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    viewDetailsButton: {
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewDetailsText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 20,
    },
});

export default MyOrders;