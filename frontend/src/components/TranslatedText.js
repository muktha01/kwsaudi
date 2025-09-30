'use client'
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const TranslatedText = ({
    children,
    fallback = '',
    className = '',
    tag = 'span',
    ...props
}) => {
    const { language, translateText, t } = useTranslation();
    const [translatedContent, setTranslatedContent] = useState(children);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const translateContent = async () => {
            if (language === 'en') {
                setTranslatedContent(children);
                return;
            }

            if (typeof children === 'string') {
                setIsLoading(true);
                try {
                    const translated = await translateText(children, 'ar');
                    setTranslatedContent(translated);
                } catch (error) {
                    console.error('Translation failed:', error);
                    setTranslatedContent(fallback || children);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        translateContent();
    }, [children, language, translateText, fallback]);

    // Listen for language changes
    useEffect(() => {
        const handleLanguageChange = (event) => {
            if (event.detail.language === 'en') {
                setTranslatedContent(children);
            } else {
                translateContent();
            }
        };

        window.addEventListener('languageChanged', handleLanguageChange);
        return () => window.removeEventListener('languageChanged', handleLanguageChange);
    }, [children, translateText, fallback]);

    const Tag = tag;

    if (isLoading) {
        return (
            <Tag className={`${className} opacity-70`} {...props}>
                {children}
            </Tag>
        );
    }

    return (
        <Tag className={className} {...props}>
            {translatedContent}
        </Tag>
    );
};

export default TranslatedText;
