import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import HelmetTypeCard from '../components/HelmetTypeCard';
import OfferSlider from '../components/OfferSlider';
import ServiceCard from '../components/ServiceCard';
import ServiceTypeCard from '../components/ServiceTypeCard';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

const Home: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const helmetTypes = [
    {
      title: 'Full-face',
      image: require('../assets/images/Home/full-face.png'),
    },
    {
      title: 'Open-face',
      image: require('../assets/images/Home/open-face.png'),
    },
    {
      title: 'Flip-up',
      image: require('../assets/images/Home/flip-up.png'),
    },
    {
      title: 'Sports',
      image: require('../assets/images/Home/sports.png'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      
      {/* Header with proper padding */}
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.locationContainer}>
            <LinearGradient
              colors={[colors.primary, '#FF6B7A']}
              style={styles.locationIcon}
            >
              <Ionicons name="location" size={18} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.locationTextContainer}>
              <View style={styles.homeHeader}>
                <Text style={[styles.homeText, { color: colors.text }]}>Home</Text>
                <Ionicons name="chevron-down" size={18} color={colors.text} style={styles.chevronIcon} />
              </View>
              <Text style={[styles.locationText, { color: colors.grey1 }]}>
                Mumbai, Maharashtra
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.profileButton, { backgroundColor: colors.background }]}
            onPress={handleProfilePress}
          >
            <View style={[styles.profileIconContainer, { backgroundColor: colors.grayBg }]}>
              <Ionicons name="person-outline" size={20} color={colors.grey1} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Offer Slider */}
        <View style={styles.sliderSection}>
          <OfferSlider />
        </View>

        {/* Services by Helmet Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Services by helmet type
          </Text>
          <View style={styles.helmetTypesContainer}>
            {helmetTypes.map((type, index) => (
              <HelmetTypeCard
                key={index}
                title={type.title}
                image={type.image}
                onPress={() => console.log(`Selected ${type.title}`)}
              />
            ))}
          </View>
        </View>

        {/* Our Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Our Services
            </Text>
            <TouchableOpacity style={styles.popularButton}>
              <Ionicons name="swap-vertical" size={14} color={colors.text} />
              <Text style={[styles.popularText, { color: colors.text }]}>Popular</Text>
            </TouchableOpacity>
          </View>

          <ServiceCard
            title="Waterless Washing"
            subtitle="All types of helmets included"
            image={require('../assets/images/Home/service-1.png')}
            price="₹250-₹550"
            rating={4.3}
            duration="20 mins"
            discount="70% OFF"
            isPopular={true}
            features="We use the latest waterless technologies to wash the helmets."
            onPress={() => console.log('Waterless Washing selected')}
          />

          <ServiceCard
            title="Helmet Repair"
            subtitle="All types of helmets included"
            image={require('../assets/images/Home/service-1.png')}
            isComingSoon={true}
            onPress={() => console.log('Helmet Repair selected')}
          />
        </View>

        {/* Service Types */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Service Types
          </Text>
          
          <View style={styles.serviceTypesContainer}>
            <ServiceTypeCard
              title="Doorstep Service"
              subtitle="We come to you"
              image={require('../assets/images/Home/doorstep.png')}
              backgroundColor="#9CA3AF"
              onPress={() => console.log('Doorstep Service selected')}
            />
            
            <ServiceTypeCard
              title="At Location"
              subtitle="Visit our centers"
              image={require('../assets/images/Home/at-location.png')}
              backgroundColor="#6B7280"
              onPress={() => console.log('At Location selected')}
            />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#E23744',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  locationTextContainer: {
    flex: 1,
  },
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeText: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    marginRight: 4,
    letterSpacing: 0.3,
  },
  chevronIcon: {
    marginLeft: 2,
    marginTop: 1,
  },
  locationText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sliderSection: {
    paddingHorizontal: 0,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  popularButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  popularText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  helmetTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  serviceTypesContainer: {
    gap: 16,
  },
});

export default Home;