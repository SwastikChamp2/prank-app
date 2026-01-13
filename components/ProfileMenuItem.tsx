import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import Toggle from './ui/Toggle';

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  isDangerous?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  iconColor,
  title,
  onPress,
  showArrow = true,
  showToggle = false,
  toggleValue = false,
  onToggleChange,
  isDangerous = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const textColor = isDangerous ? colors.primary : colors.text;
  const defaultIconColor = isDangerous ? colors.primary : colors.primary;

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={showToggle}
    >
      <View style={styles.leftSection}>
        <Ionicons
          name={icon}
          size={20}
          color={iconColor || defaultIconColor}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuText, { color: textColor }]}>
          {title}
        </Text>
      </View>
      
      {showToggle ? (
        <Toggle
          value={toggleValue}
          onValueChange={onToggleChange || (() => {})}
        />
      ) : showArrow ? (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.grey1}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default ProfileMenuItem;