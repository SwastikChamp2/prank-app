import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Keyboard } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

const { height } = Dimensions.get('window');

interface DrawerProps {
  children: React.ReactNode;
  height?: number;
  borderRadius?: number;
  delay?: number;
  backgroundColor?: string;
  imageHeight?: number;
}

const Drawer: React.FC<DrawerProps> = ({
  children,
  height: drawerHeight = height * 0.70,
  borderRadius = 40,
  delay = 0,
  backgroundColor,
  imageHeight = 0,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const translateY = useSharedValue(drawerHeight);
  const opacity = useSharedValue(0);
  const keyboardOffset = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      delay + 100,
      withSpring(0, {
        damping: 25,
        stiffness: 90,
      })
    );
  }, [delay, drawerHeight]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      const keyboardHeight = e.endCoordinates.height;
      keyboardOffset.value = withSpring(-keyboardHeight / 2, {
        damping: 15,
        stiffness: 100,
      });
    });

    const keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', () => {
      keyboardOffset.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    });

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateY: keyboardOffset.value }
    ],
    opacity: opacity.value,
  }));

  const drawerBackgroundColor = backgroundColor || colors.background;

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          height: drawerHeight + 50,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          backgroundColor: drawerBackgroundColor,
          paddingTop: imageHeight,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.bottomFill, { backgroundColor: drawerBackgroundColor }]} />
      <View style={[styles.handle, { backgroundColor: colors.grey1 }]} />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
    paddingBottom: 70
  },
  bottomFill: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 70,
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.3,
  },
});

export default Drawer;