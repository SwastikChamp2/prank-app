import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    StatusBar,
    useColorScheme,
    Modal,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import Footer from '../components/Footer/Footer';

const Cart = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('mastercard');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const maxPaymentDrawerHeight = Dimensions.get('window').height * 0.7;

    const handlePaymentSelect = (method: string) => {
        setSelectedPayment(method);
    };

    const handleConfirmPayment = () => {
        setShowPaymentModal(false);
    };

    const handleCheckout = () => {
        setShowTermsModal(true);
    };

    const handleContinueFromTerms = () => {
        if (agreedToTerms) {
            setShowTermsModal(false);
            setAgreedToTerms(false);
            setShowSuccessModal(true);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                    Payment
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {/* Address Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                            Address
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.editButton, { color: theme.primary, fontFamily: Fonts.medium }]}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.addressCard, { backgroundColor: theme.background }]}>
                        <View style={styles.addressContent}>
                            <View style={styles.mapThumbnail}>
                                <Image
                                    source={require('../assets/images/map-placeholder.png')}
                                    style={styles.mapThumbnailImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.mapPinSmall}>
                                    <View style={styles.mapPinInner} />
                                </View>
                            </View>

                            <View style={styles.addressInfo}>
                                <Text style={[styles.addressLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                    House
                                </Text>
                                <Text style={[styles.addressText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                    404 Marigold, Lodha Luxuria,{'\n'}Majiwada Thane West,{'\n'}Mumbai, India - 400601
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Products Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Products
                    </Text>

                    {/* Product 1 */}
                    <View style={[styles.productItem, { backgroundColor: theme.background }]}>
                        <View style={[styles.productImageContainer, { backgroundColor: theme.lightGrey }]}>
                            <Image
                                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-oX-YPJP5I3k-XQnePBdY3ysz8TPRkWdFtg&s' }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={[styles.productName, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Spider in a box Prank
                        </Text>
                        <Text style={[styles.productPrice, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            ₹ 499
                        </Text>
                    </View>

                    {/* Product 2 */}
                    <View style={[styles.productItem, { backgroundColor: theme.background }]}>
                        <View style={[styles.productImageContainer, { backgroundColor: theme.lightGrey }]}>
                            <Image
                                source={{ uri: 'https://i.etsystatic.com/24039383/r/il/98e077/2404078216/il_fullxfull.2404078216_tc34.jpg' }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={[styles.productName, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Simple Cardboard Box
                        </Text>
                        <Text style={[styles.productPrice, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            ₹ 0
                        </Text>
                    </View>

                    {/* Product 3 */}
                    <View style={[styles.productItem, { backgroundColor: theme.background }]}>
                        <View style={[styles.productImageContainer, { backgroundColor: theme.lightGrey }]}>
                            <Image
                                source={{ uri: 'https://static1.industrybuying.com/products/material-handling-and-packaging/protective-packaging-products/corrugated-paper-rolls/MAT.COR.235697562_1760594305712.webp' }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={[styles.productName, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Simple Packing Paper
                        </Text>
                        <Text style={[styles.productPrice, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            ₹ 0
                        </Text>
                    </View>
                </View>

                {/* Payment Method Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Payment Method
                    </Text>

                    <TouchableOpacity
                        style={[styles.paymentCard, { backgroundColor: theme.background, borderColor: theme.border }]}
                        onPress={() => setShowPaymentModal(true)}
                    >
                        <View style={styles.paymentLeft}>
                            <Image
                                source={{ uri: 'https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13674554/Mastercard_logo.jpg?quality=90&strip=all&crop=0,16.666666666667,100,66.666666666667' }}
                                style={styles.mastercardLogo}
                                resizeMode="cover"
                            />
                            <View style={styles.cardDetails}>
                                <Text style={[styles.cardName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                    Master Card
                                </Text>
                                <Text style={[styles.cardNumber, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                    **** **** 1234
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={theme.grey} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Checkout Button and Footer */}
            {!showPaymentModal && !showTermsModal && !showSuccessModal && (
                <View style={[styles.footer, { backgroundColor: theme.background }]}>
                    <TouchableOpacity
                        style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
                        onPress={handleCheckout}
                    >
                        <Text style={[styles.checkoutButtonText, { fontFamily: Fonts.semiBold }]}>
                            Check out
                        </Text>
                    </TouchableOpacity>

                    <Footer />
                </View>
            )}

            {/* Payment Method Modal */}
            <Modal
                visible={showPaymentModal}
                transparent={true}
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowPaymentModal(false)}
                >
                    <TouchableOpacity
                        style={[
                            styles.modalContent,
                            { backgroundColor: theme.background, maxHeight: maxPaymentDrawerHeight },
                        ]}
                        activeOpacity={1}
                    >
                        {/* Handle Bar */}
                        <View style={styles.handleBar} />

                        {/* Modal Title */}
                        <Text style={[styles.modalTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                            Payment Method
                        </Text>

                        {/* Payment Options */}
                        <ScrollView style={styles.paymentOptions} showsVerticalScrollIndicator={false}>
                            {/* Net Banking */}
                            <TouchableOpacity
                                style={[styles.paymentOption, { backgroundColor: theme.background }]}
                                onPress={() => handlePaymentSelect('netbanking')}
                            >
                                <View style={styles.paymentOptionLeft}>
                                    <View style={styles.paymentIconContainer}>
                                        <Image
                                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRhCD38FVWaMwBzo21TODmpPqXSSbnwcJI9Q&s' }}
                                            style={styles.paymentIcon}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={styles.paymentOptionDetails}>
                                        <Text style={[styles.paymentOptionName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                            Net Banking
                                        </Text>
                                        <Text style={[styles.paymentOptionInfo, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            All major banks supported
                                        </Text>
                                    </View>
                                </View>
                                <View style={[
                                    styles.radioButton,
                                    { borderColor: selectedPayment === 'netbanking' ? theme.primary : theme.grey }
                                ]}>
                                    {selectedPayment === 'netbanking' && (
                                        <View style={[styles.radioButtonInner, { backgroundColor: theme.primary }]} />
                                    )}
                                </View>
                            </TouchableOpacity>

                            {/* UPI */}
                            <TouchableOpacity
                                style={[styles.paymentOption, { backgroundColor: theme.background }]}
                                onPress={() => handlePaymentSelect('upi')}
                            >
                                <View style={styles.paymentOptionLeft}>
                                    <View style={styles.paymentIconContainer}>
                                        <Image
                                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSWPEHCa2ZWE1BoRW2Y6Eq4I0E_6tWZtmbIg&s' }}
                                            style={styles.paymentIcon}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={styles.paymentOptionDetails}>
                                        <Text style={[styles.paymentOptionName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                            UPI
                                        </Text>
                                        <Text style={[styles.paymentOptionInfo, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            Google Pay, PhonePe, Paytm
                                        </Text>
                                    </View>
                                </View>
                                <View style={[
                                    styles.radioButton,
                                    { borderColor: selectedPayment === 'upi' ? theme.primary : theme.grey }
                                ]}>
                                    {selectedPayment === 'upi' && (
                                        <View style={[styles.radioButtonInner, { backgroundColor: theme.primary }]} />
                                    )}
                                </View>
                            </TouchableOpacity>

                            {/* PayPal */}
                            <TouchableOpacity
                                style={[styles.paymentOption, { backgroundColor: theme.background }]}
                                onPress={() => handlePaymentSelect('paypal')}
                            >
                                <View style={styles.paymentOptionLeft}>
                                    <View style={styles.paymentIconContainer}>
                                        <Image
                                            source={{ uri: 'https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png' }}
                                            style={styles.paymentIcon}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={styles.paymentOptionDetails}>
                                        <Text style={[styles.paymentOptionName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                            Paypal
                                        </Text>
                                        <Text style={[styles.paymentOptionInfo, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            sosk****@email.com
                                        </Text>
                                    </View>
                                </View>
                                <View style={[
                                    styles.radioButton,
                                    { borderColor: selectedPayment === 'paypal' ? theme.primary : theme.grey }
                                ]}>
                                    {selectedPayment === 'paypal' && (
                                        <View style={[styles.radioButtonInner, { backgroundColor: theme.primary }]} />
                                    )}
                                </View>
                            </TouchableOpacity>

                            {/* Mastercard */}
                            <TouchableOpacity
                                style={[styles.paymentOption, { backgroundColor: theme.background }]}
                                onPress={() => handlePaymentSelect('mastercard')}
                            >
                                <View style={styles.paymentOptionLeft}>
                                    <View style={styles.mastercardIconContainer}>
                                        <View style={[styles.mastercardCircle, styles.mastercardCircleRed]} />
                                        <View style={[styles.mastercardCircle, styles.mastercardCircleYellow]} />
                                    </View>
                                    <View style={styles.paymentOptionDetails}>
                                        <Text style={[styles.paymentOptionName, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                            Mastercard
                                        </Text>
                                        <Text style={[styles.paymentOptionInfo, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            4827 8472 7424 ****
                                        </Text>
                                    </View>
                                </View>
                                <View style={[
                                    styles.radioButton,
                                    { borderColor: selectedPayment === 'mastercard' ? theme.primary : theme.grey }
                                ]}>
                                    {selectedPayment === 'mastercard' && (
                                        <View style={[styles.radioButtonInner, { backgroundColor: theme.primary }]} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </ScrollView>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: theme.primary }]}
                            onPress={handleConfirmPayment}
                        >
                            <Text style={[styles.confirmButtonText, { fontFamily: Fonts.semiBold }]}>
                                Confirm Payment
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Terms and Conditions Modal */}
            {/* Terms and Conditions Modal */}
            <Modal
                visible={showTermsModal}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setShowTermsModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setShowTermsModal(false)}>
                        <View style={StyleSheet.absoluteFillObject} />
                    </TouchableWithoutFeedback>

                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.background,
                                maxHeight: maxPaymentDrawerHeight,
                            },
                        ]}
                    >
                        {/* Handle Bar */}
                        <View style={styles.handleBar} />

                        {/* Title */}
                        <Text
                            style={[
                                styles.modalTitle,
                                { color: theme.text, fontFamily: Fonts.bold },
                            ]}
                        >
                            Terms and Conditions
                        </Text>

                        {/* Scrollable Content */}
                        <ScrollView
                            style={styles.termsScrollView}
                            showsVerticalScrollIndicator
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text
                                style={[
                                    styles.termsText,
                                    { color: theme.grey, fontFamily: Fonts.regular },
                                ]}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{"\n\n"}

                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.{"\n\n"}

                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.{"\n\n"}

                                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.{"\n\n"}

                                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.{"\n\n"}

                                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                            </Text>
                        </ScrollView>

                        {/* Checkbox */}
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            activeOpacity={0.8}
                            onPress={() => setAgreedToTerms(!agreedToTerms)}
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    {
                                        borderColor: agreedToTerms
                                            ? theme.primary
                                            : theme.grey,
                                        backgroundColor: agreedToTerms
                                            ? theme.primary
                                            : 'transparent',
                                    },
                                ]}
                            >
                                {agreedToTerms && (
                                    <Ionicons
                                        name="checkmark"
                                        size={16}
                                        color="#FFFFFF"
                                    />
                                )}
                            </View>

                            <Text
                                style={[
                                    styles.checkboxLabel,
                                    {
                                        color: theme.text,
                                        fontFamily: Fonts.regular,
                                    },
                                ]}
                            >
                                I agree to the terms and conditions
                            </Text>
                        </TouchableOpacity>

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                {
                                    backgroundColor: agreedToTerms
                                        ? theme.primary
                                        : theme.grey,
                                    opacity: agreedToTerms ? 1 : 0.5,
                                },
                            ]}
                            onPress={handleContinueFromTerms}
                            disabled={!agreedToTerms}
                        >
                            <Text
                                style={[
                                    styles.confirmButtonText,
                                    { fontFamily: Fonts.semiBold },
                                ]}
                            >
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Order Success Modal */}
            < Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSuccessModal(false)}
                >
                    <TouchableOpacity
                        style={[
                            styles.successModalContent,
                            { backgroundColor: theme.background },
                        ]}
                        activeOpacity={1}
                    >
                        {/* Handle Bar */}
                        <View style={styles.handleBar} />

                        {/* Success Illustration */}
                        <View style={styles.successImageContainer}>
                            <Image
                                source={require('../assets/images/payment-successful.png')}
                                style={[styles.successCircle, styles.successImage]}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Success Title */}
                        <Text style={[styles.successTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                            Order Successfully
                        </Text>

                        {/* Success Message */}
                        <Text style={[styles.successMessage, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Your order will be packed by the clerk, will{'\n'}arrival at your house in 3 to 4 days
                        </Text>

                        {/* Track Order Button */}
                        <TouchableOpacity
                            style={[styles.trackOrderButton, { backgroundColor: theme.primary }]}
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace('/my-orders');
                            }}
                        >
                            <Text style={[styles.trackOrderButtonText, { fontFamily: Fonts.semiBold }]}>
                                Track Order
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal >
        </View >
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
        fontSize: 20,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    editButton: {
        fontSize: 16,
        fontWeight: '500',
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
    },
    addressContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    mapThumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        marginRight: 16,
    },
    mapThumbnailImage: {
        width: '100%',
        height: '100%',
    },
    mapPinSmall: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -10 }, { translateY: -20 }],
    },
    mapPinInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E8764B',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    addressInfo: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 13,
        lineHeight: 18,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    productImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productName: {
        flex: 1,
        fontSize: 17,
        fontWeight: '500',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        padding: 20,
        marginTop: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    mastercardLogo: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginRight: 16,
    },
    cardDetails: {
        flex: 1,
    },
    cardName: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardNumber: {
        fontSize: 14,
    },
    footer: {
        paddingTop: 12,
    },
    checkoutButton: {
        marginHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 32,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#E8764B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
    },
    paymentOptions: {
        marginBottom: 12,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    paymentOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden',
    },
    paymentIcon: {
        width: '100%',
        height: '100%',
    },
    mastercardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        flexDirection: 'row',
        position: 'relative',
    },
    mastercardCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    mastercardCircleRed: {
        backgroundColor: '#EB001B',
        position: 'absolute',
        left: 8,
    },
    mastercardCircleYellow: {
        backgroundColor: '#F79E1B',
        position: 'absolute',
        right: 8,
    },
    paymentOptionDetails: {
        flex: 1,
    },
    paymentOptionName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    paymentOptionInfo: {
        fontSize: 12,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -6,
        marginTop: -6,
    },
    confirmButton: {
        paddingVertical: 14,
        borderRadius: 32,
        alignItems: 'center',
        shadowColor: '#E8764B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    termsScrollView: {
        maxHeight: 300,
        marginBottom: 16,
    },
    termsText: {
        fontSize: 14,
        lineHeight: 22,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxLabel: {
        fontSize: 14,
        flex: 1,
    },
    successModalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
        alignItems: 'center',
    },
    successImageContainer: {
        marginVertical: 24,
    },
    successCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#F4A261',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successImage: {
        width: 140,
        height: 140,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    trackOrderButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
        shadowColor: '#E8764B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    trackOrderButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Cart;