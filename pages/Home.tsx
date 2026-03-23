// pages/Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import Footer from '@/components/Footer/Footer';
import { fetchPrankCategories } from '../services/PrankCategoryService';
import { fetchAllPranks, PrankCard } from '../services/PrankService';
import { db, auth } from '../config/firebase.config';
import { doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

interface CategoryCard {
  id: string;
  title: string;
  count: string;
  imageUrl: string;
}

const Home = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [profileImage, setProfileImage] = useState(require('../assets/images/profile.jpg'));

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [allPranks, setAllPranks] = useState<PrankCard[]>([]);
  const [searchResults, setSearchResults] = useState<PrankCard[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const pranksLoadedRef = useRef(false);

  useEffect(() => {
    loadUserData();
    loadCategories();
  }, []);

  // Filter pranks when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = allPranks.filter((prank) =>
      prank.name.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  }, [searchQuery, allPranks]);

  const loadUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          // Get first name from username
          if (userData.username) {
            const firstName = userData.username.split(' ')[0];
            setUserName(firstName);
          }
          // Set profile image based on gender
          if (userData.gender) {
            if (userData.gender === 'Male') {
              setProfileImage(require('../assets/images/profile.jpg'));
            } else if (userData.gender === 'Female') {
              setProfileImage(require('../assets/images/profile-2.jpg'));
            } else if (userData.gender === 'Others') {
              setProfileImage(require('../assets/images/profile-3.png'));
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await fetchPrankCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load all pranks once when user starts typing
  const loadAllPranks = async () => {
    if (pranksLoadedRef.current) return;
    try {
      setSearchLoading(true);
      const fetched = await fetchAllPranks();
      setAllPranks(fetched);
      pranksLoadedRef.current = true;
    } catch (err) {
      console.error('Error loading pranks for search:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim().length > 0 && !pranksLoadedRef.current) {
      loadAllPranks();
    }
  };

  const handlePrankPress = (prankId: string) => {
    router.push({
      pathname: '/prank-detail',
      params: { prankId },
    });
  };

  const getBackgroundColor = (index: number) => {
    const colors = ['#E8A67D', '#7FB899', '#E8A67D', '#D1D1D1', '#E8E8E8'];
    return colors[index % colors.length];
  };

  const handleCategoryPress = (categoryTitle: string) => {
    router.push({
      pathname: '/select-prank',
      params: { category: categoryTitle },
    });
  };

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            onPress={() => router.push('/view-profile')}
            activeOpacity={0.8}
          >
            <Image
              source={profileImage}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={[styles.greeting, { color: theme.text, fontFamily: Fonts.semiBold }]}>
              Hi, {userName}
            </Text>
            <Text style={[styles.subGreeting, { color: theme.grey, fontFamily: Fonts.regular }]}>
              Let's go pranking
            </Text>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.bold }]}>
            Select Your Prank Category
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.searchBg || '#F5F5F5' }]}>
            <Ionicons name="search" size={20} color={theme.grey} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.regular }]}
              placeholder="Search pranks across all categories..."
              placeholderTextColor={theme.grey}
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={theme.grey} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results */}
        {isSearchActive && (
          <View style={styles.searchResultsContainer}>
            {searchLoading && (
              <View style={styles.searchLoadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.searchLoadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                  Loading pranks...
                </Text>
              </View>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <>
                <Text style={[styles.searchResultsTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </Text>
                <View style={styles.searchResultsGrid}>
                  {searchResults.map((prank) => (
                    <TouchableOpacity
                      key={prank.id}
                      style={[
                        styles.searchResultCard,
                        { backgroundColor: theme.white || '#FFFFFF' },
                        prank.quantity <= 0 && styles.searchResultCardOutOfStock,
                      ]}
                      onPress={() => handlePrankPress(prank.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.searchResultImageContainer}>
                        <Image
                          source={{ uri: prank.image }}
                          style={[
                            styles.searchResultImage,
                            prank.quantity <= 0 && { opacity: 0.4 },
                          ]}
                          resizeMode="cover"
                        />
                        {prank.quantity <= 0 && (
                          <View style={styles.searchResultOutOfStockOverlay}>
                            <Text style={styles.searchResultOutOfStockText}>Out of Stock</Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[styles.searchResultName, { color: prank.quantity <= 0 ? '#999' : theme.text }]}
                        numberOfLines={2}
                      >
                        {prank.name}
                      </Text>
                      <Text style={[styles.searchResultPrice, { color: prank.quantity <= 0 ? '#CCC' : theme.primary }]}>
                        ₹{prank.price}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {!searchLoading && searchResults.length === 0 && pranksLoadedRef.current && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={48} color={theme.grey} />
                <Text style={[styles.noResultsText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                  No pranks found for "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Category Cards — hidden when search is active */}
        {!isSearchActive && (
          <>
            {/* Loading State */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                  Loading categories...
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
                  onPress={loadCategories}
                >
                  <Text style={[styles.retryButtonText, { fontFamily: Fonts.semiBold }]}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Category Cards */}
            {!loading && categories.length > 0 && (
              <View style={styles.categoriesContainer}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      { backgroundColor: getBackgroundColor(index) },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleCategoryPress(category.title)}
                  >
                    <Image
                      source={{ uri: category.imageUrl }}
                      style={styles.categoryImage}
                      resizeMode="cover"
                    />
                    <View style={styles.categoryContent}>
                      <Text style={[styles.categoryTitle, { fontFamily: Fonts.semiBold }]}>
                        {category.title}
                      </Text>
                      <Text style={[styles.categoryCount, { fontFamily: Fonts.regular }]}>
                        {category.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Empty State */}
            {!loading && categories.length === 0 && !error && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.grey, fontFamily: Fonts.regular }]}>
                  No categories available
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  subGreeting: {
    fontSize: 13,
    marginTop: 2,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  // Search bar styles
  searchBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  // Search results styles
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  searchLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  searchLoadingText: {
    fontSize: 14,
  },
  searchResultsTitle: {
    fontSize: 16,
    marginBottom: 14,
  },
  searchResultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchResultCard: {
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
  searchResultCardOutOfStock: {
    opacity: 0.6,
  },
  searchResultImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  searchResultImage: {
    width: '100%',
    height: '100%',
  },
  searchResultOutOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  searchResultOutOfStockText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.bold,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchResultName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    marginBottom: 6,
    lineHeight: 20,
    height: 40,
  },
  searchResultPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Original styles
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 100,
  },
  categoryCard: {
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    position: 'absolute',
    left: 20,
    top: 16,
    zIndex: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: '#000000',
    opacity: 0.7,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
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
    paddingVertical: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default Home;