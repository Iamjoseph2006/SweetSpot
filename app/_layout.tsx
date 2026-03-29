import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // Elimina flechas y títulos en TODA la app
        }}
      >
        {/* Onboarding */}
        <Stack.Screen name="onboarding" />

        {/* Auth (login / register) */}
        <Stack.Screen name="auth" />

        {/* Vista protegida */}
        <Stack.Screen name="DashboardScreen" />
        <Stack.Screen name="shop/CatalogScreen" />
        <Stack.Screen name="shop/CartScreen" />
        <Stack.Screen name="shop/OrderScreen" />
        <Stack.Screen name="profile/ProfileSettingsScreen" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}