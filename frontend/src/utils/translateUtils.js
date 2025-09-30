// Utility functions for React-compatible translation

// Add data-translate attributes to all text elements safely
export const makePageTranslatable = () => {
    try {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, a, label');

        textElements.forEach(el => {
            if (el.textContent &&
                el.textContent.trim() &&
                !el.hasAttribute('data-translate') &&
                !el.closest('[data-no-translate]') &&
                !el.hasAttribute('data-translated')) {
                el.setAttribute('data-translate', 'true');
                el.setAttribute('data-original-text', el.textContent);
            }
        });
    } catch (error) {
        console.error('Error making page translatable:', error);
    }
};

// Translate all elements with data-translate attribute safely
export const translatePageElements = async (translateFunction) => {
    try {
        const elements = document.querySelectorAll('[data-translate]');

        for (const element of elements) {
            const originalText = element.getAttribute('data-original-text') || element.textContent;
            if (originalText && originalText.trim()) {
                try {
                    const translatedText = await translateFunction(originalText, 'ar');
                    if (translatedText && translatedText !== originalText) {
                        element.textContent = translatedText;
                        element.setAttribute('data-translated', 'true');
                    }
                } catch (error) {
                    console.error('Translation failed for:', originalText, error);
                }
            }
        }
    } catch (error) {
        console.error('Error translating page elements:', error);
    }
};

// Restore original text (for switching back to English) safely
export const restoreOriginalText = () => {
    try {
        const elements = document.querySelectorAll('[data-translate]');

        elements.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.textContent = originalText;
                element.removeAttribute('data-translated');
            }
        });
    } catch (error) {
        console.error('Error restoring original text:', error);
    }
};

// Add translation attributes to specific elements safely
export const addTranslationAttributes = (selector) => {
    try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.textContent && !el.hasAttribute('data-translate')) {
                el.setAttribute('data-translate', 'true');
                el.setAttribute('data-original-text', el.textContent);
            }
        });
    } catch (error) {
        console.error('Error adding translation attributes:', error);
    }
};

// Safe DOM query selector with error handling
export const safeQuerySelector = (selector) => {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.error('Error querying selector:', selector, error);
        return null;
    }
};

// Safe DOM query selector all with error handling
export const safeQuerySelectorAll = (selector) => {
    try {
        return document.querySelectorAll(selector);
    } catch (error) {
        console.error('Error querying selector all:', selector, error);
        return [];
    }
};

// Check if element is in viewport
export const isElementInViewport = (el) => {
    try {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    } catch (error) {
        console.error('Error checking viewport:', error);
        return false;
    }
};

// Translate elements in batches to avoid overwhelming the API
export const translateElementsInBatches = async (elements, translateFunction, batchSize = 5) => {
    try {
        for (let i = 0; i < elements.length; i += batchSize) {
            const batch = Array.from(elements).slice(i, i + batchSize);
            await Promise.all(batch.map(async (el) => {
                try {
                    const originalText = el.getAttribute('data-original-text') || el.textContent;
                    if (originalText && originalText.trim()) {
                        const translatedText = await translateFunction(originalText, 'ar');
                        if (translatedText && translatedText !== originalText) {
                            el.textContent = translatedText;
                            el.setAttribute('data-translated', 'true');
                        }
                    }
                } catch (error) {
                    console.error('Error translating element in batch:', error);
                }
            }));

            // Small delay between batches
            if (i + batchSize < elements.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    } catch (error) {
        console.error('Error translating elements in batches:', error);
    }
};

// Clean up translation attributes
export const cleanupTranslationAttributes = () => {
    try {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            el.removeAttribute('data-translate');
            el.removeAttribute('data-original-text');
            el.removeAttribute('data-translated');
        });
    } catch (error) {
        console.error('Error cleaning up translation attributes:', error);
    }
};
