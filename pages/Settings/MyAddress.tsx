// pages/MyAddress.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { getUserAddresses, setDefaultAddress, ensureDefaultAddress, AddressData } from '../../services/addressService';
import { useFocusEffect } from '@react-navigation/native';

const MyAddress = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [addresses, setAddresses] = useState<AddressData[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Load addresses when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadAddresses();
        }, [])
    );

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const fetchedAddresses = await ensureDefaultAddress();
            setAddresses(fetchedAddresses);

            // Find and set the default address
            const defaultAddress = fetchedAddresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            } else if (fetchedAddresses.length > 0) {
                // If no default, select the first one (most recent)
                setSelectedAddressId(fetchedAddresses[0].id);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
            Alert.alert('Error', 'Failed to load addresses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadAddresses();
        setRefreshing(false);
    };

    const handleBack = () => {
        router.back();
    };

    const handleSelectAddress = async (id: string) => {
        try {
            // Optimistically update UI
            setSelectedAddressId(id);

            // Update in Firebase
            await setDefaultAddress(id);

            // Update local state
            setAddresses(prevAddresses =>
                prevAddresses.map(addr => ({
                    ...addr,
                    isDefault: addr.id === id
                }))
            );

            Alert.alert('Success', 'Default address updated successfully');
        } catch (error) {
            console.error('Error setting default address:', error);
            Alert.alert('Error', 'Failed to update default address. Please try again.');
            // Revert optimistic update
            loadAddresses();
        }
    };

    const handleAddNewAddress = () => {
        router.push('/add-address');
    };

    const getIconColor = (index: number) => {
        const colors = [theme.primary, '#6366F1', '#EC4899', '#10B981', '#F59E0B'];
        return colors[index % colors.length];
    };

    const formatAddress = (address: AddressData) => {
        return `${address.flatNumber}, ${address.buildingName}, ${address.streetName}`;
    };

    const formatCity = (address: AddressData) => {
        return address.pincode;
    };

    if (loading) {
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

                {/* Loading State */}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Loading addresses...
                    </Text>
                </View>
            </View>
        );
    }

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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.primary}
                        colors={[theme.primary]}
                    />
                }
            >
                {/* Select Location Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                        Select default location
                    </Text>
                </View>

                {/* Address List */}
                {addresses.length > 0 ? (
                    <View style={styles.addressList}>
                        {addresses.map((address, index) => (
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
                                        <View style={styles.labelRow}>
                                            <Text style={[styles.addressLabel, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                                                {address.addressLabel}
                                            </Text>
                                            {address.isDefault && (
                                                <View style={[styles.defaultBadge, { backgroundColor: theme.primary }]}>
                                                    <Text style={[styles.defaultBadgeText, { fontFamily: Fonts.semiBold }]}>
                                                        Default
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.addressDetail, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            {formatAddress(address)}
                                        </Text>
                                        <Text style={[styles.addressDetail, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            Pincode: {formatCity(address)}
                                        </Text>
                                        <Text style={[styles.contactDetail, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                            {address.firstName} {address.lastName} • {address.phoneNumber}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.iconCircle,
                                        {
                                            backgroundColor: selectedAddressId === address.id
                                                ? getIconColor(index)
                                                : theme.lightGrey
                                        }
                                    ]}>
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
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={64} color={theme.grey} />
                        <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            No Addresses Found
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Add your first address to get started
                        </Text>
                    </View>
                )}
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
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    defaultBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    defaultBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    addressDetail: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 2,
    },
    contactDetail: {
        fontSize: 12,
        lineHeight: 16,
        marginTop: 4,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});

export default MyAddress;