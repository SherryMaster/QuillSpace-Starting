import { createElement, memo } from 'react';
import { LucideIcon } from 'lucide-react';

export function isValidLucideIcon(icon: any): icon is LucideIcon {
  return typeof icon === 'function' && 
         ('displayName' in icon || 'name' in icon);
}

export interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  ariaLabel?: string;
  color?: string;
}

export const MemoizedIcon = memo(({ 
  icon: Icon, 
  size = 20, 
  className = "", 
  ariaLabel,
  color 
}: IconProps) => {
  return createElement(Icon, {
    size,
    className,
    'aria-label': ariaLabel,
    color
  });
});
