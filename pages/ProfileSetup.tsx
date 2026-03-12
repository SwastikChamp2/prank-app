// pages/ProfileSetup.tsx
import React, { useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import { createOrUpdateUser } from '../services/AuthServices';

const { width, height } = Dimensions.get('window');

const ProfileSetup = () => {
    const { userId, phoneNumber, username, referralCode } = useLocalSearchParams<{
        userId: string;
        phoneNumber: string;
        username: string;
        referralCode?: string;
    }>();

    const [gender, setGender] = useState<'Male' | 'Female' | 'Others'>('Others');
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ gender: '', dateOfBirth: '' });
    
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    // Date picker state
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const validateForm = () => {
        let isValid = true;
        let newErrors = { gender: '', dateOfBirth: '' };

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
        
        const parts = dob.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parts[2];
            
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            if (month >= 0 && month < 12) {
                return `${day} ${months[month]} ${year}`;
            }
        }
        
        return dob;
    };

    const handleCompleteProfile = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create user with all details including gender and DOB
            await createOrUpdateUser(
                userId!,
                phoneNumber!,
                username,
                referralCode,
                gender,
                dateOfBirth
            );

            setLoading(false);

            // Navigate to home after successful profile completion
            router.replace('/home');
        } catch (error: any) {
            setLoading(false);
            console.error('Profile Setup Error:', error);
            Alert.alert('Error', error.message || 'Failed to complete profile. Please try again.');
        }
    };

    const handleBack = () => {
        // Prevent going back during profile setup
        Alert.alert(
            'Complete Your Profile',
            'Please complete your profile to continue.',
            [{ text: 'OK' }]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Top Decorative Image */}
            <Image
                source={require('../assets/images/top-decoration.png')}
                style={styles.topDecoration}
                resizeMode="contain"
            />

            {/* Back Button - Disabled to force profile completion */}
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
                        Complete Your Profile
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Tell us a bit more about yourself
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Gender Selection */}
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
                            disabled={loading}
                        >
                            <Ionicons name="person-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <Text style={[styles.inputText, { color: theme.text, fontFamily: Fonts.regular }]}>
                                {gender}
                            </Text>
                            <Ionicons 
                                name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color={theme.grey} 
                            />
                        </TouchableOpacity>
                        {errors.gender ? (
                            <Text style={styles.errorText}>{errors.gender}</Text>
                        ) : null}

                        {/* Gender Dropdown */}
                        {showGenderDropdown && (
                            <View style={[styles.dropdownContainer, { backgroundColor: theme.background, borderColor: '#E5E5E5' }]}>
                                {(['Male', 'Female', 'Others'] as const).map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.dropdownItem, { borderBottomColor: '#E5E5E5' }]}
                                        onPress={() => handleGenderSelect(option)}
                                    >
                                        <Text style={[styles.dropdownText, { color: theme.text, fontFamily: Fonts.regular }]}>
                                            {option}
                                        </Text>
                                        {gender === option && (
                                            <Ionicons name="checkmark" size={20} color={theme.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Date of Birth Selection */}
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
                            disabled={loading}
                        >
                            <Ionicons name="calendar-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <Text style={[
                                styles.inputText, 
                                { 
                                    color: dateOfBirth ? theme.text : theme.grey, 
                                    fontFamily: Fonts.regular 
                                }
                            ]}>
                                {dateOfBirth ? formatDisplayDate(dateOfBirth) : 'Select your date of birth'}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.grey} />
                        </TouchableOpacity>
                        <Text style={[styles.helperText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            We would love to know your birthday, so that we can share a fun FREE prank on your birthday.
                        </Text>
                        {errors.dateOfBirth ? (
                            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                        ) : null}
                    </View>
                </View>

                {/* Spacer */}
                <View style={styles.spacer} />

                {/* Complete Profile Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme.primary },
                        loading && styles.buttonDisabled
                    ]}
                    activeOpacity={0.8}
                    onPress={handleCompleteProfile}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={[styles.buttonText, { fontFamily: Fonts.semiBold }]}>
                            Complete Profile
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

                        {/* Selected Date Preview */}
                        {selectedDay && selectedMonth && selectedYear && (
                            <View style={[styles.datePreviewContainer, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}>
                                <Text style={[styles.datePreviewText, { color: theme.primary, fontFamily: Fonts.semiBold }]}>
                                    {formatDisplayDate(`${selectedDay}/${selectedMonth}/${selectedYear}`)}
                                </Text>
                            </View>
                        )}

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
    // Date Preview Styles
    datePreviewContainer: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 24,
        alignItems: 'center',
    },
    datePreviewText: {
        fontSize: 24,
    },
    helperText: {
        fontSize: 12,
        marginTop: 18,
        lineHeight: 16,
    },
});

export default ProfileSetup;

