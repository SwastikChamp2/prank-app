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
    Modal,
    TouchableWithoutFeedback,
    StyleSheet as RNStyleSheet,
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
    const [gender, setGender] = useState<'Male' | 'Female' | 'Others'>('Others');
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [showReferralInput, setShowReferralInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ username: '', phone: '', gender: '', dateOfBirth: '', referral: '' });
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const recaptchaVerifier = useRef(null);

    // Date picker state
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const validateForm = () => {
        let isValid = true;
        let newErrors = { username: '', phone: '', gender: '', dateOfBirth: '', referral: '' };

        if (!username.trim()) {
            newErrors.username = 'Name is required';
            isValid = false;
        } else if (username.trim().length < 2) {
            newErrors.username = 'Name must be at least 2 characters';
            isValid = false;
        }

        if (!mobileNumber) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (mobileNumber.length !== 10) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        if (!gender) {
            newErrors.gender = 'Gender is required';
            isValid = false;
        }

        if (!dateOfBirth) {
            newErrors.dateOfBirth = 'Date of Birth is required';
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

    const handleGenderSelect = (selectedGender: 'Male' | 'Female' | 'Others') => {
        setGender(selectedGender);
        setShowGenderDropdown(false);
        if (errors.gender) {
            setErrors({ ...errors, gender: '' });
        }
    };

    const handleDateChange = (type: 'day' | 'month' | 'year', value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        
        if (type === 'day') {
            const day = numericValue.slice(0, 2);
            setSelectedDay(day);
        } else if (type === 'month') {
            const month = numericValue.slice(0, 2);
            setSelectedMonth(month);
        } else if (type === 'year') {
            const year = numericValue.slice(0, 4);
            setSelectedYear(year);
        }
        
        if (errors.dateOfBirth) {
            setErrors({ ...errors, dateOfBirth: '' });
        }
    };

    const handleConfirmDate = () => {
        if (selectedDay && selectedMonth && selectedYear) {
            setDateOfBirth(`${selectedDay}/${selectedMonth}/${selectedYear}`);
            setShowDatePicker(false);
        }
    };

    const formatDisplayDate = (dob: string) => {
        if (!dob) return 'Select Date of Birth';
        return dob;
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

            // Store confirmation result and user data globally
            (global as any).confirmationResult = confirmationResult;
            (global as any).signupUsername = username;
            (global as any).signupGender = gender;
            (global as any).signupDateOfBirth = dateOfBirth;
            (global as any).signupReferralCode = referralCode;

            setLoading(false);
            router.push({
                pathname: '/verify-otp',
                params: {
                    phoneNumber: mobileNumber,
                    username: username,
                    isSignup: 'true',
                    referralCode: referralCode || ''
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
                    {/* Username Input - Changed to Name */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Name <Text style={{ color: '#FF3B30' }}>*</Text>
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
                                placeholder="Enter your name"
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
                            Mobile Number <Text style={{ color: '#FF3B30' }}>*</Text>
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

                    {/* Gender Field - NEW */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Gender <Text style={{ color: '#FF3B30' }}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.inputContainer,
                                {
                                    backgroundColor: theme.background,
                                    borderColor: errors.gender ? '#FF3B30' : '#E5E5E5'
                                }
                            ]}
                            onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="male-female-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <Text style={[styles.inputText, { color: theme.text, fontFamily: Fonts.regular, flex: 1 }]}>
                                {gender}
                            </Text>
                            <Ionicons
                                name={showGenderDropdown ? "chevron-up" : "chevron-down"}
                                size={20}
                                color={theme.grey}
                            />
                        </TouchableOpacity>

                        {/* Gender Dropdown */}
                        {showGenderDropdown && (
                            <View style={[styles.dropdownContainer, { backgroundColor: theme.background, borderColor: '#E5E5E5' }]}>
                                {['Male', 'Female', 'Others'].map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.dropdownItem,
                                            { borderBottomColor: theme.border }
                                        ]}
                                        onPress={() => handleGenderSelect(option as 'Male' | 'Female' | 'Others')}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.dropdownText,
                                                {
                                                    color: gender === option ? theme.primary : theme.text,
                                                    fontFamily: gender === option ? Fonts.semiBold : Fonts.regular
                                                }
                                            ]}
                                        >
                                            {option}
                                        </Text>
                                        {gender === option && (
                                            <Ionicons name="checkmark" size={20} color={theme.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {errors.gender ? (
                            <Text style={styles.errorText}>{errors.gender}</Text>
                        ) : null}
                    </View>

                    {/* Date of Birth Field - NEW */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Date of Birth <Text style={{ color: '#FF3B30' }}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.inputContainer,
                                {
                                    backgroundColor: theme.background,
                                    borderColor: errors.dateOfBirth ? '#FF3B30' : '#E5E5E5'
                                }
                            ]}
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="calendar-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <Text style={[styles.inputText, { color: theme.text, fontFamily: Fonts.regular, flex: 1 }]}>
                                {formatDisplayDate(dateOfBirth)}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color={theme.grey} />
                        </TouchableOpacity>
                        <Text style={[styles.helperText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            We would love to know your birthday, so that we can share a fun FREE prank on your birthday.
                        </Text>
                        {errors.dateOfBirth ? (
                            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                        ) : null}
                    </View>

                    {/* Referral Code Input - Collapsible */}
                    <View style={styles.inputGroup}>
                        {!showReferralInput ? (
                            <TouchableOpacity 
                                style={styles.referralToggle}
                                onPress={() => setShowReferralInput(true)}
                            >
                                <Ionicons name="gift-outline" size={20} color={theme.primary} />
                                <Text style={[styles.referralToggleText, { color: theme.primary, fontFamily: Fonts.medium }]}>
                                    Have a referral code?
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View>
                                <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
                                    Referral Code (Optional)
                                </Text>
                                <View style={[
                                    styles.inputContainer,
                                    {
                                        backgroundColor: theme.background,
                                        borderColor: errors.referral ? '#FF3B30' : '#E5E5E5'
                                    }
                                ]}>
                                    <Ionicons name="gift-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, { color: theme.text, fontFamily: Fonts.regular }]}
                                        placeholder="Enter referral code"
                                        placeholderTextColor={theme.grey}
                                        value={referralCode}
                                        onChangeText={(text) => setReferralCode(text.toUpperCase())}
                                        maxLength={6}
                                        autoCapitalize="characters"
                                        editable={!loading}
                                    />
                                </View>
                                {errors.referral ? (
                                    <Text style={styles.errorText}>{errors.referral}</Text>
                                ) : null}
                                <TouchableOpacity 
                                    onPress={() => {
                                        setShowReferralInput(false);
                                        setReferralCode('');
                                    }}
                                >
                                    <Text style={[styles.removeReferralText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        Remove referral code
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
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

            {/* Date Picker Modal */}
            <Modal
                visible={showDatePicker}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                        <View style={RNStyleSheet.absoluteFillObject} />
                    </TouchableWithoutFeedback>

                    <View style={[styles.datePickerContainer, { backgroundColor: theme.background }]}>
                        <View style={styles.datePickerHandle} />
                        
                        <Text style={[styles.datePickerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                            Select Date of Birth
                        </Text>

                        <View style={styles.dateInputRow}>
                            {/* Day Input */}
                            <View style={[styles.dateInputBox, { backgroundColor: theme.searchBg || '#F5F5F5' }]}>
                                <TextInput
                                    style={[styles.dateInput, { color: theme.text, fontFamily: Fonts.semiBold }]}
                                    placeholder="DD"
                                    placeholderTextColor={theme.grey}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={selectedDay}
                                    onChangeText={(value) => handleDateChange('day', value)}
                                />
                            </View>
                            <Text style={[styles.dateSeparator, { color: theme.text }]}>/</Text>
                            
                            {/* Month Input */}
                            <View style={[styles.dateInputBox, { backgroundColor: theme.searchBg || '#F5F5F5' }]}>
                                <TextInput
                                    style={[styles.dateInput, { color: theme.text, fontFamily: Fonts.semiBold }]}
                                    placeholder="MM"
                                    placeholderTextColor={theme.grey}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={selectedMonth}
                                    onChangeText={(value) => handleDateChange('month', value)}
                                />
                            </View>
                            <Text style={[styles.dateSeparator, { color: theme.text }]}>/</Text>
                            
                            {/* Year Input */}
                            <View style={[styles.dateInputBox, { backgroundColor: theme.searchBg || '#F5F5F5' }]}>
                                <TextInput
                                    style={[styles.dateInput, { color: theme.text, fontFamily: Fonts.semiBold }]}
                                    placeholder="YYYY"
                                    placeholderTextColor={theme.grey}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    value={selectedYear}
                                    onChangeText={(value) => handleDateChange('year', value)}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.confirmDateButton, { backgroundColor: theme.primary }]}
                            onPress={handleConfirmDate}
                        >
                            <Text style={[styles.confirmDateText, { fontFamily: Fonts.semiBold }]}>
                                Confirm
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
    inputText: {
        flex: 1,
        fontSize: 15,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    helperText: {
        fontSize: 12,
        marginTop: 8,
        lineHeight: 16,
    },
    dropdownContainer: {
        marginTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    dropdownText: {
        fontSize: 15,
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
    referralToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    referralToggleText: {
        fontSize: 15,
    },
    removeReferralText: {
        fontSize: 13,
        marginTop: 8,
        textAlign: 'center',
    },
    // Date Picker Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    datePickerContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
    },
    datePickerHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    datePickerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
    dateInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dateInputBox: {
        width: 70,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateInput: {
        fontSize: 20,
        textAlign: 'center',
        width: '100%',
    },
    dateSeparator: {
        fontSize: 24,
        fontWeight: '600',
        marginHorizontal: 8,
    },
    confirmDateButton: {
        paddingVertical: 16,
        borderRadius: 28,
        alignItems: 'center',
    },
    confirmDateText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Signup;

