'use client'
import { useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

/**
 * Client component to handle dynamic HTML lang and dir attributes
 * Works with the existing translation system
 */
export default function LanguageHandler() {
  const { language, isRTL } = useTranslation();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Update HTML lang attribute
      document.documentElement.setAttribute('lang', language);
      
      // Update text direction
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      
      // Add language class for CSS styling (preserve existing functionality)
      const currentClasses = document.documentElement.className;
      const newClasses = currentClasses.replace(/\blang-\w+\b/g, '') + ` lang-${language}`;
      document.documentElement.className = newClasses.trim();
    }
  }, [language, isRTL]);

  // This component doesn't render anything visible
  return null;
}