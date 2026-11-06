import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, ToggleCardRow, useAdminPadding } from '@/components/admin/admin-ui';
import { Toggle, ValueStepper } from '@/components/ui/controls';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AdminSettings() {
  return (
    <RevealScope>
      <Settings />
    </RevealScope>
  );
}

function Settings() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const storeOpen = useApp((s) => s.storeOpen);
  const prep = useApp((s) => s.prep);
  const fee = useApp((s) => s.fee);
  const freeAt = useApp((s) => s.freeAt);
  const sound = useApp((s) => s.sound);
  const setStore = useApp((s) => s.setStore);

  const rows: { l: string; s: string; v: string; dec: () => void; inc: () => void }[] = [
    {
      l: 'Prep time',
      s: 'Shown to customers as ETA',
      v: `${prep} min`,
      dec: () => setStore({ prep: Math.max(6, prep - 2) }),
      inc: () => setStore({ prep: Math.min(60, prep + 2) }),
    },
    {
      l: 'Delivery fee',
      s: 'Charged below the free threshold',
      v: money(fee),
      dec: () => setStore({ fee: Math.max(0, Math.round((fee - 0.5) * 100) / 100) }),
      inc: () => setStore({ fee: Math.round((fee + 0.5) * 100) / 100 }),
    },
    {
      l: 'Free delivery from',
      s: 'Cart subtotal',
      v: money(freeAt),
      dec: () => setStore({ freeAt: Math.max(10, freeAt - 5) }),
      inc: () => setStore({ freeAt: freeAt + 5 }),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 12 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0}>
          <ToggleCardRow
            title="Accepting orders"
            sub={storeOpen ? `Taking orders · ~${prep} min prep` : 'New orders paused'}
            on={storeOpen}
            onPress={() => useApp.getState().toggleStoreOpen()}
          />
        </Reveal>
        <Reveal i={1}>
          <View style={[styles.card, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            {rows.map((r, i) => (
              <View key={r.l} style={[styles.row, { borderBottomColor: c.line, borderBottomWidth: i < rows.length - 1 ? 1 : 0 }]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt s={14.5} w={700}>
                    {r.l}
                  </Txt>
                  <Txt s={12} color={c.text3}>
                    {r.s}
                  </Txt>
                </View>
                <ValueStepper label={r.v} onDec={r.dec} onInc={r.inc} />
              </View>
            ))}
          </View>
        </Reveal>
        <Reveal i={2}>
          <View style={[styles.card, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <PressableScale
              onPress={() => setStore({ sound: !sound })}
              scaleTo={0.985}
              accessibilityRole="switch"
              accessibilityState={{ checked: sound }}
              style={styles.chime}
            >
              <Txt s={14.5} w={700}>
                New‑order chime
              </Txt>
              <Toggle on={sound} />
            </PressableScale>
          </View>
        </Reveal>
      </ScrollView>
      <AdminHeader title="Settings" back />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 10, paddingRight: 10, paddingLeft: 16 },
  chime: { minHeight: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
