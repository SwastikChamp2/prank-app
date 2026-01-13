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

interface ServiceTypeCardProps {
  title: string;
  subtitle: string;
  image: any;
  backgroundColor: string;
  onPress?: () => void;
}

const ServiceTypeCard: React.FC<ServiceTypeCardProps> = ({
  title,
  subtitle,
  image,
  backgroundColor,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.serviceImage} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  arrowText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  imageContainer: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImage: {
    width: 100,
    height: 100,
  },
});

export default ServiceTypeCard;