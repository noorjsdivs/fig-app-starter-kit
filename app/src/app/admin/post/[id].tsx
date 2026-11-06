import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, AdminInput, FieldLabel, useAdminPadding } from '@/components/admin/admin-ui';
import { AccentButton, OutlineButton } from '@/components/ui/buttons';
import { Chip, Toggle } from '@/components/ui/controls';
import { FloatingBar, goBack } from '@/components/ui/layout';
import { Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { POST_CATS } from '@/data/content';
import { COVERS } from '@/data/images';
import type { Post } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

const NEW_POST: Post = {
  id: '',
  title: '',
  cat: 'Recipes',
  img: COVERS[6],
  author: 'Fig & Fennel Team',
  date: '',
  mins: 3,
  featured: false,
  on: false,
  dish: null,
  likes: 0,
  excerpt: '',
  body: '',
};

export default function AdminEditPost() {
  return (
    <RevealScope>
      <EditPost />
    </RevealScope>
  );
}

function EditPost() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('cta');
  const { id } = useLocalSearchParams<{ id: string }>();
  const menu = useApp((s) => s.menu);
  const [draft, setDraft] = useState<Post>(() => {
    const p = id && id !== 'new' ? useApp.getState().posts.find((x) => x.id === id) : undefined;
    return p ? { ...p } : { ...NEW_POST };
  });
  const set = (o: Partial<Post>) => setDraft((d) => ({ ...d, ...o }));
  const existing = !!draft.id;
  const words = draft.body.trim() ? draft.body.trim().split(/\s+/).length : 0;
  const saveLabel = draft.on ? (existing ? 'Save & publish' : 'Publish story') : 'Save draft';

  const save = () => {
    if (useApp.getState().savePost(draft)) goBack();
  };
  const del = () => {
    useApp.getState().deletePost(draft.id);
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
          <Photo uri={draft.img} radius={22} style={{ height: 170 }} />
        </Reveal>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -16 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 2, gap: 8 }}
        >
          {COVERS.map((img) => {
            const on = draft.img === img;
            return (
              <PressableScale
                key={img}
                onPress={() => set({ img })}
                scaleTo={0.93}
                accessibilityLabel="Cover"
                accessibilityState={{ selected: on }}
                style={[styles.cover, { borderColor: on ? c.accent : 'transparent' }]}
              >
                <Photo uri={img} radius={9} style={StyleSheet.absoluteFill} />
              </PressableScale>
            );
          })}
        </ScrollView>

        <Reveal i={1} style={{ gap: 8 }}>
          <FieldLabel>Headline</FieldLabel>
          <AdminInput value={draft.title} onChangeText={(v) => set({ title: v })} placeholder="A headline guests will want to tap" />
          <FieldLabel>Author</FieldLabel>
          <AdminInput value={draft.author} onChangeText={(v) => set({ author: v })} placeholder="Author name" />
        </Reveal>

        <Reveal i={2} style={{ gap: 8 }}>
          <FieldLabel>Category</FieldLabel>
          <View style={styles.chips}>
            {POST_CATS.map((x) => (
              <Chip key={x} label={x} on={draft.cat === x} onPress={() => set({ cat: x })} height={38} fontSize={13.5} padH={14} />
            ))}
          </View>
        </Reveal>

        <Reveal i={3} style={{ gap: 8 }}>
          <FieldLabel>Summary</FieldLabel>
          <AdminInput
            multiline
            value={draft.excerpt}
            onChangeText={(v) => set({ excerpt: v })}
            placeholder="One or two sentences shown on cards"
            fontSize={14}
            fontWeight={500}
            minHeight={70}
          />
          <FieldLabel
            right={
              <Txt s={12} w={500} color={c.text3}>
                {cnt(words, 'word')}
              </Txt>
            }
          >
            Story
          </FieldLabel>
          <AdminInput
            multiline
            value={draft.body}
            onChangeText={(v) => set({ body: v })}
            placeholder="Write the story. Leave a blank line between paragraphs."
            fontSize={14}
            fontWeight={400}
            minHeight={200}
          />
        </Reveal>

        <Reveal i={4} style={{ gap: 8 }}>
          <FieldLabel>Linked dish</FieldLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 2, gap: 8 }}
          >
            {[{ id: null as string | null, name: 'None' }, ...menu].map((m) => (
              <Chip key={m.id ?? 'none'} label={m.name} on={draft.dish === m.id} onPress={() => set({ dish: m.id })} height={36} fontSize={13} padH={13} />
            ))}
          </ScrollView>
        </Reveal>

        <Reveal i={5} from={{ y: 0, scale: 1 }}>
          <View style={[styles.card, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <SwitchRow title="Published" sub="Visible in the app’s Journal" on={draft.on} onPress={() => set({ on: !draft.on })} border />
            <SwitchRow title="Featured story" sub="Pinned at the top of the Journal" on={draft.featured} onPress={() => set({ featured: !draft.featured })} />
          </View>
        </Reveal>

        {existing ? <OutlineButton label="Delete story" color={c.err} height={48} fontSize={14} onPress={del} /> : null}
      </ScrollView>
      <AdminHeader title={existing ? 'Edit story' : 'New story'} back />
      <FloatingBar>
        <AccentButton label={saveLabel} onPress={save} />
      </FloatingBar>
    </View>
  );
}

function SwitchRow({ title, sub, on, onPress, border }: { title: string; sub: string; on: boolean; onPress: () => void; border?: boolean }) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      style={[styles.switchRow, { borderBottomColor: c.line, borderBottomWidth: border ? 1 : 0 }]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Txt s={14.5} w={700}>
          {title}
        </Txt>
        <Txt s={12} color={c.text3}>
          {sub}
        </Txt>
      </View>
      <Toggle on={on} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  cover: { width: 64, height: 48, borderRadius: 12, borderWidth: 3, overflow: 'hidden' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  switchRow: { minHeight: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
});
