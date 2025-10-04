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
  import { GoogleMap, Marker, useJsApiLoader, InfoWindow, OverlayView } from '@react-google-maps/api';
  import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useTranslation } from '../contexts/TranslationContext';
  // Add this new component before the Home component

  const PropertyCard = React.memo(({ property, bedIconUrl, bathIconUrl, areaIconUrl, onHover, onLeave, router }) => {
// Set display name for React DevTools and linter
PropertyCard.displayName = "PropertyCard";
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false); // image loading state
    const { language,isRTL, t } = useTranslation();
    const getPropertyImages = (property) => {
      const fallbackImages = [
        "/placeholder1.jpg",
        "/placeholder2.jpg",
        "/placeholder3.jpg",
        "/placeholder4.jpg",
        "/placeholder5.jpg",
        "/placeholder6.jpg",
        "/placeholder7.jpg"
      ];
      
      return property.photos?.map(photo => photo.ph_url) || fallbackImages;
    };
    const formatPrice = (price) => {
      if (typeof price === 'number') {
        return price.toLocaleString('en-US');
      }
      if (typeof price === 'string' && !isNaN(Number(price))) {
        return Number(price).toLocaleString('en-US');
      }
      return price || '';
    };
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
              src={getPropertyImages(property)[currentImageIndex] || '/placeholder1.jpg'}
              alt={property.prop_type || "Property Image"}
              width={500}
              height={300}
              className="w-full h-50 md:h-60 object-cover border-b-0"
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
        <Image src={bedIconUrl} alt="bed" fill className="object-contain invert" />
      </span>
      <span className="text-xs mt-1">
        {property.total_bed || property.beds || property.bedrooms || 0}
      </span>
    </div>

    {/* Baths */}
    <div className="flex flex-col items-center">
      <span className="relative w-5 h-5">
        <Image src={bathIconUrl} alt="bath" fill className="object-contain invert" />
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
                   className="w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2"
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
    
    // Memoize parentProperties to prevent dependency changes on every render
    const parentProperties = useMemo(() => props?.properties || [], [props?.properties]);
    
    const router = useRouter();
    const [viewMode, setViewMode] = useState("list");
    const [currentPage, setCurrentPage] = useState(1);
    const propertiesPerPage = 6;
    const filterPanelRef = useRef(null);
    const [properties, setProperties] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // <-- add this for backend total count
    const [hasNextPage, setHasNextPage] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState('All');
  const [propertySubtype, setPropertySubtype] = useState('All');
  const [marketCenter, setMarketCenter] = useState('All');
  const [location, setLocation] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  // Debounced filters
  const debouncedPropertyCategory = useDebounce(propertyCategory, 400);
  const debouncedPropertySubtype = useDebounce(propertySubtype, 400);
  const debouncedMarketCenter = useDebounce(marketCenter, 400);
  const debouncedLocation = useDebounce(location, 400);
  const debouncedPriceRange = useDebounce(priceRange, 400);
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

    
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyDhQDfHVkov3_YZ_Zt-m9N7Q-ytIxcVpx0"
    });
    const [desktopMap, setDesktopMap] = useState(null);

    const bedIconUrl = "/bed.png";
    const bathIconUrl = "/bath.png";
    const areaIconUrl = "/area.png";

    // Helper to get property images (move outside PropertyCard for reuse)
    const getPropertyImages = (property) => {
      const fallbackImages = [
        "/placeholder1.jpg",
        "/placeholder2.jpg",
        "/placeholder3.jpg",
        "/placeholder4.jpg",
        "/placeholder5.jpg",
        "/placeholder6.jpg",
        "/placeholder7.jpg"
      ];
      return property?.photos?.map(photo => photo.ph_url) || fallbackImages;
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
      // Only fetch data if not a child component
      if (isChildComponent) {
        return;
      }
      
      const fetchData = async () => {
        // Normalize and deduplicate function (same as buyer page)
        const normalizeAndUnique = (items) => {
          const unique = [];
          const seen = new Set();
          items.forEach(it => {
            const propId = it._kw_meta?.id || it.id;
            if (propId) {
              if (!seen.has(propId)) {
                seen.add(propId);
                unique.push(it);
              }
            } else {
              // Generate stable temp ID for properties without ID
              const tempId = it._temp_id || stableTempId(it);
              it._temp_id = tempId;
              unique.push(it);
            }
          });
          return unique;
        };

        // Helper to generate stable temp ID (same as buyer page)
        const stableTempId = (prop) => {
          const s = `${prop.list_address?.address || prop.address || ''}|${prop.title || prop.prop_type || ''}|${prop.current_list_price || prop.price || prop.rental_price || ''}`;
          // simple hash (djb2)
          let h = 5381;
          for (let i = 0; i < s.length; i++) {
            h = ((h << 5) + h) + s.charCodeAt(i);
            h = h & h; // keep 32-bit
          }
          return `stable-${Math.abs(h)}`;
        };

        try {
          if (currentPage === 1) {
            setLoading(true);
          } else {
            setLoadingMore(true);
          }
          
          // Build request body using the same pattern as buyer page
          let requestBody = {
            page: currentPage,
            limit: propertiesPerPage
          };

          // Apply filters from parent component if provided (buyer/rent page filters)
          if (parentFilters) {
            // Use the same filter structure as buyer Properties.js
            requestBody.forsale = parentFilters.selected.sale && !parentFilters.selected.rent ? true : undefined;
            requestBody.forrent = parentFilters.selected.rent && !parentFilters.selected.sale ? true : undefined;
            requestBody.property_type = parentFilters.selected.commercial
              ? 'Commercial'
              : parentFilters.propertyType !== 'PROPERTY TYPE' ? parentFilters.propertyType : undefined;
            requestBody.property_subtype = parentFilters.propertySubType || undefined;
            requestBody.location = parentFilters.city !== 'CITY' ? parentFilters.city : undefined;
            requestBody.min_price = parentFilters.minPrice || undefined;
            requestBody.max_price = parentFilters.maxPrice || undefined;
            requestBody.include_new_homes = parentFilters.includeNewHomes ? true : undefined;
            requestBody.market_center = parentFilters.marketCenter !== 'MARKET CENTER' ? parentFilters.marketCenter : undefined;
          }
          // For child component usage without parent filters, apply default filters
          else if (isChildComponent) {
            requestBody.forrent = true;
          } else {
            // For standalone use, show all properties by default (like buyer page)
            // Only apply filters if explicitly specified in URL params
            if (typeParam === 'sale') {
              requestBody.forsale = true;
            } else if (typeParam === 'rent') {
              requestBody.forrent = true;
            } else if (typeParam === 'commercial') {
              requestBody.property_type = 'Commercial';
            }
            // If no typeParam, show all properties (no filter applied)
          }

          // Map marketCenter to API value (same as rent page) - only for internal filters
          const marketCenterMap = {
            'MARKET CENTER': undefined,
            'Jasmin': '50449',
            'Jeddah': '2414288',
          };
          
          // Add filters when they are not default values (only for standalone use without parent filters)
          if (!isChildComponent && !parentFilters) {
            if (debouncedMarketCenter !== 'All') {
              const apiMarketCenter = marketCenterMap[debouncedMarketCenter];
              if (apiMarketCenter) {
                requestBody.market_center = apiMarketCenter;
              }
            }
            
            if (debouncedPropertySubtype !== 'All') {
              requestBody.property_subtype = debouncedPropertySubtype;
            }
            
            if (debouncedLocation !== 'All') {
              requestBody.location = debouncedLocation;
            }
            
            // Map priceRange to min/max price (same as rent page)
            if (debouncedPriceRange !== 'All') {
              if (debouncedPriceRange === 'Below SAR 50,000') {
                requestBody.max_price = 50000;
              } else if (debouncedPriceRange === 'SAR 50,000 – 100,000') {
                requestBody.min_price = 50000;
                requestBody.max_price = 100000;
              } else if (debouncedPriceRange === 'Above SAR 100,000') {
                requestBody.min_price = 100000;
              }
            }
          }

          // Remove undefined values
          Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);

          // Use the same API endpoint as rent page
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/list/properties`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'max-age=300',
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.success) {
            let fetched = Array.isArray(data?.data) ? data.data : [];
            
            // Temporarily comment out sold property filtering to debug
            // fetched = fetched.filter(property => 
            //   property.list_category !== 'sold' && 
            //   property.list_category !== 'Sold'
            // );
            
            // Apply normalization and deduplication (same as buyer page)
            if (currentPage === 1) {
              setProperties(normalizeAndUnique(fetched));
            } else {
              setProperties(prev => normalizeAndUnique([...prev, ...fetched]));
            }
            
            // Handle pagination - simple approach
            if (data.pagination) {
              const originalHasNextPage = data.pagination.has_next_page || false;
              
              // Use API pagination data
              setHasNextPage(originalHasNextPage);
              
              // For total count, use API data
              if (currentPage === 1) {
                setTotalCount(data.pagination.total_items || fetched.length);
              }
            } else {
              setTotalCount(fetched.length);
              setHasNextPage(fetched.length === propertiesPerPage);
            }
          } else {
            //console.error('API Error:', data.message || 'Failed to load properties');
          }
        } catch (error) {
          //console.error('Error fetching properties:', error);
        } finally {
          setLoading(false);
          setLoadingMore(false);
        }
      };
      
      fetchData();
    }, [currentPage, propertiesPerPage, debouncedPropertyCategory, debouncedPropertySubtype, debouncedMarketCenter, debouncedLocation, debouncedPriceRange, typeParam, searchTerm, isChildComponent, parentFilters]);
    
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
      // Default location
      return "https://www.google.com/maps?q=2740+King+Fahd+Branch+Rd,+Riyadh,+Saudi+Arabia&output=embed";
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

    // Helper to get map center and zoom with offset for hovered property
    const getMapCenter = () => {
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
      return { lat: 24.7136, lng: 46.6753 };
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

    useEffect(() => {
      if (
        desktopMap &&
        (!hoveredProperty ||
          !hoveredProperty.coordinates_gs ||
          !hoveredProperty.coordinates_gs.coordinates ||
          hoveredProperty.coordinates_gs.coordinates.length !== 2)
      ) {
        desktopMap.panTo({ lat: 24.7136, lng: 46.6753 });
        desktopMap.setZoom(10);
      }
    }, [hoveredProperty, desktopMap]);


    

    return (
      <div className="min-h-screen bg-gray-50 hidden md:block">
   
        
        {/* Content: 2 Columns Split (Cards + Map) */}
        <div className="flex flex-col md:flex-row md:gap-4 bg-gray-100  md:px-0 pb-8 ">
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
              {!loading && properties.length > 0 && !hasNextPage && totalCount > 0 && (
                <div className="col-span-full flex justify-center items-center mt-6">
                  <p className="text-gray-500 text-sm font-medium">All properties have been loaded</p>
                </div>
              )}
            </div>
          )}
          {/* Map view for mobile - also disabled for desktop-only component */}
          {false && viewMode === "map" && (
            <div className="w-full h-[400px] sm:h-[400px] md:hidden bg-blue-100 overflow-hidden sticky top-0">
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
                                  <h3 className="font-normal text-sm md:text-sm text-gray-600">{property.prop_type}</h3>
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
         
          <div className="hidden md:flex w-full min-h-[80vh]">
    {/* Left - Properties List (natural scroll) */}
    <div className="w-1/2 pr-3">
      {/* Property Cards Grid - 3 columns for even display of 6 properties */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 p-2">
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
          <div className="col-span-full md:col-span-2 flex justify-center items-center mt-6">
            <p className="text-gray-500 text-lg font-medium">No properties found</p>
          </div>
        )}
        {!loading && properties.length > 0 && hasNextPage && (
          <div className="col-span-full md:col-span-2 flex justify-center items-center mt-6">
            <button
              onClick={() => {
                setCurrentPage(prev => prev + 1);
              }}
              disabled={loadingMore}
              className="px-6 py-3 bg-gray-500 text-white font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingMore && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              )}
             {loadingMore ? t('Loading...') : t('View More Properties')}

            </button>
          </div>
        )}
        {!loading && properties.length > 0 && !hasNextPage && totalCount > 0 && (
          <div className="col-span-full md:col-span-2 flex justify-center items-center mt-6">
            <p className="text-gray-500 text-sm font-medium">All properties have been loaded</p>
          </div>
        )}
      </div>
    </div>

    {/* Right - Map (sticky) */}
    <div className="w-1/2">
      <div className="sticky top-16 w-full h-screen bg-blue-100 overflow-hidden">
        {/* Lazy load GoogleMap for performance */}
        {isLoaded && (
          <Suspense fallback={<Loader />}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              onLoad={(map) => {
                setDesktopMap(map);
                setMapProjection(map.getProjection());
              }}
            >
            {(() => {
              let coordSeen = {};

              const shouldShowAbove = (coords) => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) return false; // Only apply on laptop/desktop
                if (!desktopMap || !mapProjection) return false;
                // Convert LatLng to Point
                const latLng = new window.google.maps.LatLng(coords.lat, coords.lng);
                const projPoint = mapProjection.fromLatLngToPoint(latLng);
                const scale = Math.pow(2, desktopMap.getZoom());
                // Get map bounds in world coordinates
                const bounds = desktopMap.getBounds();
                if (!bounds) return false;
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                const topRight = mapProjection.fromLatLngToPoint(ne);
                const bottomLeft = mapProjection.fromLatLngToPoint(sw);
                // Calculate pixel position
                const x = (projPoint.x - bottomLeft.x) * scale;
                const y = (projPoint.y - topRight.y) * scale;
                const mapDiv = desktopMap.getDiv();
                const mapHeight = mapDiv.clientHeight;
                // Debug log
               // console.log('Marker pixel y:', y, 'Map height:', mapHeight, 'Show above:', y > mapHeight * 0.7);
                // If marker is in the bottom 30% of the map, show card above
                return y > mapHeight * 0.7;
              };

              return properties.map((property, idx) => {
                const coords = property.property_address?.coordinates_gs?.coordinates;
                if (!coords) return null;
                const key = coords.join(',');
                coordSeen[key] = (coordSeen[key] || 0) + 1;
                const offsetCoords = getOffsetCoords(coords, coordSeen[key] - 1);
                const priceText = `${property.current_list_price?.toLocaleString?.() || property.current_list_price}SAR`;
                const isActive = (hoveredProperty && hoveredProperty._id === property._id);
                const isFixed = hoveredProperty?.fixed && hoveredProperty?._id === property._id;
                const showAbove = shouldShowAbove(offsetCoords);
                const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  };
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
                    if (desktopMap && mapProjection) {
                      const latLng = new window.google.maps.LatLng(offsetCoords.lat, offsetCoords.lng);
                      const projPoint = mapProjection.fromLatLngToPoint(latLng);
                      const scale = Math.pow(2, desktopMap.getZoom());
                      const bounds = desktopMap.getBounds();
                      
                      if (bounds) {
                        const ne = bounds.getNorthEast();
                        const sw = bounds.getSouthWest();
                        const topRight = mapProjection.fromLatLngToPoint(ne);
                        const bottomLeft = mapProjection.fromLatLngToPoint(sw);
                        const y = (projPoint.y - topRight.y) * scale;
                        const mapHeight = desktopMap.getDiv().clientHeight;
                        if (y > mapHeight * 0.65) {
                          const panAmount = Math.min(300, mapHeight * 0.3);
                          desktopMap.panBy(0, -panAmount);
                        }
                      }
                    }
                  }}
                  style={{ position: 'relative', zIndex: 10 }}
                >
                 <span className="inline-flex items-center gap-1">
  
  <Image
    src="/saudicurrencywhite.png"   // 👈 put your SAR currency logo path here
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
                              e.stopPropagation(); // Prevents triggering the parent click
                              setHoveredProperty(null);
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold bg-white w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                        
                      </div>
                      <div className="flex-1 min-w-0  ">
                        <h3 className="font-normal text-sm md:text-sm  text-gray-600 px-2">{property.prop_type}</h3>
                        <p className="text-xs text-[rgb(206,32,39,255)] py-1 px-2">
                        {property.prop_subtype || "To Let"}
</p> <p
      className="text-xs font-bold text-gray-600 mb-2 px-2"
     
    >
      {property.list_address?.address||
         property.list_address.address||
        property.list_address?.address}
    </p>

                        
                        <div className="mt-2 flex items-center justify-between px-2">
                        <div className="flex items-center font-medium text-sm mb-2 text-gray-700">
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
                    className="w-full bg-[rgb(206,32,39,255)] text-white font-bold text-xs py-2 px-4 flex items-center justify-end"
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
      });
    })()}
            </GoogleMap>
          </Suspense>
        )}

      </div>
    </div>
</div>

        </div>
      </div>
    );
  }
  