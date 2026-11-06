import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { openDish } from '@/components/dish-card';
import { Icon, type IconName } from '@/components/icons/icon';
import { AccentButton, InkButton } from '@/components/ui/buttons';
import { DishImage } from '@/components/ui/media';
import { Sheet } from '@/components/ui/overlays';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { RESTAURANT } from '@/data/content';
import type { InboxItem } from '@/data/types';
import { useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

type Kind = 'promo' | 'dish' | 'rate' | 'booking' | 'order' | 'info';

interface Detail {
  tag: string;
  body: string;
  cta: string;
  ctaIcon: IconName;
  go: () => void;
  code?: string;
  img?: string;
}

const ORDER_ICONS: string[] = ['receipt_long', 'skillet', 'two_wheeler', 'home', 'room_service'];

function kindOf(icon: IconName): Kind {
  if (icon === 'sell') return 'promo';
  if (icon === 'eco') return 'dish';
  if (icon === 'check_circle') return 'rate';
  if (icon === 'event_seat') return 'booking';
  if (ORDER_ICONS.includes(icon)) return 'order';
  return 'info';
}

/** Notification detail sheet (`nd` in the design). */
export function NotifSheet({ item, visible, onClose }: { item: InboxItem | null; visible: boolean; onClose: () => void }) {
  const { c } = useTheme();
  const n = item;
  const funghi = useApp((s) => s.menu.find((m) => m.id === 'funghi'));
  const orders = useApp((s) => s.orders);
  const lastNo = useApp((s) => s.lastNo);
  if (!n) return null;

  const later = (fn: () => void) => {
    onClose();
    setTimeout(fn, 260);
  };
  const booked = n.title.includes('booked');
  const k = kindOf(n.icon);
  const D: Record<Kind, Detail> = {
    promo: {
      tag: 'Offer',
      body: 'Save on any delivery or pickup order this week. The code applies to your whole cart, once per account.',
      cta: 'Apply in cart',
      ctaIcon: 'sell',
      code: 'WEEKNIGHT15',
      go: () =>
        later(() => {
          useApp.getState().setPromoDraft('WEEKNIGHT15');
          router.navigate('/cart');
        }),
    },
    dish: {
      tag: 'New dish',
      body: 'Roasted wild mushrooms, taleggio and thyme on a white garlic base, finished with black truffle oil. Fired every night from 5 PM while the dough lasts.',
      cta: 'View dish',
      ctaIcon: 'restaurant_menu',
      img: funghi?.img,
      go: () => later(() => openDish('funghi')),
    },
    rate: {
      tag: 'Order update',
      body: 'Your order was delivered. Tell the kitchen how it went and add a tip for your courier. Every rating earns 50 Fig points.',
      cta: 'Rate your order',
      ctaIcon: 'star',
      go: () => later(() => router.push({ pathname: '/rate/[no]', params: { no: 'EK-4799' } })),
    },
    booking: {
      tag: 'Dine in',
      body: booked
        ? `${n.sub}. We hold tables for 15 minutes. You can cancel free up to 2 hours before.`
        : 'Tables on the heated patio and at the chef’s counter open from 5:30 PM. Reserve ahead to skip the wait.',
      cta: booked ? 'View reservations' : 'Book a table',
      ctaIcon: 'event_seat',
      go: () => later(() => router.push(booked ? '/my-bookings' : '/reserve')),
    },
    order: {
      tag: 'Live order',
      body: `${n.sub}. Follow every step from the oven to your door on the live tracking screen.`,
      cta: 'Track order',
      ctaIcon: 'two_wheeler',
      go: () =>
        later(() => {
          const text = (n.title + n.sub).replace(/‑/g, '-');
          const o = orders.find((x) => text.includes(x.no)) ?? orders.find((x) => x.no === lastNo);
          if (o) router.push({ pathname: '/track/[no]', params: { no: o.no } });
        }),
    },
    info: { tag: 'Support', body: n.sub, cta: 'Done', ctaIcon: 'check', go: onClose },
  };
  const d = D[k];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={n.title}
      subtitle={`${n.time} · ${d.tag}`}
      footer={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <PressableScale
            scaleTo={0.94}
            accessibilityLabel="Delete"
            onPress={() => {
              useApp.getState().deleteNotif(n.id);
              onClose();
            }}
            style={[styles.del, { borderColor: c.lineStrong }]}
          >
            <Icon name="delete" size={21} color={c.err} />
          </PressableScale>
          <AccentButton label={d.cta} icon={d.ctaIcon} iconFill onPress={d.go} style={{ flex: 1 }} />
        </View>
      }
    >
      {d.img ? (
        <View style={{ height: 180 }}>
          <DishImage uri={d.img} />
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
        <View style={[styles.tile, { backgroundColor: c.accentSoft }]}>
          <Icon name={n.icon} size={26} fill color={c.accent} />
        </View>
        <Txt s={15} lh={1.6} color={c.text2} style={{ flex: 1 }}>
          {d.body}
        </Txt>
      </View>
      {d.code ? (
        <View style={[styles.code, { borderColor: c.accent, backgroundColor: c.accentSoft }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt s={10.5} w={700} ls={0.08} upper color={c.text3}>
              Promo code
            </Txt>
            <Txt s={22} w={600} ls={0.06} color={c.accentText}>
              {d.code}
            </Txt>
          </View>
          <InkButton
            label="Copy"
            icon="content_copy"
            height={40}
            radius={20}
            fontSize={13}
            onPress={() => useApp.getState().showToast('Code copied', d.code ?? '', 'content_copy')}
            style={{ paddingHorizontal: 14 }}
          />
        </View>
      ) : null}
      <View style={[styles.received, { backgroundColor: c.surface2 }]}>
        <Icon name="schedule" size={18} color={c.text3} />
        <Txt s={12.5} w={500} color={c.text2}>
          Received {n.time} · from {RESTAURANT.name}
        </Txt>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  del: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  tile: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  code: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  received: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16 },
});
