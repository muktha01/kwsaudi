'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { PiMapPinLineThin } from 'react-icons/pi';
import dynamic from 'next/dynamic';

const OptimizedPropertyMap = ({ property, isVisible = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  // Memoize coordinates and address extraction to prevent recalculation
  const mapData = useMemo(() => {
    if (!property) return null;

    const lat = property?.property_address?.coordinates_gp?.lat || 
               property?.coordinates_gp?.lat || 
               property?.latitude || 
               property?.lat || 
               24.7699857; // Default to Riyadh coordinates
    
    const lng = property?.property_address?.coordinates_gp?.lon || 
               property?.coordinates_gp?.lon || 
               property?.longitude || 
               property?.lng || 
               46.5860906; // Default to Riyadh coordinates
    
    const address = property?.property_address?.full_street_address || 
                   property?.list_address?.address || 
                   property?.property_address || 
                   property?.address || 
                   property?.full_address || 
                   'Property Location';
    
    // Check if we have actual coordinates (not default)
    const hasRealCoordinates = (lat !== 24.7699857 || lng !== 46.5860906) && 
                              property?.property_address?.coordinates_gp;
    
    // Use simpler Google Maps URLs for better performance
    let mapUrl;
    if (hasRealCoordinates) {
      // Use coordinates for precise location
      mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    } else {
      // Fallback to address search
      mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
    
    return {
      lat,
      lng,
      address,
      hasRealCoordinates,
      mapUrl
    };
  }, [property]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!isVisible || shouldLoadMap) return;

    const timer = setTimeout(() => {
      setShouldLoadMap(true);
    }, 200); // Small delay for better UX

    return () => clearTimeout(timer);
  }, [isVisible, shouldLoadMap]);

  // Loading timeout to prevent infinite loading
  useEffect(() => {
    if (shouldLoadMap && isLoading) {
      loadTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setHasError(true);
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [shouldLoadMap, isLoading]);

  // Handle iframe load events
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  }, []);

  // Manual retry function with exponential backoff
  const retryLoadMap = useCallback(() => {
    if (retryCount >= 3) return; // Max 3 retries
    
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
    
    if (iframeRef.current) {
      // Force reload by changing src
      const url = mapData?.mapUrl || '';
      iframeRef.current.src = `${url}&retry=${retryCount + 1}`;
    }
  }, [mapData?.mapUrl, retryCount]);

  // Fallback content when map fails to load
  const renderFallback = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
      <PiMapPinLineThin className="text-[rgb(179,4,4)] text-4xl mb-4" />
      <p className="text-gray-600 text-center mb-4">
        Unable to load map. Click below to view in Google Maps.
      </p>
      <a
        href={(() => {
          if (mapData?.hasRealCoordinates) {
            return `https://www.google.com/maps/search/?api=1&query=${mapData.lat},${mapData.lng}`;
          } else {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapData?.address || 'Property Location')}`;
          }
        })()}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-[rgb(179,4,4)] text-white text-sm rounded hover:bg-red-700 transition-colors"
      >
        Open in Google Maps
      </a>
    </div>
  );

  // Loading placeholder
  const renderLoading = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(179,4,4)] mb-4"></div>
        <p className="text-gray-600 text-sm">Loading map...</p>
      </div>
    </div>
  );

  if (!mapData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Map data not available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-80 lg:h-[400px] overflow-hidden shadow-md rounded-lg relative">
      {/* Loading state */}
      {isLoading && !hasError && renderLoading()}
      
      {/* Error state */}
      {hasError && renderFallback()}
      
      {/* Map iframe - only render when should load */}
      {shouldLoadMap && !hasError && (
        <iframe
          ref={iframeRef}
          src={mapData.mapUrl}
          width="100%"
          height="100%"
          style={{ 
            border: 0,
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full rounded-lg"
          title={`Map showing location of ${mapData.address}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          // Optimize iframe loading
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      )}
      
      {/* Retry button for errors */}
      {hasError && (
        <button
          onClick={retryLoadMap}
          className="absolute top-4 right-4 px-3 py-1 bg-white text-gray-700 text-xs rounded shadow hover:bg-gray-50 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default OptimizedPropertyMap;