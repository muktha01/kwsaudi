'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import frontendTranslationService from '@/services/translationService';

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
  const [manualTranslations, setManualTranslations] = useState({});
  const [translationErrors, setTranslationErrors] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const BASE_API = API_URL.replace(/\/+$/, '');
  const REFRESH_MS = Number(process.env.NEXT_PUBLIC_TRANSLATION_REFRESH_MS || 30000);
  const isFetchingRef = useRef(false);
  const retryTimeoutRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Enhanced cache management
  const CACHE_KEY = 'ar_translations_cache';
  const CACHE_TIMESTAMP_KEY = 'ar_translations_cache_timestamp';
  const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  const applyTranslations = useCallback((map, source = 'unknown') => {
    // console.log(`🔄 Applying translations from ${source}:`, Object.keys(map).length, 'translations');
    setManualTranslations(map);
    setLastFetchTime(Date.now());
    
    // Enhanced caching with timestamp
    try { 
      localStorage.setItem(CACHE_KEY, JSON.stringify(map)); 
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      // console.warn('Failed to cache translations:', e);
    }
  }, []);

  // Check if cached data is still valid
  const isCacheValid = useCallback(() => {
    try {
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestamp) return false;
      
      const cacheAge = Date.now() - parseInt(timestamp);
      return cacheAge < CACHE_EXPIRY;
    } catch {
      return false;
    }
  }, [CACHE_EXPIRY]);

  // Enhanced fetch function with better error handling
  const fetchTranslations = useCallback(async (forceRefresh = false) => {
    if (isFetchingRef.current && !forceRefresh) return false;
    isFetchingRef.current = true;
    setConnectionStatus('connecting');

    try {
      // console.log('🌐 Fetching translations from backend...');
      
      // First test backend connectivity
      const isConnected = await frontendTranslationService.testConnection();
      if (!isConnected) {
        throw new Error('Backend server is not accessible');
      }
      
      const data = await frontendTranslationService.fetchTranslationsBatch();
      
      if (Array.isArray(data) && data.length > 0) {
        const translationMap = data.reduce((acc, item) => {
          if (item && item.key && typeof item.value === 'string') {
            acc[item.key] = item.value;
          }
          return acc;
        }, {});

        // console.log('✅ Successfully fetched', Object.keys(translationMap).length, 'translations from backend');
        applyTranslations(translationMap, 'backend');
        setConnectionStatus('connected');
        setLoaded(true);
        setIsOnline(true);
        
        // Clear any retry timeouts
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        
        return true;
      } else {
        // console.warn('⚠️ Empty or invalid translation data received from backend');
        throw new Error('Empty or invalid translation data received');
      }
    } catch (error) {
      // console.error('❌ Failed to fetch translations from backend:', error.message);
      setConnectionStatus('error');
      setIsOnline(false);
      
      // Don't retry immediately, let the fallback handle this
      return false;
    } finally {
      isFetchingRef.current = false;
    }
  }, [applyTranslations]);

  // Load translations with enhanced caching and fallback strategy
  useEffect(() => {
    (async () => {
      // console.log('🚀 Initializing Translation System...');
      
      try {
        // First, try to load from cache if valid
        if (isCacheValid()) {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            // console.log('📋 Loading from valid cache...');
            const parsedCache = JSON.parse(cached);
            applyTranslations(parsedCache, 'cache');
            setLoaded(true);
            setConnectionStatus('cached');
          }
        }

        // Then try to fetch fresh data from backend
        // console.log('🔄 Attempting to fetch from backend...');
        const backendSuccess = await fetchTranslations();
        
        // If backend fails, load static ar.json as fallback
        if (!backendSuccess) {
          // console.log('📁 Backend unavailable, loading static fallback translations...');
          try {
            const staticTranslations = await import('../translations/ar.json');
            const translationData = staticTranslations.default || {};
            
            if (Object.keys(translationData).length > 0) {
              applyTranslations(translationData, 'static-fallback');
              setConnectionStatus('offline');
              // console.log('✅ Loaded', Object.keys(translationData).length, 'static translations as fallback');
            } else {
              // console.warn('⚠️ Static translation file is empty');
            }
          } catch (staticError) {
            // console.error('❌ Failed to load static translations:', staticError.message);
            setConnectionStatus('error');
          }
        }
      } catch (error) {
        // console.error('❌ Error during translation initialization:', error);
        setConnectionStatus('error');
      } finally {
        setLoaded(true);
      }
    })();
  }, [applyTranslations, fetchTranslations, isCacheValid]);

  // Set up real-time updates and periodic refresh
  useEffect(() => {
    let unsubscribe;
    let refreshInterval;

    if (loaded && isOnline) {
      // Set up real-time subscription
      unsubscribe = frontendTranslationService.subscribeToTranslationUpdates((translations) => {
        if (Array.isArray(translations)) {
          const translationMap = translations.reduce((acc, item) => {
            if (item && item.key && typeof item.value === 'string') {
              acc[item.key] = item.value;
            }
            return acc;
          }, {});
          
          // console.log('🔄 Real-time translation update received');
          applyTranslations(translationMap, 'real-time-update');
        }
      });

      // Set up periodic refresh
      refreshInterval = setInterval(() => {
        // console.log('⏰ Periodic translation refresh...');
        fetchTranslations();
      }, REFRESH_MS);

      // Refresh on window focus
      const handleFocus = () => {
        // console.log('👁️ Window focused - refreshing translations...');
        fetchTranslations();
      };
      window.addEventListener('focus', handleFocus);

      return () => {
        if (unsubscribe) unsubscribe();
        if (refreshInterval) clearInterval(refreshInterval);
        window.removeEventListener('focus', handleFocus);
      };
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [loaded, isOnline, fetchTranslations, applyTranslations, REFRESH_MS]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      // console.log('🌐 Network back online - fetching translations...');
      setIsOnline(true);
      fetchTranslations(true);
    };

    const handleOffline = () => {
      // console.log('📴 Network offline - using cached translations');
      setIsOnline(false);
      setConnectionStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchTranslations]);

  // Enhanced translation function with debugging
  const t = useCallback((key, fallbackText = key) => {
    if (language === 'en') return key;
    
    const translation = manualTranslations[key];
    if (translation) return translation;
    
    // Log missing translations for development
    if (process.env.NODE_ENV === 'development' && key !== fallbackText) {
      // console.log(`🔍 Missing translation for key: "${key}"`);
    }
    
    return fallbackText;
  }, [language, manualTranslations]);

  // Enhanced language switching with event broadcasting
  const switchToLanguage = useCallback((lang) => {
    if (lang !== 'en' && lang !== 'ar') return;
    
    // console.log(`🌍 Switching language to: ${lang}`);
    setLanguage(lang);
    
    try { 
      localStorage.setItem('preferred-language', lang); 
    } catch (e) {
      // console.warn('Failed to save language preference:', e);
    }
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('globalLanguageSwitch', { 
        detail: { language: lang, timestamp: Date.now() }
      }));
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'ar' : 'en';
    switchToLanguage(newLang);
  }, [language, switchToLanguage]);

  const isRTL = language === 'ar';

  // Enhanced manual translation setting with immediate cache update
  const setTranslation = useCallback((newTranslations) => {
    // console.log('📝 Setting manual translations:', Object.keys(newTranslations).length);
    setManualTranslations(prev => {
      const merged = { ...prev, ...newTranslations };
      
      try { 
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged)); 
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch (e) {
        // console.warn('Failed to cache manual translations:', e);
      }
      
      return merged;
    });
  }, []);

  // Force refresh function
  const forceReloadTranslations = useCallback(async () => {
    // console.log('🔄 Force reloading translations...');
    
    // Clear cache
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (e) {
      // console.warn('Failed to clear translation cache:', e);
    }
    
    // Fetch fresh data
    await fetchTranslations(true);
  }, [fetchTranslations]);

  // Initialize language from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('preferred-language');
      if (saved === 'en' || saved === 'ar') {
        // console.log('🔄 Restoring saved language:', saved);
        setLanguage(saved);
      }
    } catch (e) {
      // console.warn('Failed to load language preference:', e);
    }
  }, []);

  // Update document attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      
      // Add language class for CSS styling
      document.documentElement.className = 
        document.documentElement.className.replace(/\blang-\w+\b/g, '') + ` lang-${language}`;
    }
  }, [language, isRTL]);

  // Cross-tab language synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'preferred-language' && e.newValue && e.newValue !== language) {
        // console.log('🔄 Language changed in another tab:', e.newValue);
        switchToLanguage(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language, switchToLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cleanup = subscriptionRef.current;
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const value = {
    language,
    isRTL,
    t,
    switchToLanguage,
    toggleLanguage,
    setManualTranslation: setTranslation,
    loaded,
    isOnline,
    connectionStatus,
    lastFetchTime,
    translationCount: Object.keys(manualTranslations).length,
    forceReloadTranslations,
    translationErrors: translationErrors || [],
    clearTranslationErrors: () => setTranslationErrors([]),
    setTranslationErrors,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
