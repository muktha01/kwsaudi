// Custom hook for easy translation usage
import { useTranslation } from '../contexts/TranslationContext';

export const useTranslationHook = () => {
    const {
        language,
        isRTL,
        isTranslating,
        switchToLanguage,
        translateText,
        translatePage,
        t,
        translationProgress,
        translationErrors,
        clearTranslationErrors
    } = useTranslation();

    // Helper function for conditional translation
    const translateIfNeeded = (text, fallback = text) => {
        return language === 'ar' ? t(text) : text;
    };

    // Helper for dynamic content translation
    const translateDynamic = async (text) => {
        if (language === 'en') return text;
        return await translateText(text);
    };

    return {
        // Core translation functions
        language,
        isRTL,
        isTranslating,
        switchToLanguage,
        translateText,
        translatePage,
        t,

        // Enhanced utilities
        translateIfNeeded,
        translateDynamic,

        // Progress and error tracking
        translationProgress,
        translationErrors,
        clearTranslationErrors,

        // Computed properties
        isEnglish: language === 'en',
        isArabic: language === 'ar',
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left'
    };
};
