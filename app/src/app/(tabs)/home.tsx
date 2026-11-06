import { View } from 'react-native';

import { useChrome } from '@/components/ui/layout';
import { Txt } from '@/components/ui/txt';
import { useTheme } from '@/theme/theme';

/** Placeholder — replaced by the real screen later in the course. */
export default function HomeScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: chrome.contentTop + 6, paddingHorizontal: 20 }}>
      <Txt s={34} w={600} ls={-0.03}>
        Home
      </Txt>
    </View>
  );
}
