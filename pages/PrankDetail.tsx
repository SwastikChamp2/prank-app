import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    useColorScheme,
    StatusBar,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';
import { fetchPrankById, Prank } from '../services/PrankService';
import { fetchBoxById } from '../services/BoxService';
import { fetchWrapById } from '../services/WrapService';
import { updateCartItem } from '../services/CartService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PrankDetail: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const prankId = params.prankId as string;

    const [quantity, setQuantity] = useState<number>(1);
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const [isDescriptionLong, setIsDescriptionLong] = useState<boolean>(false);
    const [prank, setPrank] = useState<Prank | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState<boolean>(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    useEffect(() => {
        loadPrankDetail();
    }, [prankId]);

    const loadPrankDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            if (prankId) {
                const fetchedPrank = await fetchPrankById(prankId);
                if (fetchedPrank) {
                    setPrank(fetchedPrank);
                    // Check if coverImage URL contains 'video' (case insensitive)
                    const hasVideo = /video/i.test(fetchedPrank.coverImage);
                    setIsVideo(hasVideo);
                } else {
                    setError('Prank not found');
                }
            }
        } catch (err) {
            console.error('Error loading prank detail:', err);
            setError('Failed to load prank details');
        } finally {
            setLoading(false);
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleSelectPrank = () => {
        if (prank) {
            // Store prank details in route params for SelectBox page
            router.push({
                pathname: '/select-box',
                params: {
                    prankId: prank.id,
                    prankTitle: prank.prankTitle,
                    prankPrice: prank.price.toString(),
                    prankImage: prank.coverImage,
                    quantity: quantity.toString(),
                },
            });
        }
    };

    useEffect(() => {
        // Check if description is long based on character count
        if (prank && prank.prankDescription.length > 300) {
            setIsDescriptionLong(true);
        } else {
            setIsDescriptionLong(false);
        }
    }, [prank]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                        Loading prank details...
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
                        onPress={loadPrankDetail}
                    >
                        <Text style={[styles.retryButtonText, { fontFamily: Fonts.semiBold }]}>
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Content */}
            {!loading && !error && prank && (
                <>
                    {/* Header with Image or Video */}
                    <View style={styles.imageSection}>
                        {isVideo ? (
                            <Video
                                source={{ uri: prank.coverImage }}
                                style={styles.productImage}
                                resizeMode={ResizeMode.COVER}
                                shouldPlay
                                isLooping
                                isMuted
                            />
                        ) : (
                            <Image
                                source={{ uri: prank.coverImage }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        )}

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
                    <View style={styles.contentSection}>
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollViewContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Product Title */}
                            <Text style={[styles.productTitle, { color: theme.text }]}>
                                {prank.prankTitle}
                            </Text>

                            {/* Description */}
                            <Text
                                style={[styles.description, { color: theme.grey }]}
                                numberOfLines={showFullDescription ? undefined : 4}
                            >
                                {prank.prankDescription}
                            </Text>

                            {/* Read More Button - Only show if description is long */}
                            {isDescriptionLong && (
                                <TouchableOpacity
                                    onPress={() => setShowFullDescription(!showFullDescription)}
                                    style={styles.readMoreButton}
                                >
                                    <Text style={[styles.readMoreText, { color: theme.primary }]}>
                                        {showFullDescription ? 'Read Less' : 'Read More'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>

                        {/* Bottom Section with Price and Button - Fixed at bottom */}
                        <View style={styles.bottomSection}>
                            <View style={styles.priceSection}>
                                <Text style={[styles.priceLabel, { color: theme.grey }]}>
                                    Price
                                </Text>
                                <Text style={[styles.priceValue, { color: theme.text }]}>
                                    ₹ {prank.price}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.selectButton, { backgroundColor: theme.primary }]}
                                onPress={handleSelectPrank}
                            >
                                <Text style={styles.selectButtonText}>
                                    Select Prank
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
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
    bottomSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
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