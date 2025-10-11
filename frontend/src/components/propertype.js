// pages/index.js
import React, { Suspense, useCallback, useMemo } from "react";
import {
    FaChevronDown,
    FaHome,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaBuilding,FaWarehouse ,FaShoppingBag  
  } from "react-icons/fa";
  
  import { FiFilter } from "react-icons/fi";
  import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
  import Image from "next/image";
  import { useState, useRef, useEffect } from "react";
  import axios from 'axios';
  import { GoogleMap, Marker, InfoWindow, OverlayView } from '@react-google-maps/api';
  import { loadGoogleMaps } from '../utils/googleMapsLoader';
  import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useTranslation } from '../contexts/TranslationContext';
  // Add this new component before the Home component

// Utility function to format price, available everywhere in this file
function formatPrice(price) {
  if (typeof price === 'number') {
    return price.toLocaleString('en-US');
  }
  if (typeof price === 'string' && !isNaN(Number(price))) {
    return Number(price).toLocaleString('en-US');
  }
  return price || '';
}

const PropertyCard = React.memo(({ property, bedIconUrl, bathIconUrl, areaIconUrl, onHover, onLeave, router }) => {
// Set display name for React DevTools and linter
PropertyCard.displayName = "PropertyCard";
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false); // image loading state
    const { language,isRTL, t } = useTranslation();
    // Only get images from API, no fallback images
    const getPropertyImages = useCallback((property) => {
      return Array.isArray(property.photos) && property.photos.length > 0
        ? property.photos.map(photo => photo.ph_url)
        : [];
    }, []);
    const handleNextImage = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setLoading(true); // start loader
      setCurrentImageIndex((prev) => (prev + 1) % 7);
    };

    const handlePrevImage = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setLoading(true); // start loader
      setCurrentImageIndex((prev) => (prev - 1 + 7) % 7);
    };

    useEffect(() => {
      setLoading(true); // start loader when image index changes
    }, [currentImageIndex]);

    return (
      <div
        className="bg-white shadow-md overflow-hidden"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div
          className="block relative"
          onClick={() => {
            localStorage.setItem('selectedProperty', JSON.stringify(property));
            router.push(`/propertydetails/${property._kw_meta?.id || property.id}`);
          }}
        >
          <div className="relative">
            {/* Loader overlay for image */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-white"></div>
              </div>
            )}
            <Image
              src={getPropertyImages(property).length > 0 ? getPropertyImages(property)[currentImageIndex] : '/properysmallfalback.jpg'}
              alt={property.prop_type || "Property Image"}
              width={500}
              height={300}
              className="w-full h-50 lg:h-60 object-cover border-b-0"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wq"
              onLoadingComplete={() => setLoading(false)}
            />
            <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 flex justify-between px-2">
              <button 
                onClick={handlePrevImage}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextImage}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {[...Array(7)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentImageIndex === idx ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
    {/* Beds */}
    {/* <div className="absolute bottom-0 right-0 bg-black/80 text-white rounded-md px-3 py-2 flex flex-row items-center gap-6"> */}
    {/* Beds */}
    <div className="flex flex-col items-center">
      <span className="relative w-5 h-5">
        <Image src={bedIconUrl} alt="bed" fill className="object-contain invert" loading="lazy" />
      </span>
      <span className="text-xs mt-1">
        {property.total_bed || property.beds || property.bedrooms || 0}
      </span>
    </div>

    {/* Baths */}
    <div className="flex flex-col items-center">
      <span className="relative w-5 h-5">
        <Image src={bathIconUrl} alt="bath" fill className="object-contain invert" loading="lazy" />
      </span>
      <span className="text-xs mt-1">
        {property.total_bath || property.baths || property.bathrooms || 0}
      </span>
    </div>

    {/* Garage (optional, if you have this) */}
   
    </div>
           
          </div>
        </div>
        <div className="p-4">
        <h3 className=" text-gray-700 text-lg flex justify-start items-center">
                     
                     {property.title || property.prop_type || "Property"}
                     
                   </h3>
                   <span className=" flex justify-start text-[rgb(206,32,39,255)] text-lg font-semibold">
                   {property.prop_subtype|| "To Let"}
              
                   </span>
                   <p
                   
     className="text-xl font-bold text-gray-600 mb-2 truncate"
     title={property.list_address?.address} // hover to see full text
   >
     {property.list_address?.address?.split(' ').length > 5
       ? property.list_address.address.split(' ').slice(0, 5).join(' ') + '...'
       : property.list_address?.address}
   </p>

                   
                   <div className="flex justify-start items-center">
                   

  <span className="relative w-4 h-4 mr-2">
    <Image 
      src="/currency.png"   // 👈 replace with your currency image path
      alt="currency"
      fill
      className="object-contain"
    />
  </span>

  <span>
    {property.price
      ? formatPrice(property.price)
      : property.current_list_price
      ? formatPrice(property.current_list_price)
      : ""}
  </span>
                    

                   </div>
                   {property.price_qualifier && (
                     <p className="text-xs text-gray-500 mt-1">
                       {property.price_qualifier}
                     </p>
                   )}
                   
                 </div>
                 <button 
                   className=" cursor-pointer w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     localStorage.setItem('selectedProperty', JSON.stringify(property));
                     router.push(`/propertydetails/${property._kw_meta?.id || property.id}`);
                   }}
                 >
    <span>{t("MORE DETAILS")}</span>
           <FaChevronRight className={`text-white w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
         </button>
       
         
      
      </div>
    );
  });

  // Debounce hook
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  }

  export default function Home(props) {
  // Check if this component is being used as a child component
  const isChildComponent = props?.isChildComponent || false;
  // Accept filters from parent component (buyer/rent pages)
  const parentFilters = props?.appliedFilters || null;
  // If properties are passed as a prop, use them directly (for map view from newdevelopment)
  const parentProperties = useMemo(() => props?.properties || [], [props?.properties]);
  // Accept load more and pagination props from parent
  const parentHasNextPage = props?.hasNextPage;
  const parentLoadingMore = props?.loadingMore;
  const parentLoadMore = props?.onLoadMore;
    
    const router = useRouter();
    const [viewMode, setViewMode] = useState("list");
    const [currentPage, setCurrentPage] = useState(1);
    const propertiesPerPage = 6;
    const filterPanelRef = useRef(null);
    const mobileMapRef = useRef(null);
    const [properties, setProperties] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // <-- add this for backend total count
    const [hasNextPage, setHasNextPage] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState('All');
  const [propertySubtype, setPropertySubtype] = useState('All');
  const [marketCenter, setMarketCenter] = useState('All');
  const [location, setLocation] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  // Debounced filters
  const debouncedPropertyCategory = useDebounce(propertyCategory, 10);
  const debouncedPropertySubtype = useDebounce(propertySubtype, 10);
  const debouncedMarketCenter = useDebounce(marketCenter, 10);
  const debouncedLocation = useDebounce(location, 10);
  const debouncedPriceRange = useDebounce(priceRange, 10);
    const [hoveredProperty, setHoveredProperty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [mapProjection, setMapProjection] = useState(null);
    // Helper to check if marker is near the bottom of the map (desktop only)
     const { language,isRTL, t } = useTranslation();
    const isNearBottom = (coords) => {
      if (!desktopMap || !mapProjection) return false;

      const latLng = new window.google.maps.LatLng(coords.lat, coords.lng);
      const projPoint = mapProjection.fromLatLngToPoint(latLng);
      const scale = Math.pow(2, desktopMap.getZoom());
      const bounds = desktopMap.getBounds();
      if (!bounds) return false;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const topRight = mapProjection.fromLatLngToPoint(ne);
      const bottomLeft = mapProjection.fromLatLngToPoint(sw);

      const y = (projPoint.y - topRight.y) * scale;
      const mapHeight = desktopMap.getDiv().clientHeight;

      // Bottom 25% of map = risky zone
      return y > mapHeight * 0.75;
    };

    
    // Lazy-load Google Maps API only when properties are available
    const shouldLoadMap = useMemo(() => properties && properties.length > 0, [properties]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
      if (shouldLoadMap) {
        loadGoogleMaps({
          apiKey: "AIzaSyDhQDfHVkov3_YZ_Zt-m9N7Q-ytIxcVpx0",
          libraries: []
        }).then(() => setIsLoaded(true));
      }
    }, [shouldLoadMap]);
    const [desktopMap, setDesktopMap] = useState(null);

    const bedIconUrl = "/bed.png";
    const bathIconUrl = "/bath.png";
    const areaIconUrl = "/area.png";

    // Helper to get property images (move outside PropertyCard for reuse)
    const getPropertyImages = (property) => {
      
      return property?.photos?.map(photo => photo.ph_url);
    };

    const params = useParams();
    const searchParams = useSearchParams();
    // Only read URL parameters when not used as child component
    const typeParam = isChildComponent ? '' : (params?.type || '');
    const searchTerm = isChildComponent ? '' : (searchParams?.get('q') || '');

    // Helper to format type for display
    const displayType = typeParam
      ? typeParam.charAt(0).toUpperCase() + typeParam.slice(1)
      : '';

    useEffect(() => {
      setCurrentPage(1);
    }, [debouncedPropertyCategory, debouncedPropertySubtype, debouncedMarketCenter, debouncedLocation, debouncedPriceRange, typeParam, searchTerm, parentFilters]);

    useEffect(() => {
      // If properties are passed as a prop (from parent), use them directly and skip API fetch
      if (props?.properties && Array.isArray(props.properties)) {
        setProperties(props.properties);
        setTotalCount(props.properties.length);
        setLoading(false);
        setLoadingMore(false);
        return;
      }
      // Only fetch data if not a child component
      if (isChildComponent) {
        return;
      }
      // ...existing code for API fetch...
      const fetchData = async () => {
     
      };
      fetchData();
    }, [currentPage, propertiesPerPage, debouncedPropertyCategory, debouncedPropertySubtype, debouncedMarketCenter, debouncedLocation, debouncedPriceRange, typeParam, searchTerm, isChildComponent, parentFilters, props?.properties]);
    
    // Separate effect to handle parent properties changes when used as child component
    useEffect(() => {
      if (isChildComponent && parentProperties.length > 0) {
        // Filter out properties with list_category=sold
        const filteredProperties = parentProperties.filter(property => property.list_category !== 'sold');
        setProperties(filteredProperties);
        setTotalCount(filteredProperties.length);
        setLoading(false);
        setLoadingMore(false);
      }
    }, [parentProperties, isChildComponent]);
    
    // Helper to get map src based on hovered property
    const getMapSrc = () => {
      if (
        hoveredProperty &&
        hoveredProperty.coordinates_gs &&
        hoveredProperty.coordinates_gs.coordinates &&
        hoveredProperty.coordinates_gs.coordinates.length === 2
      ) {
        const [lng, lat] = hoveredProperty.coordinates_gs.coordinates;
        return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
      }
      // Default location: Saudi Arabia
      return "https://www.google.com/maps?q=23.8859,45.0792&output=embed";
    };

    // Loader spinner component
    const Loader = () => (
      <div className="flex justify-center items-center w-full h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );

    // Skeleton loader for cards
    const CardSkeleton = () => (
      <div className="bg-white shadow-md rounded-lg p-4 animate-pulse">
        <div className="h-40 bg-gray-200 rounded mb-4" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
    );

    // Helper to offset overlapping markers
    function getOffsetCoords(baseCoords, offsetIndex) {
      if (!offsetIndex) return { lat: baseCoords[1], lng: baseCoords[0] };
      // Offset in a circle pattern
      const R = 0.0002; // ~20m offset
      const angle = (offsetIndex - 1) * (Math.PI / 4); // 8 directions
      return {
        lat: baseCoords[1] + R * Math.cos(angle),
        lng: baseCoords[0] + R * Math.sin(angle),
      };
    }

    // Memoize map center calculation to avoid unnecessary recalculations
    const getMapCenter = useCallback(() => {
      if (
        hoveredProperty &&
        hoveredProperty.coordinates_gs &&
        hoveredProperty.coordinates_gs.coordinates &&
        hoveredProperty.coordinates_gs.coordinates.length === 2
      ) {
        // Offset latitude to move marker toward top (e.g., 0.01 degree)
        const [lng, lat] = hoveredProperty.coordinates_gs.coordinates;
        return { lat: lat + 0.01, lng };
      }
      // If properties with coordinates are found, center the map to show them
      const propertiesWithCoords = properties.filter(property => 
        property.property_address?.coordinates_gs?.coordinates &&
        property.property_address.coordinates_gs.coordinates.length === 2
      );
      if (propertiesWithCoords.length > 0) {
        // Calculate bounds to show all properties
        const bounds = calculateMapBounds(propertiesWithCoords);
        if (bounds) {
          return bounds.center;
        }
      }
      // Default: Center of Saudi Arabia (only if no property markers)
      return { lat: 23.8859, lng: 45.0792 };
    }, [hoveredProperty, properties]);

    // Helper function to calculate optimal map bounds for properties
    const calculateMapBounds = (propertiesWithCoords) => {
      if (propertiesWithCoords.length === 0) return null;
      
      if (propertiesWithCoords.length === 1) {
        const coords = propertiesWithCoords[0].property_address.coordinates_gs.coordinates;
        return {
          center: { lat: coords[1], lng: coords[0] },
          zoom: 14
        };
      }
      
      // Calculate bounds for multiple properties
      let minLat = Infinity, maxLat = -Infinity;
      let minLng = Infinity, maxLng = -Infinity;
      
      propertiesWithCoords.forEach(property => {
        const coords = property.property_address.coordinates_gs.coordinates;
        const lat = coords[1];
        const lng = coords[0];
        
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
      
      // Add padding to bounds
      const latPadding = (maxLat - minLat) * 0.1;
      const lngPadding = (maxLng - minLng) * 0.1;
      
      return {
        center: {
          lat: (minLat + maxLat) / 2,
          lng: (minLng + maxLng) / 2
        },
        bounds: {
          north: maxLat + latPadding,
          south: minLat - latPadding,
          east: maxLng + lngPadding,
          west: minLng - lngPadding
        }
      };
    };

    const getMapZoom = () => {
      if (
        hoveredProperty &&
        hoveredProperty.coordinates_gs &&
        hoveredProperty.coordinates_gs.coordinates &&
        hoveredProperty.coordinates_gs.coordinates.length === 2
      ) {
        return 16; // zoom in when hovering
      }
      
      // Auto-adjust zoom based on properties with coordinates
      const propertiesWithCoords = properties.filter(property => 
        property.property_address?.coordinates_gs?.coordinates &&
        property.property_address.coordinates_gs.coordinates.length === 2
      );
      
      if (propertiesWithCoords.length === 1) {
        return 14; // Good zoom for single property
      } else if (propertiesWithCoords.length > 1) {
        return 12; // Wider view for multiple properties
      }
      
      return 10; // default zoom
    };

    // Smooth pan/zoom on hover for desktop map
    useEffect(() => {
      if (
        desktopMap &&
        hoveredProperty &&
        hoveredProperty.coordinates_gs &&
        hoveredProperty.coordinates_gs.coordinates &&
        hoveredProperty.coordinates_gs.coordinates.length === 2
      ) {
        const [lng, lat] = hoveredProperty.coordinates_gs.coordinates;
        // Offset latitude to move marker toward top
        const offsetLat = lat + 0.03;
        desktopMap.panTo({ lat: offsetLat, lng });
        desktopMap.setZoom(16);
      }
    }, [hoveredProperty, desktopMap]);

    // Auto-adjust map view when properties with coordinates are found (even without hover)
    useEffect(() => {
      if (!desktopMap) return;
      // Only auto-center if not hovering a property
      if (hoveredProperty) return;

      const propertiesWithCoords = properties.filter(property => 
        property.property_address?.coordinates_gs?.coordinates &&
        property.property_address.coordinates_gs.coordinates.length === 2
      );

      if (propertiesWithCoords.length > 0) {
        const mapBounds = calculateMapBounds(propertiesWithCoords);
        if (mapBounds) {
          // Always center and zoom to the first property if only one, or fit bounds for multiple
          if (propertiesWithCoords.length === 1) {
            desktopMap.panTo(mapBounds.center);
            desktopMap.setZoom(16); // Zoom in more for single property
          } else {
            if (mapBounds.bounds && window.google?.maps) {
              const bounds = new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(mapBounds.bounds.south, mapBounds.bounds.west),
                new window.google.maps.LatLng(mapBounds.bounds.north, mapBounds.bounds.east)
              );
              desktopMap.fitBounds(bounds);
              // Ensure minimum zoom level for readability
              const listener = window.google.maps.event.addListener(desktopMap, 'zoom_changed', () => {
                if (desktopMap.getZoom() > 16) desktopMap.setZoom(16);
                if (desktopMap.getZoom() < 10) desktopMap.setZoom(10);
                window.google.maps.event.removeListener(listener);
              });
            }
          }
        }
      }
    }, [properties, desktopMap, hoveredProperty]);

    // Auto-adjust mobile map view when properties with coordinates are found
    useEffect(() => {
      if (!mobileMapRef.current) return;
      
      const propertiesWithCoords = properties.filter(property => 
        property.property_address?.coordinates_gs?.coordinates &&
        property.property_address.coordinates_gs.coordinates.length === 2
      );
      
      if (propertiesWithCoords.length > 0) {
        const mapBounds = calculateMapBounds(propertiesWithCoords);
        
        if (mapBounds) {
          if (propertiesWithCoords.length === 1) {
            // For single property, center and zoom in
            mobileMapRef.current.panTo(mapBounds.center);
            mobileMapRef.current.setZoom(14);
          } else {
            // For multiple properties, fit bounds to show all
            if (mapBounds.bounds && window.google?.maps) {
              const bounds = new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(mapBounds.bounds.south, mapBounds.bounds.west),
                new window.google.maps.LatLng(mapBounds.bounds.north, mapBounds.bounds.east)
              );
              mobileMapRef.current.fitBounds(bounds);
              
              // Ensure minimum zoom level for mobile readability
              const listener = window.google.maps.event.addListener(mobileMapRef.current, 'zoom_changed', () => {
                if (mobileMapRef.current.getZoom() > 15) mobileMapRef.current.setZoom(15);
                if (mobileMapRef.current.getZoom() < 9) mobileMapRef.current.setZoom(9);
                window.google.maps.event.removeListener(listener);
              });
            }
          }
        }
      }
    }, [properties]);

    useEffect(() => {
      if (
        desktopMap &&
        (!hoveredProperty ||
          !hoveredProperty.coordinates_gs ||
          !hoveredProperty.coordinates_gs.coordinates ||
          hoveredProperty.coordinates_gs.coordinates.length !== 2)
      ) {
        // Only pan to Saudi Arabia if there are no property markers
        const propertiesWithCoords = properties.filter(property => 
          property.property_address?.coordinates_gs?.coordinates &&
          property.property_address.coordinates_gs.coordinates.length === 2
        );
        if (propertiesWithCoords.length === 0) {
          desktopMap.panTo({ lat: 23.8859, lng: 45.0792 }); // Center of Saudi Arabia
          desktopMap.setZoom(6); // Wider zoom for country view
        }
        // Otherwise, let the auto-fit logic handle centering/zoom
      }
    }, [hoveredProperty, desktopMap,properties]);


    

    return (
      <div className="min-h-screen bg-gray-50 hidden lg:block">
   
        
        {/* Content: 2 Columns Split (Cards + Map) */}
        <div className="flex flex-col lg:flex-row lg:gap-4 bg-gray-100  lg:px-0 pb-8 ">
          {/* Mobile sections disabled for desktop-only component */}
          {false && (
            <div>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => <CardSkeleton key={idx} />)
              ) : (
                properties.map((property, index) => (
                  <PropertyCard
                    key={index}
                    property={property}
                    bedIconUrl={bedIconUrl}
                    bathIconUrl={bathIconUrl}
                    areaIconUrl={areaIconUrl}
                    onHover={() => setHoveredProperty(property)}
                    onLeave={() => setHoveredProperty(null)}
                    router={router}
                  />
                ))
              )}
              {!loading && properties.length === 0 && (
                <div className="col-span-full flex justify-center items-center mt-6">
                  <p className="text-gray-500 text-lg font-medium">No properties found</p>
                </div>
              )}
              {!loading && properties.length > 0 && hasNextPage && (
                <div className="col-span-full flex justify-center items-center mt-6">
                  <button
                    onClick={() => {
                      setCurrentPage(prev => prev + 1);
                    }}
                    disabled={loadingMore}
                    className="px-6 py-3  bg-gray-500 text-white font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingMore && (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    )}
           {loadingMore ? t('Loading...') : t('View More Properties')}

                  </button>
                </div>
              )}
              {/* {!loading && properties.length > 0 && !hasNextPage && totalCount > 0 && (
                <div className="col-span-full flex justify-center items-center mt-6">
                  <p className="text-gray-500 text-sm font-medium">All properties have been loaded</p>
                </div>
              )} */}
            </div>
          )}
          {/* Map view for mobile - also disabled for desktop-only component */}
          {false && viewMode === "map" && (
            <div className="w-full h-[400px] sm:h-[400px] lg:hidden bg-blue-100 overflow-hidden sticky top-0">
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={getMapCenter()}
                  zoom={getMapZoom()}
                  onLoad={map => (mobileMapRef.current = map)}
                >
                  {properties.map((property, idx) => {
                    const coords = property.property_address?.coordinates_gs?.coordinates;
                    if (!coords) return null;
                    const isActive = hoveredProperty && hoveredProperty._id === property._id;
                    return (
                      <React.Fragment key={idx}>
                        <OverlayView
                          position={{ lat: coords[1], lng: coords[0] }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <div
                            className={`bg-[rgb(206,32,39,255)] text-white font-medium rounded-full  px-2 py-2 text-xs shadow-lg mb-1 text-center min-w-[80px] cursor-pointer transition-colors ${isActive ? 'ring-2 ring-black bg-[rgb(206,32,39,255)] scale-110 z-50 ' : ''}`}
                            onClick={() => setFullscreenProperty(property)}
                          >
                            {property.current_list_price?.toLocaleString?.() || property.current_list_price} SAR
                          </div>
                        </OverlayView>
                        {isActive && (
                          <OverlayView
                            position={{ lat: coords[1], lng: coords[0] }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                          >
                            <div
                              className="bg-white rounded-lg shadow-lg max-w-xs w-50 z-50 cursor-pointer relative min-h-[180px] p-2"
                              style={{
                                marginTop: -220, // adjust as needed to show above the marker
                                zIndex: 1000,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHoveredProperty(null);
                                }}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold bg-white rounded-full w-7 h-7 flex items-center justify-center z-50 border border-gray-200 shadow"
                                style={{lineHeight: '1'}}
                                aria-label="Close property card"
                              >
                                ×
                              </button>
                              <div className="flex flex-col gap-3 pt-4">
                                <div className="relative w-full h-20 flex-shrink-0">
                                  <Image
                                    src={getPropertyImages(property)[0] || '/placeholder1.jpg'}
                                    alt={property.prop_type}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 p-2">
                                  <h3 className="font-normal text-sm lg:text-sm text-gray-600">{property.prop_type}</h3>
                                  <p className="text-xs text-gray-500">
  {property.list_address?.address?.split(' ').length > 6
    ? property.list_address.address.split(' ').slice(0, 6).join(' ') + '...'
    : property.list_address?.address}
</p>

                                  <div className="flex w-full items-center gap-2 text-sm my-2">
                                    <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-200 p-2">
                                      <span className="relative h-3 w-3">
                                        <Image src={bedIconUrl} alt="bed" fill className="object-contain" />
                                      </span>
                                      <span className="text-[10px]">{property.total_bed}</span>
                                    </span>
                                    <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-200 p-2">
                                      <span className="relative h-3 w-3">
                                        <Image src={bathIconUrl} alt="bath" fill className="object-contain" />
                                      </span>
                                      <span className="text-[10px]">{property.total_bath}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-2 py-2 whitespace-nowrap">
                                      <span className="relative h-3 w-3">
                                        <Image src={areaIconUrl} alt="area" fill className="object-contain" />
                                      </span>
                                      <span className="text-[10px]">
                                        {property.lot_size_area} {property.lot_size_units}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-gray-600">{property.current_list_price?.toLocaleString?.() || property.current_list_price} SAR</p>
                                    <button
                                      className="text-[10px] text-white p-2 rounded-lg bg-[rgb(206,32,39,255)]"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        localStorage.setItem('selectedProperty', JSON.stringify(property));
                                        router.push(`/propertydetails/${property._kw_meta?.id || property.id}`);
                                      }}
                                    >
                                      Enquire now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </OverlayView>
                        )}
                      </React.Fragment>
                    );
                  })}
                </GoogleMap>
              )}
              {/* Fullscreen property card overlay for mobile */}
              {isMobile && fullscreenProperty && (
                <div className="fixed inset-0 z-50 bg-white overflow-auto flex flex-col">
                  <button
                    className="absolute top-30 shadow right-6 z-60 text-3xl font-bold text-gray-700"
                    onClick={() => setFullscreenProperty(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <PropertyCard
                      property={fullscreenProperty}
                      bedIconUrl={bedIconUrl}
                      bathIconUrl={bathIconUrl}
                      areaIconUrl={areaIconUrl}
                      onHover={() => {}}
                      onLeave={() => {}}
                      router={router}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Desktop: Always show both */}
         
          <div className="hidden lg:flex w-full min-h-[80vh]">
    {/* Left - Properties List (natural scroll) */}
    <div className="w-1/2 pr-3">
      {/* Property Cards Grid - 3 columns for even display of 6 properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 p-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => <CardSkeleton key={idx} />)
        ) : (
          properties.map((property, index) => (
            <PropertyCard
              key={index}
              property={property}
              bedIconUrl={bedIconUrl}
              bathIconUrl={bathIconUrl}
              areaIconUrl={areaIconUrl}
              onHover={() => setHoveredProperty(property)}
              onLeave={() => setHoveredProperty(null)}
              router={router}
            />
          ))
        )}
        {!loading && properties.length === 0 && (
          <div className="col-span-full lg:col-span-2 flex justify-center items-center mt-6">
            <p className="text-gray-500 text-lg font-medium">No properties found</p>
          </div>
        )}
        {/* Load More button from parent if provided (for buyer/rent/recentlyrented/newdevelopment) */}
        {!loading && properties.length > 0 && parentHasNextPage && (
          <div className="col-span-full lg:col-span-2 flex justify-center items-center mt-6">
            <button
              onClick={parentLoadMore}
              disabled={parentLoadingMore}
              className="px-6 py-3 bg-gray-500 text-white font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {parentLoadingMore && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              )}
             {parentLoadingMore ? t('Loading...') : t('View More Properties')}
            </button>
          </div>
        )}
        {/* {!loading && properties.length > 0 && !hasNextPage && totalCount > 0 && (
          <div className="col-span-full lg:col-span-2 flex justify-center items-center mt-6">
            <p className="text-gray-500 text-sm font-medium">All properties have been loaded</p>
          </div>
        )} */}
      </div>
    </div>

    {/* Right - Map (sticky) */}
    <div className="w-1/2">
      <div className="sticky top-16 w-full h-screen bg-blue-100 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Location indicator when properties with coordinates are found */}
          {(() => {
            const propertiesWithCoords = properties.filter(property => 
              property.property_address?.coordinates_gs?.coordinates &&
              property.property_address.coordinates_gs.coordinates.length === 2
            );
            
            // if (propertiesWithCoords.length > 0) {
            //   return (
            //     <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            //       <div className="flex items-center gap-2">
            //         <FaMapMarkerAlt className="text-[rgb(206,32,39,255)] text-sm" />
            //         <span className="text-sm font-medium text-gray-700">
            //           {propertiesWithCoords.length} {propertiesWithCoords.length === 1 ? t('property') : t('properties')} 
            //           {' '}{t('with location')} {propertiesWithCoords.length > 1 ? t('found') : t('found')}
            //         </span>
            //       </div>
            //       {propertiesWithCoords.length > 1 && (
            //         <div className="text-xs text-gray-500 mt-1">
            //           {t('Map auto-adjusted to show all locations')}
            //         </div>
            //       )}
            //     </div>
            //   );
            // }
            return null;
          })()}
          
          {/* Lazy load GoogleMap for performance */}
          {/* Only load map when properties are available and Google Maps is loaded */}
          {shouldLoadMap && isLoaded && (
            <Suspense fallback={<Loader />}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={(map) => {
                  setDesktopMap(map);
                  setMapProjection(map.getProjection());
                }}
                center={getMapCenter()}
                zoom={getMapZoom()}
              >
            {/* Always render property markers as soon as properties are available */}
            {properties.map((property, idx) => {
              const coords = property.property_address?.coordinates_gs?.coordinates;
              if (!coords) return null;
              const key = coords.join(',');
              // Offset logic for overlapping markers
              let offsetIndex = 0;
              for (let i = 0; i < idx; i++) {
                const prevCoords = properties[i].property_address?.coordinates_gs?.coordinates;
                if (prevCoords && prevCoords.join(',') === key) offsetIndex++;
              }
              const offsetCoords = getOffsetCoords(coords, offsetIndex);
              const isActive = (hoveredProperty && hoveredProperty._id === property._id);
              const isFixed = hoveredProperty?.fixed && hoveredProperty?._id === property._id;
              return (
                <React.Fragment key={idx}>
                  {/* Price Badge Overlay */}
                  <OverlayView
                    position={offsetCoords}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`bg-[rgb(206,32,39,255)] text-white font-medium rounded-full px-2 py-2 text-xs text-center  shadow-lg
                          ${isActive ? ' scale-110 z-50 bg-[rgb(206,32,39,255)] ' : ''}
                          ${hoveredProperty?.fixed && hoveredProperty?._id === property._id ? 'ring-1 ring-black' : ''}
                        `}
                        onMouseEnter={() => {
                          if (!hoveredProperty?.fixed) setHoveredProperty(property);
                        }}
                        onMouseLeave={() => {
                          if (!hoveredProperty?.fixed) setHoveredProperty(null);
                        }}
                        onClick={() => {
                          if (hoveredProperty?.fixed && hoveredProperty?._id === property._id) return;
                          setHoveredProperty({ ...property, fixed: true });
                        }}
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Image
                            src="/saudicurrencywhite.png"
                            alt="SAR"
                            width={14}
                            height={14}
                            className="inline-block "
                          />
                          {property.current_list_price?.toLocaleString?.() || property.current_list_price}
                        </span>
                      </div>
                    </div>
                  </OverlayView>

                  {/* Full Property Card Overlay */}
                  {(isActive || isFixed) && (
                    <OverlayView
                      position={offsetCoords}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div style={{ marginTop: 36, zIndex: 100, position: 'relative' }}>
                        <div
                          className="bg-white  shadow-lg max-w-xs w-50 z-50 cursor-pointer"
                          onClick={() => {
                            localStorage.setItem('selectedProperty', JSON.stringify(property));
                            router.push(`/propertydetails/${property._kw_meta?.id || property.id}`);
                          }}
                          onMouseEnter={() => {
                            if (!hoveredProperty?.fixed) setHoveredProperty(property);
                          }}
                          onMouseLeave={() => {
                            if (!hoveredProperty?.fixed) setHoveredProperty(null);
                          }}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="relative w-full h-20 flex-shrink-0">
                              <Image
                                src={getPropertyImages(property)[0] || '/placeholder1.jpg'}
                                alt={property.prop_type}
                                fill
                                className="object-cover"
                              />
                              {isFixed && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHoveredProperty(null);
                                  }}
                                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold bg-white w-6 h-6 flex items-center justify-center"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <div className="flex-1 min-w-0  ">
                              <h3 className="font-normal text-sm lg:text-sm  text-gray-600 px-2">{property.prop_type}</h3>
                              <p className="text-xs text-[rgb(206,32,39,255)] py-1 px-2">
                                {property.prop_subtype || "To Let"}
                              </p>
                              <p className="text-xs font-bold text-gray-600 mb-2 px-2">
                                {property.list_address?.address || property.list_address.address || property.list_address?.address}
                              </p>
                              <div className="mt-2 flex items-center justify-between px-2">
                                <div className="flex items-center font-medium text-sm mb-2 text-gray-700">
                                  <span className="relative w-4 h-4 mr-2">
                                    <Image 
                                      src="/currency.png"
                                      alt="currency"
                                      fill
                                      className="object-contain"
                                    />
                                  </span>
                                  <span>
                                    {property.price
                                      ? formatPrice(property.price)
                                      : property.current_list_price
                                      ? formatPrice(property.current_list_price)
                                      : ""}
                                  </span>
                                </div>
                                {property.price_qualifier && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {property.price_qualifier}
                                  </p>
                                )}
                              </div>
                              <button 
                                className="cursor-pointer w-full bg-[rgb(206,32,39,255)] text-white font-bold text-xs py-2 px-4 flex items-center justify-end"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  localStorage.setItem('selectedProperty', JSON.stringify(property));
                                  router.push(`/propertydetails/${property._kw_meta?.id || property.id}`);
                                }}
                              >
                                <span>{t("MORE DETAILS")}</span>
                                <FaChevronRight className={`text-white w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </OverlayView>
                  )}
                </React.Fragment>
              );
            })}
            </GoogleMap>
          </Suspense>
        )}
        </div>
      </div>
    </div>
</div>

        </div>
      </div>
    );
  }
  