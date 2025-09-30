'use client'
import { useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * Hook to ensure proper translation on page load and route changes
 * Use this hook in page components to ensure they are translated when needed
 */
export const usePageTranslation = () => {
    const { language, translatePage, isTranslating } = useTranslation();

    useEffect(() => {
        // Apply translation if current language is Arabic
        if (language === 'ar') {
            // Small delay to ensure DOM is fully rendered
            const timer = setTimeout(() => {
                console.log('Page loaded, applying Arabic translation...');
                translatePage();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [language, translatePage]);

    // Listen for global language switch events
    useEffect(() => {
        const handleGlobalLanguageSwitch = (event) => {
            const { language: newLanguage } = event.detail;
            
            if (newLanguage === 'ar') {
                // Small delay to ensure language context has updated
                setTimeout(() => {
                    console.log('Global language switch detected, applying Arabic translation...');
                    translatePage();
                }, 100);
            }
        };

        window.addEventListener('globalLanguageSwitch', handleGlobalLanguageSwitch);
        
        return () => {
            window.removeEventListener('globalLanguageSwitch', handleGlobalLanguageSwitch);
        };
    }, [translatePage]);

    return {
        language,
        isTranslating
    };
};

export default usePageTranslation;