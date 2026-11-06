import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { NotifSheet } from '@/components/account/notif-sheet';
import { Icon } from '@/components/icons/icon';
import { AccentFill, LinkButton } from '@/components/ui/buttons';
import { ScreenHeader, useChrome } from '@/components/ui/layout';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function InboxScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const inbox = useApp((s) => s.inbox);
  const [openId, setOpenId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const item = inbox.find((n) => n.id === openId) ?? null;

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: chrome.bottomPad, gap: 14 }}
        >
          {!inbox.length ? (
            <Txt s={15} w={500} color={c.text2} align="center" style={{ marginTop: 40 }}>
              You’re all caught up.
            </Txt>
          ) : null}
          {inbox.map((n, i) => (
            <Reveal key={n.id} i={Math.min(i, 8)}>
              <PressableScale
                scaleTo={0.98}
                onPress={() => {
                  useApp.getState().readNotif(n.id);
                  setOpenId(n.id);
                  setVisible(true);
                }}
                style={[styles.row, { borderColor: c.line, backgroundColor: n.unread ? c.accentSoft : c.surface1 }]}
              >
                <View style={[styles.tile, { backgroundColor: c.surface1, borderColor: c.line }]}>
                  <Icon name={n.icon} size={21} fill color={c.accent} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <Txt s={14.5} w={700}>
                    {n.title}
                  </Txt>
                  <Txt s={13} lh={1.45} color={c.text2}>
                    {n.sub}
                  </Txt>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 8 }}>
                  <Txt s={11.5} w={500} color={c.text3}>
                    {n.time}
                  </Txt>
                  <View style={{ width: 9, height: 9, borderRadius: 4.5, opacity: n.unread ? 1 : 0 }}>
                    <AccentFill radius={4.5} />
                  </View>
                </View>
              </PressableScale>
            </Reveal>
          ))}
        </ScrollView>
        <ScreenHeader
          title="Notifications"
          right={<LinkButton label="Mark all read" onPress={() => useApp.getState().readAllNotifs()} style={{ paddingHorizontal: 12 }} />}
        />
        <NotifSheet item={item} visible={visible && !!item} onClose={() => setVisible(false)} />
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 20, borderWidth: 1 },
  tile: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
