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
import { fetchAllBoxes, BoxCard } from '../services/BoxService';

// Box Card Component
type BoxCardProps = {
    id: string;
    name: string;
    price: string | null;
    image: string;
    theme: typeof Colors.light;
    isSelected: boolean;
    onPress: () => void;
};

const BoxCardComponent: React.FC<BoxCardProps> = ({ name, price, image, theme, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[
                styles.boxCard,
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
                    style={styles.boxImage}
                    resizeMode="cover"
                />
            </View>
            <Text style={[styles.boxName, { color: theme.text }]} numberOfLines={2}>
                {name}
            </Text>
            {price ? (
                <Text style={[styles.boxPrice, { color: theme.primary }]}>₹{price}</Text>
            ) : (
                <Text style={[styles.freeText, { color: theme.primary }]}>FREE</Text>
            )}
        </TouchableOpacity>
    );
};

// Main Select Box Screen
const SelectBox: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get prank data from params
    const prankId = params.prankId as string;
    const prankTitle = params.prankTitle as string;
    const prankPrice = params.prankPrice as string;
    const prankImage = params.prankImage as string;
    const quantity = params.quantity as string;

    const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'profile'>('home');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
    const [selectedBoxName, setSelectedBoxName] = useState<string>('');
    const [selectedBoxPrice, setSelectedBoxPrice] = useState<string | null>(null);
    const [selectedBoxImage, setSelectedBoxImage] = useState<string>('');
    const [boxes, setBoxes] = useState<BoxCard[]>([]);
    const [filteredBoxes, setFilteredBoxes] = useState<BoxCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const categories = ['All', 'Latest', 'Most Popular', 'Cheapest'];

    useEffect(() => {
        loadBoxes();
    }, []);

    useEffect(() => {
        filterBoxes();
    }, [boxes, selectedCategory]);

    const loadBoxes = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedBoxes = await fetchAllBoxes();
            // Sort by price: cheapest first
            const sortedBoxes = [...fetchedBoxes].sort((a, b) => {
                const priceA = a.price ? parseInt(a.price) : 0;
                const priceB = b.price ? parseInt(b.price) : 0;
                return priceA - priceB;
            });
            setBoxes(sortedBoxes);
            // Select the cheapest box by default
            if (sortedBoxes.length > 0) {
                setSelectedBoxId(sortedBoxes[0].id);
                setSelectedBoxName(sortedBoxes[0].name);
                setSelectedBoxPrice(sortedBoxes[0].price);
                setSelectedBoxImage(sortedBoxes[0].image);
            }
        } catch (err) {
            console.error('Error loading boxes:', err);
            setError('Failed to load boxes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filterBoxes = () => {
        if (selectedCategory === 'All') {
            setFilteredBoxes(boxes);
        } else if (selectedCategory === 'Latest') {
            setFilteredBoxes([...boxes].reverse());
        } else if (selectedCategory === 'Most Popular') {
            setFilteredBoxes(boxes);
        } else if (selectedCategory === 'Cheapest') {
            setFilteredBoxes(
                [...boxes].sort((a, b) => {
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

    const handleBoxSelect = (boxId: string, boxName: string, boxPrice: string | null, boxImage: string) => {
        setSelectedBoxId(boxId);
        setSelectedBoxName(boxName);
        setSelectedBoxPrice(boxPrice);
        setSelectedBoxImage(boxImage);
    };

    const handleNavigateToWrap = () => {
        router.push({
            pathname: '/select-wrap',
            params: {
                prankId,
                prankTitle,
                prankPrice,
                prankImage,
                quantity,
                boxId: selectedBoxId,
                boxTitle: selectedBoxName,
                boxPrice: selectedBoxPrice || '0',
                boxImage: selectedBoxImage,
            },
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.text }]}>Select Box</Text>
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
                        Loading boxes...
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
                        onPress={loadBoxes}
                    >
                        <Text style={[styles.retryButtonText, { fontFamily: Fonts.semiBold }]}>
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Boxes Grid with Search and Filter in Scrollable Section */}
            {!loading && !error && (
                <ScrollView
                    style={styles.boxesContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Search Bar and Filter - Moved to Scrollable Section */}
                    <View style={styles.searchFilterContainer}>
                        <View style={[styles.searchContainer, { backgroundColor: theme.searchBg }]}>
                            <Ionicons name="search" size={20} color={theme.grey} style={styles.searchIcon} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.text }]}
                                placeholder="Search Boxes"
                                placeholderTextColor={theme.grey}
                            />
                        </View>

                        <TouchableOpacity style={styles.filterButton}>
                            <Ionicons name="options-outline" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    {filteredBoxes.length > 0 ? (
                        <>
                            <View style={styles.boxesGrid}>
                                {filteredBoxes.map((box) => (
                                    <BoxCardComponent
                                        key={box.id}
                                        id={box.id}
                                        name={box.name}
                                        price={box.price}
                                        image={box.image}
                                        theme={theme}
                                        isSelected={selectedBoxId === box.id}
                                        onPress={() => handleBoxSelect(box.id, box.name, box.price, box.image)}
                                    />
                                ))}
                            </View>

                            {/* Select Box Button */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.selectButton, { backgroundColor: theme.primary }]}
                                    onPress={handleNavigateToWrap}
                                >
                                    <Text style={styles.selectButtonText}>Select Box</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                                No boxes found
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
    searchFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        gap: 12,
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
    boxesContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    boxesGrid: {
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
    boxCard: {
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
    boxImage: {
        width: '100%',
        height: '100%',
    },
    boxName: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
        marginBottom: 6,
        lineHeight: 20,
        height: 40,
    },
    boxPrice: {
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

export default SelectBox;