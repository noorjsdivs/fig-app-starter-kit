import { ScrollView, StyleSheet, View } from 'react-native';

import { AdminHeader, GrowBar, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon } from '@/components/icons/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Avatar } from '@/components/ui/media';
import { Reveal, RevealScope, useEntered } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, initials } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

const BASE: Record<number, number> = { 5: 820, 4: 260, 3: 70, 2: 18, 1: 12 };

export default function AdminReviews() {
  return (
    <RevealScope>
      <Reviews />
    </RevealScope>
  );
}

function Reviews() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('push');
  const entered = useEntered();
  const reviews = useApp((s) => s.reviews);
  const reply = useApp((s) => s.replyReview);
  const avg = (reviews.reduce((a, r) => a + r.stars, 0) / Math.max(1, reviews.length)).toFixed(1);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0}>
          <View style={[styles.summary, { borderColor: c.line, backgroundColor: c.surface1 }]}>
            <View style={styles.avg}>
              <Txt s={44} w={600} ls={-0.03}>
                {avg}
              </Txt>
              <Txt s={14} w={700} ls={0.05} color={fixed.star}>
                ★★★★★
              </Txt>
              <Txt s={11} w={500} color={c.text3}>
                {cnt(reviews.length + 1180, 'rating')}
              </Txt>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              {[5, 4, 3, 2, 1].map((n) => {
                const base = BASE[n] + reviews.filter((r) => r.stars === n).length;
                return (
                  <View key={n} style={styles.distRow}>
                    <Txt s={11.5} w={600} color={c.text3} style={{ width: 8 }}>
                      {n}
                    </Txt>
                    <View style={[styles.distTrack, { backgroundColor: c.surface2 }]}>
                      <GrowBar
                        axis="width"
                        pct={entered ? Math.min(100, (base / 830) * 100) : 0}
                        delay={200 + (5 - n) * 80}
                        style={{ height: '100%', borderRadius: 4, backgroundColor: fixed.star }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Reveal>
        {reviews.map((r, i) => (
          <Reveal key={`${r.name}-${r.time}-${i}`} i={2 + Math.min(i, 8)}>
            <View style={[styles.card, { borderColor: c.line, backgroundColor: c.surface1 }]}>
              <View style={styles.head}>
                <Avatar text={initials(r.name)} size={38} fontSize={12.5} />
                <View style={{ flex: 1, gap: 1 }}>
                  <Txt s={14} w={700}>
                    {r.name}
                  </Txt>
                  <Txt s={11.5} color={c.text3} numberOfLines={1}>
                    {r.dish} · {r.time}
                  </Txt>
                </View>
                <Txt s={13} w={700} ls={0.04}>
                  <Txt s={13} w={700} color={fixed.star}>
                    {'★★★★★'.slice(0, r.stars)}
                  </Txt>
                  <Txt s={13} w={700} color={c.lineStrong}>
                    {'★★★★★'.slice(0, 5 - r.stars)}
                  </Txt>
                </Txt>
              </View>
              <Txt s={14} lh={1.5} color={c.text2}>
                “{r.text}”
              </Txt>
              {r.replied ? (
                <View style={styles.replied}>
                  <Icon name="check_circle" size={16} fill color={c.ok} />
                  <Txt s={12.5} w={600} color={c.ok}>
                    Replied
                  </Txt>
                </View>
              ) : (
                <PressableScale onPress={() => reply(i)} scaleTo={0.95} style={[styles.reply, { borderColor: c.lineStrong }]}>
                  <Icon name="reply" size={16} />
                  <Txt s={12.5} w={700}>
                    Reply with thanks
                  </Txt>
                </PressableScale>
              )}
            </View>
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Reviews" back />
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 22, borderWidth: 1 },
  avg: { width: 86, alignItems: 'center', gap: 2 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distTrack: { flex: 1, height: 7, borderRadius: 4, overflow: 'hidden' },
  card: { gap: 10, padding: 14, borderRadius: 20, borderWidth: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  replied: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reply: { alignSelf: 'flex-start', height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
});
