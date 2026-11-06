import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { openDish } from '@/components/dish-card';
import { browseMenu, EmptyHero, goCheckout } from '@/components/empty-hero';
import { Icon } from '@/components/icons/icon';
import { AccentButton, InkButton } from '@/components/ui/buttons';
import { ProgressBar, Stepper } from '@/components/ui/controls';
import { Card, Divider, SummaryRow, TotalRow, useChrome } from '@/components/ui/layout';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, money } from '@/lib/format';
import { lineMeta, lineUnit } from '@/lib/pricing';
import { useApp } from '@/store/app-store';
import { alpha } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function CartScreen() {
  useStatusBar();
  const { c } = useTheme();
  const chrome = useChrome();
  const s = useApp(
    useShallow((st) => ({
      cart: st.cart,
      promo: st.promo,
      promoDraft: st.promoDraft,
      freeAt: st.freeAt,
      storeOpen: st.storeOpen,
      user: st.user,
      mode: st.mode,
      fee: st.fee,
      speed: st.speed,
      menu: st.menu,
    })),
  );
  const totals = useApp((st) => st.totals)();
  const dishOf = useApp((st) => st.dishOf);
  const [err, setErr] = useState('');
  const promoIn = s.promoDraft;
  const setPromoIn = (v: string) => {
    useApp.getState().setPromoDraft(v.toUpperCase());
    setErr('');
  };

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: chrome.contentTop, paddingBottom: chrome.bottomPad, paddingHorizontal: 20, gap: 12 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Reveal i={0} style={{ paddingTop: 6, gap: 4 }}>
            <Txt s={34} w={600} ls={-0.03}>
              Your cart
            </Txt>
            <Txt s={13.5} w={500} color={c.text3}>
              {cnt(totals.count, 'item')} · Fig & Fennel, SoHo
            </Txt>
          </Reveal>

          {!s.cart.length ? (
            <View style={{ marginHorizontal: 10 }}>
              <EmptyHero
                top={50}
                icon="shopping_bag"
                title="Your cart is empty"
                text="The oven’s already hot. Pick something good."
                cta="Browse the menu"
                onPress={browseMenu}
              />
            </View>
          ) : null}

          {s.cart.map((line, i) => {
            const d = dishOf(line.id);
            return (
              <Reveal key={`${line.id}-${line.s}-${line.ex.join('.')}-${line.deal ? 'd' : ''}`} i={1 + i} from={{ x: 24 }}>
                <View style={[styles.line, { backgroundColor: c.surface1, borderColor: c.line }]}>
                  <PressableScale onPress={() => openDish(line.id)} scaleTo={0.95} accessibilityLabel={d.name}>
                    <DishImage uri={d.img} size={74} />
                  </PressableScale>
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <Txt s={15} w={700} numberOfLines={1}>
                      {d.name}
                    </Txt>
                    <Txt s={12} color={c.text3} numberOfLines={1}>
                      {lineMeta(line, d) || 'Regular'}
                      {line.deal ? (line.dealPct === 100 ? ' · Reward' : ` · Deal −${line.dealPct}%`) : ''}
                    </Txt>
                    <Txt s={16} w={600} color={c.accentText} style={{ marginTop: 2 }}>
                      {money(lineUnit(line, d) * line.q)}
                    </Txt>
                  </View>
                  <Stepper value={line.q} onDec={() => useApp.getState().setQty(i, -1)} onInc={() => useApp.getState().setQty(i, 1)} />
                </View>
              </Reveal>
            );
          })}

          {s.cart.length ? (
            <Reveal i={2} style={{ gap: 12 }}>
              <Card radius={20} style={{ paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="two_wheeler" size={19} fill color={c.accent} />
                  <Txt s={13.5} w={600}>
                    {totals.sub >= s.freeAt ? 'Free delivery unlocked' : `Add ${money(s.freeAt - totals.sub)} more for free delivery`}
                  </Txt>
                </View>
                <ProgressBar pct={Math.min(100, (totals.sub / s.freeAt) * 100)} height={7} gradient />
              </Card>

              {!s.promo ? (
                <View style={{ gap: 6 }}>
                  <View style={[styles.promo, { backgroundColor: c.surface1, borderColor: c.line }]}>
                    <Icon name="sell" size={20} color={c.text3} />
                    <TextInput
                      value={promoIn}
                      onChangeText={setPromoIn}
                      placeholder="Promo code"
                      placeholderTextColor={c.text3}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={() => setErr(useApp.getState().applyPromo(promoIn) ?? '')}
                      style={[styles.promoInput, { color: c.text1, fontFamily: family(600) }]}
                    />
                    <InkButton label="Apply" onPress={() => setErr(useApp.getState().applyPromo(promoIn) ?? '')} />
                  </View>
                  {err ? (
                    <Txt s={12.5} w={600} color={c.err} style={{ paddingLeft: 16 }}>
                      {err}
                    </Txt>
                  ) : null}
                </View>
              ) : (
                <View style={[styles.applied, { backgroundColor: alpha(c.ok, 0.12) }]}>
                  <Icon name="check_circle" size={20} fill color={c.ok} />
                  <Txt s={14} w={700} style={{ flex: 1 }}>
                    {s.promo.code} · {s.promo.pct}% off
                  </Txt>
                  <PressableScale
                    onPress={() => useApp.getState().removePromo()}
                    scaleTo={0.95}
                    style={{ height: 36, paddingHorizontal: 12, justifyContent: 'center' }}
                  >
                    <Txt s={13} w={600} color={c.text2}>
                      Remove
                    </Txt>
                  </PressableScale>
                </View>
              )}

              <Card style={{ padding: 16, gap: 10 }}>
                <SummaryRow label="Subtotal" value={money(totals.sub)} />
                <SummaryRow label="Delivery" value={totals.fee ? money(totals.fee) : 'Free'} />
                {s.promo ? <SummaryRow label="Discount" value={'−' + money(totals.disc)} valueColor={c.ok} /> : null}
                <Divider />
                <TotalRow value={money(totals.cartTotal)} />
              </Card>

              <AccentButton height={58} glow dim={!s.storeOpen} onPress={goCheckout} contentStyle={styles.ckContent} accessibilityLabel="Checkout">
                <Txt s={16.5} w={700} color="#FFFFFF">
                  {!s.storeOpen ? 'Kitchen closed' : s.user ? 'Go to checkout' : 'Sign in to checkout'}
                </Txt>
                <View style={styles.ckPill}>
                  <Txt s={15} w={700} color="#FFFFFF">
                    {money(totals.cartTotal)}
                  </Txt>
                  <Icon name="arrow_forward" size={18} color="#FFFFFF" />
                </View>
              </AccentButton>
            </Reveal>
          ) : null}
        </ScrollView>
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 22, borderWidth: 1 },
  promo: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 6, paddingLeft: 16, borderRadius: 22, borderWidth: 1 },
  promoInput: { flex: 1, minWidth: 0, fontSize: 14.5, letterSpacing: 0.58, paddingVertical: 0, height: 42 },
  applied: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingLeft: 16, paddingRight: 8, borderRadius: 20 },
  ckContent: { justifyContent: 'space-between', paddingLeft: 24, paddingRight: 10 },
  ckPill: { height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.14)', flexDirection: 'row', alignItems: 'center', gap: 6 },
});
