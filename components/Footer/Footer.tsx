import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useColorScheme } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';

const Footer: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (tab: string) => {
        switch (tab) {
            case 'home':
                return pathname === '/home' || pathname === '/';
            case 'orders':
                return pathname === '/my-orders';
            case 'cart':
                return pathname === '/cart';
            case 'settings':
                return pathname === '/settings';
            default:
                return tab === 'home';
        }
    };

    const handleTabPress = (tab: string) => {
        switch (tab) {
            case 'home':
                router.replace('/home');
                break;
            case 'orders':
                router.replace('/my-orders');
                break;
            case 'cart':
                router.replace('/cart');
                break;
            case 'settings':
                router.replace('/settings');
                break;
        }
    };

    const NavItem = ({
        icon,
        label,
        tabName,
        iconName
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        tabName: string;
        iconName: keyof typeof Ionicons.glyphMap;
    }) => {
        const active = isActive(tabName);

        return (
            <TouchableOpacity
                style={styles.navItem}
                activeOpacity={0.7}
                onPress={() => handleTabPress(tabName)}
            >
                {active ? (
                    <View style={[styles.navIconActive, { backgroundColor: theme.primary }]}>
                        <Ionicons name={icon} size={24} color="#FFFFFF" />
                    </View>
                ) : (
                    <Ionicons name={icon} size={24} color={theme.grey} />
                )}
                <Text
                    style={[
                        active ? styles.navLabelActive : styles.navLabel,
                        {
                            color: active ? theme.primary : theme.grey,
                            fontFamily: active ? Fonts.medium : Fonts.regular
                        }
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.bottomNav, { backgroundColor: theme.background }]}>
            <NavItem
                icon="home"
                label="Home"
                tabName="home"
                iconName="home"
            />
            <NavItem
                icon="receipt-outline"
                label="My Order"
                tabName="orders"
                iconName="receipt-outline"
            />
            <NavItem
                icon="cart-outline"
                label="Cart"
                tabName="cart"
                iconName="cart-outline"
            />
            <NavItem
                icon="settings-outline"
                label="Settings"
                tabName="settings"
                iconName="settings-outline"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    navItem: {
        alignItems: 'center',
        padding: 8,
    },
    navIconActive: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    navLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    navLabelActive: {
        fontSize: 12,
        marginTop: 4,
    },
});

export default Footer;
