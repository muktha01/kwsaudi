
'use client'
import React, { useState, useEffect, Suspense, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaBars, FaTimes, FaBuilding, FaChevronDown, FaChevronRight, FaChevronLeft,FaCheck  } from "react-icons/fa";
import {motion} from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

import PropertyType from '@/components/propertype'
import NewFooter from '@/components/newfooter';
import Header from '@/components/header';

// Memoized PropertyCard component for better performance
const PropertyCard = memo(({ property, index, iconUrls, formatPrice, generatePropertyKey, t, isRTL }) => {
  const handleCardClick = useCallback(() => {
    const propertyId = property._kw_meta?.id || property.id || index;
    window.location.href = `/propertydetails/${propertyId}`;
  }, [property, index]);

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    const propertyId = property._kw_meta?.id || property.id || index;
    window.location.href = `/propertydetails/${propertyId}`;
  }, [property, index]);

  return (
    <div
      key={generatePropertyKey(property, index)}
      className="bg-white shadow-2xl overflow-hidden w-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-50 md:h-60">
        <Image
          src={(() => {
            const img =
              property.image ||
              (Array.isArray(property.images) && property.images[0]) ||
              (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
              "/properysmallfalback.jpg";
            if (typeof img === 'string' && img.startsWith('http')) return img;
            if (typeof img === 'string') return `${process.env.NEXT_PUBLIC_BASE_URL}/${img.replace(/\\/g, '/')}`;
            return "/properysmallfalback.jpg";
          })()}
          alt={t(property.title || property.prop_type || "property")}
          fill
          className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Beds & Baths Overlay */}
        <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
          {/* Beds */}
          <div className="flex flex-col items-center">
            <span className="relative w-5 h-5">
              <Image src={iconUrls.bed} alt={t("bed")} fill className="object-contain invert" loading="lazy" />
            </span>
            <span className="text-xs mt-1">
              {property.total_bed || property.beds || property.bedrooms || 0}
            </span>
          </div>
      
          {/* Baths */}
          <div className="flex flex-col items-center">
            <span className="relative w-5 h-5">
              <Image src={iconUrls.bath} alt={t("bath")} fill className="object-contain invert" loading="lazy" />
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
          {t(property?.prop_subtype || "To Let")}
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

PropertyCard.displayName = 'PropertyCard';

// Skeleton Loading Component
const PropertyCardSkeleton = memo(() => (
  <div className="bg-white shadow-2xl overflow-hidden w-full animate-pulse">
    {/* Image Skeleton */}
    <div className="relative w-full h-50 md:h-60 bg-gray-300"></div>
    
    {/* Details Skeleton */}
    <div className="p-4 py-6">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-5 bg-gray-300 rounded mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
    
    {/* Button Skeleton */}
    <div className="h-12 bg-gray-300"></div>
  </div>
));

PropertyCardSkeleton.displayName = 'PropertyCardSkeleton';

// Wrapper component that uses useSearchParams
const PropertiesContent = () => {
  const { t, isRTL, language } = useTranslation();
  // Sorting state
  const [sortOption, setSortOption] = useState('price-desc');
  
  // Dynamic dropdown options from backend - memoized to prevent re-renders
  const [filterOptions, setFilterOptions] = useState({
    propertyTypes: [],
    cities: [],
    subTypes: [],
    marketCenters: [],
    loading: true
  });

  // Memoized price options to prevent recreation on every render
  const allPrices = useMemo(() => [
    32000, 45001, 80000, 120000, 200000, 325001, 500100, 750010, 1000000, 1500100,
    2500100, 3000000, 3500100, 4200000, 5001000, 10000000, 25001000, 78000000, 1140000000
  ], []);

  // Combined UI state to reduce number of state variables
  const [uiState, setUiState] = useState({
    showFilters: false,
    showMap: false,
    loading: true,
    loadingMore: false,
    error: null
  });

  // Combined pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 6,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [properties, setProperties] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  
  // Combined filter states
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
  
  // Memoized functions to prevent unnecessary re-renders
  const formatPrice = useCallback((price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  }, []);
  
  const toggleFilters = useCallback(() => {
    setUiState(prev => ({ ...prev, showFilters: !prev.showFilters }));
  }, []);

  // Reset pagination when filters change
  const resetPagination = useCallback((newPerPage = pagination.perPage) => {
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: newPerPage,
      hasNextPage: false,
      hasPrevPage: false
    });
    setProperties([]);
    setIsSorted(false);
  }, [pagination.perPage]);

  // Apply filters function - only called when search button is clicked
  const applyFilters = useCallback(() => {
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
  }, [displayFilters, resetPagination]);

  // Memoized icon URLs to prevent recreation
  const iconUrls = useMemo(() => ({
    bed: "/bed.png",
    bath: "/bath.png"
  }), []);

  // Update display filters when form inputs change
  const updateDisplayFilter = useCallback((key, value) => {
    setDisplayFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const updateSelectedFilter = useCallback((key) => {
    setDisplayFilters(prev => ({
      ...prev,
      selected: {
        ...prev.selected,
        [key]: !prev.selected[key],
      }
    }));
  }, []);
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";

  const applySorting = useCallback((propertiesArray) => {
    if (!propertiesArray?.length) return propertiesArray;
    
    let sorted = [...propertiesArray];
    switch (sortOption) {
      case 'price-desc':
        sorted.sort((a, b) => {
          const priceA = Number(a.price || a.current_list_price || a.rental_price || 0);
          const priceB = Number(b.price || b.current_list_price || b.rental_price || 0);
          return priceB - priceA;
        });
        break;
      case 'price-asc':
        sorted.sort((a, b) => {
          const priceA = Number(a.price || a.current_list_price || a.rental_price || 0);
          const priceB = Number(b.price || b.current_list_price || b.rental_price || 0);
          return priceA - priceB;
        });
        break;
      case 'date-desc':
        sorted.sort((a, b) => {
          const dateA = new Date(a.date_added || a.createdAt || 0);
          const dateB = new Date(b.date_added || b.createdAt || 0);
          return dateB - dateA;
        });
        break;
      default:
        break;
    }
    return sorted;
  }, [sortOption]);

  const stableTempId = useCallback((prop) => {
    const s = `${prop.list_address?.address || prop.address || ''}|${prop.title || prop.prop_type || ''}|${prop.current_list_price || prop.price || prop.rental_price || ''}`;
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) + h) + s.charCodeAt(i);
      h = h & h;
    }
    return `stable-${Math.abs(h)}`;
  }, []);

  // Optimized fetch properties function with better error handling
  const fetchProperties = useCallback(async (page = 1) => {
    const isFirstPage = page === 1;
    
    if (isFirstPage) {
      setUiState(prev => ({ ...prev, loading: true, error: null }));
    } else {
      setUiState(prev => ({ ...prev, loadingMore: true }));
    }

    try {
      const requestBody = {
        page: page,
        limit: pagination.perPage,
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
      
      // Remove undefined values
      Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/list/newproperties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success) {
        let fetched = Array.isArray(data?.data) ? data.data : [];
        
        // Normalize and deduplicate fetched properties
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

        setProperties(prev => {
          if (isFirstPage) {
            const sorted = applySorting(normalizeAndUnique(fetched));
            setIsSorted(true);
            return sorted;
          } else {
            const combined = [...prev, ...fetched];
            return normalizeAndUnique(combined);
          }
        });

        // Update pagination state from API response
        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.current_page,
            totalPages: data.pagination.total_pages,
            totalItems: data.pagination.total_items,
            perPage: data.pagination.per_page,
            hasNextPage: data.pagination.has_next_page,
            hasPrevPage: data.pagination.has_prev_page
          });
        }
      } else {
        throw new Error(data.message || 'Failed to load properties');
      }
    } catch (err) {
      // console.error('Error fetching properties:', err);
      setUiState(prev => ({ 
        ...prev, 
        error: 'Failed to load properties. Please try again.' 
      }));
    } finally {
      setUiState(prev => ({ 
        ...prev, 
        loading: isFirstPage ? false : prev.loading,
        loadingMore: false 
      }));
    }
  }, [appliedFilters, pagination.perPage, applySorting, stableTempId, setIsSorted, setProperties, setPagination, setUiState]);

  // Main useEffect for fetching properties - optimized dependencies
  useEffect(() => {
    fetchProperties(pagination.currentPage);
  }, [pagination.currentPage, appliedFilters, fetchProperties]); // Removed perPage from dependencies as it's included in pagination

  // Memoized sorting function to prevent unnecessary calculations
  

  // Memoized sorted properties to prevent recalculation on every render
  const sortedProperties = useMemo(() => {
    if (!isSorted || sortOption !== 'price-desc') {
      return applySorting(properties);
    }
    return properties;
  }, [properties, sortOption, isSorted, applySorting]);

  // Preselect city and category from query parameters
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
        setAppliedFilters(prev => ({
          ...prev,
          selected: { sale: true, rent: false, commercial: false }
        }));
      } else if (qpCategory === 'rent') {
        updateDisplayFilter('selected', { sale: false, rent: true, commercial: false });
        setAppliedFilters(prev => ({
          ...prev,
          selected: { sale: false, rent: true, commercial: false }
        }));
      }
    }
  }, [searchParams, updateDisplayFilter]);

  // Combined API calls for better performance
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch both filter options and page hero in parallel
        const [filtersRes, pageRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/filters`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/rental-search`)
        ]);

        // Handle filters response
        if (filtersRes.ok) {
          const filtersData = await filtersRes.json();
          if (filtersData.success && filtersData.data) {
            setFilterOptions({
              propertyTypes: filtersData.data.propertyTypes || [],
              cities: filtersData.data.cities || [],
              subTypes: filtersData.data.subTypes || [],
              marketCenters: filtersData.data.marketCenters || [],
              loading: false
            });
          }
        }

        // Handle page response
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          setPage(pageData);
          if (pageData?.backgroundImage) {
            const cleanPath = pageData.backgroundImage.replace(/\\/g, '/');
            setHeroSrc(
              cleanPath.startsWith('http')
                ? cleanPath
                : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`
            );
          }
        }

        // Set filters loading to false regardless of success
        setFilterOptions(prev => ({ ...prev, loading: false }));
      } catch (error) {
        // console.error('Error fetching initial data:', error);
        setFilterOptions(prev => ({ ...prev, loading: false }));
      }
    };

    fetchInitialData();
  }, []); // Only run once on mount

  // Utility functions - memoized for performance
  const generatePropertyKey = useCallback((property, index) => {
    const propId = property._kw_meta?.id || property.id;
    if (propId) {
      return `${propId}-${index}`;
    }
    return `prop-${Date.now()}-${index}`;
  }, []);

 

  // View More function - optimized
  const goToNextPage = useCallback(async () => {
    if (pagination.hasNextPage && !uiState.loadingMore) {
      setPagination(prev => ({ 
        ...prev, 
        currentPage: prev.currentPage + 1 
      }));
    }
  }, [pagination.hasNextPage, uiState.loadingMore]);

 
  return (
    <div className="relative p-6 md:p-8 ">
    
    {/* Sticky Header */}
   
      <Header />
  
  
      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)]  z-0"></div>
  
  {/* Hero Section */}
  <div className="relative bg-gray-100 md:pb-10">
  
    <section className={`relative w-full ${uiState.showFilters ? 'h-[120vh] md:h-[125vh]' : 'h-screen md:h-screen'} text-white overflow-hidden transition-all duration-500 ease-in-out`}>
      {/* Background Image with previous blurring out and next coming in */}
      <Image
                src={heroSrc}
              alt="Hero Background"
              fill
              objectPosition="center"
              priority={false}
              loading="lazy"
              className={`z-0 transition-all duration-500 object-cover ${uiState.showFilters ? 'scale-110' : 'scale-100'}` }
            />
             {/* Content */}
             <div className={`absolute ${uiState.showFilters ? 'bottom-0' : 'bottom-20'}  md:bottom-0 left-0 w-full z-10 flex flex-col items-center text-center text-white py-2 md:py-14 px-4`}>
  {/* Title */}
  <h2 className="text-3xl font-semibold md:pb-8 pb-4">
    {uiState.loading
      ? t('Loading...')
      : `${pagination.totalItems} ${t('Properties')}`}
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
    {filterOptions.loading ? (
      <option disabled>{t("Loading options...")}</option>
    ) : (
      filterOptions.propertyTypes.map((type, idx) => (
        <option key={idx} value={type}>{t(type)}</option>
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
    {filterOptions.loading ? (
      <option disabled>{t("Loading locations...")}</option>
    ) : (
      filterOptions.cities.map((city, idx) => (
        <option key={idx} value={city}>{t(city)}</option>
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
      {uiState.showFilters ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isRTL ? 'ml-1' : 'mr-1'}`}
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
            className={`h-5 w-5 ${isRTL ? 'ml-1' : 'mr-1'}`}
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
      uiState.showFilters ? "max-h-[2000px] md:max-h-96 opacity-100" : "max-h-0 opacity-0"
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
    {filterOptions.loading ? (
      <option disabled>{t("Loading subtypes...")}</option>
    ) : (
      filterOptions.subTypes.map((type, idx) => (
        <option key={idx} value={type}>{t(type)}</option>
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
      <div className={`flex flex-col md:flex-row md:gap-6 gap-2 mb-6 ${isRTL ? 'justify-end' : 'justify-center'} items-center`}>
  {/* Include new homes */}
  <div className={`flex flex-col gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
    <span className="font-medium">{t("Include new homes?")}</span>
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
  <div className={`mt-4 ${isRTL ? 'text-right' : 'text-center'}`}>
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
          {t("Type")}: {t(appliedFilters.propertyType)}
        </span>
      )}
      {appliedFilters.propertySubType && appliedFilters.propertySubType !== '' && appliedFilters.propertySubType !== 'No Preference' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Subtype")}: {t(appliedFilters.propertySubType)}
        </span>
      )}
      {appliedFilters.city && appliedFilters.city !== 'CITY' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Location")}: {t(appliedFilters.city)}
        </span>
      )}
      {appliedFilters.minPrice && appliedFilters.minPrice !== '' && appliedFilters.minPrice !== 'No Preference' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Min")}: ﷼ {formatPrice(appliedFilters.minPrice)}
        </span>
      )}
      {appliedFilters.maxPrice && appliedFilters.maxPrice !== '' && appliedFilters.maxPrice !== 'No Preference' && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
          {t("Max")}: ﷼ {formatPrice(appliedFilters.maxPrice)}
        </span>
      )}
      {properties.length > 0 && (
        <span className="bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-medium">
        {`${properties.length} ${t("Results")}`}
        </span>
      )}
    </div>
  </div>
</div>
  
    </section>
    

    <div className="min-h-screen">
      {/* Filters always inside margin */}
      <div className={`${isRTL ? 'mx-2 md:mx-38 text-right' : 'mx-6 md:mx-38 text-left'}`}>
        <div className={`py-6 mt-10 gap-2 flex flex-col md:flex-row justify-start`}>
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
            onClick={() => setUiState(prev => ({ ...prev, showMap: !prev.showMap }))}
          >
            {uiState.showMap ? t("Hide Map") : t("Map View")}
          </button>
        </div>
      </div>

      {/* Conditional rendering */}
      {uiState.showMap ? (
        // ✅ Map is outside mx-38 → takes full width
        <PropertyType appliedFilters={appliedFilters} />
      ) : (
        <>
          <div className="mx-6 md:mx-38">
           {/* Properties Count Display */}
  {uiState.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <PropertyCardSkeleton key={`skeleton-${idx}`} />
            ))}
          </div>
        ) : uiState.error ? (
          <div className={`text-red-500 py-10 ${isRTL ? 'text-right' : 'text-center'}`}>{t(uiState.error)}</div>
        ) : properties.length === 0 ? (
          <div className={`flex justify-center items-center h-60 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-lg text-gray-500 font-semibold">{t("No properties are available.")}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property, idx) => (
              <PropertyCard
                key={generatePropertyKey(property, idx)}
                property={property}
                index={idx}
                iconUrls={iconUrls}
                formatPrice={formatPrice}
                generatePropertyKey={generatePropertyKey}
                t={t}
                isRTL={isRTL}
              />
            ))}
            
            {/* Show skeleton cards when loading more */}
            {uiState.loadingMore && 
              Array.from({ length: 3 }).map((_, idx) => (
                <PropertyCardSkeleton key={`loading-skeleton-${idx}`} />
              ))
            }
          </div>
        )}

          </div>

          {/* View More Properties Button */}
          {pagination.hasNextPage && !uiState.loading && properties.length % pagination.perPage === 0 && (
            <div className="flex justify-center items-center py-10">
              <button
                onClick={goToNextPage}
                disabled={uiState.loadingMore}
                className={`cursor-pointer md:w-80 w-50 md:py-3 py-2 px-6 text-white text-base md:text-lg font-semibold  transition-all duration-200 shadow-lg ${
                  uiState.loadingMore 
                    ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                    : 'bg-gray-500 hover:shadow-xl'
                }`}
              >
                {uiState.loadingMore ? (
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
    <NewFooter></NewFooter>
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
