
"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { translations, Translation } from '@/lib/translations';

type Language = 'en' | 'pt';
type Theme = 'light' | 'dark' | 'high-contrast';
type FontSize = 'sm' | 'md' | 'lg';

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  t: Translation;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('md');

  const t = useMemo(() => translations[language], [language]);

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, fontSize, setFontSize, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useTranslation = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useTranslation must be used within an AppProvider');
    }
    return { t: context.t, setLanguage: context.setLanguage, language: context.language };
};
