import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, Platform } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { LanguageProvider } from '../contexts/LanguageContext';

// Suppress Reanimated warnings
LogBox.ignoreLogs([
  '[Reanimated] Writing to `value` during component render',
]);

// Tab pages that should use slide transitions
const tabPages = ['home', 'my-orders', 'cart', 'settings'];

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'BebasNeue-Regular': BebasNeue_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.container}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              animationTypeForReplace: 'push',
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="signup"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="verify-otp"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="login-success"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="home"
              options={{
                animation: 'slide_from_right',
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="select-prank"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="prank-detail"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="select-box"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="select-wrap"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="cart"
              options={{
                animation: 'slide_from_right',
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                animation: 'slide_from_right',
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                animation: 'default',
              }}
            />

            <Stack.Screen
              name="language"
              options={{
                animation: 'default',
              }}
            />

            <Stack.Screen
              name="faq"
              options={{
                animation: 'default',
              }}
            />

            <Stack.Screen
              name="my-address"
              options={{
                animation: 'default',
              }}
            />

            <Stack.Screen
              name="add-address"
              options={{
                animation: 'default',
              }}
            />




            <Stack.Screen
              name="my-orders"
              options={{
                animation: 'slide_from_right',
                gestureDirection: 'horizontal',
              }}
              listeners={({ navigation }) => ({
                beforeRemove: (e) => {
                  e.preventDefault();
                  navigation.navigate('home' as never);
                },
              })}
            />
            <Stack.Screen
              name="order-detail"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="transactions"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="legal"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="terms-conditions"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="privacy-policy"
              options={{
                animation: 'default',
              }}
            />
            <Stack.Screen
              name="refer-earn"
              options={{
                animation: 'default',
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});