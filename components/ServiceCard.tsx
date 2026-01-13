import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

interface ServiceCardProps {
  title: string;
  subtitle: string;
  image: any;
  price?: string;
  rating?: number;
  duration?: string;
  discount?: string;
  isPopular?: boolean;
  isComingSoon?: boolean;
  features?: string;
  onPress?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  subtitle,
  image,
  price,
  rating,
  duration,
  discount,
  isPopular,
  isComingSoon,
  features,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: colors.background },
        isComingSoon && styles.comingSoonContainer
      ]} 
      onPress={onPress}
      disabled={isComingSoon}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.serviceImage} resizeMode="cover" />
        
        {isPopular && (
          <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}
        
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )}
        
        {duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>⏱ {duration}</Text>
          </View>
        )}
        
        {isComingSoon && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: isComingSoon ? colors.grey1 : colors.text }]}>
            {title}
          </Text>
          {rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{rating}</Text>
              <Text style={styles.star}>⭐</Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.subtitle, { color: colors.grey1 }]}>{subtitle}</Text>
        
        {features && (
          <View style={styles.featuresContainer}>
            <View style={[styles.featuresDot, { backgroundColor: colors.green }]} />
            <Text style={[styles.features, { color: colors.grey1 }]}>{features}</Text>
            <View style={[styles.checkIcon, { backgroundColor: colors.green }]}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          </View>
        )}
        
        {price && (
          <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  comingSoonContainer: {
    opacity: 0.6,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: '#FFFFFF',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#FFFFFF',
  },
  comingSoonBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comingSoonText: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 2,
  },
  star: {
    fontSize: 10,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuresDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  features: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    flex: 1,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  price: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});

export default ServiceCard;