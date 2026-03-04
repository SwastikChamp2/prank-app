// components/AppInfoDrawer.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../constants/theme';

interface AppInfoDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const AppInfoDrawer: React.FC<AppInfoDrawerProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const appInfo = {
    name: 'Dont Take Crap',
    tagline: 'Prank your loved ones anonymously',
    version: '1.2.3 (Build 45)',
    lastUpdated: '9th October 2025',
    size: '24.5 MB',
    compatibility: 'iOS 14.0+ / Android 8.0+',
    developer: 'DTC Industries Inc.',
    supportEmail: 'support@donttakecrap.com',
    website: 'www.donttakecrap.com',
  };

  const whatsNew = [
    '10+ New Pranks Added',
    'New Prank Category Added',
    'Track your all your Orders',
    'Bug fixes and minor improvements',
    'Improved Safety and Security Features',
  ];

  const handleRateApp = () => {
    // Handle rate app logic
    console.log('Rate app pressed');
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${appInfo.supportEmail}`);
  };

  const handleWebsitePress = () => {
    Linking.openURL(`https://${appInfo.website}`);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.drawerContainer, { backgroundColor: theme.background }]}>
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.grey }]} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <Text style={[styles.drawerTitle, { color: theme.text, fontFamily: Fonts.bold }]}>
              App Info
            </Text>

            {/* App Logo and Name */}
            <View style={styles.appHeader}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="cover"
                />
              </View>
              <Text style={[styles.appName, { color: theme.text, fontFamily: Fonts.bold }]}>
                {appInfo.name}
              </Text>
              <Text style={[styles.tagline, { color: theme.grey, fontFamily: Fonts.regular }]}>
                {appInfo.tagline}
              </Text>
              <View style={[styles.versionBadge, { backgroundColor: theme.lightGrey }]}>
                <Text style={[styles.versionText, { color: theme.grey, fontFamily: Fonts.medium }]}>
                  Version {appInfo.version}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* App Details */}
            <View style={styles.detailsSection}>
              <DetailRow
                label="Version"
                value={appInfo.version}
                theme={theme}
              />
              <DetailRow
                label="Last Updated"
                value={appInfo.lastUpdated}
                theme={theme}
              />
              <DetailRow
                label="Size"
                value={appInfo.size}
                theme={theme}
              />
              <DetailRow
                label="Compatibility"
                value={appInfo.compatibility}
                theme={theme}
              />
              <DetailRow
                label="Developer"
                value={appInfo.developer}
                theme={theme}
              />
              <DetailRow
                label="Support Email"
                value={appInfo.supportEmail}
                theme={theme}
                onPress={handleEmailPress}
                isLink={true}
              />
              <DetailRow
                label="Compatibility"
                value={appInfo.website}
                theme={theme}
                onPress={handleWebsitePress}
                isLink={true}
              />
            </View>

            {/* What's New Section */}
            <View style={styles.whatsNewSection}>
              <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                What's New in v1.2.3
              </Text>
              <View style={[styles.whatsNewBox, { backgroundColor: theme.lightGrey }]}>
                {whatsNew.map((item, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={[styles.bullet, { color: theme.text }]}>•</Text>
                    <Text style={[styles.bulletText, { color: theme.text, fontFamily: Fonts.regular }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Rate App Section */}
            <View style={styles.rateSection}>
              <Text style={[styles.enjoyingText, { color: theme.text, fontFamily: Fonts.semiBold }]}>
                Enjoying HelmetWash?
              </Text>
              <Text style={[styles.rateSubtext, { color: theme.grey, fontFamily: Fonts.regular }]}>
                Help us improve by rating the app on your app store
              </Text>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: theme.primary }]}
                onPress={handleRateApp}
                activeOpacity={0.8}
              >
                <Text style={[styles.rateButtonText, { fontFamily: Fonts.semiBold }]}>
                  Rate App
                </Text>
                <Ionicons name="star" size={20} color={theme.white} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  theme: any;
  onPress?: () => void;
  isLink?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, theme, onPress, isLink }) => {
  const content = (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.grey, fontFamily: Fonts.regular }]}>
        {label}
      </Text>
      <Text style={[
        styles.detailValue,
        {
          color: isLink ? theme.primary : theme.text,
          fontFamily: Fonts.medium
        }
      ]}>
        {value}
      </Text>
    </View>
  );

  if (isLink && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    marginBottom: 12,
  },
  versionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  whatsNewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  whatsNewBox: {
    borderRadius: 12,
    padding: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  rateSection: {
    alignItems: 'center',
    paddingTop: 8,
  },
  enjoyingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  rateSubtext: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppInfoDrawer;