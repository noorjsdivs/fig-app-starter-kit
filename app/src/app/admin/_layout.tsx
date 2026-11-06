import { Stack } from 'expo-router';

import { useTheme } from '@/theme/theme';

/** Admin console stack — tab roots in `(tabs)`, every other screen pushes from the right. */
export default function AdminLayout() {
  const { c, isDark } = useTheme();
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: c.bg }, statusBarStyle: isDark ? 'light' : 'dark' }}
    >
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      {/* iOS 26 swipes back from anywhere; keep it to the edge so the discount slider can drag right. */}
      <Stack.Screen name="promos" options={{ fullScreenGestureEnabled: false }} />
    </Stack>
  );
}
