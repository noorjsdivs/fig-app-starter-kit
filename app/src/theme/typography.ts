import { Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';

/** Outfit is both `--font-display` and `--font-body` in the design. */
export const fontAssets = {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
};

export type Weight = 300 | 400 | 500 | 600 | 700 | 800;

const FAMILY: Record<Weight, string> = {
  300: 'Outfit_300Light',
  400: 'Outfit_400Regular',
  500: 'Outfit_500Medium',
  600: 'Outfit_600SemiBold',
  700: 'Outfit_700Bold',
  800: 'Outfit_800ExtraBold',
};

export function family(w: Weight): string {
  return FAMILY[w];
}
