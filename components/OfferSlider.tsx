import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Fonts } from '../constants/theme';

const { width } = Dimensions.get('window');

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: any;
  gradientColors: string[];
}

const offers: Offer[] = [
  {
    id: '1',
    title: 'Up To',
    subtitle: 'with free delivery',
    discount: '30% OFF',
    image: require('../assets/images/Home/hero-card-illustration.png'),
    gradientColors: ['#E23744', '#FF6B7A'],
  },
  {
    id: '2',
    title: 'Up To',
    subtitle: 'with free delivery',
    discount: '50% OFF',
    image: require('../assets/images/Home/hero-card-illustration.png'),
    gradientColors: ['#6FCD38', '#8FE85F'],
  },
];

const OfferSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const cardWidth = width - 40;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % offers.length;
        translateX.value = withSpring(-nextIndex * cardWidth, {
          damping: 15,
          stiffness: 100,
        });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [cardWidth]);

  const changeSlide = (index: number) => {
    setCurrentIndex(index);
    translateX.value = withSpring(-index * cardWidth, {
      damping: 15,
      stiffness: 100,
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = -currentIndex * cardWidth + event.translationX;
    })
    .onEnd((event) => {
      const shouldGoNext = event.translationX < -50;
      const shouldGoPrev = event.translationX > 50;
      
      if (shouldGoNext && currentIndex < offers.length - 1) {
        runOnJS(changeSlide)(currentIndex + 1);
      } else if (shouldGoPrev && currentIndex > 0) {
        runOnJS(changeSlide)(currentIndex - 1);
      } else {
        translateX.value = withSpring(-currentIndex * cardWidth);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.slider, animatedStyle]}>
          {offers.map((offer, index) => (
            <LinearGradient
              key={offer.id}
              colors={offer.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.offerCard, { width: cardWidth }]}
            >
              <View style={styles.contentWrapper}>
                <View style={styles.leftContent}>
                  <View style={styles.textSection}>
                    <Text style={styles.upToText} numberOfLines={1}>{offer.title}</Text>
                    <Text style={styles.discountText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                      {offer.discount}
                    </Text>
                    <Text style={styles.subtitleText} numberOfLines={1}>{offer.subtitle}</Text>
                  </View>
                  
                  <View style={styles.grabDealContainer}>
                    <Text style={styles.grabDealText}>Grab{'\n'}the{'\n'}deal</Text>
                    <TouchableOpacity style={styles.arrowButton} activeOpacity={0.8}>
                      <Text style={styles.arrowText}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.rightContent}>
                  <Image source={offer.image} style={styles.offerImage} resizeMode="contain" />
                </View>
              </View>
            </LinearGradient>
          ))}
        </Animated.View>
      </GestureDetector>
      
      <View style={styles.dotsContainer}>
        {offers.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
            onPress={() => changeSlide(index)}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  slider: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  offerCard: {
    height: 180,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 8, // Reduced to bring grab deal closer to arrow
    minWidth: 0,
  },
  rightContent: {
    width: 130, // Increased width for larger image
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    minWidth: 0,
  },
  upToText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  discountText: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 32,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 2,
  },
  subtitleText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.85,
  },
  grabDealContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Changed from flex-end to center for better alignment
    justifyContent: 'flex-start', // Changed to flex-start
    marginTop: 8,
  },
  grabDealText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 18,
    letterSpacing: 0.3,
    marginRight: 12, // Added margin to bring closer to arrow
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  arrowText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  offerImage: {
    width: 120, // Increased image width
    height: 140, // Increased image height
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  activeDot: {
    width: 32,
    backgroundColor: '#E23744',
  },
});

export default OfferSlider;