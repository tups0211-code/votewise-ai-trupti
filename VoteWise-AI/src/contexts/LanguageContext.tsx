import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { translations } from '../locales/translations';

type Language = 'English' | 'Hindi' | 'Marathi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (section: string, key: string): string => {
    // Basic dot notation getter for translations
    try {
      const sectionData = (translations as any)[language][section];
      if (sectionData && sectionData[key]) {
        return sectionData[key];
      }
    } catch (e) {
      console.warn(`Translation missing for ${language}.${section}.${key}`);
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
