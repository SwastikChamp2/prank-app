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

// Box Card Component
type BoxCardProps = {
    id: number;
    name: string;
    price: string | null;
    image: string;
    theme: typeof Colors.light;
    isSelected: boolean;
    onPress: () => void;
};

const BoxCard: React.FC<BoxCardProps> = ({ name, price, image, theme, isSelected, onPress }) => {
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
    const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'profile'>('home');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedBoxId, setSelectedBoxId] = useState<number | null>(1);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const categories = ['All', 'Latest', 'Most Popular', 'Cheapest'];

    const boxes = [
        {
            id: 1,
            name: 'Simple Carboard Box',
            price: null,
            image: 'https://i.etsystatic.com/24039383/r/il/98e077/2404078216/il_fullxfull.2404078216_tc34.jpg'
        },
        {
            id: 2,
            name: 'Quirky Box',
            price: '99',
            image: 'https://5.imimg.com/data5/SELLER/Default/2020/8/VI/NX/NC/102975132/mdf-box-500x500.jpg'
        },
        {
            id: 3,
            name: 'Premium Box',
            price: '199',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'
        },
        {
            id: 4,
            name: 'Luxury Box',
            price: '299',
            image: 'https://unboxit.in/cdn/shop/files/Category2_8068639f-e39a-479d-8e2f-390170249874.jpg?v=1749480436&width=2000'
        },
    ];

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'home' | 'orders' | 'cart' | 'profile');
    };

    const handleBoxSelect = (boxId: number) => {
        setSelectedBoxId(boxId);
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
                        placeholder="Search Boxes"
                        placeholderTextColor={theme.grey}
                    />
                </View>

                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color={theme.text} />
                </TouchableOpacity>
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

            {/* Boxes Grid */}
            <ScrollView
                style={styles.boxesContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.boxesGrid}>
                    {boxes.map((box) => (
                        <BoxCard
                            key={box.id}
                            id={box.id}
                            name={box.name}
                            price={box.price}
                            image={box.image}
                            theme={theme}
                            isSelected={selectedBoxId === box.id}
                            onPress={() => handleBoxSelect(box.id)}
                        />
                    ))}
                </View>

                {/* Select Box Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.selectButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/select-wrap')}
                    >
                        <Text style={styles.selectButtonText}>Select Box</Text>
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
    boxesContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    boxesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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