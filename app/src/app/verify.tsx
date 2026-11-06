import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { AuthHero } from '@/components/auth/auth-hero';
import { completeAuth, useAuthForm } from '@/components/auth/auth-ui';
import { AccentButton } from '@/components/ui/buttons';
import { useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { AUTH_IMAGES } from '@/data/images';
import { useAuthExit } from '@/hooks/use-auth-nav';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function VerifyScreen() {
  useStatusBar('light');
  const { c } = useTheme();
  const chrome = useChrome();
  const exit = useAuthExit();
  const f = useAuthForm();
  const [busy, setBusy] = useState(false);
  const [focus, setFocus] = useState(-1);
  const [resend, setResend] = useState(30);
  const refs = [useRef<TextInputInstance>(null), useRef<TextInputInstance>(null), useRef<TextInputInstance>(null), useRef<TextInputInstance>(null)];
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const t = setTimeout(() => refs[0].current?.focus(), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (resend <= 0) return;
    const t = setTimeout(() => setResend((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resend]);

  const full = f.code.join('').length === 4;

  const change = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, '');
    const code = [...f.code];
    if (v.length > 1) {
      v.split('')
        .slice(0, 4 - i)
        .forEach((ch, k) => {
          code[i + k] = ch;
        });
      f.set({ code });
      refs[Math.min(3, i + v.length)].current?.focus();
      return;
    }
    code[i] = v;
    f.set({ code });
    if (v && i < 3) refs[i + 1].current?.focus();
  };

  const key = (i: number, k: string) => {
    if (k === 'Backspace' && !f.code[i] && i > 0) {
      const code = [...f.code];
      code[i - 1] = '';
      f.set({ code });
      refs[i - 1].current?.focus();
    }
  };

  const verify = () => {
    if (busy || !full) return;
    setBusy(true);
    timer.current = setTimeout(() => {
      setBusy(false);
      const forgot = useAuthForm.getState().from === 'forgot';
      completeAuth(forgot ? 'Password reset' : 'Account created', forgot ? 'You’re signed in on this device' : 'Welcome to Fig & Fennel');
      exit({ signedIn: true });
    }, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.max(chrome.insets.bottom, 16) + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHero
            img={AUTH_IMAGES.verify}
            eyebrow="One more step"
            title="Check your inbox"
            onBack={() => (router.canGoBack() ? router.back() : router.replace('/register'))}
          />
          <View style={{ paddingTop: 14, paddingHorizontal: 24, gap: 14 }}>
            <Txt s={14.5} lh={1.5} color={c.text2}>
              We sent a 4‑digit code to {f.email || 'your email'}. Enter it below to activate your account.
            </Txt>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {f.code.map((v, i) => (
                <TextInput
                  key={i}
                  ref={refs[i]}
                  value={v}
                  onChangeText={(t) => change(i, t)}
                  onKeyPress={(e) => key(i, e.nativeEvent.key)}
                  onFocus={() => setFocus(i)}
                  onBlur={() => setFocus(-1)}
                  keyboardType="number-pad"
                  textContentType={i === 0 ? 'oneTimeCode' : 'none'}
                  autoComplete={i === 0 ? 'sms-otp' : 'off'}
                  maxLength={4}
                  selectTextOnFocus
                  accessibilityLabel={`Digit ${i + 1}`}
                  style={[
                    styles.cell,
                    {
                      borderColor: focus === i ? c.accent : v ? c.lineStrong : c.line,
                      backgroundColor: c.surface1,
                      color: c.text1,
                      fontFamily: family(600),
                    },
                  ]}
                />
              ))}
            </View>
            <AccentButton label="Verify & continue" height={56} loading={busy} loadingLabel="Verifying…" dim={!full} onPress={verify} />
            <View style={{ alignItems: 'center' }}>
              {resend <= 0 ? (
                <PressableScale
                  onPress={() => {
                    setResend(30);
                    useApp.getState().showToast('Code resent', 'Check your inbox', 'mail');
                  }}
                  scaleTo={0.96}
                  style={{ paddingVertical: 6 }}
                >
                  <Txt s={13.5} w={700} color={c.accentText}>
                    Resend code
                  </Txt>
                </PressableScale>
              ) : (
                <Txt s={13.5} w={500} color={c.text2}>
                  Resend in 0:{String(resend).padStart(2, '0')}
                </Txt>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, minWidth: 0, height: 68, borderRadius: 20, borderWidth: 1.5, textAlign: 'center', fontSize: 28, paddingVertical: 0 },
});
