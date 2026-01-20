// pages/GetStarted.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  FlatList,
  ViewToken,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface SlideItem {
  id: string;
  image: any;
}

const GetStarted = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  // Slides with onboarding images
  const slides: SlideItem[] = [
    { id: '1', image: require('../assets/images/GetStarted/onboarding1.png') },
    { id: '2', image: require('../assets/images/GetStarted/onboarding2.png') },
    { id: '3', image: require('../assets/images/GetStarted/onboarding3.png') },
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = (prevPage + 1) % slides.length;
        flatListRef.current?.scrollToIndex({
          index: nextPage,
          animated: true,
        });
        return nextPage;
      });
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle viewable items change
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentPage(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item }: { item: SlideItem }) => (
    <View style={[styles.slideContainer, { width: width * 0.9 }]}>
      <Image source={item.image} style={styles.onboardingImage} resizeMode="cover" />
    </View>
  );

  const handleStartPress = () => {
    // Navigate to Sign Up screen
    router.push('/signup');
  };

  const handleLoginPress = () => {
    // Navigate to Login screen
    router.push('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Hero Image Card with Slider */}
      <View style={[styles.imageCard, { backgroundColor: theme.cardBg }]}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={width * 0.9}
          snapToAlignment="center"
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={[styles.title, { color: theme.brown, fontFamily: Fonts.bold }]}>
          Send Pranks{'\n'}Anonymously
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.text, fontFamily: Fonts.regular }]}>
          Delight your friends with funny gifts and{'\n'}unexprises, all without revealing an identity!
        </Text>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: currentPage === index ? theme.primary : theme.dotInactive,
                  width: currentPage === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Start Button - Navigate to Sign Up */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
          onPress={handleStartPress}
        >
          <Text style={[styles.buttonText, { fontFamily: Fonts.semiBold }]}>
            Start Gifting Fun
          </Text>
        </TouchableOpacity>

        {/* Already Master Link - Navigate to Login */}
        <TouchableOpacity activeOpacity={0.7} onPress={handleLoginPress}>
          <Text style={[styles.linkText, { color: theme.primary, fontFamily: Fonts.medium }]}>
            Already Master Prankster?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  imageCard: {
    width: width * 0.9,
    height: height * 0.45,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  flatListContent: {
    alignItems: 'center',
  },
  slideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.45,
  },
  onboardingImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.7,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    width: width * 0.9,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#E8764B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default GetStarted;