'use client'

import { FaSearch, FaBars, FaTimes, FaBuilding, FaChevronDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FaQuoteRight, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Newfooter from "@/components/newfooter";
import Header from "@/components/header";
import Image from 'next/image';
import usePageTranslation from '@/hooks/usePageTranslation';
  
import {
  UsersIcon,
  HandshakeIcon,
  DocumentTextIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../contexts/TranslationContext';


const useInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isInView, setIsInView] = useState(false);
const [pdfs, setPdfs] = useState([]);
  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef, isInView];
};

// Custom hook for counting animation
const useCountUp = (end, start = 0, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(start + (end - start) * progress);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [end, start, duration, delay, hasStarted]);

  const startAnimation = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  return [count, startAnimation];
};
const Home = () => {
  const { language, isRTL, t } = useTranslation();
  
  // Add page translation hook to ensure proper translation
  // const { language: currentLanguage, isTranslating } = usePageTranslation();
  
  const[page,setPage]=useState('');
  const [loadingPageData, setLoadingPageData] = useState(true);
  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  // Hero background images array and index state
  const [heroImages, setHeroImages] = useState([]);
  const [apiImages, setApiImages] = useState([]);
  
 
const [pdfs, setPdfs] = useState([]);
  // Define the PDF types we want to manage
  

  // Use only API images, no dummy images
  const displayedImages = useMemo(() => {
    if (apiImages.length > 0) {
      return apiImages;
    }
    // If no API images, show a single placeholder
    return ['/home.png']; // Single fallback image
  }, [apiImages]);

  // Initialize with cached data if available for instant display
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('home_page_session');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          if (parsedData.imageUrls && parsedData.imageUrls.length > 0 && !apiImages.length) {
            setApiImages(parsedData.imageUrls);
            setFirstImageLoaded(true);
            setLoaded(prev => ({ ...prev, 0: true }));
            preloadFirstImage(parsedData.imageUrls[0]);
          }
        } catch (error) {
          console.warn('Error parsing session data:', error);
        }
      }
    }
  }, [apiImages.length]); // Run only once on mount

  const [mobilePropertySearchTerm, setMobilePropertySearchTerm] = useState('');
  const [mobileAgentSearchTerm, setMobileAgentSearchTerm] = useState('');
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [isBlurring, setIsBlurring] = useState(true);
  const [prevHeroIndex, setPrevHeroIndex] = useState(null);
  const stats = [
    { value: '$532B', label1: 'Total Sales Volume', label2: 'Worldwide' },
    { value: '$1.4B', label1: 'Closed Transactions', label2: 'Worldwide' },
    { value: '1002', label1: 'Market Centers', label2: 'Worldwide' },
    { value: '191K', label1: 'Real Estate Agents', label2: 'Worldwide' },
  ];
  
  const testimonials = [
    {
      quote: t("I'm truly grateful to be part of the Keller Williams family. After God's blessings, I found real comfort in practicing brokerage under KW's umbrella. Before recent regulations, the market was unorganized, and earning commissions was often a struggle. At KW, I can achieve my goals without the stress of dealing with unreliable brokers. I look forward to seeing KW continue to grow and adapt to meet market needs."),
      name: t("Abdulrahman Al-Rajihi"),
      role: t("KW Agent"),
    },
    {
      quote: t("Keller Williams is a global leader in real estate, driven by innovation in marketing and property technology. What inspired me to join was their proven success in the U.S. market, their effectiveness in the industry, and their clear vision for shaping the Saudi real estate market."),
      name: t("Hani Al-Saadi"),
      role: t("KW Agent"),
    },
    {
      quote: t("Keller Williams is a global leader in real estate, driven by innovation in marketing and property technology. What inspired me to join was their proven success in the U.S. market, their effectiveness in the industry, and their clear vision for shaping the Saudi real estate market."),
      name: t("Hani Al-Saadi"),
      role: t("KW Agent"),
    },

  ]; const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 10000); // 20 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevHeroIndex(heroIndex);
      setHeroIndex((prev) => (prev + 1) % displayedImages.length);
    }, 5001); // 5 seconds
    return () => clearInterval(interval);
  }, [heroIndex, displayedImages.length]);

  useEffect(() => {
    setIsBlurring(true);
    const timeout = setTimeout(() => setIsBlurring(false), 800); // 0.8s blur duration
    return () => clearTimeout(timeout);
  }, [heroIndex]);

  useEffect(() => {
    if (prevHeroIndex !== null) {
      const timeout = setTimeout(() => setPrevHeroIndex(null), 800); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [prevHeroIndex]);
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };
  // Trending properties state
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  // Helper function to format numbers with commas
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  };

  // Icons for the top-right overlay on property cards
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";

  const [filterCategory, setFilterCategory] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // filtering logic
  const filteredProperties = useMemo(() => {
    if (!isClient) return properties;

    return properties.filter((property) => {
      // Get the appropriate search term based on device
      const searchTerm = typeof window !== 'undefined' && window.innerWidth >= 768 ? propertySearchTerm : mobilePropertySearchTerm;
      const searchTermLower = searchTerm.toLowerCase();

      // Search through multiple property fields
      const searchableFields = [
        property.list_address?.address || '',
        property.list_address?.city || '',
        property.list_address?.street_name || '',
        property.list_address?.state || '',
        property.list_address?.full_street_address || '',
        property.list_address?.postal_code || '',
        property.title || '',
        property.property_title || '',
        property.prop_type || '',
        property.list_category || '',
        property.price?.toString() || '',
        property.current_list_price?.toString() || ''
      ].join(' ').toLowerCase();

      // Check if search term matches any of the searchable fields
      const matchesSearch = searchTerm === '' || searchableFields.includes(searchTermLower);

      // Match list_category exactly for Sale/Rent
      let matchesCategory = true;
      if (filterCategory === 'Sale') {
        matchesCategory = property.list_category === 'For Sale';
      } else if (filterCategory === 'Rent') {
        matchesCategory = property.list_category === 'For Rent';
      }

      // Only show properties with list_status "Active"
      const isActive = property.list_status === 'Active';

      return matchesSearch && matchesCategory && isActive;
    });
  }, [properties, propertySearchTerm, mobilePropertySearchTerm, filterCategory, isClient]);

  // Fetch list of PDFs from backend
   const fetchPdfs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdf`); // call backend API
      if (!res.ok) throw new Error("Failed to fetch PDFs");
      const data = await res.json();
      setPdfs(Array.isArray(data) ? data : []);
    } catch (err) {
      // console.error(err);
     
      setPdfs([]);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const getPdfData = (pdfName) => {
    return pdfs.find((pdf) => pdf.name === pdfName);
  };

  // Handle download
  const handleDownload = async (pdfName) => {
    setLoading(true);
    try {
      let url, downloadName;
      if (language === 'ar') {
        if (pdfName === 'How to Buy a Home-Arabic') {
          url = `${process.env.NEXT_PUBLIC_API_URL}/downloads/How to Buy a Home-Arabic`;
          downloadName = 'How to Buy a Home-Arabic.pdf';
        } else {
          url = `${process.env.NEXT_PUBLIC_API_URL}/downloads/How to Sell Your Home-Arabic`;
          downloadName = 'How to Sell Your Home-Arabic.pdf';
        }
      } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/pdf/download/${pdfName}`;
        downloadName = `${pdfName}.pdf`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;
      link.click();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperties(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/listings/list/properties`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: 1,
              limit: 1000,

            }),
          }
        );

        const data = await res.json();

        let fetched = [];
        if (Array.isArray(data?.data)) {
          fetched = data.data;
        }

        // console.log("Fetched properties:", fetched.slice(0, 2));

        // ✅ update state
        setProperties(fetched);
      } catch (error) {
        // console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);


  // Email download states
  const [sellEmail, setSellEmail] = useState("");
  const [buyEmail, setBuyEmail] = useState("");
  const [sellEmailError, setSellEmailError] = useState("");
  const [buyEmailError, setBuyEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const [clear, setClear] = useState(false)

  // Animation states for the stats section
  const [statsRef, isStatsInView] = useInView({ threshold: 0.3 });
  const [count212000, startCount212000] = useCountUp(212000, 0, 2000, 500);
  const [count1100000, startCount1100000] = useCountUp(1100000, 0, 2000, 700);
  const [count4300, startCount4300] = useCountUp(4300, 0, 2000, 900);
  const [count180, startCount180] = useCountUp(180, 0, 2000, 1100);


  // Track if animations have been triggered
  const [animationTriggered, setAnimationTriggered] = useState(false);

  // Start counting animations when section comes into view (only once)
  useEffect(() => {
    if (isStatsInView && !animationTriggered) {
      // Section came into view for the first time - start animations
      setAnimationTriggered(true);
      startCount212000();
      startCount1100000();
      startCount4300();
      startCount180();
    }
  }, [isStatsInView, animationTriggered, startCount212000, startCount1100000, startCount4300, startCount180]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClear(true)
    }, 1000) // 1 second

    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    const el = scrollRef.current;

    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    checkOverflow(); // Initial check
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [properties]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowBackButton(el.scrollLeft > 0);
    };

    el.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [properties]);

  const getCardScrollStep = () => {
    const el = scrollRef.current;
    if (!el) return 300;
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const firstCard = el.querySelector('[data-card="true"]');
      if (firstCard) {
        const cardWidth = firstCard.getBoundingClientRect().width;
        const style = window.getComputedStyle(el);
        const gap = parseInt(style.columnGap || style.gap || "0", 10) || 0;
        return cardWidth + gap;
      }
    }
    return 300;
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      const step = getCardScrollStep();
      scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  }
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const step = getCardScrollStep();
      scrollRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };
  const [activeTab, setActiveTab] = useState('property');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag handlers for carousel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll-fastness multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  // Add separate state for each search input

  const [agentSearchTerm, setAgentSearchTerm] = useState('');

  const [loadedIndex, setLoadedIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loaded, setLoaded] = useState({ 0: true });
  const [stableIndex, setStableIndex] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  
  // Enhanced preload function with better cross-browser support
  const preloadFirstImage = (imageUrl) => {
    if (imageUrl && typeof window !== 'undefined') {
      return new Promise((resolve, reject) => {
        // Use native browser Image constructor, not Next.js Image component
        const img = new window.Image();
        
        // Add crossOrigin attribute for better CORS handling
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          setFirstImageLoaded(true);
          setLoaded(prev => ({ ...prev, 0: true }));
          resolve(img);
        };
        
        img.onerror = (error) => {
          console.warn('Failed to preload image:', imageUrl, error);
          // Still mark as loaded to prevent infinite loading states
          setFirstImageLoaded(true);
          setLoaded(prev => ({ ...prev, 0: true }));
          reject(error);
        };
        
        // Set timeout to prevent hanging
        setTimeout(() => {
          if (!img.complete) {
            console.warn('Image preload timeout:', imageUrl);
            setFirstImageLoaded(true);
            setLoaded(prev => ({ ...prev, 0: true }));
            resolve(img);
          }
        }, 5000);
        
        img.src = imageUrl;
      });
    }
    return Promise.resolve();
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevHeroIndex(heroIndex);
      const nextIndex = (heroIndex + 1) % displayedImages.length;
      setHeroIndex(nextIndex);
      setLoadedIndex(null); // reset before new loads
    }, 10000); // every 10s - increased from 6s for longer display time
    return () => clearInterval(interval);
  }, [heroIndex, displayedImages.length]);
 
   useEffect(() => {
    const CACHE_KEY = 'home_page_data';
    const CACHE_EXPIRY_KEY = 'home_page_data_expiry';
    const SESSION_CACHE_KEY = 'home_page_session';
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Helper function to safely access storage with fallback
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

    const fetchPageHero = async () => {
      try {
        // Only check cache if we're in the browser to avoid hydration errors
        if (typeof window !== 'undefined') {
          // First check sessionStorage for ultra-fast access within same session
          const sessionData = safeStorageAccess(sessionStorage, SESSION_CACHE_KEY);
          if (sessionData) {
            try {
              const parsedSessionData = JSON.parse(sessionData);
              if (!page || !apiImages.length) {
                setPage(parsedSessionData.page);
                setApiImages(parsedSessionData.imageUrls || []);
                if (parsedSessionData.imageUrls && parsedSessionData.imageUrls.length > 0) {
                  setLoaded(prev => ({ ...prev, 0: true }));
                  // Use the enhanced preload function
                  preloadFirstImage(parsedSessionData.imageUrls[0]).catch(() => {
                    // Fallback: mark as loaded even if preload fails
                    setFirstImageLoaded(true);
                  });
                }
              }
              setLoadingPageData(false);
              return;
            } catch (parseError) {
              console.warn('Failed to parse session data:', parseError);
              safeStorageAccess(sessionStorage, SESSION_CACHE_KEY, true, null);
            }
          }

          // Then check localStorage for persistent cache
          const cachedData = safeStorageAccess(localStorage, CACHE_KEY);
          const cachedExpiry = safeStorageAccess(localStorage, CACHE_EXPIRY_KEY);
          const now = Date.now();

          if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
            try {
              // Data is already loaded synchronously in state initialization
              // Just ensure states are consistent and save to session
              const parsedData = JSON.parse(cachedData);
              safeStorageAccess(sessionStorage, SESSION_CACHE_KEY, true, cachedData); // Cache in session for ultra-fast next access
              
              if (!page || !apiImages.length) {
                setPage(parsedData.page);
                setApiImages(parsedData.imageUrls || []);
                if (parsedData.imageUrls && parsedData.imageUrls.length > 0) {
                  setLoaded(prev => ({ ...prev, 0: true }));
                  // Use the enhanced preload function
                  preloadFirstImage(parsedData.imageUrls[0]).catch(() => {
                    // Fallback: mark as loaded even if preload fails
                    setFirstImageLoaded(true);
                  });
                }
              }
              setLoadingPageData(false);
              return;
            } catch (parseError) {
              console.warn('Failed to parse cached data:', parseError);
              // Clear corrupted cache
              safeStorageAccess(localStorage, CACHE_KEY, true, null);
              safeStorageAccess(localStorage, CACHE_EXPIRY_KEY, true, null);
            }
          }
        }

        // Only set loading state if we need to fetch from API
        setLoadingPageData(true);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-pages`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // 5 minutes browser cache
          }
        });

        clearTimeout(timeoutId);
        
        if (!res.ok) {
          // Try to use expired cache if available
          const fallbackCachedData = safeStorageAccess(localStorage, CACHE_KEY);
          if (fallbackCachedData) {
            try {
              const parsedData = JSON.parse(fallbackCachedData);
              setPage(parsedData.page);
              setApiImages(parsedData.imageUrls || []);
              // Immediately mark first image as loaded for instant display
              if (parsedData.imageUrls && parsedData.imageUrls.length > 0) {
                setLoaded(prev => ({ ...prev, 0: true }));
                preloadFirstImage(parsedData.imageUrls[0]).catch(() => {
                  setFirstImageLoaded(true);
                });
              }
            } catch (parseError) {
              console.warn('Failed to parse fallback cache:', parseError);
              setApiImages([]);
            }
          }
          setLoadingPageData(false);
          return;
        }

        const pages = await res.json();

        const activePage = Array.isArray(pages) 
          ? pages.find(p => p.status === 'published') || pages[0]
          : pages;

        if (activePage) {
          setPage(activePage);

          let imageUrls = [];
          if (activePage.backgroundImage && Array.isArray(activePage.backgroundImage) && activePage.backgroundImage.length > 0) {
            imageUrls = activePage.backgroundImage.map(imagePath =>
              imagePath.startsWith('http')
                ? imagePath
                : `${process.env.NEXT_PUBLIC_BASE_URL}/${imagePath.replace(/\\/g, '/')}`
            );
            setApiImages(imageUrls);
            // Use enhanced preload function
            if (imageUrls.length > 0) {
              setLoaded(prev => ({ ...prev, 0: true }));
              preloadFirstImage(imageUrls[0]).catch(() => {
                // Fallback: mark as loaded even if preload fails
                setFirstImageLoaded(true);
              });
            }
          } else {
            setApiImages([]);
          }

          // Cache the data in both localStorage and sessionStorage
          const dataToCache = {
            page: activePage,
            imageUrls: imageUrls
          };
          if (typeof window !== 'undefined') {
            const now = Date.now();
            safeStorageAccess(localStorage, CACHE_KEY, true, JSON.stringify(dataToCache));
            safeStorageAccess(localStorage, CACHE_EXPIRY_KEY, true, (now + CACHE_DURATION).toString());
            safeStorageAccess(sessionStorage, SESSION_CACHE_KEY, true, JSON.stringify(dataToCache)); // Session cache for ultra-fast access
          }
        }
      } catch (e) {
        console.warn('Error fetching hero data:', e);
        // On error, try to use cached data if available
        if (typeof window !== 'undefined') {
          const fallbackCachedData = safeStorageAccess(localStorage, CACHE_KEY);
          if (fallbackCachedData) {
            try {
              const parsedData = JSON.parse(fallbackCachedData);
              setPage(parsedData.page);
              setApiImages(parsedData.imageUrls || []);
              // Immediately mark first image as loaded for instant display
              if (parsedData.imageUrls && parsedData.imageUrls.length > 0) {
                setLoaded(prev => ({ ...prev, 0: true }));
                preloadFirstImage(parsedData.imageUrls[0]).catch(() => {
                  setFirstImageLoaded(true);
                });
              }
            } catch (parseError) {
              console.warn('Failed to parse error fallback cache:', parseError);
              setApiImages([]);
            }
          } else {
            setApiImages([]);
          }
        } else {
          setApiImages([]);
        }
      } finally {
        setLoadingPageData(false);
      }
    };

    fetchPageHero();
  }, [apiImages.length,page]);

  // Enhanced client-side cache initialization effect to avoid hydration errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

      try {
        // Check sessionStorage first for ultra-fast access
        const sessionData = safeStorageAccess(sessionStorage, 'home_page_session');
        if (sessionData) {
          try {
            const parsedData = JSON.parse(sessionData);
            if (parsedData.page && !page) setPage(parsedData.page);
            if (parsedData.imageUrls && parsedData.imageUrls.length > 0 && apiImages.length === 0) {
              setApiImages(parsedData.imageUrls);
              setLoaded(prev => ({ ...prev, 0: true }));
              // Use enhanced preload for immediate display
              preloadFirstImage(parsedData.imageUrls[0]).catch(() => {
                setFirstImageLoaded(true);
              });
              setLoadingPageData(false);
            }
            return;
          } catch (parseError) {
            console.warn('Failed to parse session data in client effect:', parseError);
            safeStorageAccess(sessionStorage, 'home_page_session', true, null);
          }
        }

        // Fallback to localStorage
        const cachedData = safeStorageAccess(localStorage, 'home_page_data');
        const cachedExpiry = safeStorageAccess(localStorage, 'home_page_data_expiry');
        const now = Date.now();
        if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
          try {
            const parsedData = JSON.parse(cachedData);
            if (parsedData.page && !page) setPage(parsedData.page);
            if (parsedData.imageUrls && parsedData.imageUrls.length > 0 && apiImages.length === 0) {
              setApiImages(parsedData.imageUrls);
              setLoaded(prev => ({ ...prev, 0: true }));
              // Use enhanced preload for immediate display
              preloadFirstImage(parsedData.imageUrls[0]).catch(() => {
                setFirstImageLoaded(true);
              });
              setLoadingPageData(false);
              // Copy to session storage for next access
              safeStorageAccess(sessionStorage, 'home_page_session', true, cachedData);
            }
          } catch (parseError) {
            console.warn('Failed to parse localStorage data in client effect:', parseError);
            safeStorageAccess(localStorage, 'home_page_data', true, null);
            safeStorageAccess(localStorage, 'home_page_data_expiry', true, null);
          }
        }
      } catch (e) {
        console.warn('Error reading cached data in client effect:', e);
      }
    }
  }, [apiImages.length,page]); // Run once on mount

  // Preload first image immediately when apiImages are available
  useEffect(() => {
    if (typeof window !== 'undefined' && apiImages.length > 0 && !firstImageLoaded) {
      const firstImage = new window.Image();
      firstImage.onload = () => {
        setLoaded(prev => ({ ...prev, 0: true }));
        setFirstImageLoaded(true);
      };
      firstImage.src = apiImages[0];
    }
  }, [apiImages, firstImageLoaded]);

  return (
    <div>
      <div className="relative p-6 md:p-8">

        {/* Sticky Header */}

        <Header />


        <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

        {/* Hero Section */}
        <div className="relative ">


          {/* Background Image with previous blurring out and next coming in */}

          <section className="relative w-full h-[86vh] md:h-[120vh] text-white">
            {/* Background Image Transition */}
            <div 
              className="absolute inset-0 z-0 overflow-hidden"
              style={{
                // Use a more reliable background approach for cross-browser compatibility
                backgroundColor: '#1a1a1a', // Fallback color
                // Only show background image if API images are loaded and first image is ready
                ...(apiImages.length > 0 && firstImageLoaded && {
                  backgroundImage: `url(${apiImages[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }),
                // Ensure no CSS transitions interfere
                transition: 'none',
                transform: 'translateZ(0)', // Force GPU acceleration
                willChange: 'auto'
              }}
            >
           <AnimatePresence initial={!firstImageLoaded} mode="sync">
  {[stableIndex, heroIndex]
    .filter((v, i, a) => a.indexOf(v) === i) // dedupe indices
    .map((idx) => (
      apiImages[idx] ? (  // Only render if valid image URL
        <motion.div
          key={idx}
          initial={{ 
            opacity: idx === 0 ? (firstImageLoaded ? 1 : 0) : (idx === heroIndex ? 0 : 1), 
            filter: idx === 0 ? (firstImageLoaded ? 'blur(0px)' : 'blur(15px)') : 'blur(15px)' 
          }}
          animate={{
            opacity: idx === 0 ? (firstImageLoaded ? 1 : 0) : (idx === heroIndex ? (loaded[idx] ? 1 : 0) : 1),
            filter: (idx === 0 && firstImageLoaded) || loaded[idx] ? 'blur(0px)' : 'blur(15px)',
          }}
          exit={{ opacity: idx === stableIndex ? 0 : 1 }}
          transition={{ 
            duration: idx === 0 ? (firstImageLoaded ? 0 : 1.2) : 1.2, 
            ease: 'easeInOut',
            // Ensure no delay for immediate display
            delay: 0
          }}
          className="absolute inset-0"
          onAnimationComplete={() => {
            if ((idx === heroIndex && loaded[idx]) || (idx === 0 && firstImageLoaded)) setStableIndex(heroIndex);
          }}
          style={{ 
            willChange: 'opacity, filter',
            // Enhanced browser compatibility styles
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
          }}
        >
          <Image
            src={apiImages[idx]}
            alt={t("Hero Background")}
            fill
            priority={idx === 0} // Add priority loading for first image
            className={`object-cover transition-transform duration-100 ${isRTL ? 'scale-x-[-1]' : ''}`}
            onLoadingComplete={() => {
              setLoaded((prev) => ({ ...prev, [idx]: true }));
              if (idx === 0) setFirstImageLoaded(true);
            }}
            onError={(e) => {
              console.warn(`Failed to load image at index ${idx}:`, apiImages[idx]);
              // Mark as loaded to prevent infinite loading state
              setLoaded((prev) => ({ ...prev, [idx]: true }));
              if (idx === 0) setFirstImageLoaded(true);
            }}
            // Enhanced loading strategy for cross-browser compatibility
            loading={idx === 0 ? "eager" : "lazy"}
            sizes="100vw"
            quality={85}
            unoptimized={false}
          />
        </motion.div>
      ) : null
    ))}
</AnimatePresence>



              {/* Enhanced preloader for the *next* image with better error handling */}
              <div className="hidden">
                {displayedImages[(heroIndex + 1) % displayedImages.length] && (
                  <Image
                    src={displayedImages[(heroIndex + 1) % displayedImages.length]}
                    alt={t("preload")}
                    width={1}
                    height={1}
                    onLoadingComplete={() =>
                      setLoaded((prev) => ({
                        ...prev,
                        [(heroIndex + 1) % displayedImages.length]: true,
                      }))
                    }
                    onError={() => {
                      console.warn('Failed to preload next image');
                      setLoaded((prev) => ({
                        ...prev,
                        [(heroIndex + 1) % displayedImages.length]: true,
                      }));
                    }}
                    loading="lazy"
                    unoptimized={false}
                  />
                )}
              </div>
            </div>



            <div className="absolute inset-0"></div>
            <div className="inset-0 bg-opacity-60 z-10" />
<style jsx>{`
  @media (min-width: 2000px) {
    .hero-section {
      display: flex;
      justify-content: flex-start; /* keep left aligned */
      align-items: center;         /* vertical center */
      height: 100vh;               /* take full screen height */
      width: 100%;
      position: relative;
    }

    .custom-centered {
      max-width: 600px; /* optional, keep your content tidy */
    }
  }
`}</style>


            {/* Content */}
          <div
  className={`absolute inset-0 md:top-60 top-40 custom-centered px-4 ${
    isRTL ? "md:right-36 right-6" : "md:left-36 left-6"
  }`}
>
              <div className="max-w-full  md:max-w-3xl">
               <h1
  className={`text-3xl sm:text-2xl md:text-5xl font-bold md:font-semibold mb-10 md:mb-6 leading-tight ${
    isRTL ? "text-right" : "text-left"
  }`}
>
  {t('Protect your move with a Keller')}  {t('Williams Agent')}
 
</h1>


                <p className="text-base sm:text-sm md:text-[1.1rem] font-normal mb-10 md:mb-8 max-w-full md:max-w-2xl">
              { t( "Our real estate agents are business owners, not employees, so you get more choice, time, and a better experience. Get expert advice from the largest real estate franchise in the world.")}
                </p>

                {/* Tabs */}
                <div className="w-full flex flex-col items-left">

                  {/* Tab Navigation */}
                  <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-8 text-lg sm:text-lg md:text-xl font-semibold w-fit mb-4 md:mb-6">
                    <span
                      onClick={() => setActiveTab('property')}
                      className={`pb-1 sm:pb-2 cursor-pointer border-b-4 ${activeTab === 'property' ? 'border-[rgb(206,32,39,255)]' : 'border-transparent'
                        }`}
                    >
                      {t('Find a property')}
                    </span>

                    <span
                      onClick={() => setActiveTab('agent')}
                      className={`pb-1 sm:pb-2 cursor-pointer border-b-4 ${activeTab === 'agent' ? 'border-[rgb(206,32,39,255)]' : 'border-transparent'
                        }`}
                    >
                      {t('Find an agent')}
                    </span>
                  </div>


                  {/* Desktop View */}
                  <div className="hidden md:flex md:max-w-2xl flex-col md:flex-row items-center gap-1 md:gap-1">
                    {activeTab === "property" ? (
                      <>
                        {/* Property search */}
                        {/* <div className="relative "> */}
                        {/* <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 md:text-xl text-sm" /> */}
                        <input
                          type="text"
                          value={propertySearchTerm}
                          onChange={(e) => setPropertySearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const normalizedSearch = propertySearchTerm.toLowerCase().trim(); // Normalize case
                              router.push(`/buyer?city=${encodeURIComponent(normalizedSearch)}`);
                            }
                          }}
                          placeholder={t("City, Area or Street")}
                          className="w-full md:w-85 px-4 py-2 md:py-3 bg-white shadow-lg text-black text-base md:text-xl outline-none "
                        />

                        {/* </div> */}

                        <div className="flex gap-1 md:gap-1">
                          <button
                            className="cursor-pointer bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-6 sm:px-4 md:px-6 py-3 text-base md:text-xl font-semibold"
                            onClick={() =>
                              router.push(
                                `/buyer?city=${encodeURIComponent(propertySearchTerm)}&category=sale`
                              )
                            }
                          >
                            {t('Sale')}
                          </button>
                          <button
                            className=" cursor-pointer bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-6 sm:px-4 md:px-6 py-3 text-base md:text-xl font-semibold"
                            onClick={() =>
                              router.push(
                                `/buyer?city=${encodeURIComponent(propertySearchTerm)}&category=rent`
                              )
                            }
                          >
                            {t('Rent')}
                          </button>
                         
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Agent search */}
                        <div className="relative ">
                          {/* <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 md:text-xl text-sm" /> */}
                          <input
                            type="text"
                            value={agentSearchTerm}
                            onChange={(e) => setAgentSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && agentSearchTerm.trim()) {
                                router.push(`/agent?search=${encodeURIComponent(agentSearchTerm.trim())}`);
                              }
                            }}
                            placeholder={t("Name or City")}
                            className="w-full md:w-85 px-4 py-2 md:py-3 bg-white shadow-lg text-black text-base md:text-xl outline-none "
                          />
                        </div>

                        <button
                          className=" bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-15 py-3 text-sm sm:text-base md:text-xl font-semibold mt-2 md:mt-0"
                          onClick={() => {
                            if (agentSearchTerm.trim()) {
                              router.push(`/agent?search=${encodeURIComponent(agentSearchTerm.trim())}`);
                            }
                          }}
                        >
                          {t('Search')}
                        </button>
                      </>
                    )}
                  </div>



                  {/* Mobile View */}
                  <div className="flex md:hidden  gap-1 mt-4 ">

                    {activeTab === 'property' ? (
                      <>
                        {/* Input grows to take space */}
                        <input
                          type="text"
                          value={mobilePropertySearchTerm}
                          onChange={e => setMobilePropertySearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              router.push(`/buyer?city=${encodeURIComponent(mobilePropertySearchTerm)}`)
                            }
                          }}
                          placeholder={t("City, Area or Street")}
                          className="py-3 px-2 shadow-2xl text-black  w-40  bg-white text-base outline-none"
                        />

                        {/* Buttons stay side by side */}

                        <button className="cursor-pointer bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-2 py-3 text-base font-semibold">
                          {t('Sale')}
                        </button>
                        <button className="cursor-pointer bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-2 py-3 text-base font-semibold ">
                          {t('Rent')}
                        </button>
                       

                      </>
                    ) : (
                      <>
                        <div className="flex md:hidden w-full  items-center gap-1 ">
                          {/* Input takes available width */}
                          <input
                            type="text"
                            value={mobileAgentSearchTerm}
                            onChange={e => setMobileAgentSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && mobileAgentSearchTerm.trim()) {
                                router.push(`/agent?search=${encodeURIComponent(mobileAgentSearchTerm.trim())}`);
                              }
                            }}
                            placeholder={t("Name or City")}
                            className="py-3 px-2 shadow-2xl text-black w-40  bg-white text-normal outline-none"
                          />

                          {/* Search button */}
                          <button
                            className="flex-shrink-0 bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-6 py-3 text-normal font-medium"
                            onClick={() => {
                              if (mobileAgentSearchTerm.trim()) {
                                router.push(`/agent?search=${encodeURIComponent(mobileAgentSearchTerm.trim())}`);
                              }
                            }}
                          >
                            {t('Search')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
 
        <section className="w-full bg-white py-20" ref={statsRef}>
          <div className="md:mx-40 mx-8 text-center">
            {/* Heading */}
            <motion.h2
              className="text-3xl md:text-[34px] font-semibold md:font-semibold text-gray-800"
              initial={{ opacity: 0, y: 50 }}
              animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-[rgb(206,32,39,255)] font-semibold md:font-semibold">{t('Keller Williams.')}</span>{" "}
              <span className="text-gray-600">{t('We focus on the customer not the competition.')}</span>
            </motion.h2>

            <motion.p
              className="text-gray-800 text-lg py-8"
              initial={{ opacity: 0, y: 50 }}
              animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {t('As the largest, fastest-growing real estate franchise in the world,')}
              {t('Keller Williams is at the forefront of tech, training and culture.')}
            </motion.p>

            {/* Stats with dividers */}
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-500 py-2 md:py-18">
              {/* Item 1 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-01.svg"
                    alt={t("Worldwide Associates")}
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">{count212000.toLocaleString()}</h3>
                <p className="text-gray-600 mt-4">{t('Worldwide Associates')}</p>
              </motion.div>

              {/* Item 2 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-02.svg"
                    alt={t("Global Transactions")}
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">1.1m</h3>
                <p className="text-gray-600 mt-4">{t('Global transactions per year.')}</p>
              </motion.div>

              {/* Item 3 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-03.svg"
                    alt={t("Global Exchanges")}
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">4,300</h3>
                <p className="text-gray-600 mt-4">{t('Global exchanges every day.')}</p>
              </motion.div>

              {/* Item 4 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-04.svg"
                    alt={t("Exchanges Per Hour")}
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">180</h3>
                <p className="text-gray-600 mt-4">{t('Global exchanges per hour.')}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="text-center mx-8 md:mx-0">
          <h1 className="text-2xl md:text-4xl font-semibold mb-2">
            {t('About Keller Williams')}
          </h1>


          <p className="text-base md:text-lg font-semibold py-4 md:py-4">{t('You come FIRST with Keller Williams. Your trust is our business.')}</p>
          <hr className="w-40 md:w-40 my-6 mx-auto border-[rgb(206,32,39,255)] border-2" />
          <p className="my-2 text-base md:text-lg mx-2 md:mx-40 leading-relaxed"> {t("Maya Angelou said, \"People may not remember exactly what you did, or what you said, but they will always remember how you made them feel.\" By building understanding, trust, and respect, we can do what it takes to make things happen for you. We know how to deliver a dedicated and bespoke service. We want you to know, but more importantly, feel that we are there for every step of the property journey. Because we will be. Whether you need us today, or in the coming years, we are here to serve. As your local agent, we hope to become your go-to property adviser for life. As we are also part of the global Keller Williams' family, our local hands have a global reach.")}</p>
          <p className="text-base md:text-lg font-semibold py-4 md:py-6">{t('One call could build you a better tomorrow.')}</p>

          <button className="cursor-pointer md:px-10 px-4  bg-[rgb(206,32,39,255)] text-white py-2 md:py-3 text-xs md:text-sm mt-6 md:mt-10 relative overflow-hidden group transition-all duration-300 hover:pr-10 hover:pl-10" onClick={() => router.push('/ourCulture/whyKW')}>
            <span className="inline-block md:text-base text-sm font-semibold transition-all duration-300 group-hover:-translate-x-3">
              {t('Why Choose Keller Williams')}
            </span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white group-hover:translate-x-0 translate-x-4">
              <ChevronRight className={`h-4 w-4 md:h-6 md:w-6 transition-transform duration-300 ${isRTL ? 'scale-x-[-1]' : ''}`} />
            </span>
          </button>
        </div>
        {/* </div> */}


        <div className="flex flex-col items-center justify-center my-8 md:my-20  text-center px-2  md:px-4 md:mb-30 bg-gray-100 border border-gray-100">
          <h1 className="text-2xl md:text-[2.5rem] mt-6 md:mt-10 font-bold mb-2 md:mb-4">
          <span className={`text-[rgb(206,32,39,255)] ${isRTL ? 'inline-block scale-x-[1]' : ''}`}>
  {t('Recent ')}{' '}
</span>
{t('Properties')}
          </h1>
          <h2 className="text-base md:text-xl font-semibold text-gray-600 mb-4 md:mb-6">
{t('Start your search ')}
<span
  className={`text-[rgb(206,32,39,255)] ${isRTL ? 'inline-block scale-x-[-1]' : ''}`}
>
  {t('here')}
</span>
          </h2>

          <div className="hidden md:flex  flex-col md:flex-row  gap-1 md:gap-1 ">
            <input
              type="text"
              value={propertySearchTerm}
              onChange={(e) => setPropertySearchTerm(e.target.value)}
              placeholder={t("City, Area or Street")}
              className="w-full md:w-80 px-4 py-2 md:py-3 bg-white shadow-lg text-black text-base md:text-xl outline-none "
            />
            <div className="flex gap-1 md:gap-1 w-full md:w-auto">
              <button
                onClick={() => setFilterCategory(filterCategory === "Sale" ? null : "Sale")}
                className={`flex-1 md:flex-none cursor-pointer px-4 sm:px-6 md:px-6 py-2 md:py-3 text-base md:text-xl font-semibold transition-colors ${filterCategory === "Sale"
                  ? "bg-red-950 text-white"
                  : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                  }`}
              >
                {t('Sale')}
              </button>
              <button
                onClick={() => setFilterCategory(filterCategory === "Rent" ? null : "Rent")}
                className={`flex-1 md:flex-none cursor-pointer px-4 sm:px-6 md:px-6 py-2 md:py-3 text-base md:text-xl font-semibold transition-colors ${filterCategory === "Rent"
                  ? "bg-red-950 text-white"
                  : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                  }`}
              >
                {t('Rent')}
              </button>
            </div>
          </div>


          <div className="flex md:hidden  p-2 items-center gap-1  ">
            <input
              type="text"
              value={mobilePropertySearchTerm}
              onChange={(e) => setMobilePropertySearchTerm(e.target.value)}
              placeholder={t("City, Area or Street")}
              className="py-3 px-2 shadow-2xl text-black font-normal w-40  bg-white text-base outline-none"
            />
            <button
              onClick={() => setFilterCategory(filterCategory === "Sale" ? null : "Sale")}
              className={`px-2 py-3 text-base font-semibold transition-colors ${filterCategory === "Sale"
                ? "bg-red-950 text-white"
                : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                }`}
            >
              {t('Sale')}
            </button>
            <button
              onClick={() => setFilterCategory(filterCategory === "Rent" ? null : "Rent")}
              className={`px-2 py-3 text-base font-semibold transition-colors ${filterCategory === "Rent"
                ? "bg-red-950 text-white"
                : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                }`}
            >
              {t('Rent')}
            </button>
          </div>



         {/* First Home Block */}
<div className="w-full py-10 px-4 md:px-16">
  <div>
    <div className="relative">
      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full snap-x snap-mandatory ${
          isRTL ? "flex-row-reverse" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {loadingProperties ? (
          <div className="w-full flex justify-center items-center h-40 text-lg">
            {t("Loading properties...")}
          </div>
        ) : properties.length === 0 ? (
          <div className="w-full flex justify-center items-center h-40 text-lg">
            {t("No properties found.")}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="w-full flex justify-center items-center h-40 text-lg text-center">
            <div>
              <p className="text-gray-600 mb-2">
                {t("No properties match your current filters.")}
              </p>
              <p className="text-sm text-gray-500">
                {t("Try adjusting your search terms or category selection.")}
              </p>
            </div>
          </div>
        ) : (
          filteredProperties.map((property, index) => (
            <div
              key={index}
              data-card="true"
              className="flex-shrink-0 w-[270px] md:w-[400px] border bg-white shadow-2xl border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col snap-start"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem(
                    "selectedProperty",
                    JSON.stringify(property)
                  );
                  router.push(
                    `/propertydetails/${
                      property._kw_meta?.id || property.id || index
                    }`
                  );
                }
              }}
            >
              {/* Property Image */}
              <div className="md:h-70 h-40 relative">
                {property.image ||
                (Array.isArray(property.images) && property.images[0]) ||
                (Array.isArray(property.photos) &&
                  property.photos[0]?.ph_url) ? (
                  <Image
                    src={
                      property.image ||
                      (Array.isArray(property.images) && property.images[0]) ||
                      (Array.isArray(property.photos) &&
                        property.photos[0]?.ph_url) ||
                      "/properties.jpg"
                    }
                    alt={
                      property.title || property.property_title || t("Property")
                    }
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg">
                    {t("Coming Soon!")}
                  </div>
                )}
                {/* Bed/Bath overlay */}
                <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
                  {/* Beds */}
                  <div className="flex flex-col items-center">
                    <span className="relative w-5 h-5">
                      <Image
                        src={bedIconUrl}
                        alt={t("bed")}
                        fill
                        className="object-contain invert"
                      />
                    </span>
                    <span className="text-xs mt-1">
                      {property.total_bed ||
                        property.beds ||
                        property.bedrooms ||
                        0}
                    </span>
                  </div>

                  {/* Baths */}
                  <div className="flex flex-col items-center">
                    <span className="relative w-5 h-5">
                      <Image
                        src={bathIconUrl}
                        alt={t("bath")}
                        fill
                        className="object-contain invert"
                      />
                    </span>
                    <span className="text-xs mt-1">
                      {property.total_bath ||
                        property.baths ||
                        property.bathrooms ||
                        0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4 py-6">
                <h3
                  className={`text-gray-700 text-lg flex items-center ${
                    isRTL ? "justify-end" : "justify-start"
                  }`}
                >
                  {property.beds || property.bedrooms
                    ? `${property.beds || property.bedrooms} ` +
                      t("bed") +
                      " "
                    : ""}
                  {t(property.title || property.prop_type || "Property")}
                </h3>
                <span
                  className={`text-[rgb(206,32,39,255)] text-lg font-semibold ${
                    isRTL ? "flex justify-end" : "flex justify-start"
                  }`}
                >
                  {t(property?.list_status || "To Let")}
                </span>
                <div
                  className={`flex flex-col ${
                    isRTL ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    className="text-xl font-bold text-gray-600 mb-2 truncate"
                    title={t(property.list_address?.address)}
                  >
                    {property.list_address?.address?.split(" ").length > 5
                      ? t(
                          property.list_address.address
                            .split(" ")
                            .slice(0, 5)
                            .join(" ") + "..."
                        )
                      : t(property.list_address?.address)}
                  </p>
                </div>

                <div
                  className={`flex items-center ${
                    isRTL ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`relative w-4 h-4 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  >
                    <Image
                      src="/currency.png"
                      alt={t("currency")}
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
                    {t(property.price_qualifier)}
                  </p>
                )}
              </div>

              <button className="cursor-pointer w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2">
                <span>{t("MORE DETAILS")}</span>
                <ChevronRight
                  className={`text-white w-4 h-4 transition-transform duration-300 ${
                    isRTL ? "scale-x-[-1]" : ""
                  }`}
                />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
</div>

{/* Scroll Buttons BELOW cards */}
<div className="flex justify-end gap-6 w-full px-4 md:px-16 mt-4">
  <div className="flex gap-2">
    {isRTL ? (
      <>
        {showScrollButton && (
          <button
            onClick={scrollRight}
            className="bg-white border border-gray-300 p-4 shadow-md hover:shadow-lg transition"
          >
            <ChevronRight className="cursor-pointer text-[rgb(206,32,39,255)] w-10 h-10 scale-x-[-1]" />
          </button>
        )}
        {showBackButton && (
          <button
            onClick={handleScrollLeft}
            className="bg-white border border-gray-300 p-4 shadow-md hover:shadow-lg transition"
          >
            <ChevronLeft className="cursor-pointer text-[rgb(206,32,39,255)] w-10 h-10 scale-x-[-1]" />
          </button>
        )}
      </>
    ) : (
      <>
        {showBackButton && (
          <button
            onClick={handleScrollLeft}
            className="bg-white border border-gray-300 p-4 shadow-md hover:shadow-lg transition"
          >
            <ChevronLeft className="cursor-pointer text-[rgb(206,32,39,255)] w-10 h-10" />
          </button>
        )}
        {showScrollButton && (
          <button
            onClick={scrollRight}
            className="bg-white border border-gray-300 p-4 shadow-md hover:shadow-lg transition"
          >
            <ChevronRight className="cursor-pointer text-[rgb(206,32,39,255)] w-10 h-10" />
          </button>
        )}
      </>
    )}
  </div>
</div>



        </div>





        <div className="bg-gray-100 mt-10 md:mt-0  mx-2 md:mx-10 border-gray-100   flex flex-col md:flex-row">

          {/* Mobile Version: Stacked */}
          <div className="md:hidden flex flex-col">

            {/* Overlapping Text Box */}
            <div className="bg-gray-100 md:p-4 p-8 border-gray-100">
              <p className="md:text-xl text-xl font-bold text-gray-600">
                <span className="text-[rgb(206,32,39,255)]">{t('Join us.')}</span> {t('Our dynamic energy and innovative spirit bring the best and brightest together.')}
              </p>
            </div>

            {/* Image */}
            <div className="hidden md:block relative h-[200px] w-full">
              <Image
                src="/"
                alt={t("Full Height Image")}
                fill
                className="object-cover "
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>


            {/* Left Red Box */}
            <div className="bg-[rgb(206,32,39,255)] text-white flex items-center justify-center w-full h-32">
              <p className={`md:text-xl text-xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('Want to be an ')} <br /> {t('AGENT?')}
              </p>
            </div>

            {/* Right Transparent Box */}
            <div className="bg-white/80 shadow-md p-4 w-full">
              <p className=" text-xl md:text-xl font-bold py-8 md:py-0 text-gray-800 md:leading-relaxed">
               {t("We offer the greatest rewards for")}
                <span className="text-[rgb(206,32,39,255)] font-bold"> {t("exceptional customer care.")}</span>
              </p>

              <button   onClick={() => router.push('/marketCenter')} className="mt-4 bg-[rgb(206,32,39,255)] text-white px-4 py-2  text-sm font-semibold flex items-center gap-2">
                <span className="whitespace-nowrap">{t('Market Centre Search')}</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transform scale-x-[-1]"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Laptop Version: Original Layout */}
          <div className="hidden md:flex w-full relative">
      {/* Box with half-overlap */}
      <div className="absolute top-0 z-10 bg-gray-100 p-6 w-120 border-gray-100">
        <p className={`text-3xl leading-10 font-bold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
          <span className="text-[rgb(206,32,39,255)]">{t("Join us.")}</span>{" "}
          {t("Our dynamic energy and innovative spirit bring the best and brightest together.")}
        </p>
      </div>

      {/* Background image */}
      <div className={`h-[80vh] w-screen relative ${isRTL ? "mr-70 ml-0" : "ml-70"}`}>
        <Image
          src="/4.jpg"
          alt={t("Full Height Image")}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gray-500/50"></div>
      </div>

      {/* Red box */}
      <div
        className={`absolute top-60 z-10 bg-[rgb(206,32,39,255)] text-white flex items-center justify-center w-70 h-65 ${
          isRTL ? "right-0" : "left-0"
        }`}
      >
        <p className={`text-3xl font-bold ${isRTL ? "text-right" : "text-left"}`}>
          {t("Want to be an ")} <br /> {t("AGENT?")}
        </p>
      </div>

      {/* White box with text and button */}
      <div
        className={`absolute top-60 z-10 bg-white/80 p-6 w-[700px] h-65 ${
          isRTL ? "right-70" : "left-70"
        }`}
      >
        <p className={`text-3xl mt-14 font-bold text-gray-800 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
          {t("We offer the greatest rewards for")} <br />
          <span className="text-[rgb(206,32,39,255)] font-bold">
            {t("exceptional customer care.")}
          </span>
        </p>

        <button
          onClick={() => router.push("/marketCenter")}
          className={`cursor-pointer bg-[rgb(206,32,39,255)] text-white px-6 py-3 text-base font-semibold flex items-center gap-2 ${
            isRTL ? "mr-132" : "ml-132"
          }`}
        >
          <span className="whitespace-nowrap">{t("Market Centre Search")}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${isRTL ? "" : "transform scale-x-[-1]"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>

        </div>

  <div className="flex justify-center items-stretch mx-2 md:mx-10 bg-white py-10 md:py-30 ">
  <div className="grid grid-cols-1 md:grid-cols-2 w-full ">
    {/* Left Red Box - Sell Home */}
    <div className="bg-[rgb(206,32,39,255)] text-white p-4 md:p-14 relative flex flex-col md:min-h-[4z20px] min-h-[400px]">
      {/* Content */}
      <div className="pb-24">
        <p
          className={`text-base md:text-[1.4rem] font-normal mb-2 pl-3 ${
            isRTL ? "border-r-8 pr-3" : "border-l-8 pl-3"
          } border-white`}
        >
          {t("Download guide")}
        </p>
        <h2 className="text-2xl md:text-[2.1rem] font-bold mb-4 md:mb-6">
          {t("How to sell your home")}
        </h2>
        <p className="text-base md:text-[1.1rem] mb-4 md:mb-6">
          {t(
            "The guide to selling a property will advise not only on the process but also how you can be super prepared and help to achieve the highest sale price."
          )}
        </p>
      </div>
      {/* Input Group - Responsive */}
  <div
  className={`absolute md:bottom-24 bottom-16 w-full ${
    isRTL
      ? "md:right-14 md:left-auto right-2 left-auto text-right"
      : "md:left-14 md:right-6 left-2 right-auto text-left"
  }`}
>

        <div className="hidden md:flex w-full  md:max-w-lg items-center">
          <input
            type="text"
            value={sellEmail}
            onChange={(e) => setSellEmail(e.target.value)}
            placeholder={t("Email Address")}
            className="w-full px-4 py-2 bg-white text-black text-base outline-none"
          />
          <button
            onClick={async () => {
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellEmail)) {
                setSellEmailError(t("Please enter a valid email."));
                return;
              }
              setLoading(true);
              setSellEmailError("");
              try {
                let pdfName = "pdf1";
                let emailApi = `${process.env.NEXT_PUBLIC_API_URL}/save-email`;
                if (language === "ar") {
                  pdfName = "How to Sell Your Home-Arabic";
                  emailApi = `${process.env.NEXT_PUBLIC_API_URL}/emails-arabic`;
                }
                const res = await fetch(
                  emailApi,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: sellEmail, pdfName }),
                  }
                );
                if (res.ok) {
                  handleDownload(pdfName);
                } else {
                  setSellEmailError(t("Failed to save email."));
                }
              } catch (e) {
                setSellEmailError(t("Failed to save email."));
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="cursor-pointer hover:text-black bg-black hover:bg-gray-300 text-white px-8 py-2 text-base font-semibold border-black disabled:opacity-50"
          >
            {loading ? t("Downloading...") : t("Download")}
          </button>
        </div>
      <div
  className={`flex md:hidden w-65 flex-col gap-2 ${
    isRTL ? "mr-2 text-right" : " text-left ml-2 "
  }`}
>
          <input
            type="text"
            value={sellEmail}
            onChange={(e) => setSellEmail(e.target.value)}
            placeholder={t("Email Address")}
            className="py-3 px-2 shadow-2xl text-black font-normal bg-white text-base outline-none"
          />
          <button
            onClick={async () => {
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellEmail)) {
                setSellEmailError(t("Please enter a valid email."));
                return;
              }
              setLoading(true);
              setSellEmailError("");
              try {
                let pdfName = "pdf1";
                let emailApi = `${process.env.NEXT_PUBLIC_API_URL}/save-email`;
                if (language === "ar") {
                  pdfName = "How to Sell Your Home-Arabic";
                  emailApi = `${process.env.NEXT_PUBLIC_API_URL}/emails-arabic`;
                }
                const res = await fetch(
                  emailApi,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: sellEmail, pdfName }),
                  }
                );
                if (res.ok) {
                  handleDownload(pdfName);
                } else {
                  setSellEmailError(t("Failed to save email."));
                }
              } catch (e) {
                setSellEmailError(t("Failed to save email."));
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="cursor-pointer hover:text-black bg-black hover:bg-gray-300 text-white px-8 py-2 text-base font-semibold border-black disabled:opacity-50"
          >
            {loading ? t("Downloading...") : t("Download")}
          </button>
        </div>
        {sellEmailError && (
          <div className="text-white text-sm mt-1">{sellEmailError}</div>
        )}
      </div>
    </div>

    {/* Right Image Box - Buy Home */}
    <div className="relative flex flex-col md:min-h-[420px] min-h-[400px]">
      <Image
        src="/3.jpg"
        alt={t("Home")}
        fill
        className="object-cover grayscale"
      />
      <div className="absolute inset-0 bg-gray-500/50"></div>
      <div className="absolute inset-0 bg-opacity-40 p-4 md:p-14 text-white flex flex-col h-full">
        {/* Content */}
        <div className="pb-24">
          <p
            className={`text-base  md:text-[1.4rem] font-normal mb-2 pl-3 ${
              isRTL ? "border-r-8 pr-3" : "border-l-8 pl-3"
            } border-white`}
          >
            {t("Download guide")}
          </p>
          <h2 className="text-2xl md:text-[2.1rem] font-bold mb-4 md:mb-6">
            {t("How to buy a home")}
          </h2>
          <p className="text-basemd:text-[1.1rem]  mb-4 md:mb-6">
            {t(
              "The following guide to buying a property will explain how to position yourself to negotiate the best price, but importantly ensure you are the winning bidder when up against the competition."
            )}
          </p>
        </div>
        {/* Input Group - Responsive */}
      <div
  className={`absolute md:bottom-22 bottom-16 w-full ${
    isRTL
      ? "md:right-14 md:left-auto right-2 left-auto text-right"
      : "md:left-14 md:right-6 left-2 right-auto text-left"
  }`}
>

          <div className="hidden md:flex w-full  md:max-w-lg items-center">
            <input
              type="text"
              value={buyEmail}
              onChange={(e) => setBuyEmail(e.target.value)}
              placeholder={t("Email Address")}
              className="w-full px-4 py-2 bg-white text-black text-base outline-none"
            />
            <button
              onClick={async () => {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyEmail)) {
                  setBuyEmailError(t("Please enter a valid email."));
                  return;
                }
                setLoading(true);
                setBuyEmailError("");
                try {
                  let pdfName = "pdf2";
                  let emailApi = `${process.env.NEXT_PUBLIC_API_URL}/save-email`;
                  if (language === "ar") {
                    pdfName = "How to Buy a Home-Arabic";
                    emailApi = `${process.env.NEXT_PUBLIC_API_URL}/emails-arabic`;
                  }
                  const res = await fetch(
                    emailApi,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: buyEmail, pdfName }),
                    }
                  );
                  if (res.ok) {
                    handleDownload(pdfName);
                  } else {
                    setBuyEmailError(t("Failed to save email."));
                  }
                } catch (e) {
                  setBuyEmailError(t("Failed to save email."));
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="cursor-pointer hover:text-black bg-black hover:bg-gray-300 text-white px-4 md:px-8 py-2 text-base font-semibold border-black disabled:opacity-50"
            >
              {loading ? t("Downloading...") : t("Download")}
            </button>
          </div>
          <div className={`flex md:hidden w-65 flex-col gap-2 ${
    isRTL ? "mr-2  text-right" : " text-left ml-2 "
  }`}
>
            <input
              type="text"
              value={buyEmail}
              onChange={(e) => setBuyEmail(e.target.value)}
              placeholder={t("Email Address")}
              className="py-3 px-2 shadow-2xl text-black font-normal bg-white text-base outline-none"
            />
            <button
              onClick={async () => {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyEmail)) {
                  setBuyEmailError(t("Please enter a valid email."));
                  return;
                }
                setLoading(true);
                setBuyEmailError("");
                try {
                  let pdfName = "pdf2";
                  let emailApi = `${process.env.NEXT_PUBLIC_API_URL}/save-email`;
                  if (language === "ar") {
                    pdfName = "How to Buy a Home-Arabic";
                    emailApi = `${process.env.NEXT_PUBLIC_API_URL}/emails-arabic`;
                  }
                  const res = await fetch(
                    emailApi,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: buyEmail, pdfName }),
                    }
                  );
                  if (res.ok) {
                    handleDownload(pdfName);
                  } else {
                    setBuyEmailError(t("Failed to save email."));
                  }
                } catch (e) {
                  setBuyEmailError(t("Failed to save email."));
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="cursor-pointer hover:text-black bg-black hover:bg-gray-300 text-white px-8 py-2 text-base font-semibold border-black disabled:opacity-50"
            >
              {loading ? t("Downloading...") : t("Download")}
            </button>
          </div>
          {buyEmailError && (
            <div className="text-white text-sm mt-1">{buyEmailError}</div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>



        <div className="relative w-full h-[120vh] md:h-[90vh] flex items-center justify-center bg-gray-500/50 overflow-hidden border border-gray-100">

          {/* Background Image */}
          <Image
            src="/2.jpg" // Replace with your image in public folder
            alt={t("Background Crowd")}
            fill
            className="object-cover grayscale"
          />

          {/* Optional dark overlay */}
          <div className="absolute inset-0 bg-opacity-30"></div>

          {/* Testimonial Box */}
         <div
  className={`relative bg-white p-6 md:p-20 max-w-full md:max-w-3xl md:mx-auto mx-4 shadow-lg z-10 transition-all duration-500 ease-in-out ${
    isRTL ? "text-right" : "text-left"
  }`}
>
  <FaQuoteRight
    className={`absolute text-4xl md:text-7xl text-[rgb(206,32,39,255)] -top-4 md:-top-8 mb-4 leading-none ${
      isRTL ? "right-4 md:right-8" : "left-4 md:left-8"
    }`}
  />

  <AnimatePresence mode="wait">
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: isRTL ? -50 : 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isRTL ? 50 : -50 }}
      transition={{ duration: 0.8 }}
    >
      <p className="py-4 mb-4 md:mb-8 leading-relaxed">
        {t(testimonials[currentIndex].quote)}
      </p>
      <p className="text-[rgb(206,32,39,255)] font-bold mb-2">
        {t(testimonials[currentIndex].name)}
      </p>
      <p className="font-bold text-gray-600">
        {t(testimonials[currentIndex].role)}
      </p>
    </motion.div>
  </AnimatePresence>

  {/* Dots */}
  <div
    className={`flex justify-center mt-8 md:mt-6 space-x-2 `}
  >
    {testimonials.map((_, idx) => (
      <button
        key={idx}
        onClick={() => handleDotClick(idx)}
        className={`h-2 w-2 md:h-2 md:w-2 rounded-full ${
          idx === currentIndex
            ? "bg-[rgb(206,32,39,255)]"
            : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</div>

        </div>
        {/* <div className="flex justify-center items-center col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-8 md:mb-0">
          <hr className="md:w-170 w-44 my-8 md:my-12 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[2px]" />
        </div> */}

      </div>
      <Newfooter></Newfooter>
    </div>
  );
};
export default Home;