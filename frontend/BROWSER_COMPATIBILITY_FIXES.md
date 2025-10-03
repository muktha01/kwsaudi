# Cross-Browser Image Loading Fixes

## Issues Identified and Fixed

### 1. Browser Cache Behavior Differences
**Problem**: Different browsers handle localStorage/sessionStorage differently, especially in private/incognito mode.
**Solution**: Added safe storage access with error handling and fallbacks.

### 2. Image Preloading Inconsistencies
**Problem**: Image preloading works differently across browsers, especially with CORS and caching.
**Solution**: Enhanced preload function with:
- `crossOrigin="anonymous"` for better CORS handling
- Timeout mechanism to prevent hanging
- Better error handling and fallbacks
- Detection of already cached images

### 3. CSS Background vs Next.js Image Conflict
**Problem**: Using both CSS background-image and Next.js Image components simultaneously can cause loading conflicts.
**Solution**: 
- Made background-image conditional on `firstImageLoaded` state
- Added fallback background color
- Better coordination between the two approaches

### 4. Browser-Specific GPU Acceleration
**Problem**: Different browsers handle GPU acceleration differently.
**Solution**: Added cross-browser CSS properties:
- `backfaceVisibility: 'hidden'`
- `WebkitBackfaceVisibility: 'hidden'`
- `transform: 'translate3d(0, 0, 0)'`
- `WebkitTransform: 'translate3d(0, 0, 0)'`

## Key Improvements Made

### 1. Enhanced Preload Function
```javascript
// Before: Simple preload
const img = new Image();
img.onload = () => setLoaded(true);
img.src = imageUrl;

// After: Robust cross-browser preload
const preloadFirstImage = (imageUrl) => {
  if (imageUrl && typeof window !== 'undefined') {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Better CORS
      
      img.onload = () => {
        setFirstImageLoaded(true);
        resolve(img);
      };
      
      img.onerror = (error) => {
        console.warn('Failed to preload image:', imageUrl, error);
        setFirstImageLoaded(true); // Prevent infinite loading
        reject(error);
      };
      
      // Timeout to prevent hanging
      setTimeout(() => {
        if (!img.complete) {
          setFirstImageLoaded(true);
          resolve(img);
        }
      }, 5000);
      
      img.src = imageUrl;
    });
  }
  return Promise.resolve();
};
```

### 2. Safe Storage Access
```javascript
const safeStorageAccess = (storage, key, isSet = false, value = null) => {
  try {
    if (isSet) {
      storage.setItem(key, value);
      return true;
    } else {
      return storage.getItem(key);
    }
  } catch (error) {
    console.warn(`Storage access failed for ${key}:`, error);
    return isSet ? false : null;
  }
};
```

### 3. Enhanced Next.js Image Configuration
```javascript
<Image
  src={apiImages[idx]}
  alt={t("Hero Background")}
  fill
  priority={idx === 0}
  className={`object-cover transition-transform duration-100 ${isRTL ? 'scale-x-[-1]' : ''}`}
  onLoadingComplete={() => {
    setLoaded((prev) => ({ ...prev, [idx]: true }));
    if (idx === 0) setFirstImageLoaded(true);
  }}
  onError={(e) => {
    console.warn(`Failed to load image at index ${idx}:`, apiImages[idx]);
    setLoaded((prev) => ({ ...prev, [idx]: true }));
    if (idx === 0) setFirstImageLoaded(true);
  }}
  loading={idx === 0 ? "eager" : "lazy"}
  sizes="100vw"
  quality={85}
  unoptimized={false}
/>
```

### 4. Conditional Background Image
```javascript
style={{
  backgroundColor: '#1a1a1a', // Fallback color
  ...(apiImages.length > 0 && firstImageLoaded && {
    backgroundImage: `url(${apiImages[0]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }),
  transition: 'none',
  transform: 'translateZ(0)',
  willChange: 'auto'
}}
```

## Browser-Specific Considerations

### Chrome/Chromium
- Excellent cache handling
- Good GPU acceleration
- Supports all modern image loading features

### Firefox
- Different cache eviction policies
- May need `img.crossOrigin` for some CORS scenarios
- Good performance with `translate3d`

### Safari
- More restrictive localStorage in private mode
- Different image caching behavior
- Requires `-webkit-` prefixes for some CSS

### Edge
- Similar to Chrome but may have different cache sizes
- Good modern feature support

## Additional Recommendations

### 1. Add Service Worker for Advanced Caching
```javascript
// sw.js
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images-v1').then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

### 2. Add Loading Indicators
```javascript
{loadingPageData && (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
    <div className="text-white">Loading...</div>
  </div>
)}
```

### 3. Add Error Boundaries
```javascript
class ImageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="bg-gray-300 w-full h-full flex items-center justify-center">
        Image failed to load
      </div>;
    }

    return this.props.children;
  }
}
```

### 4. Monitor Performance
```javascript
// Add to your component
useEffect(() => {
  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const entries = performance.getEntriesByType('resource');
        const imageEntries = entries.filter(entry => 
          entry.initiatorType === 'img' || 
          entry.name.includes(apiImages[0])
        );
        console.log('Image loading performance:', imageEntries);
      }, 1000);
    });
  }
}, []);
```

## Testing Checklist

- [ ] Test in Chrome (normal and incognito)
- [ ] Test in Firefox (normal and private)
- [ ] Test in Safari (normal and private)
- [ ] Test in Edge
- [ ] Test with slow network (Chrome DevTools throttling)
- [ ] Test with disabled JavaScript (progressive enhancement)
- [ ] Test with disabled images
- [ ] Test cache behavior (hard refresh, normal refresh)
- [ ] Test on different screen sizes
- [ ] Test with different image formats (WebP, JPEG, PNG)

The fixes implemented should significantly improve cross-browser compatibility for image loading.