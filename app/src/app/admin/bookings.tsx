import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon } from '@/components/icons/icon';
import { AccentFill } from '@/components/ui/buttons';
import { StatusPill } from '@/components/ui/controls';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { BOOKING_STATUS } from '@/data/seed';
import type { Booking } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { DAYS14 } from '@/lib/dates';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AdminBookings() {
  return (
    <RevealScope>
      <Bookings />
    </RevealScope>
  );
}

function Bookings() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const bookings = useApp((s) => s.bookings);
  const tonight = bookings.filter((b) => b.day === 0 && b.status < 2);
  const stats: [string, number][] = [
    ['Bookings', tonight.length],
    ['Covers', tonight.reduce((a, b) => a + b.party, 0)],
    ['Seated', bookings.filter((b) => b.status === 1).length],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0} style={styles.stats}>
          {stats.map(([l, v]) => (
            <View key={l} style={[styles.stat, { borderColor: c.line, backgroundColor: c.surface1 }]}>
              <Txt s={12} w={600} color={c.text3}>
                {l}
              </Txt>
              <Txt s={26} w={600}>
                {v}
              </Txt>
            </View>
          ))}
        </Reveal>
        {bookings.map((b, i) => (
          <Reveal key={b.id} i={1 + Math.min(i, 8)}>
            <BookingRow b={b} />
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Reservations" back />
    </View>
  );
}

function BookingRow({ b }: { b: Booking }) {
  const { c } = useTheme();
  const col = [c.info, c.ok, c.err][b.status];
  const setStatus = (status: 1 | 2) => {
    const st = useApp.getState();
    st.setBookingStatus(b.id, status);
    if (status === 1) st.showToast('Guests seated', b.name, 'event_seat');
    else st.showToast('Booking cancelled', b.name, 'event_busy');
  };
  return (
    <View style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}>
      <View style={styles.rowTop}>
        <View style={[styles.time, { backgroundColor: c.accentSoft }]}>
          <Txt s={16} w={600} color={c.accentText}>
            {b.time}
          </Txt>
          <Txt s={10} w={600} color={c.text3}>
            PM
          </Txt>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Txt s={14.5} w={700} numberOfLines={1}>
            {b.name}
          </Txt>
          <Txt s={12} color={c.text3} numberOfLines={1}>
            {(DAYS14[b.day] ?? DAYS14[0]).label} · {cnt(b.party, 'guest')} · {b.seat}
          </Txt>
        </View>
        <StatusPill label={BOOKING_STATUS[b.status]} color={col} padH={9} />
      </View>
      {b.status === 0 ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <PressableScale onPress={() => setStatus(2)} scaleTo={0.96} style={[styles.btn, { flex: 1, borderWidth: 1, borderColor: c.lineStrong }]}>
            <Txt s={13} w={600} color={c.err}>
              Cancel
            </Txt>
          </PressableScale>
          <PressableScale onPress={() => setStatus(1)} scaleTo={0.96} style={[styles.btn, { flex: 2, flexDirection: 'row', gap: 6 }]}>
            <AccentFill radius={20} />
            <Icon name="event_seat" size={17} fill color={c.accentInk} />
            <Txt s={13} w={700} color={c.accentInk}>
              Seat guests
            </Txt>
          </PressableScale>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, padding: 14, borderRadius: 18, borderWidth: 1, gap: 4 },
  row: { gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  time: { width: 56, paddingVertical: 8, borderRadius: 14, alignItems: 'center', gap: 1 },
  btn: { height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
