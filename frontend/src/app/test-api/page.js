'use client'
import React from 'react';
import TranslationTest from '../../components/TranslationTest';

const TestTranslationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Translation API Test Page</h1>
        <TranslationTest />
      </div>
    </div>
  );
};

export default TestTranslationPage;