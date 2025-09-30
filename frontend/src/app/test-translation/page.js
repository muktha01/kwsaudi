'use client'
import React from 'react';
import { TranslationProvider } from '../../contexts/TranslationContext';
import UniversalTranslator, { TranslatableText } from '../../components/UniversalTranslator';

const TestTranslationPage = () => {
  return (
    <TranslationProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Universal Translator Component */}
        <UniversalTranslator />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Translation Test Page
            </h1>
            <p className="text-gray-600 mb-6">
              This page tests the universal translation functionality. Click the language switcher to translate all content.
            </p>

            {/* Test Content */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to KW Saudi Arabia
                </h2>
                <p className="text-gray-600">
                  We are the leading real estate company in Saudi Arabia, providing exceptional service to our clients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Buy</h3>
                  <p className="text-blue-700 text-sm">
                    Find your dream home with our extensive property listings and expert guidance.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Sell</h3>
                  <p className="text-green-700 text-sm">
                    Get the best value for your property with our professional selling services.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Rent</h3>
                  <p className="text-purple-700 text-sm">
                    Discover rental properties that match your lifestyle and budget.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Agent</h3>
                  <p className="text-orange-700 text-sm">
                    Connect with experienced real estate agents in your area.
                  </p>
                </div>
              </div>

              {/* Navigation Menu Items */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Navigation Menu</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium">Sell</div>
                    <div>Instant Valuation</div>
                    <div>Seller Guide</div>
                    <div>Book KW Agent</div>
                    <div>Five Steps To Sell</div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Buy</div>
                    <div>Property Search</div>
                    <div>New Development</div>
                    <div>Buyer Guide</div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">About</div>
                    <div>About Us</div>
                    <div>Why KW</div>
                    <div>KW Training</div>
                    <div>KW Technology</div>
                    <div>KW University</div>
                  </div>
                </div>
              </div>

              {/* Test TranslatableText Component */}
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-4">TranslatableText Component Test</h3>
                <div className="space-y-2">
                  <TranslatableText tag="p" className="text-yellow-700">
                    This text uses the TranslatableText component.
                  </TranslatableText>
                  <TranslatableText tag="div" className="text-yellow-600 text-sm">
                    It should automatically translate when the language changes.
                  </TranslatableText>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-4">Contact</h3>
                <div className="space-y-2 text-red-700">
                  <div>Phone: +966 12 345 6789</div>
                  <div>Email: info@kwsaudiarabia.com</div>
                  <div>Address: Riyadh, Saudi Arabia</div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Test</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-medium">Click the Language Switcher</div>
                  <div className="text-sm">Use the floating language switcher in the top-right corner to switch between English and Arabic.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-medium">Watch the Translation</div>
                  <div className="text-sm">All text content should automatically translate to Arabic, and the layout should switch to RTL (right-to-left).</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-medium">Switch Back</div>
                  <div className="text-sm">Click the language switcher again to return to English and verify the original text is restored.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TranslationProvider>
  );
};

export default TestTranslationPage;