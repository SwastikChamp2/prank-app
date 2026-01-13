import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useColorScheme } from 'react-native';

interface LoadingDotsProps {
  size?: number;
  color?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ size = 8, color }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const dotColor = color || colors.primary;

  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    dot1.value = withRepeat(
      withTiming(1, { duration: 600 }),
      -1,
      true
    );
    dot2.value = withDelay(
      200,
      withRepeat(withTiming(1, { duration: 600 }), -1, true)
    );
    dot3.value = withDelay(
      400,
      withRepeat(withTiming(1, { duration: 600 }), -1, true)
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: dot1.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: dot2.value,
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: dot3.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          { width: size, height: size, backgroundColor: dotColor },
          animatedStyle1,
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { width: size, height: size, backgroundColor: dotColor },
          animatedStyle2,
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { width: size, height: size, backgroundColor: dotColor },
          animatedStyle3,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: 3,
  },
});

export default LoadingDots;