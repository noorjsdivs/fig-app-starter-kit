import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, AdminInput, FieldLabel, ToggleCardRow, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon } from '@/components/icons/icon';
import { AccentButton, OutlineButton } from '@/components/ui/buttons';
import { Chip } from '@/components/ui/controls';
import { Glass } from '@/components/ui/glass';
import { FloatingBar, goBack } from '@/components/ui/layout';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { COVERS } from '@/data/images';
import { CAT_IMG, TAGS } from '@/data/menu';
import { useStatusBar } from '@/hooks/use-status-bar';
import { money } from '@/lib/format';
import { useApp, type ItemDraft } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AdminEditItem() {
  return (
    <RevealScope>
      <EditItem />
    </RevealScope>
  );
}

function EditItem() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('cta');
  const { id } = useLocalSearchParams<{ id: string }>();
  const menu = useApp((s) => s.menu);
  const cats = useApp((s) => s.cats);
  const brands = useApp((s) => s.brands);
  const [draft, setDraft] = useState<ItemDraft>(() => {
    const p = id && id !== 'new' ? useApp.getState().menu.find((m) => m.id === id) : undefined;
    return p
      ? { id: p.id, name: p.name, price: p.price, cat: p.cat, brand: p.brand, tag: p.tag || 'None', avail: p.avail, img: p.img }
      : { id: null, name: '', price: 12, cat: 'Pizza', brand: 'fire', tag: 'New', avail: true, img: CAT_IMG.Pizza };
  });
  const set = (o: Partial<ItemDraft>) => setDraft((d) => ({ ...d, ...o }));
  const catImg = (cat: string) => menu.find((m) => m.cat === cat)?.img ?? CAT_IMG[cat] ?? COVERS[6];
  const img = draft.id ? draft.img : catImg(draft.cat);
  const existing = !!draft.id;

  const save = () => {
    if (useApp.getState().saveItem({ ...draft, img })) goBack();
  };
  const del = () => {
    if (!draft.id) return;
    useApp.getState().deleteItem(draft.id);
    goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={[pad, { gap: 14 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <Reveal i={0}>
          <View style={styles.hero}>
            <DishImage uri={img} />
            <PressableScale
              onPress={() => useApp.getState().showToast('Photo picker', 'Choose from library or camera', 'photo_camera')}
              scaleTo={0.95}
              style={styles.replace}
            >
              <Glass style={styles.replaceInner}>
                <Icon name="photo_camera" size={17} />
                <Txt s={12.5} w={600}>
                  Replace photo
                </Txt>
              </Glass>
            </PressableScale>
          </View>
        </Reveal>

        <Reveal i={1} style={{ gap: 8 }}>
          <FieldLabel>Dish name</FieldLabel>
          <AdminInput value={draft.name} onChangeText={(v) => set({ name: v })} placeholder="e.g. Nduja & Burrata" returnKeyType="done" />
        </Reveal>

        <Reveal i={2}>
          <View style={[styles.price, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <View style={{ gap: 2 }}>
              <Txt s={12} w={600} ls={0.06} upper color={c.text3}>
                Base price
              </Txt>
              <Txt s={24} w={600}>
                {money(draft.price)}
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <RoundBtn icon="remove" label="Lower" onPress={() => set({ price: Math.max(1, Math.round((draft.price - 0.5) * 100) / 100) })} />
              <RoundBtn icon="add" label="Raise" onPress={() => set({ price: Math.round((draft.price + 0.5) * 100) / 100 })} />
            </View>
          </View>
        </Reveal>

        <Reveal i={3} style={{ gap: 8 }}>
          <FieldLabel>Category</FieldLabel>
          <View style={styles.chips}>
            {cats.map((x) => (
              <Chip key={x.name} label={x.name} on={draft.cat === x.name} onPress={() => set({ cat: x.name })} height={38} fontSize={13.5} padH={14} />
            ))}
          </View>
        </Reveal>

        <Reveal i={3} style={{ gap: 8 }}>
          <FieldLabel>Kitchen</FieldLabel>
          <View style={styles.chips}>
            {brands.map((b) => (
              <Chip key={b.id} label={b.name} on={draft.brand === b.id} onPress={() => set({ brand: b.id })} height={38} fontSize={13.5} padH={14} />
            ))}
          </View>
        </Reveal>

        <Reveal i={4} style={{ gap: 8 }}>
          <FieldLabel>Badge</FieldLabel>
          <View style={styles.chips}>
            {TAGS.map((t) => (
              <Chip key={t} label={t} on={draft.tag === t} onPress={() => set({ tag: t })} height={38} fontSize={13.5} padH={14} />
            ))}
          </View>
        </Reveal>

        <Reveal i={5}>
          <ToggleCardRow
            title="Available"
            sub={draft.avail ? 'Available tonight' : '86’d · hidden from ordering'}
            on={draft.avail}
            onPress={() => set({ avail: !draft.avail })}
          />
        </Reveal>

        {existing ? <OutlineButton label="Delete item" color={c.err} height={48} fontSize={14} onPress={del} /> : null}
      </ScrollView>
      <AdminHeader title={existing ? 'Edit item' : 'New item'} back />
      <FloatingBar>
        <AccentButton label={existing ? 'Save changes' : 'Add to menu'} onPress={save} />
      </FloatingBar>
    </View>
  );
}

function RoundBtn({ icon, label, onPress }: { icon: 'add' | 'remove'; label: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <PressableScale onPress={onPress} scaleTo={0.9} accessibilityLabel={label} style={[styles.round, { borderColor: c.line, backgroundColor: c.surface2 }]}>
      <Icon name={icon} size={20} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hero: { height: 170, borderRadius: 22, overflow: 'hidden' },
  replace: { position: 'absolute', left: 10, bottom: 10 },
  replaceInner: { height: 34, paddingHorizontal: 12, borderRadius: 17, flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  round: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
