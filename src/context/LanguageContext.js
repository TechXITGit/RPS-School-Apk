import React, { createContext, useContext, useState } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext({
  language: 'EN',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isHindi: false,
  t: translations.EN,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  const currentTranslations = translations[language] || translations.EN;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isHindi: language === 'HI',
        t: currentTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
