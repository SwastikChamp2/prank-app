import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    BackHandler,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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
import Input from '../components/ui/Input';
import LoadingDots from '../components/ui/LoadingDots';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');

const Login: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Animation values
  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(20);
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const inputOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    welcomeOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    welcomeTranslateY.value = withDelay(200, withSpring(0, { damping: 12, stiffness: 100 }));
    
    logoOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(400, withSpring(1, { damping: 15, stiffness: 100 }));
    
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(600, withSpring(0, { damping: 12, stiffness: 100 }));
    
    inputOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
  }, []);

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const validatePhoneNumber = (phone: string) => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText);
    if (phoneError) setPhoneError('');
  };

  const handleLogin = () => {
    if (validatePhoneNumber(phoneNumber)) {
      setLoading(true);
      
      setTimeout(() => {
        setLoading(false);
        router.push({
          pathname: '/verify-otp',
          params: { phoneNumber }
        });
      }, 200);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const welcomeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
    transform: [{ translateY: welcomeTranslateY.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [{ translateY: interpolate(inputOpacity.value, [0, 1], [20, 0]) }],
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
      
      <View style={[styles.background, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={[styles.backText, { color: colors.grey1 }]}>←</Text>
        </TouchableOpacity>
      </View>

      <Drawer 
        height={height * 0.85} 
        delay={400} 
        backgroundColor={colors.background}
        borderRadius={40}
      >
        <View style={[styles.drawerContent, { backgroundColor: colors.background }]}>
          <Animated.Text style={[styles.welcomeText, { color: colors.text }, welcomeAnimatedStyle]}>
            Welcome Back
          </Animated.Text>

          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.Text style={[styles.title, { color: colors.text }, titleAnimatedStyle]}>
            Helmet Washer
          </Animated.Text>

          <View style={styles.formSection}>
            <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Enter Phone Number
              </Text>
              <Text style={[styles.inputSubtext, { color: colors.grey1 }]}>
                We will send you a verification code
              </Text>
              <Input
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="numeric"
                leftIcon="call-outline"
                error={phoneError}
                style={styles.phoneInput}
                maxLength={10}
              />
            </Animated.View>

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
                title="Continue"
                onPress={handleLogin}
                size="large"
                loading={loading}
                style={[styles.continueButton, { backgroundColor: colors.primary }]}
              />
            </Animated.View>

            <Text style={[styles.footerText, { color: colors.grey1 }]}>
              By continuing, you agree to our{'\n'}
              <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text> and{' '}
              <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </Drawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  backText: {
    fontFamily: Fonts.medium,
    fontSize: 24,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 50,
  },
  formSection: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  inputSubtext: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  phoneInput: {
    marginBottom: 0,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loadingContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    fontFamily: Fonts.medium,
  },
});

export default Login;