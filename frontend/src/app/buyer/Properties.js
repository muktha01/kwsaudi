
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
          {t(property?.prop_subtype || "For Sale")}
        </span>

        <p
          className="text-xl font-bold text-gray-600 mb-2 truncate"
          title={property.list_address?.address}
        >
          {property.list_address.address?.split(" ").length > 5
            ? property.list_address.address
                .split(" ")
                .slice(0, 5)
                .join(" ") + "..."
            : property.list_address.address}
        </p>

        <div className="flex justify-start items-center">
          <span className="relative w-4 h-4 mr-2">
            <Image 
              src="/currency.png"
              alt={t("currency")}
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
const PropertiesContent = () => {
  const { t, isRTL } = useTranslation();
  // Sorting state
  const [sortOption, setSortOption] = useState('price-desc');
  
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
  // Note: sale: false in appliedFilters means no sale filter is applied by default
  // This ensures all properties are shown initially, regardless of the checkbox state
  const [appliedFilters, setAppliedFilters] = useState({
    selected: { sale: false, rent: false, commercial: false },
    propertyType: 'PROPERTY TYPE',
    propertySubType: '',
    city: 'CITY',
  minPrice: '',
  maxPrice: '',
  includeNewHomes: false,
    marketCenter: 'MARKET CENTER'
  });

  // Display state for form inputs
  // Note: sale: true in displayFilters means the checkbox is checked by default
  // but it doesn't affect filtering until search button is clicked
  const [displayFilters, setDisplayFilters] = useState({
    selected: { sale: true, rent: false, commercial: false },
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
    const cacheKey = `properties-${JSON.stringify(requestBody)}-page-${page}`;
    
    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      // console.log('Using cached properties data for:', cacheKey);
      return cacheRef.current.get(cacheKey);
    }

    const res = await fetch('http://localhost:5001/api/listings/list/properties', {
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
  // Cached filter options fetch
  const fetchFilterOptionsWithCache = useCallback(async () => {
    if (filtersCache.current) {
      // console.log('Using cached filter options');
      return filtersCache.current;
    }

    const res = await fetch('http://localhost:5001/api/listings/filters');
    if (!res.ok) {
      throw new Error('Failed to fetch filter options');
    }
    
    const data = await res.json();
    filtersCache.current = data;
    return data;
  }, []);

  // Debounced apply filters to prevent excessive API calls
  const debouncedApplyFilters = useCallback(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [applyFilters]);
  
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

 

  // Apply filters function - only called when search button is clicked
  
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
  if (sortOption === 'price-desc') {
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
  useEffect(() => {
    async function fetchProperties(page = 1) {
      // Only set main loading for first page, use loadingMore for subsequent pages
      if (page === 1) {
        setLoading(true);
      }
      setError(null);
      try {
        // Prepare API request body with all filter parameters
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
          market_center: appliedFilters.marketCenter !== 'MARKET CENTER' ? appliedFilters.marketCenter : undefined
        };
        Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);
        // console.log('fetchProperties requestBody ->', JSON.stringify(requestBody));
        
        const data = await fetchPropertiesWithCache(page, requestBody);
        if (data.success) {
          let fetched = Array.isArray(data?.data) ? data.data : [];
          // Normalize and deduplicate fetched properties, include items without id by assigning a temp id
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
                // assign a deterministic stable temp id if missing
                const tempId = it._temp_id || stableTempId(it);
                it._temp_id = tempId;
                unique.push(it);
              }
            });
            return unique;
          };
          // If loading first page, replace properties; if loading next page, append
          setProperties(prev => {
            if (page === 1) {
              // For first page, apply sorting and mark as sorted
              const sorted = applySorting(normalizeAndUnique(fetched));
              setIsSorted(true);
              return sorted;
            } else {
              // For subsequent pages, just append without sorting to preserve order
              const combined = [...prev, ...fetched];
              return normalizeAndUnique(combined);
            }
          });
          // Update pagination state from API response
          if (data.pagination) {
            setCurrentPage(data.pagination.current_page);
            setTotalPages(data.pagination.total_pages);
            setTotalItems(data.pagination.total_items);
            setPerPage(data.pagination.per_page);
            setHasNextPage(data.pagination.has_next_page);
            setHasPrevPage(data.pagination.has_prev_page);
          }
        } else {
          setError(data.message || 'Failed to load properties');
        }
      } catch (err) {
        setError('Failed to load properties');
        // console.error('Error fetching properties:', err);
      } finally {
        // Only reset main loading for first page
        if (page === 1) {
          setLoading(false);
        }
        setLoadingMore(false); // Reset loadingMore state when fetch completes
      }
    }
    // Initial load: fetch all properties for page 1
    fetchProperties(currentPage);
  }, [currentPage, perPage, appliedFilters, applySorting, fetchPropertiesWithCache]); // Include dependencies

  // Apply sorting to properties array
  

  // Sort properties before rendering - only when user changes sort option
  const getSortedProperties = useMemo(() => {
    // If user changes sort option, apply new sorting to all properties
    if (!isSorted || sortOption !== 'price-desc') {
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

  // Deterministic temp id using simple hash of address/title/price
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

  // View More function with improved error handling
  const goToNextPage = useCallback(async () => {
    if (hasNextPage && !loadingMore) {
      setLoadingMore(true);
      try {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
      } catch (error) {
        // console.error('Error loading more properties:', error);
        setLoadingMore(false); // Reset loading state on error
      }
      // Note: setLoadingMore(false) will be handled in the useEffect when properties are loaded
    }
  }, [hasNextPage, currentPage, loadingMore]);
  const [heroSrc, setHeroSrc] = useState('/')
  const[page,setPage]=useState('');
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/page/slug/rental-search');
        if (!res.ok) return;
       
        
        const page = await res.json();
        // console.log(page);
        setPage(page)
        if (page?.backgroundImage) {
           const cleanPath = page.backgroundImage.replace(/\\/g, '/');
        setHeroSrc(
          cleanPath.startsWith('http')
            ? cleanPath
            : `http://localhost:5001/${cleanPath}`
        );
        }
      } catch (e) {
        // console.error('Error fetching page hero:', e);
      }
    };
    fetchPageHero();
  }, []);

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
              alt="Previous Hero Background"
              layout="fill"
              
              objectPosition="center"
              priority={true}
              sizes="100vw"
              className={`z-0 transition-all  duration-500 object-cover ${showFilters ? 'scale-110' : 'scale-100'}` }
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
