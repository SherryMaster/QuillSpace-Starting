import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeConfig } from '../lib/types';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme: ThemeConfig;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeConfig>(theme);

  const value = {
    theme: currentTheme,
    setTheme: setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export type { ThemeConfig };
