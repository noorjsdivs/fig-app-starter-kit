import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FlyLayer, ToastHost } from '@/components/ui/overlays';
import { useSimulation } from '@/hooks/use-simulation';
import { AppThemeProvider, useTheme } from '@/theme/theme';
import { fontAssets } from '@/theme/typography';

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <RootNavigator />
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const push = { animation: 'slide_from_right' } as const;
const rise = { animation: 'slide_from_bottom' } as const;

function RootNavigator() {
  const { c, isDark } = useTheme();
  useSimulation();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(c.bg).catch(() => undefined);
  }, [c.bg]);

  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return { ...base, colors: { ...base.colors, background: c.bg, card: c.bg, text: c.text1, border: c.line, primary: c.accent } };
  }, [isDark, c]);

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg }, statusBarStyle: isDark ? 'light' : 'dark', ...push }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="dish/[id]" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="success" options={{ ...rise, gestureEnabled: false }} />
        <Stack.Screen name="rate/[no]" options={rise} />
        {/* iOS 26 swipes back from anywhere; keep it to the edge so the card wallet can swipe right. */}
        <Stack.Screen name="payments" options={{ fullScreenGestureEnabled: false }} />
        <Stack.Screen name="admin" options={{ gestureEnabled: false }} />
      </Stack>
      <FlyLayer />
      <ToastHost />
    </ThemeProvider>
  );
}
