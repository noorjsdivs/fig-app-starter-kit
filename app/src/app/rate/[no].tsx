import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { Area } from '@/components/account/field';
import { Icon } from '@/components/icons/icon';
import { AccentButton } from '@/components/ui/buttons';
import { Chip, chipColors } from '@/components/ui/controls';
import { FloatingBar, ScreenHeader, useChrome } from '@/components/ui/layout';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { RATING_MOODS, RATING_TAGS, TIPS } from '@/data/content';
import { useStatusBar } from '@/hooks/use-status-bar';
import { selectMyOrders, useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

export default function RateScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const { no } = useLocalSearchParams<{ no: string }>();
  const orders = useApp((s) => s.orders);
  const mine = useApp(useShallow(selectMyOrders));
  const dishOf = useApp((s) => s.dishOf);
  const o = orders.find((x) => x.no === no) ?? mine.find((x) => x.step === 3) ?? mine[0];
  const dish = o ? dishOf(o.items[0].id) : null;

  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [tip, setTip] = useState(1);
  const [done, setDone] = useState(false);

  const tipMsg = TIPS[tip] ? `Marco gets 100% of your $${TIPS[tip]} tip.` : 'Thanks for helping us get better.';

  const submit = () => {
    const st = useApp.getState();
    if (!stars) {
      st.showToast('Tap a star', 'How was your meal?', 'star');
      return;
    }
    st.submitRating(o?.no ?? '', stars, tags, text);
    setDone(true);
  };

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: chrome.bottomPad, gap: 14 }}
        >
          {done ? (
            <Thanks tipMsg={tipMsg} />
          ) : (
            <>
              <Reveal i={0}>
                <View style={[styles.dish, { backgroundColor: c.surface1, borderColor: c.line }]}>
                  {dish ? <DishImage uri={dish.img} size={56} /> : null}
                  <View style={{ gap: 2 }}>
                    <Txt s={15} w={700}>
                      {dish?.name ?? ''}
                    </Txt>
                    <Txt s={12.5} color={c.text3}>
                      Order {o?.no ?? ''} · delivered
                    </Txt>
                  </View>
                </View>
              </Reveal>
              <Reveal i={1} style={{ alignItems: 'center', gap: 10, paddingVertical: 10 }}>
                <Txt s={26} w={600} ls={-0.02}>
                  {RATING_MOODS[stars]}
                </Txt>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} on={stars >= n} picked={stars === n} onPress={() => setStars(n)} />
                  ))}
                </View>
              </Reveal>
              <Reveal i={2} style={{ gap: 10 }}>
                <Txt s={18} w={600} ls={-0.01}>
                  What stood out?
                </Txt>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {RATING_TAGS.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      on={tags.includes(t)}
                      fontSize={13.5}
                      padH={14}
                      onPress={() => setTags((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}
                    />
                  ))}
                </View>
                <Area rows={3} value={text} onChangeText={setText} placeholder="Tell the kitchen more (optional)" />
              </Reveal>
              <Reveal i={3} style={{ gap: 10 }}>
                <Txt s={18} w={600} ls={-0.01}>
                  Tip your courier
                </Txt>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {TIPS.map((v, i) => {
                    const col = chipColors(tip === i, c);
                    return (
                      <PressableScale key={v} scaleTo={0.94} onPress={() => setTip(i)} style={[styles.tip, { borderColor: col.bd, backgroundColor: col.bg }]}>
                        <Txt s={14.5} w={700} color={col.fg}>
                          {v ? `$${v}` : 'No tip'}
                        </Txt>
                      </PressableScale>
                    );
                  })}
                </View>
                <Txt s={12.5} w={500} color={c.text3}>
                  {tipMsg}
                </Txt>
              </Reveal>
            </>
          )}
        </ScrollView>
        <ScreenHeader title="Rate & tip" />
        <FloatingBar>
          {done ? <AccentButton label="Done" onPress={() => router.back()} /> : <AccentButton label="Submit rating" dim={!stars} onPress={submit} />}
        </FloatingBar>
      </View>
    </RevealScope>
  );
}

function Star({ on, picked, onPress }: { on: boolean; picked: boolean; onPress: () => void }) {
  const { c } = useTheme();
  const s = useSharedValue(1);
  useEffect(() => {
    s.set(withSpring(picked ? 1.25 : 1, { damping: 9, stiffness: 220 }));
  }, [picked, s]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <PressableScale scaleTo={0.9} onPress={onPress} accessibilityLabel="Star" style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={st}>
        <Icon name="star" size={46} fill={on} color={on ? fixed.star : c.lineStrong} />
      </Animated.View>
    </PressableScale>
  );
}

function Thanks({ tipMsg }: { tipMsg: string }) {
  const { c } = useTheme();
  const s = useSharedValue(0.3);
  useEffect(() => {
    s.set(withDelay(40, withSpring(1, { damping: 10, stiffness: 160 })));
  }, [s]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <View style={{ alignItems: 'center', gap: 12, paddingTop: 40 }}>
      <Animated.View style={[styles.badge, st]}>
        <Icon name="star" size={60} fill color={fixed.ink} />
      </Animated.View>
      <Txt s={32} w={600} lh={1.05} ls={-0.03} style={{ marginTop: 10 }}>
        Thanks for rating
      </Txt>
      <Txt s={15} lh={1.5} color={c.text2} align="center" style={{ maxWidth: 280 }}>
        {tipMsg} Your review goes straight to the kitchen team.
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  dish: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 20, borderWidth: 1 },
  tip: { flex: 1, height: 48, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: fixed.star,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: fixed.star,
    shadowOpacity: 0.4,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 20 },
    elevation: 12,
  },
});
