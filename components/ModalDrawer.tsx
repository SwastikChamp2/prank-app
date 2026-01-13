import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Modal,
  Pressable 
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

const { height } = Dimensions.get('window');

interface ModalDrawerProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

const ModalDrawer: React.FC<ModalDrawerProps> = ({
  children,
  isVisible,
  onClose,
  height: drawerHeight = height * 0.6,
  borderRadius = 24,
  backgroundColor,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const translateY = useSharedValue(drawerHeight);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 300 });
      backdropOpacity.value = withTiming(0.5, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 90,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(drawerHeight, { duration: 200 });
    }
  }, [isVisible, drawerHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleClose = () => {
    runOnJS(onClose)();
  };

  const drawerBackgroundColor = backgroundColor || colors.background;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.drawer,
            {
              height: drawerHeight,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              backgroundColor: drawerBackgroundColor,
            },
            animatedStyle,
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.grey1 }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  drawer: {
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 20,
    opacity: 0.3,
  },
});

export default ModalDrawer;