import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';
import { useColorScheme } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  borderRadius?: number;
  elevation?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 20,
  borderRadius = 16,
  elevation = true,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          borderRadius,
          padding,
          ...(elevation && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;