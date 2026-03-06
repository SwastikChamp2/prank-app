// pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import Footer from '../../components/Footer/Footer';
import AppInfoDrawer from './AppInfoDrawer';
import HelpSupportDrawer from './HelpSupportDrawer';
import LogoutModal from './LogoutModal';
import { useAuth } from '../../contexts/AuthContext';
import { getUserReferralStats, getReferralLink } from '../../services/AuthServices';

interface SettingItem {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress: () => void;
    showChevron?: boolean;
    isLogout?: boolean;
}

const Profile = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { user } = useAuth();
    const [showAppInfo, setShowAppInfo] = useState(false);
    const [showHelpSupport, setShowHelpSupport] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [referralCount, setReferralCount] = useState(0);

    useEffect(() => {
        loadReferralStats();
    }, [user]);

    const loadReferralStats = async () => {
        if (user?.uid) {
            try {
                const stats = await getUserReferralStats(user.uid);
                if (stats) {
                    setReferralCode(stats.referralCode);
                    setReferralCount(stats.referralCount);
                }
            } catch (error) {
                console.error('Error loading referral stats:', error);
            }
        }
    };

    const handleCopyCode = async () => {
        try {
            // Using the Clipboard API from React Native
            const { Clipboard } = await import('react-native');
            Clipboard.setString(referralCode);
            Alert.alert('Copied!', 'Your referral code has been copied to clipboard');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            Alert.alert('Error', 'Failed to copy referral code');
        }
    };

    const handleShare = async () => {
        try {
            const referralLink = getReferralLink(referralCode);
            const message = `Join me on Don't Take Crap App and get started with fun pranks! Use my referral code: ${referralCode} or click here: ${referralLink}`;
            
            const { Share } = await import('react-native');
            await Share.share({
                message: message,
                title: 'Invite Friends'
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleLogout = () => {
        // Your logout logic here
        console.log('User logged out');
        // Navigate to login screen, clear auth tokens, etc.
    };


    const handleBack = () => {
        router.push('/home');
    };

    const generalSettings: SettingItem[] = [
        {
            id: 'profile',
            icon: 'person-outline',
            label: 'Profile',
            onPress: () => router.push('/view-profile'),
            showChevron: true,
        },
        // {
        //     id: 'my-address',
        //     icon: 'location-outline',
        //     label: 'My Address',
        //     onPress: () => router.push('/my-address'),
        //     showChevron: true,
        // },
        {
            id: 'faq',
            icon: 'help-circle-outline',
            label: 'FAQ',
            onPress: () => router.push('/faq'),
            showChevron: true,
        },
        {
            id: 'language',
            icon: 'globe-outline',
            label: 'Language',
            value: 'English',
            onPress: () => router.push('/language'),
            showChevron: true,
        },
    ];

    const preferenceSettings: SettingItem[] = [

        {
            id: 'terms-conditions',
            icon: 'folder-outline',
            label: 'Terms & Conditions',
            onPress: () => router.push('/terms-conditions'),
            showChevron: true,
        },
        {
            id: 'privacy-policy',
            icon: 'shield-checkmark-outline',
            label: 'Privacy Policy',
            onPress: () => router.push('/privacy-policy'),
            showChevron: true,
        },
        {
            id: 'app-info',
            icon: 'information-circle-outline',
            label: 'App Information',
            onPress: () => setShowAppInfo(true),
            showChevron: true,
        },
        {
            id: 'help-support',
            icon: 'headset-outline',
            label: 'Help & Support',
            onPress: () => setShowHelpSupport(true),
            showChevron: true,
        },
        {
            id: 'logout',
            icon: 'log-out-outline',
            label: 'Logout',
            onPress: () => setShowLogoutModal(true),
            showChevron: false,
            isLogout: true,
        },
    ];

    const renderSettingItem = (item: SettingItem) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.settingItem, { backgroundColor: theme.background }]}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.lightGrey }]}>
                    <Ionicons
                        name={item.icon}
                        size={20}
                        color={item.isLogout ? theme.logoutRed : theme.text}
                    />
                </View>
                <Text
                    style={[
                        styles.settingLabel,
                        {
                            color: item.isLogout ? theme.logoutRed : theme.text,
                            fontFamily: Fonts.medium
                        }
                    ]}
                >
                    {item.label}
                </Text>
            </View>

            <View style={styles.settingRight}>
                {item.value && (
                    <Text style={[styles.settingValue, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        {item.value}
                    </Text>
                )}
                {item.showChevron && (
                    <Ionicons name="chevron-forward" size={20} color={theme.grey} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Settings
                </Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Referral Banner - Above General Section */}
                {referralCode ? (
                    <View style={[styles.referralBanner, { backgroundColor: theme.primary }]}>
                        <View style={styles.referralContent}>
                            <View style={styles.referralHeader}>
                                <Ionicons name="gift" size={24} color="#FFFFFF" />
                                <Text style={[styles.referralTitle, { fontFamily: Fonts.bold }]}>
                                    Refer Friends & Earn
                                </Text>
                            </View>
                            <Text style={[styles.referralSubtitle, { fontFamily: Fonts.regular }]}>
                                Share your referral code and earn rewards for every friend who joins!
                            </Text>
                            
                            {/* Referral Code Display */}
                            <View style={styles.codeContainer}>
                                <Text style={[styles.codeLabel, { fontFamily: Fonts.medium }]}>
                                    Your Code
                                </Text>
                                <View style={styles.codeBox}>
                                    <Text style={[styles.codeText, { fontFamily: Fonts.bold }]}>
                                        {referralCode}
                                    </Text>
                                    <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                                        <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Referral Stats */}
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statNumber, { fontFamily: Fonts.bold }]}>
                                        {referralCount}
                                    </Text>
                                    <Text style={[styles.statLabel, { fontFamily: Fonts.regular }]}>
                                        Friends Joined
                                    </Text>
                                </View>
                            </View>

                            {/* Share Button */}
                            <TouchableOpacity 
                                style={styles.shareButton} 
                                onPress={handleShare}
                            >
                                <Ionicons name="share-social-outline" size={20} color={theme.primary} />
                                <Text style={[styles.shareButtonText, { fontFamily: Fonts.semiBold }]}>
                                    Share with Friends
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}

                {/* General Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        General
                    </Text>
                    <View style={styles.settingsList}>
                        {generalSettings.map(renderSettingItem)}
                    </View>
                </View>

                {/* Preferences Section - Now Renamed as Others */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                        Others
                    </Text>
                    <View style={styles.settingsList}>
                        {preferenceSettings.map(renderSettingItem)}
                    </View>
                </View>

                {/* Bottom spacing for footer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            <AppInfoDrawer
                visible={showAppInfo}
                onClose={() => setShowAppInfo(false)}
            />

            <HelpSupportDrawer
                visible={showHelpSupport}
                onClose={() => setShowHelpSupport(false)}
            />


            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />


            {/* Footer Navigation */}
            <Footer />



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
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    // Referral Banner Styles
    referralBanner: {
        borderRadius: 16,
        marginBottom: 24,
        overflow: 'hidden',
    },
    referralContent: {
        padding: 20,
    },
    referralHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    referralTitle: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    referralSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 16,
    },
    codeContainer: {
        marginBottom: 16,
    },
    codeLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    codeText: {
        fontSize: 24,
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    copyButton: {
        padding: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
    },
    shareButtonText: {
        fontSize: 16,
        color: '#E8764B',
    },
    // Section Styles
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    settingsList: {
        gap: 12,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        fontSize: 14,
    },
    bottomSpacer: {
        height: 20,
    },
});

export default Profile;