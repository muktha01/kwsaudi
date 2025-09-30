# Language Toggle & Translation System

This implementation provides a complete language toggle system with Google Translate API integration for the KW Saudi Arabia website.

## Features Implemented

✅ **Language Toggle (English ↔ Arabic)**
- Dropdown in header for language selection
- Persistent language preference (localStorage)
- Smooth transitions between languages

✅ **Google Cloud Translation API Integration**
- Real-time translation using Google Translate API
- Translation caching for performance
- Fallback handling for API failures

✅ **RTL/LTR Support**
- Automatic direction change (`dir='rtl'` for Arabic, `dir='ltr'` for English)
- Dynamic text alignment (right for Arabic, left for English)
- CSS transitions for smooth direction changes

✅ **Global State Management**
- React Context for language state
- Works across all pages and components
- Automatic translation of page content

## Files Created/Modified

### New Files:
1. `src/contexts/TranslationContext.js` - Global translation state management
2. `src/app/api/translate/route.js` - Google Translate API endpoint
3. `src/components/TranslatedText.js` - Component for automatic text translation
4. `src/app/translation-demo/page.js` - Demo page showing all features

### Modified Files:
1. `src/app/layout.js` - Added TranslationProvider and RTL/LTR styles
2. `src/components/header.js` - Updated with functional language toggle

## API Configuration

The Google Translate API key is configured in:
```javascript
// src/app/api/translate/route.js
const GOOGLE_API_KEY = 'e72c76b2940580c5286ea9e4fb0b5ed4722831a4';
```

## Usage Examples

### 1. Basic Translation Context Usage
```javascript
import { useTranslation } from '../contexts/TranslationContext';

function MyComponent() {
  const { language, isRTL, toggleLanguage, t } = useTranslation();
  
  return (
    <div>
      <p>{t('Hello World')}</p>
      <button onClick={toggleLanguage}>
        Switch to {language === 'en' ? 'Arabic' : 'English'}
      </button>
    </div>
  );
}
```

### 2. Using TranslatedText Component
```javascript
import TranslatedText from '../components/TranslatedText';

function MyComponent() {
  return (
    <div>
      <TranslatedText tag="h1" className="title">
        Welcome to KW Saudi Arabia
      </TranslatedText>
      <TranslatedText tag="p">
        Your trusted real estate partner
      </TranslatedText>
    </div>
  );
}
```

### 3. Manual Translation
```javascript
import { useTranslation } from '../contexts/TranslationContext';

function MyComponent() {
  const { translateText } = useTranslation();
  const [translated, setTranslated] = useState('');
  
  const handleTranslate = async () => {
    const result = await translateText('Hello World', 'ar');
    setTranslated(result);
  };
  
  return (
    <div>
      <button onClick={handleTranslate}>Translate</button>
      <p>{translated}</p>
    </div>
  );
}
```

## How It Works

### 1. Language State Management
- `TranslationContext` provides global language state
- Language preference saved in localStorage
- Automatic HTML direction and lang attributes

### 2. Translation Process
- Text sent to `/api/translate` endpoint
- Google Translate API processes the text
- Results cached to avoid repeated API calls
- Fallback to original text if translation fails

### 3. RTL/LTR Handling
- CSS automatically adjusts for RTL languages
- Flexbox direction reversal for Arabic
- Margin/padding adjustments for proper spacing

## Testing the Implementation

1. **Visit the demo page**: `/translation-demo`
2. **Test header toggle**: Click language dropdown in header
3. **Observe changes**:
   - All text translates to Arabic/English
   - Page direction changes (RTL/LTR)
   - Text alignment adjusts automatically
   - Language preference persists on page refresh

## API Endpoints

### POST /api/translate
Translates text using Google Translate API.

**Request Body:**
```json
{
  "text": "Hello World",
  "targetLanguage": "ar",
  "sourceLanguage": "en"
}
```

**Response:**
```json
{
  "translatedText": "مرحبا بالعالم",
  "sourceLanguage": "en",
  "targetLanguage": "ar"
}
```

## Performance Optimizations

1. **Translation Caching**: Translations stored in memory to avoid repeated API calls
2. **Lazy Loading**: Translations only happen when language changes
3. **Error Handling**: Graceful fallback to original text
4. **Smooth Transitions**: CSS transitions for better UX

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## Troubleshooting

### Common Issues:

1. **Translation not working**: Check Google API key and network connection
2. **RTL layout issues**: Verify CSS classes and direction attributes
3. **Performance issues**: Check translation cache and API rate limits

### Debug Mode:
Enable console logging in `TranslationContext.js` to debug translation issues.

## Future Enhancements

1. **Offline Support**: Cache translations in IndexedDB
2. **More Languages**: Add support for additional languages
3. **Voice Translation**: Integrate speech-to-text/text-to-speech
4. **Admin Panel**: Manage translations through admin interface
