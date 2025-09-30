'use client'
import React, { useState, useEffect } from 'react';

const TranslationTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testTranslation = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      const GOOGLE_API_KEY = 'AIzaSyDX7R7IWMpq6qI1HefOpI8auw0nQFFvgYw';
      const testText = 'Hello World';
      
      const params = new URLSearchParams({
        key: GOOGLE_API_KEY,
        q: testText,
        target: 'ar',
        source: 'en',
        format: 'text'
      });

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data && data.data && data.data.translations && data.data.translations[0]) {
        setTestResult(`✅ API Working! Translation: ${data.data.translations[0].translatedText}`);
      } else {
        setTestResult('❌ Invalid response format');
      }
    } catch (error) {
      console.error('Translation test failed:', error);
      setTestResult(`❌ Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    testTranslation();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Translation API Test</h2>
      <button 
        onClick={testTranslation}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Test Translation'}
      </button>
      <div className="p-4 bg-gray-100 rounded">
        <strong>Result:</strong> {testResult}
      </div>
    </div>
  );
};

export default TranslationTest;