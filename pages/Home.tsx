// pages/Home.tsx
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import Footer from '@/components/Footer/Footer';
import { fetchPrankCategories } from '../services/PrankCategoryService';

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

  useEffect(() => {
    loadCategories();
  }, []);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={require('../assets/images/profile.jpg')}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.greeting, { color: theme.text, fontFamily: Fonts.semiBold }]}>
              Hi, Jonathan
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navIconActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  navLabelActive: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Home;