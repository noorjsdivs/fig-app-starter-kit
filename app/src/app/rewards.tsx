import { ScrollView, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Icon } from '@/components/icons/icon';
import { AccentButton } from '@/components/ui/buttons';
import { ProgressBar } from '@/components/ui/controls';
import { ListCard, ScreenHeader, useChrome } from '@/components/ui/layout';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope, useEntered } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { EARN, REWARDS, TIERS } from '@/data/content';
import type { Reward } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { money } from '@/lib/format';
import { selectMyOrders, useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

export default function RewardsScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const points = useApp((s) => s.points);
  const mine = useApp(useShallow(selectMyOrders));
  const on = useEntered();

  const ti = TIERS.filter((t) => points >= t[1]).length - 1;
  const tier = TIERS[ti];
  const next = TIERS[ti + 1];
  const pct = next ? Math.min(100, ((points - tier[1]) / (next[1] - tier[1])) * 100) : 100;
  const hist = [
    ...mine.filter((o) => o.step === 3).map((o) => ({ l: 'Order ' + o.no, t: o.time, p: '+' + Math.round(o.total * 10) })),
    { l: 'Welcome bonus', t: 'Sep 2', p: '+500' },
  ].slice(0, 4);

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: 40, gap: 16 }}
        >
          <Reveal i={0}>
            <View style={styles.hero}>
              <View style={styles.orb} />
              <View style={styles.between}>
                <View style={styles.tier}>
                  <Icon name="workspace_premium" size={16} fill color={fixed.peach} />
                  <Txt s={11.5} w={700} color={fixed.paper}>
                    {tier[0]} member
                  </Txt>
                </View>
                <Txt s={12} w={500} color={fixed.paperA(0.65)}>
                  Worth about {money(points / 100)}
                </Txt>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <Txt s={52} w={600} lh={1.05} ls={-0.04} color={fixed.paper}>
                  {points.toLocaleString('en-US')}
                </Txt>
                <Txt s={15} w={600} color={fixed.paperA(0.7)}>
                  points
                </Txt>
              </View>
              <ProgressBar pct={on ? pct : 0} height={8} track="rgba(255,255,255,0.12)" fill={fixed.orange} delay={300} duration={1100} />
              <Txt s={12.5} w={500} color={fixed.paperA(0.75)}>
                {next ? `${(next[1] - points).toLocaleString('en-US')} pts to ${next[0]}` : 'You’ve reached the top tier'}
              </Txt>
            </View>
          </Reveal>

          <View style={styles.titleRow}>
            <Txt s={18} w={600} ls={-0.01}>
              Redeem your points
            </Txt>
            <Txt s={12} w={500} color={c.text3}>
              Added straight to your cart
            </Txt>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {REWARDS.map((r, i) => (
              <Reveal key={r.id} i={2 + i} style={{ width: '47%', flexGrow: 1 }}>
                <RewardCard r={r} />
              </Reveal>
            ))}
          </View>

          <Txt s={18} w={600} ls={-0.01}>
            Ways to earn
          </Txt>
          <ListCard radius={20}>
            {EARN.map(([icon, l, p], i) => (
              <View key={l} style={[styles.row, { borderBottomColor: c.line, borderBottomWidth: i === EARN.length - 1 ? 0 : 1 }]}>
                <View style={[styles.earnTile, { backgroundColor: c.accentSoft }]}>
                  <Icon name={icon} size={20} fill color={c.accent} />
                </View>
                <Txt s={14} w={600} style={{ flex: 1 }}>
                  {l}
                </Txt>
                <Txt s={14} w={600} color={c.accentText}>
                  {p}
                </Txt>
              </View>
            ))}
          </ListCard>

          <View style={[styles.refer, { backgroundColor: c.accentSoft }]}>
            <View style={{ flex: 1, gap: 3 }}>
              <Txt s={17} w={600}>
                Give $10, get 500 pts
              </Txt>
              <Txt s={12.5} color={c.text2}>
                Friends get $10 off their first order with code ALEX10.
              </Txt>
            </View>
            <AccentButton
              label="Invite"
              icon="ios_share"
              iconSize={17}
              height={42}
              fontSize={13.5}
              onPress={() => useApp.getState().showToast('Invite link copied', 'figandfennel.example/r/ALEX10', 'link')}
              style={{ paddingHorizontal: 16 }}
              contentStyle={{ gap: 6 }}
            />
          </View>

          <Txt s={18} w={600} ls={-0.01}>
            Points history
          </Txt>
          <ListCard radius={20}>
            {hist.map((x, i) => (
              <View key={x.l + x.t} style={[styles.row, { borderBottomColor: c.line, borderBottomWidth: i === hist.length - 1 ? 0 : 1 }]}>
                <View style={{ flex: 1, gap: 1 }}>
                  <Txt s={13.5} w={600}>
                    {x.l}
                  </Txt>
                  <Txt s={11.5} color={c.text3}>
                    {x.t}
                  </Txt>
                </View>
                <Txt s={14} w={600} color={c.ok}>
                  {x.p}
                </Txt>
              </View>
            ))}
          </ListCard>
        </ScrollView>
        <ScreenHeader title="Fig Club" />
      </View>
    </RevealScope>
  );
}

function RewardCard({ r }: { r: Reward }) {
  const { c } = useTheme();
  const points = useApp((s) => s.points);
  const got = useApp((s) => s.redeemed.includes(r.id));
  const dish = useApp((s) => (r.dish ? s.menu.find((m) => m.id === r.dish) : undefined));
  const can = points >= r.pts;
  const muted = got || !can;
  return (
    <View style={[styles.reward, { borderColor: c.line, backgroundColor: c.surface1 }]}>
      {dish ? (
        <View style={{ height: 96 }}>
          <DishImage uri={dish.img} />
        </View>
      ) : (
        <View style={[styles.noImg, { backgroundColor: c.accentSoft }]}>
          <Icon name="local_offer" size={40} fill color={c.accent} />
        </View>
      )}
      <Txt s={13.5} w={700} lh={1.25} style={{ paddingHorizontal: 5, minHeight: 34 }}>
        {r.l}
      </Txt>
      <View style={{ paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Icon name="loyalty" size={15} fill color={c.accentText} />
        <Txt s={14} w={600} color={c.accentText}>
          {r.pts.toLocaleString('en-US')} pts
        </Txt>
      </View>
      <PressableScale scaleTo={0.95} onPress={() => useApp.getState().redeem(r)} style={[styles.redeem, { backgroundColor: muted ? c.surface2 : c.accent }]}>
        <Txt s={13} w={700} color={muted ? c.text3 : c.accentInk}>
          {got ? 'Redeemed' : can ? 'Redeem' : `${r.pts - points} more`}
        </Txt>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 20, borderRadius: 28, backgroundColor: fixed.ink, overflow: 'hidden', gap: 14 },
  orb: { position: 'absolute', right: -50, top: -50, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,122,26,0.16)' },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tier: { height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  reward: { borderRadius: 22, borderWidth: 1, paddingTop: 7, paddingHorizontal: 7, paddingBottom: 10, gap: 8 },
  noImg: { height: 96, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  redeem: { height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  earnTile: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  refer: { padding: 16, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 14 },
});
