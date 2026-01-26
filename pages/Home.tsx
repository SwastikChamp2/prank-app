// pages/Home.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import Footer from '@/components/Footer/Footer';

const { width } = Dimensions.get('window');

interface CategoryCard {
  id: string;
  title: string;
  count: string;
  backgroundColor: string;
  imageUrl: any;
}

const Home = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const categories: CategoryCard[] = [
    {
      id: '1',
      title: 'Fun Pranks',
      count: '18 Pranks',
      backgroundColor: '#E8A67D',
      imageUrl: require('../assets/images/Home/fun-pranks.png'),
    },
    {
      id: '2',
      title: 'Scary Pranks',
      count: '12 Pranks',
      backgroundColor: '#7FB899',
      imageUrl: require('../assets/images/Home/scary-pranks.png'),
    },
    {
      id: '3',
      title: 'Naughty Pranks',
      count: '8 Pranks',
      backgroundColor: '#E8A67D',
      imageUrl: require('../assets/images/Home/naughty-pranks.png'),
    },
    {
      id: '4',
      title: 'Shocking Pranks',
      count: '155 Pranks',
      backgroundColor: '#D1D1D1',
      imageUrl: require('../assets/images/Home/shocking-pranks.png'),
    },
    {
      id: '5',
      title: 'Other Pranks',
      count: '5 Pranks',
      backgroundColor: '#E8E8E8',
      imageUrl: require('../assets/images/Home/other-pranks.png'),
    },
  ];

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
    // Navigate to category details
    router.push('/select-prank');
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
        {/* Header */}


        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.bold }]}>
            Select Your Prank Category
          </Text>
        </View>

        {/* Category Cards */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Image
                source={category.imageUrl}
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