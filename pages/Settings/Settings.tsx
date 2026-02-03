// pages/Settings.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import Footer from '../../components/Footer/Footer';
import AppInfoDrawer from '../../pages/Settings/AppInfoDrawer';
import HelpSupportDrawer from '../../pages/Settings/HelpSupportDrawer';
import LogoutModal from './LogoutModal';

interface SettingItem {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress: () => void;
    showChevron?: boolean;
    isLogout?: boolean;
}

const Settings = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const [showAppInfo, setShowAppInfo] = useState(false);
    const [showHelpSupport, setShowHelpSupport] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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
            onPress: () => router.push('/profile'),
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

export default Settings;