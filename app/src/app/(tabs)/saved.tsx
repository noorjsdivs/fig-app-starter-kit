import { ScrollView, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { DishGrid } from '@/components/dish-card';
import { browseMenu, EmptyHero } from '@/components/empty-hero';
import { useChrome } from '@/components/ui/layout';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import type { Dish } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt } from '@/lib/format';
import { selectLiveMenu, useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function SavedScreen() {
  useStatusBar();
  const { c } = useTheme();
  const chrome = useChrome();
  const savedIds = useApp((s) => s.saved);
  const live = useApp(useShallow(selectLiveMenu));
  const list = savedIds.map((id) => live.find((m) => m.id === id)).filter((d): d is Dish => !!d);

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={{ paddingTop: chrome.contentTop, paddingBottom: chrome.bottomPad }} showsVerticalScrollIndicator={false}>
          <Reveal i={0} style={{ paddingTop: 6, paddingHorizontal: 20, gap: 4 }}>
            <Txt s={34} w={600} ls={-0.03}>
              Saved
            </Txt>
            <Txt s={13.5} w={500} color={c.text3}>
              {cnt(savedIds.length, 'dish')}
            </Txt>
          </Reveal>
          {!savedIds.length ? (
            <View style={{ marginHorizontal: 30 }}>
              <EmptyHero
                icon="favorite"
                fill
                title="Nothing saved yet"
                text="Tap the heart on any dish to keep it here for next time."
                cta="Browse the menu"
                onPress={browseMenu}
              />
            </View>
          ) : null}
          <DishGrid dishes={list} compact style={{ paddingTop: 16 }} />
        </ScrollView>
      </View>
    </RevealScope>
  );
}
