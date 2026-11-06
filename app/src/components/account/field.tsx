import { useState, type Ref } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputInstance, type TextInputProps, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/icons/icon';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

interface FieldProps extends Omit<TextInputProps, 'style'> {
  icon?: IconName;
  /** Highlights the border in `--err`. */
  error?: boolean;
  height?: number;
  radius?: number;
  borderWidth?: number;
  /** Leading icon inset (design: 15–16px). */
  iconLeft?: number;
  /** Text inset when an icon is present (design: 46–48px). */
  padLeft?: number;
  fontSize?: number;
  weight?: 500 | 600 | 700;
  letterSpacing?: number;
  bg?: string;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<TextInputInstance>;
}

/** Single-line input with a leading Material Symbol, matching the design's form fields. */
export function Field({
  icon,
  error,
  height = 52,
  radius = 16,
  borderWidth = 1.5,
  iconLeft = 15,
  padLeft = 46,
  fontSize = 15,
  weight = 500,
  letterSpacing,
  bg,
  style,
  onFocus,
  onBlur,
  ref,
  ...rest
}: FieldProps) {
  const { c } = useTheme();
  const [focus, setFocus] = useState(false);
  const border = error ? c.err : focus ? c.accent : c.line;
  return (
    <View style={[styles.wrap, style]}>
      <TextInput
        ref={ref}
        placeholderTextColor={c.text3}
        selectionColor={c.accent}
        allowFontScaling={false}
        {...rest}
        onFocus={(e) => {
          setFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          {
            height,
            borderRadius: radius,
            borderWidth,
            borderColor: border,
            backgroundColor: bg ?? c.surface1,
            color: c.text1,
            paddingLeft: icon ? padLeft : 16,
            fontFamily: family(weight),
            fontSize,
            letterSpacing: letterSpacing ? letterSpacing * fontSize : undefined,
          },
        ]}
      />
      {icon ? (
        <View pointerEvents="none" style={[styles.icon, { left: iconLeft }]}>
          <Icon name={icon} size={20} color={c.text3} />
        </View>
      ) : null}
    </View>
  );
}

interface AreaProps extends Omit<TextInputProps, 'style'> {
  rows?: number;
  radius?: number;
  borderWidth?: number;
  fontSize?: number;
  lineHeight?: number;
  weight?: 400 | 500;
  padH?: number;
  padV?: number;
  style?: StyleProp<ViewStyle>;
}

/** Multiline textarea (`rows` × line-height + vertical padding). */
export function Area({
  rows = 2,
  radius = 18,
  borderWidth = 1,
  fontSize = 14.5,
  lineHeight = 1.5,
  weight = 500,
  padH = 16,
  padV = 14,
  style,
  onFocus,
  onBlur,
  ...rest
}: AreaProps) {
  const { c } = useTheme();
  const [focus, setFocus] = useState(false);
  const lh = Math.round(fontSize * lineHeight);
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={c.text3}
      selectionColor={c.accent}
      allowFontScaling={false}
      {...rest}
      onFocus={(e) => {
        setFocus(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocus(false);
        onBlur?.(e);
      }}
      style={[
        {
          minHeight: rows * lh + padV * 2,
          borderRadius: radius,
          borderWidth,
          borderColor: focus ? c.accent : c.line,
          backgroundColor: c.surface1,
          color: c.text1,
          paddingHorizontal: padH,
          paddingTop: padV,
          paddingBottom: padV,
          fontFamily: family(weight),
          fontSize,
          lineHeight: lh,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', justifyContent: 'center' },
  input: { paddingRight: 14 },
  icon: { position: 'absolute', top: 0, bottom: 0, justifyContent: 'center' },
});
