import { ScrollView, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { DishGrid } from '@/components/dish-card';
import { useChrome } from '@/components/ui/layout';
import { RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { selectLiveMenu, useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

/** A first Home: every live dish in the grid. The real sections replace this next. */
export default function HomeScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  const dishes = useApp(useShallow(selectLiveMenu));
  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={{ paddingTop: chrome.contentTop, paddingBottom: chrome.bottomPad, gap: 12 }}>
          <Txt s={34} w={600} ls={-0.03} style={{ paddingHorizontal: 20, paddingTop: 6 }}>
            Home
          </Txt>
          <DishGrid dishes={dishes} />
        </ScrollView>
      </View>
    </RevealScope>
  );
}
