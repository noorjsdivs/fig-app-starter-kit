import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';

import { GlassTabBar, type TabItem } from '@/components/glass-tab-bar';
import { selectCartCount, useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

const TABS: Omit<TabItem, 'badge'>[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'menu', label: 'Menu', icon: 'restaurant_menu' },
  { key: 'saved', label: 'Saved', icon: 'favorite' },
  { key: 'cart', label: 'Cart', icon: 'shopping_bag' },
  { key: 'profile', label: 'Profile', icon: 'person' },
];

function CustomerTabBar({ state, navigateToTab }: BottomTabBarProps) {
  const count = useApp(selectCartCount);
  const bump = useApp((s) => s.bump);
  const items = TABS.map((t) => ({ ...t, badge: t.key === 'cart' && count > 0 ? count : undefined }));
  const active = TABS.findIndex((t) => t.key === state.routes[state.index]?.name);
  return (
    <GlassTabBar
      items={items}
      index={Math.max(0, active)}
      bump={bump}
      onPress={(i) => {
        const route = state.routes.find((r) => r.name === TABS[i].key);
        if (route) navigateToTab(route.key);
      }}
    />
  );
}

export default function TabsLayout() {
  const { c } = useTheme();
  return (
    <Tabs tabBar={(props) => <CustomerTabBar {...props} />} screenOptions={{ headerShown: false, animation: 'fade', sceneStyle: { backgroundColor: c.bg } }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="menu" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
