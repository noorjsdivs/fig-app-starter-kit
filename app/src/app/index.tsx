import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icons/icon';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function Index() {
  const { c } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <Icon name="eco" size={48} fill color={c.accent} />
      <Text style={{ fontFamily: family(700), fontSize: 34, color: c.text1 }}>Fig & Fennel</Text>
      <Text style={{ fontFamily: family(500), fontSize: 15, color: c.text2 }}>Fresh food, made easy</Text>
      <View style={styles.row}>
        <Icon name="home" size={28} fill color={c.accentText} />
        <Icon name="restaurant_menu" size={28} />
        <Icon name="favorite" size={28} />
        <Icon name="shopping_bag" size={28} />
        <Icon name="person" size={28} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  row: { flexDirection: 'row', gap: 18, marginTop: 18 },
});
