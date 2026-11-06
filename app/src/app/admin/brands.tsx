import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, openBrandEditor, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon } from '@/components/icons/icon';
import { ToggleButton } from '@/components/ui/controls';
import { Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

export default function AdminBrands() {
  return (
    <RevealScope>
      <Brands />
    </RevealScope>
  );
}

function Brands() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const brands = useApp((s) => s.brands);
  const menu = useApp((s) => s.menu);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0} from={{ y: 0, scale: 1 }}>
          <Txt s={12.5} w={500} color={c.text3} style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
            Each kitchen is a brand on the Home screen. Turning one off hides all its dishes.
          </Txt>
        </Reveal>
        {brands.map((b, i) => (
          <Reveal key={b.id} i={Math.min(i, 8)}>
            <PressableScale onPress={() => openBrandEditor(b.id)} scaleTo={0.985} style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}>
              <Photo uri={b.img} radius={16} style={[styles.tile, { opacity: b.on ? 1 : 0.4 }]}>
                <View style={styles.badge}>
                  <Icon name={b.icon} size={15} fill color="#FFFFFF" />
                </View>
              </Photo>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Txt s={14.5} w={700}>
                  {b.name}
                </Txt>
                <Txt s={12} color={c.text3} numberOfLines={1}>
                  {b.tag} · {cnt(menu.filter((m) => m.brand === b.id).length, 'dish')}
                </Txt>
              </View>
              <ToggleButton on={b.on} onPress={() => useApp.getState().toggleBrand(b.id)} label="Toggle" />
            </PressableScale>
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Kitchens & brands" back />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 12, borderRadius: 18, borderWidth: 1 },
  tile: { width: 60, height: 60 },
  badge: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: fixed.roast(0.6),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
