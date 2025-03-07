// Color system primitive types
export const BRAND_COLORS = {
  blue: "blue",
  red: "red",
  green: "green",
  yellow: "yellow",
  purple: "purple",
  gray: "gray",
  cyan: "cyan",
  orange: "orange",
  pink: "pink",
  indigo: "indigo",
  teal: "teal",
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;

export type ColorIntent =
  | "bg"
  | "text"
  | "border"
  | "ring"
  | "fill"
  | "stroke"
  | "scrollbar-track"
  | "scrollbar-thumb";

// Simplified ColorToken is now just BrandColor
export type ColorToken = BrandColor;

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
  return Object.values(BRAND_COLORS).includes(color as BrandColor);
};
