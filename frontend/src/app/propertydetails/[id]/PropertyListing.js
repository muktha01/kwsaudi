'use client'

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import { Phone, Mail, User, MessageCircle } from "lucide-react";
import { FaPhoneAlt, FaEnvelope, FaRegCalendarAlt, FaSnowflake, FaHome, FaMoneyBillWave, FaCar } from 'react-icons/fa';
import { PiMapPinLineThin } from 'react-icons/pi';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/contexts/TranslationContext';

// Lazy load components for better performance
const NewFooter = dynamic(() => import('@/components/newfooter'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse"></div>
});

const Header = dynamic(() => import('@/components/header'), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-100 animate-pulse"></div>
});



export default function PropertyListing() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);  
  const [isAtTop, setIsAtTop] = useState(true);  
  const prevScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  // Use localStorage.selectedProperty as initial value if it matches the id
  const getInitialProperty = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedProperty');
      if (stored) {
        try {
          const propertyData = JSON.parse(stored);
          if (
            (propertyData._kw_meta && String(propertyData._kw_meta.id) === String(id)) ||
            String(propertyData.id) === String(id)
          ) {
            return propertyData;
          }
        } catch {}
      }
    }
    return null;
  };
  const [property, setProperty] = useState(getInitialProperty);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const mapSectionRef = useRef(null);
  const propertyDetailsRef = useRef(null);
  const tourSectionRef = useRef(null);
  const similarSectionRef = useRef(null);
  const overviewSectionRef = useRef(null);
  const overviewContentRef = useRef(null);
  const propertyDetailsContentRef = useRef(null);
  const [similarImageIndices, setSimilarImageIndices] = useState([]);
  const [similarLoading, setSimilarLoading] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { t, isRTL } = useTranslation();
  const [brokenImages, setBrokenImages] = useState(new Set());
  // Add refs for abort controllers to cancel pending requests
  const propertyAbortController = useRef(null);
  const similarAbortController = useRef(null);

  // Add simple in-memory cache
  const cacheRef = useRef(new Map());

  // Optimized function to fetch similar properties
  const fetchSimilarProperties = useCallback(async (currentProperty) => {
    if (!currentProperty) return;
    
    // Cancel any previous similar properties request
    if (similarAbortController.current) {
      similarAbortController.current.abort();
    }
    
    // Create new abort controller
    similarAbortController.current = new AbortController();
    
    setLoadingSimilar(true);
    
    try {
      // Check cache first
      const cacheKey = `similar_${currentProperty._kw_meta?.id || currentProperty.id}`;
      if (cacheRef.current.has(cacheKey)) {
        const cachedSimilar = cacheRef.current.get(cacheKey);
        setSimilarProperties(cachedSimilar);
        setLoadingSimilar(false);
        return;
      }
      
      // Calculate price range for similar properties (±20% of current property price)
      const currentPrice = currentProperty?.current_list_price || currentProperty?.price || 0;
      const minPrice = Math.max(0, currentPrice * 0.8);
      const maxPrice = currentPrice * 1.2;

      // Add timeout
      const timeoutId = setTimeout(() => {
        similarAbortController.current?.abort();
      }, 8000); // 8 second timeout for similar properties

      const response = await fetch('http://localhost:5001/api/listings/list/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: similarAbortController.current.signal,
        body: JSON.stringify({
          property_category: currentProperty?.prop_type || currentProperty?.property_type,
          property_subtype: currentProperty?.property_subtype || currentProperty?.subtype,
          min_price: minPrice,
          max_price: maxPrice,
          limit: 6,
          page: 1,
          fields: 'basic,photos,pricing' // Only fetch essential fields for performance
        })
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter out the current property and get up to 6 similar properties
        const filtered = data.data
          .filter(p => p._kw_meta?.id !== currentProperty._kw_meta?.id)
          .slice(0, 6);
        
        setSimilarProperties(filtered);
        
        // Cache the similar properties
        cacheRef.current.set(cacheKey, filtered);
        // Limit cache size
        if (cacheRef.current.size > 50) {
          const firstKey = cacheRef.current.keys().next().value;
          cacheRef.current.delete(firstKey);
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Similar properties fetch aborted');
        return;
      }
      console.error('Error fetching similar properties:', error);
      // Don't show error to user for similar properties, just log it
    } finally {
      setLoadingSimilar(false);
    }
  }, []);

  // Memoize map data to prevent recalculation on every render
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
                   t('Property Location');
    
    // Check if we have actual coordinates (not default)
    const hasRealCoordinates = (lat !== 24.7699857 || lng !== 46.5860906) && 
                              property?.property_address?.coordinates_gp;
    
    // Use optimized Google Maps URL for faster loading
    let mapUrl;
    if (hasRealCoordinates) {
      // Use coordinates for precise location with optimized parameters
      mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    } else {
      // Fallback to address search with optimized parameters
      mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
    
    return {
      lat,
      lng,
      address,
      hasRealCoordinates,
      mapUrl
    };
  }, [property, t]);

  // Map load handlers
  const handleMapLoad = useCallback(() => {
    setMapLoading(false);
    setMapError(false);
  }, []);

  const handleMapError = useCallback(() => {
    setMapLoading(false);
    setMapError(true);
  }, []);
const [activeTab, setActiveTab] = useState('overview');
  const tabList = [
    { key: 'overview', label: t('OVERVIEW') },
    { key: 'map', label: t('MAP LOCATION') },
    { key: 'tour', label: t('360 TOUR') },
  ];
  // Reset map loading state when tab changes to map
  useEffect(() => {
    if (activeTab === 'map' && mapData) {
      setMapLoading(true);
      setMapError(false);
    }
  }, [activeTab, mapData]);

  const propertyTemplates = {
    LotsAndLand: {
      type: t("Lots And Land"),
      description: 
        t(`This exceptional {size} {measurement} plot of land in {neighborhood / area} offers a rare opportunity to secure a foothold in one of {city} most strategically
           positioned and fast-developing locations. Priced at SAR {price}, 
           the property holds remarkable potential for {residential / commercial / mixed-use} 
           development, benefiting from proximity to major transport routes, established neighborhoods, 
           and rapidly expanding urban infrastructure. Saudi Arabia’s Vision 2030 is driving unprecedented transformation in the Kingdom’s real estate sector, with a strong focus on creating modern,
            sustainable, and connected communities. This plot sits at the heart of that transformation. Whether for an immediate build or long-term investment, the land’s location offers direct access to commercial centers, educational institutions, healthcare facilities, and leisure destinations.`),
      fields: ["size",'measurement', "neighborhood / area", "city", "price"]
    },
  
    villa: {
      type: t("Villa"),
      description: 
        t(`This beautifully designed {bedrooms}-bedroom villa in {neighborhood / area} captures the essence of modern Saudi living — a balance of 
          elegance, comfort, and functionality. Spanning {size} {measurement} and built in {year built}, it offers spacious living areas, natural 
          light, and privacy. Priced at SAR {price}.`),
      fields: ["bedrooms", "size",'measurement', "year built", "neighborhood / area", "city", "price"]
    },
  
    residential: {
      type: t("Residential"),
      description: 
        t(`This thoughtfully crafted residential property in {neighborhood / area} combines practicality, style, and strategic location. Offering {bedrooms} bedrooms, {bathrooms} bathrooms, and {size} {measurement} of living space, built in {year built}. Priced at SAR {price}.`),
      fields: ["bedrooms", "bathrooms",'measurement',  "size", "year built", "neighborhood / area", "city", "price"]
    },
  
    Commercial: {
      type: t("Commercial"),
      description: 
        t(`An exceptional {residential / commercial / mixed-use} building in {neighborhood / area}, spanning {size} {measurement}. Built in {year built} and priced at SAR {price}. Strategically located in {city}.`),
      fields: ["usageType", "size", 'measurement', "unitsOrFloors", "year built", "neighborhood / area", "city", "price"]
    },
  
    apartment: {
      type: t("Apartment"),
      description: 
        t(`This stylish {bedrooms}-bedroom apartment in {neighborhood / area} spans {size} {measurement}, completed in {year built}. Designed for functionality and comfort. Priced at SAR {price}, located in {city}.`),
      fields: ["bedrooms", "size",'measurement',  "year built", "neighborhood / area", "city", "price"]
    },
  
    floor: {
      type: t("Floor"),
      description: 
        t(`This {size} {measurement} floor in {neighborhood / area} offers {bedrooms} bedrooms and {bathrooms} bathrooms. Built in {year built}, priced at SAR {price}.`),
      fields: ["size",'measurement',  "bedrooms", "bathrooms", "year built", "neighborhood / area", "city", "price"]
    },
  
    farm: {
      type: t("Farm"),
      description: 
        t(`This {size} {measurement} farm in {neighborhood / area} offers natural beauty, agricultural potential, and investment value. Priced at SAR {price}, near {nearestCity}.`),
      fields: ["size",'measurement', "neighborhood / area", "nearestCity", "price"]
    },
  
    factory: {
      type: t("Factory"),
      description: 
        t(`This {size} {measurement} industrial facility in {neighborhood / area} is ideal for manufacturing, warehousing, or logistics. Built in {year built}, priced at SAR {price}. Includes {key features such as high ceilings, loading bays, office areas}.`),
      fields: ["size", 'measurement', "neighborhood / area", "year built", "price", "features"]
    },
  
    resthouse: {
      type: t("Rest House"),
      description: 
        t(`Set on {size} {measurement} in {neighborhood / area}, this rest house is ideal for leisure and gatherings. Features {gardens, shaded areas, swimming pool, outdoor seating}. Priced at SAR {price}.`),
      fields: ["size",'measurement', "neighborhood / area", "price", "features"]
    },
  
    warehouse: {
      type: t("Warehouse"),
      description: 
        t(`This {size} {measurement} warehouse in {neighborhood / area} offers space for storage, distribution, or commercial use. Built in {year built}, priced at SAR {price}. Includes {features such as loading docks, high ceilings, 24/7 security}.`),
      fields: ["size", 'measurement', "neighborhood / area", "year built", "price", "features"]
    }
  };
  

  // Add this useEffect to reset image indices and loading states for similar properties
  useEffect(() => {
    setSimilarImageIndices(Array(similarProperties.length).fill(0));
    setSimilarLoading(Array(similarProperties.length).fill(false));
  }, [similarProperties]);

  useEffect(() => {  
    const handleScroll = () => {  
      const currentScrollY = window.scrollY;  

      // At the very top  
      if (currentScrollY < 10) {  
        setIsAtTop(true);  
        setIsVisible(true);  
        return;  
      } else {  
        setIsAtTop(false);  
      }  

      // Scrolling down → Hide header  
      if (currentScrollY > prevScrollY.current) {  
        setIsVisible(false);  
      }  
      // Scrolling up → Show header  
      else {  
        setIsVisible(true);  
      }  

      prevScrollY.current = currentScrollY;  
    };  

    window.addEventListener('scroll', handleScroll, { passive: true });  
    return () => window.removeEventListener('scroll', handleScroll);  
  }, []);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Cancel all pending requests on unmount
      if (propertyAbortController.current) {
        propertyAbortController.current.abort();
      }
      if (similarAbortController.current) {
        similarAbortController.current.abort();
      }
    };
  }, []);
  useEffect(() => {
    async function fetchPropertyById() {
      if (!id) return;
      
      // Cancel any previous request
      if (propertyAbortController.current) {
        propertyAbortController.current.abort();
      }
      
      // Create new abort controller
      propertyAbortController.current = new AbortController();
      
      try {
        setPageLoading(true);
        
        // Check cache first
        const cacheKey = `property_${id}`;
        if (cacheRef.current.has(cacheKey)) {
          const cachedData = cacheRef.current.get(cacheKey);
          setProperty(cachedData);
          // Still fetch similar properties in background
          fetchSimilarProperties(cachedData);
          setPageLoading(false);
          return;
        }
        
        // Add timeout to the request
        const timeoutId = setTimeout(() => {
          propertyAbortController.current?.abort();
        }, 10000); // 10 second timeout
        
        // Fetch property by ID from backend with optimized fields
        const response = await fetch(`http://localhost:5001/api/listings/property/${id}?fields=basic,photos,address,agent,pricing`, {
          signal: propertyAbortController.current.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Property fetch response:', { success: data.success, id });
        
        if (data.success && data.data) {
          setProperty(data.data);
          // Cache the data
          cacheRef.current.set(cacheKey, data.data);
          // Limit cache size to prevent memory issues
          if (cacheRef.current.size > 50) {
            const firstKey = cacheRef.current.keys().next().value;
            cacheRef.current.delete(firstKey);
          }
          
          // Fetch similar properties in parallel (non-blocking)
          fetchSimilarProperties(data.data);
        } else {
          // Try to get from localStorage as fallback
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('selectedProperty');
            if (stored) {
              const propertyData = JSON.parse(stored);
              if (
                (propertyData._kw_meta && String(propertyData._kw_meta.id) === String(id)) ||
                String(propertyData.id) === String(id)
              ) {
                setProperty(propertyData);
                fetchSimilarProperties(propertyData);
              } else {
                console.error('Property not found with ID:', id);
              }
            } else {
              console.error('Property not found with ID:', id);
            }
          } else {
            console.error('Property not found with ID:', id);
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Property fetch aborted');
          return;
        }
        console.error('Error fetching property:', error);
        
        // Fallback to localStorage on network error
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('selectedProperty');
          if (stored) {
            try {
              const propertyData = JSON.parse(stored);
              if (
                (propertyData._kw_meta && String(propertyData._kw_meta.id) === String(id)) ||
                String(propertyData.id) === String(id)
              ) {
                setProperty(propertyData);
                fetchSimilarProperties(propertyData);
              }
            } catch (parseError) {
              console.error('Error parsing stored property:', parseError);
            }
          }
        }
      } finally {
        setPageLoading(false);
      }
    }

    fetchPropertyById();
    
    // Cleanup function
    return () => {
      if (propertyAbortController.current) {
        propertyAbortController.current.abort();
      }
    };
  }, [id, fetchSimilarProperties]);
  
  // Optimized function to fetch similar properties
 

 

  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+974',
    phone: '',
    message: property ? t(`I'm interested in ${property?.prop_type || t("this property")}. Please provide me more details about this property.`) : t('I am interested in this property.')
  });

  // Fallback image path
  const FALLBACK_IMAGE = "/propertyfallbackimage.jpg";

  // Use property images (sanitized) or fallback
  const propertyImages = useMemo(() => {
    const urls = (property?.photos || [])
      .map((photo) => photo?.ph_url)
      .filter((url) => typeof url === 'string' && url.trim().length > 0);
    return urls.length ? urls : [FALLBACK_IMAGE];
  }, [property]);

  // Use property images for thumbnails or fallback
  const thumbnailImages = propertyImages.slice(0, 8);

  // Tab state
  

  function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-600 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7.5 12.086l7.793-7.793a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(t('Enquiry submitted successfully!'));
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    if (key === 'overview' && overviewContentRef.current) {
    
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    if (key === 'property details' && propertyDetailsContentRef.current) {
     
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (activeTab === 'map' && mapSectionRef.current) {
      const yOffset = -130; 
      const y = mapSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  
    if (activeTab === 'tour' && tourSectionRef.current) {
      const yOffset = -100;
      const y = tourSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    if (activeTab === 'similar properties' && similarSectionRef.current) {
      const yOffset = -100;
      const y = similarSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeTab]);
  

  if (pageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t("Error: Property ID not found")}</h1>
        <p className="text-gray-700">{t("The property you are looking for does not exist or the link is invalid.")}</p>
      </div>
    );
  }

  // Show loading state while fetching data
  if (pageLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(179,4,4)]"></div>
          <p className="text-gray-600 text-lg">{t("Loading property details...")}</p>
        </div>
      </div>
    );
  }

  // Only show 'Property Not Found' if loading is done and property is still null
  if (!pageLoading && !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t("Property Not Found")}</h1>
        <p className="text-gray-700 mb-4">{t(`The property with ID \"${id}\" could not be found.`)}</p>
        <button
          onClick={() => router.back()}
          className="bg-[rgb(179,4,4)] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("Go Back")}
        </button>
      </div>
    );
  }

  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper function to get property type display
  const getPropertyTypeDisplay = () => {
    const beds = property?.total_bed || property?.beds || 0;
    const type = property?.prop_type || property?.property_type || t('Property');
    return t(`${beds} bed ${type}`);
  };

  // Helper function to get property status
  const getPropertyStatus = () => {
    if (property?.status) return t(property?.status);
    if (property?.list_type === 'rent') return t('For Rent');
    if (property?.list_type === 'sale') return t('For Sale');
    return t('Active'); // This already uses t() but I will double check the ar.json for its translation
  };

  // Helper function to get property images
  const getPropertyImages = (property) => {
    const fallbackImages = [
      "/propertyfallbackimage.jpg"
    ];
    return property?.photos?.map(photo => photo.ph_url) || fallbackImages;
  };

  // Helper function to get property address
  const getPropertyAddress = (property) => {
    return property?.list_address?.address || 
           property?.property_address || 
           property?.address || 
           property?.full_address || 
           t('Address not available');
  };

  // Helper to get agent info for modal
  const agent = {
    name: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
    fullName: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
    email: property?.list_agent_office?.list_office_email || property?.agent_email || '',
    image: (property?.list_agent_office?.list_agent_url && /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(property?.list_agent_office?.list_agent_url)) ? property?.list_agent_office?.list_agent_url : '/avtar.jpg',
  };

  
  return (
    <div>
    <div className="relative p-6 md:p-8">
      <Header />
      <div className="absolute top-0 left-0 w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(179,4,4)] z-0"></div>
      
      <div ref={overviewSectionRef} className='relative bg-gray-100'>
        {/* Hero Section */}
        <div className="relative min-h-[40vh] sm:min-h-[60vh] w-full px-4 md:px-36">
          {/* Back to Search and Price */}
          <div className="w-full flex flex-col items-start gap-0 mb-2 sm:mb-4 md:mb-6">
            <div className="flex items-center gap-0 mt-30  md:mt-30 md:gap-3  py-1 ">
              <button
                onClick={() => {
                  router.back();
                }}
                className="flex items-center gap-1 text-[rgb(179,4,4)] hover:bg-gray-100  py-1 "
              >
                <FaChevronLeft className="w-2 h-2 md:w-3 md:h-3" />
                <span className={`text-sm md:text-base font-medium ${isRTL ? 'pr-1' : 'pl-1'}`}>
                  {t("Back to Search")}
                </span>
              </button>
            </div>
            <p className='mt-2 md:mt-4 text-sm sm:text-base font-medium md:text-base text-[rgb(179,4,4)]'>   {t(property?.list_status || "Unknown Status")}</p>
            <p className="text-2xl sm:text-xl md:text-3xl font-semibold text-gray-800 mt-2">{property?.list_address.address || property?.property_address || property?.address || property?.full_address || t('Address not available')}</p>
            <h1 className="text-lg sm:text-xl md:text-xl mt-1 font-semibold text-gray-800">
            <div className="flex items-center gap-1">
  <span className="relative w-4 h-4">
   <Image 
      src="/currencysuadi.png"   // 👈 replace with your currency image path
      alt={t("currency")}
      fill
      className="object-contain"
    />
  </span>

  <span>
    {property?.price
      ? formatPrice(property.price)
      : property?.current_list_price
      ? formatPrice(property.current_list_price)
      : ""}
  </span>
</div>

  {property?.rental_price ? t(` ﷼ ${formatPrice(property.rental_price)}`) : ""}
</h1>
          </div>

          {/* Main Content */}
          <div className="w-full flex flex-col lg:flex-row justify-between gap-2 md:gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[16/9] md:aspect-[16/9]">
  <Image
    src={brokenImages.has(propertyImages[currentImageIndex]) ? FALLBACK_IMAGE : propertyImages[currentImageIndex]}
    alt={t("Property")}
    fill
    className="object-cover"
    onClick={() => setIsFullscreen(true)}
    style={{ zIndex: 1 }}
    onError={() => {
      const failed = propertyImages[currentImageIndex];
      setBrokenImages((prev) => {
        const next = new Set(prev);
        next.add(failed);
        return next;
      });
    }}
  />



              {/* Arrows */}
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={`cursor-pointer absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 bg-[rgb(179,4,4)] p-1 md:p-2 shadow-lg z-30`}
                    style={{ zIndex: 30 }}
                  >
                    <FaChevronLeft className={`w-6 h-6 md:w-10 md:h-10 text-white ${isRTL ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={nextImage}
                    className={`cursor-pointer absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 bg-[rgb(179,4,4)]  p-1 md:p-2 shadow-lg z-30`}
                    style={{ zIndex: 30 }}
                  >
                    <FaChevronRight className={`w-6 h-6 md:w-10 md:h-10 text-white ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}

              {/* Dots for Mobile */}
              <div className="sm:hidden absolute  bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {propertyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 md:w-3 md:h-3  border rounded-full border-white transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {isFullscreen && (
  <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
    {/* Close Button */}
    <button
      onClick={() => {
        setIsFullscreen(false);
        setZoom(1);
      }}
      className="absolute top-4 right-4 text-white text-2xl"
    >
      <FaTimes />
    </button>

    {/* Image with Zoom */}
    <div className="relative max-w-[90%] max-h-[90%] overflow-hidden flex items-center justify-center">
      <Image
        src={brokenImages.has(propertyImages[currentImageIndex]) ? FALLBACK_IMAGE : propertyImages[currentImageIndex]}
        alt={t("Fullscreen Property Image")}
        width={1200}
        height={800}
        className="object-contain transition-transform duration-200"
        style={{
          transform: zoom === 1 ? "none" : `scale(${zoom})`, // ✅ no scaling by default
          cursor: zoom > 1 ? "grab" : "zoom-in",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        onWheel={(e) => {
          if (e.deltaY < 0) setZoom((z) => Math.min(z + 0.2, 3));
          else setZoom((z) => Math.max(z - 0.2, 1));
        }}
        onError={() => {
          const failed = propertyImages[currentImageIndex];
          setBrokenImages((prev) => {
            const next = new Set(prev);
            next.add(failed);
            return next;
          });
        }}
      />
    </div>

    {/* Navigation Arrows */}
    {propertyImages.length > 1 && (
      <>
        <button
          onClick={prevImage}
          className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-white text-3xl`}
        >
          <FaChevronLeft className={`${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={nextImage}
          className={`absolute ${isRTL ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 text-white text-3xl`}
        >
          <FaChevronRight className={`${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </>
    )}
  </div>
)}


            {/* Thumbnail Grid */}
            
            <div className="hidden sm:flex flex-col gap-2 overflow-y-auto ml-6 overflow-x-hidden scrollbar-hide aspect-[16/9] md:aspect-[16/9]">
              <div className="grid grid-cols-2 gap-2">
                {thumbnailImages.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square cursor-pointer border-2 transition-all duration-200 overflow-hidden ${index === currentImageIndex ? 'border-[rgb(179,4,4)]' : 'border-gray-200'}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <Image
                      src={brokenImages.has(image) ? FALLBACK_IMAGE : image}
                      alt={t(`Property view ${index + 1}`)}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={() => {
                        setBrokenImages((prev) => {
                          const next = new Set(prev);
                          next.add(image);
                          return next;
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Buttons */}
        <div className="z-40 mt-6 py-4 md:px-36  md:mt-10 flex justify-start overflow-x-auto scrollbar-hide bg-gray-100">
          <div className="flex min-w-full md:min-w-0 gap-1 md:gap-2">
            {tabList.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`cursor-pointer flex-shrink-0 w-30 md:w-auto px-2 md:px-8 py-1 md:py-2 font-bold text-xs md:text-sm lg:text-base border-b-4 uppercase tracking-wide ${
                  activeTab === tab.key
                    ? 'border-[rgb(179,4,4)] bg-white text-[rgb(179,4,4)]'
                    : 'border-transparent bg-gray-400 text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 justify-between md:gap-8 px-6 md:px-36">
        <div className="w-full md:w-2/3 ">
          
          {/* OVERVIEW TAB CONTENT */}
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <div className="mt-4 md:mt-8">
                <h2 className="font-bold text-lg text-gray-800 sm:text-lg md:text-2xl flex items-center gap-2">
                  {t("Property Description")}
                </h2>
              </div>

              {(property?.description || property?.long_description || '').length > 200 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 md:mt-4 text-indigo-600 text-xs sm:text-sm md:text-base font-semibold hover:text-indigo-800 transition-colors"
                >
                  {showFullDescription ? t('Show Less') : t('Show More')}
                </button>
              )}

              <div className="mt-4 md:mt-10" ref={propertyDetailsRef}>
                <div ref={propertyDetailsContentRef}></div>
                <div className="min-h-screen bg-white  flex justify-center">
                  <div className="w-full">
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-lg font-medium">
                      
                      {/* Left column */}
                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.list_address.city ||t('Not specified')}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {t("Year Built:")} {property?.year_built || t('Not specified')}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.total_bed || property?.total_bed || t('Not specified')} {t("Bedrooms")}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {t("Acre")} {property.lot_size_area || 0} {t(property.lot_size_units || "units")}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.total_bath || property?.total_bath || t('Not specified')} {t('Bathrooms')}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {t(property?.prop_subtype || property?.prop_subtype || t('Not specified'))}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                       {t(property?.prop_type || property?.property_type || t('Not specified'))}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {t(property?.list_type || t('Not specified'))}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                   {t(property?.prop_subtype || property?.prop_subtype || t('Not specified'))}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {t(property?.list_category || t('Not specified'))}
                      </div>
                    </div>
                    <h1 className='text-lg my-10 font-semibold text-gray-800'>{t("Address:")} {property?.list_address.address || t('Not specified')}</h1>
                    {/* Dynamic Description based on Property Type */}
                    <div className="">
                     
                      {(() => {
  const propType = property?.prop_type || property?.property_type || '';
  const propSubtype = property?.prop_subtype || property?.subtype || '';

  // normalize strings: lowercase + remove non-alphanumeric so "Lots And Land" -> "lotsandland"
  const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

  // escape regex special chars for placeholder replacement
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let template = null;
  const normSubtype = normalize(propSubtype);
  const normType = normalize(propType);

  // try match by normalized subtype first, then type
  for (const [key, value] of Object.entries(propertyTemplates)) {
    if (normalize(key) === normSubtype) {
      template = value;
      break;
    }
  }
  if (!template) {
    for (const [key, value] of Object.entries(propertyTemplates)) {
      if (normalize(key) === normType) {
        template = value;
        break;
      }
    }
  }

  if (template) {
    // Replace template placeholders with actual property data
    let description = template.description;
    const fields = template.fields || [];

    fields.forEach(field => {
      let value = '';
      switch (field) {
        case 'size':
          value = property?.lot_size_area || '0';
          break;
        case 'neighborhood / area':
          value = property?.list_address?.full_street_address || property?.list_address?.address || t('N/A');
          break;
        case 'city':
          value = property?.list_address?.city || property?.city || t('N/A');
          break;
        case 'price':
          value = formatPrice(property?.price || property?.current_list_price || 0);
          break;
        case 'developmentType':
          value = property?.list_type === 'rent' ? t('rental') : t('residential');
          break;
        case 'bedrooms':
          value = property?.total_bed || property?.beds || t('N/A');
          break;
        case 'year built':
          value = property?.year_built || t('N/A');
          break;
        case 'bathrooms':
          value = property?.total_bath || property?.baths || t('N/A');
          break;
        case 'usageType':
          value = property?.list_type === 'rent' ? t('rental') : t('commercial');
          break;
        case 'measurement':
          value = property?.lot_size_units || t('N/A');
          break;
        case 'industrialArea':
          value = property?.list_address?.city || property?.city || t('industrial area');
          break;
        case 'features':
          value = Array.isArray(property?.amenities) ? property.amenities.map(amenity => t(amenity)).join(', ') : property?.amenities || property?.features || t('standard features');
          break;
        case 'nearestCity':
          value = property?.list_address?.city || property?.city || t('N/A');
          break;
        default:
          value = t('N/A');
      }

      // escape placeholder before creating regex (handles fields with spaces/slashes)
      const placeholder = `{${field}}`;
      const regex = new RegExp(escapeRegExp(placeholder), 'g');
      description = description.replace(regex, value);
    });

    return (
      <div>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    );
  } else {
    // Fallback to default message
    return (
      <p className="text-gray-700 leading-relaxed">
        {t("Not Available")}
      </p>
    );
  }
})()} {/* The closing parenthesis for the immediately invoked function */}

                    </div>

                                         <div className='py-10'>
                        <p>{t("KW Listing ID:")} { property?.list_id || t('Not specified')}</p>
                        <p> {t("Estimation Provided by Keller Williams Realty, LLC")}</p>
                     </div>
                     <p className=''>
                      {property?.list_desc||t('Not Available')}
                     </p>
                  </div>
                </div>
              </div>
            </>
          )}

        

        </div>

        {/* RIGHT SIDE: Sticky Agent Box */}
        {activeTab === 'overview' && (
          <main className="flex flex-col justify-between mt-30 md:mt-34">
            <div className="sticky top-34 bg-gray-100 p-6 shadow-md w-full max-w-sm text-center">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="w-46 h-46 rounded-full overflow-hidden border-4 border-white mt-[-90px] mb-4">
                  <Image
                    src={
                      property.list_agent_office?.list_agent_url ||
                      property.agent_photo ||
                      "/avtar.jpg"
                    }
                    alt={t("Agent")}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

            {/* Content */}
            <div className="mt-4">
              <p className="text-2xl font-medium text-gray-600">
                {t("To discuss this property please contact")} <br />
                <span className="font-semibold">{property.list_agent_office?.list_agent_full_name
                  || property.list_agent_full_name || t('Agent Name')}</span> {t("on:")}
              </p>

              <p className="my-8 text-gray-900 font-medium">
              {property.list_agent_office?.list_office_email || property.agent_email || t('agent@kw.com')}
              </p>
              
              {/* Contact Me Button */}
              <p
               
                className="mt-4 block w-full bg-red-700 text-white py-2  hover:bg-red-800 transition"
              >
                {t("Contact Me")}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                {/* Call */}
                <a
                  href={`tel:${property.list_agent_office?.list_office_phone|| property.agent_phone || "12067392150"}`}
                  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
                >
                  <Phone className="w-6 h-6 text-gray-700" />
                  <span className="text-[0.6rem] md:text-xs mt-1">{t("Call")}</span>
                </a>

                {/* WhatsApp */}
                <a
  href={`https://wa.me/${property.list_agent_office?.list_office_phone|| "12067392150"}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
>
  <FaWhatsapp  className="w-6 h-6 text-gray-700" />
  <span className="text-[0.6rem] md:text-xs mt-1">{t("WhatsApp")}</span>
</a>


                {/* Mail */}
            <a
  href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(property.list_agent_office?.list_office_email || '')}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
  >
    <Mail className="w-6 h-6 text-gray-700" />
    <span className="text-[0.6rem] md:text-xs mt-1">{t("Mail")}</span>
  </a>

                {/* File */}
<button
  onClick={() => {
    const agentId = property?.list_agent_office?.list_kw_uid||
                  
                   property?.list_kw_uid;
    
    if (agentId) {
      const agentData = {
        name: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
        fullName: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
        email: property?.list_agent_office?.list_office_email || property?.agent_email || '',
        phone: property?.list_agent_office?.list_agent_preferred_phone || property?.agent_phone || '',
        image: (property?.list_agent_office?.list_agent_url && /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(property?.list_agent_office?.list_agent_url)) 
          ? property?.list_agent_office?.list_agent_url 
          : '/avtar.jpg',
        city: property?.list_address?.city || property?.city || '',
        office: property?.list_agent_office?.list_office_name || '',
        kw_id: property?.kw_id || property?.list_id || property?.id || '',
        _id: agentId
      };
      localStorage.setItem('selectedAgent', JSON.stringify(agentData));
      
      router.push(`/agent/${agentId}`);
    }
    // Do nothing if agentId is not found
  }}
  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
>
  <User className="w-6 h-6 text-gray-700" />
  <span className="text-[0.6rem] md:text-xs mt-1">{t("Profile")}</span>
</button>


              </div>
            </div>
          </div>

        </main>
        )}
        </div>
          {/* MAP LOCATION TAB CONTENT */}
{activeTab === "map" && (
  <div className="w-full">
    <div className="px-6 md:px-36 mt-4 md:mt-10">
      <div className="w-full h-64 md:h-80 lg:h-[400px] overflow-hidden shadow-md rounded-lg relative">
        {/* Loading state */}
        {mapLoading && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(179,4,4)] mb-4"></div>
              <p className="text-gray-600 text-sm">{t("Loading map...")}</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
            <PiMapPinLineThin className="text-[rgb(179,4,4)] text-4xl mb-4" />
            <p className="text-gray-600 text-center mb-4">
              {t("Unable to load map. Click below to view in Google Maps.")}
            </p>
            <a
              href={mapData?.hasRealCoordinates 
                ? `https://www.google.com/maps/search/?api=1&query=${mapData.lat},${mapData.lng}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapData?.address || t('Property Location'))}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[rgb(179,4,4)] text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              {t("Open in Google Maps")}
            </a>
          </div>
        )}
        
        {/* Map iframe - only render when data is available */}
        {mapData && !mapError && (
          <iframe
            src={mapData.mapUrl}
            width="100%"
            height="100%"
            style={{ 
              border: 0,
              opacity: mapLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full rounded-lg"
            title={t(`Map showing location of ${mapData.address}`)}
            onLoad={handleMapLoad}
            onError={handleMapError}
          />
        )}
      </div>
      
     
      {/* <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-start gap-3">
          <PiMapPinLineThin className="text-[rgb(179,4,4)] text-xl mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">{t("Property Location")}</h3>
            <p className="text-gray-600 mt-1">
              {property?.property_address?.full_street_address || 
               property?.list_address?.address || 
               property?.address || 
               property?.full_address || 
               t('Address not available')}
            </p>
            {property?.list_address?.city && (
              <p className="text-gray-500 text-sm mt-1">
                {property.list_address.city}, {t("Saudi Arabia")}
              </p>
            )}
            {(property?.property_address?.coordinates_gp?.lat && property?.property_address?.coordinates_gp?.lon) && (
              <p className="text-gray-400 text-xs mt-2">
                {t("Coordinates:")} {property.property_address.coordinates_gp.lat.toFixed(6)}, {property.property_address.coordinates_gp.lon.toFixed(6)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
          
            <a
              href={(() => {
                const lat = property?.property_address?.coordinates_gp?.lat || 
                           property?.coordinates_gp?.lat || 
                           property?.latitude || 
                           property?.lat;
                
                const lng = property?.property_address?.coordinates_gp?.lon || 
                           property?.coordinates_gp?.lon || 
                           property?.longitude || 
                           property?.lng;
                
                const address = property?.property_address?.full_street_address || 
                               property?.list_address?.address || 
                               property?.address || 
                               property?.full_address || 
                               t('Property Location');
                
                if (lat && lng) {
                  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                } else {
                  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                }
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-[rgb(179,4,4)] text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              {t("Open in Maps")}
            </a>
        
            <a
              href={(() => {
                const lat = property?.property_address?.coordinates_gp?.lat || 
                           property?.coordinates_gp?.lat || 
                           property?.latitude || 
                           property?.lat;
                
                const lng = property?.property_address?.coordinates_gp?.lon || 
                           property?.coordinates_gp?.lon || 
                           property?.longitude || 
                           property?.lng;
                
                const address = property?.property_address?.full_street_address || 
                               property?.list_address?.address || 
                               property?.address || 
                               property?.full_address || 
                               t('Property Location');
                
                if (lat && lng) {
                  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                } else {
                  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
                }
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-[rgb(179,4,4)] text-[rgb(179,4,4)] text-sm rounded hover:bg-red-50 transition-colors"
            >
              {t("Get Directions")}
            </a>
          </div>
        </div>
      </div> */}
    </div>
  </div>
)}

         {/* 360 TOUR TAB CONTENT */}
{activeTab === "tour" && (
  <div className="w-full">
    <div className="flex flex-col items-center justify-center px-6 md:px-36 mt-4 md:mt-10">
      

      <div className="flex flex-col items-center mx-4 w-full">
        {/* Main Image Container */}
        <div className="w-full h-64 md:h-80 lg:h-[400px]  overflow-hidden shadow-md relative mb-4 md:mb-6 cursor-pointer">
          <Image
            src={brokenImages.has(propertyImages[currentImageIndex]) ? FALLBACK_IMAGE : propertyImages[currentImageIndex]}
            alt={t("360 Virtual Tour")}
            width={1200}
            height={800}
            className="w-full h-full object-cover"
            onError={() => {
              const failed = propertyImages[currentImageIndex];
              setBrokenImages((prev) => {
                const next = new Set(prev);
                next.add(failed);
                return next;
              });
            }}
          />

<div className="absolute inset-0 flex flex-col items-center justify-center">
  <Image
    src="/360logo.png"
    alt={t("360° Overlay")}
    width={80}
    height={80}
    className="md:w-[120px] md:h-[120px]"
  />
  <p className="mt-2 text-white text-sm md:text-lg font-semibold">{t("Click here")}</p>
</div>
         
        </div>

        {/* Centered Button */}
        {/* <div className="flex justify-center w-full">
          <button
            onClick={() => {
              const fullscreenImage = propertyImages[currentImageIndex];
              if (fullscreenImage) {
                const newWindow = window.open(
                  fullscreenImage,
                  "_blank",
                  "width=1200,height=800,scrollbars=yes,resizable=yes"
                );
                if (newWindow) {
                  newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>${t("360 Virtual Tour - Full Screen")}</title>
                        <style>
                          body { 
                            margin: 0; 
                            padding: 0; 
                            background: #000; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            height: 100vh;
                            overflow: hidden;
                          }
                          img { 
                            max-width: 100%; 
                            max-height: 100vh; 
                            object-fit: contain;
                            border-radius: 8px;
                          }
                          .close-btn {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: rgba(0,0,0,0.7);
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            z-index: 1000;
                          }
                          .close-btn:hover {
                            background: rgba(0,0,0,0.9);
                          }
                        </style>
                      </head>
                      <body>
                        <button class="close-btn" onclick="window.close()">${t("Close")}</button>
                        <img src="${fullscreenImage}" alt="${t("360 Virtual Tour")}" />
                      </body>
                    </html>
                  `);
                  newWindow.document.close();
                }
              }
            }}
            className="px-4 md:px-8 py-2 md:py-3  bg-gray-400 text-white text-sm md:text-lg font-semibold shadow hover:bg-gray-500 transition"
          >
            {t("View in Full Screen")}
          </button>
        </div> */}
      </div>
    </div>
  </div>
)}
</div>
      
      <NewFooter />
    </div>
  );
}