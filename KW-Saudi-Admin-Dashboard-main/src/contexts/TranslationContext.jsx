import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import arTranslations from '../../src/translations/ar.json'; // Adjusted import path
// import { translateText, translateBatch, needsTranslation } from '../utils/translationApi'; // Removed as no longer using external API

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [manualTranslations, setManualTranslations] = useState({}); // New state for manual translations

  // Load translations from ar.json when the component mounts
  useEffect(() => {
    setManualTranslations(arTranslations);
  }, []); // Empty dependency array means this runs once on mount

  /** --- translate single text with cache (now only uses manual translations) --- */
  const t = useCallback((key, fallbackText = key) => {
    if (language === 'en') return key;
    // Prioritize manual translations
    if (manualTranslations[key]) {
      return manualTranslations[key];
    }
    return fallbackText;
  }, [language, manualTranslations]);

  /** --- switch language --- */
  const switchToLanguage = useCallback((lang) => {
    if (lang !== 'en' && lang !== 'ar') return;
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
    window.dispatchEvent(new CustomEvent('globalLanguageSwitch', {
      detail: { language: lang }
    }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prevLang => (prevLang === 'en' ? 'ar' : 'en'));
  }, []);

  const isRTL = language === 'ar';

  // Function to set manual translations directly, if needed for dynamic content
  const setTranslation = useCallback((newTranslations) => {
    setManualTranslations(prev => ({ ...prev, ...newTranslations }));
  }, []);

  /** --- init preferred language --- */
  useEffect(() => {
    const saved = localStorage.getItem('preferred-language');
    if (saved === 'en' || saved === 'ar') {
      setLanguage(saved);
    }
  }, []);

  /** --- apply dir + lang attributes to html element --- */
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [language, isRTL]);

  /** --- cross-tab sync --- */
  useEffect(() => {
    const handler = e => {
      if (e.key === 'preferred-language' && e.newValue && e.newValue !== language) {
        switchToLanguage(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [language, switchToLanguage]);

  const value = {
    language,
    isRTL,
    t,
    switchToLanguage,
    toggleLanguage,
    setManualTranslation: setTranslation
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
