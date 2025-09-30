# Translation System Documentation

## Overview

This project implements a comprehensive translation system that allows users to switch between English and Arabic languages. The system uses Google Translate API for automatic translation and includes proper RTL (Right-to-Left) layout support.

## Features

- **Automatic Translation**: Uses Google Translate API to translate page content
- **RTL Support**: Proper right-to-left layout for Arabic text
- **Caching**: Translation results are cached to avoid repeated API calls
- **React Integration**: Works seamlessly with React components
- **Error Handling**: Graceful error handling for failed translations
- **Loading States**: Visual feedback during translation process
- **Responsive Design**: Works on both desktop and mobile devices

## Architecture

### Core Components

1. **TranslationContext** (`src/contexts/TranslationContext.js`)
   - Main context provider for translation state management
   - Handles language switching and translation caching
   - Manages RTL layout changes

2. **Translation API** (`src/utils/translationApi.js`)
   - Handles Google Translate API calls
   - Implements caching and batch translation
   - Provides utility functions for text validation

3. **Translation Utils** (`src/utils/translateUtils.js`)
   - Safe DOM manipulation functions
   - Element selection and translation helpers
   - Error handling utilities

4. **Custom Hooks** (`src/utils/useTranslation.js`)
   - React hooks for component-level translation
   - Component translation management
   - Text node handling

### File Structure

```
src/
├── contexts/
│   └── TranslationContext.js    # Main translation context
├── utils/
│   ├── translationApi.js        # Google Translate API integration
│   ├── translateUtils.js         # DOM manipulation utilities
│   └── useTranslation.js        # Custom React hooks
├── components/
│   └── header.js                # Header with language switcher
└── app/
    ├── globals.css              # RTL and translation styles
    └── test-translation/
        └── page.js              # Test page for translation
```

## Usage

### Basic Language Switching

```javascript
import { useTranslation } from '../contexts/TranslationContext';

const MyComponent = () => {
  const { language, switchToLanguage, isTranslating } = useTranslation();

  const handleLanguageSwitch = async (newLanguage) => {
    await switchToLanguage(newLanguage);
  };

  return (
    <div>
      <button onClick={() => handleLanguageSwitch('ar')}>
        Switch to Arabic
      </button>
      <button onClick={() => handleLanguageSwitch('en')}>
        Switch to English
      </button>
    </div>
  );
};
```

### Using Translation Function

```javascript
import { useTranslation } from '../contexts/TranslationContext';

const MyComponent = () => {
  const { t, language } = useTranslation();

  return (
    <div>
      <h1>{t('Welcome to our website')}</h1>
      <p>{t('This text will be translated automatically')}</p>
    </div>
  );
};
```

### Excluding Elements from Translation

Add the `data-no-translate` attribute to elements that should not be translated:

```html
<div data-no-translate>
  This content will not be translated
</div>
```

## API Configuration

### Google Translate API

The system uses Google Translate API. Make sure to:

1. Set up a Google Cloud project
2. Enable the Cloud Translation API
3. Create an API key
4. Update the API key in `src/utils/translationApi.js`

```javascript
const GOOGLE_API_KEY = 'your-api-key-here';
```

### Environment Variables

For production, consider using environment variables:

```javascript
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
```

## Styling

### RTL Support

The system includes comprehensive RTL styling in `src/app/globals.css`:

- Text alignment adjustments
- Flexbox direction changes
- Icon transformations
- Form element alignment
- Navigation adjustments

### CSS Classes

- `.language-transition`: Smooth transitions for language switching
- `.translating`: Loading state for translation
- `[data-translated]`: Styling for translated elements
- `[data-no-translate]`: Styling for non-translatable elements

## Error Handling

The system includes comprehensive error handling:

1. **API Errors**: Graceful fallback to original text
2. **Network Errors**: Retry mechanisms and offline support
3. **DOM Errors**: Safe element manipulation
4. **Invalid Text**: Validation before translation

## Performance Optimizations

1. **Caching**: Translation results are cached to avoid repeated API calls
2. **Batch Processing**: Multiple texts are translated in batches
3. **Lazy Loading**: Translations are loaded on demand
4. **Debouncing**: Prevents excessive API calls during rapid language switches

## Testing

### Test Page

Visit `/test-translation` to test the translation system:

- Language switching controls
- Sample content for translation
- Translation status monitoring
- Element counting

### Manual Testing

1. Switch to Arabic language
2. Verify text translation
3. Check RTL layout
4. Test mobile responsiveness
5. Verify translation restoration when switching back to English

## Troubleshooting

### Common Issues

1. **Translation not working**
   - Check API key configuration
   - Verify network connectivity
   - Check browser console for errors

2. **RTL layout issues**
   - Ensure proper CSS classes are applied
   - Check element positioning
   - Verify font support for Arabic text

3. **Performance issues**
   - Monitor API usage
   - Check cache implementation
   - Optimize batch sizes

### Debug Mode

Enable debug logging by adding to browser console:

```javascript
localStorage.setItem('translation-debug', 'true');
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Mobile Support

The translation system is fully responsive and works on:

- iOS Safari
- Android Chrome
- Mobile browsers with JavaScript support

## Security Considerations

1. **API Key Protection**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement proper rate limiting for API calls
3. **Input Validation**: Validate all text inputs before translation
4. **CORS**: Ensure proper CORS configuration for API calls

## Future Enhancements

1. **Offline Support**: Cache translations for offline use
2. **Machine Learning**: Implement custom translation models
3. **Voice Translation**: Add speech-to-text translation
4. **Multi-language Support**: Extend beyond English/Arabic
5. **Translation Memory**: Learn from user corrections

## Contributing

When contributing to the translation system:

1. Follow the existing code structure
2. Add proper error handling
3. Include tests for new features
4. Update documentation
5. Test on multiple browsers and devices

## License

This translation system is part of the KW Saudi Arabia project and follows the project's licensing terms.
