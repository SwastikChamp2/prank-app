// pages/MyOrders.tsx
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    useColorScheme,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import Footer from '../components/Footer/Footer';
import { getUserOrders, OrderData, mapOrderStatus } from '../services/orderService';

const { width } = Dimensions.get('window');

const MyOrders = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [])
    );

    const loadOrders = async () => {
        try {
            setLoading(true);
            const fetchedOrders = await getUserOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    const getStatusConfig = (status: 'order-placed' | 'order-picked' | 'in-transit' | 'delivered' | 'cancelled') => {
        switch (status) {
            case 'order-placed':
                return {
                    label: 'Order Placed',
                    icon: 'checkmark-circle',
                    bgColor: theme.orderPlacedBg,
                    textColor: theme.orderPlacedText,
                };
            case 'order-picked':
                return {
                    label: 'Order Picked',
                    icon: 'cube',
                    bgColor: theme.orderPickedBg,
                    textColor: theme.orderPickedText,
                };
            case 'in-transit':
                return {
                    label: 'In Transit',
                    icon: 'time',
                    bgColor: theme.inTransitBg,
                    textColor: theme.inTransitText,
                };
            case 'delivered':
                return {
                    label: 'Delivered',
                    icon: 'checkmark-done-circle',
                    bgColor: theme.deliveredBg,
                    textColor: theme.deliveredText,
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
        router.push(`/order-detail?orderId=${orderId}`);
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        My Orders
                    </Text>
                    <View style={styles.filterButton} />
                </View>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Loading orders...
                    </Text>
                </View>

                <Footer />
            </View>
        );
    }

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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.primary}
                        colors={[theme.primary]}
                    />
                }
            >
                {orders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={64} color={theme.grey} />
                        <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            No Orders Yet
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Start shopping to see your orders here
                        </Text>
                        <TouchableOpacity
                            style={[styles.shopButton, { backgroundColor: theme.primary }]}
                            onPress={() => router.push('/home')}
                        >
                            <Text style={[styles.shopButtonText, { fontFamily: Fonts.semiBold }]}>
                                Start Shopping
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    orders.map((order) => {
                        const mappedStatus = mapOrderStatus(order.status);
                        const statusConfig = getStatusConfig(mappedStatus.status);
                        const firstItem = order.items[0];

                        return (
                            <View key={order.orderId} style={[styles.orderCard, { backgroundColor: theme.background }]}>
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
                                            source={{ uri: firstItem.prankImage }}
                                            style={styles.productImage}
                                            resizeMode="cover"
                                        />
                                    </View>

                                    {/* Product Details */}
                                    <View style={styles.productDetails}>
                                        <Text style={[styles.productName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                            {firstItem.prankTitle}
                                        </Text>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.emoji}>📦</Text>
                                            <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                                Box: <Text style={{ color: theme.text }}>{firstItem.boxTitle}</Text>
                                            </Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.emoji}>🎁</Text>
                                            <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                                Wrapper: <Text style={{ color: theme.text }}>{firstItem.wrapTitle}</Text>
                                            </Text>
                                        </View>

                                        <Text style={[styles.priceText, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} · ₹{order.totalCost}
                                        </Text>
                                    </View>
                                </View>

                                {/* View Details Button */}
                                <TouchableOpacity
                                    style={[styles.viewDetailsButton, { backgroundColor: theme.primary }]}
                                    activeOpacity={0.8}
                                    onPress={() => handleViewDetails(order.orderId)}
                                >
                                    <Text style={[styles.viewDetailsText, { fontFamily: Fonts.semiBold }]}>
                                        View Details
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                )}

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
        marginBottom: 24,
    },
    shopButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
    },
    shopButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
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