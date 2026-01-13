import { router, useLocalSearchParams } from 'expo-router';
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

const VerifyOTP: React.FC = () => {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [canResend, setCanResend] = useState(false);

  // Animation values
  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const phoneOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    imageOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    imageScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 100 }));
    
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 100 }));
    
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    phoneOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    inputOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
  }, []);

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateOTP = (code: string) => {
    if (!code) {
      setOtpError('OTP is required');
      return false;
    }
    if (code.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP');
      return false;
    }
    setOtpError('');
    return true;
  };

  const handleOTPChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setOtp(numericText);
    if (otpError) setOtpError('');
  };

  const handleVerify = () => {
    if (validateOTP(otp)) {
      setLoading(true);
      
      setTimeout(() => {
        setLoading(false);
        router.push('/login-success');
      }, 200);
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      setTimeLeft(180);
      setCanResend(false);
      setOtp('');
      setOtpError('');
    }
  };

  const handleBack = () => {
    router.back();
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
  }));

  const phoneAnimatedStyle = useAnimatedStyle(() => ({
    opacity: phoneOpacity.value,
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
          <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
            <Image
              source={require('../assets/images/enter-otp.png')}
              style={styles.otpImage}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.Text style={[styles.title, { color: colors.text }, titleAnimatedStyle]}>
            Confirm Your Phone
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, { color: colors.grey1 }, subtitleAnimatedStyle]}>
            We've sent 4 digits verification code
          </Animated.Text>

          <Animated.Text style={[styles.phoneNumber, { color: colors.primary }, phoneAnimatedStyle]}>
            to +91 {phoneNumber}
          </Animated.Text>

          <View style={styles.formSection}>
            <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Enter Verification Code
              </Text>
              
              <View style={styles.otpInputContainer}>
                <Input
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChangeText={handleOTPChange}
                  keyboardType="numeric"
                  leftIcon="checkmark-circle-outline"
                  error={otpError}
                  style={styles.otpInput}
                  maxLength={4}
                />
                
                <View style={styles.resendContainer}>
                  {canResend ? (
                    <TouchableOpacity onPress={handleResendOTP}>
                      <Text style={[styles.resendText, { color: colors.primary }]}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.timerText, { color: colors.grey1 }]}>
                      Resend in {formatTime(timeLeft)}
                    </Text>
                  )}
                </View>
              </View>
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
                title="Verify and Create Account"
                onPress={handleVerify}
                size="large"
                loading={loading}
                style={[styles.verifyButton, { backgroundColor: colors.primary }]}
              />
            </Animated.View>
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
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpImage: {
    width: '100%',
    height: 180,
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  phoneNumber: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
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
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  otpInputContainer: {
    width: '100%',
    paddingBottom: 10,
  },
  otpInput: {
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  resendText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 20,
    paddingBottom: 20,
  },
  timerText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loadingContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  verifyButton: {
    width: '100%',
    borderRadius: 16,
  },
});

export default VerifyOTP;