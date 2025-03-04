import { 
  type ColorToken, 
  type ColorIntent, 
  type ColorClass, 
  type ColorWithOpacity,
  type OpacityValue,
  isValidColorToken 
} from '@/types/colors';
import { cn } from './common';

const DEFAULT_SHADE = '500';

export const getColorClass = (
  color: ColorToken,
  intent: ColorIntent = 'text',
  opacity?: OpacityValue
): ColorClass | ColorWithOpacity => {
  if (!isValidColorToken(color)) {
    throw new Error(`Invalid color token: ${color}`);
  }
  
  const baseClass = `${intent}-${color}-${DEFAULT_SHADE}` as ColorClass;
  return opacity ? `${baseClass}/${opacity}` as ColorWithOpacity : baseClass;
};

export const generateColorVariants = (
  color: ColorToken,
  intents: ColorIntent[] = ['bg', 'text']
): Record<ColorIntent, ColorClass> => {
  return intents.reduce((acc, intent) => ({
    ...acc,
    [intent]: getColorClass(color, intent)
  }), {} as Record<ColorIntent, ColorClass>);
};

export const combineColorClasses = (...classes: (ColorClass | ColorWithOpacity | string)[]) => {
  return cn(...classes);
};

// Theme color utilities
export const getThemeColorVariant = (
  color: ColorToken,
  variant: 'light' | 'dark' = 'light'
): ColorToken => {
  return color; // Since we're not dealing with shades anymore, just return the color
};
