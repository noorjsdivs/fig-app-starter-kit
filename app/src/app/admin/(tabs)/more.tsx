import { router, type Href } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { AdminHeader, exitAdmin, NavRow, useAdminPadding } from '@/components/admin/admin-ui';
import type { IconName } from '@/components/icons/icon';
import { OutlineButton } from '@/components/ui/buttons';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { CUSTOMERS } from '@/data/seed';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AdminMore() {
  return (
    <RevealScope>
      <More />
    </RevealScope>
  );
}

function More() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('tab');
  const cats = useApp((s) => s.cats);
  const brands = useApp((s) => s.brands);
  const secs = useApp((s) => s.secs);
  const banners = useApp((s) => s.banners);
  const posts = useApp((s) => s.posts);
  const promos = useApp((s) => s.promos);
  const bookings = useApp((s) => s.bookings);
  const reviews = useApp((s) => s.reviews);

  const avg = reviews.reduce((a, r) => a + r.stars, 0) / Math.max(1, reviews.length);
  const rows: [Href, string, string, IconName][] = [
    ['/admin/categories', 'Categories', `${cats.filter((x) => x.on).length} live · ${cats.filter((x) => !x.on).length} hidden`, 'category'],
    ['/admin/brands', 'Kitchens & brands', `${brands.filter((b) => b.on).length} active kitchens`, 'storefront'],
    [
      '/admin/home',
      'Home & banners',
      `${secs.filter((x) => x.on).length} sections · ${banners.filter((b) => b.on).length} banners live`,
      'dashboard_customize',
    ],
    ['/admin/journal', 'Journal', `${posts.filter((p) => p.on).length} published · ${posts.filter((p) => !p.on).length} draft`, 'auto_stories'],
    ['/admin/promos', 'Promotions', cnt(promos.filter((x) => x.on).length, 'active code'), 'sell'],
    ['/admin/customers', 'Customers', cnt(CUSTOMERS.length, 'customer'), 'group'],
    ['/admin/bookings', 'Reservations', cnt(bookings.filter((b) => b.day === 0 && b.status === 0).length, 'booking') + ' tonight', 'event_seat'],
    ['/admin/reviews', 'Reviews', `${avg.toFixed(1)} ★ average · ${reviews.filter((r) => !r.replied).length} to reply`, 'reviews'],
    ['/admin/settings', 'Settings', 'Hours, prep time, delivery', 'settings'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        {rows.map(([href, l, s, icon], i) => (
          <Reveal key={l} i={i}>
            <NavRow icon={icon} title={l} sub={s} onPress={() => router.push(href)} />
          </Reveal>
        ))}
        <OutlineButton label="Back to customer app" icon="storefront" height={52} onPress={exitAdmin} style={{ marginTop: 8 }} />
      </ScrollView>
      <AdminHeader title="Manage" />
    </View>
  );
}
