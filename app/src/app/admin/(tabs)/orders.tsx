import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, OrderRow, useAdminPadding } from '@/components/admin/admin-ui';
import { chipColors } from '@/components/ui/controls';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { CUSTOMERS, STATUS } from '@/data/seed';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

const custName = (id: string) => (CUSTOMERS.find((c) => c.id === id) ?? CUSTOMERS[0]).name;
const FILTERS: [string, string][] = [['all', 'All'], ...STATUS.map((s, i): [string, string] => [String(i), s])];

export default function AdminOrders() {
  return (
    <RevealScope>
      <Orders />
    </RevealScope>
  );
}

function Orders() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('tab');
  const orders = useApp((s) => s.orders);
  const [filter, setFilter] = useState('all');
  const list = orders.filter((o) => filter === 'all' || o.step === Number(filter));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4, gap: 8 }}
          >
            {FILTERS.map(([k, label]) => {
              const on = filter === k;
              const col = chipColors(on, c);
              const n = k === 'all' ? orders.length : orders.filter((o) => o.step === Number(k)).length;
              return (
                <PressableScale
                  key={k}
                  onPress={() => setFilter(k)}
                  scaleTo={0.94}
                  style={[styles.chip, { borderColor: col.bd, backgroundColor: col.bg }]}
                  accessibilityState={{ selected: on }}
                >
                  <Txt s={13.5} w={600} color={col.fg}>
                    {label}
                  </Txt>
                  <View style={[styles.count, { backgroundColor: on ? c.accentInk : c.surface2 }]}>
                    <Txt s={11.5} w={700} color={on ? c.accent : c.text2}>
                      {n}
                    </Txt>
                  </View>
                </PressableScale>
              );
            })}
          </ScrollView>
        </Reveal>
        {!list.length ? (
          <Txt s={14} w={500} color={c.text3} align="center" style={{ padding: 30 }}>
            No orders with this status.
          </Txt>
        ) : null}
        {list.map((o, i) => (
          <Reveal key={o.no} i={2 + i} replay={filter}>
            <OrderRow order={o} customer={custName(o.cid)} />
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { height: 38, paddingLeft: 14, paddingRight: 6, borderRadius: 19, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { minWidth: 24, height: 26, paddingHorizontal: 6, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
