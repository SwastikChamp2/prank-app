// pages/Profile/Signup.tsx
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const Signup = () => {
    const [username, setUsername] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/verify-otp');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Top Decorative Image - Placeholder */}

            <Image
                source={require('../assets/images/top-decoration.png')}
                style={styles.topDecoration}
                resizeMode="contain"
            />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
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
                        <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
                            <Ionicons name="person-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text, fontFamily: Fonts.regular }]}
                                placeholder="Choose a prankster name"
                                placeholderTextColor={theme.grey}
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>
                    </View>

                    {/* Mobile Number Input */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
                            Mobile Number
                        </Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
                            <Ionicons name="call-outline" size={20} color={theme.grey} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text, fontFamily: Fonts.regular }]}
                                placeholder="Enter your mobile number"
                                placeholderTextColor={theme.grey}
                                keyboardType="phone-pad"
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                            />
                        </View>
                    </View>
                </View>

                {/* Spacer */}
                <View style={styles.spacer} />

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    activeOpacity={0.8}
                    onPress={handleSignUp}
                >
                    <Text style={[styles.buttonText, { fontFamily: Fonts.semiBold }]}>
                        Join the Pranksters
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Decorative Image - Placeholder */}
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
        borderColor: '#E5E5E5',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        height: '100%',
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
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
});

export default Signup;