// pages/AddDeliveryAddress.tsx
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
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors, Fonts } from '../constants/theme';

const AddDeliveryAddress = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const params = useLocalSearchParams();

    const [addressLabel, setAddressLabel] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [streetName, setStreetName] = useState('');
    const [pincode, setPincode] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 19.2183,
        longitude: 72.9781,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [markerCoordinate, setMarkerCoordinate] = useState({
        latitude: 19.2183,
        longitude: 72.9781,
    });
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Debounced search for suggestions
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length > 2) {
                fetchSuggestions(searchQuery);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Please enable location permissions to use this feature.',
                    [{ text: 'OK' }]
                );
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = location.coords;

            await updateLocationDetails(latitude, longitude);

            setMapRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            setMarkerCoordinate({ latitude, longitude });
            setIsMapReady(true);
            setLoading(false);
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Failed to get current location');
            setLoading(false);
        }
    };

    const updateLocationDetails = async (latitude: number, longitude: number) => {
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];

                // Build full address string
                const addressParts = [
                    address.name,
                    address.street,
                    address.district,
                    address.city,
                    address.region,
                    address.country
                ].filter(Boolean);

                const fullAddress = addressParts.join(', ');
                setSelectedAddress(fullAddress);

                // Auto-fill pincode
                if (address.postalCode) {
                    setPincode(address.postalCode);
                }

                // Auto-fill street name if available
                if (address.street && !streetName) {
                    setStreetName(address.street);
                }
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    };

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `format=json&` +
                `q=${encodeURIComponent(query)}&` +
                `limit=5&` +
                `addressdetails=1`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'prank-app'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const formattedSuggestions = data.map((item: any) => ({
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                    address: item.display_name,
                    name: item.name,
                    type: item.type,
                }));

                setSuggestions(formattedSuggestions);
                setShowSuggestions(formattedSuggestions.length > 0);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionSelect = async (suggestion: any) => {
        setSearchQuery(suggestion.address);
        setShowSuggestions(false);
        setSuggestions([]);

        setSearching(true);
        setIsMapReady(false);

        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const { latitude, longitude } = suggestion;

            setMarkerCoordinate({ latitude, longitude });

            setMapRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            await updateLocationDetails(latitude, longitude);

            await new Promise(resolve => setTimeout(resolve, 200));
            setIsMapReady(true);
        } catch (error) {
            console.error('Error selecting suggestion:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleMapPress = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;

        setMarkerCoordinate({ latitude, longitude });
        await updateLocationDetails(latitude, longitude);
    };

    const handleRecenterMap = async () => {
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);

        setLoading(true);
        setIsMapReady(false);

        await getCurrentLocation();
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            Alert.alert('Error', 'Please enter a location to search');
            return;
        }

        setSearching(true);
        setIsMapReady(false);
        setShowSuggestions(false);

        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const geocode = await Location.geocodeAsync(searchQuery);

            if (geocode.length > 0) {
                const { latitude, longitude } = geocode[0];

                setMarkerCoordinate({ latitude, longitude });

                setMapRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });

                await updateLocationDetails(latitude, longitude);

                await new Promise(resolve => setTimeout(resolve, 200));
                setIsMapReady(true);
            } else {
                Alert.alert('Not Found', 'Location not found. Please try a different search.');
                setIsMapReady(true);
            }
        } catch (error) {
            console.error('Error searching location:', error);
            Alert.alert('Error', 'Failed to search location. Please try again.');
            setIsMapReady(true);
        } finally {
            setSearching(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const isFormValid = () => {
        return (
            addressLabel.trim() !== '' &&
            buildingName.trim() !== '' &&
            streetName.trim() !== '' &&
            pincode.trim() !== '' &&
            flatNumber.trim() !== '' &&
            phoneNumber.trim() !== '' &&
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            selectedAddress.trim() !== ''
        );
    };

    const handleConfirm = async () => {
        if (!isFormValid()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsSaving(true);

        try {
            // Prepare address data
            const addressData = {
                addressLabel: addressLabel.trim(),
                buildingName: buildingName.trim(),
                streetName: streetName.trim(),
                pincode: pincode.trim(),
                flatNumber: flatNumber.trim(),
                phoneNumber: phoneNumber.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                autofetchedAddress: selectedAddress,
                latitude: markerCoordinate.latitude,
                longitude: markerCoordinate.longitude,
            };

            // Store in AsyncStorage temporarily
            await AsyncStorage.setItem('tempDeliveryAddress', JSON.stringify(addressData));

            Alert.alert(
                'Success',
                'Delivery address added successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('Error saving address:', error);
            Alert.alert(
                'Error',
                'Failed to save address. Please try again.',
                [{ text: 'OK' }]
            );
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
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
                    Delivery Address
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Select Location on Map */}
                <View style={styles.section}>
                    {/* Search Bar */}
                    <View style={styles.searchWrapper}>
                        <View style={[styles.searchContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                            <Ionicons name="search-outline" size={20} color={theme.grey} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.regular }]}
                                value={searchQuery}
                                onChangeText={(text) => {
                                    setSearchQuery(text);
                                    setShowSuggestions(true);
                                }}
                                placeholder="Search for a location"
                                placeholderTextColor={theme.grey}
                                returnKeyType="search"
                                onSubmitEditing={handleSearch}
                                onFocus={() => {
                                    if (suggestions.length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                            />
                            {searching ? (
                                <ActivityIndicator size="small" color={theme.primary} />
                            ) : (
                                <TouchableOpacity onPress={handleSearch} disabled={!searchQuery.trim()}>
                                    <Ionicons
                                        name="arrow-forward-circle"
                                        size={24}
                                        color={searchQuery.trim() ? theme.primary : theme.grey}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <View style={[styles.suggestionsContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                                <ScrollView
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    style={styles.suggestionsList}
                                >
                                    {suggestions.map((suggestion, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.suggestionItem,
                                                { borderBottomColor: theme.border },
                                                index === suggestions.length - 1 && styles.lastSuggestion
                                            ]}
                                            onPress={() => handleSuggestionSelect(suggestion)}
                                        >
                                            <Ionicons name="location-outline" size={18} color={theme.grey} />
                                            <Text
                                                style={[styles.suggestionText, { color: theme.text, fontFamily: Fonts.regular }]}
                                                numberOfLines={2}
                                            >
                                                {suggestion.address}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Map View */}
                    <View style={styles.mapContainer}>
                        {loading || (searching && !isMapReady) ? (
                            <View style={[styles.mapLoadingContainer, { backgroundColor: theme.lightGrey }]}>
                                <ActivityIndicator size="large" color={theme.primary} />
                                <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                    {loading ? 'Loading map...' : 'Searching location...'}
                                </Text>
                            </View>
                        ) : (
                            <>
                                <MapView
                                    style={styles.map}
                                    region={mapRegion}
                                    onPress={handleMapPress}
                                    onRegionChangeComplete={setMapRegion}
                                    showsUserLocation={true}
                                    showsMyLocationButton={false}
                                    provider={PROVIDER_DEFAULT}
                                    onMapReady={() => setIsMapReady(true)}
                                    loadingEnabled={true}
                                    loadingIndicatorColor={theme.primary}
                                    moveOnMarkerPress={false}
                                    pitchEnabled={false}
                                >
                                    <Marker
                                        coordinate={markerCoordinate}
                                        draggable
                                        onDragEnd={handleMapPress}
                                    >
                                        <View style={styles.customMarker}>
                                            <Ionicons name="location" size={40} color={theme.primary} />
                                        </View>
                                    </Marker>
                                </MapView>

                                {/* Recenter Button */}
                                <TouchableOpacity
                                    style={[styles.recenterButton, { backgroundColor: theme.background }]}
                                    onPress={handleRecenterMap}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="locate" size={24} color={theme.primary} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Selected Address Display */}
                    {selectedAddress ? (
                        <View style={[styles.selectedAddressContainer, { backgroundColor: theme.lightGrey, borderColor: theme.border }]}>
                            <Ionicons name="location" size={20} color={theme.primary} />
                            <Text style={[styles.selectedAddressText, { color: theme.text, fontFamily: Fonts.regular }]}>
                                {selectedAddress}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* Address Details */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="home-outline" size={20} color={theme.text} />
                        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Address Details
                        </Text>
                    </View>

                    <View style={styles.fullWidthInputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Address Label
                        </Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text,
                                fontFamily: Fonts.regular,
                            }]}
                            value={addressLabel}
                            onChangeText={setAddressLabel}
                            placeholder="Home / Work / Other"
                            placeholderTextColor={theme.grey}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                Building Name/No.
                            </Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                    fontFamily: Fonts.regular
                                }]}
                                value={buildingName}
                                onChangeText={setBuildingName}
                                placeholder="Building name"
                                placeholderTextColor={theme.grey}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                Street Name
                            </Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                    fontFamily: Fonts.regular
                                }]}
                                value={streetName}
                                onChangeText={setStreetName}
                                placeholder="Street name"
                                placeholderTextColor={theme.grey}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                Pincode
                            </Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                    fontFamily: Fonts.regular
                                }]}
                                value={pincode}
                                onChangeText={setPincode}
                                placeholder="Pincode"
                                placeholderTextColor={theme.grey}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                Flat No.
                            </Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                    fontFamily: Fonts.regular
                                }]}
                                value={flatNumber}
                                onChangeText={setFlatNumber}
                                placeholder="Flat number"
                                placeholderTextColor={theme.grey}
                            />
                        </View>
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-outline" size={20} color={theme.text} />
                        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                            Contact Information
                        </Text>
                    </View>

                    <View style={styles.fullWidthInputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
                            Phone Number
                        </Text>
                        <View style={[styles.phoneInput, { backgroundColor: theme.background, borderColor: theme.border }]}>
                            <Ionicons name="call-outline" size={20} color={theme.grey} />
                            <TextInput
                                style={[styles.phoneTextInput, {
                                    color: theme.text,
                                    fontFamily: Fonts.regular
                                }]}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="Enter phone number"
                                placeholderTextColor={theme.grey}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                    </View>

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
                                    fontFamily: Fonts.regular
                                }]}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First name"
                                placeholderTextColor={theme.grey}
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
                                    fontFamily: Fonts.regular
                                }]}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last name"
                                placeholderTextColor={theme.grey}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Confirm Button */}
            <View style={[styles.buttonContainer, { backgroundColor: theme.background }]}>
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        {
                            backgroundColor: isFormValid() ? theme.primary : theme.grey,
                            opacity: (isFormValid() && !isSaving) ? 1 : 0.5
                        }
                    ]}
                    onPress={handleConfirm}
                    disabled={!isFormValid() || isSaving}
                    activeOpacity={0.8}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={[styles.confirmButtonText, { fontFamily: Fonts.semiBold }]}>
                            Save Address
                        </Text>
                    )}
                </TouchableOpacity>
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
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    searchWrapper: {
        position: 'relative',
        zIndex: 10,
        marginBottom: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        maxHeight: 200,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    suggestionsList: {
        flex: 1,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
    },
    lastSuggestion: {
        borderBottomWidth: 0,
    },
    suggestionText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    mapContainer: {
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    mapLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
    },
    customMarker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    recenterButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectedAddressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
    },
    selectedAddressText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    inputContainer: {
        flex: 1,
    },
    fullWidthInputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        marginBottom: 8,
    },
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
    phoneTextInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
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
    confirmButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddDeliveryAddress;