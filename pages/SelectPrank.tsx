import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    useColorScheme,
    StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer/Footer';
import { Colors, Fonts } from '../constants/theme';

// Product Card Component
type ProductCardProps = {
    name: string;
    price: string;
    image: string;
    theme: typeof Colors.light;
};



const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, theme }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={[styles.productCard, { backgroundColor: theme.white }]}
            onPress={() => router.push('/prank-detail')}
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
    const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'profile'>('home');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const categories = ['All', 'Latest', 'Most Popular', 'Cheapest'];

    const products = [
        {
            id: 1,
            name: 'Rubber Mouse\nPrank',
            price: '399',
            image: 'https://ichef.bbci.co.uk/news/480/cpsprodpb/15AE2/production/_125820888_45fda8df-fa8b-4b70-b711-e45dfd2151d6.jpg.webp'
        },
        {
            id: 2,
            name: 'Rubber Snake\nPrank',
            price: '499',
            image: 'https://images-cdn.ubuy.co.in/634f5fd9e239ce64f93a53c9-snake-toy-130cm-long-realistic.jpg'
        },
        {
            id: 3,
            name: 'Rubber Cockroach\nPrank',
            price: '299',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCjQF343O1TcopCol8GatwYo4QtYIAxV5Gug&s'
        },
        {
            id: 4,
            name: 'Spider in a Box\nPrank',
            price: '499',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-oX-YPJP5I3k-XQnePBdY3ysz8TPRkWdFtg&s'
        },
    ];

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

                {/* <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color={theme.text} />
                </TouchableOpacity> */}
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

            {/* Products Grid */}
            <ScrollView
                style={styles.productsContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.productsGrid}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            theme={theme}
                        />
                    ))}
                </View>
            </ScrollView>

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