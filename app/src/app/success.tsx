import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { AccentButton, AccentFill, OutlineButton } from '@/components/ui/buttons';
import { useChrome } from '@/components/ui/layout';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

const APath = Animated.createAnimatedComponent(Path);
const E = Easing.bezier(0.22, 1, 0.36, 1);

export default function SuccessScreen() {
  return (
    <RevealScope>
      <Success />
    </RevealScope>
  );
}

function Success() {
  useStatusBar();
  const { c } = useTheme();
  const chrome = useChrome();
  const prep = useApp((s) => s.prep);
  const order = useApp((s) => s.orders.find((o) => o.no === s.lastNo) ?? s.orders.find((o) => o.cid === 'c1'));

  const badge = useSharedValue(0.3);
  const ring = useSharedValue(0);
  const dash = useSharedValue(22);
  useEffect(() => {
    badge.set(withDelay(120, withSpring(1, { damping: 10, stiffness: 160 })));
    ring.set(withDelay(300, withTiming(1, { duration: 1100, easing: E })));
    dash.set(withDelay(520, withTiming(0, { duration: 450, easing: E })));
  }, [badge, ring, dash]);
  const badgeSt = useAnimatedStyle(() => ({ transform: [{ scale: badge.value }] }));
  const ringSt = useAnimatedStyle(() => ({ opacity: 0.8 * (1 - ring.value), transform: [{ scale: 0.8 + 1.2 * ring.value }] }));
  const pathProps = useAnimatedProps(() => ({ strokeDashoffset: dash.value }));

  const home = () => {
    if (router.canDismiss()) router.dismissAll();
    router.navigate('/home');
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bg, paddingTop: chrome.top + 38, paddingBottom: Math.max(chrome.insets.bottom, 16) + 24 }]}>
      <View style={styles.badgeBox}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.ring, { borderColor: c.accent }, ringSt]} />
        <Animated.View style={[StyleSheet.absoluteFill, styles.badge, badgeSt]}>
          <AccentFill radius={62} />
          <Svg width={58} height={58} viewBox="0 0 24 24" fill="none">
            <APath
              d="M5 12.5l4.5 4.5L19 7"
              stroke={c.accentInk}
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={22}
              animatedProps={pathProps}
            />
          </Svg>
        </Animated.View>
      </View>
      <Reveal i={1}>
        <Txt s={34} w={600} ls={-0.03} align="center">
          Order placed!
        </Txt>
      </Reveal>
      <Reveal i={2} style={{ maxWidth: 290 }}>
        <Txt s={15} lh={1.55} color={c.text2} align="center">
          The kitchen just got your ticket. We’ll fire it up and send updates as it moves.
        </Txt>
      </Reveal>
      {order ? (
        <Reveal i={2} style={[styles.info, { backgroundColor: c.surface1, borderColor: c.line }]}>
          {[
            ['Order', order.no],
            ['Arriving', order.mode === 'pickup' ? `~${prep} min` : `${prep + 12}–${prep + 20} min`],
            ['Total', money(order.total)],
          ].map(([l, v]) => (
            <View key={l} style={{ flex: 1, gap: 4 }}>
              <Txt s={11} w={600} ls={0.06} upper color={c.text3}>
                {l}
              </Txt>
              <Txt s={15} w={700} numberOfLines={1}>
                {v}
              </Txt>
            </View>
          ))}
        </Reveal>
      ) : null}
      <Reveal i={3} style={styles.actions}>
        <AccentButton
          label="Track live"
          icon="two_wheeler"
          iconFill
          iconSize={21}
          height={56}
          onPress={() => order && router.replace({ pathname: '/track/[no]', params: { no: order.no } })}
          accessibilityLabel={order ? `Track ${cnt(order.items.length, 'item')}` : 'Track live'}
        />
        <OutlineButton label="Back to home" height={52} fontSize={15} weight={600} onPress={home} />
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24, alignItems: 'center', gap: 14 },
  badgeBox: { width: 124, height: 124, marginTop: 30, marginBottom: 14 },
  ring: { borderRadius: 62, borderWidth: 2 },
  badge: {
    borderRadius: 62,
    backgroundColor: '#FF7A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7A1A',
    shadowOpacity: 0.4,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 20 },
    elevation: 14,
  },
  info: { alignSelf: 'stretch', marginTop: 10, padding: 16, borderRadius: 22, borderWidth: 1, flexDirection: 'row', gap: 8 },
  actions: { marginTop: 'auto', alignSelf: 'stretch', gap: 10 },
});
