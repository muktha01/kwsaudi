'use client'
// import Translator from '../../components/Translator';
import ErrorBoundary from '../../components/ErrorBoundary';
import { TranslationProvider } from '../../contexts/TranslationContext';
import UniversalTranslator from '../../components/UniversalTranslator';

export default function TranslationDemoPage() {
    return (
        <TranslationProvider>
            <div className="min-h-screen bg-gray-50 py-8">
                {/* Universal Translator for page-wide translation */}
                <UniversalTranslator />

                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Google Translation API Demo</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            This demo shows how to integrate Google Cloud Translation API directly from the frontend using React and Next.js.
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-800 font-medium">
                                Use the floating language switcher to translate this entire page, or use the translator component below for custom translations.
                            </p>
                        </div>
                    </div>

                    <ErrorBoundary>
                        {/* <Translator /> */}
                    </ErrorBoundary>

                    <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">1. Get Your API Key</h3>
                                <p>First, you need to get a Google Cloud Translation API key:</p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Go to <a href="https://console.cloud.google.com/" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                                    <li>Enable the Cloud Translation API</li>
                                    <li>Create credentials (API key)</li>
                                    <li>Replace <code className="bg-gray-100 px-1 rounded">YOUR_API_KEY</code> in the Translator component</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">2. Features</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Support for 100+ languages</li>
                                    <li>Real-time translation</li>
                                    <li>Error handling and loading states</li>
                                    <li>Language swapping functionality</li>
                                    <li>Clean, responsive UI with TailwindCSS</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">3. API Call</h3>
                                <p>The component makes a direct POST request to:</p>
                                <code className="block bg-gray-100 p-3 rounded mt-2 text-sm">
                                    POST https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TranslationProvider>
    );
}
