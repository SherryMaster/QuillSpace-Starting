import { 
  type ColorToken, 
  type ColorIntent, 
  type ColorClass, 
  type ColorWithOpacity,
  type OpacityValue,
  isValidColorToken 
} from '@/types/colors';
import { cn } from './common';

export const getColorClass = (
  color: ColorToken,
  intent: ColorIntent = 'text',
  opacity?: OpacityValue
): ColorClass | ColorWithOpacity => {
  if (!isValidColorToken(color)) {
    throw new Error(`Invalid color token: ${color}`);
  }
  
  const baseClass = `${intent}-${color}` as ColorClass;
  return opacity ? `${baseClass}/${opacity}` as ColorWithOpacity : baseClass;
};

export const generateColorVariants = (
  baseColor: ColorToken,
  intents: ColorIntent[] = ['bg', 'text']
): Record<ColorIntent, ColorClass> => {
  return intents.reduce((acc, intent) => ({
    ...acc,
    [intent]: getColorClass(baseColor, intent)
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
  const [base, shade] = color.split('-');
  const shadeMap: Record<string, string> = {
    light: {
      '500': '400',
      '600': '500',
      '700': '600',
      '800': '700',
      '900': '800'
    },
    dark: {
      '400': '500',
      '500': '600',
      '600': '700',
      '700': '800',
      '800': '900'
    }
  }[variant];

  return `${base}-${shadeMap[shade] || shade}` as ColorToken;
};
