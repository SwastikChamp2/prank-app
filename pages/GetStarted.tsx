import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import Button from '../components/ui/Button';
import LoadingDots from '../components/ui/LoadingDots';
import Drawer from '../components/ui/Drawer';

const { width, height } = Dimensions.get('window');

const images = [
  require('../assets/images/GetStarted/GS1.png'),
  require('../assets/images/GetStarted/GS2.png'),
  require('../assets/images/GetStarted/GS3.png'),
];

const GetStarted: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation values
  const imageScale = useSharedValue(0);
  const imageOpacity = useSharedValue(0);
  const imageRotate = useSharedValue(-10);
  const translateX = useSharedValue(0);
  const cardScale = useSharedValue(0.8);
  const cardTranslateY = useSharedValue(50);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const dotsOpacity = useSharedValue(0);

  useEffect(() => {
    cardScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 100 }));
    cardTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    
    imageOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    imageScale.value = withDelay(
      400,
      withSequence(
        withSpring(1.1, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 12, stiffness: 100 })
      )
    );
    imageRotate.value = withDelay(400, withSpring(0, { damping: 10, stiffness: 80 }));
    
    dotsOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    titleOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(1000, withSpring(0, { damping: 12, stiffness: 100 }));
    subtitleOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    buttonOpacity.value = withDelay(1400, withTiming(1, { duration: 600 }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        translateX.value = withSpring(-nextIndex * 200, {
          damping: 15,
          stiffness: 100,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const changeImage = (index: number) => {
    setCurrentIndex(index);
    translateX.value = withSpring(-index * 200, {
      damping: 15,
      stiffness: 100,
    });
  };

  const handleGetStarted = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      router.push('/login');
    }, 200);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = -currentIndex * 200 + event.translationX;
    })
    .onEnd((event) => {
      const shouldGoNext = event.translationX < -50;
      const shouldGoPrev = event.translationX > 50;
      
      if (shouldGoNext && currentIndex < images.length - 1) {
        runOnJS(changeImage)(currentIndex + 1);
      } else if (shouldGoPrev && currentIndex > 0) {
        runOnJS(changeImage)(currentIndex - 1);
      } else {
        translateX.value = withSpring(-currentIndex * 200);
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { translateY: cardTranslateY.value },
    ],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [
      { scale: imageScale.value },
      { rotate: `${imageRotate.value}deg` },
    ],
  }));

  const imagesContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: interpolate(buttonOpacity.value, [0, 1], [20, 0]) }],
  }));

  const dotsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
      />
      
      <View style={styles.background}>
        <View style={styles.whiteSection}>
          <View style={styles.whiteCurvedBottom} />
        </View>
      </View>

      <Drawer 
        height={height * 0.75} 
        delay={600} 
        backgroundColor="#000000" 
        borderRadius={40}
      >
        <View style={styles.drawerContent}>
          <View style={styles.imageSection}>
            <Animated.View style={[styles.imageContainer, cardAnimatedStyle]}>
              <View style={[styles.imageCard, { backgroundColor: colors.primary }]}>
                <GestureDetector gesture={panGesture}>
                  <Animated.View style={styles.imagesWrapper}>
                    <Animated.View style={[styles.imagesContainer, imagesContainerStyle]}>
                      {images.map((image, index) => (
                        <Animated.View key={index} style={[styles.imageSlide, imageAnimatedStyle]}>
                          <Image
                            source={image}
                            style={styles.helmetImage}
                            resizeMode="contain"
                          />
                        </Animated.View>
                      ))}
                    </Animated.View>
                  </Animated.View>
                </GestureDetector>
              </View>
            </Animated.View>
          </View>

          <Animated.View style={[styles.dotsContainer, dotsAnimatedStyle]}>
            <View style={styles.dots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          <View style={styles.textContent}>
            <Animated.Text style={[styles.title, titleAnimatedStyle]}>
              YOUR HELMET,{'\n'}REIMAGINED FRESH
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
              Waterless • Doorstep • Professional
            </Animated.Text>
          </View>

          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            {loading && (
              <View style={styles.loadingContainer}>
                <LoadingDots size={8} color="#FFFFFF" />
              </View>
            )}
            <Button
              title="GET STARTED"
              onPress={handleGetStarted}
              size="large"
              loading={loading}
              style={styles.getStartedButton}
            />
          </Animated.View>
        </View>
      </Drawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    flex: 1,
  },
  whiteSection: {
    height: height * 0.35,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  whiteCurvedBottom: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginTop: -140,
    marginBottom: 20,
    zIndex: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageCard: {
    width: 260,
    height: 260,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
    overflow: 'hidden',
  },
  imagesWrapper: {
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  imageSlide: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helmetImage: {
    width: 180,
    height: 180,
  },
  dotsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    marginBottom: 20,
  },
  getStartedButton: {
    width: '100%',
    backgroundColor: '#E23744',
    borderRadius: 16,
  },
});

export default GetStarted;