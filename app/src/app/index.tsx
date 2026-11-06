import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AccentButton, CircleButton, InkButton, OutlineButton } from '@/components/ui/buttons';
import { Chip, Radio, Stepper, StatusPill, Toggle } from '@/components/ui/controls';
import { Glass } from '@/components/ui/glass';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { useTheme } from '@/theme/theme';

/** A scratch screen to try the kit. It goes away once the real screens exist. */
export default function Index() {
  const { c } = useTheme();
  const [on, setOn] = useState(true);
  const [chip, setChip] = useState('Pizza');
  const [qty, setQty] = useState(1);

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={{ padding: 20, paddingTop: 80, gap: 16 }}>
      <Txt s={34} w={600} ls={-0.03}>
        UI kit
      </Txt>
      <AccentButton label="Go to checkout" icon="lock" iconFill glow />
      <OutlineButton label="Back to home" />
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <InkButton label="Apply" />
        <CircleButton icon="notifications" label="Notifications" />
        <CircleButton icon="call" variant="accent" fill label="Call" />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['All', 'Pizza', 'Burgers'].map((l) => (
          <Chip key={l} label={l} on={chip === l} onPress={() => setChip(l)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <PressableScale onPress={() => setOn(!on)}>
          <Toggle on={on} />
        </PressableScale>
        <Radio on={on} />
        <Stepper value={qty} onDec={() => setQty(Math.max(1, qty - 1))} onInc={() => setQty(qty + 1)} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <StatusPill label="New" color={c.info} />
        <StatusPill label="Preparing" color={c.warn} />
        <StatusPill label="Delivered" color={c.ok} />
      </View>
      <Glass style={{ padding: 16, borderRadius: 20 }}>
        <Txt s={14} w={700}>
          Frosted glass
        </Txt>
        <Txt s={12.5} color={c.text2}>
          Blurred on iOS, solid on Android.
        </Txt>
      </Glass>
    </ScrollView>
  );
}
