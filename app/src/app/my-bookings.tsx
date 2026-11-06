import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { bookingStatus } from '@/components/account/status';
import { EmptyHero } from '@/components/empty-hero';
import { AccentButton } from '@/components/ui/buttons';
import { StatusPill } from '@/components/ui/controls';
import { ScreenHeader, useChrome } from '@/components/ui/layout';
import { Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { SEATS } from '@/data/content';
import { useStatusBar } from '@/hooks/use-status-bar';
import { DAYS14 } from '@/lib/dates';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function MyBookingsScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const mine = useApp(useShallow((s) => s.bookings.filter((b) => b.mine)));
  const goReserve = () => router.push('/reserve');

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}
        >
          {!mine.length ? (
            <EmptyHero
              icon="event_seat"
              fill
              top={50}
              title="No reservations yet"
              text="Book a table in the dining room, on the patio or at the chef’s counter."
              cta="Book a table"
              onPress={goReserve}
            />
          ) : null}
          {mine.map((b, i) => {
            const st = bookingStatus(b.status, c);
            const seat = SEATS.find((x) => x.l === b.seat) ?? SEATS[0];
            return (
              <Reveal key={b.id} i={1 + Math.min(i, 6)}>
                <View style={[styles.card, { borderColor: c.line, backgroundColor: c.surface1 }]}>
                  <View style={styles.row}>
                    <Photo uri={seat.img} radius={16} style={{ width: 76, height: 76 }} />
                    <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                      <Txt s={17} w={600}>
                        {(DAYS14[b.day] ?? DAYS14[0]).label} · {b.time} PM
                      </Txt>
                      <Txt s={12.5} w={500} color={c.text2}>
                        {cnt(b.party, 'guest')} · {b.seat}
                      </Txt>
                      <Txt s={11.5} w={600} color={c.text3}>
                        {b.code}
                      </Txt>
                    </View>
                    <StatusPill label={st.label} color={st.color} padH={9} />
                  </View>
                  {b.status === 0 ? (
                    <PressableScale
                      scaleTo={0.98}
                      onPress={() => {
                        const s = useApp.getState();
                        s.setBookingStatus(b.id, 2);
                        s.showToast('Reservation cancelled', b.code ?? '', 'event_busy');
                      }}
                      style={[styles.cancel, { borderTopColor: c.line }]}
                    >
                      <Txt s={13} w={700} color={c.err}>
                        Cancel
                      </Txt>
                    </PressableScale>
                  ) : null}
                </View>
              </Reveal>
            );
          })}
        </ScrollView>
        <ScreenHeader
          title="My reservations"
          right={
            <AccentButton
              label="New"
              icon="add"
              iconSize={18}
              height={38}
              fontSize={13}
              onPress={goReserve}
              style={{ paddingHorizontal: 14 }}
              contentStyle={{ gap: 4 }}
            />
          }
        />
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 14 },
  cancel: { height: 44, borderTopWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
