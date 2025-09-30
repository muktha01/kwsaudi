// Enhanced Translation Status Component for debugging and monitoring
'use client';
import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

const TranslationStatus = ({ showDetails = false, showInDevelopment = true }) => {
  const { 
    connectionStatus, 
    isOnline, 
    loaded, 
    translationCount, 
    lastFetchTime, 
    forceReloadTranslations,
    language,
    isRTL
  } = useTranslation();

  // Only show in development mode unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !showInDevelopment) {
    return null;
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'cached': return 'text-blue-600';
      case 'offline': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'connecting': return 'text-gray-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢';
      case 'cached': return '📋';
      case 'offline': return '📴';
      case 'error': return '🔴';
      case 'connecting': return '🔄';
      default: return '⚪';
    }
  };

  if (!showDetails) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border rounded-full p-2 shadow-lg">
        <span className="text-lg" title={`Translation: ${connectionStatus}`}>
          {getStatusIcon()}
        </span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-3 text-xs max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-700 dark:text-gray-300">
          Translation System
        </div>
        <button
          onClick={forceReloadTranslations}
          className="text-blue-500 hover:text-blue-700 text-sm"
          title="Force reload translations"
        >
          🔄
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span>{getStatusIcon()}</span>
          <span className={`${getStatusColor()} font-medium`}>
            {connectionStatus}
          </span>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400">
          <div>Language: {language} {isRTL ? '(RTL)' : '(LTR)'}</div>
          <div>Loaded: {loaded ? '✅' : '❌'}</div>
          <div>Online: {isOnline ? '🌐' : '📴'}</div>
          <div>Count: {translationCount}</div>
          {lastFetchTime && (
            <div>
              Last: {new Date(lastFetchTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook for translation debugging
export const useTranslationDebug = () => {
  const context = useTranslation();
  
  const logTranslationStats = () => {
    console.log('📊 Translation System Stats:', {
      connectionStatus: context.connectionStatus,
      isOnline: context.isOnline,
      loaded: context.loaded,
      language: context.language,
      isRTL: context.isRTL,
      translationCount: context.translationCount,
      lastFetchTime: context.lastFetchTime ? new Date(context.lastFetchTime) : null,
    });
  };

  const testTranslation = (key) => {
    const result = context.t(key);
    console.log(`🔍 Translation test for "${key}":`, result);
    return result;
  };

  const getAllTranslations = () => {
    return context.manualTranslations || {};
  };

  return {
    ...context,
    logTranslationStats,
    testTranslation,
    getAllTranslations,
  };
};

export default TranslationStatus;
