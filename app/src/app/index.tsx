import MaskedViewBase from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ComponentType, type ReactElement, type ReactNode } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/icons/icon';
import { Appear, EASINGS } from '@/components/ui/appear';
import { Glow, SPLASH_GLOW } from '@/components/ui/glow';
import { useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { ONBOARDING } from '@/data/content';
import { SPLASH_IMAGES } from '@/data/images';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { accentGradient, fixed } from '@/theme/tokens';

/** The package ships class typings that React 19's JSX types reject; the runtime is fine. */
const MaskedView = MaskedViewBase as unknown as ComponentType<{ maskElement: ReactElement; children?: ReactNode }>;

const INK = '#1A1A1A';
const TEXT2 = '#55575B';
const LETTERS = [...'Fig & Fennel'].map((ch) => (ch === ' ' ? ' ' : ch));
const FLOATS: [string, number, number, number, number, number, number][] = [
  [SPLASH_IMAGES.floats[0], -38, 58, 150, 9, -60, 0],
  [SPLASH_IMAGES.floats[1], 298, 104, 72, 5, 60, 80],
  [SPLASH_IMAGES.floats[2], 312, 430, 58, 4, 60, 160],
];
const LEAVES: [number, number, number, number][] = [
  [54, 268, 24, -30],
  [318, 236, 18, 40],
  [34, 450, 20, 10],
  [262, 470, 22, -50],
  [318, 756, 18, 20],
  [30, 780, 16, -20],
  [176, 128, 16, 30],
];
const DOTS: [number, number, number][] = [
  [128, 150, 6],
  [262, 74, 5],
  [96, 500, 5],
  [344, 520, 6],
  [200, 462, 4],
  [330, 800, 5],
  [70, 410, 4],
];

/** Three orange "speed lines" used next to the logo and plates. */
function SpeedLines({ style }: { style?: object }) {
  return (
    <View style={[{ alignItems: 'flex-end', gap: 7 }, style]} pointerEvents="none">
      {[44, 28, 36].map((w, i) => (
        <LinearGradient
          key={i}
          colors={['rgba(255,122,26,0)', '#FF8A2A']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: w, height: 3, borderRadius: 2 }}
        />
      ))}
    </View>
  );
}

export default function SplashScreen() {
  useStatusBar('dark');
  const { width: W, height: H } = useWindowDimensions();
  const chrome = useChrome();
  const user = useApp((s) => s.user);
  const [stage, setStage] = useState(0);
  const [ob, setOb] = useState(0);
  const [moved, setMoved] = useState(false);
  const touchX = useRef<number | null>(null);
  const sx = W / 390;
  const sy = H / 844;
  /** Taller-than-design screens (e.g. Pixel 9 Pro) give the plate area the extra room. */
  const extra = Math.max(0, H - 874);
  const k1 = stage >= 1;
  const k2 = stage >= 2;
  const k3 = stage >= 3;
  const k4 = stage >= 4;
  const last = ob === ONBOARDING.length - 1;

  useEffect(() => {
    const ts = [0, 600, 1500, 2300].map((t, i) => setTimeout(() => setStage((s) => Math.max(s, i + 1)), 120 + t));
    return () => ts.forEach(clearTimeout);
  }, []);

  const go = (i: number) => {
    setOb(((i % ONBOARDING.length) + ONBOARDING.length) % ONBOARDING.length);
    setMoved(true);
  };
  const start = (mode: 'login' | 'register') => {
    useApp.getState().finishOnboarding();
    if (user) router.replace('/home');
    else router.replace(mode === 'login' ? '/login' : '/register');
  };
  const onTouchStart = (e: GestureResponderEvent) => {
    touchX.current = e.nativeEvent.pageX;
  };
  const onTouchEnd = (e: GestureResponderEvent) => {
    if (touchX.current == null || !k4) return;
    const dx = e.nativeEvent.pageX - touchX.current;
    touchX.current = null;
    if (dx < -40) go(ob + 1);
    else if (dx > 40) go(ob - 1);
  };

  return (
    <View style={[styles.root]} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Glow spots={SPLASH_GLOW} dimInDark={false} />

      {/* ---------------- intro ---------------- */}
      <Appear on={!k4} from={{ scale: 1.06, opacity: 0 }} duration={700} fadeDuration={420} easing="io" style={StyleSheet.absoluteFill} pointerEvents="none">
        {FLOATS.map(([img, x, y, s, pad, dx, d]) => (
          <Appear
            key={img}
            on={k2}
            from={{ x: dx, y: -30, scale: 0.6 }}
            delay={d}
            duration={900}
            easing="expo"
            style={{ position: 'absolute', left: x * sx, top: y * sy }}
          >
            <View style={[styles.plateShadow, { width: s, height: s, borderRadius: s / 2, padding: pad }]}>
              <Image source={{ uri: img }} contentFit="cover" style={{ flex: 1, borderRadius: s / 2 }} />
            </View>
          </Appear>
        ))}
        {LEAVES.map(([x, y, s, rot], k) => (
          <Appear
            key={k}
            on={k2}
            from={{ rotate: rot - 90, scale: 0.3 }}
            to={{ rotate: rot }}
            delay={120 + k * 60}
            duration={800}
            easing="spring"
            style={{ position: 'absolute', left: x * sx, top: y * sy }}
          >
            <Icon name="eco" size={s} fill color={fixed.leaf} />
          </Appear>
        ))}
        {DOTS.map(([x, y, s], k) => (
          <Appear
            key={k}
            on={k2}
            from={{}}
            delay={200 + k * 50}
            duration={400}
            style={{ position: 'absolute', left: x * sx, top: y * sy, width: s, height: s, borderRadius: s / 2, backgroundColor: fixed.coffee }}
          />
        ))}
        <Appear
          on={k3}
          from={{ y: 140, rotate: -20 }}
          duration={900}
          fadeDuration={300}
          easing="expo"
          style={{ position: 'absolute', left: 0, width: W, top: 520 * sy }}
        >
          <SpeedLines style={{ position: 'absolute', left: 6, top: 70 }} />
          <SpeedLines style={{ position: 'absolute', left: 14, top: 150 }} />
          <View style={[styles.plateShadow, styles.bigPlate, { left: (W - 258) / 2 }]}>
            <Image source={{ uri: SPLASH_IMAGES.hero }} contentFit="cover" style={{ flex: 1, borderRadius: 129 }} />
          </View>
          <View style={[styles.deliveryPill, { right: 28 * sx }]}>
            <LinearGradient colors={accentGradient} style={[StyleSheet.absoluteFill, { borderRadius: 999 }]} />
            <Txt s={13} w={600} color="#FFFFFF">
              25 min delivery
            </Txt>
          </View>
        </Appear>
      </Appear>

      {/* ---------------- logo lock-up ---------------- */}
      <Appear
        on={!k4}
        from={{ y: -50, scale: 0.92, opacity: 0 }}
        duration={700}
        fadeDuration={360}
        easing="io"
        style={[styles.lock, { top: 186 * sy }]}
        pointerEvents="none"
      >
        <Appear on={k1} from={{ scale: 0.3, rotate: -25 }} duration={700} fadeDuration={240} easing="spring">
          <SpeedLines style={{ position: 'absolute', left: -58, top: 22 }} />
          <View style={styles.badge}>
            <LinearGradient colors={accentGradient} style={[StyleSheet.absoluteFill, { borderRadius: 28 }]} />
            <Icon name="eco" size={48} fill color="#FFFFFF" />
          </View>
        </Appear>
        <View style={styles.letters}>
          {LETTERS.map((ch, i) => (
            <Appear key={i} on={k2} from={{ y: 50 }} delay={i * 50} duration={700} fadeDuration={240} easing="expo">
              <Txt s={44} w={700} lh={1.12} ls={-0.03} color={ch === '&' ? fixed.orange : INK}>
                {ch}
              </Txt>
            </Appear>
          ))}
        </View>
        <Appear on={k2} from={{}} delay={350} duration={600}>
          <Txt s={15} w={500} color="#3D3B35">
            Fresh food, made easy
          </Txt>
        </Appear>
      </Appear>

      {/* tap anywhere during the intro to skip to onboarding */}
      {!k4 ? <Pressable style={StyleSheet.absoluteFill} onPress={() => setStage(4)} accessibilityLabel="Skip intro" /> : null}

      {/* ---------------- onboarding ---------------- */}
      <Appear
        on={k4}
        from={{ y: 24 }}
        delay={k4 ? 200 : 0}
        duration={700}
        fadeDuration={500}
        easing="expo"
        style={StyleSheet.absoluteFill}
        pointerEvents={k4 ? 'box-none' : 'none'}
      >
        <View style={[styles.ob, { paddingTop: chrome.top + 48, paddingBottom: Math.max(chrome.insets.bottom, 16) + 14 }]}>
          <View style={{ height: 80 }}>
            {ONBOARDING.map((o, i) => (
              <SlideTitle key={i} l0={o.l0} l1={o.l1} pos={!k4 ? 1 : i === ob ? 0 : i < ob ? -1 : 1} moved={moved} />
            ))}
          </View>
          <View style={{ height: 44, marginTop: 6, marginHorizontal: 24 }}>
            {ONBOARDING.map((o, i) => {
              const on = k4 && i === ob;
              return (
                <Appear
                  key={i}
                  on={on}
                  from={{ y: (i < ob ? -1 : 1) * 10 }}
                  delay={on ? 300 : 0}
                  duration={620}
                  fadeDuration={on ? 520 : 220}
                  style={StyleSheet.absoluteFill}
                >
                  <Txt s={14} lh={1.5} color={TEXT2} align="center">
                    {o.sub}
                  </Txt>
                </Appear>
              );
            })}
          </View>

          <View style={[styles.plateArea, { maxHeight: 220 + extra * 0.7, justifyContent: 'center' }]}>
            <View style={{ height: 220 }}>
              <SpeedLines style={{ position: 'absolute', left: 44 * sx, top: 70 }} />
              <SpeedLines style={{ position: 'absolute', left: 52 * sx, top: 130 }} />
              <View style={{ position: 'absolute', left: 70 * sx, top: 20, transform: [{ rotate: '-30deg' }] }}>
                <Icon name="eco" size={22} fill color={fixed.leaf} />
              </View>
              <View style={{ position: 'absolute', right: 66 * sx, top: 172, transform: [{ rotate: '40deg' }] }}>
                <Icon name="eco" size={18} fill color={fixed.leaf} />
              </View>
              <View style={[styles.dot, { right: 92 * sx, top: 16, width: 6, height: 6 }]} />
              <View style={[styles.dot, { left: 96 * sx, top: 190, width: 5, height: 5 }]} />
              <View style={[styles.plateShadow, styles.obPlate]}>
                {ONBOARDING.map((o, i) => (
                  <ObPhoto key={i} uri={o.img} on={i === ob} ready={k3} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.feats}>
            {ONBOARDING.map((f, i) => {
              const on = i === ob;
              return (
                <PressableScale key={f.t} onPress={() => go(i)} scaleTo={0.98} style={[styles.feat, on && styles.featOn]}>
                  <View style={styles.featIcon}>
                    <LinearGradient colors={f.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
                    <Icon name={f.icon} size={22} color={f.fg} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0, gap: 2, opacity: on ? 1 : 0.6 }}>
                    <Txt s={14} w={600} color={INK}>
                      {f.t}
                    </Txt>
                    <Txt s={12.5} lh={1.35} color={TEXT2}>
                      {f.d}
                    </Txt>
                  </View>
                </PressableScale>
              );
            })}
            <View style={styles.segs}>
              {ONBOARDING.map((_, i) => (
                <Seg key={i} on={i === ob} onPress={() => go(i)} />
              ))}
            </View>
          </View>

          <View style={{ gap: 4, marginTop: 'auto', paddingTop: 12 }}>
            <PressableScale onPress={() => (last ? start('register') : go(ob + 1))} scaleTo={0.97} style={styles.cta}>
              <LinearGradient colors={accentGradient} style={[StyleSheet.absoluteFill, { borderRadius: 28 }]} />
              <Txt s={16} w={600} color="#FFFFFF">
                {last ? 'Get Started' : 'Next'}
              </Txt>
              <Icon name="arrow_forward" size={20} color="#FFFFFF" />
            </PressableScale>
            <View style={styles.haveRow}>
              <Txt s={13.5} color={TEXT2}>
                {user ? `Signed in as ${user.name.split(' ')[0]} ·` : 'Already have an account?'}
              </Txt>
              <PressableScale onPress={() => start('login')} scaleTo={0.96} style={{ height: 40, paddingHorizontal: 4, justifyContent: 'center' }}>
                <Txt s={13.5} w={600} color="#C2540A">
                  {user ? 'Continue' : 'Sign in'}
                </Txt>
              </PressableScale>
            </View>
          </View>
        </View>

        <PressableScale onPress={() => start('login')} scaleTo={0.95} style={[styles.skip, { top: chrome.top + 2 }]}>
          <Txt s={13} w={500} color={INK}>
            Skip
          </Txt>
        </PressableScale>
      </Appear>
    </View>
  );
}

/** Two-line headline whose lines slide through an overflow mask; line 2 is gradient text. */
function SlideTitle({ l0, l1, pos, moved }: { l0: string; l1: string; pos: number; moved: boolean }) {
  const on = pos === 0;
  const LINE = 40; // 110% of the 36px line box
  const y0 = useSharedValue(pos * LINE);
  const y1 = useSharedValue(pos * LINE);
  useEffect(() => {
    const d0 = on ? (moved ? 140 : 60) : 0;
    const d1 = on ? (moved ? 220 : 160) : 60;
    const cfg = { duration: on ? 820 : 520, easing: on ? EASINGS.expo : EASINGS.io };
    const t = setTimeout(() => {
      y0.set(withTiming(pos * LINE, cfg));
    }, d0);
    const t2 = setTimeout(() => {
      y1.set(withTiming(pos * LINE, cfg));
    }, d1);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [pos, on, moved, y0, y1]);
  const s0 = useAnimatedStyle(() => ({ transform: [{ translateY: y0.value }] }));
  const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: y1.value }] }));
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', marginHorizontal: 24 }]} pointerEvents="none">
      <View style={{ overflow: 'hidden' }}>
        <Animated.View style={s0}>
          <Txt s={30} w={700} lh={1.2} ls={-0.02} color={INK} align="center">
            {l0}
          </Txt>
        </Animated.View>
      </View>
      <View style={{ overflow: 'hidden' }}>
        <Animated.View style={s1}>
          <MaskedView
            maskElement={
              <Txt s={30} w={700} lh={1.2} ls={-0.02} align="center" color="#000">
                {l1}
              </Txt>
            }
          >
            <LinearGradient colors={['#FF8A2A', '#E85F00']}>
              <Txt s={30} w={700} lh={1.2} ls={-0.02} align="center" style={{ opacity: 0 }}>
                {l1}
              </Txt>
            </LinearGradient>
          </MaskedView>
        </Animated.View>
      </View>
    </View>
  );
}

/** Onboarding plate photo: cross-fades and slowly un-rotates while active. */
function ObPhoto({ uri, on, ready }: { uri: string; on: boolean; ready: boolean }) {
  const o = useSharedValue(on ? 1 : 0);
  const p = useSharedValue(0);
  useEffect(() => {
    o.set(withTiming(on ? 1 : 0, { duration: 900, easing: EASINGS.out }));
    p.set(on && ready ? withTiming(1, { duration: 8000, easing: EASINGS.slow }) : withTiming(0, { duration: 900, easing: EASINGS.out }));
  }, [on, ready, o, p]);
  const st = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ scale: 0.86 + 0.14 * p.value }, { rotate: `${-28 + 28 * p.value}deg` }] }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { margin: 10 }, st]}>
      <Image source={{ uri }} contentFit="cover" style={{ flex: 1, borderRadius: 94 }} />
    </Animated.View>
  );
}

function Seg({ on, onPress }: { on: boolean; onPress: () => void }) {
  const v = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    v.set(withTiming(on ? 1 : 0, { duration: 420, easing: EASINGS.expo }));
  }, [on, v]);
  const st = useAnimatedStyle(() => ({ width: 7 + 15 * v.value, backgroundColor: v.value > 0.5 ? '#FF7A1A' : 'rgba(26,26,26,0.18)' }));
  return (
    <PressableScale onPress={onPress} scaleTo={1} hitSlop={8} accessibilityLabel="Slide">
      <Animated.View style={[{ height: 7, borderRadius: 4 }, st]} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: fixed.splashBg, overflow: 'hidden' },
  plateShadow: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#5A3214',
    shadowOpacity: 0.2,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 26 },
    elevation: 12,
  },
  bigPlate: { position: 'absolute', top: 0, width: 258, height: 258, borderRadius: 129, padding: 12 },
  deliveryPill: {
    position: 'absolute',
    top: 196,
    backgroundColor: '#FF7A1A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    transform: [{ rotate: '-8deg' }],
    shadowColor: '#FF6B0B',
    shadowOpacity: 0.35,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 10 },
  },
  lock: { position: 'absolute', left: 0, right: 0, alignItems: 'center', gap: 12 },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: '#FF7A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B0B',
    shadowOpacity: 0.38,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 12,
  },
  letters: { flexDirection: 'row', overflow: 'hidden' },
  ob: { flex: 1, paddingHorizontal: 20 },
  plateArea: { flex: 1, maxHeight: 220, minHeight: 150, marginTop: 16, marginHorizontal: -20 },
  obPlate: { marginTop: 6, alignSelf: 'center', width: 208, height: 208, borderRadius: 104 },
  dot: { position: 'absolute', borderRadius: 3, backgroundColor: fixed.coffee },
  feats: { marginTop: 14, padding: 8, borderRadius: 24, backgroundColor: '#F3F2EE', gap: 4 },
  feat: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 18 },
  featOn: { backgroundColor: '#FFFFFF', shadowColor: '#1A1A1A', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  featIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  segs: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingTop: 8, paddingBottom: 4 },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF7A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF6B0B',
    shadowOpacity: 0.34,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  haveRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  skip: {
    position: 'absolute',
    right: 20,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(26,26,26,0.06)',
    justifyContent: 'center',
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
