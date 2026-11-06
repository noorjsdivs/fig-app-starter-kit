import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, AdminInput, FieldLabel, openItemEditor, ToggleCardRow, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon } from '@/components/icons/icon';
import { AccentButton } from '@/components/ui/buttons';
import { FloatingBar, goBack } from '@/components/ui/layout';
import { DishImage, Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import type { Brand } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

export default function AdminEditBrand() {
  return (
    <RevealScope>
      <EditBrand />
    </RevealScope>
  );
}

function EditBrand() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('cta');
  const { id } = useLocalSearchParams<{ id: string }>();
  const menu = useApp((s) => s.menu);
  const [draft, setDraft] = useState<Brand>(() => {
    const b = useApp.getState().brands;
    return { ...(b.find((x) => x.id === id) ?? b[0]) };
  });
  const dishes = menu.filter((m) => m.brand === draft.id);

  const save = () => {
    useApp.getState().saveBrand({ ...draft, name: draft.name.trim() || draft.name, tag: draft.tag.trim() });
    goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={[pad, { gap: 10 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <Reveal i={0}>
          <Photo uri={draft.img} radius={22} style={{ height: 150 }} overlay={[fixed.roast(0), fixed.roast(0.75)]}>
            <View style={styles.heroLabel}>
              <Icon name={draft.icon} size={22} fill color={fixed.paper} />
              <Txt s={20} w={600} color={fixed.paper} numberOfLines={1} style={{ flexShrink: 1 }}>
                {draft.name}
              </Txt>
            </View>
          </Photo>
        </Reveal>
        <Reveal i={1} style={{ gap: 8 }}>
          <FieldLabel>Kitchen name</FieldLabel>
          <AdminInput value={draft.name} onChangeText={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="Kitchen name" />
          <FieldLabel>Tagline</FieldLabel>
          <AdminInput value={draft.tag} onChangeText={(v) => setDraft((d) => ({ ...d, tag: v }))} placeholder="Short description" />
        </Reveal>
        <ToggleCardRow title="Live on the app" sub="Shows on Home and in the menu" on={draft.on} onPress={() => setDraft((d) => ({ ...d, on: !d.on }))} />
        <Reveal i={2} from={{ y: 0, scale: 1 }}>
          <Txt s={17} w={600} style={{ marginTop: 6 }}>
            Dishes in this kitchen
          </Txt>
        </Reveal>
        {dishes.map((m) => (
          <PressableScale
            key={m.id}
            onPress={() => openItemEditor(m.id)}
            scaleTo={0.985}
            style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}
          >
            <DishImage uri={m.img} size={44} />
            <Txt s={14} w={600} style={{ flex: 1 }} numberOfLines={1}>
              {m.name}
            </Txt>
            <Txt s={13.5} w={700}>
              {money(m.price)}
            </Txt>
            <Icon name="chevron_right" size={20} color={c.text3} />
          </PressableScale>
        ))}
      </ScrollView>
      <AdminHeader title="Edit kitchen" back />
      <FloatingBar>
        <AccentButton label="Save kitchen" onPress={save} />
      </FloatingBar>
    </View>
  );
}

const styles = StyleSheet.create({
  heroLabel: { position: 'absolute', left: 14, right: 14, bottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 12, borderRadius: 18, borderWidth: 1 },
});
