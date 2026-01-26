// pages/Login.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  useColorScheme,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../config/firebase.config';
import { sendOTP } from '../services/AuthServices';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const recaptchaVerifier = useRef(null);

  const validatePhoneNumber = (phone: string) => {
    if (!phone) {
      setError('Phone number is required');
      return false;
    }
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    setError('');
    return true;
  };

  const handleMobileNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setMobileNumber(numericText);
    if (error) setError('');
  };

  const handleContinue = async () => {
    if (!validatePhoneNumber(mobileNumber)) {
      Alert.alert('Invalid Phone Number', error);
      return;
    }

    setLoading(true);

    try {
      const formattedPhoneNumber = `+91${mobileNumber}`;
      const confirmationResult = await sendOTP(
        formattedPhoneNumber,
        recaptchaVerifier.current
      );

      // Store confirmation result globally
      (global as any).confirmationResult = confirmationResult;

      setLoading(false);
      router.push({
        pathname: '/verify-otp',
        params: { phoneNumber: mobileNumber, isSignup: 'false' }
      });
    } catch (error: any) {
      setLoading(false);
      console.error('OTP Error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleNavigateToSignUp = () => {
    router.push('/signup');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={true}
      />

      {/* Top Decorative Image*/}
      <Image
        source={require('../assets/images/top-decoration.png')}
        style={styles.topDecoration}
        resizeMode="contain"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Header */}
        <View style={styles.iconHeader}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
            <Ionicons name="gift" size={56} color="#FFFFFF" />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.bold }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.grey, fontFamily: Fonts.regular }]}>
            Log in and be a prankster anonymously !
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Mobile Number Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text, fontFamily: Fonts.medium }]}>
              Mobile Number
            </Text>
            <View style={[
              styles.inputContainer,
              {
                backgroundColor: theme.background,
                borderColor: error ? '#FF3B30' : '#E5E5E5'
              }
            ]}>
              <Ionicons name="call-outline" size={20} color={theme.grey} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text, fontFamily: Fonts.regular }]}
                placeholder="Enter your mobile number"
                placeholderTextColor={theme.grey}
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={handleMobileNumberChange}
                maxLength={10}
                editable={!loading}
              />
            </View>
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.primary },
            loading && styles.buttonDisabled
          ]}
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.buttonText, { fontFamily: Fonts.semiBold }]}>
              Continue
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity
          style={styles.signUpLink}
          activeOpacity={0.7}
          onPress={handleNavigateToSignUp}
          disabled={loading}
        >
          <Text style={[styles.linkText, { color: theme.primary, fontFamily: Fonts.medium }]}>
            New here? Join the Pranksters!
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Decorative Image*/}
      <Image
        source={require('../assets/images/bottom-decoration.png')}
        style={styles.bottomDecoration}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: width,
    height: 150,
    zIndex: 0,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: width,
    height: 150,
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 160,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E8764B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  spacer: {
    flex: 1,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#E8764B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  signUpLink: {
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default Login;