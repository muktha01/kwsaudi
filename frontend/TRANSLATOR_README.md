# Google Cloud Translation API - Frontend Integration

This project demonstrates how to integrate Google Cloud Translation API directly from the frontend using React and Next.js, without requiring backend API routes.

## Features

- ✅ Direct Google Cloud Translation API calls from frontend
- ✅ Support for 100+ languages
- ✅ Real-time translation with loading states
- ✅ Error handling and validation
- ✅ Language swapping functionality
- ✅ Clean, responsive UI with TailwindCSS
- ✅ API key input field for easy configuration
- ✅ No backend routes required

## Components

### 1. Translator Component (`src/components/Translator.jsx`)

A React component that provides a complete translation interface:

- **Input textarea**: Enter text to translate
- **Source language dropdown**: Select source language (default: English)
- **Target language dropdown**: Select target language (default: Arabic)
- **API key input**: Secure password field for Google Cloud API key
- **Translate button**: Execute translation with loading state
- **Error handling**: Display user-friendly error messages
- **Language swap**: Quick swap between source and target languages

### 2. Translation API Utilities (`src/utils/translationApi.js`)

Utility functions for handling Google Cloud Translation API calls:

- `translateText()`: Main translation function
- `getSupportedLanguages()`: Fetch supported languages from API
- `validateApiKey()`: Validate API key with test request

## Pages

### 1. `/direct-translate`
Updated to use the new Translator component.

### 2. `/translation-demo`
Demo page showcasing the Translator component with usage instructions.

### 3. `/translator`
Simple page displaying the Translator component.

## Setup Instructions

### 1. Get Google Cloud Translation API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Cloud Translation API:
   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### 2. Use the Translator Component

1. Navigate to `/direct-translate` or `/translation-demo`
2. Enter your Google Cloud Translation API key in the input field
3. Select source and target languages
4. Enter text to translate
5. Click "Translate" button

## API Call Details

The component makes a direct GET request to avoid CORS preflight issues:
```
GET https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY&q=text%20to%20translate&source=en&target=ar&format=text
```

Query parameters:
- `key`: Your Google Cloud Translation API key
- `q`: Text to translate (URL encoded)
- `source`: Source language code (e.g., 'en')
- `target`: Target language code (e.g., 'ar')
- `format`: Text format ('text' or 'html')

Response:
```json
{
  "data": {
    "translations": [
      {
        "translatedText": "النص المترجم"
      }
    ]
  }
}
```

## Error Handling

The component handles various error scenarios:

- **Invalid API key**: Shows "API key is invalid or has insufficient permissions"
- **Rate limiting**: Shows "Rate limit exceeded. Please try again later"
- **Network errors**: Shows "Network error. Please check your internet connection"
- **Invalid parameters**: Shows "Invalid request. Please check your API key and parameters"
- **Empty text**: Shows "Please enter some text to translate"
- **Same languages**: Shows "Source and target languages cannot be the same"

## Security Considerations

⚠️ **Important**: When using API keys in the frontend:

1. **API Key Restrictions**: Set up API key restrictions in Google Cloud Console:
   - HTTP referrers (web sites)
   - IP addresses
   - API restrictions (limit to Cloud Translation API only)

2. **Environment Variables**: For production, consider using environment variables:
   ```javascript
   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
   ```

3. **CORS**: Google Cloud Translation API supports CORS, so frontend calls work directly.

## Usage Examples

### Basic Usage
```jsx
import Translator from '../components/Translator';

function MyPage() {
  return (
    <div>
      <h1>Translation Tool</h1>
      <Translator />
    </div>
  );
}
```

### Custom Styling
```jsx
<div className="max-w-2xl mx-auto">
  <Translator />
</div>
```

## Troubleshooting

### Common Issues

1. **"API key is invalid"**
   - Check if the API key is correct
   - Ensure Cloud Translation API is enabled
   - Verify API key restrictions

2. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Check your Google Cloud quota usage

3. **"Network error"**
   - Check internet connection
   - Verify CORS settings
   - Try refreshing the page

4. **Translation not working**
   - Ensure text is not empty
   - Check if source and target languages are different
   - Verify API key is entered correctly

### Debug Mode

Enable console logging to debug issues:
```javascript
// In translationApi.js, add console.log statements
console.log('API Response:', data);
```

## Performance Tips

1. **Caching**: Consider implementing translation caching to avoid repeated API calls
2. **Debouncing**: For real-time translation, implement debouncing
3. **Batch Translation**: For multiple texts, consider batch API calls

## License

This implementation is part of the KW Saudi Arabia project and follows the project's licensing terms.
