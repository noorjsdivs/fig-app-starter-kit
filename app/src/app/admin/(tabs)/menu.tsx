import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AccentPill, AdminHeader, openItemEditor, SearchField, useAdminPadding } from '@/components/admin/admin-ui';
import { ToggleButton } from '@/components/ui/controls';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AdminMenu() {
  return (
    <RevealScope>
      <MenuItems />
    </RevealScope>
  );
}

function MenuItems() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('tab');
  const menu = useApp((s) => s.menu);
  const toggleAvail = useApp((s) => s.toggleAvail);
  const [mq, setMq] = useState('');
  const q = mq.trim().toLowerCase();
  const off = menu.filter((m) => !m.avail).length;
  const list = menu.filter((m) => !q || `${m.name} ${m.cat}`.toLowerCase().includes(q));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={[pad, { gap: 10 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Reveal i={0} style={{ flexDirection: 'row', gap: 8 }}>
          <SearchField value={mq} onChangeText={setMq} placeholder="Search dishes" />
          <AccentPill label="New" onPress={() => openItemEditor(null)} />
        </Reveal>
        <Reveal i={1} from={{ y: 0, scale: 1 }}>
          <Txt s={12.5} w={600} color={c.text3} style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
            {cnt(menu.length, 'item')} · {menu.length - off} live
          </Txt>
        </Reveal>
        {list.map((m, i) => (
          <Reveal key={m.id} i={2 + Math.min(i, 12)}>
            <PressableScale onPress={() => openItemEditor(m.id)} scaleTo={0.985} style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}>
              <DishImage uri={m.img} size={52} opacity={m.avail ? 1 : 0.45} />
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Txt s={14.5} w={700} color={m.avail ? c.text1 : c.text3} numberOfLines={1}>
                  {m.name}
                </Txt>
                <Txt s={12} color={c.text3} numberOfLines={1}>
                  {m.cat}
                  {m.tag ? ` · ${m.tag}` : ''} · {money(m.price)}
                </Txt>
              </View>
              <ToggleButton on={m.avail} onPress={() => toggleAvail(m.id)} label="Availability" />
            </PressableScale>
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Menu items" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 14, borderRadius: 18, borderWidth: 1 },
});
