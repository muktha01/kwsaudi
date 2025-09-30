'use client'
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { FaGlobe, FaSpinner } from 'react-icons/fa';

const UniversalTranslator = ({ 
  className = '',
  showProgress = true,
  position = 'fixed',
  style = {}
}) => {
  const { 
    language, 
    isRTL, 
    isTranslating, 
    switchToLanguage, 
    translationProgress,
    translationErrors,
    clearTranslationErrors
  } = useTranslation();

  const [isVisible, setIsVisible] = useState(true);

  // Handle language switching
  const handleLanguageToggle = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    try {
      await switchToLanguage(newLanguage);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  // Auto-hide errors after 5 seconds
  useEffect(() => {
    if (translationErrors.length > 0) {
      const timer = setTimeout(() => {
        clearTranslationErrors();
      }, 5001);
      return () => clearTimeout(timer);
    }
  }, [translationErrors, clearTranslationErrors]);

  const defaultStyle = position === 'fixed' ? {
    position: 'fixed',
    top: '20px',
    right: isRTL ? 'auto' : '20px',
    left: isRTL ? '20px' : 'auto',
    zIndex: 1000,
    ...style
  } : style;

  return (
    <div className={`universal-translator ${className}`} style={defaultStyle}>
      {/* Main Translation Toggle */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={handleLanguageToggle}
          disabled={isTranslating}
          className={`
            flex items-center gap-3 px-4 py-3 w-full text-left
            transition-all duration-200 hover:bg-gray-50
            ${isTranslating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
            ${isRTL ? 'flex-row-reverse text-right' : ''}
          `}
          title={`Switch to ${language === 'en' ? 'عربي' : 'English'}`}
        >
          <div className="flex items-center gap-2">
            {isTranslating ? (
              <FaSpinner className="animate-spin text-blue-500" size={16} />
            ) : (
              <FaGlobe className="text-blue-500" size={16} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="font-medium text-gray-800">
              {language === 'en' ? 'English' : 'عربي'}
            </div>
            <div className="text-xs text-gray-500">
              {isTranslating 
                ? `Translating... ${translationProgress.current}/${translationProgress.total}`
                : `Click to switch to ${language === 'en' ? 'عربي' : 'English'}`
              }
            </div>
          </div>

          <div className={`text-xs px-2 py-1 rounded-full ${
            language === 'ar' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {language.toUpperCase()}
          </div>
        </button>

        {/* Progress Bar */}
        {showProgress && isTranslating && translationProgress.total > 0 && (
          <div className="px-4 pb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(translationProgress.current / translationProgress.total) * 100}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {translationErrors.length > 0 && (
          <div className="px-4 pb-3">
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <div className="text-xs text-red-600">
                {translationErrors.length} translation error(s) occurred
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact version for headers/navbars
export const CompactUniversalTranslator = ({ className = '' }) => {
  const { language, isRTL, isTranslating, switchToLanguage } = useTranslation();

  const handleLanguageToggle = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    try {
      await switchToLanguage(newLanguage);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  return (
    <button
      onClick={handleLanguageToggle}
      disabled={isTranslating}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md
        bg-gray-100 hover:bg-gray-200 text-gray-700
        transition-colors duration-200 text-sm font-medium
        ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={`Switch to ${language === 'en' ? 'عربي' : 'English'}`}
    >
      {isTranslating ? (
        <FaSpinner className="animate-spin" size={14} />
      ) : (
        <FaGlobe size={14} />
      )}
      <span>{language === 'en' ? 'عربي' : 'English'}</span>
    </button>
  );
};

// Text component that automatically translates
export const TranslatableText = ({ 
  children, 
  fallback = null, 
  className = '',
  tag = 'span',
  ...props 
}) => {
  const { t, language } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (typeof children === 'string') {
      const translated = t(children, fallback || children);
      setTranslatedText(translated);
    }
  }, [children, fallback, t, language]);

  const Tag = tag;
  
  return (
    <Tag className={className} {...props}>
      {translatedText}
    </Tag>
  );
};

export default UniversalTranslator;
