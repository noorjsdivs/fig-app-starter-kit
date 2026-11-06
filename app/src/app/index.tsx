import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AccentButton, OutlineButton } from '@/components/ui/buttons';
import { Chip, ToggleButton } from '@/components/ui/controls';
import { Card, Eyebrow, FloatingBar, ListCard, ListRow, SectionHead, useChrome } from '@/components/ui/layout';
import { DishImage } from '@/components/ui/media';
import { Sheet } from '@/components/ui/overlays';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { MENU } from '@/data/menu';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

/** The scratch screen grows: images, rows, a sheet and a toast. */
export default function Index() {
  const { c } = useTheme();
  const chrome = useChrome();
  const [sheet, setSheet] = useState(false);
  const [veg, setVeg] = useState(false);

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={{ paddingTop: chrome.contentTop, paddingBottom: chrome.bottomPad, gap: 16 }}>
          <Reveal i={0} style={{ paddingHorizontal: 20 }}>
            <Txt s={34} w={600} ls={-0.03}>
              UI kit
            </Txt>
          </Reveal>
          <SectionHead title="Plated" right={<Eyebrow>dish photos</Eyebrow>} />
          <Reveal i={1} style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20 }}>
            {MENU.slice(0, 4).map((m) => (
              <DishImage key={m.id} uri={m.img} size={74} />
            ))}
          </Reveal>
          <Reveal i={2} style={{ paddingHorizontal: 20 }}>
            <ListCard>
              <ListRow icon="receipt_long" title="My orders" sub="2 past orders" onPress={() => undefined} />
              <ListRow icon="settings" title="Settings" sub="Language, notifications" onPress={() => undefined} last />
            </ListCard>
          </Reveal>
          <Reveal i={3} style={{ paddingHorizontal: 20 }}>
            <Card style={{ padding: 16, gap: 10 }}>
              <OutlineButton label="Open a sheet" onPress={() => setSheet(true)} />
              <OutlineButton label="Show a toast" onPress={() => useApp.getState().showToast('Added to cart', 'Hot Honey Pepperoni', 'shopping_bag')} />
            </Card>
          </Reveal>
        </ScrollView>
        <FloatingBar>
          <AccentButton label="Pay $17.49" icon="lock" iconFill />
        </FloatingBar>
        <Sheet visible={sheet} onClose={() => setSheet(false)} title="Filters" subtitle="A bottom sheet">
          <Chip label="Vegetarian" icon="eco" on={veg} onPress={() => setVeg(!veg)} />
          <ToggleButton on={veg} onPress={() => setVeg(!veg)} label="Vegetarian" />
        </Sheet>
      </View>
    </RevealScope>
  );
}
