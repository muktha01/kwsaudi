// React-friendly translation API utilities

const GOOGLE_API_KEY = ''; // Removed Google API key

// Translation cache to avoid repeated API calls
const translationCache = new Map();

// Persistent cache using localStorage
const CACHE_KEY = 'google_translate_cache';
const CACHE_VERSION = '1.0';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Load cache from localStorage on startup
const loadCacheFromStorage = () => {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    try {
        const stored = localStorage.getItem(CACHE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.version === CACHE_VERSION && parsed.timestamp && 
                (Date.now() - parsed.timestamp) < MAX_CACHE_AGE) {
                
                // Load entries into memory cache
                Object.entries(parsed.data).forEach(([key, value]) => {
                    translationCache.set(key, value);
                });
                console.log(`Loaded ${translationCache.size} cached translations from storage`);
            } else {
                // Clear old cache
                localStorage.removeItem(CACHE_KEY);
                console.log('Cleared expired translation cache');
            }
        }
    } catch (error) {
        console.error('Error loading translation cache:', error);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CACHE_KEY);
        }
    }
};

// Save cache to localStorage
const saveCacheToStorage = () => {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    try {
        const cacheData = {
            version: CACHE_VERSION,
            timestamp: Date.now(),
            data: Object.fromEntries(translationCache.entries())
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error saving translation cache:', error);
        // If storage is full, clear some cache
        if (error.name === 'QuotaExceededError') {
            const entries = Array.from(translationCache.entries());
            // Keep only recent half
            const keepEntries = entries.slice(Math.floor(entries.length / 2));
            translationCache.clear();
            keepEntries.forEach(([key, value]) => translationCache.set(key, value));
            saveCacheToStorage(); // Try again with smaller cache
        }
    }
};

// Initialize cache on module load only in browser
if (typeof window !== 'undefined') {
    loadCacheFromStorage();
}

// Rate limiting - reduced interval for better performance
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 50; // Reduced from 200ms to 50ms for faster translation

// Enhanced retry logic with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;

            // Check for specific error types
            if (error.message.includes('429') || error.message.includes('quota')) {
                // For rate limiting, wait longer
                const delay = baseDelay * Math.pow(3, attempt);
                console.warn(`Rate limit hit, waiting ${delay}ms before retry ${attempt + 1}:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                const delay = baseDelay * Math.pow(2, attempt);
                console.warn(`Translation attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
};

// Enhanced rate limiting wrapper
const rateLimitedRequest = async (requestFn) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }

    lastRequestTime = Date.now();
    return requestFn();
};

// Enhanced translate text function with better error handling
export const translateText = async (text, targetLang = 'ar', sourceLang = 'en', apiKey = null) => {
    if (!text || typeof text !== 'string') return text;

    // Trim and validate text
    const trimmedText = text.trim();
    if (!trimmedText || trimmedText.length === 0) return text;

    // Skip very short text or single characters
    if (trimmedText.length < 2) return text;

    // Manual translation: return original text for now
                        return trimmedText;
};

// New bulk translate function using Google's batch API
const translateBulk = async (texts, targetLang = 'ar', sourceLang = 'en', apiKey = null) => {
    if (!texts || !Array.isArray(texts) || texts.length === 0) return texts;

    // Manual translation: return original texts for now
    return texts.map(text => text.trim());
};

// Enhanced translate multiple texts in batch using Google's bulk API
export const translateBatch = async (texts, targetLang = 'ar', sourceLang = 'en', maxBatchSize = 128) => {
    if (!Array.isArray(texts) || texts.length === 0) return texts;

    // Manual translation: return original texts for now
    return texts.map(text => text.trim());
};

// Clear translation cache
export const clearTranslationCache = () => {
    translationCache.clear();
};

// Get cache size for debugging
export const getCacheSize = () => {
    return translationCache.size;
};

// Get cache statistics
export const getCacheStats = () => {
    const stats = {
        size: translationCache.size,
        keys: Array.from(translationCache.keys()),
        memoryUsage: JSON.stringify(Array.from(translationCache.entries())).length
    };
    return stats;
};

// Remove old cache entries to prevent memory leaks
export const cleanupCache = (maxAge = 24 * 60 * 60 * 1000) => { // 24 hours default
    const now = Date.now();
    const entries = Array.from(translationCache.entries());

    entries.forEach(([key, value]) => {
        // If the cache entry has metadata about creation time, check age
        // For now, we'll implement a simple LRU by keeping only recent entries
        if (translationCache.size > 1000) { // Max cache size
            const oldestKey = entries[0][0];
            translationCache.delete(oldestKey);
        }
    });
};

// Test API connectivity
export const testApiConnection = async () => {
    // Manual translation: API connection is no longer relevant
        return {
            success: true,
        result: 'Manual translation in effect',
        message: 'API connection not applicable for manual translation'
    };
};

// Preload common translations
export const preloadCommonTranslations = async () => {
    // Manual translation: preloading from API is no longer relevant
    console.log('Common translations preloading skipped for manual translation');
};

// Detect language of text
export const detectLanguage = async (text) => {
    // Manual translation: language detection is no longer relevant
        return 'en'; // Default to English
};

// Enhanced validation if text needs translation
export const needsTranslation = (text, currentLang, targetLang) => {
    if (!text || typeof text !== 'string') return false;
    if (currentLang === targetLang) return false;

    const trimmedText = text.trim();
    if (trimmedText.length < 2) return false;

    // Skip translation for numbers, URLs, email addresses, and other patterns
    const skipPatterns = [
        /^\d+(\.\d+)?$/, // Numbers (including decimals)
        /^https?:\/\//, // URLs
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email addresses
        /^[A-Z0-9]{2,}$/, // All caps acronyms
        /^[+\-]?\d+[%$€£¥₹₽]+$/, // Currency/percentage values
        /^[\d\s\-\+\(\)]+$/, // Phone numbers
        /^[A-Z]{2,}\s*\d+$/, // Codes like "ABC123"
        /^\W+$/, // Only special characters
        /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, // Month abbreviations
        /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/, // Dates
        /^[a-zA-Z]{1,3}$/, // Very short abbreviations
    ];

    // Skip if matches any pattern
    if (skipPatterns.some(pattern => pattern.test(trimmedText))) {
        return false;
    }

    // Skip if text appears to be already in target language (Arabic detection)
    if (targetLang === 'ar') {
        // Check if text contains Arabic characters
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        if (arabicPattern.test(trimmedText)) {
            return false; // Already contains Arabic
        }
    }

    // Skip if text is mostly non-alphabetic
    const alphabeticChars = trimmedText.match(/[a-zA-Z\u0600-\u06FF]/g);
    if (!alphabeticChars || alphabeticChars.length < trimmedText.length * 0.3) {
        return false;
    }

    return true;
};

