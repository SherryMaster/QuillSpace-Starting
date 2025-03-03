// Color system primitive types
export const BASE_COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  muted: 'muted',
  destructive: 'destructive'
} as const;

export type BaseColor = 
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'destructive';

export const BRAND_COLORS = {
  blue: 'blue',
  red: 'red',
  green: 'green',
  yellow: 'yellow',
  purple: 'purple',
  gray: 'gray',
  dark: 'dark',
  light: 'light',
  cyan: 'cyan',
  orange: 'orange',
  pink: 'pink',
  indigo: 'indigo',
  teal: 'teal',
  rose: 'rose',
  lime: 'lime',
  sky: 'sky',
  emerald: 'emerald',
  fuchsia: 'fuchsia',
  amber: 'amber',
  violet: 'violet'
} as const;

export type BrandColor = 
  | 'blue'
  | 'red'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'gray'
  | 'dark'
  | 'light'
  | 'cyan'
  | 'orange'
  | 'pink'
  | 'indigo'
  | 'teal'
  | 'rose'
  | 'lime'
  | 'sky'
  | 'emerald'
  | 'fuchsia'
  | 'amber'
  | 'violet';

export const COLOR_SHADES = {
  '50': '50',
  '100': '100',
  '200': '200',
  '300': '300',
  '400': '400',
  '500': '500',
  '600': '600',
  '700': '700',
  '800': '800',
  '900': '900'
} as const;

export type ColorShade = 
  | '50' 
  | '100' 
  | '200' 
  | '300' 
  | '400' 
  | '500' 
  | '600' 
  | '700' 
  | '800' 
  | '900';

export type ColorIntent = 
  | 'bg' 
  | 'text' 
  | 'border' 
  | 'ring' 
  | 'fill' 
  | 'stroke';

// Composite types
export type ColorToken = `${BaseColor | BrandColor}-${ColorShade}`;
export type ColorClass = `${ColorIntent}-${ColorToken}`;

// Opacity utilities
export type OpacityValue = 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95;
export type ColorWithOpacity = `${ColorClass}/${OpacityValue}`;

// Theme configuration
export interface ThemeColors {
  background: ColorToken;
  foreground: ColorToken;
  primary: ColorToken;
  secondary: ColorToken;
  accent: ColorToken;
  muted: ColorToken;
}

// Type guards and validation
export const isValidColorToken = (color: string): color is ColorToken => {
  const [base, shade] = color.split('-');
  return (
    (Object.values(BASE_COLORS).includes(base as BaseColor) ||
    Object.values(BRAND_COLORS).includes(base as BrandColor)) &&
    Object.values(COLOR_SHADES).includes(shade as ColorShade)
  );
};
