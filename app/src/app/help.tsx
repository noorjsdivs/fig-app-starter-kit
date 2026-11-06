import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Collapse, Rotator } from '@/components/account/accordion';
import { IssueSheet } from '@/components/account/issue-sheet';
import { orderStatus } from '@/components/account/status';
import { Icon, type IconName } from '@/components/icons/icon';
import { AccentButton, AccentFill, LinkButton } from '@/components/ui/buttons';
import { ListCard, ScreenHeader, useChrome } from '@/components/ui/layout';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { FAQS, HELP_TOPICS, RESTAURANT } from '@/data/content';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, firstName, money } from '@/lib/format';
import { selectMyOrders, useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

export default function HelpScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const user = useApp((s) => s.user);
  const mine = useApp(useShallow(selectMyOrders));
  const dishOf = useApp((s) => s.dishOf);
  const toast = useApp((s) => s.showToast);
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('All');
  const [openId, setOpenId] = useState<string | null>('f0');
  const [issue, setIssue] = useState<{ open: boolean; no: string | null }>({ open: false, no: null });

  const ql = q.trim().toLowerCase();
  const list = FAQS.filter((f) => (topic === 'All' || f.topic === topic) && (!ql || (f.q + ' ' + f.a).toLowerCase().includes(ql)));
  const last = mine[0];
  const chat = () => toast('Chat started', 'Mia from Fig usually replies in 2 min', 'chat');

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: 40, gap: 16 }}
        >
          <Reveal i={0} style={{ gap: 12 }}>
            <Txt s={28} w={600} lh={1.05} ls={-0.03}>
              {user ? `Hi ${firstName(user.name)}, how can we help?` : 'How can we help?'}
            </Txt>
            <View style={[styles.search, { backgroundColor: c.surface1, borderColor: c.line }]}>
              <Icon name="search" size={21} color={c.text3} />
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search refunds, delivery, allergens…"
                placeholderTextColor={c.text3}
                selectionColor={c.accent}
                allowFontScaling={false}
                returnKeyType="search"
                style={[styles.searchInput, { color: c.text1, fontFamily: family(500) }]}
              />
              {q ? (
                <PressableScale scaleTo={0.9} accessibilityLabel="Clear" onPress={() => setQ('')} style={[styles.clear, { backgroundColor: c.surface2 }]}>
                  <Icon name="close" size={17} />
                </PressableScale>
              ) : null}
            </View>
          </Reveal>

          {last ? (
            <View style={styles.last}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <DishImage uri={dishOf(last.items[0].id).img} size={52} />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Txt s={11} w={600} ls={0.08} upper color={fixed.peach}>
                    Your latest order
                  </Txt>
                  <Txt s={15} w={700} color={fixed.paper}>
                    {last.no}
                  </Txt>
                  <Txt s={12} color={fixed.paperA(0.7)}>
                    {last.time} · {money(last.total)} · {orderStatus(last.step, c).label}
                  </Txt>
                </View>
              </View>
              <PressableScale scaleTo={0.97} onPress={() => setIssue({ open: true, no: last.no })} style={styles.lastBtn}>
                <Icon name="report" size={19} fill color="#FFFFFF" />
                <Txt s={14} w={700} color="#FFFFFF">
                  Get help with this order
                </Txt>
              </PressableScale>
            </View>
          ) : null}

          <View style={{ gap: 10 }}>
            <View style={styles.titleRow}>
              <Txt s={18} w={600} ls={-0.01}>
                Browse by topic
              </Txt>
              {topic !== 'All' ? (
                <LinkButton
                  label="Show all"
                  onPress={() => {
                    setTopic('All');
                    setQ('');
                  }}
                  style={{ paddingVertical: 4 }}
                />
              ) : null}
            </View>
            <View style={styles.grid}>
              {HELP_TOPICS.map(([l, icon]) => (
                <TopicTile
                  key={l}
                  label={l}
                  icon={icon}
                  count={FAQS.filter((f) => f.topic === l).length}
                  on={topic === l}
                  onPress={() => {
                    setTopic(topic === l ? 'All' : l);
                    setOpenId(null);
                  }}
                />
              ))}
            </View>
          </View>

          <View style={[styles.titleRow, { marginTop: 4 }]}>
            <Txt s={18} w={600} ls={-0.01}>
              {topic === 'All' ? (ql ? 'Search results' : 'Popular questions') : topic}
            </Txt>
            <Txt s={12} w={500} color={c.text3}>
              {cnt(list.length, 'article')}
            </Txt>
          </View>

          {!list.length ? (
            <View style={[styles.none, { borderColor: c.lineStrong }]}>
              <Txt s={14} w={600} color={c.text2} align="center">
                No articles match that. Our team can help directly.
              </Txt>
              <AccentButton label="Chat with us" height={42} fontSize={13.5} onPress={chat} style={{ paddingHorizontal: 18 }} />
            </View>
          ) : null}

          {list.map((f, i) => {
            const on = openId === f.id;
            return (
              <Reveal key={f.id} i={1 + Math.min(i, 8)} replay={topic + ql}>
                <View style={[styles.faq, { borderColor: on ? c.accent : c.line, backgroundColor: c.surface1 }]}>
                  <PressableScale scaleTo={0.99} onPress={() => setOpenId(on ? null : f.id)} style={styles.faqHead}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Txt s={10} w={700} ls={0.08} upper color={c.accentText}>
                        {f.topic}
                      </Txt>
                      <Txt s={14.5} w={700}>
                        {f.q}
                      </Txt>
                    </View>
                    <Rotator open={on}>
                      <Icon name="expand_more" size={22} color={c.text3} />
                    </Rotator>
                  </PressableScale>
                  <Collapse open={on}>
                    <View style={styles.faqBody}>
                      <Txt s={14} lh={1.6} color={c.text2}>
                        {f.a}
                      </Txt>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Txt s={12} w={500} color={c.text3}>
                          Was this helpful?
                        </Txt>
                        <Vote icon="thumb_up" label="Yes" onPress={() => toast('Thanks for the feedback', 'Glad that helped', 'thumb_up')} />
                        <Vote icon="thumb_down" label="No" onPress={() => toast('Sorry about that', 'Mia from our team will message you', 'chat')} />
                      </View>
                    </View>
                  </Collapse>
                </View>
              </Reveal>
            );
          })}

          <View style={{ gap: 10, marginTop: 4 }}>
            <Txt s={18} w={600} ls={-0.01}>
              Still need help?
            </Txt>
            <ListCard radius={20}>
              <ContactRow icon="chat" accent title="Chat with us" online sub="Average reply in 2 minutes" onPress={chat} />
              <ContactRow
                icon="call"
                title="Call the kitchen"
                sub="Daily 11 AM – 11 PM"
                onPress={() => toast('Calling Fig & Fennel', RESTAURANT.phone, 'call')}
              />
              <ContactRow
                icon="mail"
                title="Email support"
                sub="Reply within 24 hours"
                last
                onPress={() => toast('Email drafted', RESTAURANT.supportEmail, 'mail')}
              />
            </ListCard>
          </View>
        </ScrollView>
        <ScreenHeader title="Help & FAQ" />
        <IssueSheet visible={issue.open} orderNo={issue.no} onClose={() => setIssue((x) => ({ ...x, open: false }))} />
      </View>
    </RevealScope>
  );
}

function TopicTile({ label, icon, count, on, onPress }: { label: string; icon: IconName; count: number; on: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <PressableScale
      scaleTo={0.95}
      onPress={onPress}
      accessibilityState={{ selected: on }}
      style={[styles.topic, { borderColor: on ? c.accent : c.line, backgroundColor: on ? c.accent : c.surface1 }]}
    >
      <View style={[styles.topicIcon, { backgroundColor: on ? 'rgba(255,255,255,0.2)' : c.accentSoft }]}>
        <Icon name={icon} size={19} fill color={on ? c.accentInk : c.accent} />
      </View>
      <View style={{ gap: 1 }}>
        <Txt s={13} w={700} color={on ? c.accentInk : c.text1}>
          {label}
        </Txt>
        <Txt s={10.5} w={500} color={on ? c.accentInk : c.text3} style={{ opacity: 0.85 }}>
          {cnt(count, 'article')}
        </Txt>
      </View>
    </PressableScale>
  );
}

function Vote({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <PressableScale scaleTo={0.94} onPress={onPress} style={[styles.vote, { borderColor: c.lineStrong }]}>
      <Icon name={icon} size={15} />
      <Txt s={12} w={600}>
        {label}
      </Txt>
    </PressableScale>
  );
}

function ContactRow({
  icon,
  title,
  sub,
  onPress,
  accent,
  online,
  last,
}: {
  icon: IconName;
  title: string;
  sub: string;
  onPress: () => void;
  accent?: boolean;
  online?: boolean;
  last?: boolean;
}) {
  const { c } = useTheme();
  return (
    <PressableScale scaleTo={0.985} onPress={onPress} style={[styles.contact, { borderBottomColor: c.line, borderBottomWidth: last ? 0 : 1 }]}>
      <View style={[styles.contactTile, { backgroundColor: accent ? undefined : c.surface2 }]}>
        {accent ? <AccentFill radius={13} /> : null}
        <Icon name={icon} size={21} fill={accent} color={accent ? c.accentInk : c.text1} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Txt s={14.5} w={700}>
            {title}
          </Txt>
          {online ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: c.ok }} />
              <Txt s={11} w={600} color={c.ok}>
                Online
              </Txt>
            </View>
          ) : null}
        </View>
        <Txt s={12} color={c.text3}>
          {sub}
        </Txt>
      </View>
      <Icon name="chevron_right" size={21} color={c.text3} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  search: { height: 52, borderRadius: 26, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 16, paddingRight: 8 },
  searchInput: { flex: 1, minWidth: 0, fontSize: 15, paddingVertical: 0 },
  clear: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  last: { padding: 12, borderRadius: 22, backgroundColor: fixed.ink, gap: 12 },
  lastBtn: { height: 44, borderRadius: 22, backgroundColor: fixed.orange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topic: { width: '31.6%', flexGrow: 1, height: 96, borderRadius: 20, borderWidth: 1, padding: 12, justifyContent: 'space-between', alignItems: 'flex-start' },
  topicIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  none: { padding: 24, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', gap: 10 },
  faq: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  faqHead: { minHeight: 60, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  faqBody: { paddingHorizontal: 16, paddingBottom: 14, gap: 12 },
  vote: { height: 30, paddingHorizontal: 10, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  contact: { minHeight: 66, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactTile: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
