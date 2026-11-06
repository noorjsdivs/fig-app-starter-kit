import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, GrowBar, OrderRow, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon, type IconName } from '@/components/icons/icon';
import { LinkButton } from '@/components/ui/buttons';
import { PulseDot, Toggle } from '@/components/ui/controls';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope, useEntered } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { CUSTOMERS, HOURS } from '@/data/seed';
import { useStatusBar } from '@/hooks/use-status-bar';
import { money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

const custName = (id: string) => (CUSTOMERS.find((c) => c.id === id) ?? CUSTOMERS[0]).name;
const HMAX = Math.max(...HOURS.map((h) => h[1]));
const HOURS_TOTAL = HOURS.reduce((a, h) => a + h[1], 0);

export default function AdminDashboard() {
  return (
    <RevealScope>
      <Dashboard />
    </RevealScope>
  );
}

function Dashboard() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('tab');
  const entered = useEntered();
  const orders = useApp((s) => s.orders);
  const menu = useApp((s) => s.menu);
  const storeOpen = useApp((s) => s.storeOpen);
  const prep = useApp((s) => s.prep);
  const toggleStore = useApp((s) => s.toggleStoreOpen);
  const toggleAvail = useApp((s) => s.toggleAvail);

  const today = orders.filter((o) => !['Yesterday', 'Mon'].includes(o.time) && o.step < 4);
  const revenue = today.reduce((a, o) => a + o.total, 0);
  const waiting = orders.filter((o) => o.step === 0).length;
  const queue = orders.filter((o) => o.step < 3);
  const off = menu.filter((m) => !m.avail);
  const dot = storeOpen ? c.ok : c.err;

  const kpis: [string, string, string, string, IconName][] = [
    ['Revenue tonight', money(revenue), '+14% vs last Tue', c.ok, 'payments'],
    ['Orders', String(today.length), `${waiting} waiting to accept`, c.accentText, 'receipt_long'],
    ['Avg ticket', money(revenue / Math.max(1, today.length)), '+$1.80 this week', c.ok, 'shopping_bag'],
    ['86’d items', String(off.length), off.length ? 'Unavailable now' : 'Full menu live', off.length ? c.warn : c.ok, 'block'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 12 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0}>
          <PressableScale onPress={toggleStore} scaleTo={0.985} style={[styles.storeRow, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            {storeOpen ? <PulseDot color={dot} size={12} duration={1800} /> : <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: dot }} />}
            <View style={{ flex: 1, gap: 2 }}>
              <Txt s={15} w={700}>
                {storeOpen ? 'Kitchen is open' : 'Kitchen is closed'}
              </Txt>
              <Txt s={12.5} color={c.text3}>
                {storeOpen ? `Taking orders · ~${prep} min prep` : 'New orders paused'}
              </Txt>
            </View>
            <Toggle on={storeOpen} />
          </PressableScale>
        </Reveal>

        <View style={styles.grid}>
          {kpis.map(([l, v, d, dc, icon], i) => (
            <Reveal key={l} i={1 + i} style={styles.gridCell}>
              <View style={[styles.kpi, { borderColor: c.line, backgroundColor: c.surface1 }]}>
                <View style={styles.between}>
                  <Txt s={12} w={600} color={c.text3}>
                    {l}
                  </Txt>
                  <Icon name={icon} size={18} color={c.text3} />
                </View>
                <Txt s={26} w={600} ls={-0.02} numberOfLines={1} adjustsFontSizeToFit>
                  {v}
                </Txt>
                <Txt s={11.5} w={600} color={dc} numberOfLines={1}>
                  {d}
                </Txt>
              </View>
            </Reveal>
          ))}
        </View>

        <Reveal i={5}>
          <View style={[styles.chart, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <View style={[styles.between, { alignItems: 'baseline' }]}>
              <Txt s={17} w={600}>
                Sales by hour
              </Txt>
              <Txt s={12.5} w={600} color={c.text3}>
                {money(HOURS_TOTAL)} tonight
              </Txt>
            </View>
            <View style={styles.bars}>
              {HOURS.map(([l, v], i) => (
                <View key={l} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <GrowBar
                      axis="height"
                      from={4}
                      pct={entered ? (v / HMAX) * 100 : 4}
                      delay={300 + i * 70}
                      style={{ width: '100%', borderRadius: 10, backgroundColor: i === 2 ? c.accent : c.surface2 }}
                    />
                  </View>
                  <Txt s={11} w={600} color={c.text3}>
                    {l}
                  </Txt>
                </View>
              ))}
            </View>
          </View>
        </Reveal>

        <Reveal i={6} from={{ y: 0, scale: 1 }}>
          <View style={[styles.between, { alignItems: 'baseline', marginTop: 6 }]}>
            <Txt s={18} w={600}>
              Live queue
            </Txt>
            <LinkButton label="All orders" onPress={() => router.navigate('/admin/orders')} />
          </View>
        </Reveal>
        {!queue.length ? (
          <Txt s={14} w={500} color={c.text3} align="center" style={{ padding: 20 }}>
            No orders in progress.
          </Txt>
        ) : null}
        {queue.slice(0, 4).map((o, i) => (
          <Reveal key={o.no} i={7 + i}>
            <OrderRow order={o} customer={custName(o.cid)} variant="queue" />
          </Reveal>
        ))}

        <View style={[styles.between, { alignItems: 'baseline', marginTop: 6 }]}>
          <Txt s={18} w={600}>
            86’d tonight
          </Txt>
          <LinkButton label="Manage menu" onPress={() => router.navigate('/admin/menu')} />
        </View>
        {!off.length ? (
          <View style={[styles.dashed, { borderColor: c.lineStrong }]}>
            <Txt s={13.5} w={500} color={c.text3} align="center">
              Every dish is available.
            </Txt>
          </View>
        ) : null}
        {off.map((m) => (
          <PressableScale
            key={m.id}
            onPress={() => toggleAvail(m.id)}
            scaleTo={0.985}
            style={[styles.offRow, { borderColor: c.line, backgroundColor: c.surface1 }]}
          >
            <DishImage uri={m.img} size={44} opacity={0.5} />
            <Txt s={14} w={600} style={{ flex: 1 }} numberOfLines={1}>
              {m.name}
            </Txt>
            <Toggle on={m.avail} />
          </PressableScale>
        ))}
      </ScrollView>
      <AdminHeader title="Tonight" />
    </View>
  );
}

const styles = StyleSheet.create({
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCell: { width: '48.5%', flexGrow: 1, flexBasis: '45%' },
  kpi: { padding: 14, borderRadius: 20, borderWidth: 1, gap: 8 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chart: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 14 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 120 },
  barCol: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  dashed: { padding: 16, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed' },
  offRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 14, borderRadius: 18, borderWidth: 1 },
});
