import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

const TermsConditions: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleBack = () => {
    router.back();
  };

  const termsData = [
    {
      title: '1. Service Agreement',
      content: 'By using HelmetWash services, you agree to these terms and conditions. Our waterless helmet cleaning service is provided as described in the app and is subject to availability in your area.'
    },
    {
      title: '2. Service Liability',
      content: 'While we take utmost care in handling your helmet, HelmetWash is not responsible for pre-existing damage, wear and tear, or damage resulting from manufacturing defects. We recommend our optional insurance coverage for added protection.'
    },
    {
      title: '3. Payment Terms',
      content: 'Payment is required at the time of booking. All prices are inclusive of applicable taxes. Refunds are processed within 3-5 business days for cancelled orders before service commencement.'
    },
    {
      title: '4. Cancellation Policy',
      content: 'You may cancel your order free of charge before our executive arrives at your location. Cancellations after service commencement may incur charges as per our cancellation policy.'
    },
    {
      title: '5. Data Privacy',
      content: 'We collect and use your personal information in accordance with our Privacy Policy. Your data is securely stored and never shared with third parties without your consent.'
    },
    {
      title: '6. Service Quality',
      content: 'We guarantee professional waterless cleaning using eco-friendly products. If you\'re not satisfied with our service, please contact our customer support within 24 hours for resolution.'
    },
    {
      title: '7. Limitation of Liability',
      content: 'Our liability is limited to the service fee paid. We are not liable for indirect, consequential, or incidental damages. Maximum liability shall not exceed the amount paid for the service.'
    },
    {
      title: '8. Contact Information',
      content: 'For any questions regarding these terms, please contact us at:'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Terms & Conditions</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={24} color={colors.grey1} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Terms & Conditions</Text>
          <Text style={[styles.subtitle, { color: colors.grey1 }]}>
            Last updated: September 28, 2025
          </Text>
        </View>

        {/* Terms Sections */}
        {termsData.map((term, index) => (
          <View key={index} style={styles.termSection}>
            <Text style={[styles.termTitle, { color: colors.text }]}>
              {term.title}
            </Text>
            <Text style={[styles.termContent, { color: colors.grey1 }]}>
              {term.content}
            </Text>
            
            {/* Contact Information Section */}
            {index === termsData.length - 1 && (
              <View style={[styles.contactContainer, { backgroundColor: colors.grayBg }]}>
                <View style={styles.contactItem}>
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    📧 Email: support@helmetwash.com
                  </Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    📞 Phone: +91 80000 12345
                  </Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    🕐 Support Hours: 9 AM - 8 PM (Mon-Sat)
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}

        {/* Agreement Acceptance */}
        <View style={styles.agreementSection}>
          <Text style={[styles.agreementTitle, { color: colors.text }]}>
            Agreement Acceptance
          </Text>
          <Text style={[styles.agreementText, { color: colors.grey1 }]}>
            By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  termSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  termTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 12,
  },
  termContent: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  contactContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  contactItem: {
    marginBottom: 8,
  },
  contactText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  agreementSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  agreementTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 12,
  },
  agreementText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default TermsConditions;