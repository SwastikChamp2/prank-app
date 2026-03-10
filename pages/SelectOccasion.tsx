// pages/SelectOccasion.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    StatusBar,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Footer from '../components/Footer/Footer';
import { Colors, Fonts } from '../constants/theme';
import { updateCartItem, CartItem } from '../services/CartService';

const SelectOccasion: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    // Get all data from params
    const prankId = params.prankId as string;
    const prankTitle = params.prankTitle as string;
    const prankPrice = params.prankPrice as string;
    const prankImage = params.prankImage as string;
    const quantity = params.quantity as string;
    const boxId = params.boxId as string;
    const boxTitle = params.boxTitle as string;
    const boxPrice = params.boxPrice as string;
    const boxImage = params.boxImage as string;
    const wrapId = params.wrapId as string;
    const wrapTitle = params.wrapTitle as string;
    const wrapPrice = params.wrapPrice as string;
    const wrapImage = params.wrapImage as string;
    const message = params.message as string;

    const editMode = params.editMode === 'true';
    const currentOccasion = params.currentOccasion as string;

    const [occasion, setOccasion] = useState(currentOccasion || '');
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [savingToCart, setSavingToCart] = useState(false);

    const maxModalHeight = Dimensions.get('window').height * 0.7;

    const handleContinue = () => {
        setShowTermsModal(true);
    };

    const handleConfirmTerms = async () => {
        if (!agreedToTerms) {
            return;
        }

        setShowTermsModal(false);
        setSavingToCart(true);

        try {
            const cartItem: CartItem = {
                prankId,
                prankTitle,
                prankPrice: parseInt(prankPrice),
                prankImage,
                boxId,
                boxTitle,
                boxPrice: boxPrice ? parseInt(boxPrice) : null,
                boxImage,
                wrapId: wrapId || '',
                wrapTitle,
                wrapPrice: wrapPrice ? parseInt(wrapPrice) : null,
                wrapImage,
                message: message || '',
                occasion: occasion.trim(),
            };

            const success = await updateCartItem(cartItem);
            if (success) {
                router.push('/cart');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
        } finally {
            setSavingToCart(false);
            setAgreedToTerms(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.text }]}>Select Occasion</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={[styles.descriptionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Occasion of Sending the Gift
                    </Text>
                    <Text style={[styles.descriptionText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Let us know the Occasion for sending the gift so that we can remind you about it in the future
                    </Text>
                </View>

                {/* Occasion Text Area */}
                <View style={styles.textAreaContainer}>
                    <TextInput
                        style={[
                            styles.textArea,
                            {
                                backgroundColor: theme.searchBg,
                                color: theme.text,
                                fontFamily: Fonts.regular,
                            }
                        ]}
                        placeholder="e.g., Birthday, Anniversary, Friendship Day, etc."
                        placeholderTextColor={theme.grey}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={occasion}
                        onChangeText={setOccasion}
                        maxLength={100}
                    />
                    <Text style={[styles.characterCount, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        {occasion.length}/100 characters
                    </Text>
                </View>

                {/* Message Preview (if exists) */}
                {message ? (
                    <View style={[styles.messagePreview, { backgroundColor: theme.lightOrange }]}>
                        <View style={styles.messagePreviewHeader}>
                            <Ionicons name="mail" size={20} color={theme.primary} />
                            <Text style={[styles.messagePreviewLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                Anonymous Message
                            </Text>
                        </View>
                        <Text style={[styles.messagePreviewText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            "{message}"
                        </Text>
                    </View>
                ) : null}

                {/* Tips Section */}
                <View style={styles.tipsContainer}>
                    <View style={styles.tipRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.tipText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Help us remember special occasions
                        </Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.tipText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Get reminders for upcoming events
                        </Text>
                    </View>
                </View>

                {/* Continue Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            {
                                backgroundColor: !savingToCart ? theme.primary : theme.grey,
                                opacity: !savingToCart ? 1 : 0.5,
                            }
                        ]}
                        onPress={handleContinue}
                        disabled={savingToCart}
                    >
                        {savingToCart ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={[styles.continueButtonText, { fontFamily: Fonts.semiBold }]}>
                                Continue to Cart
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Footer */}
            <Footer />

            {/* Terms Modal */}
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
                                maxHeight: maxModalHeight,
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
                            Confirm Your Order
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
                                By proceeding, you confirm that the occasion information provided is accurate. We will use this information to help you remember important dates and provide better service in the future.{"\n\n"}

                                Please ensure your order details are correct before proceeding to payment.
                            </Text>
                        </ScrollView>

                        {/* Checkbox */}
                        <TouchableOpacity style={styles.checkboxContainer} activeOpacity={0.8} onPress={() => setAgreedToTerms(!agreedToTerms)}>
                            <View style={[styles.checkbox, { borderColor: agreedToTerms ? theme.primary : theme.grey, backgroundColor: agreedToTerms ? theme.primary : 'transparent', },]} >
                                {agreedToTerms && (<Ionicons name="checkmark" size={16} color="#FFFFFF" />)}
                            </View>
                            <Text style={[styles.checkboxLabel, { color: theme.text, fontFamily: Fonts.regular, },]} > I agree to proceed with this order </Text>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: agreedToTerms ? theme.primary : theme.grey, opacity: agreedToTerms ? 1 : 0.5, },]} onPress={handleConfirmTerms} disabled={!agreedToTerms} >
                            <Text style={[styles.confirmButtonText, { fontFamily: Fonts.semiBold },]} > Confirm </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    descriptionContainer: {
        marginTop: 20,
        marginBottom: 24,
    },
    descriptionTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    textAreaContainer: {
        marginBottom: 24,
    },
    textArea: {
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        minHeight: 120,
        maxHeight: 200,
    },
    characterCount: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'right',
    },
    messagePreview: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    messagePreviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    messagePreviewLabel: {
        fontSize: 14,
    },
    messagePreviewText: {
        fontSize: 13,
        fontStyle: 'italic',
        lineHeight: 18,
    },
    tipsContainer: {
        marginBottom: 24,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    tipText: {
        fontSize: 14,
        flex: 1,
    },
    buttonContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    continueButton: {
        paddingHorizontal: 80,
        paddingVertical: 16,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
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
    termsScrollView: {
        maxHeight: 200,
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
});

export default SelectOccasion;

