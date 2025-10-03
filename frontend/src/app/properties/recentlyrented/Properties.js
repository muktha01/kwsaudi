
'use client'
import React, { useState, useEffect, Suspense, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaBars, FaTimes, FaBuilding, FaChevronDown, FaChevronRight, FaChevronLeft,FaCheck  } from "react-icons/fa";
import {motion} from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/contexts/TranslationContext';

// Lazy load components for better performance
const PropertyType = dynamic(() => import('@/components/propertype'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse"></div>
});
const NewFooter = dynamic(() => import('@/components/newfooter'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100"></div>
});
const Header = dynamic(() => import('@/components/header'), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-100"></div>
});

// Skeleton component for loading state
const PropertySkeleton = () => (
  <div className="bg-white shadow-2xl overflow-hidden w-full animate-pulse">
    <div className="w-full h-50 md:h-60 bg-gray-300"></div>
    <div className="p-4 py-6">
      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
      <div className="h-6 bg-gray-300 rounded mb-2 w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
    <div className="w-full h-12 bg-gray-400"></div>
  </div>
);

// Memoized Property Card component for better performance
const PropertyCard = React.memo(function PropertyCard({ property, idx, generatePropertyKey, bedIconUrl, bathIconUrl, formatPrice }) {
  const { t, isRTL } = useTranslation();
  return (
    <div
      key={generatePropertyKey(property, idx)}
      className="bg-white shadow-2xl overflow-hidden w-full cursor-pointer"
      onClick={() => {
        const propertyId = property._kw_meta?.id || property.id || idx;
        window.location.href = `/propertydetails/${propertyId}`;
      }}
    >
      {/* Image Section */}
      <div className="relative w-full h-50 md:h-60">
        <Image
          src={
            property.image ||
            (Array.isArray(property.images) && property.images[0]) ||
            (Array.isArray(property.photos) &&
              property.photos[0]?.ph_url) ||
            "/properysmallfalback.jpg"
          }
          alt={t(property.title || property.prop_type || "property")}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wq"
        />

        {/* Beds & Baths Overlay */}
        <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
          {/* Beds */}
          <div className="flex flex-col items-center">
            <span className="relative w-5 h-5">
              <Image src={bedIconUrl} alt={t("bed")} fill className="object-contain invert" loading="lazy" />
            </span>
            <span className="text-xs mt-1">
              {property.total_bed || property.beds || property.bedrooms || 0}
            </span>
          </div>

          {/* Baths */}
          <div className="flex flex-col items-center">
            <span className="relative w-5 h-5">
              <Image src={bathIconUrl} alt={t("bath")} fill className="object-contain invert" loading="lazy" />
            </span>
            <span className="text-xs mt-1">
              {property.total_bath || property.baths || property.bathrooms || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 py-6">
        <h3 className="text-gray-700 text-lg flex justify-start items-center">
          {t(property.title || property.prop_type || "Property")}
        </h3>
        <span className="flex justify-start text-[rgb(206,32,39,255)] text-lg font-semibold">
          {t(property?.prop_subtype || "Recently Rented")}
        </span>

        <p
          className="text-xl font-bold text-gray-600 mb-2 truncate"
          title={property.list_address?.address}
        >
          {property.list_address?.address?.split(" ").length > 5
            ? property.list_address.address
                .split(" ")
                .slice(0, 5)
                .join(" ") + "..."
            : property.list_address?.address}
        </p>

        <div className="flex justify-start items-center">
          <span className="relative w-4 h-4 mr-2">
            <Image 
              src="/currency.png"
              alt="currency"
              fill
              className="object-contain"
              loading="lazy"
            />
          </span>

          <span>
            {property.price
              ? formatPrice(property.price)
              : property.current_list_price
              ? formatPrice(property.current_list_price)
              : property.rental_price
              ? formatPrice(property.rental_price)
              : ""}
          </span>
        </div>

        {property.price_qualifier && (
          <p className="text-xs text-gray-500 mt-1">
            {property.price_qualifier}
          </p>
        )}
      </div>

      {/* Button */}
      <button
        className="cursor-pointer w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2"
        onClick={(e) => {
          e.stopPropagation();
          const propertyId = property._kw_meta?.id || property.id || idx;
          window.location.href = `/propertydetails/${propertyId}`;
        }}
      >
        <span>{t("MORE DETAILS")}</span>
        <FaChevronRight className={`text-white w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
});

// Wrapper component that uses useSearchParams
const PropertiesContent = () => {
  const { t, isRTL } = useTranslation();
  // Sorting state - default to recently rented for this page
  const [sortOption, setSortOption] = useState('recently-rented');
  
  // Dynamic dropdown options from backend
  const [allPropertyTypes, setAllPropertyTypes] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allSubTypes, setAllSubTypes] = useState([]);
  const [allMarketCenters, setAllMarketCenters] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const allPrices = [
  32000, 45001, 80000, 120000, 200000, 325001, 500100, 750010, 1000000, 1500100,
  2500100, 3000000, 3500100, 4200000, 5001000, 10000000, 25001000, 78000000, 1140000000
];
  const [price, setPrice] = useState(750010);
  // Remove visibleCount, not needed for classic pagination
  const [prevHeroIndex, setPrevHeroIndex] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(6);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);
  const [isSorted, setIsSorted] = useState(false); // Track if properties are already sorted
  
  // Cache for API responses
  const cacheRef = useRef(new Map());
  const filtersCache = useRef(null);
  
  // Filter state - separate from display state
  // Note: rent: true in appliedFilters means rent filter is applied by default
  // This ensures rent properties are shown initially on the rent page
  const [appliedFilters, setAppliedFilters] = useState({
    selected: { sale: false, rent: true, commercial: false },
    propertyType: 'PROPERTY TYPE',
    propertySubType: '',
    city: 'CITY',
  minPrice: '',
  maxPrice: '',
  includeNewHomes: false,
    marketCenter: 'MARKET CENTER'
  });

  // Display state for form inputs
  // Note: rent: true in displayFilters means the rent checkbox is checked by default
  // This matches the applied filter for rent properties
  const [displayFilters, setDisplayFilters] = useState({
    selected: { sale: false, rent: true, commercial: false },
    propertyType: 'PROPERTY TYPE',
    propertySubType: '',
    city: 'CITY',
    minPrice: '',
    maxPrice: '',
  includeNewHomes: true,
    marketCenter: 'MARKET CENTER'
  });
  
  // Cached API fetch function for properties
  const fetchPropertiesWithCache = useCallback(async (page, requestBody) => {
    const cacheKey = `recently-rented-${JSON.stringify(requestBody)}-page-${page}`;
    
    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      // console.log('Using cached recently rented properties data for:', cacheKey);
      return cacheRef.current.get(cacheKey);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/list/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await res.json();
    
    // Cache the response (only cache successful responses)
    if (data.success) {
      cacheRef.current.set(cacheKey, data);
      
      // Limit cache size to prevent memory issues
      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }
    }
    
    return data;
  }, []);

  // Cached filter options fetch
  const fetchFilterOptionsWithCache = useCallback(async () => {
    if (filtersCache.current) {
      // console.log('Using cached filter options');
      return filtersCache.current;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/filters`);
    if (!res.ok) {
      throw new Error('Failed to fetch filter options');
    }
    
    const data = await res.json();
    filtersCache.current = data;
    return data;
  }, []);
  
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Reset pagination when filters change
  const resetPagination = useCallback((newPerPage = perPage) => {
    setCurrentPage(1);
    // Clear all properties and reload first page
    setProperties([]);
    setHasNextPage(false);
    setHasPrevPage(false);
    setTotalPages(1);
    setTotalItems(0);
    setIsSorted(false); // Reset sorting flag
    // Set perPage to 6 for filtered results
    setPerPage(newPerPage);
  }, [perPage]);

  // Apply filters function - only called when search button is clicked
  const applyFilters = useCallback(() => {
    // Reset pagination before applying filters
    resetPagination(6);
    setAppliedFilters({
      selected: { ...displayFilters.selected },
      propertyType: displayFilters.propertyType,
      propertySubType: displayFilters.propertySubType,
      city: displayFilters.city,
      minPrice: displayFilters.minPrice,
      maxPrice: displayFilters.maxPrice,
      includeNewHomes: displayFilters.includeNewHomes,
      marketCenter: displayFilters.marketCenter
    });
    // Do NOT fetch data here; useEffect will handle it
  }, [displayFilters, resetPagination]);
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";

  // Preload critical icons for better performance
  useEffect(() => {
    const preloadImages = ['/bed.png', '/bath.png', '/currency.png'];
    preloadImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Update display filters when form inputs change
  const updateDisplayFilter = (key, value) => {
    setDisplayFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateSelectedFilter = (key) => {
  setDisplayFilters(prev => ({
    ...prev,
    selected: {
      ...prev.selected,
      [key]: !prev.selected[key],
    }
  }));
};

const applySorting = useCallback((propertiesArray) => {
  let sorted = [...propertiesArray];
  
  // Debug: Log sorting information
  // console.log('Sorting properties with option:', sortOption);
  // console.log('Total properties to sort:', sorted.length);
  
  if (sortOption === 'recently-rented') {
    // Debug: Show sample list_dt values before sorting
    // console.log('Sample list_dt values:', sorted.slice(0, 5).map(p => ({
    //   id: p._kw_meta?.id,
    //   list_dt: p.list_dt,
    //   date_added: p.date_added,
    //   createdAt: p.createdAt
    // })));
    
    sorted.sort((a, b) => {
      const dateA = new Date(a.list_dt || a.date_added || a.createdAt || 0);
      const dateB = new Date(b.list_dt || b.date_added || b.createdAt || 0);
      return dateB - dateA; // Most recent first
    });
    
    // Debug: Show sorted list_dt values after sorting
    // console.log('After sorting by list_dt:', sorted.slice(0, 5).map(p => ({
    //   id: p._kw_meta?.id,
    //   list_dt: p.list_dt,
    //   date_value: new Date(p.list_dt || p.date_added || p.createdAt || 0)
    // })));
    
  } else if (sortOption === 'price-desc') {
    sorted.sort((a, b) => {
      const priceA = Number(a.price || a.current_list_price || a.rental_price || 0);
      const priceB = Number(b.price || b.current_list_price || b.rental_price || 0);
      return priceB - priceA;
    });
  } else if (sortOption === 'price-asc') {
    sorted.sort((a, b) => {
      const priceA = Number(a.price || a.current_list_price || a.rental_price || 0);
      const priceB = Number(b.price || b.current_list_price || b.rental_price || 0);
      return priceA - priceB;
    });
  } else if (sortOption === 'date-desc') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.date_added || a.createdAt || 0);
      const dateB = new Date(b.date_added || b.createdAt || 0);
      return dateB - dateA;
    });
  }
  return sorted;
}, [sortOption]);
  // Update visible count when properties change
  // Remove visibleCount effect, not needed for classic pagination
  
  // Note: Backend now supports sorting, so we reset pagination when sort changes
  // to get fresh sorted data from the backend
  
  // Reset pagination when sort option changes
  useEffect(() => {
    if (sortOption) {
      resetPagination();
    }
  }, [sortOption, resetPagination]);
  
  // Force re-render when sort option changes to ensure sorting is applied
  useEffect(() => {
    // console.log('Sort option changed to:', sortOption);
  }, [sortOption]);

  // Deterministic temp id using simple hash of address/title/price
  const stableTempId = useCallback((prop) => {
    const s = `${prop.list_address?.address || prop.address || ''}|${prop.title || prop.prop_type || ''}|${prop.current_list_price || prop.price || prop.rental_price || ''}`;
    // simple hash (djb2)
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) + h) + s.charCodeAt(i);
      h = h & h; // keep 32-bit
    }
    return `stable-${Math.abs(h)}`;
  }, []);

  // Optimized fetch properties function with hybrid caching
  const fetchProperties = useCallback(async (page = 1) => {
    const isFirstPage = page === 1;
    
    const requestBody = {
      page: page,
      limit: perPage,
      forsale: appliedFilters.selected.sale && !appliedFilters.selected.rent ? true : undefined,
      forrent: appliedFilters.selected.rent && !appliedFilters.selected.sale ? true : undefined,
      property_type: appliedFilters.selected.commercial
        ? 'Commercial'
        : appliedFilters.propertyType !== 'PROPERTY TYPE' ? appliedFilters.propertyType : undefined,
      property_subtype: appliedFilters.propertySubType || undefined,
      location: appliedFilters.city !== 'CITY' ? appliedFilters.city : undefined,
      min_price: appliedFilters.minPrice || undefined,
      max_price: appliedFilters.maxPrice || undefined,
      include_new_homes: appliedFilters.includeNewHomes ? true : undefined,
      market_center: appliedFilters.marketCenter !== 'MARKET CENTER' ? appliedFilters.marketCenter : undefined,
      // Add sorting parameters for backend
      sort_by: sortOption === 'recently-rented' ? 'list_dt' : 
               sortOption === 'date-desc' ? 'date_added' :
               sortOption === 'price-desc' ? 'price' :
               sortOption === 'price-asc' ? 'price' : 'list_dt',
      sort_order: sortOption === 'price-asc' ? 'asc' : 'desc'
    };
    
    // Remove undefined values
    Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);

    // Create cache keys
    const PROPERTIES_CACHE_KEY = `recentlyrented_properties_${JSON.stringify(requestBody)}_page_${page}`;
    const PROPERTIES_CACHE_EXPIRY_KEY = `${PROPERTIES_CACHE_KEY}_expiry`;
    const PROPERTIES_SESSION_CACHE_KEY = `${PROPERTIES_CACHE_KEY}_session`;
    const PROPERTIES_COUNT_KEY = `${PROPERTIES_CACHE_KEY}_count`;
    const PROPERTIES_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

    // Normalize and deduplicate function
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
          const tempId = it._temp_id || stableTempId(it);
          it._temp_id = tempId;
          unique.push(it);
        }
      });
      return unique;
    };

    // Apply data to state
    const applyDataToState = (propertiesData, paginationData) => {
      setProperties(prev => {
        if (isFirstPage) {
          const sorted = applySorting(normalizeAndUnique(propertiesData));
          setIsSorted(true);
          return sorted;
        } else {
          const combined = [...prev, ...propertiesData];
          return normalizeAndUnique(combined);
        }
      });

      if (paginationData) {
        setCurrentPage(paginationData.current_page);
        setTotalPages(paginationData.total_pages);
        setTotalItems(paginationData.total_items);
        setPerPage(paginationData.per_page);
        setHasNextPage(paginationData.has_next_page);
        setHasPrevPage(paginationData.has_prev_page);
      }

      if (isFirstPage) {
        setLoading(false);
      }
      setLoadingMore(false);
    };

    // Step 1: Show cached data immediately (if available)
    const showCachedDataImmediately = () => {
      if (typeof window !== 'undefined') {
        // Check sessionStorage first for ultra-fast access
        const sessionData = sessionStorage.getItem(PROPERTIES_SESSION_CACHE_KEY);
        if (sessionData) {
          try {
            const parsedData = JSON.parse(sessionData);
            applyDataToState(parsedData.properties, parsedData.pagination);
            return true; // Cached data was shown
          } catch (e) {
            console.warn('Error parsing session cache:', e);
          }
        }

        // Check localStorage for persistent cache
        const cachedData = localStorage.getItem(PROPERTIES_CACHE_KEY);
        const cachedExpiry = localStorage.getItem(PROPERTIES_CACHE_EXPIRY_KEY);
        const now = Date.now();

        if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
          try {
            const parsedData = JSON.parse(cachedData);
            // Copy to session storage for ultra-fast next access
            sessionStorage.setItem(PROPERTIES_SESSION_CACHE_KEY, cachedData);
            applyDataToState(parsedData.properties, parsedData.pagination);
            return true; // Cached data was shown
          } catch (e) {
            console.warn('Error parsing localStorage cache:', e);
          }
        }
      }
      return false; // No cached data
    };

    // Step 2: Check for updates in background
    const checkForUpdatesInBackground = async () => {
      try {
        // Lightweight API call to check if data has changed
        const countRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/count/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        if (countRes.ok) {
          const countData = await countRes.json();
          const cachedCount = localStorage.getItem(PROPERTIES_COUNT_KEY);
          
          // If count changed, data has been updated on server
          if (countData.total !== parseInt(cachedCount || '0')) {
            console.log('🔄 New recently rented properties detected, refreshing cache...');
            
            // Clear cache and fetch fresh data
            localStorage.removeItem(PROPERTIES_CACHE_KEY);
            localStorage.removeItem(PROPERTIES_CACHE_EXPIRY_KEY);
            sessionStorage.removeItem(PROPERTIES_SESSION_CACHE_KEY);
            
            // Fetch fresh data silently
            await fetchFreshData(true);
          }
        }
      } catch (error) {
        // Silently fail - user still sees cached data
        console.log('Background update check failed:', error);
      }
    };

    // Step 3: Fetch fresh data function
    const fetchFreshData = async (isBackgroundUpdate = false) => {
      try {
        if (!isBackgroundUpdate && isFirstPage) {
          setLoading(true);
          setError(null);
        } else if (!isBackgroundUpdate && !isFirstPage) {
          setLoadingMore(true);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/list/properties`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=300',
          },
          body: JSON.stringify(requestBody)
        });

        if (!res.ok) {
          // Try to use expired cache if API fails
          if (typeof window !== 'undefined') {
            const cachedData = localStorage.getItem(PROPERTIES_CACHE_KEY);
            if (cachedData) {
              const parsedData = JSON.parse(cachedData);
              applyDataToState(parsedData.properties, parsedData.pagination);
              return;
            }
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        if (data.success) {
          let fetched = Array.isArray(data?.data) ? data.data : [];
          
          // Cache the fresh data
          if (typeof window !== 'undefined') {
            const dataToCache = {
              properties: fetched,
              pagination: data.pagination
            };
            const now = Date.now();
            localStorage.setItem(PROPERTIES_CACHE_KEY, JSON.stringify(dataToCache));
            localStorage.setItem(PROPERTIES_CACHE_EXPIRY_KEY, (now + PROPERTIES_CACHE_DURATION).toString());
            localStorage.setItem(PROPERTIES_COUNT_KEY, data.pagination?.total_items?.toString() || '0');
            sessionStorage.setItem(PROPERTIES_SESSION_CACHE_KEY, JSON.stringify(dataToCache));
          }
          
          // Apply fresh data to state
          applyDataToState(fetched, data.pagination);
          
          // Show update notification for background updates
          if (isBackgroundUpdate) {
            console.log('✅ Recently rented properties updated with latest data');
            // You can add a toast notification here if desired
          }
        } else {
          throw new Error(data.message || 'Failed to load properties');
        }
      } catch (err) {
        console.error('Error fetching fresh recently rented properties:', err);
        if (!isBackgroundUpdate) {
          setError('Failed to load properties. Please try again.');
          if (isFirstPage) {
            setLoading(false);
          }
          setLoadingMore(false);
        }
      }
    };

    // Main execution flow
    try {
      setError(null);

      // Try to show cached data immediately
      const cachedDataShown = showCachedDataImmediately();

      if (cachedDataShown) {
        // User sees cached data instantly, now check for updates in background
        setTimeout(() => checkForUpdatesInBackground(), 100); // Small delay to let UI render
      } else {
        // No cached data, show loading and fetch fresh data
        if (isFirstPage) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        await fetchFreshData(false);
      }

    } catch (err) {
      console.error('Error in fetchProperties:', err);
      setError('Failed to load properties. Please try again.');
      if (isFirstPage) {
        setLoading(false);
      }
      setLoadingMore(false);
    }
  }, [appliedFilters, perPage, sortOption, applySorting, stableTempId, setIsSorted, setProperties, setCurrentPage, setTotalPages, setTotalItems, setPerPage, setHasNextPage, setHasPrevPage, setLoading, setLoadingMore, setError]);

  // Main useEffect for fetching properties - optimized dependencies
  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage, appliedFilters, sortOption, fetchProperties]); // sortOption included for backend sorting

  // Apply sorting to properties array
 

  // Sort properties before rendering - only when user changes sort option
  const getSortedProperties = useMemo(() => {
    // If user changes sort option, apply new sorting to all properties
    if (!isSorted || sortOption !== 'recently-rented') {
      return applySorting(properties);
    }
    // Otherwise return properties as-is to preserve load-more order
    return properties;
  }, [properties, sortOption, isSorted, applySorting]);

  // Preselect city and category from query parameters and apply filter
  const searchParams = useSearchParams();
  useEffect(() => {
    const qpCity = searchParams?.get('city');
    const qpCategory = searchParams?.get('category');
    
    if (qpCity) {
      updateDisplayFilter('city', qpCity);
    }
    
    if (qpCategory) {
      if (qpCategory === 'sale') {
        updateDisplayFilter('selected', { sale: true, rent: false, commercial: false });
        // Also update applied filters for query parameters
        setAppliedFilters(prev => ({
          ...prev,
          selected: { sale: true, rent: false, commercial: false }
        }));
      } else if (qpCategory === 'rent') {
        updateDisplayFilter('selected', { sale: false, rent: true, commercial: false });
        // Also update applied filters for query parameters
        setAppliedFilters(prev => ({
          ...prev,
          selected: { sale: false, rent: true, commercial: false }
        }));
      }
    }
  }, [searchParams]);
  // Remove this line as it's now handled in displayFilters
  const [showSSTC, setShowSSTC] = useState(true);


  // Debug: Log filter counts
  useEffect(() => {
    if (properties.length > 0) {
      // console.log('Filter states:', {
      //   displayFilters,
      //   appliedFilters,
      //   totalProperties: properties.length
      // });
    }
  }, [displayFilters, appliedFilters, properties]);

  // Generate unique key for properties
  const generatePropertyKey = (property, index) => {
    const propId = property._kw_meta?.id || property.id;
    if (propId) {
      return `${propId}-${index}`;
    }
    // Fallback to timestamp + index if no ID
    return `prop-${Date.now()}-${index}`;
  };

  // View More function with improved error handling
  const goToNextPage = useCallback(async () => {
    if (hasNextPage && !loadingMore) {
      setLoadingMore(true);
      try {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        // Properties will be fetched via the useEffect when currentPage changes
      } catch (error) {
        // console.error('Error loading more properties:', error);
        // Reset loading state on error
        setLoadingMore(false);
      }
      // Note: setLoadingMore(false) is handled in the useEffect when properties are loaded
    }
  }, [hasNextPage, currentPage, loadingMore]);
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
  
  useEffect(() => {
    const CACHE_KEY = 'recentlyrented_page_data';
    const CACHE_EXPIRY_KEY = 'recentlyrented_page_data_expiry';
    const SESSION_CACHE_KEY = 'recentlyrented_page_session';
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

    const fetchPageHero = async () => {
      try {
        // Check cache first
        if (typeof window !== 'undefined') {
          // First check sessionStorage for ultra-fast access
          const sessionData = sessionStorage.getItem(SESSION_CACHE_KEY);
          if (sessionData) {
            const parsedData = JSON.parse(sessionData);
            setPage(parsedData.page);
            setHeroSrc(parsedData.heroSrc);
            return;
          }

          // Then check localStorage for persistent cache
          const cachedData = localStorage.getItem(CACHE_KEY);
          const cachedExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
          const now = Date.now();

          if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
            const parsedData = JSON.parse(cachedData);
            setPage(parsedData.page);
            setHeroSrc(parsedData.heroSrc);
            // Copy to session storage for ultra-fast next access
            sessionStorage.setItem(SESSION_CACHE_KEY, cachedData);
            return;
          }
        }

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/rental-search`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // 5 minutes browser cache
          }
        });

        // Clear timeout when request completes
        clearTimeout(timeoutId);

        if (!res.ok) {
          // Try to use expired cache if API fails
          if (typeof window !== 'undefined') {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
              const parsedData = JSON.parse(cachedData);
              setPage(parsedData.page);
              setHeroSrc(parsedData.heroSrc);
            }
          }
          return;
        }
        
        const page = await res.json();
        setPage(page);
        
        let heroSrcValue = '/';
        if (page?.backgroundImage) {
          const cleanPath = page.backgroundImage.replace(/\\/g, '/');
          heroSrcValue = cleanPath.startsWith('http')
            ? cleanPath
            : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
          setHeroSrc(heroSrcValue);
        }

        // Cache the data in both localStorage and sessionStorage
        if (typeof window !== 'undefined') {
          const dataToCache = {
            page: page,
            heroSrc: heroSrcValue
          };
          const now = Date.now();
          localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
          localStorage.setItem(CACHE_EXPIRY_KEY, (now + CACHE_DURATION).toString());
          sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(dataToCache));
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('Recently rented page fetch timeout');
        }
        // On error, try to use cached data if available
        if (typeof window !== 'undefined') {
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData) {
            try {
              const parsedData = JSON.parse(cachedData);
              setPage(parsedData.page);
              setHeroSrc(parsedData.heroSrc);
            } catch (parseError) {
              console.warn('Error parsing cached recently rented page data:', parseError);
            }
          }
        }
      }
    };

    fetchPageHero();
  }, []);

  // Client-side cache initialization effect to avoid hydration errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check sessionStorage first for ultra-fast access
        const sessionData = sessionStorage.getItem('recentlyrented_page_session');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          if (parsedData.page && !page) setPage(parsedData.page);
          if (parsedData.heroSrc && parsedData.heroSrc !== '/' && (!heroSrc || heroSrc === '/')) {
            setHeroSrc(parsedData.heroSrc);
          }
          return;
        }

        // Fallback to localStorage
        const cachedData = localStorage.getItem('recentlyrented_page_data');
        const cachedExpiry = localStorage.getItem('recentlyrented_page_data_expiry');
        const now = Date.now();
        if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData.page && !page) setPage(parsedData.page);
          if (parsedData.heroSrc && parsedData.heroSrc !== '/' && (!heroSrc || heroSrc === '/')) {
            setHeroSrc(parsedData.heroSrc);
          }
          // Copy to session storage for next access
          sessionStorage.setItem('recentlyrented_page_session', cachedData);
        }
      } catch (e) {
        console.warn('Error reading cached recently rented page data in client effect:', e);
      }
    }
  }, [heroSrc,page]); // Run once on mount

  // Fetch filter options from backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setFiltersLoading(true);
        const data = await fetchFilterOptionsWithCache();
        
        if (data.success && data.data) {
          setAllPropertyTypes(data.data.propertyTypes || []);
          setAllCities(data.data.cities || []);
          setAllSubTypes(data.data.subTypes || []);
          setAllMarketCenters(data.data.marketCenters || []);
        }
      } catch (e) {
        // console.error('Error fetching filter options:', e);
      } finally {
        setFiltersLoading(false);
      }
    };
    fetchFilterOptions();
  }, [fetchFilterOptionsWithCache]);

 
  return (
    <div className="relative p-6 md:p-8 ">
    
    {/* Sticky Header */}
   
      <Header />
  
  
      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)]  z-0"></div>
  
  {/* Hero Section */}
  <div className="relative bg-gray-100 md:pb-10">
  
    <section className={`relative w-full ${showFilters ? 'h-[120vh] md:h-[125vh]' : 'h-screen md:h-screen'} text-white overflow-hidden transition-all duration-500 ease-in-out`}>
      {/* Background Image with previous blurring out and next coming in */}
      <Image
                src={heroSrc}
              alt="Recently Rented Properties Hero Background"
              layout="fill"
              sizes="100vw"
              objectPosition="center"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              className={`z-0 transition-all duration-500 object-cover ${showFilters ? 'scale-110' : 'scale-100'}` }
            />
             {/* Content */}
             <div className={`absolute ${showFilters ? 'bottom-0' : 'bottom-20'}  md:bottom-0 left-0 w-full z-10 flex flex-col items-center text-center text-white py-2 md:py-14 px-4`}>
  {/* Title */}
  <h2 className="text-3xl font-semibold md:pb-8 pb-4">
    {loading
      ? t('Loading...')
      : `${totalItems} ${t('Properties')}`}
  </h2>
  
  
  {/* Line 1 - For Sale + To Rent */}
 <div className="flex md:gap-4 gap-2 md:pb-4 pb-2">
  {/* For Sale */}
  <button
    onClick={() => updateSelectedFilter('sale')}
    className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
      displayFilters.selected.sale
        ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
        : "bg-white border-gray-300 text-black"
    }`}
  >
    {t("For Sale")}
    <span
      className={`cursor-pointer w-4 h-4 border flex items-center justify-center ${
        displayFilters.selected.sale
          ? "bg-white border-[rgb(206,32,39,255)]"
          : "border-gray-400 bg-white"
      }`}
    >
      {displayFilters.selected.sale && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
    </span>
  </button>

  {/* To Rent */}
  <button
    onClick={() => updateSelectedFilter('rent')}
    className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
      displayFilters.selected.rent
        ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
        : "bg-white border-gray-300 text-black"
    }`}
  >
    {t("To Rent")}
    <span
      className={`cursor-pointer w-4 h-4 border flex items-center justify-center ${
        displayFilters.selected.rent
          ? "bg-white border-[rgb(206,32,39,255)]"
          : "border-gray-400 bg-white"
      }`}
    >
      {displayFilters.selected.rent && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
    </span>
  </button>
</div>

{/* Line 2 - Commercial */}
<div className="mb-4">
  <button
    onClick={() => updateSelectedFilter('commercial')}
    className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
      displayFilters.selected.commercial
        ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
        : "bg-white border-gray-300 text-black"
    }`}
  >
    {t("Commercial")}
    <span
      className={`cursor-pointer w-4 h-4 border flex items-center justify-center ${
        displayFilters.selected.commercial
          ? "bg-white border-[rgb(206,32,39,255)]"
          : "border-gray-400 bg-white"
      }`}
    >
      {displayFilters.selected.commercial && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
    </span>
  </button>
</div>


  {/* Line 3 - Property Type Dropdown */}
  <div className="mb-6 w-full max-w-sm">
  <select 
    className="w-full px-4 py-2 text-black border bg-white border-gray-300 outline-none"
    value={displayFilters.propertyType === 'PROPERTY TYPE' ? '' : displayFilters.propertyType}
    onChange={(e) => {
      updateDisplayFilter('propertyType', e.target.value || 'PROPERTY TYPE');
    }}
  >
    <option value="">{t("Property Type")}</option>
    {filtersLoading ? (
      <option disabled>{t("Loading...")}</option>
    ) : (
      allPropertyTypes.map((type, idx) => (
        <option key={idx} value={type}>{type}</option>
      ))
    )}
  </select>
  </div>

  {/* Location Input */}
  <div className="mb-6 w-full max-w-4xl">
  <label className={`flex text-base ${isRTL ? 'justify-end' : 'justify-start'}`}>{t("Location")}</label>
  <select
    className="w-full bg-white px-4 py-2 text-black outline-none border border-gray-300"
    value={displayFilters.city === 'CITY' ? '' : displayFilters.city}
    onChange={(e) => {
      updateDisplayFilter('city', e.target.value || 'CITY');
    }}
  >
    <option value="">{t("Select Location")}</option>
    {filtersLoading ? (
      <option disabled>{t("Loading...")}</option>
    ) : (
      allCities.map((city, idx) => (
        <option key={idx} value={city}>{city}</option>
      ))
    )}
  </select>
</div>


  {/* More Filters Toggle */}
  <div className="my-4 ">
    <button
      onClick={toggleFilters}
      className="cursor-pointer text-white font-medium flex items-center transition-colors"
    >
      {showFilters ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t("HIDE FILTERS -")}
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t("MORE FILTERS +")}
        </>
      )}
    </button>
  </div>

  {/* Additional Filters */}
  <div
    className={`overflow-hidden transition-all md:mt-6 mt-2 duration-500 ease-in-out ${
      showFilters ? "max-h-[2000px] md:max-h-96 opacity-100" : "max-h-0 opacity-0"
    }`}
  >
    <div>
      {/* First row of dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 w-full md:w-4xl">
       
        {/* Type Dropdown */}
<div>
  <label className={`flex text-sm font-medium mb-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
    {t("Property Subtype")}
  </label>
  <select 
    className="border border-gray-300 p-2 w-full bg-white text-black"
    value={displayFilters.propertySubType}
    onChange={(e) => {
      updateDisplayFilter('propertySubType', e.target.value);
    }}
  >
    <option value="">{t("No Preference")}</option>
    {filtersLoading ? (
      <option disabled>{t("Loading...")}</option>
    ) : (
      allSubTypes.map((type, idx) => (
        <option key={idx} value={type}>{type}</option>
      ))
    )}
  </select>
</div>

{/* Min Price Dropdown */}
<div>
  <label className={`flex text-sm font-medium mb-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
    {t("Min Price")}
  </label>
  <select 
    className="border border-gray-300 p-2 w-full bg-white text-black"
    value={displayFilters.minPrice}
    onChange={(e) => {
      updateDisplayFilter('minPrice', e.target.value);
    }}
  >
    <option value="">{t("No Preference")}</option>
    {allPrices.map((price, idx) => (
      <option key={idx} value={price}> {formatPrice(price)}</option>
    ))}
  </select>
</div>

{/* Max Price Dropdown */}
<div>
  <label className={`flex text-sm font-medium mb-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
    {t("Max Price")}
  </label>
  <select 
    className="border border-gray-300 p-2 w-full bg-white text-black"
    value={displayFilters.maxPrice}
    onChange={(e) => {
      updateDisplayFilter('maxPrice', e.target.value);
    }}
  >
    <option value="">{t("No Preference")}</option>
    {allPrices.map((price, idx) => (
      <option key={idx} value={price}> {formatPrice(price)}</option>
    ))}
  </select>
</div>

      </div>


      {/* Checkboxes */}
      <div className="flex flex-col md:flex-row md:gap-6 gap-2 mb-6 justify-center items-center">
  {/* Include new homes */}
  <div className="flex flex-col gap-2">
    <span className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t("Include new homes?")}</span>
    <div className="flex gap-4">
      {/* YES Option */}
      <label
        className={`flex justify-between items-center font-semibold w-30 px-4 py-2 border cursor-pointer ${
          displayFilters.includeNewHomes
            ? "bg-[rgb(206,32,39,255)] text-white border-[rgb(206,32,39,255)]"
            : "bg-white text-black"
        }`}
      >
        <span>{t("Yes")}</span>
        <span
          className={`w-4 h-4 border bg-white flex items-center justify-center ${
            displayFilters.includeNewHomes ? "border-[rgb(206,32,39,255)]" : "border-gray-400"
          }`}
        >
          {displayFilters.includeNewHomes && (
            <FaCheck className="text-[rgb(206,32,39,255)] text-[10px]" />
          )}
        </span>
        <input
          type="checkbox"
          className="hidden"
          checked={displayFilters.includeNewHomes}
          onChange={() => {
            updateDisplayFilter('includeNewHomes', true);
          }}
        />
      </label>

      {/* NO Option */}
      <label
        className={`flex justify-between items-center w-30 font-semibold px-4 py-2  cursor-pointer ${
          !displayFilters.includeNewHomes
            ? "bg-[rgb(206,32,39,255)] text-white border-[rgb(206,32,39,255)]"
            : "bg-white text-black"
        }`}
      >
        <span>{t("No")}</span>
        <span
          className={`w-4 h-4 border bg-white flex items-center justify-center ${
            !displayFilters.includeNewHomes ? "border-[rgb(206,32,39,255)]" : "border-gray-400"
          }`}
        >
          {!displayFilters.includeNewHomes && (
            <FaCheck className="text-[rgb(206,32,39,255)] text-[10px]" />
          )}
        </span>
        <input
          type="checkbox"
          className="hidden"
          checked={!displayFilters.includeNewHomes}
          onChange={() => {
            updateDisplayFilter('includeNewHomes', false);
          }}
        />
      </label>
    </div>
  </div>

   
       
      </div>
</div>
    </div>
      {/* Search button */}
      <div className="text-center">
        <button
          className="cursor-pointer bg-[rgb(206,32,39,255)] text-white px-8 py-2 text-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          onClick={(event) => {
            // Apply filters when search button is clicked
            applyFilters();
            
            // Show a brief success message
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = t('Filters Applied!');
            button.className = 'bg-green-600 text-white px-8 py-2 text-xl font-semibold transition-colors duration-200';
            
            setTimeout(() => {
              button.textContent = originalText;
              button.className = 'bg-[rgb(206,32,39,255)] text-white px-8 py-2 text-xl font-semibold hover:bg-red-700 transition-colors duration-200';
            }, 2000);
            
            // Scroll to results section
            const resultsSection = document.querySelector('.min-h-screen');
            if (resultsSection) {
              resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {t("Search")}
        </button>
      
  </div>
  
  {/* Active Filters Summary */}
  <div className="mt-4 text-center">
    <div className="inline-flex flex-wrap gap-2 justify-center">
      {appliedFilters.selected.commercial && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Commercial Properties")}
        </span>
      )}
      {(appliedFilters.selected.sale || appliedFilters.selected.rent) && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {appliedFilters.selected.sale && appliedFilters.selected.rent ? t('Sale & Rent') : 
           appliedFilters.selected.sale ? t('For Sale Only') : t('For Rent Only')}
        </span>
      )}
      {appliedFilters.propertyType && appliedFilters.propertyType !== 'PROPERTY TYPE' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Type:")} {appliedFilters.propertyType}
        </span>
      )}
      {appliedFilters.propertySubType && appliedFilters.propertySubType !== '' && appliedFilters.propertySubType !== 'No Preference' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Subtype:")} {appliedFilters.propertySubType}
        </span>
      )}
      {appliedFilters.city && appliedFilters.city !== 'CITY' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Location:")} {appliedFilters.city}
        </span>
      )}
      {appliedFilters.minPrice && appliedFilters.minPrice !== '' && appliedFilters.minPrice !== 'No Preference' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Min:")} ﷼ {formatPrice(appliedFilters.minPrice)}
        </span>
      )}
      {appliedFilters.maxPrice && appliedFilters.maxPrice !== '' && appliedFilters.maxPrice !== 'No Preference' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Max:")} ﷼ {formatPrice(appliedFilters.maxPrice)}
        </span>
      )}
      {properties.length > 0 && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {properties.length} {t("Results")}
        </span>
      )}
    </div>
  </div>
</div>
  
    </section>
    

    <div className="min-h-screen">
      {/* Filters always inside margin */}
      <div className={`${showMap ? "md:mx-2" : "mx-6 md:mx-38"}`}>
        <div className="py-6 mt-10 gap-2 flex flex-col md:flex-row justify-start">
          <select
            className="border border-gray-400 p-2 bg-white text-black"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="recently-rented">{t("Recently Rented")}</option>
            <option value="price-desc">{t("Sort by price: high to low")}</option>
            <option value="date-desc">{t("Sort by date added")}</option>
            <option value="price-asc">{t("Sort by price: low to high")}</option>
          </select>

          <button
            className="cursor-pointer hidden md:inline-block border border-gray-400 p-2 bg-white text-black"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? t("Hide Map") : t("Map View")}
          </button>
        </div>
      </div>

      {/* Conditional rendering */}
      {showMap ? (
        // ✅ Map is outside mx-38 → takes full width
        <PropertyType />
      ) : (
        <>
          <div className="mx-6 md:mx-38">
           {/* Properties Count Display */}
  {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <PropertySkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : properties.length === 0 ? (
          <div className="flex justify-center items-center h-60">
            <span className="text-lg text-gray-500 font-semibold">{t("No properties are available.")}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedProperties.map((property, idx) => (
              <PropertyCard
                key={generatePropertyKey(property, idx)}
                property={property}
                idx={idx}
                generatePropertyKey={generatePropertyKey}
                bedIconUrl={bedIconUrl}
                bathIconUrl={bathIconUrl}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}

          </div>

          {/* View More Properties Button */}
          {hasNextPage && !loading && properties.length % perPage === 0 && (
            <div className="flex justify-center items-center my-10">
              <button
                onClick={goToNextPage}
                disabled={loadingMore}
                className={`cursor-pointer md:w-80 w-50 md:py-3 py-2 px-6 text-white text-base md:text-lg font-semibold  transition-all duration-200 shadow-lg ${
                  loadingMore 
                    ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                    : 'bg-gray-500 hover:shadow-xl'
                }`}
              >
                {loadingMore ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{t("Loading More...")}</span>
                  </div>
                ) : (
                  t('View More Properties')
                )}
              </button>
            </div>
          )}
        </>
      )}
</div>


      
    
   
    </div>
    <NewFooter />
    </div>
  );
}

// Main component that wraps PropertiesContent in Suspense
const Properties = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-[rgb(206,32,39,255)]"></div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
};

export default Properties;
