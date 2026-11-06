import { useFocusEffect, useNavigation } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback, useLayoutEffect } from 'react';

import { useTheme } from '@/theme/theme';

/**
 * Status-bar style for the current screen: `light` for screens that open on
 * dark photography (dish detail, tracking, story…), otherwise it follows the theme.
 *
 * On iOS the status bar is owned by each native-stack view controller, so the
 * style is applied as the screen's `statusBarStyle` option; the imperative call
 * covers screens hosted by non-native navigators (tabs).
 */
export function useStatusBar(style?: 'light' | 'dark') {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const resolved = style ?? (isDark ? 'light' : 'dark');

  useLayoutEffect(() => {
    (navigation as unknown as { setOptions: (o: Record<string, unknown>) => void }).setOptions({ statusBarStyle: resolved });
  }, [navigation, resolved]);

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(resolved, true);
    }, [resolved]),
  );
}
