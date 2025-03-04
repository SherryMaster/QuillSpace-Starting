// Color system primitive types
export const BASE_COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  muted: 'muted',
  destructive: 'destructive'
} as const;

export type BaseColor = keyof typeof BASE_COLORS;

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
  brown: 'brown'
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;

export type ColorIntent = 
  | 'bg' 
  | 'text' 
  | 'border' 
  | 'ring' 
  | 'fill' 
  | 'stroke';

// Simplified ColorToken is now just the color name
export type ColorToken = BaseColor | BrandColor;

// ColorClass now includes the default shade
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
  return (
    Object.values(BASE_COLORS).includes(color as BaseColor) ||
    Object.values(BRAND_COLORS).includes(color as BrandColor)
  );
};
