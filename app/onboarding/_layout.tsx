import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" />
      <Stack.Screen name="BenefitsScreen" />
      <Stack.Screen name="PermissionsScreen" />
    </Stack>
  );
}
