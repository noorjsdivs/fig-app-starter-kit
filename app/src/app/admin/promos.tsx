import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AdminHeader, RangeSlider, useAdminPadding } from '@/components/admin/admin-ui';
import { AccentButton } from '@/components/ui/buttons';
import { ProgressBar, Toggle } from '@/components/ui/controls';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function AdminPromos() {
  return (
    <RevealScope>
      <Promos />
    </RevealScope>
  );
}

function Promos() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const promos = useApp((s) => s.promos);
  const togglePromo = useApp((s) => s.togglePromo);
  const [code, setCode] = useState('');
  const [pct, setPct] = useState(15);
  const [round, setRound] = useState(0);

  const create = () => {
    if (useApp.getState().addPromo(code, pct)) {
      setCode('');
      setRound((r) => r + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={[pad, { gap: 10 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Reveal i={0}>
          <View style={[styles.card, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <Txt s={17} w={600}>
              New promo code
            </Txt>
            <TextInput
              value={code}
              onChangeText={(v) => setCode(v.toUpperCase())}
              placeholder="CODE"
              placeholderTextColor={c.text3}
              autoCapitalize="characters"
              autoCorrect={false}
              selectionColor={c.accent}
              returnKeyType="done"
              onSubmitEditing={create}
              style={[styles.code, { borderColor: c.line, backgroundColor: c.bg, color: c.text1, fontFamily: family(700) }]}
            />
            <View style={styles.between}>
              <Txt s={13} w={600} color={c.text2}>
                Discount
              </Txt>
              <Txt s={18} w={600} color={c.accentText}>
                {pct}% off
              </Txt>
            </View>
            <RangeSlider min={5} max={50} step={5} value={pct} onChange={setPct} />
            <AccentButton label="Create code" height={48} fontSize={14.5} onPress={create} />
          </View>
        </Reveal>
        {promos.map((p, i) => (
          <Reveal key={p.code} i={1 + Math.min(i, 8)} replay={round}>
            <PressableScale
              onPress={() => togglePromo(p.code)}
              scaleTo={0.985}
              accessibilityRole="switch"
              accessibilityState={{ checked: p.on }}
              style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}
            >
              <View style={styles.rowTop}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt s={16} w={600} ls={0.04} color={p.on ? c.text1 : c.text3}>
                    {p.code}
                  </Txt>
                  <Txt s={12.5} color={c.text3}>
                    {p.pct}% off entire order
                  </Txt>
                </View>
                <Toggle on={p.on} />
              </View>
              <View style={styles.rowTop}>
                <View style={{ flex: 1 }}>
                  <ProgressBar pct={Math.min(100, p.used / 5)} height={5} gradient />
                </View>
                <Txt s={11.5} w={600} color={c.text3}>
                  {p.used} redeemed
                </Txt>
              </View>
            </PressableScale>
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Promotions" back />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  code: { height: 50, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, letterSpacing: 1.2 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  row: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, gap: 10 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
