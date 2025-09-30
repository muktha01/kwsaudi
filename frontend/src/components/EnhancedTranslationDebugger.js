'use client'
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { FaGlobe, FaSpinner, FaBug, FaCheck, FaTimes } from 'react-icons/fa';

const EnhancedTranslationDebugger = () => {
  const { 
    language, 
    isRTL, 
    isTranslating, 
    switchToLanguage, 
    translationProgress,
    translationErrors,
    clearTranslationErrors,
    translateText,
    forceRetranslate,
    restoreOriginalTexts
  } = useTranslation();

  const [debugMode, setDebugMode] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);
  const [testingApi, setTestingApi] = useState(false);
  const [elementCounts, setElementCounts] = useState({ total: 0, translatable: 0, translated: 0 });

  // Test API functionality
  const testApiConnection = async () => {
    setTestingApi(true);
    setApiTestResult(null);
    
    try {
      const testText = 'Hello World';
      const result = await translateText(testText, 'ar', 'en');
      
      if (result && result !== testText) {
        setApiTestResult({ 
          success: true, 
          result: result,
          message: 'API working correctly!' 
        });
      } else {
        setApiTestResult({ 
          success: false, 
          message: 'API returned same text or empty result' 
        });
      }
    } catch (error) {
      setApiTestResult({ 
        success: false, 
        message: error.message 
      });
    }
    
    setTestingApi(false);
  };

  // Handle language switching with enhanced logging
  const handleLanguageSwitch = async (newLanguage) => {
    console.log(`🔄 Switching language from ${language} to ${newLanguage}`);
    
    try {
      await switchToLanguage(newLanguage);
      console.log(`✅ Language switched successfully to ${newLanguage}`);
    } catch (error) {
      console.error('❌ Language switch failed:', error);
    }
  };

  // Count translatable elements on page
  const countTranslatableElements = () => {
    // Check if we're in browser environment
    if (typeof document === 'undefined') {
      return { total: 0, translatable: 0, translated: 0 };
    }

    const textSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span:not(.goog-te-menu2-item)', 'div:not(.goog-te-gadget)',
      'button:not([data-no-translate])', 'a:not([data-no-translate])',
      'label', 'li', 'td', 'th'
    ];

    const allElements = document.querySelectorAll(textSelectors.join(', '));
    const translatable = Array.from(allElements).filter(el => {
      return el.textContent && 
             el.textContent.trim() && 
             !el.hasAttribute('data-no-translate') &&
             !el.closest('[data-no-translate]') &&
             el.offsetParent !== null;
    });

    const translated = document.querySelectorAll('[data-translated]');

    return { 
      total: allElements.length, 
      translatable: translatable.length,
      translated: translated.length
    };
  };

  // Update element counts periodically
  useEffect(() => {
    const updateCounts = () => {
      setElementCounts(countTranslatableElements());
    };

    updateCounts(); // Initial count
    const interval = setInterval(updateCounts, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [language, isTranslating]);

  const elementCountsData = elementCounts;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Language Switcher */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-2">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isTranslating ? (
                <FaSpinner className="animate-spin text-blue-500" size={16} />
              ) : (
                <FaGlobe className="text-blue-500" size={16} />
              )}
              <span className="font-medium text-gray-800">
                Language: {language === 'en' ? 'English' : 'عربي'}
              </span>
            </div>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="text-gray-500 hover:text-gray-700"
              title="Toggle Debug Mode"
            >
              <FaBug size={14} />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageSwitch('en')}
              disabled={isTranslating || language === 'en'}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                language === 'en' 
                  ? 'bg-blue-100 text-blue-800 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageSwitch('ar')}
              disabled={isTranslating || language === 'ar'}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                language === 'ar' 
                  ? 'bg-blue-100 text-blue-800 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              عربي
            </button>
          </div>

          {/* Force Retranslate Button */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={forceRetranslate}
              disabled={isTranslating || language === 'en'}
              className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200 disabled:opacity-50"
              title="Force retranslation of current page"
            >
              Force Retranslate
            </button>
            <button
              onClick={restoreOriginalTexts}
              disabled={isTranslating}
              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 disabled:opacity-50"
              title="Restore all text to original English"
            >
              Restore Original
            </button>
          </div>

          {/* Translation Progress */}
          {isTranslating && translationProgress.total > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Translating...</span>
                <span>{translationProgress.current}/{translationProgress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(translationProgress.current / translationProgress.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Translation Errors */}
          {translationErrors.length > 0 && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <div className="flex items-center justify-between">
                <span className="text-red-600">
                  {translationErrors.length} error(s) occurred
                </span>
                <button
                  onClick={clearTranslationErrors}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug Panel */}
      {debugMode && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <FaBug size={14} />
            Debug Information
          </h3>

          <div className="space-y-3 text-xs">
            {/* API Test */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600">API Status:</span>
                <button
                  onClick={testApiConnection}
                  disabled={testingApi}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50"
                >
                  {testingApi ? 'Testing...' : 'Test'}
                </button>
              </div>
              {apiTestResult && (
                <div className={`flex items-center gap-1 ${
                  apiTestResult.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {apiTestResult.success ? <FaCheck size={10} /> : <FaTimes size={10} />}
                  <span>{apiTestResult.message}</span>
                </div>
              )}
              {apiTestResult?.result && (
                <div className="mt-1 p-1 bg-gray-100 rounded text-xs">
                  Result: {apiTestResult.result}
                </div>
              )}
            </div>

            {/* Element Counts */}
            <div>
              <span className="text-gray-600">Elements on page:</span>
              <div className="ml-2">
                <div>Total: {elementCountsData.total}</div>
                <div>Translatable: {elementCountsData.translatable}</div>
                <div>Translated: {elementCountsData.translated}</div>
                <div className="text-xs text-gray-500">
                  {elementCountsData.translated > 0 && elementCountsData.translatable > 0 
                    ? `${Math.round((elementCountsData.translated / elementCountsData.translatable) * 100)}% translated`
                    : 'No translation data'
                  }
                </div>
              </div>
            </div>

            {/* Current State */}
            <div>
              <span className="text-gray-600">Current state:</span>
              <div className="ml-2">
                <div>Language: {language}</div>
                <div>RTL: {isRTL ? 'Yes' : 'No'}</div>
                <div>Translating: {isTranslating ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Browser Info */}
            <div>
              <span className="text-gray-600">Browser:</span>
              <div className="ml-2">
                <div>Direction: {document.documentElement.dir || 'ltr'}</div>
                <div>Lang: {document.documentElement.lang || 'en'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTranslationDebugger;