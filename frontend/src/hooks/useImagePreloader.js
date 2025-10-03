import { useState, useCallback } from 'react';

/**
 * Custom hook for cross-browser image preloading
 * Handles different browser behaviors and provides fallbacks
 */
export const useImagePreloader = () => {
  const [loadingStates, setLoadingStates] = useState({});

  const preloadImage = useCallback((src, options = {}) => {
    const {
      timeout = 10000,
      crossOrigin = 'anonymous',
      onSuccess,
      onError,
      priority = false
    } = options;

    return new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error('No image source provided'));
        return;
      }

      // Check if image is already cached in browser
      const img = new window.Image();
      
      // Set loading state
      setLoadingStates(prev => ({ ...prev, [src]: 'loading' }));

      // Configure image for better cross-browser compatibility
      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      // Set up event handlers
      const handleLoad = () => {
        setLoadingStates(prev => ({ ...prev, [src]: 'loaded' }));
        onSuccess?.(img);
        resolve(img);
      };

      const handleError = (error) => {
        setLoadingStates(prev => ({ ...prev, [src]: 'error' }));
        console.warn(`Failed to preload image: ${src}`, error);
        onError?.(error);
        reject(error);
      };

      const handleTimeout = () => {
        const timeoutError = new Error(`Image preload timeout: ${src}`);
        setLoadingStates(prev => ({ ...prev, [src]: 'timeout' }));
        onError?.(timeoutError);
        reject(timeoutError);
      };

      // Set up timeout
      const timeoutId = setTimeout(handleTimeout, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        handleLoad();
      };

      img.onerror = (error) => {
        clearTimeout(timeoutId);
        handleError(error);
      };

      // Check if image is already in browser cache (instant load)
      if (img.complete && img.naturalHeight !== 0) {
        clearTimeout(timeoutId);
        handleLoad();
        return;
      }

      // For modern browsers, try to use loading="eager" equivalent
      if (priority && 'loading' in img) {
        img.loading = 'eager';
      }

      // Start loading
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(async (srcArray, options = {}) => {
    const { 
      concurrent = true, 
      maxConcurrent = 3,
      ...imageOptions 
    } = options;

    if (!Array.isArray(srcArray)) {
      throw new Error('srcArray must be an array');
    }

    if (concurrent) {
      if (maxConcurrent && srcArray.length > maxConcurrent) {
        // Load images in batches to avoid overwhelming the browser
        const results = [];
        for (let i = 0; i < srcArray.length; i += maxConcurrent) {
          const batch = srcArray.slice(i, i + maxConcurrent);
          const batchPromises = batch.map((src, index) => 
            preloadImage(src, { 
              ...imageOptions, 
              priority: i === 0 && index === 0 // First image gets priority
            })
          );
          const batchResults = await Promise.allSettled(batchPromises);
          results.push(...batchResults);
        }
        return results;
      } else {
        // Load all images concurrently
        const promises = srcArray.map((src, index) => 
          preloadImage(src, { 
            ...imageOptions, 
            priority: index === 0 // First image gets priority
          })
        );
        return Promise.allSettled(promises);
      }
    } else {
      // Load images sequentially
      const results = [];
      for (let i = 0; i < srcArray.length; i++) {
        try {
          const result = await preloadImage(srcArray[i], { 
            ...imageOptions, 
            priority: i === 0 // First image gets priority
          });
          results.push({ status: 'fulfilled', value: result });
        } catch (error) {
          results.push({ status: 'rejected', reason: error });
        }
      }
      return results;
    }
  }, [preloadImage]);

  const getLoadingState = useCallback((src) => {
    return loadingStates[src] || 'idle';
  }, [loadingStates]);

  const clearLoadingStates = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    preloadImage,
    preloadImages,
    getLoadingState,
    loadingStates,
    clearLoadingStates
  };
};

export default useImagePreloader;