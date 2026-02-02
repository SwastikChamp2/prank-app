// pages/OrderDetail.tsx
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import Footer from '../components/Footer/Footer';
import { getOrderById, OrderData } from '../services/orderService';

const { width } = Dimensions.get('window');

const OrderDetail = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrderDetails();
    }, [orderId]);

    const loadOrderDetails = async () => {
        try {
            setLoading(true);
            if (orderId) {
                const orderData = await getOrderById(orderId);
                setOrder(orderData);
            }
        } catch (error) {
            console.error('Error loading order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/my-orders');
    };

    const getCurrentProgressIndex = () => {
        if (!order) return 0;

        // Find the last completed stage
        for (let i = order.progress.length - 1; i >= 0; i--) {
            if (order.progress[i].completedAt !== '') {
                return i;
            }
        }
        return 0;
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Order Details
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Loading order details...
                    </Text>
                </View>

                <Footer />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Order Details
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={theme.grey} />
                    <Text style={[styles.errorText, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Order not found
                    </Text>
                    <TouchableOpacity
                        style={[styles.backToOrdersButton, { backgroundColor: theme.primary }]}
                        onPress={handleBack}
                    >
                        <Text style={[styles.backToOrdersText, { fontFamily: Fonts.semiBold }]}>
                            Back to Orders
                        </Text>
                    </TouchableOpacity>
                </View>

                <Footer />
            </View>
        );
    }

    const firstItem = order.items[0];
    const currentProgressIndex = getCurrentProgressIndex();

    const getStepStatus = (index: number): 'completed' | 'current' | 'pending' => {
        if (index < currentProgressIndex) return 'completed';
        if (index === currentProgressIndex) return 'current';
        return 'pending';
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Order {order.orderNumber}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Product Card - Show all items */}
                {order.items.map((item, index) => (
                    <View key={index} style={[styles.productCard, { backgroundColor: theme.background }]}>
                        <View style={styles.productContent}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.prankImage }}
                                    style={styles.productImage}
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={styles.productInfo}>
                                <Text style={[styles.productName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                    {item.prankTitle}
                                </Text>

                                <View style={styles.detailRow}>
                                    <Text style={styles.emoji}>📦</Text>
                                    <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        Box: <Text style={{ color: theme.text }}>{item.boxTitle}</Text>
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.emoji}>🎁</Text>
                                    <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        Wrapper: <Text style={{ color: theme.text }}>{item.wrapTitle}</Text>
                                    </Text>
                                </View>

                                <Text style={[styles.qtyPrice, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                    ₹{item.totalPrice}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Anonymous Messages */}
                {order.items.some(item => item.message) && (
                    <View style={[styles.messageCard, { backgroundColor: theme.background }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                            Anonymous Messages
                        </Text>
                        {order.items.map((item, index) => (
                            item.message && (
                                <View key={index} style={styles.messageItem}>

                                    <Text style={[styles.messageText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        "{item.message}"
                                    </Text>
                                </View>
                            )
                        ))}
                    </View>
                )}

                {/* Cost Breakdown */}
                <View style={[styles.costCard, { backgroundColor: theme.background }]}>
                    <View style={styles.costRow}>
                        <Text style={[styles.costLabel, { color: theme.text, fontFamily: Fonts.regular }]}>
                            Product Cost
                        </Text>
                        <Text style={[styles.costValue, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            ₹{order.productCost}
                        </Text>
                    </View>

                    <View style={styles.costRow}>
                        <Text style={[styles.costLabel, { color: theme.text, fontFamily: Fonts.regular }]}>
                            Delivery fees
                        </Text>
                        <Text style={[styles.costValue, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            ₹{order.deliveryFees}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.dotInactive }]} />

                    <View style={styles.costRow}>
                        <Text style={[styles.totalLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Total Cost
                        </Text>
                        <Text style={[styles.totalValue, { color: theme.primary, fontFamily: Fonts.bold }]}>
                            ₹{order.totalCost}
                        </Text>
                    </View>
                </View>

                {/* Progress Section */}
                <View style={[styles.progressCard, { backgroundColor: theme.background }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Progress of your Order
                    </Text>

                    <View style={styles.progressSteps}>
                        {order.progress.map((step, index) => {
                            const stepStatus = getStepStatus(index);
                            const isCompleted = stepStatus === 'completed';
                            const isCurrent = stepStatus === 'current';
                            const isLast = index === order.progress.length - 1;

                            // Map stage names to icons
                            const getIconName = (stage: string): string => {
                                switch (stage) {
                                    case 'Order Placed': return 'receipt';
                                    case 'Order Picked': return 'cube';
                                    case 'On the Way': return 'bicycle';
                                    case 'Delivered': return 'checkmark-circle';
                                    default: return 'ellipse';
                                }
                            };

                            return (
                                <View key={index} style={styles.stepContainer}>
                                    <View style={styles.stepIconContainer}>
                                        <View
                                            style={[
                                                styles.stepIcon,
                                                isCompleted || isCurrent
                                                    ? { backgroundColor: theme.primary }
                                                    : { backgroundColor: theme.dotInactive },
                                            ]}
                                        >
                                            <Ionicons
                                                name={getIconName(step.stage) as any}
                                                size={20}
                                                color={isCompleted || isCurrent ? '#FFFFFF' : theme.grey}
                                            />
                                        </View>
                                        {!isLast && (
                                            <View
                                                style={[
                                                    styles.stepLine,
                                                    isCompleted
                                                        ? { backgroundColor: theme.primary }
                                                        : { backgroundColor: theme.dotInactive },
                                                ]}
                                            />
                                        )}
                                    </View>

                                    <View style={styles.stepContent}>
                                        <Text
                                            style={[
                                                styles.stepTitle,
                                                { color: theme.text, fontFamily: Fonts.semiBold },
                                            ]}
                                        >
                                            {step.stage}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.stepSubtitle,
                                                { color: theme.grey, fontFamily: Fonts.regular },
                                            ]}
                                        >
                                            {step.completedAt || 'Pending'}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Order Information */}
                <View style={[styles.infoCard, { backgroundColor: theme.background }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Order Information
                    </Text>

                    {/* Delivery Address */}
                    <View style={styles.infoRow}>
                        <View style={[styles.infoIcon, { backgroundColor: theme.lightOrange }]}>
                            <Ionicons name="home" size={20} color={theme.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                {order.deliveryLocation.addressLabel}
                            </Text>
                            <Text style={[styles.infoText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                {order.deliveryLocation.flatNumber}, {order.deliveryLocation.buildingName}
                            </Text>
                            <Text style={[styles.infoText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                {order.deliveryLocation.streetName}, {order.deliveryLocation.pincode}
                            </Text>
                        </View>
                    </View>

                    {/* Payment Method */}
                    <View style={styles.infoRow}>
                        <View style={[styles.infoIcon, { backgroundColor: theme.lightOrange }]}>
                            <Ionicons name="card" size={20} color={theme.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <View style={styles.paymentHeader}>
                                <Text style={[styles.infoTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                    Payment
                                </Text>
                                <Ionicons name="information-circle-outline" size={16} color={theme.grey} />
                            </View>
                            <Text style={[styles.infoText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                {order.paymentMethod}
                            </Text>
                            <Text style={[styles.infoText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                Transaction ID: {order.transactionId}
                            </Text>
                        </View>
                    </View>
                </View>

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
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 16,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
        gap: 12,
    },
    errorText: {
        fontSize: 18,
        marginTop: 16,
        marginBottom: 24,
    },
    backToOrdersButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
    },
    backToOrdersText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    productCard: {
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
    productContent: {
        flexDirection: 'row',
    },
    imageContainer: {
        width: 80,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F9F9F9',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    emoji: {
        fontSize: 14,
    },
    detailText: {
        fontSize: 12,
        lineHeight: 16,
    },
    qtyPrice: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
    },
    costCard: {
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
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    costLabel: {
        fontSize: 14,
    },
    costValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    progressCard: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    progressSteps: {
        paddingLeft: 8,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    stepIconContainer: {
        alignItems: 'center',
        marginRight: 16,
    },
    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepLine: {
        width: 2,
        flex: 1,
        marginVertical: 4,
    },
    stepContent: {
        flex: 1,
        paddingBottom: 20,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    stepSubtitle: {
        fontSize: 12,
        lineHeight: 16,
    },
    infoCard: {
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
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 16,
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    messageCard: {
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
    messageItem: {
        marginBottom: 12,
    },
    messagePrankTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 13,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    bottomSpacer: {
        height: 20,
    },
});

export default OrderDetail;