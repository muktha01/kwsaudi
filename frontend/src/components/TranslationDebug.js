// Temporary Translation Debug Component
'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TranslationDebug() {
  const { 
    connectionStatus, 
    isOnline, 
    loaded, 
    translationCount, 
    lastFetchTime, 
    forceReloadTranslations,
    language,
    t
  } = useTranslation();

  const [debugInfo, setDebugInfo] = useState('');
  const [testKey, setTestKey] = useState('Welcome');

  useEffect(() => {
    const info = `
Status: ${connectionStatus}
Online: ${isOnline}
Loaded: ${loaded}
Language: ${language}
Translation Count: ${translationCount}
Last Fetch: ${lastFetchTime ? new Date(lastFetchTime).toLocaleTimeString() : 'Never'}
Current URL: ${typeof window !== 'undefined' ? window.location.origin : 'Unknown'}
API URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}
    `;
    setDebugInfo(info);
  }, [connectionStatus, isOnline, loaded, language, translationCount, lastFetchTime]);

  const testTranslation = () => {
    const result = t(testKey);
    alert(`Translation test:\nKey: ${testKey}\nResult: ${result}`);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 text-xs max-w-sm">
      <div className="font-bold mb-2 text-red-600">🔧 Translation Debug Panel</div>
      
      <pre className="text-gray-700 dark:text-gray-300 mb-3 text-xs">
        {debugInfo}
      </pre>
      
      <div className="space-y-2">
        <button
          onClick={forceReloadTranslations}
          className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          🔄 Force Reload
        </button>
        
        <div className="flex gap-1">
          <input
            type="text"
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
            className="flex-1 border rounded px-1 py-1 text-xs"
            placeholder="Translation key"
          />
          <button
            onClick={testTranslation}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
          >
            Test
          </button>
        </div>
        
       <div className="text-gray-600 text-xs">
  Current: &quot;{t(testKey)}&quot;
</div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Remove this component when fixed!
      </div>
    </div>
  );
}