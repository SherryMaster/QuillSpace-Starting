import { ThemeProvider } from '@/theme/ThemeContext';
import { InteractiveContentLayout, InteractiveContentLayoutProps } from './InteractiveContentLayout';

export function ThemedInteractiveContentLayout(props: InteractiveContentLayoutProps) {
  return (
    <ThemeProvider>
      <InteractiveContentLayout {...props} />
    </ThemeProvider>
  );
}

// Re-export the props type for convenience
export type { InteractiveContentLayoutProps };