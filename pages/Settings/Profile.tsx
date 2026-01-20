// pages/Profile.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    useColorScheme,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';

const Profile = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('Rohan Kumar');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Others'>('Male');
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const phoneNumber = '+91 99887 76543';

    const getProfileImage = () => {
        switch (gender) {
            case 'Male':
                return require('../../assets/images/profile.jpg');
            case 'Female':
                return require('../../assets/images/profile-2.jpg');
            case 'Others':
                return require('../../assets/images/profile-3.png');
            default:
                return require('../../assets/images/profile.jpg');
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = () => {
        console.log('Saving changes:', username, gender);
        setIsEditing(false);
        setShowGenderDropdown(false);
        // Here you would typically save to backend/state management
    };

    const handleGenderSelect = (selectedGender: 'Male' | 'Female' | 'Others') => {
        setGender(selectedGender);
        setShowGenderDropdown(false);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Edit Profile
                    </Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditToggle}
                    >
                        <Ionicons
                            name={isEditing ? "close" : "create-outline"}
                            size={24}
                            color={theme.text}
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Profile Image */}
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImageWrapper}>
                            <Image
                                source={getProfileImage()}
                                style={styles.profileImage}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* Username Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.fieldLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Username
                        </Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
                            <Ionicons name="person-outline" size={20} color={theme.primary} />
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: theme.text,
                                        fontFamily: Fonts.regular
                                    }
                                ]}
                                value={username}
                                onChangeText={setUsername}
                                editable={isEditing}
                                placeholder="Enter username"
                                placeholderTextColor={theme.grey}
                            />
                        </View>
                    </View>

                    {/* Phone Number Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.fieldLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Phone Number
                        </Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
                            <Ionicons name="call-outline" size={20} color={isEditing ? theme.grey : theme.primary} />
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: isEditing ? theme.grey : theme.text,
                                        fontFamily: Fonts.regular
                                    }
                                ]}
                                value={phoneNumber}
                                editable={false}
                                placeholder="Phone number"
                                placeholderTextColor={theme.grey}
                            />
                        </View>
                    </View>

                    {/* Gender Field */}
                    <View style={styles.fieldContainer}>
                        <Text style={[styles.fieldLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Gender
                        </Text>
                        <TouchableOpacity
                            style={[styles.inputContainer, { backgroundColor: theme.background }]}
                            onPress={() => isEditing && setShowGenderDropdown(!showGenderDropdown)}
                            disabled={!isEditing}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="male-female-outline" size={20} color={theme.primary} />
                            <Text
                                style={[
                                    styles.input,
                                    {
                                        color: theme.text,
                                        fontFamily: Fonts.regular
                                    }
                                ]}
                            >
                                {gender}
                            </Text>
                            {isEditing && (
                                <Ionicons
                                    name={showGenderDropdown ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={theme.grey}
                                />
                            )}
                        </TouchableOpacity>

                        {/* Gender Dropdown */}
                        {showGenderDropdown && isEditing && (
                            <View style={[styles.dropdownContainer, { backgroundColor: theme.background }]}>
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
                    </View>
                </ScrollView>

                {/* Save Changes Button - Only show when editing */}
                {isEditing && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: theme.primary }]}
                            activeOpacity={0.8}
                            onPress={handleSaveChanges}
                        >
                            <Text style={[styles.saveButtonText, { fontFamily: Fonts.semiBold }]}>
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
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
    editButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    profileImageWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        backgroundColor: '#E0E0E0',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    fieldContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
    },
    dropdownContainer: {
        marginTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
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
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 40,
    },
    saveButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Profile;