/**
 * Hreflang Utility for KW Saudi Arabia
 * Generates hreflang metadata for multilingual SEO
 * Works with existing translation system
 */

/**
 * Generate hreflang metadata for Next.js pages
 * @param {string} pathname - The page path (e.g., '/about-us', '/properties')
 * @param {string} currentLang - Current language ('en' or 'ar')
 * @returns {object} Next.js metadata object with alternates
 */
export function generateHreflangMetadata(pathname, currentLang = 'en') {
  // Get base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kwsaudiarabia.com';
  
  // Ensure pathname starts with /
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  return {
    alternates: {
      languages: {
        'en': `${baseUrl}${cleanPath}`,                    // English version
        'ar': `${baseUrl}${cleanPath}?lang=ar`,           // Arabic version with query param
        'x-default': `${baseUrl}${cleanPath}`,            // Default fallback (English)
      }
    }
  };
}

/**
 * Generate hreflang metadata with custom URLs
 * @param {object} urls - Custom URL mapping { en: 'url', ar: 'url' }
 * @returns {object} Next.js metadata object with alternates
 */
export function generateCustomHreflangMetadata(urls) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kwsaudiarabia.com';
  
  return {
    alternates: {
      languages: {
        'en': urls.en || `${baseUrl}`,
        'ar': urls.ar || `${baseUrl}?lang=ar`,
        'x-default': urls.en || `${baseUrl}`,
      }
    }
  };
}

/**
 * Get language from search parameters or default (Async version for Next.js 15+)
 * @param {Promise<URLSearchParams>|URLSearchParams} searchParams - Next.js searchParams (can be async in Next.js 15+)
 * @returns {Promise<string>} Language code ('en' or 'ar')
 */
export async function getLanguageFromParams(searchParams) {
  if (!searchParams) return 'en';
  
  try {
    // Handle both sync and async searchParams
    const params = await searchParams;
    const lang = params?.get?.('lang');
    return (lang === 'ar') ? 'ar' : 'en';
  } catch (error) {
    // If it's not a promise, try to access directly
    try {
      const lang = searchParams?.get?.('lang');
      return (lang === 'ar') ? 'ar' : 'en';
    } catch {
      console.warn('Error reading searchParams:', error);
      return 'en';
    }
  }
}

/**
 * Async version for handling Next.js 15+ async searchParams
 * @param {Promise<URLSearchParams>} searchParams - Async searchParams
 * @returns {Promise<string>} Language code ('en' or 'ar')
 */
export async function getLanguageFromParamsAsync(searchParams) {
  return getLanguageFromParams(searchParams);
}

/**
 * Generate language-specific canonical URL
 * @param {string} pathname - The page path
 * @param {string} lang - Language code
 * @returns {string} Complete canonical URL
 */
export function generateCanonicalUrl(pathname, lang = 'en') {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kwsaudiarabia.com';
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  return lang === 'ar' 
    ? `${baseUrl}${cleanPath}?lang=ar`
    : `${baseUrl}${cleanPath}`;
}