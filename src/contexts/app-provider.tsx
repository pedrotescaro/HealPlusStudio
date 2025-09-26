"use client";

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { translations, Translation } from '../lib/translations';

export type Language = 'pt-br' | 'en-us';
export type Theme = 'light' | 'dark' | 'high-contrast';
export type FontSize = 0.8 | 0.9 | 1 | 1.1 | 1.2;


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
  const [language, setLanguage] = useState<Language>('pt-br');
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>(1.0);

  const t = useMemo(() => {
    return translations[language] || translations['pt-br'];
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontSize));
  }, [fontSize]);

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

export const useTheme = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useTheme must be used within an AppProvider');
    }
    return { 
        theme: context.theme, 
        setTheme: context.setTheme,
        fontSize: context.fontSize,
        setFontSize: context.setFontSize,
        language: context.language,
        setLanguage: context.setLanguage,
    };
};