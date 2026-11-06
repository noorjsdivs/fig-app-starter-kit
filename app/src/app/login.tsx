import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { AuthCta, completeAuth, emailOk, Field, PastelTile, PwToggle, SoftChip, useAuthForm } from '@/components/auth/auth-ui';
import { Icon } from '@/components/icons/icon';
import { Glow, LOGIN_GLOW } from '@/components/ui/glow';
import { useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { AUTH_IMAGES } from '@/data/images';
import { useAuthExit } from '@/hooks/use-auth-nav';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

export default function LoginScreen() {
  useStatusBar();
  const { c, isDark } = useTheme();
  const chrome = useChrome();
  const exit = useAuthExit();
  const pending = useApp((s) => s.pendingCheckout);
  const f = useAuthForm();
  const [busy, setBusy] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const login = () => {
    if (busy) return;
    setBusy(true);
    timer.current = setTimeout(() => {
      setBusy(false);
      completeAuth('Welcome back');
      exit({ signedIn: true });
    }, 900);
  };
  const guest = () => exit();
  const social = { backgroundColor: isDark ? c.surface1 : '#FFFFFF', borderColor: isDark ? c.line : 'rgba(26,26,26,0.08)' };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Glow spots={LOGIN_GLOW} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: chrome.top, paddingHorizontal: 24, paddingBottom: Math.max(chrome.insets.bottom, 16) + 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <SoftChip label="Fig & Fennel" style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 0 }}>
              <Icon name="eco" size={24} fill color={fixed.orange} />
            </SoftChip>
            <Txt s={18} w={500}>
              Sign in
            </Txt>
            <SoftChip label="Skip" onPress={guest} style={{ height: 40, paddingHorizontal: 14, borderRadius: 20 }}>
              <Txt s={13} w={500}>
                Skip
              </Txt>
            </SoftChip>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroPlate}>
              <Image source={{ uri: AUTH_IMAGES.login }} contentFit="cover" style={{ flex: 1, borderRadius: 83 }} />
            </View>
            <View style={[styles.tag, { left: 6, top: 40, transform: [{ rotate: '-14deg' }] }]}>
              <Txt s={13} w={500} color="#1A1A1A">
                100% Fresh
              </Txt>
            </View>
            <View style={[styles.tag, { right: 4, top: 128, transform: [{ rotate: '-12deg' }] }]}>
              <Txt s={13} w={500} color="#1A1A1A">
                20% OFF
              </Txt>
            </View>
            <PastelTile label="Delivery" value="18" unit="min" colors={['#FFF6CF', '#FFE9A3']} style={{ position: 'absolute', left: 0, top: 120, width: 94 }} />
            <PastelTile label="Rating" value="4.9" unit="★" colors={['#D9F4FB', '#BFE9F6']} style={{ position: 'absolute', right: 0, top: 16, width: 94 }} />
          </View>

          <View style={{ gap: 6, marginTop: 10 }}>
            <Txt s={13} w={500} color={c.text3}>
              {pending ? 'Almost there' : 'Welcome back'}
            </Txt>
            <Txt s={30} w={600} lh={1.1} ls={-0.02}>
              {pending ? 'Sign in to place your order' : 'Sign in to Fig & Fennel'}
            </Txt>
            <Txt s={14} lh={1.5} color={c.text2}>
              {pending ? 'Your cart is saved. Sign in or create an account to check out.' : 'Track live orders, save favourites and check out in one tap.'}
            </Txt>
          </View>

          <View style={{ gap: 10, marginTop: 14 }}>
            <Field
              icon="mail"
              value={f.email}
              onChangeText={(email) => f.set({ email })}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              error={!emailOk(f.email)}
            />
            <Field
              icon="lock"
              value={f.pw}
              onChangeText={(pw) => f.set({ pw })}
              placeholder="Password"
              secureTextEntry={!f.showPw}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={login}
              right={<PwToggle />}
            />
            <PressableScale onPress={() => router.push('/forgot')} scaleTo={0.96} style={{ alignSelf: 'flex-end' }}>
              <Txt s={13} w={500} color={c.accentText}>
                Forgot password?
              </Txt>
            </PressableScale>
            <AuthCta label="Sign in" busyLabel="Signing in…" busy={busy} onPress={login} />
            <View style={styles.or}>
              <View style={[styles.rule, { backgroundColor: c.lineStrong }]} />
              <Txt s={12} w={500} color={c.text3}>
                or continue with
              </Txt>
              <View style={[styles.rule, { backgroundColor: c.lineStrong }]} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {(
                [
                  ['phone_iphone', 'Apple'],
                  ['language', 'Google'],
                ] as const
              ).map(([icon, l]) => (
                <PressableScale key={l} onPress={login} scaleTo={0.97} style={[styles.social, social]}>
                  <Icon name={icon} size={20} />
                  <Txt s={14} w={500}>
                    {l}
                  </Txt>
                </PressableScale>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 'auto', paddingTop: 6, alignItems: 'center' }}>
            <PressableScale onPress={() => router.replace('/register')} scaleTo={0.97} style={{ paddingVertical: 8 }}>
              <Txt s={13.5} color={c.text2}>
                New here?{' '}
                <Txt s={13.5} w={600} color={c.accentText}>
                  Create account
                </Txt>
              </Txt>
            </PressableScale>
            {pending ? (
              <PressableScale onPress={guest} scaleTo={0.97} style={{ paddingVertical: 4 }}>
                <Txt s={13} w={500} color={c.text3}>
                  Back to cart
                </Txt>
              </PressableScale>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { height: 196, marginTop: 4 },
  heroPlate: {
    position: 'absolute',
    left: '50%',
    top: 6,
    width: 184,
    height: 184,
    marginLeft: -92,
    borderRadius: 92,
    backgroundColor: '#FFFFFF',
    padding: 9,
    shadowColor: '#786428',
    shadowOpacity: 0.22,
    shadowRadius: 23,
    shadowOffset: { width: 0, height: 26 },
    elevation: 10,
  },
  tag: {
    position: 'absolute',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.1,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 2 },
  rule: { flex: 1, height: 1 },
  social: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
});
