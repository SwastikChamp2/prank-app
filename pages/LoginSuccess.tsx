import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';
import LoadingDots from '../components/ui/LoadingDots';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');

const LoginSuccess: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);

  // Animation values
  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    imageOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    imageScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 80 }));
    
    titleOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(800, withSpring(0, { damping: 15, stiffness: 100 }));
    
    subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(1000, withSpring(0, { damping: 15, stiffness: 100 }));
    
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
  }, []);

  const handleExplore = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      // Navigate to main app or home screen
      router.push('/home'); // Assuming you have a tabs layout
      // Or router.replace('/home') if you have a home screen
    }, 200);
  };

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: interpolate(buttonOpacity.value, [0, 1], [20, 0]) }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />

      <Drawer 
        height={height * 0.85} 
        delay={400} 
        backgroundColor={colors.background}
        borderRadius={40}
      >
        <View style={[styles.drawerContent, { backgroundColor: colors.background }]}>
          <View style={styles.contentSection}>
            <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
              <Image
                source={require('../assets/images/login-success.png')}
                style={styles.successImage}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.Text style={[styles.title, { color: colors.text }, titleAnimatedStyle]}>
              Yay! Login Successful
            </Animated.Text>

            <Animated.Text style={[styles.subtitle, { color: colors.grey1 }, subtitleAnimatedStyle]}>
              You will be moved to home screen right now.{'\n'}Explore the features!
            </Animated.Text>
          </View>

          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            {loading && (
              <View style={styles.loadingContainer}>
                <LoadingDots 
                  size={8} 
                  color={colors.primary} 
                />
              </View>
            )}
            <Button
              title="Let's Explore"
              onPress={handleExplore}
              size="large"
              loading={loading}
              style={[styles.exploreButton, { backgroundColor: colors.primary }]}
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
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  successImage: {
    width: '100%',
    height: 200,
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loadingContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  exploreButton: {
    width: '100%',
    borderRadius: 16,
  },
});

export default LoginSuccess;