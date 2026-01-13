import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import ModalDrawer from '../../components/ModalDrawer';

interface AppInfoDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onRateApp?: () => void; // Add this prop to handle rate app action
}

const AppInfoDrawer: React.FC<AppInfoDrawerProps> = ({
  isVisible,
  onClose,
  onRateApp,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRateApp = () => {
    onClose(); // Close this drawer first
    // Small delay to ensure smooth transition
    setTimeout(() => {
      onRateApp?.(); // Then open the rating drawer
    }, 300);
  };

  const appDetails = [
    { label: 'Version', value: '1.2.3 (Build 45)' },
    { label: 'Last Updated', value: '5th October 2025' },
    { label: 'Size', value: '24.5 MB' },
    { label: 'Compatibility', value: 'iOS 14.0+ / Android 8.0+' },
    { label: 'Developer', value: 'Helmet Washer Inc.' },
    { label: 'Support Email', value: 'support@helmetwash.com' },
    { label: 'Website', value: 'www.helmetwash.com' },
  ];

  const whatsNew = [
    'Improved AI photo capture accuracy',
    'Better location detection for service areas',
    'Enhanced push notifications',
    'Bug fixes and performance improvements',
    'New payment methods support',
  ];

  return (
    <ModalDrawer 
      isVisible={isVisible} 
      onClose={onClose}
      height={650}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.text }]}>App Info</Text>

        {/* App Icon and Name */}
        <View style={styles.appHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>HelmetWash</Text>
          <Text style={[styles.tagline, { color: colors.grey1 }]}>
            Waterless • Doorstep • Professional
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.grayBg }]}>
            <Text style={[styles.versionText, { color: colors.grey1 }]}>
              Version 1.2.3
            </Text>
          </View>
        </View>

        {/* App Details */}
        <View style={styles.detailsContainer}>
          {appDetails.map((detail, index) => (
            <View 
              key={index} 
              style={[
                styles.detailRow,
                index === 0 && { borderTopWidth: 1, borderTopColor: colors.primary }
              ]}
            >
              <Text style={[styles.detailLabel, { color: colors.text }]}>
                {detail.label}
              </Text>
              <Text style={[styles.detailValue, { color: colors.grey1 }]}>
                {detail.value}
              </Text>
            </View>
          ))}
        </View>

        {/* What's New Section */}
        <View style={styles.whatsNewContainer}>
          <Text style={[styles.whatsNewTitle, { color: colors.text }]}>
            What's New in v1.2.3
          </Text>
          <View style={[styles.whatsNewContent, { backgroundColor: colors.grayBg }]}>
            {whatsNew.map((item, index) => (
              <View key={index} style={styles.whatsNewItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={[styles.whatsNewText, { color: colors.grey1 }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rate App Section */}
        <View style={styles.rateSection}>
          <Text style={[styles.rateTitle, { color: colors.text }]}>
            Enjoying HelmetWash?
          </Text>
          <Text style={[styles.rateSubtitle, { color: colors.grey1 }]}>
            Help us improve by rating the app on{'\n'}your app store
          </Text>
          <TouchableOpacity 
            style={[styles.rateButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={handleRateApp}
          >
            <Ionicons name="star" size={18} color="#FFFFFF" />
            <Text style={styles.rateButtonText}>Rate App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ModalDrawer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 50,
    height: 50,
  },
  appName: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    marginBottom: 4,
  },
  tagline: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginBottom: 12,
  },
  versionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  versionText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  detailsContainer: {
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailLabel: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  whatsNewContainer: {
    marginBottom: 32,
  },
  whatsNewTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    marginBottom: 16,
  },
  whatsNewContent: {
    borderRadius: 12,
    padding: 16,
  },
  whatsNewItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    marginTop: 2,
  },
  whatsNewText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  rateSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rateTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  rateSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  rateButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default AppInfoDrawer;