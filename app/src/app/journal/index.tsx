import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { PhotoGlass } from '@/components/account/photo-glass';
import { Chip } from '@/components/ui/controls';
import { ScreenHeader, useChrome } from '@/components/ui/layout';
import { Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { POST_CATS } from '@/data/content';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

const openPost = (id: string) => router.push({ pathname: '/journal/[id]', params: { id } });

export default function JournalScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const posts = useApp((s) => s.posts);
  const [cat, setCat] = useState('All');

  const f = posts.filter((p) => p.on && (cat === 'All' || p.cat === cat));
  const feat = f.find((p) => p.featured) ?? f[0];
  const rest = f.filter((p) => p !== feat);

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: 40, gap: 14 }}
        >
          <Reveal i={0} style={{ gap: 4 }}>
            <Txt s={34} w={600} lh={1.05} ls={-0.03}>
              Stories from the pass
            </Txt>
            <Txt s={14} lh={1.5} color={c.text2}>
              Recipes, kitchen notes and news from the Fig team.
            </Txt>
          </Reveal>
          <Reveal i={0}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20 }}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
              {['All', ...POST_CATS].map((x) => (
                <Chip key={x} label={x} on={cat === x} height={38} fontSize={13.5} padH={15} onPress={() => setCat(x)} />
              ))}
            </ScrollView>
          </Reveal>

          {!f.length ? (
            <Txt s={14.5} w={500} color={c.text2} align="center" style={{ paddingVertical: 40 }}>
              No stories in this category yet.
            </Txt>
          ) : null}

          {feat ? (
            <Reveal i={1} replay={cat}>
              <PressableScale scaleTo={0.98} onPress={() => openPost(feat.id)}>
                <Photo
                  uri={feat.img}
                  radius={28}
                  style={{ height: 340 }}
                  overlay={[fixed.roast(0), fixed.roast(0), fixed.roast(0.88)]}
                  overlayLocations={[0, 0.3, 1]}
                >
                  <View style={styles.badges}>
                    <View style={styles.featured}>
                      <Txt s={10.5} w={700} ls={0.08} upper color="#FFFFFF">
                        Featured
                      </Txt>
                    </View>
                    <PhotoGlass border={0.22} style={styles.catPill}>
                      <Txt s={10.5} w={700} ls={0.08} upper color={fixed.paper}>
                        {feat.cat}
                      </Txt>
                    </PhotoGlass>
                  </View>
                  <View style={styles.featText}>
                    <Txt s={26} w={600} lh={1.05} ls={-0.025} color={fixed.paper}>
                      {feat.title}
                    </Txt>
                    <Txt s={13.5} lh={1.45} color={fixed.paperA(0.82)}>
                      {feat.excerpt}
                    </Txt>
                    <Txt s={12} w={600} color={fixed.paperA(0.7)}>
                      {feat.author} · {feat.date} · {feat.mins} min read
                    </Txt>
                  </View>
                </Photo>
              </PressableScale>
            </Reveal>
          ) : null}

          {rest.map((p, i) => (
            <Reveal key={p.id} i={2 + i} replay={cat}>
              <PressableScale scaleTo={0.98} onPress={() => openPost(p.id)} style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}>
                <Photo uri={p.img} radius={16} style={{ width: 96, height: 96 }} />
                <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                  <Txt s={10.5} w={700} ls={0.08} upper color={c.accentText}>
                    {p.cat}
                  </Txt>
                  <Txt s={15.5} w={600} lh={1.2} ls={-0.01} numberOfLines={2}>
                    {p.title}
                  </Txt>
                  <Txt s={11.5} w={500} color={c.text3}>
                    {p.date} · {p.mins} min read
                  </Txt>
                </View>
              </PressableScale>
            </Reveal>
          ))}
        </ScrollView>
        <ScreenHeader title="The Fig Journal" titleIcon="auto_stories" />
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  badges: { position: 'absolute', left: 14, top: 14, flexDirection: 'row', gap: 6 },
  featured: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9, backgroundColor: fixed.orange },
  catPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9 },
  featText: { position: 'absolute', left: 18, right: 18, bottom: 18, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8, paddingLeft: 8, paddingRight: 12, borderRadius: 22, borderWidth: 1 },
});
