import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    useColorScheme,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Footer from '../components/Footer/Footer';
import { Colors, Fonts } from '../constants/theme';
import { fetchAllWraps, WrapCard } from '../services/WrapService';
import { updateCartItem, CartItem } from '../services/CartService';


// Wrap Card Component
type WrapCardProps = {
    id: string;
    name: string;
    price: string | null;
    image: string;
    theme: typeof Colors.light;
    isSelected: boolean;
    onPress: () => void;
};

const WrapCardComponent: React.FC<WrapCardProps> = ({ name, price, image, theme, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[
                styles.wrapCard,
                {
                    backgroundColor: theme.white,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? theme.primary : 'transparent'
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.imageContainer, { backgroundColor: isSelected ? theme.lightOrange : '#F5F5F5' }]}>
                <Image
                    source={{ uri: image }}
                    style={styles.wrapImage}
                    resizeMode="cover"
                />
            </View>
            <Text style={[styles.wrapName, { color: theme.text }]} numberOfLines={2}>
                {name}
            </Text>
            {price ? (
                <Text style={[styles.wrapPrice, { color: theme.primary }]}>₹{price}</Text>
            ) : (
                <Text style={[styles.freeText, { color: theme.primary }]}>FREE</Text>
            )}
        </TouchableOpacity>
    );
};

// Main Select Wrap Screen
const SelectWrapScreen: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get prank and box data from params
    const prankId = params.prankId as string;
    const prankTitle = params.prankTitle as string;
    const prankPrice = params.prankPrice as string;
    const prankImage = params.prankImage as string;
    const quantity = params.quantity as string;
    const boxId = params.boxId as string;
    const boxTitle = params.boxTitle as string;
    const boxPrice = params.boxPrice as string;
    const boxImage = params.boxImage as string;

    const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'profile'>('home');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedWrapId, setSelectedWrapId] = useState<string | null>(null);
    const [selectedWrapName, setSelectedWrapName] = useState<string>('');
    const [selectedWrapPrice, setSelectedWrapPrice] = useState<string | null>(null);
    const [selectedWrapImage, setSelectedWrapImage] = useState<string>('');
    const [wraps, setWraps] = useState<WrapCard[]>([]);
    const [filteredWraps, setFilteredWraps] = useState<WrapCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingToCart, setSavingToCart] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const editMode = params.editMode === 'true';
    const currentWrapId = params.currentWrapId as string;
    const message = params.message as string;

    const categories = ['All', 'Latest', 'Most Popular', 'Cheapest'];

    useEffect(() => {
        loadWraps();
    }, []);

    useEffect(() => {
        filterWraps();
    }, [wraps, selectedCategory]);

    const loadWraps = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedWraps = await fetchAllWraps();
            const sortedWraps = [...fetchedWraps].sort((a, b) => {
                const priceA = a.price ? parseInt(a.price) : 0;
                const priceB = b.price ? parseInt(b.price) : 0;
                return priceA - priceB;
            });
            setWraps(sortedWraps);

            // Select current wrap if in edit mode, otherwise select cheapest
            if (editMode && currentWrapId) {
                const currentWrap = sortedWraps.find(wrap => wrap.id === currentWrapId);
                if (currentWrap) {
                    setSelectedWrapId(currentWrap.id);
                    setSelectedWrapName(currentWrap.name);
                    setSelectedWrapPrice(currentWrap.price);
                    setSelectedWrapImage(currentWrap.image);
                }
            } else if (sortedWraps.length > 0) {
                setSelectedWrapId(sortedWraps[0].id);
                setSelectedWrapName(sortedWraps[0].name);
                setSelectedWrapPrice(sortedWraps[0].price);
                setSelectedWrapImage(sortedWraps[0].image);
            }
        } catch (err) {
            console.error('Error loading wraps:', err);
            setError('Failed to load wraps. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filterWraps = () => {
        if (selectedCategory === 'All') {
            setFilteredWraps(wraps);
        } else if (selectedCategory === 'Latest') {
            setFilteredWraps([...wraps].reverse());
        } else if (selectedCategory === 'Most Popular') {
            setFilteredWraps(wraps);
        } else if (selectedCategory === 'Cheapest') {
            setFilteredWraps(
                [...wraps].sort((a, b) => {
                    const priceA = a.price ? parseInt(a.price) : 0;
                    const priceB = b.price ? parseInt(b.price) : 0;
                    return priceA - priceB;
                })
            );
        }
    };

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'home' | 'orders' | 'cart' | 'profile');
    };

    const handleWrapSelect = (wrapId: string, wrapName: string, wrapPrice: string | null, wrapImage: string) => {
        setSelectedWrapId(wrapId);
        setSelectedWrapName(wrapName);
        setSelectedWrapPrice(wrapPrice);
        setSelectedWrapImage(wrapImage);
    };

    const handleAddToCart = async () => {
        if (editMode) {
            // In edit mode, update cart and go back to cart
            setSavingToCart(true);
            try {
                const cartItem: CartItem = {
                    prankId,
                    prankTitle,
                    prankPrice: parseInt(prankPrice),
                    prankImage,
                    boxId,
                    boxTitle,
                    boxPrice: boxPrice ? parseInt(boxPrice) : null,
                    boxImage,
                    wrapId: selectedWrapId || '',
                    wrapTitle: selectedWrapName,
                    wrapPrice: selectedWrapPrice ? parseInt(selectedWrapPrice) : null,
                    wrapImage: selectedWrapImage,
                    message: message || '',
                };

                const success = await updateCartItem(cartItem);
                if (success) {
                    router.push('/cart');
                }
            } catch (err) {
                console.error('Error updating cart:', err);
            } finally {
                setSavingToCart(false);
            }
        } else {
            // Normal flow - navigate to select message
            router.push({
                pathname: '/select-message',
                params: {
                    prankId,
                    prankTitle,
                    prankPrice,
                    prankImage,
                    quantity,
                    boxId,
                    boxTitle,
                    boxPrice: boxPrice || '0',
                    boxImage,
                    wrapId: selectedWrapId || '',
                    wrapTitle: selectedWrapName,
                    wrapPrice: selectedWrapPrice || '0',
                    wrapImage: selectedWrapImage,
                },
            });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.text }]}>Select Wrap</Text>
            </View>

            {/* Categories - COMMENTED OUT */}
            {/* <View style={styles.categoriesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && { backgroundColor: theme.primary },
                                selectedCategory !== category && {
                                    backgroundColor: 'transparent',
                                    borderWidth: 1,
                                    borderColor: theme.dotInactive
                                }
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    { color: selectedCategory === category ? theme.white : theme.grey }
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View> */}

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Loading wraps...
                    </Text>
                </View>
            )}

            {/* Error State */}
            {error && !loading && (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.primary, fontFamily: Fonts.semiBold }]}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: theme.primary }]}
                        onPress={loadWraps}
                    >
                        <Text style={[styles.retryButtonText, { fontFamily: Fonts.semiBold }]}>
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Wraps Grid with Search Bar in Scrollable Section */}
            {!loading && !error && (
                <ScrollView
                    style={styles.wrapsContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Search Bar - Moved to Scrollable Section */}
                    <View style={[styles.searchContainer, { backgroundColor: theme.searchBg }]}>
                        <Ionicons name="search" size={20} color={theme.grey} style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholder="Search Wraps"
                            placeholderTextColor={theme.grey}
                        />
                    </View>

                    {filteredWraps.length > 0 ? (
                        <>
                            <View style={styles.wrapsGrid}>
                                {filteredWraps.map((wrap) => (
                                    <WrapCardComponent
                                        key={wrap.id}
                                        id={wrap.id}
                                        name={wrap.name}
                                        price={wrap.price}
                                        image={wrap.image}
                                        theme={theme}
                                        isSelected={selectedWrapId === wrap.id}
                                        onPress={() => handleWrapSelect(wrap.id, wrap.name, wrap.price, wrap.image)}
                                    />
                                ))}
                            </View>

                            {/* Select Wrap Button */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.selectButton, { backgroundColor: savingToCart ? theme.grey : theme.primary }]}
                                    onPress={handleAddToCart}
                                    disabled={savingToCart}
                                >
                                    {savingToCart ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.selectButtonText}>Select Wrap</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                No wraps found
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Footer */}
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
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriesContainer: {
        paddingVertical: 16,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    wrapsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    wrapsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        marginTop: 12,
    },
    errorContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        fontSize: 16,
    },
    wrapCard: {
        width: '48%',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        minHeight: 230,
    },
    imageContainer: {
        width: '100%',
        height: 140,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    wrapImage: {
        width: '100%',
        height: '100%',
    },
    wrapName: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
        marginBottom: 6,
        lineHeight: 20,
        height: 40,
    },
    wrapPrice: {
        fontSize: 16,
        fontFamily: Fonts.bold,
    },
    freeText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
    },
    buttonContainer: {
        paddingVertical: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    selectButton: {
        paddingHorizontal: 80,
        paddingVertical: 16,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
    },
    selectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.semiBold,
    },
});

export default SelectWrapScreen;