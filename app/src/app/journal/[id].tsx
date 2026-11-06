import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { openDish, QuickAddButton } from '@/components/dish-card';
import { Icon } from '@/components/icons/icon';
import { CircleButton } from '@/components/ui/buttons';
import { Glass } from '@/components/ui/glass';
import { PhotoHeader } from '@/components/ui/layout';
import { Avatar, DishImage, Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { initials, money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

const E = Easing.bezier(0.22, 1, 0.36, 1);

export default function StoryScreen() {
  const { c } = useTheme();
  useStatusBar('light');
  const { id } = useLocalSearchParams<{ id: string }>();
  const posts = useApp((s) => s.posts);
  const post = posts.find((p) => p.id === id) ?? posts[0];
  const liked = useApp((s) => s.liked.includes(post?.id ?? ''));
  const dish = useApp((s) => (post?.dish ? s.menu.find((m) => m.id === post.dish) : undefined));

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const read = useSharedValue(0);
  const zoom = useSharedValue(1.1);
  const pop = useSharedValue(1);
  const firstLike = useRef(true);

  useEffect(() => {
    read.set(0);
    zoom.set(1.1);
    zoom.set(withTiming(1, { duration: 1200, easing: E }));
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [id, read, zoom, scrollRef]);

  useEffect(() => {
    if (firstLike.current) {
      firstLike.current = false;
      return;
    }
    pop.set(withSequence(withTiming(1.35, { duration: 140 }), withSpring(1, { damping: 9, stiffness: 240 })));
  }, [liked, pop]);

  const onScroll = useAnimatedScrollHandler((e) => {
    const max = Math.max(1, e.contentSize.height - e.layoutMeasurement.height);
    read.set(Math.min(100, Math.max(0, (e.contentOffset.y / max) * 100)));
  });
  const barSt = useAnimatedStyle(() => ({ width: `${read.value}%` }));
  const heroSt = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));
  const likeSt = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  if (!post) return null;
  const paras = (post.body || '').split(/\n\s*\n/);
  const related = posts.filter((p) => p.on && p.id !== post.id).slice(0, 3);
  const st = useApp.getState();

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={[styles.hero, { backgroundColor: fixed.ink }]}>
            <Animated.View style={[StyleSheet.absoluteFill, heroSt]}>
              <Photo uri={post.img} style={StyleSheet.absoluteFill} />
            </Animated.View>
            <LinearGradient
              pointerEvents="none"
              colors={[fixed.roast(0.5), fixed.roast(0), fixed.roast(0), c.bg]}
              locations={[0, 0.35, 0.6, 1]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.body}>
            <Reveal i={0} style={{ alignSelf: 'flex-start' }}>
              <Glass style={[styles.cat, { borderColor: c.glassLine }]}>
                <Txt s={10.5} w={700} ls={0.08} upper color={c.accentText}>
                  {post.cat}
                </Txt>
              </Glass>
            </Reveal>
            <Reveal i={1}>
              <Txt s={31} w={600} lh={1.06} ls={-0.03}>
                {post.title}
              </Txt>
            </Reveal>
            <Reveal i={2}>
              <View style={[styles.byline, { borderBottomColor: c.line }]}>
                <Avatar text={initials(post.author)} size={40} bg={c.accentSoft} color={c.accentText} fontSize={13} display />
                <View style={{ flex: 1, gap: 1 }}>
                  <Txt s={14} w={700}>
                    {post.author}
                  </Txt>
                  <Txt s={12} w={500} color={c.text3}>
                    {post.date} · {post.mins} min read
                  </Txt>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="favorite" size={16} fill color={c.accent} />
                  <Txt s={12.5} w={600} color={c.text3}>
                    {post.likes + (liked ? 1 : 0)}
                  </Txt>
                </View>
              </View>
            </Reveal>
            <Reveal i={3} style={{ gap: 16 }}>
              <Txt s={17} w={500} lh={1.55}>
                {post.excerpt}
              </Txt>
              <View style={{ gap: 14 }}>
                {paras.map((t, i) => (
                  <Txt key={i} s={15.5} lh={1.7} color={c.text2}>
                    {t}
                  </Txt>
                ))}
              </View>
            </Reveal>
            {dish ? (
              <Reveal i={4}>
                <PressableScale scaleTo={0.98} onPress={() => openDish(dish.id)} style={styles.dish}>
                  <DishImage uri={dish.img} size={64} />
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <Txt s={10.5} w={700} ls={0.08} upper color={fixed.peach}>
                      Taste the story
                    </Txt>
                    <Txt s={15} w={700} color={fixed.paper}>
                      {dish.name}
                    </Txt>
                    <Txt s={13} w={600} color={fixed.paperA(0.72)}>
                      {money(dish.price)}
                    </Txt>
                  </View>
                  <QuickAddButton dishId={dish.id} size={44} radius={14} />
                </PressableScale>
              </Reveal>
            ) : null}
            {related.length ? (
              <>
                <Txt s={19} w={600} ls={-0.01} style={{ marginTop: 8 }}>
                  Keep reading
                </Txt>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -22 }}
                  contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 4, gap: 12 }}
                >
                  {related.map((p) => (
                    <PressableScale
                      key={p.id}
                      scaleTo={0.97}
                      onPress={() => router.push({ pathname: '/journal/[id]', params: { id: p.id } })}
                      style={[styles.related, { borderColor: c.line, backgroundColor: c.surface1 }]}
                    >
                      <Photo uri={p.img} radius={15} style={{ height: 110 }} />
                      <Txt s={14.5} w={600} lh={1.2} numberOfLines={2} style={{ paddingHorizontal: 6 }}>
                        {p.title}
                      </Txt>
                      <Txt s={11.5} w={500} color={c.text3} style={{ paddingHorizontal: 6 }}>
                        {p.mins} min read
                      </Txt>
                    </PressableScale>
                  ))}
                </ScrollView>
              </>
            ) : null}
          </View>
        </Animated.ScrollView>

        <View pointerEvents="none" style={styles.progress}>
          <Animated.View style={[{ height: '100%', backgroundColor: fixed.orange }, barSt]} />
        </View>

        <PhotoHeader
          right={
            <>
              <CircleButton
                icon="ios_share"
                iconSize={21}
                variant="photo"
                label="Share"
                onPress={() => st.showToast('Link copied', `Share “${post.title.slice(0, 28)}…”`, 'link')}
              />
              <PressableScale scaleTo={0.93} onPress={() => st.toggleLike(post.id)} accessibilityLabel="Like" style={styles.like}>
                <Animated.View style={likeSt}>
                  <Icon name="favorite" size={22} fill={liked} color={liked ? c.accent : fixed.paper} />
                </Animated.View>
              </PressableScale>
            </>
          }
        />
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  hero: { height: 360, overflow: 'hidden' },
  body: { marginTop: -60, paddingHorizontal: 22, gap: 16 },
  cat: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, borderWidth: 1 },
  byline: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottomWidth: 1 },
  dish: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 22, backgroundColor: fixed.ink },
  related: { width: 220, borderRadius: 20, borderWidth: 1, paddingTop: 6, paddingHorizontal: 6, paddingBottom: 12, gap: 8 },
  progress: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 4, backgroundColor: 'rgba(255,255,255,0.12)' },
  like: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: fixed.roast(0.38),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
