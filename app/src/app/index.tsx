import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icons/icon';
import { money } from '@/lib/format';
import { selectCartCount, selectLiveMenu, useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function Index() {
  const { c } = useTheme();
  const dishes = useApp((s) => selectLiveMenu(s).length);
  const count = useApp(selectCartCount);
  const total = useApp((s) => s.totals().cartTotal);
  const add = () => useApp.getState().addToCart({ id: 'pep', s: 1, ex: [], q: 1 }, { silent: true });

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <Icon name="eco" size={48} fill color={c.accent} />
      <Text style={{ fontFamily: family(700), fontSize: 34, color: c.text1 }}>Fig & Fennel</Text>
      <Text style={{ fontFamily: family(500), fontSize: 15, color: c.text2 }}>{dishes} dishes on the menu</Text>
      <Text onPress={add} style={{ fontFamily: family(700), fontSize: 17, color: c.accentText, marginTop: 16 }}>
        Add a pepperoni pizza
      </Text>
      <Text style={{ fontFamily: family(500), fontSize: 15, color: c.text2 }}>
        Cart: {count} · {money(total)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
});
