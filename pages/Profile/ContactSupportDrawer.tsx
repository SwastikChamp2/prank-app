import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import ModalDrawer from '../../components/ModalDrawer';

interface ContactSupportDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const ContactSupportDrawer: React.FC<ContactSupportDrawerProps> = ({
  isVisible,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@helmetwash.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+918000012345');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://wa.me/918000012345');
  };

  const contactMethods = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      subtitle: 'support@helmetwash.com',
      description: 'Get help via email within 24 hours',
      onPress: handleEmailPress,
    },
    {
      icon: 'call-outline',
      title: 'Phone Support',
      subtitle: '+91 80000 12345',
      description: 'Mon-Sat, 9 AM - 8 PM',
      onPress: handlePhonePress,
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp Chat',
      subtitle: 'Chat with us instantly',
      description: 'Quick responses on WhatsApp',
      onPress: handleWhatsAppPress,
    },
  ];

  return (
    <ModalDrawer 
      isVisible={isVisible} 
      onClose={onClose}
      height={600} // Increased height for better scrolling
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.lightRed }]}>
              <Ionicons name="headset-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Contact Support
            </Text>
            <Text style={[styles.subtitle, { color: colors.grey1 }]}>
              We're here to help with your transactions{'\n'}and refund queries
            </Text>
          </View>

          {/* Contact Methods */}
          <View style={styles.contactMethods}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.contactMethod,
                  { 
                    backgroundColor: colors.grayBg,
                    borderBottomWidth: index < contactMethods.length - 1 ? 1 : 0,
                    borderBottomColor: colors.grey2,
                  }
                ]}
                onPress={method.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.methodIcon, { backgroundColor: colors.background }]}>
                  <Ionicons 
                    name={method.icon as any} 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodTitle, { color: colors.text }]}>
                    {method.title}
                  </Text>
                  <Text style={[styles.methodSubtitle, { color: colors.primary }]}>
                    {method.subtitle}
                  </Text>
                  <Text style={[styles.methodDescription, { color: colors.grey1 }]}>
                    {method.description}
                  </Text>
                </View>
                
                <Ionicons name="chevron-forward" size={16} color={colors.grey1} />
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={[styles.faqTitle, { color: colors.text }]}>
              Common Issues
            </Text>
            <Text style={[styles.faqText, { color: colors.grey1 }]}>
              • Refund processing takes 3-5 business days{'\n'}
              • Transaction queries resolved within 24 hours{'\n'}
              • Service complaints handled immediately
            </Text>
          </View>

          {/* Additional Help Section */}
          <View style={styles.additionalHelp}>
            <Text style={[styles.additionalHelpTitle, { color: colors.text }]}>
              Quick Tips
            </Text>
            <Text style={[styles.additionalHelpText, { color: colors.grey1 }]}>
              • Keep your transaction ID handy when contacting support{'\n'}
              • Screenshots help us resolve issues faster{'\n'}
              • Check your spam folder for email responses{'\n'}
              • Our support team is available 6 days a week
            </Text>
          </View>

          {/* Emergency Contact */}
          <View style={[styles.emergencySection, { backgroundColor: colors.grayBg }]}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning-outline" size={20} color={colors.primary} />
              <Text style={[styles.emergencyTitle, { color: colors.text }]}>
                Urgent Issues?
              </Text>
            </View>
            <Text style={[styles.emergencyText, { color: colors.grey1 }]}>
              For urgent service complaints or payment issues, call us directly at{' '}
              <Text style={[styles.emergencyPhone, { color: colors.primary }]}>
                +91 80000 12345
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </ModalDrawer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 80, // Increased bottom padding for safe area
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  contactMethods: {
    marginBottom: 32,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 1,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  methodSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 4,
  },
  methodDescription: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  faqSection: {
    marginBottom: 32,
  },
  faqTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 12,
  },
  faqText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  additionalHelp: {
    marginBottom: 32,
  },
  additionalHelpTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 12,
  },
  additionalHelpText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  emergencySection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 40, // Extra margin for safe area
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginLeft: 8,
  },
  emergencyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  emergencyPhone: {
    fontFamily: Fonts.semiBold,
  },
});

export default ContactSupportDrawer;