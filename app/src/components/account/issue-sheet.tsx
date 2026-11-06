import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icons/icon';
import { AccentButton } from '@/components/ui/buttons';
import { Eyebrow } from '@/components/ui/layout';
import { Sheet } from '@/components/ui/overlays';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { ISSUES } from '@/data/content';
import { useApp } from '@/store/app-store';
import { alpha } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

import { Area } from './field';
import { SelectRow } from './rows';

/** “Report a problem” sheet (`iss` in the design). */
export function IssueSheet({ visible, orderNo, onClose }: { visible: boolean; orderNo: string | null; onClose: () => void }) {
  const { c } = useTheme();
  const [type, setType] = useState(0);
  const [text, setText] = useState('');

  const submit = () => {
    useApp.getState().submitIssue(orderNo, type);
    setType(0);
    setText('');
    onClose();
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Report a problem"
      subtitle={`Order ${orderNo ?? 'your order'}`}
      footer={<AccentButton label="Send report" icon="send" iconFill iconSize={19} onPress={submit} />}
    >
      <View style={{ gap: 8 }}>
        <Eyebrow>What went wrong?</Eyebrow>
        {ISSUES.map(([l, icon], i) => (
          <SelectRow key={l} on={type === i} onPress={() => setType(i)} left={<Icon name={icon} size={21} color={c.accent} />}>
            <Txt s={14.5} w={600}>
              {l}
            </Txt>
          </SelectRow>
        ))}
      </View>
      <View style={{ gap: 8 }}>
        <Eyebrow>Tell us more</Eyebrow>
        <Area rows={3} radius={16} borderWidth={1.5} padH={15} padV={13} value={text} onChangeText={setText} placeholder="Which item, what happened…" />
        <PressableScale
          scaleTo={0.97}
          onPress={() => useApp.getState().showToast('Photo attached', 'IMG_2041.jpg', 'photo_camera')}
          style={[styles.photo, { borderColor: c.lineStrong }]}
        >
          <Icon name="add_a_photo" size={20} color={c.accentText} />
          <Txt s={14} w={700} color={c.accentText}>
            Add a photo
          </Txt>
        </PressableScale>
      </View>
      <View style={[styles.info, { backgroundColor: alpha(c.ok, 0.12) }]}>
        <Icon name="bolt" size={19} fill color={c.ok} />
        <Txt s={12.5} w={500} lh={1.5} color={c.text2} style={{ flex: 1 }}>
          Most issues are fixed instantly with Fig credit. We’ll follow up within an hour.
        </Txt>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  photo: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  info: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16 },
});
