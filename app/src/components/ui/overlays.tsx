import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  type HostInstance,
  type ScrollViewInstance,
} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Icon } from '@/components/icons/icon';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

import { AccentFill, CircleButton } from './buttons';
import { Glass } from './glass';
import { useChrome } from './layout';
import { PressableScale } from './pressable-scale';
import { Txt } from './txt';

const IO = Easing.bezier(0.32, 0.72, 0, 1);
const E = Easing.bezier(0.22, 1, 0.36, 1);

/* ------------------------------------------------------------------ Sheet */

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  /** Standard header (title + subtitle + close). */
  title?: string;
  subtitle?: string;
  /** Fully custom header (replaces title/subtitle/close). */
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** 'modal' — bg surface, 90% max height (Add address/card…); 'glass' — filter sheet. */
  variant?: 'modal' | 'glass';
  scroll?: boolean;
}

/** Bottom sheet with scrim, grabber and springy slide (`translateY(105%) → none`). */
export function Sheet({ visible, onClose, title, subtitle, header, footer, children, variant = 'modal', scroll = true }: SheetProps) {
  const { c } = useTheme();
  const { height } = useWindowDimensions();
  const { insets } = useChrome();
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);
  const y = useSharedValue(height);
  const scrim = useSharedValue(0);
  // iOS lifts the sheet above the keyboard (KeyboardAvoidingView); cap its height to the space that's left.
  const [kb, setKb] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const viewportH = useRef(0);
  const scrollY = useRef(0);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const show = Keyboard.addListener('keyboardWillShow', (e) => setKb(e.endCoordinates.height));
    // Once the sheet has settled above the keyboard, bring the focused field into view.
    const shown = Keyboard.addListener('keyboardDidShow', () => {
      const field = TextInput.State.currentlyFocusedInput();
      const content = scrollRef.current?.getInnerViewRef();
      if (!field || !content) return;
      field.measureLayout(content, (_x, top, _w, h) => {
        const bottom = top + h + 16 - viewportH.current;
        if (bottom > scrollY.current) scrollRef.current?.scrollTo({ y: bottom, animated: true });
      });
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => setKb(0));
    return () => {
      show.remove();
      shown.remove();
      hide.remove();
    };
  }, []);
  const maxHeight = Math.min(height * 0.9, height - kb - insets.top - 8);

  useEffect(() => {
    if (visible) {
      scrollY.current = 0;
      y.set(withTiming(0, { duration: 540, easing: IO }));
      scrim.set(withTiming(1, { duration: 360, easing: E }));
    } else if (mounted) {
      scrim.set(withTiming(0, { duration: 300, easing: E }));
      y.set(
        withTiming(height, { duration: 420, easing: IO }, (done) => {
          if (done) scheduleOnRN(setMounted, false);
        }),
      );
    }
  }, [visible, mounted, height, y, scrim]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));

  if (!mounted) return null;

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      onLayout={(e) => {
        viewportH.current = e.nativeEvent.layout.height;
      }}
      onScroll={(e) => {
        scrollY.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={64}
      style={{ flexGrow: 0, flexShrink: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 14 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }, scrimStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        </Animated.View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav} pointerEvents="box-none">
          <Animated.View style={[styles.sheetShadow, { maxHeight }, sheetStyle]}>
            {variant === 'glass' ? (
              <Glass
                variant="strong"
                intensity={60}
                style={[styles.sheet, { borderTopColor: c.glassLine, borderTopWidth: 1, paddingBottom: Math.max(insets.bottom, 20) + 14 }]}
              >
                <Grabber />
                {header}
                {body}
              </Glass>
            ) : (
              <View style={[styles.sheet, { backgroundColor: c.bg }]}>
                <View style={styles.head}>
                  <Grabber />
                  {header ?? (
                    <View style={styles.titleRow}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Txt s={24} w={600} lh={1.05} ls={-0.025}>
                          {title}
                        </Txt>
                        {subtitle ? (
                          <Txt s={12.5} w={500} color={c.text3}>
                            {subtitle}
                          </Txt>
                        ) : null}
                      </View>
                      <CircleButton icon="close" size={40} iconSize={20} variant="soft" label="Close" onPress={onClose} style={{ borderWidth: 0 }} />
                    </View>
                  )}
                </View>
                {body}
                {footer ? (
                  <Glass variant="strong" style={[styles.footer, { borderTopColor: c.line, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
                    {footer}
                  </Glass>
                ) : (
                  <View style={{ height: insets.bottom }} />
                )}
              </View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
        <ToastHost />
      </View>
    </Modal>
  );
}

function Grabber() {
  const { c } = useTheme();
  return <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: c.lineStrong, marginBottom: 10 }} />;
}

/* ------------------------------------------------------------------ Toast */

/** Glass notification that drops in from the top (`tst` in the design). */
export function ToastHost() {
  const { c } = useTheme();
  const { top } = useChrome();
  const toast = useApp((s) => s.toast);
  const hide = useApp((s) => s.hideToast);
  const [shown, setShown] = useState(toast);
  if (toast && toast !== shown) setShown(toast);
  const y = useSharedValue(-180);
  const o = useSharedValue(0);

  useEffect(() => {
    if (toast) {
      y.set(withSpring(0, { damping: 15, stiffness: 180, mass: 0.9 }));
      o.set(withTiming(1, { duration: 300, easing: E }));
    } else {
      y.set(withTiming(-180, { duration: 380, easing: E }));
      o.set(withTiming(0, { duration: 300, easing: E }));
    }
  }, [toast, y, o]);

  const st = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }] }));
  if (!shown) return null;
  const data = toast ?? shown;

  return (
    <Animated.View pointerEvents={toast ? 'box-none' : 'none'} style={[styles.toastWrap, { top: top + 2 }, st]}>
      <View style={styles.toastShadow}>
        <Glass variant="strong" intensity={60} style={[styles.toast, { borderColor: c.glassLine }]}>
          <View style={styles.toastIcon}>
            <AccentFill radius={12} />
            <Icon name={data.icon} size={20} fill color={c.accentInk} />
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Txt s={14} w={700} numberOfLines={1}>
              {data.title}
            </Txt>
            <Txt s={12.5} color={c.text2} numberOfLines={1}>
              {data.sub}
            </Txt>
          </View>
          {data.action ? (
            <PressableScale
              onPress={() => {
                const href = data.action!.href;
                hide();
                router.navigate(href as never);
              }}
              scaleTo={0.94}
              style={[styles.toastBtn, { backgroundColor: c.text1 }]}
            >
              <Txt s={13} w={700} color={c.bg}>
                {data.action.label}
              </Txt>
            </PressableScale>
          ) : null}
        </Glass>
      </View>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ Fly to cart */

/** The "+1" bubble that arcs from an Add button into the cart (720ms). */
export function FlyLayer() {
  const fly = useApp((s) => s.fly);
  const end = useApp((s) => s.endFly);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const sc = useSharedValue(1);
  const op = useSharedValue(0);

  useEffect(() => {
    if (!fly) return;
    x.set(fly.from.x - 20);
    y.set(fly.from.y - 20);
    sc.set(1);
    op.set(1);
    const d = 720;
    x.set(withTiming(fly.to.x - 20, { duration: d, easing: Easing.bezier(0.45, 0, 0.55, 1) }));
    y.set(withTiming(fly.to.y - 20, { duration: d, easing: Easing.bezier(0.5, -0.6, 0.7, 0.9) }));
    sc.set(
      withTiming(0.45, { duration: d, easing: E }, (done) => {
        if (done) {
          op.set(0);
          scheduleOnRN(end);
        }
      }),
    );
  }, [fly, x, y, sc, op, end]);

  const st = useAnimatedStyle(() => ({ opacity: op.value, transform: [{ translateX: x.value }, { translateY: y.value }, { scale: sc.value }] }));
  if (!fly) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.fly, st]}>
      <AccentFill radius={20} />
      <Txt s={13} w={800} color="#FFFFFF">
        +1
      </Txt>
    </Animated.View>
  );
}

/** Measures `ref` and launches the fly-to-cart bubble towards the cart tab (or detail header). */
export function useFlyToCart() {
  const { width, height } = useWindowDimensions();
  const { floatBottom, top } = useChrome();
  const flyToCart = useApp((s) => s.flyToCart);
  return (ref: RefObject<HostInstance | null> | null | undefined, target: 'tab' | 'header' = 'tab') => {
    const to = target === 'header' ? { x: width - 16 - 22, y: top + 2 + 22 } : { x: 14 + (width - 28) * (3.5 / 5), y: height - floatBottom - 40 };
    const node = ref?.current;
    if (!node) {
      useApp.getState().endFly();
      return;
    }
    node.measureInWindow((mx: number, my: number, w: number, h: number) => {
      if (!w && !h) {
        useApp.getState().endFly();
        return;
      }
      flyToCart({ x: mx + w / 2, y: my + h / 2 }, to);
    });
  };
}

const styles = StyleSheet.create({
  kav: { flex: 1, justifyContent: 'flex-end' },
  sheetShadow: { shadowColor: '#1A1A1A', shadowOpacity: 0.25, shadowRadius: 30, shadowOffset: { width: 0, height: -24 }, elevation: 24 },
  sheet: { flexShrink: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', paddingTop: 10 },
  head: { paddingHorizontal: 20, paddingBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { paddingTop: 10, paddingHorizontal: 20, borderTopWidth: 1 },
  toastWrap: { position: 'absolute', left: 14, right: 14, zIndex: 85 },
  toastShadow: { borderRadius: 20, shadowColor: '#1A1A1A', shadowOpacity: 0.22, shadowRadius: 20, shadowOffset: { width: 0, height: 16 }, elevation: 16 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, paddingLeft: 12, borderRadius: 20, borderWidth: 1 },
  toastIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toastBtn: { height: 36, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  fly: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});
