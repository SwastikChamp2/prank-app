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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer/Footer';
import { Colors, Fonts } from '../constants/theme';
import { fetchPranksByCategory, fetchAllPranks, PrankCard } from '../services/PrankService';

// Product Card Component
type ProductCardProps = {
    id: string;
    name: string;
    price: string;
    image: string;
    theme: typeof Colors.light;
};

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, theme }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={[styles.productCard, { backgroundColor: theme.white }]}
            onPress={() => router.push({
                pathname: '/prank-detail',
                params: { prankId: id }
            })}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: image }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
            </View>
            <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
                {name}
            </Text>
            <Text style={[styles.productPrice, { color: theme.primary }]}>₹{price}</Text>
        </TouchableOpacity>
    );
};

// Main Home Screen
const HomeScreen: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const categoryParam = params.category as string;

    const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'profile'>('home');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [pranks, setPranks] = useState<PrankCard[]>([]);
    const [filteredPranks, setFilteredPranks] = useState<PrankCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const categories = ['All', 'Latest', 'Most Popular', 'Cheapest'];

    useEffect(() => {
        loadPranks();
    }, [categoryParam]);

    useEffect(() => {
        filterPranks();
    }, [pranks, selectedCategory]);

    const loadPranks = async () => {
        try {
            setLoading(true);
            setError(null);
            let fetchedPranks: PrankCard[];

            if (categoryParam) {
                fetchedPranks = await fetchPranksByCategory(categoryParam);
            } else {
                fetchedPranks = await fetchAllPranks();
            }

            setPranks(fetchedPranks);
        } catch (err) {
            console.error('Error loading pranks:', err);
            setError('Failed to load pranks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filterPranks = () => {
        if (selectedCategory === 'All') {
            setFilteredPranks(pranks);
        } else if (selectedCategory === 'Latest') {
            setFilteredPranks([...pranks].reverse());
        } else if (selectedCategory === 'Most Popular') {
            // For now, show same as all (can be implemented with popularity data)
            setFilteredPranks(pranks);
        } else if (selectedCategory === 'Cheapest') {
            setFilteredPranks(
                [...pranks].sort((a, b) => parseInt(a.price) - parseInt(b.price))
            );
        }
    };

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'home' | 'orders' | 'cart' | 'profile');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={[styles.searchContainer, { backgroundColor: theme.searchBg }]}>
                    <Ionicons name="search" size={20} color={theme.grey} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Search Pranks..."
                        placeholderTextColor={theme.grey}
                    />
                </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
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
            </View>

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Loading pranks...
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
                        onPress={loadPranks}
                    >
                        <Text style={[styles.retryButtonText, { fontFamily: Fonts.semiBold }]}>
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Products Grid */}
            {!loading && !error && (
                <ScrollView
                    style={styles.productsContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredPranks.length > 0 ? (
                        <View style={styles.productsGrid}>
                            {filteredPranks.map((prank) => (
                                <ProductCard
                                    key={prank.id}
                                    id={prank.id}
                                    name={prank.name}
                                    price={prank.price}
                                    image={prank.image}
                                    theme={theme}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                No pranks found
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
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
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
    productsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
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
    productCard: {
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
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productName: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
        marginBottom: 6,
        lineHeight: 20,
        height: 40,
    },
    productPrice: {
        fontSize: 16,
        fontFamily: Fonts.bold,
    },
});

export default HomeScreen;