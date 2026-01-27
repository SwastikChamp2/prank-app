// pages/Profile.tsx
import React, { useState, useEffect } from 'react';
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
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { auth, db } from '../../config/firebase.config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Profile = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Others'>('Others');
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch user data from Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                await fetchUserData(user.uid);
                console.log(user.uid);
            } else {
                setLoading(false);
                Alert.alert('Error', 'No user logged in');
                router.back();
            }
        });



        return () => unsubscribe();
    }, []);

    const fetchUserData = async (uid: string) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUsername(userData.username || '');
                setGender(userData.gender || 'Others');
                setPhoneNumber(userData.phoneNumber || '');
            } else {
                Alert.alert('Error', 'User data not found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

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
        if (isEditing) {
            Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to go back?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => router.back()
                    },
                ]
            );
        } else {
            router.back();
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reload original data
            if (userId) {
                fetchUserData(userId);
            }
            setShowGenderDropdown(false);
        }
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        if (!userId) {
            Alert.alert('Error', 'User not authenticated');
            return;
        }

        if (!username.trim()) {
            Alert.alert('Validation Error', 'Username cannot be empty');
            return;
        }

        setSaving(true);

        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, {
                username: username.trim(),
                gender: gender,
                updatedAt: serverTimestamp(),
            });

            Alert.alert('Success', 'Profile updated successfully');
            setIsEditing(false);
            setShowGenderDropdown(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleGenderSelect = (selectedGender: 'Male' | 'Female' | 'Others') => {
        setGender(selectedGender);
        setShowGenderDropdown(false);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.text, fontFamily: Fonts.regular }]}>
                    Loading profile...
                </Text>
            </View>
        );
    }

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
                        {isEditing ? 'Edit Profile' : 'Profile'}
                    </Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditToggle}
                        disabled={saving}
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
                        {isEditing && (
                            <Text style={[styles.helperText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                Phone number cannot be changed
                            </Text>
                        )}
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
                            style={[
                                styles.saveButton,
                                { backgroundColor: saving ? theme.grey : theme.primary }
                            ]}
                            activeOpacity={0.8}
                            onPress={handleSaveChanges}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={[styles.saveButtonText, { fontFamily: Fonts.semiBold }]}>
                                    Save Changes
                                </Text>
                            )}
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
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
    helperText: {
        fontSize: 12,
        marginTop: 6,
        marginLeft: 16,
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