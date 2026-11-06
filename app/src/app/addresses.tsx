import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AddressSheet, blankAddress } from '@/components/account/address-sheet';
import { Icon } from '@/components/icons/icon';
import { AccentButton, AccentFill } from '@/components/ui/buttons';
import { Radio } from '@/components/ui/controls';
import { Eyebrow, FloatingBar, ScreenHeader, useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp, type NewAddress } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function AddressesScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const addrs = useApp((s) => s.addrs);
  const selected = useApp((s) => s.addr);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<NewAddress>(() => blankAddress());
  const [err, setErr] = useState(false);

  const startAddr = (prefill?: Partial<NewAddress>) => {
    setDraft(blankAddress(prefill));
    setErr(false);
    setOpen(true);
  };

  const save = () => {
    const miss = useApp.getState().addAddress(draft);
    if (miss) {
      setErr(true);
      return;
    }
    setErr(false);
    setOpen(false);
  };

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: chrome.bottomPad, gap: 12 }}
        >
          <PressableScale
            scaleTo={0.98}
            onPress={() => {
              useApp.getState().showToast('Location found', '232 Mercer St, New York', 'my_location');
              startAddr({ l1: '232 Mercer St', zip: '10012', tag: 'Other', custom: 'Current location' });
            }}
            style={[styles.locate, { borderColor: c.line, backgroundColor: c.surface1 }]}
          >
            <View style={styles.locateTile}>
              <AccentFill radius={14} />
              <Icon name="my_location" size={22} color={c.accentInk} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Txt s={14.5} w={700}>
                Use my current location
              </Txt>
              <Txt s={12.5} color={c.text3}>
                We’ll fill in the street for you
              </Txt>
            </View>
            <Icon name="chevron_right" size={21} color={c.text3} />
          </PressableScale>

          <Eyebrow>Saved addresses</Eyebrow>

          {addrs.map((a, i) => {
            const on = selected === i;
            return (
              <Reveal key={`${a.l1}-${i}`} i={Math.min(i, 6)}>
                <PressableScale
                  scaleTo={0.985}
                  onPress={() => useApp.getState().setCheckout({ addr: i })}
                  style={[styles.card, { borderColor: on ? c.accent : c.line, backgroundColor: c.surface1 }]}
                >
                  <View style={styles.top}>
                    <View style={[styles.tile, { backgroundColor: c.accentSoft }]}>
                      <Icon name={a.icon} size={22} fill color={c.accent} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Txt s={15} w={700}>
                          {a.tag}
                        </Txt>
                        {on ? (
                          <View style={styles.def}>
                            <AccentFill radius={6} />
                            <Txt s={9.5} w={700} ls={0.06} upper color={c.accentInk}>
                              Default
                            </Txt>
                          </View>
                        ) : null}
                      </View>
                      <Txt s={13.5} w={500}>
                        {a.l1}
                      </Txt>
                      <Txt s={12.5} color={c.text3}>
                        {a.l2}
                      </Txt>
                    </View>
                    <Radio on={on} size={22} />
                  </View>
                  <View style={[styles.bottom, { borderTopColor: c.line, backgroundColor: c.bg }]}>
                    <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Icon name={a.door ? 'door_front' : 'front_hand'} size={16} color={c.text3} />
                      <Txt s={12} w={500} color={c.text2} numberOfLines={1} style={{ flexShrink: 1 }}>
                        {a.door ? 'Leave at door' : 'Hand it to me'} · {a.note || 'No delivery note'}
                      </Txt>
                    </View>
                    {addrs.length > 1 ? (
                      <PressableScale scaleTo={0.94} onPress={() => useApp.getState().removeAddress(i)} style={[styles.remove, { borderColor: c.lineStrong }]}>
                        <Txt s={12} w={600} color={c.err}>
                          Remove
                        </Txt>
                      </PressableScale>
                    ) : null}
                  </View>
                </PressableScale>
              </Reveal>
            );
          })}
        </ScrollView>
        <ScreenHeader title="Addresses" />
        <FloatingBar>
          <AccentButton label="Add a new address" icon="add_location_alt" iconSize={21} onPress={() => startAddr()} />
        </FloatingBar>
        <AddressSheet
          visible={open}
          value={draft}
          onChange={(p) => setDraft((d) => ({ ...d, ...p }))}
          showErrors={err}
          onSave={save}
          onClose={() => setOpen(false)}
        />
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  locate: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, borderWidth: 1 },
  locateTile: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 22, borderWidth: 1.5, overflow: 'hidden' },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 14 },
  tile: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  def: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: 1 },
  remove: { height: 30, paddingHorizontal: 10, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
