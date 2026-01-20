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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Footer from '../components/Footer/Footer';
import { Colors, Fonts } from '../constants/theme';

// Wrap Card Component
type WrapCardProps = {
    id: number;
    name: string;
    price: string | null;
    image: string;
    theme: typeof Colors.light;
    isSelected: boolean;
    onPress: () => void;
};

const WrapCard: React.FC<WrapCardProps> = ({ name, price, image, theme, isSelected, onPress }) => {
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
    const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'profile'>('home');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedWrapId, setSelectedWrapId] = useState<number | null>(1);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const categories = ['All', 'Latest', 'Most Popular', 'Cheapest'];

    const wraps = [
        {
            id: 1,
            name: 'Simple Brown Wrap',
            price: null,
            image: 'https://static1.industrybuying.com/products/material-handling-and-packaging/protective-packaging-products/corrugated-paper-rolls/MAT.COR.235697562_1760594305712.webp'
        },
        {
            id: 2,
            name: 'Colorful Wrap',
            price: '99',
            image: 'https://m.media-amazon.com/images/I/91UCdDD8UgL._SL1500_.jpg'
        },
        {
            id: 3,
            name: 'Premium Wrap',
            price: '199',
            image: 'https://m.media-amazon.com/images/I/71HdJQ9AftL.jpg'
        },
        {
            id: 4,
            name: 'Luxury Wrap',
            price: '299',
            image: 'https://aztecdiamond.com/cdn/shop/files/0Y3A8394_09bf55ba-b11c-45a1-8aec-5521833a2a48.jpg?v=1751556321&width=3645'
        },
    ];

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'home' | 'orders' | 'cart' | 'profile');
    };

    const handleWrapSelect = (wrapId: number) => {
        setSelectedWrapId(wrapId);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={[styles.searchContainer, { backgroundColor: theme.searchBg }]}>
                    <Ionicons name="search" size={20} color={theme.grey} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Search Wraps"
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

            {/* Wraps Grid */}
            <ScrollView
                style={styles.wrapsContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.wrapsGrid}>
                    {wraps.map((wrap) => (
                        <WrapCard
                            key={wrap.id}
                            id={wrap.id}
                            name={wrap.name}
                            price={wrap.price}
                            image={wrap.image}
                            theme={theme}
                            isSelected={selectedWrapId === wrap.id}
                            onPress={() => handleWrapSelect(wrap.id)}
                        />
                    ))}
                </View>

                {/* Select Wrap Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.selectButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/cart')}

                    >
                        <Text style={styles.selectButtonText}>Select Wrap</Text>
                    </TouchableOpacity>
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
    wrapsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    wrapsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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