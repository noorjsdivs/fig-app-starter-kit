import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, openPostEditor, useAdminPadding } from '@/components/admin/admin-ui';
import { AccentButton } from '@/components/ui/buttons';
import { StatusPill, ToggleButton } from '@/components/ui/controls';
import { Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AdminJournal() {
  return (
    <RevealScope>
      <Journal />
    </RevealScope>
  );
}

function Journal() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const posts = useApp((s) => s.posts);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0}>
          <AccentButton label="Write a new story" icon="edit_square" height={52} fontSize={15} onPress={() => openPostEditor(null)} />
        </Reveal>
        {posts.map((p, i) => (
          <Reveal key={p.id} i={1 + Math.min(i, 8)}>
            <PressableScale onPress={() => openPostEditor(p.id)} scaleTo={0.985} style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}>
              <Photo uri={p.img} radius={15} style={styles.thumb} />
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Txt s={14} w={700} lh={1.25} numberOfLines={2}>
                  {p.title}
                </Txt>
                <View style={styles.meta}>
                  <StatusPill label={p.on ? 'Published' : 'Draft'} color={p.on ? c.ok : c.warn} size={9.5} padH={7} padV={2} radius={6} />
                  <Txt s={11.5} color={c.text3} numberOfLines={1} style={{ flexShrink: 1 }}>
                    {p.cat} · {p.date}
                  </Txt>
                </View>
              </View>
              <ToggleButton on={p.on} onPress={() => useApp.getState().togglePost(p.id)} label="Toggle" />
            </PressableScale>
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Journal" back />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 12, borderRadius: 18, borderWidth: 1 },
  thumb: { width: 62, height: 62 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
