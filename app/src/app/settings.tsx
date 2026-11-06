import { ScrollView, View } from 'react-native';

import { ToggleRow } from '@/components/account/rows';
import { Chip } from '@/components/ui/controls';
import { Eyebrow, ListCard, ListRow, ScreenHeader, useChrome } from '@/components/ui/layout';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { RESTAURANT } from '@/data/content';
import type { Prefs } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

type BoolPref = Exclude<keyof Prefs, 'lang'>;

const NOTIF: [BoolPref, string, string][] = [
  ['orderNotif', 'Order updates', 'Live status from kitchen to door'],
  ['offers', 'Offers & deals', 'Weekly codes and limited dishes'],
  ['journalNotif', 'New journal stories', 'Recipes and kitchen news'],
  ['sms', 'SMS updates', 'Text me when my courier is close'],
];

const PRIVACY: [BoolPref, string, string][] = [
  ['location', 'Precise location', 'Faster address detection at checkout'],
  ['personal', 'Personalised picks', 'Recommendations based on your orders'],
];

const LANGS: Prefs['lang'][] = ['English', 'Español', 'Français'];

export default function SettingsScreen() {
  const { c, isDark } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const prefs = useApp((s) => s.prefs);
  const setPrefs = useApp((s) => s.setPrefs);
  const setTheme = useApp((s) => s.setTheme);
  const toast = useApp((s) => s.showToast);

  const rows = (list: [BoolPref, string, string][]) =>
    list.map(([k, l, sub], i) => (
      <ToggleRow key={k} title={l} sub={sub} on={prefs[k]} last={i === list.length - 1} onPress={() => setPrefs({ [k]: !prefs[k] })} />
    ));

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}
        >
          <Reveal i={0} style={{ gap: 8 }}>
            <Eyebrow>Language</Eyebrow>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {LANGS.map((l) => (
                <Chip key={l} label={l} on={prefs.lang === l} height={44} fontSize={13.5} onPress={() => setPrefs({ lang: l })} style={{ flex: 1 }} />
              ))}
            </View>
          </Reveal>
          <Reveal i={1} style={{ gap: 8 }}>
            <Eyebrow>Notifications</Eyebrow>
            <ListCard radius={20}>{rows(NOTIF)}</ListCard>
          </Reveal>
          <Reveal i={2} style={{ gap: 8 }}>
            <Eyebrow>Privacy</Eyebrow>
            <ListCard radius={20}>{rows(PRIVACY)}</ListCard>
          </Reveal>
          <Reveal i={3} style={{ gap: 8 }}>
            <Eyebrow>Appearance</Eyebrow>
            <ListCard radius={20}>
              <ToggleRow
                title="Dark mode"
                sub="Warm dark theme, easier on the eyes at night"
                on={isDark}
                last
                onPress={() => setTheme(isDark ? 'light' : 'dark')}
              />
            </ListCard>
          </Reveal>
          <Reveal i={4} style={{ gap: 8 }}>
            <Eyebrow>Your data</Eyebrow>
            <ListCard radius={20}>
              <ListRow
                bare
                icon="history"
                title="Clear search history"
                minHeight={56}
                right={null}
                onPress={() => toast('Search history cleared', 'Your recent searches are gone', 'history')}
              />
              <ListRow
                bare
                icon="download"
                title="Download my data"
                minHeight={56}
                right={null}
                onPress={() => toast('Data export requested', 'We’ll email a download link within 24h', 'download')}
              />
              <ListRow
                bare
                icon="person_remove"
                iconColor={c.err}
                title="Delete account"
                titleColor={c.err}
                minHeight={56}
                right={null}
                last
                onPress={() => toast('Request received', 'We’ll email you to confirm deletion', 'mail')}
              />
            </ListCard>
          </Reveal>
          <Txt s={12} w={500} color={c.text3} align="center" style={{ paddingVertical: 8 }}>
            {RESTAURANT.name} {RESTAURANT.version} · Terms · Privacy
          </Txt>
        </ScrollView>
        <ScreenHeader title="Settings" />
      </View>
    </RevealScope>
  );
}
