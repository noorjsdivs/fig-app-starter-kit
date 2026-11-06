import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AuthCta, emailOk, Field, PastelTile, pwScore, PwToggle, SoftChip, useAuthForm } from '@/components/auth/auth-ui';
import { Icon } from '@/components/icons/icon';
import { Glow, REGISTER_GLOW } from '@/components/ui/glow';
import { useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { AUTH_IMAGES } from '@/data/images';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function RegisterScreen() {
  useStatusBar();
  const { c } = useTheme();
  const chrome = useChrome();
  const f = useAuthForm();
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const score = pwScore(f.pw);
  const valid = f.terms && f.pw.length >= 8 && !!f.name.trim();

  const register = () => {
    if (busy) return;
    if (!valid) {
      if (!f.terms) useApp.getState().showToast('One more thing', 'Please accept the terms to continue', 'info');
      return;
    }
    setBusy(true);
    timer.current = setTimeout(() => {
      setBusy(false);
      f.set({ from: 'register', code: ['', '', '', ''] });
      router.push('/verify');
    }, 800);
  };

  const back = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Glow spots={REGISTER_GLOW} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: chrome.top + 4, paddingHorizontal: 24, paddingBottom: Math.max(chrome.insets.bottom, 16) + 10 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <SoftChip label="Back" onPress={back} style={{ width: 52, height: 52, borderRadius: 26 }}>
              <Icon name="arrow_back_ios_new" size={20} color={c.text1} />
            </SoftChip>
            <Txt s={18} w={500}>
              Create account
            </Txt>
            <View style={{ width: 52 }} />
          </View>

          <View style={styles.intro}>
            <View style={styles.plate}>
              <Image source={{ uri: AUTH_IMAGES.register }} contentFit="cover" style={{ flex: 1, borderRadius: 49 }} />
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
              <Txt s={13} w={500} color={c.text3}>
                Join Fig Club
              </Txt>
              <Txt s={28} w={600} lh={1.1} ls={-0.02}>
                Fresh food, made easy
              </Txt>
            </View>
          </View>

          <View style={styles.perks}>
            <PastelTile label="First order" value="Free" unit="delivery" colors={['#FFF6CF', '#FFE9A3']} style={styles.perk} />
            <PastelTile label="Welcome" value="10%" unit="off" colors={['#FFE7D2', '#FFD2AE']} style={styles.perk} />
            <PastelTile label="Every order" value="2×" unit="points" colors={['#FFE3EC', '#FFCCDD']} style={styles.perk} />
          </View>

          <View style={{ gap: 12, marginTop: 20 }}>
            <Field
              icon="person"
              height={56}
              value={f.name}
              onChangeText={(name) => f.set({ name })}
              placeholder="Full name"
              autoComplete="name"
              textContentType="name"
            />
            <Field
              icon="mail"
              height={56}
              value={f.email}
              onChangeText={(email) => f.set({ email })}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!emailOk(f.email)}
            />
            <Field
              icon="lock"
              height={56}
              value={f.pw}
              onChangeText={(pw) => f.set({ pw })}
              placeholder="Password (8+ characters)"
              secureTextEntry={!f.showPw}
              autoComplete="new-password"
              textContentType="newPassword"
              right={<PwToggle />}
            />
            <View style={styles.strength}>
              <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
                {[1, 2, 3].map((k) => (
                  <View
                    key={k}
                    style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: score >= k ? [c.surface2, c.err, c.warn, c.ok][score] : c.surface2 }}
                  />
                ))}
              </View>
              <Txt s={11.5} w={500} color={c.text3} align="right" style={{ minWidth: 46 }}>
                {['', 'Weak', 'Good', 'Strong'][score]}
              </Txt>
            </View>
            <PressableScale
              onPress={() => f.set({ terms: !f.terms })}
              scaleTo={0.98}
              style={styles.terms}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: f.terms }}
            >
              <View style={[styles.check, { borderColor: f.terms ? c.accent : c.lineStrong, backgroundColor: f.terms ? c.accent : 'transparent' }]}>
                {f.terms ? <Icon name="check" size={15} color="#FFFFFF" /> : null}
              </View>
              <Txt s={13} lh={1.4} color={c.text2}>
                I agree to the Terms and Privacy Policy
              </Txt>
            </PressableScale>
            <AuthCta label="Create account" busyLabel="Creating…" busy={busy} onPress={register} height={58} dim={!valid} />
          </View>

          <View style={{ marginTop: 'auto', paddingTop: 14, alignItems: 'center' }}>
            <PressableScale onPress={() => router.replace('/login')} scaleTo={0.97} style={{ paddingVertical: 8 }}>
              <Txt s={13.5} color={c.text2}>
                Already a member?{' '}
                <Txt s={13.5} w={600} color={c.accentText}>
                  Sign in
                </Txt>
              </Txt>
            </PressableScale>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  intro: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 },
  plate: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFFFFF',
    padding: 7,
    shadowColor: '#965A28',
    shadowOpacity: 0.2,
    shadowRadius: 17,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
  perks: { flexDirection: 'row', gap: 10, marginTop: 20 },
  perk: { flex: 1, paddingTop: 10, paddingBottom: 11 },
  strength: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 2, paddingHorizontal: 4 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
