import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AccentPill, AdminHeader, ReorderButtons, useAdminPadding } from '@/components/admin/admin-ui';
import { ToggleButton } from '@/components/ui/controls';
import { DishImage } from '@/components/ui/media';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { COVERS } from '@/data/images';
import { CAT_IMG } from '@/data/menu';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function AdminCategories() {
  return (
    <RevealScope>
      <Categories />
    </RevealScope>
  );
}

function Categories() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const cats = useApp((s) => s.cats);
  const menu = useApp((s) => s.menu);
  const [ncat, setNcat] = useState('');
  const catImg = (name: string) => menu.find((m) => m.cat === name)?.img ?? CAT_IMG[name] ?? COVERS[6];

  const add = () => {
    if (useApp.getState().addCat(ncat)) setNcat('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={[pad, { gap: 10 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Reveal i={0} style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={ncat}
            onChangeText={setNcat}
            placeholder="New category name"
            placeholderTextColor={c.text3}
            selectionColor={c.accent}
            returnKeyType="done"
            onSubmitEditing={add}
            style={[styles.input, { borderColor: c.line, backgroundColor: c.surface1, color: c.text1, fontFamily: family(500) }]}
          />
          <AccentPill label="Add" onPress={add} />
        </Reveal>
        <Txt s={12.5} w={500} color={c.text3} style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
          Order here sets the order on Home and Menu. Hidden categories disappear for customers.
        </Txt>
        {cats.map((x, i) => (
          <Reveal key={x.name} i={1 + Math.min(i, 8)}>
            <View style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}>
              <ReorderButtons
                first={i === 0}
                last={i === cats.length - 1}
                onUp={() => useApp.getState().moveCat(i, -1)}
                onDown={() => useApp.getState().moveCat(i, 1)}
              />
              <DishImage uri={catImg(x.name)} size={46} opacity={x.on ? 1 : 0.4} />
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Txt s={14.5} w={700} color={x.on ? c.text1 : c.text3}>
                  {x.name}
                </Txt>
                <Txt s={12} color={c.text3}>
                  {cnt(menu.filter((m) => m.cat === x.name).length, 'dish')}
                </Txt>
              </View>
              <ToggleButton on={x.on} onPress={() => useApp.getState().toggleCat(x.name)} label="Toggle" />
            </View>
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Categories" back />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { flex: 1, minWidth: 0, height: 48, borderRadius: 24, borderWidth: 1, paddingHorizontal: 16, fontSize: 14.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 12, borderRadius: 18, borderWidth: 1 },
});
