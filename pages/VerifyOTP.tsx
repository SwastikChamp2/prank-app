// pages/VerifyOTP.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  useColorScheme,
  Modal,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const CORRECT_OTP = '1234';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Animation values
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-100)).current;

  // Refs for input fields
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Animation values for confetti
  const confettiAnimations = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  // Focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // Show toast animation
  const showToast = (message: string) => {
    setError(message);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(toastTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]),
      Animated.delay(2500),
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setError('');
    });
  };

  // Shake animation for incorrect OTP
  const triggerShake = () => {
    setIsShaking(true);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start(() => {
      setIsShaking(false);
    });
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const startConfettiAnimation = () => {
    confettiAnimations.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.translateY, {
          toValue: height,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateX, {
          toValue: (Math.random() - 0.5) * 200,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: Math.random() * 360,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');

    // Check if OTP is complete
    if (enteredOtp.length < 4) {
      showToast('Please enter complete OTP code');
      return;
    }

    if (enteredOtp === CORRECT_OTP) {
      setShowConfetti(true);
      startConfettiAnimation();
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 500);
    } else {
      // Incorrect OTP
      triggerShake();
      showToast('Incorrect OTP. Please try again.');

      // Clear OTP after showing error
      setTimeout(() => {
        setOtp(['', '', '', '']);
        inputRefs[0].current?.focus();
      }, 500);
    }
  };

  const handleResend = () => {
    console.log('Resend OTP');
    setOtp(['', '', '', '']);
    inputRefs[0].current?.focus();
    showToast('New OTP sent successfully!');
  };

  const handleStartGifting = () => {
    setShowSuccessModal(false);
    // Navigate to home or main app screen
    router.replace('/home');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Toast Notification */}
      {error && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }],
            },
          ]}
        >
          <View style={styles.toastContent}>
            <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
            <Text style={styles.toastText}>{error}</Text>
          </View>
        </Animated.View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
          Verification Code
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon Circle */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircleOuter, { backgroundColor: theme.lightOrange }]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
              <Ionicons name="phone-portrait-outline" size={40} color="#FFFFFF" />
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.checkIcon} />
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: theme.grey, fontFamily: Fonts.regular }]}>
          We have sent a 4-digit code to your{'\n'}mobile number +XX XXX XXX-XXXX
        </Text>

        {/* OTP Input */}
        <Animated.View
          style={[
            styles.otpContainer,
            {
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                {
                  borderColor: isShaking
                    ? '#FF3B30'
                    : digit
                      ? theme.primary
                      : '#E5E5E5',
                  backgroundColor: theme.background,
                },
              ]}
            >
              <TextInput
                ref={inputRefs[index]}
                style={[
                  styles.otpInput,
                  {
                    color: isShaking ? '#FF3B30' : theme.text,
                    fontFamily: Fonts.semiBold
                  }
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            </View>
          ))}
        </Animated.View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
          onPress={handleVerify}
        >
          <Text style={[styles.buttonText, { fontFamily: Fonts.semiBold }]}>
            Verify & Continue
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: theme.grey, fontFamily: Fonts.regular }]}>
            Didn't reveice the code?{' '}
          </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={[styles.resendLink, { color: theme.primary, fontFamily: Fonts.medium }]}>
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confetti Animation */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          {confettiAnimations.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  left: (index % 10) * (width / 10),
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][index % 5],
                  transform: [
                    { translateY: anim.translateY },
                    { translateX: anim.translateX },
                    {
                      rotate: anim.rotate.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      })
                    },
                  ],
                  opacity: anim.opacity,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <View style={[styles.successIconCircleOuter, { backgroundColor: theme.lightOrange }]}>
                <View style={[styles.successIconCircle, { backgroundColor: theme.primary }]}>
                  <Ionicons name="checkmark" size={48} color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Success Text */}
            <Text style={[styles.successTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
              Prankster Activated!
            </Text>
            <Text style={[styles.successDescription, { color: theme.grey, fontFamily: Fonts.regular }]}>
              Congratulations ! You have been{'\n'}successfully logged into the app.
            </Text>
            <Text style={[styles.successSubtext, { color: theme.grey, fontFamily: Fonts.regular }]}>
              Let the Pranking Begin 😎
            </Text>

            {/* Start Button */}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              activeOpacity={0.8}
              onPress={handleStartGifting}
            >
              <Text style={[styles.modalButtonText, { fontFamily: Fonts.semiBold }]}>
                Start Gifting Fun!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    zIndex: 1000,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  header: {
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
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  otpBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  button: {
    width: width - 48,
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
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: -20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIconCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  modalButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E8764B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default VerifyOTP;