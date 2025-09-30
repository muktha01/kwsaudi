'use client'
import React from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import Header from '../../components/header';

const TestLanguage = () => {
    const { language, isRTL, toggleLanguage, switchToLanguage, t } = useTranslation();

    return (
        <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
            <Header />

            <div className="pt-32 pb-16 px-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        {language === 'ar' ? 'اختبار تغيير اللغة' : 'Language Test Page'}
                    </h1>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-lg">
                                {language === 'ar' ? 'اللغة الحالية:' : 'Current Language:'}
                            </span>
                            <span className="font-bold text-red-600">
                                {language === 'ar' ? 'العربية' : 'English'}
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-lg">
                                {language === 'ar' ? 'اتجاه النص:' : 'Text Direction:'}
                            </span>
                            <span className="font-bold text-blue-600">
                                {isRTL ? 'RTL (من اليمين إلى اليسار)' : 'LTR (Left to Right)'}
                            </span>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={toggleLanguage}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors mr-4"
                            >
                                {language === 'ar' ? 'تبديل إلى الإنجليزية' : 'Switch to Arabic'}
                            </button>

                            <button
                                onClick={() => switchToLanguage('en')}
                                className={`px-4 py-2 rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                English
                            </button>

                            <button
                                onClick={() => switchToLanguage('ar')}
                                className={`px-4 py-2 rounded ${language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                العربية
                            </button>
                        </div>

                        <div className="mt-8 p-4 bg-gray-100 rounded">
                            <h2 className="text-xl font-semibold mb-4">
                                {language === 'ar' ? 'محتوى تجريبي' : 'Sample Content'}
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {language === 'ar'
                                    ? 'هذا نص تجريبي لاختبار تغيير اللغة. يجب أن يتغير اتجاه النص واللغة عند النقر على الأزرار أعلاه.'
                                    : 'This is sample content to test language switching. The text direction and language should change when clicking the buttons above.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestLanguage;
