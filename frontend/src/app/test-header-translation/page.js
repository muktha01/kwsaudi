'use client'
import React from 'react';
import Header from '../../components/header';

export default function TestHeaderTranslation() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        Header Translation Test
                    </h1>

                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                            <li>Select &quot;عربي&quot; to switch to Arabic</li>
<li>Watch as the page content translates</li>
<li>Select &quot;English&quot; to switch back</li>
                            </ol>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Test Content:</h2>
                            <p className="text-gray-700">
                                This is test content that should be translated when you switch languages in the header.
                                The translation should work using the Google Cloud Translation API directly from the frontend.
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Features:</h2>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Real-time translation without page reload</li>
                                <li>RTL/LTR direction switching</li>
                                <li>Translation caching for performance</li>
                                <li>Error handling and fallbacks</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
