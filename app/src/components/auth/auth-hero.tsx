import { StyleSheet, View } from 'react-native';

import { CircleButton } from '@/components/ui/buttons';
import { useChrome } from '@/components/ui/layout';
import { Photo } from '@/components/ui/media';
import { Txt } from '@/components/ui/txt';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

/** 270px photo header that fades into the page (Forgot password / Verify code). */
export function AuthHero({ img, eyebrow, title, onBack }: { img: string; eyebrow: string; title: string; onBack: () => void }) {
  const { c } = useTheme();
  const { top } = useChrome();
  return (
    <View style={{ height: 270 + Math.max(0, top - 52) }}>
      <Photo uri={img} style={StyleSheet.absoluteFill} overlay={[fixed.roast(0.4), fixed.roast(0.05), c.bg]} overlayLocations={[0, 0.35, 1]} />
      <CircleButton icon="arrow_back" variant="photo" label="Back" onPress={onBack} style={{ position: 'absolute', top: top + 2, left: 16 }} />
      <View style={styles.text}>
        <Txt s={11} w={700} ls={0.1} upper color={c.accentText}>
          {eyebrow}
        </Txt>
        <Txt s={38} w={600} lh={1} ls={-0.035}>
          {title}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { position: 'absolute', left: 24, right: 24, bottom: 4, gap: 8 },
});
