import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, ReorderButtons, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon } from '@/components/icons/icon';
import { Toggle, ToggleButton, ValueStepper } from '@/components/ui/controls';
import { DishImage, Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AdminHomeSections() {
  return (
    <RevealScope>
      <HomeSections />
    </RevealScope>
  );
}

function HomeSections() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const secs = useApp((s) => s.secs);
  const banners = useApp((s) => s.banners);
  const deal = useApp((s) => s.deal);
  const menu = useApp((s) => s.menu);
  const st = useApp.getState;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0} from={{ y: 0, scale: 1 }}>
          <Txt s={17} w={600}>
            Home sections
          </Txt>
        </Reveal>
        <Txt s={12.5} w={500} color={c.text3} style={{ marginTop: -4 }}>
          Reorder or hide sections. Changes show on the customer Home instantly.
        </Txt>
        <Reveal i={0}>
          <View style={[styles.card, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            {secs.map((x, i) => (
              <View key={x.k} style={[styles.secRow, { borderBottomColor: c.line, borderBottomWidth: i < secs.length - 1 ? 1 : 0 }]}>
                <ReorderButtons first={i === 0} last={i === secs.length - 1} onUp={() => st().moveSection(i, -1)} onDown={() => st().moveSection(i, 1)} />
                <View style={[styles.secIcon, { backgroundColor: c.accentSoft }]}>
                  <Icon name={x.icon} size={19} fill color={c.accentText} />
                </View>
                <Txt s={14} w={600} color={x.on ? c.text1 : c.text3} style={{ flex: 1 }}>
                  {x.l}
                </Txt>
                <ToggleButton on={x.on} onPress={() => st().toggleSection(x.k)} label="Toggle" />
              </View>
            ))}
          </View>
        </Reveal>

        <Reveal i={1} from={{ y: 0, scale: 1 }}>
          <Txt s={17} w={600} style={{ marginTop: 10 }}>
            Deal of the day
          </Txt>
        </Reveal>
        <Reveal i={1}>
          <View style={[styles.deal, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <PressableScale
              onPress={() => st().setDeal({ on: !deal.on })}
              scaleTo={0.985}
              style={styles.between}
              accessibilityRole="switch"
              accessibilityState={{ checked: deal.on }}
            >
              <Txt s={14.5} w={700}>
                Show the deal on Home
              </Txt>
              <Toggle on={deal.on} />
            </PressableScale>
            <View style={styles.between}>
              <Txt s={13.5} w={600} color={c.text2}>
                Discount
              </Txt>
              <ValueStepper
                label={`${deal.pct}% off`}
                size={38}
                minWidth={70}
                fontSize={16}
                display
                color={c.accentText}
                onDec={() => st().setDeal({ pct: Math.max(5, deal.pct - 5) })}
                onInc={() => st().setDeal({ pct: Math.min(50, deal.pct + 5) })}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -14 }}
              contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 2, gap: 8 }}
            >
              {menu.map((m) => {
                const on = deal.id === m.id;
                return (
                  <PressableScale
                    key={m.id}
                    onPress={() => st().setDeal({ id: m.id })}
                    scaleTo={0.92}
                    accessibilityLabel={m.name}
                    accessibilityState={{ selected: on }}
                  >
                    <DishImage uri={m.img} size={62} ring={{ width: 3, color: on ? c.accent : 'transparent' }} />
                  </PressableScale>
                );
              })}
            </ScrollView>
          </View>
        </Reveal>

        <Reveal i={2} from={{ y: 0, scale: 1 }}>
          <Txt s={17} w={600} style={{ marginTop: 10 }}>
            Promo banners
          </Txt>
        </Reveal>
        {banners.map((b, i) => (
          <View key={b.id} style={[styles.banRow, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <ReorderButtons first={i === 0} last={i === banners.length - 1} onUp={() => st().moveBanner(i, -1)} onDown={() => st().moveBanner(i, 1)} />
            <Photo uri={b.img} radius={12} style={{ width: 78, height: 52, opacity: b.on ? 1 : 0.4 }} />
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Txt s={13.5} w={700} lh={1.25} numberOfLines={2}>
                {b.title}
              </Txt>
              <Txt s={11.5} color={c.text3} numberOfLines={1}>
                {b.eb}
              </Txt>
            </View>
            <ToggleButton on={b.on} onPress={() => st().toggleBanner(b.id)} label="Toggle" />
          </View>
        ))}
      </ScrollView>
      <AdminHeader title="Home & banners" back />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  secRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, paddingHorizontal: 12 },
  secIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  deal: { padding: 14, borderRadius: 20, borderWidth: 1, gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  banRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 12, borderRadius: 18, borderWidth: 1 },
});
