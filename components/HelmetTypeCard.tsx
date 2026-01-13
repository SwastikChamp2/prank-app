import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

interface HelmetTypeCardProps {
  title: string;
  image: any;
  onPress?: () => void;
}

const HelmetTypeCard: React.FC<HelmetTypeCardProps> = ({
  title,
  image,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[colors.background, '#F8F9FA']}
        style={styles.imageContainer}
      >
        <Image source={image} style={styles.helmetImage} resizeMode="contain" />
      </LinearGradient>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  helmetImage: {
    width: 52,
    height: 52,
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default HelmetTypeCard;