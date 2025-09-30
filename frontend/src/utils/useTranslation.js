import { useState, useEffect, useCallback, useRef } from 'react';
import { translateText, translateBatch, needsTranslation } from './translationApi';

// Custom hook for React component translation
export const useComponentTranslation = (initialLanguage = 'en') => {
    const [language, setLanguage] = useState(initialLanguage);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedTexts, setTranslatedTexts] = useState(new Map());
    const [translationQueue, setTranslationQueue] = useState([]);
    const abortControllerRef = useRef(null);

    // Translate a single text
    const translate = useCallback(async (text, targetLang = 'ar') => {
        if (!text || typeof text !== 'string') return text;
        if (!needsTranslation(text, language, targetLang)) return text;

        // Check if already translated
        const cacheKey = `${text}_${targetLang}`;
        if (translatedTexts.has(cacheKey)) {
            return translatedTexts.get(cacheKey);
        }

        try {
            setIsTranslating(true);
            const translatedText = await translateText(text, targetLang, language);
            
            if (translatedText && translatedText !== text) {
                setTranslatedTexts(prev => new Map(prev).set(cacheKey, translatedText));
                return translatedText;
            }
            
            return text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        } finally {
            setIsTranslating(false);
        }
    }, [language, translatedTexts]);

    // Translate multiple texts
    const translateMultiple = useCallback(async (texts, targetLang = 'ar') => {
        if (!Array.isArray(texts) || texts.length === 0) return texts;

        const textsToTranslate = texts.filter(text => 
            text && typeof text === 'string' && needsTranslation(text, language, targetLang)
        );

        if (textsToTranslate.length === 0) return texts;

        try {
            setIsTranslating(true);
            const translatedTexts = await translateBatch(textsToTranslate, targetLang, language);
            
            // Create a map of original to translated text
            const translationMap = new Map();
            textsToTranslate.forEach((original, index) => {
                translationMap.set(original, translatedTexts[index]);
            });

            // Update the cache
            setTranslatedTexts(prev => new Map([...prev, ...translationMap]));

            // Return texts with translations applied
            return texts.map(text => translationMap.get(text) || text);
        } catch (error) {
            console.error('Batch translation error:', error);
            return texts;
        } finally {
            setIsTranslating(false);
        }
    }, [language]);

    // Switch language
    const switchLanguage = useCallback(async (newLanguage) => {
        if (newLanguage === language) return;

        // Cancel any ongoing translations
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setLanguage(newLanguage);
        
        // Clear translations when switching back to English
        if (newLanguage === 'en') {
            setTranslatedTexts(new Map());
        }
    }, [language]);

    // Get translated text with fallback
    const t = useCallback((text, fallbackText = text) => {
        if (language === 'en') return text;
        
        const cacheKey = `${text}_ar`;
        return translatedTexts.get(cacheKey) || fallbackText;
    }, [language, translatedTexts]);

    // Clear translation cache
    const clearCache = useCallback(() => {
        setTranslatedTexts(new Map());
    }, []);

    // Preload translations for common texts
    const preloadTranslations = useCallback(async (texts) => {
        if (language === 'en') return;
        
        try {
            await translateMultiple(texts, 'ar');
        } catch (error) {
            console.error('Error preloading translations:', error);
        }
    }, [language, translateMultiple]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const controller = abortControllerRef.current;
            if (controller) {
                controller.abort();
            }
        };
    }, []);

    return {
        language,
        isTranslating,
        translate,
        translateMultiple,
        switchLanguage,
        t,
        clearCache,
        preloadTranslations,
        translatedTexts
    };
};

// Hook for translating React components
export const useComponentTranslator = (componentRef, language) => {
    const [isTranslated, setIsTranslated] = useState(false);
    const [originalTexts, setOriginalTexts] = useState(new Map());

    const translateComponent = useCallback(async () => {
        if (!componentRef.current || language === 'en') {
            setIsTranslated(false);
            return;
        }

        try {
            const element = componentRef.current;
            const textNodes = getTextNodes(element);
            
            // Store original texts
            const texts = new Map();
            textNodes.forEach(node => {
                if (node.textContent && node.textContent.trim()) {
                    texts.set(node, node.textContent);
                }
            });
            
            setOriginalTexts(texts);

            // Translate texts
            const textsToTranslate = Array.from(texts.values());
            const translatedTexts = await translateBatch(textsToTranslate, 'ar', 'en');

            // Apply translations
            textNodes.forEach((node, index) => {
                if (translatedTexts[index] && translatedTexts[index] !== texts.get(node)) {
                    node.textContent = translatedTexts[index];
                }
            });

            setIsTranslated(true);
        } catch (error) {
            console.error('Component translation error:', error);
        }
    }, [componentRef, language]);

    const restoreComponent = useCallback(() => {
        if (!componentRef.current) return;

        try {
            const element = componentRef.current;
            const textNodes = getTextNodes(element);

            textNodes.forEach(node => {
                const originalText = originalTexts.get(node);
                if (originalText) {
                    node.textContent = originalText;
                }
            });

            setIsTranslated(false);
            setOriginalTexts(new Map());
        } catch (error) {
            console.error('Component restoration error:', error);
        }
    }, [componentRef, originalTexts]);

    // Get all text nodes in an element
    const getTextNodes = (element) => {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip if parent has data-no-translate attribute
                    if (node.parentElement && node.parentElement.hasAttribute('data-no-translate')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Skip if text is empty or only whitespace
                    if (!node.textContent || !node.textContent.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        return textNodes;
    };

    return {
        isTranslated,
        translateComponent,
        restoreComponent
    };
};
