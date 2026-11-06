import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Icon, type IconName } from '@/components/icons/icon';
import { AccentButton, LinkButton } from '@/components/ui/buttons';
import { Radio } from '@/components/ui/controls';
import { Card, Divider, FloatingBar, ScreenHeader, SummaryRow, TotalRow, useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, money } from '@/lib/format';
import { SPEEDS } from '@/lib/pricing';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function CheckoutScreen() {
  return (
    <RevealScope>
      <Checkout />
    </RevealScope>
  );
}

function Checkout() {
  useStatusBar();
  const { c } = useTheme();
  const chrome = useChrome();
  const s = useApp(
    useShallow((st) => ({
      mode: st.mode,
      prep: st.prep,
      addr: st.addrs[st.addr] ?? st.addrs[0],
      speed: st.speed,
      payM: st.payM,
      note: st.note,
      cart: st.cart,
      promo: st.promo,
      fee: st.fee,
      freeAt: st.freeAt,
      card: st.cards.find((k) => k.id === st.defCard),
    })),
  );
  const t = useApp((st) => st.totals)();
  const [paying, setPaying] = useState(false);
  const set = useApp((st) => st.setCheckout);

  useEffect(() => {
    if (!paying) return;
    const id = setTimeout(() => {
      const no = useApp.getState().placeOrder();
      setPaying(false);
      if (no) router.replace('/success');
    }, 1500);
    return () => clearTimeout(id);
  }, [paying]);

  const pays: { t: string; s: string; icon: IconName }[] = [
    { t: 'Apple Pay', s: 'Default · Face ID', icon: 'phone_iphone' },
    {
      t: s.card ? `${s.card.brand === 'VISA' ? 'Visa' : s.card.brand === 'MASTERCARD' ? 'Mastercard' : s.card.brand} ${s.card.num}` : 'Card',
      s: s.card ? `Expires ${s.card.exp}` : 'Add a card in Payment methods',
      icon: 'credit_card',
    },
    { t: 'Cash on delivery', s: 'Pay the courier', icon: 'payments' },
  ];
  const sel = (on: boolean) => ({ borderColor: on ? c.accent : c.line, backgroundColor: on ? c.accentSoft : c.surface1 });

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: chrome.underHeader, paddingBottom: chrome.bottomPad - 10, paddingHorizontal: 20, gap: 20 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {s.mode === 'pickup' ? (
          <Reveal i={0} style={{ gap: 10 }}>
            <Txt s={18} w={600} ls={-0.01}>
              Pick up at
            </Txt>
            <Card radius={20} style={styles.addrCard}>
              <View style={[styles.tile, { backgroundColor: c.accentSoft }]}>
                <Icon name="storefront" size={23} fill color={c.accent} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Txt s={15} w={700}>
                  Fig & Fennel, SoHo
                </Txt>
                <Txt s={13} color={c.text2}>
                  112 Spring St · ready in ~{s.prep} min
                </Txt>
              </View>
              <LinkButton label="Deliver" onPress={() => useApp.getState().setMode('delivery')} style={{ paddingHorizontal: 10 }} />
            </Card>
          </Reveal>
        ) : (
          <>
            <Reveal i={0} style={{ gap: 10 }}>
              <Txt s={18} w={600} ls={-0.01}>
                Deliver to
              </Txt>
              <Card radius={20} style={styles.addrCard}>
                <View style={[styles.tile, { backgroundColor: c.accentSoft }]}>
                  <Icon name={s.addr.icon} size={23} fill color={c.accent} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Txt s={15} w={700}>
                    {s.addr.tag}
                  </Txt>
                  <Txt s={13} color={c.text2} numberOfLines={1}>
                    {s.addr.l1}
                  </Txt>
                </View>
                <LinkButton label="Change" size={13.5} onPress={() => router.push('/addresses')} style={{ paddingHorizontal: 12 }} />
              </Card>
            </Reveal>
            <Reveal i={1} style={{ gap: 10 }}>
              <Txt s={18} w={600} ls={-0.01}>
                Delivery speed
              </Txt>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {SPEEDS.map((o, i) => (
                  <PressableScale key={o.t} onPress={() => set({ speed: i })} scaleTo={0.97} style={[styles.speed, sel(s.speed === i)]}>
                    <View style={styles.speedTop}>
                      <Txt s={15} w={700}>
                        {o.t}
                      </Txt>
                      <Radio on={s.speed === i} />
                    </View>
                    <Txt s={13} color={c.text2}>
                      {o.s}
                    </Txt>
                    <Txt s={12.5} w={700} style={{ marginTop: 4 }}>
                      {o.fee ? '+' + money(o.fee) : 'No extra fee'}
                    </Txt>
                  </PressableScale>
                ))}
              </View>
            </Reveal>
          </>
        )}

        <Reveal i={2} style={{ gap: 10 }}>
          <Txt s={18} w={600} ls={-0.01}>
            Payment
          </Txt>
          <View style={{ gap: 8 }}>
            {pays.map((o, i) => (
              <PressableScale key={o.icon} onPress={() => set({ payM: i })} scaleTo={0.98} style={[styles.pay, sel(s.payM === i)]}>
                <View style={[styles.payTile, { backgroundColor: c.surface2 }]}>
                  <Icon name={o.icon} size={21} />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <Txt s={14.5} w={600}>
                    {o.t}
                  </Txt>
                  <Txt s={12} color={c.text3}>
                    {o.s}
                  </Txt>
                </View>
                <Radio on={s.payM === i} />
              </PressableScale>
            ))}
          </View>
        </Reveal>

        <Reveal i={3} style={{ gap: 10 }}>
          <Txt s={18} w={600} ls={-0.01}>
            Note for the courier
          </Txt>
          <TextInput
            value={s.note}
            onChangeText={(v) => set({ note: v })}
            placeholder="Buzzer 4B, leave at the door…"
            placeholderTextColor={c.text3}
            multiline
            style={[styles.note, { borderColor: c.line, backgroundColor: c.surface1, color: c.text1, fontFamily: family(500) }]}
          />
        </Reveal>

        <Reveal i={4}>
          <Card style={{ padding: 16, gap: 10 }}>
            <SummaryRow label={`Subtotal · ${cnt(t.count, 'item')}`} value={money(t.sub)} />
            <SummaryRow label="Delivery" value={t.fee + t.speedFee ? money(t.fee + t.speedFee) : 'Free'} />
            {s.promo ? <SummaryRow label="Discount" value={'−' + money(t.disc)} valueColor={c.ok} /> : null}
            <Divider />
            <TotalRow value={money(t.total)} />
          </Card>
        </Reveal>
      </ScrollView>

      <ScreenHeader
        title="Checkout"
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="lock" size={16} fill color={c.ok} />
            <Txt s={12} w={600} color={c.ok}>
              Secure
            </Txt>
          </View>
        }
      />

      <FloatingBar>
        <AccentButton
          height={54}
          loading={paying}
          loadingLabel="Placing your order…"
          label={`Pay ${money(t.total)}`}
          icon="lock"
          iconFill
          onPress={() => {
            if (paying || !s.cart.length) return;
            setPaying(true);
          }}
        />
      </FloatingBar>
    </View>
  );
}

const styles = StyleSheet.create({
  addrCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  tile: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  speed: { flex: 1, padding: 14, borderRadius: 18, borderWidth: 1.5, gap: 4 },
  speedTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pay: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1.5 },
  payTile: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  note: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14.5, minHeight: 76, textAlignVertical: 'top' },
});
