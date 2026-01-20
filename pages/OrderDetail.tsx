// pages/OrderDetail.tsx
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

type OrderStatus = 'booked' | 'picked' | 'on-the-way' | 'delivered';

const OrderDetail = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    // CHANGE THIS VARIABLE TO UPDATE ORDER STATUS
    // Options: 'booked', 'picked', 'on-the-way', 'delivered'
    const currentOrderStatus: OrderStatus = 'booked';

    const orderData = {
        orderNumber: '#PRK1024',
        productName: 'Spider in a Box Prank',
        box: 'Simple Cardboard Box',
        wrapper: 'Simple Packing Paper',
        quantity: 1,
        price: 499,
        imageUrl: 'https://ichef.bbci.co.uk/news/480/cpsprodpb/15AE2/production/_125820888_45fda8df-fa8b-4b70-b711-e45dfd2151d6.jpg.webp',
        productCost: 499,
        deliveryFees: 0,
        totalCost: 499,
        deliveryAddress: {
            type: 'House',
            address: '404 Marigold, Lodha Luxuria',
            fullAddress: 'Majiwada Thane West, Mumbai, India - 400601',
        },
        payment: {
            method: 'Master Card',
            last4: '1234',
        },
    };

    const progressSteps = [
        {
            id: 'booked',
            icon: 'receipt',
            title: 'Order Booked',
            subtitle: 'Order Placed · 1:00 PM - 20/12/25',
            status: 'booked' as OrderStatus,
        },
        {
            id: 'picked',
            icon: 'cube',
            title: 'Order Picked',
            subtitle: 'Warehouse · 2:30 PM - 20/12/25',
            status: 'picked' as OrderStatus,
        },
        {
            id: 'on-the-way',
            icon: 'bicycle',
            title: 'On the way',
            subtitle: 'Delivery · 5:30 PM - 20/12/25',
            status: 'on-the-way' as OrderStatus,
        },
        {
            id: 'delivered',
            icon: 'checkmark-circle',
            title: 'Delivered',
            subtitle: '404 Marigold, Lodha Luxuria',
            status: 'delivered' as OrderStatus,
        },
    ];

    const getStepStatus = (stepStatus: OrderStatus): 'completed' | 'current' | 'pending' => {
        const statusOrder: OrderStatus[] = ['booked', 'picked', 'on-the-way', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentOrderStatus);
        const stepIndex = statusOrder.indexOf(stepStatus);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'pending';
    };

    const handleBack = () => {
        router.push('/my-orders');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Order {orderData.orderNumber}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* Product Card */}
                <View style={[styles.productCard, { backgroundColor: theme.background }]}>



                    <View style={styles.productContent}>

                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: orderData.imageUrl }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.productInfo}>
                            <Text style={[styles.productName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                {orderData.productName}
                            </Text>

                            <View style={styles.detailRow}>
                                <Text style={styles.emoji}>📦</Text>
                                <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                    Box: <Text style={{ color: theme.text }}>{orderData.box}</Text>
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.emoji}>🎁</Text>
                                <Text style={[styles.detailText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                    Wrapper: <Text style={{ color: theme.text }}>{orderData.wrapper}</Text>
                                </Text>
                            </View>

                            <Text style={[styles.qtyPrice, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                Qty: {orderData.quantity} · ₹{orderData.price}
                            </Text>
                        </View>
                    </View>


                </View>

                {/* Cost Breakdown */}
                <View style={[styles.costCard, { backgroundColor: theme.background }]}>
                    <View style={styles.costRow}>
                        <Text style={[styles.costLabel, { color: theme.text, fontFamily: Fonts.regular }]}>
                            Product Cost
                        </Text>
                        <Text style={[styles.costValue, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            ₹{orderData.productCost}
                        </Text>
                    </View>

                    <View style={styles.costRow}>
                        <Text style={[styles.costLabel, { color: theme.text, fontFamily: Fonts.regular }]}>
                            Delivery fees
                        </Text>
                        <Text style={[styles.costValue, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            ₹{orderData.deliveryFees}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.dotInactive }]} />

                    <View style={styles.costRow}>
                        <Text style={[styles.totalLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Total Cost
                        </Text>
                        <Text style={[styles.totalValue, { color: theme.primary, fontFamily: Fonts.bold }]}>
                            ₹{orderData.totalCost}
                        </Text>
                    </View>
                </View>

                {/* Progress Section */}
                <View style={[styles.progressCard, { backgroundColor: theme.background }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Progress of your Order
                    </Text>

                    <View style={styles.progressSteps}>
                        {progressSteps.map((step, index) => {
                            const stepStatus = getStepStatus(step.status);
                            const isCompleted = stepStatus === 'completed';
                            const isCurrent = stepStatus === 'current';
                            const isLast = index === progressSteps.length - 1;

                            return (
                                <View key={step.id} style={styles.stepContainer}>
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
                                                name={step.icon as any}
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
                                            {step.title}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.stepSubtitle,
                                                { color: theme.grey, fontFamily: Fonts.regular },
                                            ]}
                                        >
                                            {step.subtitle}
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
                                {orderData.deliveryAddress.type}
                            </Text>
                            <Text style={[styles.infoText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                {orderData.deliveryAddress.address}
                            </Text>
                            <Text style={[styles.infoText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                {orderData.deliveryAddress.fullAddress}
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
                                {orderData.payment.method} **** {orderData.payment.last4}
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
    statusBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
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
        marginBottom: 16,
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
    bottomSpacer: {
        height: 20,
    },
});

export default OrderDetail;