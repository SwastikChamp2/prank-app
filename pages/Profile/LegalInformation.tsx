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

const LegalInformation: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleBack = () => {
    router.back();
  };

  const legalSections = [
    {
      title: 'Terms of Service',
      content: 'By using our helmet washing service, you agree to provide accurate information and follow all instructions. We reserve the right to refuse service or cancel orders if terms are violated. We are not responsible for any damage caused during cleaning due to pre-existing conditions or improper use. Payment must be completed before service. By booking with us, you accept these terms.'
    },
    {
      title: 'Privacy Policy',
      content: 'We collect only necessary personal information such as name, contact details, and payment information to provide and improve our helmet washing services. Your data is securely stored and never shared with third parties except as required by law. We may use your contact information to send service updates or promotions. By using our service, you consent to this data use.'
    },
    {
      title: 'Service Agreement',
      content: 'This agreement confirms that you have requested helmet cleaning services from us. We commit to providing professional and thorough cleaning. Please ensure helmets are free of items or accessories before service. We are not liable for damage to helmets caused by existing defects or misuse. Payment is due upon completion. Any complaints should be reported within 48 hours.'
    },
    {
      title: 'Cookie Policy',
      content: 'Our website uses cookies to enhance user experience, remember preferences, and improve service quality. Cookies help us analyze site traffic and optimize functionality. By continuing to use our site, you agree to the use of cookies. You can disable cookies in your browser settings, but some features may not function properly without them.'
    }
  ];

  const certifications = [
    'ISO 27001 Data Security Certified',
    'GDPR Compliant',
    'RBI Payment Security Guidelines',
    'Environmental Safety Standards'
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Legal Information</Text>
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
            <Ionicons name="scale-outline" size={24} color={colors.grey1} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Legal Information</Text>
          <Text style={[styles.subtitle, { color: colors.grey1 }]}>
            Important legal documents and policies
          </Text>
        </View>

        {/* Legal Sections - Removed grey background */}
        <View style={styles.sectionsContainer}>
          {legalSections.map((section, index) => (
            <View key={index} style={styles.sectionItem}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
              <Text style={[styles.sectionContent, { color: colors.grey1 }]}>
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Legal Contact Section - Kept grey background */}
        <View style={[styles.contactSection, { backgroundColor: colors.grayBg }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Legal Contact
          </Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color={colors.grey1} />
            <View style={styles.contactInfo}>
              <Text style={[styles.contactValue, { color: colors.text }]}>
                legal@helmetwash.com
              </Text>
              <Text style={[styles.contactLabel, { color: colors.grey1 }]}>
                For legal inquiries and complaints
              </Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color={colors.grey1} />
            <View style={styles.contactInfo}>
              <Text style={[styles.contactValue, { color: colors.text }]}>
                +91 80000 12345
              </Text>
              <Text style={[styles.contactLabel, { color: colors.grey1 }]}>
                Business hours: 9 AM - 6 PM (Mon-Fri)
              </Text>
            </View>
          </View>
        </View>

        {/* Compliance & Certifications */}
        <View style={styles.complianceSection}>
          <Text style={[styles.complianceTitle, { color: colors.text }]}>
            Compliance & Certifications
          </Text>
          
          {certifications.map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={[styles.certificationText, { color: colors.grey1 }]}>
                {cert}
              </Text>
            </View>
          ))}
        </View>

        {/* Agreement Acceptance */}
        <View style={styles.agreementSection}>
          <Text style={[styles.agreementTitle, { color: colors.text }]}>
            Agreement Acceptance
          </Text>
          <Text style={[styles.agreementText, { color: colors.grey1 }]}>
            The information provided in these legal documents is for general guidance only. For specific legal advice, please consult with a qualified legal professional.
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
    lineHeight: 20,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionItem: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 12,
  },
  sectionContent: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  contactSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  contactTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactValue: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 4,
  },
  contactLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  complianceSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  complianceTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 20,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  certificationText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginLeft: 12,
  },
  agreementSection: {
    paddingHorizontal: 20,
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

export default LegalInformation;