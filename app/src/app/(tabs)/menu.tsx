import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { DishGrid } from '@/components/dish-card';
import { Icon } from '@/components/icons/icon';
import { AccentButton, AccentFill, LinkButton, OutlineButton } from '@/components/ui/buttons';
import { Chip, Radio } from '@/components/ui/controls';
import { Eyebrow, useChrome } from '@/components/ui/layout';
import { Sheet } from '@/components/ui/overlays';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { HOT, SORTS, VEG } from '@/data/menu';
import type { Dish, MenuFilters } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt } from '@/lib/format';
import { selectLiveMenu, useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

const SORT_FNS: ((a: Dish, b: Dish) => number)[] = [(a, b) => b.reviews - a.reviews, (a, b) => a.price - b.price, (a, b) => a.time - b.time];

function filterMenu(live: Dish[], cat: string, brand: string | null, q: string, f: MenuFilters): Dish[] {
  const ql = q.trim().toLowerCase();
  return live
    .filter(
      (p) =>
        (cat === 'All' || p.cat === cat) &&
        (!brand || p.brand === brand) &&
        (!ql || `${p.name} ${p.cat}`.toLowerCase().includes(ql)) &&
        (!f.veg || VEG.includes(p.id)) &&
        (!f.hot || HOT.includes(p.id)) &&
        (!f.under || p.price < 12),
    )
    .sort(SORT_FNS[f.sort]);
}

const NO_FILTERS: MenuFilters = { sort: 0, veg: false, hot: false, under: false };

export default function MenuScreen() {
  useStatusBar();
  const { c } = useTheme();
  const chrome = useChrome();
  const params = useLocalSearchParams<{ focus?: string }>();
  const input = useRef<TextInputInstance>(null);
  const [q, setQ] = useState('');
  const [sheet, setSheet] = useState(false);

  const live = useApp(useShallow(selectLiveMenu));
  const { cat, brand, filters, brands, cats } = useApp(
    useShallow((s) => ({ cat: s.menuCat, brand: s.menuBrand, filters: s.filters, brands: s.brands, cats: s.cats })),
  );
  const [draft, setDraft] = useState<MenuFilters>(filters);

  useEffect(() => {
    if (params.focus) {
      const t = setTimeout(() => input.current?.focus(), 480);
      router.setParams({ focus: undefined });
      return () => clearTimeout(t);
    }
  }, [params.focus]);

  const list = useMemo(() => filterMenu(live, cat, brand, q, filters), [live, cat, brand, q, filters]);
  const draftCount = useMemo(() => filterMenu(live, cat, brand, q, draft).length, [live, cat, brand, q, draft]);
  const fCount = (filters.sort ? 1 : 0) + (filters.veg ? 1 : 0) + (filters.hot ? 1 : 0) + (filters.under ? 1 : 0);
  const brandObj = brand ? brands.find((b) => b.id === brand) : undefined;
  const title = brandObj ? brandObj.name : cat === 'All' ? 'Menu' : cat;
  const chips = ['All', ...cats.filter((x) => x.on).map((x) => x.name)];
  const setCat = (v: string) => useApp.getState().setMenuCat(v);

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: chrome.contentTop, paddingBottom: chrome.bottomPad }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Reveal i={0} style={{ paddingTop: 6, paddingHorizontal: 20, gap: 4 }}>
            <Txt s={34} w={600} ls={-0.03} numberOfLines={1}>
              {title}
            </Txt>
            <Txt s={13.5} w={500} color={c.text3}>
              {cnt(list.length, 'dish') + (cat === 'All' ? ' · fired to order' : '')}
            </Txt>
            {brandObj ? (
              <PressableScale
                onPress={() => useApp.getState().setMenuBrand(null)}
                scaleTo={0.95}
                style={[styles.brandChip, { borderColor: c.accent, backgroundColor: c.accentSoft }]}
              >
                <Txt s={12.5} w={600} color={c.accentText}>
                  {brandObj.tag}
                </Txt>
                <Icon name="close" size={16} color={c.accentText} />
              </PressableScale>
            ) : null}
          </Reveal>

          <Reveal i={1} style={styles.searchRow}>
            <View style={[styles.search, { backgroundColor: c.surface1, borderColor: c.line }]}>
              <Icon name="search" size={22} color={c.text3} />
              <TextInput
                ref={input}
                value={q}
                onChangeText={setQ}
                placeholder="Search the menu"
                placeholderTextColor={c.text3}
                returnKeyType="search"
                style={[styles.input, { color: c.text1, fontFamily: family(500) }]}
              />
              {q ? (
                <PressableScale onPress={() => setQ('')} scaleTo={0.9} accessibilityLabel="Clear" style={[styles.clear, { backgroundColor: c.surface2 }]}>
                  <Icon name="close" size={18} />
                </PressableScale>
              ) : null}
            </View>
            <PressableScale
              onPress={() => {
                setDraft(filters);
                setSheet(true);
              }}
              scaleTo={0.94}
              accessibilityLabel="Filters"
              style={[styles.filterBtn, { backgroundColor: c.text1 }]}
            >
              <Icon name="tune" size={22} color={c.bg} />
              {fCount > 0 ? (
                <View style={[styles.fBadge, { borderColor: c.bg }]}>
                  <AccentFill radius={10} />
                  <Txt s={10} w={700} color={c.accentInk}>
                    {fCount}
                  </Txt>
                </View>
              ) : null}
            </PressableScale>
          </Reveal>

          <Reveal i={1}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}
            >
              {chips.map((label) => (
                <Chip key={label} label={label} on={cat === label} onPress={() => setCat(label)} />
              ))}
            </ScrollView>
          </Reveal>

          {!list.length ? (
            <View style={[styles.empty, { backgroundColor: c.surface1, borderColor: c.line }]}>
              <Icon name="search_off" size={36} color={c.text3} />
              <Txt s={16} w={700}>
                Nothing matches that
              </Txt>
              <OutlineButton
                label="Show full menu"
                height={44}
                fontSize={14}
                weight={600}
                style={{ marginTop: 6, paddingHorizontal: 18 }}
                onPress={() => {
                  setQ('');
                  useApp.getState().setMenuCat('All', null);
                }}
              />
            </View>
          ) : null}

          <DishGrid key={`${cat}-${brand}-${filters.sort}`} dishes={list} style={{ paddingTop: 12 }} />
        </ScrollView>

        <Sheet
          visible={sheet}
          onClose={() => setSheet(false)}
          variant="glass"
          scroll={false}
          header={
            <View style={styles.sheetHead}>
              <Txt s={28} w={600} lh={1} ls={-0.03}>
                Filters
              </Txt>
              <LinkButton label="Reset" onPress={() => setDraft(NO_FILTERS)} />
            </View>
          }
        >
          <View style={{ paddingHorizontal: 20, gap: 14 }}>
            <Eyebrow>Sort by</Eyebrow>
            <View style={{ gap: 8 }}>
              {SORTS.map((l, i) => {
                const on = draft.sort === i;
                return (
                  <PressableScale
                    key={l}
                    onPress={() => setDraft((d) => ({ ...d, sort: i }))}
                    scaleTo={0.98}
                    style={[styles.sortRow, { borderColor: on ? c.accent : c.line, backgroundColor: on ? c.accentSoft : c.surface1 }]}
                  >
                    <Radio on={on} />
                    <Txt s={14.5} w={600}>
                      {l}
                    </Txt>
                  </PressableScale>
                );
              })}
            </View>
            <Eyebrow>Dietary & price</Eyebrow>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(
                [
                  ['veg', 'Vegetarian', 'eco'],
                  ['hot', 'Spicy', 'eco'],
                  ['under', 'Under $12', 'sell'],
                ] as const
              ).map(([k, l, icon]) => (
                <Chip key={k} label={l} icon={icon} height={42} on={draft[k]} onPress={() => setDraft((d) => ({ ...d, [k]: !d[k] }))} />
              ))}
            </View>
            <AccentButton
              label={`Show ${cnt(draftCount, 'dish')}`}
              height={56}
              style={{ marginTop: 6 }}
              onPress={() => {
                useApp.getState().setFilters(draft);
                setSheet(false);
              }}
            />
          </View>
        </Sheet>
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  brandChip: {
    alignSelf: 'flex-start',
    marginTop: 6,
    height: 34,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchRow: { marginTop: 14, marginHorizontal: 20, flexDirection: 'row', gap: 10 },
  search: {
    flex: 1,
    minWidth: 0,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: { flex: 1, minWidth: 0, fontSize: 15, paddingVertical: 0, height: '100%' },
  clear: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  filterBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  fBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  empty: {
    marginVertical: 30,
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4, marginBottom: 14, paddingHorizontal: 20 },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 50, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1.5 },
});
