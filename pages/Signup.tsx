// pages/Signup.tsx
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    useColorScheme,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../config/firebase.config';
import { sendOTP } from '../services/AuthServices';

const { width, height } = Dimensions.get('window');

const Signup = () => {
    const [username, setUsername] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ username: '', phone: '' });
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const recaptchaVerifier = useRef(null);

    const validateForm = () => {
        let isValid = true;
        let newErrors = { username: '', phone: '' };

        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        if (!mobileNumber) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (mobileNumber.length !== 10) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        if (errors.username) {
            setErrors({ ...errors, username: '' });
        }
    };

    const handleMobileNumberChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setMobileNumber(numericText);
        if (errors.phone) {
            setErrors({ ...errors, phone: '' });
        }
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formattedPhoneNumber = `+91${mobileNumber}`;
            const confirmationResult = await sendOTP(
                formattedPhoneNumber,
                recaptchaVerifier.current
            );

            // Store confirmation result and username globally
            (global as any).confirmationResult = confirmationResult;
            (global as any).signupUsername = username;

            setLoading(false);
            router.push({
                pathname: '/verify-otp',
                params: {
                    phoneNumber: mobileNumber,
                    username: username,
                    isSignup: 'true'
                }
            });
        } catch (error: any) {
            setLoading(false);
            console.error('OTP Error:', error);
            Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={auth.app.options}
                attemptInvisibleVerification={true}
            />

            {/* Top Decorative Image */}
            <Image
                source={require('../assets/images/top-decoration.png')}
                style={styles.topDecoration}
                resizeMode="contain"
            />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                disabled={loading}
            >
                <Ionicons name="arrow-back" size={28} color="#6B4FD8" />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Create Account
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Join in to send all the fun and crazy pranks
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Username Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Username
                        </Text>
                        <View style={[
                            styles.inputContainer,
                            {
                                backgroundColor: theme.background,
                                borderColor: errors.username ? '#FF3B30' : '#E5E5E5'
                            }
                        ]}>
                            <Ionicons name="person-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text, fontFamily: Fonts.regular }]}
                                placeholder="Choose a prankster name"
                                placeholderTextColor={theme.grey}
                                value={username}
                                onChangeText={handleUsernameChange}
                                editable={!loading}
                            />
                        </View>
                        {errors.username ? (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        ) : null}
                    </View>

                    {/* Mobile Number Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Mobile Number
                        </Text>
                        <View style={[
                            styles.inputContainer,
                            {
                                backgroundColor: theme.background,
                                borderColor: errors.phone ? '#FF3B30' : '#E5E5E5'
                            }
                        ]}>
                            <Ionicons name="call-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text, fontFamily: Fonts.regular }]}
                                placeholder="Enter your mobile number"
                                placeholderTextColor={theme.grey}
                                keyboardType="phone-pad"
                                value={mobileNumber}
                                onChangeText={handleMobileNumberChange}
                                maxLength={10}
                                editable={!loading}
                            />
                        </View>
                        {errors.phone ? (
                            <Text style={styles.errorText}>{errors.phone}</Text>
                        ) : null}
                    </View>
                </View>

                {/* Spacer */}
                <View style={styles.spacer} />

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme.primary },
                        loading && styles.buttonDisabled
                    ]}
                    activeOpacity={0.8}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={[styles.buttonText, { fontFamily: Fonts.semiBold }]}>
                            Join the Pranksters
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Decorative Image */}
            <Image
                source={require('../assets/images/bottom-decoration.png')}
                style={styles.bottomDecoration}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: width,
        height: 150,
        zIndex: 0,
    },
    bottomDecoration: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: width,
        height: 150,
        zIndex: 0,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 100,
        paddingBottom: 160,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 24,
        zIndex: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
    },
    form: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        height: '100%',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    spacer: {
        flex: 1,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#E8764B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
});

export default Signup;