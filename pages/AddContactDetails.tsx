// pages/AddContactDetails.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';

const AddContactDetails = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    // Receive address data passed from AddDeliveryAddress
    const params = useLocalSearchParams<{
        buildingName: string;
        flatNumber: string;
        floorNo: string;
        areaName: string;
        streetName: string;
        city: string;
        state: string;
        pincode: string;
        autofetchedAddress: string;
        latitude: string;
        longitude: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        isEditMode?: string;
    }>();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode] = useState(params?.isEditMode === 'true');

    useEffect(() => {
        // Load existing contact details if in edit mode
        if (isEditMode && params) {
            if (params.firstName) setFirstName(params.firstName);
            if (params.lastName) setLastName(params.lastName);
            if (params.phoneNumber) setPhoneNumber(params.phoneNumber);
        }
    }, []);

    const isFormValid = () => {
        return (
            firstName.trim() !== '' &&
            lastName.trim() !== ''
        );
    };

    const handleConfirm = async () => {
        if (!isFormValid()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsSaving(true);

        try {
            const addressData = {
                buildingName: params.buildingName,
                flatNumber: params.flatNumber,
                floorNo: params.floorNo,
                areaName: params.areaName,
                streetName: params.streetName,
                city: params.city,
                state: params.state,
                pincode: params.pincode,
                autofetchedAddress: params.autofetchedAddress,
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(),
            };

            await AsyncStorage.setItem('tempDeliveryAddress', JSON.stringify(addressData));

            if (isEditMode) {
                // In edit mode, go back to Cart (dismiss 2 screens)
                Alert.alert(
                    'Success',
                    'Delivery address updated successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.dismiss(2),
                        },
                    ]
                );
            } else {
                // In new address mode, dismiss the modal flow
                Alert.alert(
                    'Success',
                    'Delivery address added successfully!',
                    [
                        {
                            text: 'OK',
                            // Go back two screens to exit the add-address flow entirely
                            onPress: () => router.dismiss(2),
                        },
                    ]
                );
            }
        } catch (error) {
            console.error('Error saving address:', error);
            Alert.alert('Error', 'Failed to save address. Please try again.', [{ text: 'OK' }]);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Contact Details
                </Text>
                <Text style={[styles.stepIndicator, { color: theme.grey, fontFamily: Fonts.regular }]}>
                    {isEditMode ? 'Editing' : 'Step 2 of 2'}
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Address Summary Card */}
                <View style={[styles.summaryCard, { backgroundColor: theme.lightGrey, borderColor: theme.border }]}>
                    <View style={styles.summaryHeader}>
                        <Ionicons name="location" size={18} color={theme.primary} />
                        <Text style={[styles.summaryTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Delivering to
                        </Text>
                    </View>
                    <Text style={[styles.summaryAddress, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        {[
                            params.flatNumber && `Flat ${params.flatNumber}`,
                            params.buildingName,
                            params.areaName,
                            params.city,
                            params.pincode,
                        ]
                            .filter(Boolean)
                            .join(', ')}
                    </Text>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-outline" size={20} color={theme.text} />
                        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Contact Information
                        </Text>
                    </View>

                    <Text style={[styles.sectionSubtitle, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Who should we contact for this delivery?
                    </Text>

                    {/* First & Last Name */}
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                First Name
                            </Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                    fontFamily: Fonts.regular,
                                }]}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First name"
                                placeholderTextColor={theme.grey}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                Last Name
                            </Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                    fontFamily: Fonts.regular,
                                }]}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last name"
                                placeholderTextColor={theme.grey}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View style={styles.fullWidthInputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Phone Number{' '}
                            <Text style={[styles.optionalTag, { color: theme.grey }]}>(optional)</Text>
                        </Text>
                        <View style={[styles.phoneInput, { backgroundColor: theme.background, borderColor: theme.border }]}>
                            <Ionicons name="call-outline" size={20} color={theme.grey} />
                            <TextInput
                                style={[styles.phoneTextInput, { color: theme.text, fontFamily: Fonts.regular }]}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="Enter phone number"
                                placeholderTextColor={theme.grey}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                        <Text style={[styles.fieldHint, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            We'll only use this to contact you about your delivery.
                        </Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Save Button */}
            <View style={[styles.buttonContainer, { backgroundColor: theme.background }]}>
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        {
                            backgroundColor: isFormValid() ? theme.primary : theme.grey,
                            opacity: isFormValid() && !isSaving ? 1 : 0.5,
                        },
                    ]}
                    onPress={handleConfirm}
                    disabled={!isFormValid() || isSaving}
                    activeOpacity={0.8}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
                            <Text style={[styles.saveButtonText, { fontFamily: Fonts.semiBold }]}>
                                {isEditMode ? 'Update Address' : 'Save Address'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    headerTitle: { fontSize: 20, fontWeight: '700' },
    stepIndicator: { fontSize: 13 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
    summaryCard: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
        marginBottom: 28,
        gap: 6,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    summaryTitle: { fontSize: 14, fontWeight: '600' },
    summaryAddress: { fontSize: 13, lineHeight: 18, paddingLeft: 24 },
    section: { marginBottom: 24 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    sectionTitle: { fontSize: 16, fontWeight: '600' },
    sectionSubtitle: { fontSize: 13, marginBottom: 20, paddingLeft: 28 },
    inputRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    inputContainer: { flex: 1 },
    fullWidthInputContainer: { marginBottom: 16 },
    inputLabel: { fontSize: 12, marginBottom: 8 },
    input: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    phoneInput: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    phoneTextInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
    fieldHint: { fontSize: 11, marginTop: 6 },
    optionalTag: { fontSize: 11, fontStyle: 'italic' },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
    },
    saveButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default AddContactDetails;