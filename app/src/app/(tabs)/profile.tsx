import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Icon, type IconName } from '@/components/icons/icon';
import { AccentButton, OutlineButton } from '@/components/ui/buttons';
import { Toggle } from '@/components/ui/controls';
import { Eyebrow, ListCard, ListRow, useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, initials, money } from '@/lib/format';
import { payLabel, selectMyOrders, useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

type Href = Parameters<typeof router.push>[0];

export default function ProfileScreen() {
  useStatusBar();
  const { c } = useTheme();
  const chrome = useChrome();
  const st = useApp(
    useShallow((s) => ({
      user: s.user,
      points: s.points,
      credit: s.credit,
      orderNotif: s.orderNotif,
      myCount: selectMyOrders(s).length,
      active: selectMyOrders(s).some((o) => o.step < 3),
      upcoming: s.bookings.filter((b) => b.mine && b.status === 0).length,
      stories: s.posts.filter((p) => p.on).length,
      unread: s.inbox.filter((n) => n.unread).length,
      addrCount: s.addrs.length,
      addrTag: (s.addrs[s.addr] ?? s.addrs[0]).tag,
      pay: payLabel(s, true),
    })),
  );
  const user = st.user;
  const tier = st.points >= 2500 ? 'Gold' : st.points >= 1000 ? 'Silver' : 'Bronze';
  const go =
    (href: Href, needsUser = false) =>
    () => {
      if (needsUser && !user) router.push('/login');
      else router.push(href);
    };

  const profRows: { icon: IconName; l: string; s: string; go: () => void }[] = [
    { icon: 'receipt_long', l: 'My orders', s: st.active ? '1 on the way' : cnt(st.myCount, 'past order'), go: go('/orders', true) },
    { icon: 'loyalty', l: 'Fig Club', s: `${st.points.toLocaleString('en-US')} points · ${tier}`, go: go('/rewards') },
    { icon: 'event_seat', l: 'My reservations', s: st.upcoming ? `${st.upcoming} upcoming` : 'Book a table for tonight', go: go('/my-bookings') },
    { icon: 'auto_stories', l: 'The Fig Journal', s: `${st.stories} stories from our kitchen`, go: go('/journal') },
    { icon: 'notifications', l: 'Notifications', s: st.unread ? `${st.unread} unread` : 'All caught up', go: go('/inbox') },
  ];
  const acctRows: { icon: IconName; l: string; s: string; go: () => void }[] = [
    { icon: 'person', l: 'Edit profile', s: 'Name, email, phone', go: go('/edit-profile', true) },
    { icon: 'location_on', l: 'Addresses', s: `${cnt(st.addrCount, 'saved address')} · ${st.addrTag} default`, go: go('/addresses') },
    { icon: 'credit_card', l: 'Payment methods', s: `${st.pay} · ${money(st.credit)} credit`, go: go('/payments') },
    { icon: 'settings', l: 'Settings', s: 'Language, notifications, privacy', go: go('/settings') },
    { icon: 'help', l: 'Help & FAQ', s: 'Orders, refunds, contact us', go: go('/help') },
  ];

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: chrome.contentTop, paddingBottom: chrome.bottomPad, paddingHorizontal: 20, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          <Reveal i={0} style={{ paddingTop: 6 }}>
            <Txt s={34} w={600} ls={-0.03}>
              Profile
            </Txt>
          </Reveal>

          <Reveal i={1}>
            <View style={[styles.userCard, { backgroundColor: c.surface1, borderColor: c.line }]}>
              <View style={[styles.avatar, { backgroundColor: c.accentSoft }]}>
                {user ? (
                  <Txt s={22} w={600} color={c.accentText}>
                    {initials(user.name)}
                  </Txt>
                ) : (
                  <Icon name="person" size={28} fill color={c.accentText} />
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Txt s={18} w={700} numberOfLines={1}>
                  {user ? user.name : 'Guest'}
                </Txt>
                <Txt s={13} lh={1.4} color={c.text2}>
                  {user ? user.email : 'Sign in to order and track deliveries'}
                </Txt>
              </View>
              {!user ? (
                <AccentButton label="Sign in" height={42} fontSize={14} onPress={() => router.push('/login')} style={{ paddingHorizontal: 16 }} />
              ) : null}
            </View>
          </Reveal>

          {user ? (
            <Reveal i={1}>
              <PressableScale onPress={() => router.push('/admin')} scaleTo={0.98} style={styles.admin}>
                <View style={styles.adminTile}>
                  <Icon name="storefront" size={22} fill color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt s={15} w={700} color={fixed.paper}>
                    Restaurant admin
                  </Txt>
                  <Txt s={12.5} color={fixed.paperA(0.72)}>
                    Orders, menu, promotions and settings
                  </Txt>
                </View>
                <Icon name="chevron_right" size={22} color={fixed.paper} />
              </PressableScale>
            </Reveal>
          ) : null}

          <Reveal i={2}>
            <ListCard>
              {profRows.map((r, i) => (
                <ListRow key={r.l} icon={r.icon} title={r.l} sub={r.s} onPress={r.go} last={i === profRows.length - 1} />
              ))}
            </ListCard>
          </Reveal>

          <Reveal i={3}>
            <Eyebrow style={{ paddingTop: 6, paddingHorizontal: 4 }}>Account</Eyebrow>
          </Reveal>
          <Reveal i={3}>
            <ListCard>
              {acctRows.map((r, i) => (
                <ListRow key={r.l} icon={r.icon} title={r.l} sub={r.s} onPress={r.go} last={i === acctRows.length - 1} />
              ))}
            </ListCard>
          </Reveal>
          <Reveal i={3}>
            <ListCard>
              <PressableScale
                onPress={() => useApp.getState().setOrderNotif(!st.orderNotif)}
                scaleTo={0.985}
                style={styles.toggleRow}
                accessibilityRole="switch"
                accessibilityState={{ checked: st.orderNotif }}
              >
                <Txt s={14.5} w={600}>
                  Order notifications
                </Txt>
                <Toggle on={st.orderNotif} />
              </PressableScale>
            </ListCard>
          </Reveal>

          {user ? (
            <OutlineButton
              label="Sign out"
              color={c.err}
              onPress={() => {
                useApp.getState().signOut();
                router.navigate('/home');
                router.push('/login');
              }}
            />
          ) : null}
        </ScrollView>
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 24, borderWidth: 1 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  admin: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 22, backgroundColor: fixed.ink },
  adminTile: { width: 42, height: 42, borderRadius: 14, backgroundColor: fixed.orange, alignItems: 'center', justifyContent: 'center' },
  toggleRow: { minHeight: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
