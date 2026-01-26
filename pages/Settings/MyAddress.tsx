// pages/MyAddress.tsx
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

interface Address {
    id: string;
    label: string;
    address: string;
    city: string;
}

const MyAddress = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [selectedAddressId, setSelectedAddressId] = useState('1');

    const addresses: Address[] = [
        {
            id: '1',
            label: 'Home',
            address: '404, Lodha Luxuria',
            city: 'Majiwada, Thane',
        },
        {
            id: '2',
            label: 'Work',
            address: '101 W2, Siddhi Complex',
            city: 'Belapur, Navi Mumbai',
        },
        {
            id: '3',
            label: 'Friend',
            address: 'S203 Avatar, Cosmos Complex',
            city: 'Waghbil, Thane',
        },
    ];

    const handleBack = () => {
        router.back();
    };

    const handleSelectAddress = (id: string) => {
        setSelectedAddressId(id);
    };

    const handleAddNewAddress = () => {
        router.push('/add-address');
    };

    const getIconColor = (id: string) => {
        if (id === '1') return theme.primary;
        if (id === '2') return '#6366F1';
        return '#EC4899';
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Address
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Select Location Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Select default location
                    </Text>
                </View>

                {/* Address List */}
                <View style={styles.addressList}>
                    {addresses.map((address) => (
                        <TouchableOpacity
                            key={address.id}
                            style={[
                                styles.addressCard,
                                {
                                    backgroundColor: theme.background,
                                    borderColor: selectedAddressId === address.id ? theme.primary : theme.border,
                                    borderWidth: selectedAddressId === address.id ? 2 : 1,
                                }
                            ]}
                            onPress={() => handleSelectAddress(address.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.addressContent}>
                                <View style={styles.addressText}>
                                    <Text style={[styles.addressLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                        {address.label}
                                    </Text>
                                    <Text style={[styles.addressDetail, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        {address.address},
                                    </Text>
                                    <Text style={[styles.addressDetail, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                        {address.city}
                                    </Text>
                                </View>
                                <View style={[styles.iconCircle, { backgroundColor: selectedAddressId === address.id ? getIconColor(address.id) : theme.lightGrey }]}>
                                    <Ionicons
                                        name="location"
                                        size={24}
                                        color={selectedAddressId === address.id ? '#FFFFFF' : theme.grey}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Add New Address Button */}
            <View style={[styles.buttonContainer, { backgroundColor: theme.background }]}>
                <TouchableOpacity
                    style={[styles.addAddressButton, { borderColor: theme.primary }]}
                    onPress={handleAddNewAddress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                    <Text style={[styles.addAddressText, { color: theme.primary, fontFamily: Fonts.semiBold }]}>
                        Add New Address
                    </Text>
                </TouchableOpacity>
            </View>
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
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    addressList: {
        gap: 12,
        marginBottom: 16,
    },
    addressCard: {
        borderRadius: 16,
        padding: 16,
    },
    addressContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addressText: {
        flex: 1,
        marginRight: 12,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    addressDetail: {
        fontSize: 13,
        lineHeight: 18,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        gap: 8,
    },
    addAddressText: {
        fontSize: 15,
        fontWeight: '600',
    },
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
});

export default MyAddress;