import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Clipboard,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Fonts } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

interface Referral {
  id: string;
  name: string;
  date: string;
  amount: number;
  status: 'Credited' | 'Pending';
}

const ReferEarn: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [referralCode] = useState('HELMET123');

  const handleBack = () => {
    router.back();
  };

  const handleCopyCode = async () => {
    await Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Hey! Use my referral code ${referralCode} and get ₹50 off on your first helmet cleaning service with HelmetWash. Download the app now!`,
        title: 'Get ₹50 off with HelmetWash',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const referralsData: Referral[] = [
    {
      id: '1',
      name: 'Rajesh K.',
      date: '2025-09-20',
      amount: 50,
      status: 'Credited'
    },
    {
      id: '2',
      name: 'Priya S.',
      date: '2025-09-15',
      amount: 50,
      status: 'Credited'
    },
    {
      id: '3',
      name: 'Sarah M.',
      date: '2025-09-05',
      amount: 50,
      status: 'Pending'
    }
  ];

  const totalCredits = referralsData
    .filter(ref => ref.status === 'Credited')
    .reduce((sum, ref) => sum + ref.amount, 0);

  const totalReferrals = referralsData.length;

  const ReferralItem = ({ referral }: { referral: Referral }) => (
    <View style={styles.referralItem}>
      <View style={styles.referralInfo}>
        <Text style={[styles.referralName, { color: colors.text }]}>
          {referral.name}
        </Text>
        <Text style={[styles.referralDate, { color: colors.grey1 }]}>
          {referral.date}
        </Text>
      </View>
      
      <View style={styles.referralReward}>
        <Text style={[styles.referralAmount, { color: '#2E7D32' }]}>
          +₹{referral.amount}
        </Text>
        <View style={[
          styles.statusBadge,
          {
            backgroundColor: referral.status === 'Credited' ? '#E8F5E8' : '#FFF4E6'
          }
        ]}>
          <Text style={[
            styles.statusText,
            {
              color: referral.status === 'Credited' ? '#2E7D32' : '#F57C00'
            }
          ]}>
            {referral.status}
          </Text>
        </View>
      </View>
    </View>
  );

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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Refer & Earn</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Refer & Earn Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTop} />
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>
                Refer & Earn ₹50
              </Text>
              <Text style={styles.bannerSubtitle}>
                with every friend
              </Text>
              <Text style={styles.bannerDescription}>
                Friend gets ₹50 off on first service
              </Text>
              <Text style={styles.bannerDescription}>
                You get ₹50 credit
              </Text>
              
              <TouchableOpacity style={styles.referButton}>
                <Text style={styles.referButtonText}>
                  Refer Now !
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.giftIcon}>
              <Text style={styles.giftEmoji}>🎁</Text>
            </View>
          </View>
        </View>

        {/* Referral Code Section */}
        <View style={[styles.codeSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.codeLabel, { color: colors.grey1 }]}>
            Your Referral Code
          </Text>
          
          <View style={styles.codeContainer}>
            <Text style={[styles.code, { color: colors.text }]}>
              {referralCode}
            </Text>
            <TouchableOpacity 
              style={[styles.copyButton, { backgroundColor: colors.grey1 }]}
              onPress={handleCopyCode}
            >
              <Text style={styles.copyButtonText}>COPY</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShareReferral}
          >
            <Ionicons name="share-outline" size={16} color={colors.primary} />
            <Text style={[styles.shareButtonText, { color: colors.primary }]}>
              Share referral link
            </Text>
          </TouchableOpacity>
        </View>

        {/* Credits Earned */}
        <View style={styles.statsContainer}>
          <View style={styles.creditsSection}>
            <Text style={[styles.creditsLabel, { color: '#2E7D32' }]}>
              Credits Earned
            </Text>
            <View style={styles.creditsAmountContainer}>
              <Text style={[styles.creditsAmount, { color: '#2E7D32' }]}>
                ₹{totalCredits}
              </Text>
              <View style={[styles.trendIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="trending-up" size={16} color="#2E7D32" />
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.friendsSection}>
            <Text style={[styles.friendsLabel, { color: colors.text }]}>
              Friends Referred
            </Text>
            <Text style={[styles.friendsCount, { color: colors.text }]}>
              {totalReferrals}
            </Text>
          </View>
        </View>

        {/* Recent Referrals */}
        <View style={styles.referralsSection}>
          <Text style={[styles.referralsTitle, { color: colors.text }]}>
            Recent Referrals
          </Text>
          
          <View style={styles.referralsList}>
            {referralsData.map((referral) => (
              <ReferralItem key={referral.id} referral={referral} />
            ))}
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsSection}>
          <Text style={[styles.termsTitle, { color: colors.text }]}>
            Terms & Conditions
          </Text>
          
          <View style={styles.termsList}>
            <Text style={[styles.termItem, { color: colors.grey1 }]}>
              • Referral bonus credited after friend's first completed service
            </Text>
            <Text style={[styles.termItem, { color: colors.grey1 }]}>
              • Credits can be used for future bookings
            </Text>
            <Text style={[styles.termItem, { color: colors.grey1 }]}>
              • Minimum order value ₹99 required for referral code usage
            </Text>
            <Text style={[styles.termItem, { color: colors.grey1 }]}>
              • No limit on number of referrals
            </Text>
          </View>
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
  
  // Banner Styles
  bannerContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  bannerTop: {
    height: 4,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  banner: {
    backgroundColor: '#E53E3E',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bannerDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  referButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  referButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  giftIcon: {
    marginLeft: 16,
  },
  giftEmoji: {
    fontSize: 60,
  },
  
  // Code Section Styles
  codeSection: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  codeLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  code: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    letterSpacing: 2,
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginLeft: 6,
  },
  
  // Stats Styles
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  creditsSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  creditsLabel: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    marginBottom: 8,
  },
  creditsAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsAmount: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    marginRight: 12,
  },
  trendIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  friendsSection: {
    alignItems: 'center',
  },
  friendsLabel: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    marginBottom: 8,
  },
  friendsCount: {
    fontFamily: Fonts.bold,
    fontSize: 32,
  },
  
  // Referrals List Styles
  referralsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  referralsTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 20,
  },
  referralsList: {
    gap: 16,
  },
  referralItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  referralDate: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  referralReward: {
    alignItems: 'flex-end',
  },
  referralAmount: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
  },
  
  // Terms Styles
  termsSection: {
    paddingHorizontal: 20,
  },
  termsTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 16,
  },
  termsList: {
    gap: 8,
  },
  termItem: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ReferEarn;