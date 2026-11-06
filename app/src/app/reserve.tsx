import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';

import { Dashes } from '@/components/ui/dashes';
import { Area } from '@/components/account/field';
import { PhotoGlass } from '@/components/account/photo-glass';
import { Icon, type IconName } from '@/components/icons/icon';
import { AccentButton, OutlineButton } from '@/components/ui/buttons';
import { Chip, chipColors, Radio } from '@/components/ui/controls';
import { FloatingBar, PhotoHeader, useChrome } from '@/components/ui/layout';
import { Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { OCCASIONS, RESTAURANT, SEATS, SLOT_GROUPS } from '@/data/content';
import { useStatusBar } from '@/hooks/use-status-bar';
import { DAYS14 } from '@/lib/dates';
import { cnt, firstName } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

interface Form {
  day: number;
  party: number;
  slot: string | null;
  slotT: string | null;
  seat: number;
  occ: string | null;
  req: string;
}

const EMPTY: Form = { day: 0, party: 2, slot: null, slotT: null, seat: 0, occ: null, req: '' };

export default function ReserveScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar('light');
  const [f, setF] = useState<Form>(EMPTY);
  const [bookedId, setBookedId] = useState<string | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);
  const set = (p: Partial<Form>) => setF((x) => ({ ...x, ...p }));

  const book = () => {
    const st = useApp.getState();
    if (!f.slot || !f.slotT) {
      st.showToast('Pick a time', 'Choose an available slot first', 'schedule');
      return;
    }
    if (!st.user) {
      router.push('/login');
      return;
    }
    const b = st.addBooking({ party: f.party, time: f.slotT, seat: SEATS[f.seat].l, day: f.day, occ: f.occ, req: f.req.trim() });
    if (!b) return;
    st.pushInbox('event_seat', 'Table booked · ' + b.code, `${DAYS14[f.day].label} at ${f.slotT} PM for ${cnt(f.party, 'guest')}`);
    setBookedId(b.id);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          ref={scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: chrome.bottomPad }}
          keyboardShouldPersistTaps="handled"
        >
          {bookedId ? (
            <Ticket
              id={bookedId}
              onCancelled={() => {
                setBookedId(null);
                set({ slot: null, slotT: null });
              }}
            />
          ) : (
            <ReserveForm f={f} set={set} />
          )}
        </ScrollView>
        <PhotoHeader />
        {bookedId ? (
          <FloatingBar>
            <AccentButton label="Done" onPress={() => router.back()} />
          </FloatingBar>
        ) : (
          <FloatingBar style={{ paddingLeft: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
              <Txt s={13.5} w={700} numberOfLines={1}>
                {`${DAYS14[f.day].label}${f.slot ? ' · ' + f.slotT + ' PM' : ''} · ${cnt(f.party, 'guest')}`}
              </Txt>
              <Txt s={11.5} w={500} color={c.text3}>
                {SEATS[f.seat].l}
              </Txt>
            </View>
            <AccentButton
              label={f.slot ? 'Reserve table' : 'Pick a time'}
              icon="event_seat"
              iconFill
              iconSize={19}
              fontSize={15}
              height={52}
              dim={!f.slot}
              onPress={book}
              style={{ paddingHorizontal: 22 }}
              contentStyle={{ gap: 6 }}
            />
          </FloatingBar>
        )}
      </View>
    </RevealScope>
  );
}

/* ------------------------------------------------------------------ form */

function HeroPill({ icon, label, star }: { icon: IconName; label: string; star?: boolean }) {
  return (
    <PhotoGlass style={styles.heroPill}>
      <Icon name={icon} size={14} fill={star} color={star ? fixed.star : fixed.paper} />
      <Txt s={12} w={600} color={fixed.paper}>
        {label}
      </Txt>
    </PhotoGlass>
  );
}

function Title({ children, right }: { children: string; right?: ReactNode }) {
  return (
    <View style={styles.titleRow}>
      <Txt s={18} w={600} ls={-0.01}>
        {children}
      </Txt>
      {right}
    </View>
  );
}

function ReserveForm({ f, set }: { f: Form; set: (p: Partial<Form>) => void }) {
  const { c } = useTheme();
  const { top } = useChrome();
  return (
    <>
      {/* 270pt under the design's 52pt status bar; taller status bars push the photo down with them. */}
      <Photo
        uri={SEATS[0].img}
        style={{ height: 270 + Math.max(0, top - 52) }}
        overlay={[fixed.roast(0.55), fixed.roast(0.1), fixed.roast(0.85)]}
        overlayLocations={[0, 0.4, 1]}
      >
        <View style={styles.heroText}>
          <Txt s={11} w={700} ls={0.1} upper color={fixed.peach}>
            Dine in · SoHo
          </Txt>
          <Txt s={32} w={600} lh={1.05} ls={-0.03} color={fixed.paper}>
            Reserve a table
          </Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            <HeroPill icon="star" star label="4.8 · 1.2k reviews" />
            <HeroPill icon="schedule" label="Open until 11 PM" />
            <HeroPill icon="location_on" label={RESTAURANT.street} />
          </View>
        </View>
      </Photo>

      <View style={[styles.body, { backgroundColor: c.bg }]}>
        <Reveal i={0} style={{ gap: 12 }}>
          <Title
            right={
              <Txt s={12} w={500} color={c.text3}>
                9+? Chat with us
              </Txt>
            }
          >
            How many guests?
          </Title>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const col = chipColors(f.party === n, c);
              return (
                <PressableScale
                  key={n}
                  scaleTo={0.93}
                  onPress={() => set({ party: n, slot: null, slotT: null })}
                  style={[styles.party, { borderColor: col.bd, backgroundColor: col.bg }]}
                >
                  <Txt s={16} w={600} color={col.fg}>
                    {n}
                  </Txt>
                </PressableScale>
              );
            })}
          </View>
        </Reveal>

        <Reveal i={1} style={{ gap: 12 }}>
          <Title
            right={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Legend color={c.ok} label="Open" />
                <Legend color={c.warn} label="Busy" />
              </View>
            }
          >
            Pick a date
          </Title>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            {DAYS14.map((d, i) => {
              const on = f.day === i;
              const col = chipColors(on, c);
              const dot = [c.ok, c.ok, c.warn, c.err][(i * 5 + 3) % 4];
              return (
                <PressableScale
                  key={i}
                  scaleTo={0.94}
                  onPress={() => set({ day: i, slot: null, slotT: null })}
                  style={[styles.day, { borderColor: col.bd, backgroundColor: col.bg }]}
                >
                  <Txt s={11} w={600} color={col.fg} style={{ opacity: 0.8 }}>
                    {d.wd}
                  </Txt>
                  <Txt s={21} w={600} lh={1.1} color={col.fg}>
                    {d.dn}
                  </Txt>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot, opacity: on ? 0 : 1 }} />
                </PressableScale>
              );
            })}
          </ScrollView>
        </Reveal>

        <Reveal i={2} style={{ gap: 14 }}>
          <Title>Choose a time</Title>
          {SLOT_GROUPS.map(([g, list], gi) => (
            <View key={g} style={{ gap: 8 }}>
              <Txt s={11} w={700} ls={0.1} upper color={c.text3}>
                {g}
              </Txt>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {list.map((t, ti) => {
                  const key = g + t;
                  const left = (f.day * 7 + gi * 5 + ti * 3 + f.party) % 6;
                  const full = left === 0;
                  const on = f.slot === key;
                  const col = chipColors(on, c);
                  const noteFg = on ? c.accentInk : left <= 2 && !full ? c.warn : c.text3;
                  return (
                    <PressableScale
                      key={key}
                      scaleTo={0.94}
                      onPress={() => {
                        if (!full) set({ slot: key, slotT: t });
                      }}
                      style={[styles.slot, { borderColor: col.bd, backgroundColor: col.bg, opacity: full ? 0.4 : 1 }]}
                    >
                      <Txt s={14.5} w={700} color={col.fg} strike={full}>
                        {t}
                      </Txt>
                      <Txt s={10.5} w={600} color={noteFg}>
                        {full ? 'Full' : left <= 2 ? `${left} left` : 'Open'}
                      </Txt>
                    </PressableScale>
                  );
                })}
              </View>
            </View>
          ))}
        </Reveal>

        <Reveal i={3} style={{ gap: 12 }}>
          <Title>Where would you like to sit?</Title>
          {SEATS.map((x, i) => {
            const on = f.seat === i;
            return (
              <PressableScale
                key={x.l}
                scaleTo={0.985}
                onPress={() => set({ seat: i })}
                style={[styles.seat, { borderColor: on ? c.accent : c.line, backgroundColor: on ? c.accentSoft : c.surface1 }]}
              >
                <Photo uri={x.img} radius={16} style={{ width: 84, height: 72 }} />
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name={x.icon} size={18} color={c.accent} />
                    <Txt s={15} w={700}>
                      {x.l}
                    </Txt>
                  </View>
                  <Txt s={12.5} color={c.text2}>
                    {x.note}
                  </Txt>
                  <Txt s={11.5} w={600} color={c.text3}>
                    {x.cap}
                  </Txt>
                </View>
                <Radio on={on} size={22} />
              </PressableScale>
            );
          })}
        </Reveal>

        <Reveal i={4} style={{ gap: 12 }}>
          <Title
            right={
              <Txt s={12} w={500} color={c.text3}>
                Optional
              </Txt>
            }
          >
            Special occasion?
          </Title>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {OCCASIONS.map(([l, icon]) => (
              <Chip key={l} label={l} icon={icon} on={f.occ === l} fontSize={13.5} padH={14} onPress={() => set({ occ: f.occ === l ? null : l })} />
            ))}
          </View>
          <Area rows={3} value={f.req} onChangeText={(req) => set({ req })} placeholder="Allergies, high chair, a quiet corner…" />
          <View style={[styles.info, { backgroundColor: c.surface2 }]}>
            <Icon name="info" size={19} color={c.text2} />
            <Txt s={12.5} lh={1.5} color={c.text2} style={{ flex: 1 }}>
              We hold tables for 15 minutes. Free cancellation up to 2 hours before. Booking earns 100 Fig points.
            </Txt>
          </View>
        </Reveal>
      </View>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
      <Txt s={11.5} w={500} color={c.text3}>
        {label}
      </Txt>
    </View>
  );
}

/* ------------------------------------------------------------------ ticket */

const SP = { damping: 12, stiffness: 160, mass: 0.9 };

function Ticket({ id, onCancelled }: { id: string; onCancelled: () => void }) {
  const { c } = useTheme();
  const { top } = useChrome();
  const b = useApp((s) => s.bookings.find((x) => x.id === id));
  const user = useApp((s) => s.user);
  const p = useSharedValue(0);
  const badge = useSharedValue(0.3);

  useEffect(() => {
    p.set(0);
    badge.set(0.3);
    p.set(withDelay(120, withSpring(1, SP)));
    badge.set(withDelay(500, withSpring(1, { damping: 9, stiffness: 200 })));
  }, [id, p, badge]);

  const cardSt = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.value * 1.6),
    transform: [{ translateY: 40 * (1 - p.value) }, { scale: 0.94 + 0.06 * p.value }],
  }));
  const badgeSt = useAnimatedStyle(() => ({ transform: [{ scale: badge.value }] }));

  if (!b) return null;
  const seat = SEATS.find((x) => x.l === b.seat) ?? SEATS[0];
  const time = `${b.time} PM`;
  const st = useApp.getState();

  return (
    <>
      <View style={[styles.doneHead, { height: 230 + Math.max(0, top - 52), paddingTop: 108 + Math.max(0, top - 52) }]}>
        <Txt s={11} w={700} ls={0.1} upper color={fixed.peach}>
          Reservation confirmed
        </Txt>
        <Txt s={28} w={600} lh={1.05} ls={-0.03} color={fixed.paper}>
          See you soon, {firstName(user?.name)}
        </Txt>
      </View>
      <Animated.View style={[{ paddingHorizontal: 20, marginTop: -34, gap: 12 }, cardSt]}>
        <View style={styles.ticketShadow}>
          <View style={[styles.ticket, { backgroundColor: c.surface1, borderColor: c.line }]}>
            <Photo uri={seat.img} style={{ height: 130 }} overlay={[fixed.roast(0), fixed.roast(0.6)]}>
              <Animated.View style={[styles.okBadge, { backgroundColor: c.ok }, badgeSt]}>
                <Icon name="check" size={26} color="#FFFFFF" />
              </Animated.View>
              <View style={styles.seatLabel}>
                <Icon name={seat.icon} size={19} fill color={fixed.paper} />
                <Txt s={17} w={600} color={fixed.paper}>
                  {seat.l}
                </Txt>
              </View>
            </Photo>
            <View style={styles.grid}>
              <TicketField label="Date" value={DAYS14[b.day]?.long ?? ''} big full />
              <TicketField label="Time" value={time} big />
              <TicketField label="Guests" value={cnt(b.party, 'guest')} big />
              <TicketField label="Occasion" value={b.occ || 'None'} />
              <TicketField label="Requests" value={b.req || 'No special requests'} muted />
            </View>
            <View style={{ height: 30, marginVertical: 6, justifyContent: 'center' }}>
              <View style={[styles.notch, { left: -15, backgroundColor: c.bg, borderColor: c.line }]} />
              <View style={[styles.notch, { right: -15, backgroundColor: c.bg, borderColor: c.line }]} />
              <Dashes color={c.lineStrong} style={{ marginHorizontal: 24 }} />
            </View>
            <View style={styles.confirm}>
              <View style={{ gap: 3 }}>
                <Txt s={11} w={700} ls={0.1} upper color={c.text3}>
                  Confirmation
                </Txt>
                <Txt s={24} w={600} ls={0.04} color={c.accentText}>
                  {b.code}
                </Txt>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Txt s={12} w={700}>
                  {RESTAURANT.name}
                </Txt>
                <Txt s={12} w={500} color={c.text3}>
                  {RESTAURANT.streetFull}
                </Txt>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TicketAction icon="event" label="Add to calendar" onPress={() => st.showToast('Added to calendar', `Fig & Fennel · ${time}`, 'event')} />
          <TicketAction icon="directions" label="Directions" onPress={() => st.showToast('Opening Maps', RESTAURANT.city, 'directions')} />
        </View>
        <OutlineButton
          label="Cancel reservation"
          height={46}
          color={c.err}
          fontSize={14}
          borderColor="transparent"
          onPress={() => {
            st.setBookingStatus(b.id, 2);
            st.showToast('Reservation cancelled', 'We’ve let the kitchen know', 'event_busy');
            onCancelled();
          }}
        />
      </Animated.View>
    </>
  );
}

function TicketField({ label, value, big, full, muted }: { label: string; value: string; big?: boolean; full?: boolean; muted?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={{ width: full ? '100%' : '46%', flexGrow: full ? 0 : 1, gap: 3 }}>
      <Txt s={11} w={700} ls={0.1} upper color={c.text3}>
        {label}
      </Txt>
      {big ? (
        <Txt s={19} w={600} ls={-0.01}>
          {value}
        </Txt>
      ) : (
        <Txt s={14} w={600} color={muted ? c.text2 : c.text1}>
          {value}
        </Txt>
      )}
    </View>
  );
}

function TicketAction({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <PressableScale onPress={onPress} scaleTo={0.96} style={[styles.ticketBtn, { borderColor: c.line, backgroundColor: c.surface1 }]}>
      <Icon name={icon} size={20} color={c.accent} />
      <Txt s={14} w={700}>
        {label}
      </Txt>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  heroText: { position: 'absolute', left: 20, right: 20, bottom: 42, gap: 8 },
  heroPill: { height: 28, paddingHorizontal: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 },
  body: { marginTop: -26, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 24, paddingHorizontal: 20, paddingBottom: 10, gap: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  party: { flex: 1, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  day: { width: 58, height: 78, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  slot: { flex: 1, height: 56, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  seat: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 8, paddingLeft: 8, paddingRight: 14, borderRadius: 22, borderWidth: 1.5 },
  info: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16 },
  doneHead: { height: 230, backgroundColor: fixed.ink, paddingTop: 108, paddingHorizontal: 24, gap: 6 },
  ticketShadow: { borderRadius: 28, shadowColor: '#1A1A1A', shadowOpacity: 0.16, shadowRadius: 25, shadowOffset: { width: 0, height: 24 }, elevation: 10 },
  ticket: { borderRadius: 28, overflow: 'hidden', borderWidth: 1 },
  okBadge: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  seatLabel: { position: 'absolute', left: 16, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 18, paddingHorizontal: 18, paddingBottom: 6, rowGap: 16, columnGap: 16 },
  notch: { position: 'absolute', top: 0, width: 30, height: 30, borderRadius: 15, borderWidth: 1 },
  confirm: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, paddingHorizontal: 18, paddingBottom: 18 },
  ticketBtn: { flex: 1, height: 52, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
