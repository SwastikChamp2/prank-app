import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    useColorScheme,
    StatusBar,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PrankDetail: React.FC = () => {
    const router = useRouter();
    const [quantity, setQuantity] = useState<number>(1);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const product = {
        name: 'Spider in a Box Prank',
        price: 399,
        image: 'https://m.media-amazon.com/images/I/61OBZpDybhL.jpg',
        description: 'Surprise and delight with this classic Spider in a Box Prank! Open the box and—boom—a realistic spider pops out to deliver a harmless scare and lots of laughs. Perfect for pranks, parties, and gag gifts, office parties, birthdays and more'
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header with Image */}
            <View style={styles.imageSection}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                />

                {/* Header Overlay */}
                <View style={styles.headerOverlay}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Detail Product</Text>

                    <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
                        <Ionicons name="bag-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content Section */}
            <ScrollView
                style={styles.contentSection}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {/* Product Title */}
                    <Text style={[styles.productTitle, { color: theme.text }]}>
                        {product.name}
                    </Text>

                    {/* Description */}
                    <Text
                        style={[styles.description, { color: theme.grey }]}
                        numberOfLines={showFullDescription ? undefined : 4}
                    >
                        {product.description}
                    </Text>

                    {/* Read More Button */}
                    <TouchableOpacity
                        onPress={() => setShowFullDescription(!showFullDescription)}
                        style={styles.readMoreButton}
                    >
                        <Text style={[styles.readMoreText, { color: theme.primary }]}>
                            {showFullDescription ? 'Read Less' : 'Read More'}
                        </Text>
                    </TouchableOpacity>

                    {/* Quantity Selector */}
                    <View style={styles.quantitySection}>
                        <Text style={[styles.quantityLabel, { color: theme.text }]}>
                            Choose amount :
                        </Text>

                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={[styles.quantityButton, { backgroundColor: theme.lightOrange }]}
                                onPress={decrementQuantity}
                            >
                                <Ionicons name="remove" size={20} color={theme.primary} />
                            </TouchableOpacity>

                            <Text style={[styles.quantityValue, { color: theme.text }]}>
                                {quantity}
                            </Text>

                            <TouchableOpacity
                                style={[styles.quantityButton, { backgroundColor: theme.primary }]}
                                onPress={incrementQuantity}
                            >
                                <Ionicons name="add" size={20} color={theme.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom Section with Price and Button */}
                    <View style={styles.bottomSection}>
                        <View style={styles.priceSection}>
                            <Text style={[styles.priceLabel, { color: theme.grey }]}>
                                Price
                            </Text>
                            <Text style={[styles.priceValue, { color: theme.text }]}>
                                ₹ {product.price}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.selectButton, { backgroundColor: theme.primary }]}
                            onPress={() => router.push('/select-box')}
                        >
                            <Text style={styles.selectButtonText}>
                                Select Prank
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageSection: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 1.1,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
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
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        color: '#000',
    },
    cartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentSection: {
        flex: 1,
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        padding: 24,
    },
    productTitle: {
        fontSize: 28,
        fontFamily: Fonts.bold,
        marginBottom: 16,
        lineHeight: 36,
    },
    description: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        lineHeight: 22,
        marginBottom: 8,
    },
    readMoreButton: {
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    readMoreText: {
        fontSize: 14,
        fontFamily: Fonts.semiBold,
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    quantityLabel: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityValue: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        minWidth: 30,
        textAlign: 'center',
    },
    bottomSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    priceSection: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 32,
        fontFamily: Fonts.bold,
        lineHeight: 40,
    },
    selectButton: {
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 30,
        marginLeft: 16,
    },
    selectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: Fonts.semiBold,
    },
});

export default PrankDetail;