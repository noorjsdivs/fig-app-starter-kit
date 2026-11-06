import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icons/icon';
import { AccentButton } from '@/components/ui/buttons';
import { Reveal } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

/** 84px accent circle + title + copy + CTA (Saved / Cart / My reservations empty states). */
export function EmptyHero({
  icon,
  fill,
  title,
  text,
  cta,
  onPress,
  top = 60,
}: {
  icon: IconName;
  fill?: boolean;
  title: string;
  text: string;
  cta: string;
  onPress: () => void;
  top?: number;
}) {
  const { c } = useTheme();
  return (
    <Reveal i={1} style={[styles.empty, { marginTop: top }]}>
      <View style={[styles.emptyIcon, { backgroundColor: c.accentSoft }]}>
        <Icon name={icon} size={38} fill={fill} color={c.accent} />
      </View>
      <Txt s={22} w={600} ls={-0.02} align="center">
        {title}
      </Txt>
      <Txt s={14.5} lh={1.5} color={c.text2} align="center">
        {text}
      </Txt>
      <AccentButton label={cta} height={50} fontSize={15} onPress={onPress} style={{ marginTop: 8, alignSelf: 'center', paddingHorizontal: 24 }} />
    </Reveal>
  );
}

export const browseMenu = () => {
  useApp.getState().setMenuCat('All', null);
  router.navigate('/menu');
};

const styles = StyleSheet.create({
  empty: { alignItems: 'center', gap: 10 },
  emptyIcon: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
});

/** Cart → checkout gate: kitchen closed → toast, guest → login, else checkout. */
export const goCheckout = () => {
  const r = useApp.getState().canCheckout();
  if (r === 'auth') router.push('/login');
  else if (r === 'ok') router.push('/checkout');
};
