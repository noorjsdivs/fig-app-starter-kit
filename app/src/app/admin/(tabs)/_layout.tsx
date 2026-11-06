import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';

import { GlassTabBar, type TabItem } from '@/components/glass-tab-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

const TABS: Omit<TabItem, 'badge'>[] = [
  { key: 'index', label: 'Dashboard', icon: 'dashboard' },
  { key: 'orders', label: 'Orders', icon: 'receipt_long' },
  { key: 'kitchen', label: 'Kitchen', icon: 'skillet' },
  { key: 'menu', label: 'Menu', icon: 'menu_book' },
  { key: 'more', label: 'More', icon: 'more_horiz' },
];

function AdminTabBar({ state, navigateToTab }: BottomTabBarProps) {
  const waiting = useApp((s) => s.orders.filter((o) => o.step === 0).length);
  const items = TABS.map((t) => ({ ...t, badge: t.key === 'orders' && waiting > 0 ? waiting : undefined }));
  const active = TABS.findIndex((t) => t.key === state.routes[state.index]?.name);
  return (
    <GlassTabBar
      items={items}
      index={Math.max(0, active)}
      pillInset={6}
      onPress={(i) => {
        const route = state.routes.find((r) => r.name === TABS[i].key);
        if (route) navigateToTab(route.key);
      }}
    />
  );
}

export default function AdminTabsLayout() {
  const { c } = useTheme();
  return (
    <Tabs tabBar={(props) => <AdminTabBar {...props} />} screenOptions={{ headerShown: false, animation: 'fade', sceneStyle: { backgroundColor: c.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="kitchen" />
      <Tabs.Screen name="menu" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}
