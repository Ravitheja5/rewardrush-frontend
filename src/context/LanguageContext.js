import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../../locales/en.json';
import te from '../../locales/te.json';
import hi from '../../locales/hi.json';

const dictionaries = { en, te, hi };
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('rr_lang');
    if (saved && dictionaries[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (lang) => {
    setLocaleState(lang);
    localStorage.setItem('rr_lang', lang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let curr = dictionaries[locale] || dictionaries.en;
    for (const k of keys) {
      if (!curr || curr[k] === undefined) {
        let fallback = dictionaries.en;
        for (const fk of keys) {
          if (!fallback || fallback[fk] === undefined) return path;
          fallback = fallback[fk];
        }
        return fallback;
      }
      curr = curr[k];
    }
    return curr;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
