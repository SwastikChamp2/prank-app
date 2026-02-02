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

const SelectMessage: React.FC = () => {
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

    const [message, setMessage] = useState('');
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [savingToCart, setSavingToCart] = useState(false);

    const maxModalHeight = Dimensions.get('window').height * 0.7;

    const handleContinue = () => {
        if (!message.trim()) {
            return;
        }
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
                message: message.trim(),
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

                <Text style={[styles.headerTitle, { color: theme.text }]}>Select Message</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={[styles.descriptionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Add Anonymous Message
                    </Text>
                    <Text style={[styles.descriptionText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Write a fun, anonymous message to accompany your prank! Keep it light-hearted and appropriate.
                    </Text>
                </View>

                {/* Message Text Area */}
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
                        placeholder="Type your anonymous message here..."
                        placeholderTextColor={theme.grey}
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                        value={message}
                        onChangeText={setMessage}
                        maxLength={500}
                    />
                    <Text style={[styles.characterCount, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        {message.length}/500 characters
                    </Text>
                </View>

                {/* Tips Section */}
                <View style={styles.tipsContainer}>
                    <View style={styles.tipRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.tipText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Keep it fun and light-hearted
                        </Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.tipText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            No offensive or harmful content
                        </Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.tipText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Respect privacy and boundaries
                        </Text>
                    </View>
                </View>

                {/* Continue Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            {
                                backgroundColor: message.trim() && !savingToCart ? theme.primary : theme.grey,
                                opacity: message.trim() && !savingToCart ? 1 : 0.5,
                            }
                        ]}
                        onPress={handleContinue}
                        disabled={!message.trim() || savingToCart}
                    >
                        {savingToCart ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={[styles.continueButtonText, { fontFamily: Fonts.semiBold }]}>
                                Continue
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Footer */}
            <Footer />

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
                            Message Guidelines
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
                                By adding a message to your prank, you agree to follow these important guidelines:{"\n\n"}

                                <Text style={{ fontFamily: Fonts.semiBold, color: theme.text }}>Prohibited Content:{"\n"}</Text>
                                • No threats, harassment, or intimidation of any kind{"\n"}
                                • No hate speech, discriminatory, or offensive language{"\n"}
                                • No personal information (addresses, phone numbers, etc.){"\n"}
                                • No explicit, sexual, or inappropriate content{"\n"}
                                • No promotion of illegal activities or substances{"\n"}
                                • No impersonation or false claims{"\n\n"}

                                <Text style={{ fontFamily: Fonts.semiBold, color: theme.text }}>General Rules:{"\n"}</Text>
                                • Keep messages fun, light-hearted, and appropriate{"\n"}
                                • Respect the recipient's privacy and dignity{"\n"}
                                • Messages should be in good taste and non-harmful{"\n"}
                                • We reserve the right to review and reject inappropriate messages{"\n\n"}

                                <Text style={{ fontFamily: Fonts.semiBold, color: theme.text }}>Your Responsibility:{"\n"}</Text>
                                You are solely responsible for the content of your message. Violation of these guidelines may result in order cancellation without refund and potential account suspension.{"\n\n"}

                                Please ensure your message is appropriate, respectful, and complies with all guidelines before proceeding.
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
                                        borderColor: agreedToTerms ? theme.primary : theme.grey,
                                        backgroundColor: agreedToTerms ? theme.primary : 'transparent',
                                    },
                                ]}
                            >
                                {agreedToTerms && (
                                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
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
                                I agree to follow the message guidelines
                            </Text>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                {
                                    backgroundColor: agreedToTerms ? theme.primary : theme.grey,
                                    opacity: agreedToTerms ? 1 : 0.5,
                                },
                            ]}
                            onPress={handleConfirmTerms}
                            disabled={!agreedToTerms}
                        >
                            <Text
                                style={[
                                    styles.confirmButtonText,
                                    { fontFamily: Fonts.semiBold },
                                ]}
                            >
                                Add to Cart
                            </Text>
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
        minHeight: 200,
        maxHeight: 300,
    },
    characterCount: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'right',
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

export default SelectMessage;