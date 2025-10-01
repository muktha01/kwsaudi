'use client'
import React, { useEffect, useState, useRef, Suspense, useMemo, useCallback } from 'react';
// import AgentMap from '@/components/AgentMap';
import Header from '@/components/header';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPhoneAlt,FaChevronRight, FaEnvelope, FaSearch } from 'react-icons/fa';
import { MdPhone } from "react-icons/md";
import Footer from '@/components/newfooter';
import { useTranslation } from '@/contexts/TranslationContext';
import Spinner from '@/components/Spinner';

// Skeleton component for loading state
const AgentSkeleton = () => (
  <div className="p-3 sm:p-4 flex flex-row items-start gap-3 sm:gap-4 animate-pulse">
    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

// Wrapper component that uses useSearchParams
const AgentContent = () => {
  const { language, isRTL, t } = useTranslation();
  const [agents, setAgents] = useState([]);
  const [allAgents, setAllAgents] = useState([]); // Store all fetched agents
  const [marketCenters, setMarketCenters] = useState([]);
  const [allMarketCenters, setAllMarketCenters] = useState([]); // Store all market centers
  const [filter, setFilter] = useState("agent");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10;
  const [totalAgents, setTotalAgents] = useState(0);

  const [filterName, setFilterName] = useState("");
  const [filterMarket, setFilterMarket] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const searchTimeoutRef = useRef(null);

  // Cache for API responses with localStorage persistence
  const cacheRef = useRef(new Map());
  const [cacheInitialized, setCacheInitialized] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // State for hovered agent's coordinates (for iframe map)
  const [hoveredAgentCoords, setHoveredAgentCoords] = useState({ lat: null, lng: null });

  // City to coordinates mapping (add more as needed)
  const cityCoords = {
    'riyadh': { lat: 24.7136, lng: 46.6753 },
    'jeddah': { lat: 21.4858, lng: 39.1925 },
    'khobar': { lat: 26.2172, lng: 50.1971 },
    'dammam': { lat: 26.4207, lng: 50.0888 },
    'makkah': { lat: 21.3891, lng: 39.8579 },
    'madinah': { lat: 24.5247, lng: 39.5692 },
    'abha': { lat: 18.2465, lng: 42.5117 },
    'tabuk': { lat: 28.3838, lng: 36.5550 },
    'hail': { lat: 27.5114, lng: 41.7208 },
    'al ahsa': { lat: 25.3832, lng: 49.5958 },
    'al jubail': { lat: 27.0046, lng: 49.6460 },
    'najran': { lat: 17.5650, lng: 44.2289 },
    'al kharj': { lat: 24.1556, lng: 47.3120 },
    'qassim': { lat: 26.2076, lng: 43.4837 },
    'jazan': { lat: 16.8892, lng: 42.5510 },
    'sakaka': { lat: 29.9697, lng: 40.2064 },
    'yanbu': { lat: 24.0947, lng: 38.0498 },
    'taif': { lat: 21.4373, lng: 40.5127 },
    // Add more cities as needed
  };
  // Initialize cache from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !cacheInitialized) {
      try {
        const savedCache = localStorage.getItem('agents-cache');
        const savedTimestamp = localStorage.getItem('agents-cache-timestamp');
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        
        if (savedCache && savedTimestamp && (now - parseInt(savedTimestamp)) < CACHE_DURATION) {
          const parsedCache = JSON.parse(savedCache);
          cacheRef.current = new Map(parsedCache);
        }
      } catch (error) {
        console.warn('Failed to load cache from localStorage:', error);
      }
      setCacheInitialized(true);
    }
  }, [cacheInitialized]);

  // Cached API fetch function with localStorage persistence
  const fetchAgentsWithCache = useCallback(async (page = 1, pageSize = 20) => {
    const cacheKey = `agents-page-${page}-size-${pageSize}`;
    
    // Check memory cache first
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }

    try {
      // The new backend endpoint for combined KW data
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/combined-data`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      
      // Cache the response in memory
      cacheRef.current.set(cacheKey, data);
      
      // Save to localStorage with timestamp
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('agents-cache', JSON.stringify([...cacheRef.current.entries()]));
          localStorage.setItem('agents-cache-timestamp', Date.now().toString());
        } catch (error) {
          console.warn('Failed to save cache to localStorage:', error);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      throw error;
    }
  }, []);

  // Memoized filtered agents
  const filteredAgents = useMemo(() => {
    if (!allAgents.length || filter !== "agent") return [];
    
    if (!filterName.trim()) return allAgents;
    
    const searchTerm = filterName.trim().toLowerCase();
    return allAgents.filter(agent => 
      (agent.name && agent.name.toLowerCase().includes(searchTerm)) ||
      (agent.surname && agent.surname.toLowerCase().includes(searchTerm)) ||
      (agent.city && agent.city.toLowerCase().includes(searchTerm))
    );
  }, [allAgents, filterName, filter]);

  // Memoized filtered market centers
  const filteredMarketCenters = useMemo(() => {
    if (!allMarketCenters.length || filter !== "market") return [];
    
    if (!filterName.trim()) return allMarketCenters;
    
    const searchTerm = filterName.trim().toLowerCase();
    return allMarketCenters.filter(center => 
      (center.name && center.name.toLowerCase().includes(searchTerm)) ||
      (center.city && center.city.toLowerCase().includes(searchTerm))
    );
  }, [allMarketCenters, filterName, filter]);

  // Handle URL search parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== filterName) {
      setFilter("agent");
      setFilterName(searchParam);
    }
  }, [searchParams, filterName]);

  // Optimized debounced search - removed search trigger complexity
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Only show loading for manual searches, not initial load
    const timeout = setTimeout(() => {
      if (filterName.trim() && allAgents.length > 0) {
        setSearchLoading(true);
        // Clear loading state quickly since filtering is instant
        setTimeout(() => setSearchLoading(false), 100);
      }
    }, 300); // Reduced timeout for faster response
    
    searchTimeoutRef.current = timeout;
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [filterName]);

  // Optimized agent processing function
  const processAgentData = useCallback((data) => {
    if (!data.success || !Array.isArray(data.results)) {
      throw new Error(data.message || 'Invalid response format');
    }

    let fetchedAgents = [];
    data.results.forEach(result => {
      if (result.success && result.type && result.type.startsWith('people_org')) {
        const agentData = result.data || [];
        fetchedAgents = fetchedAgents.concat(agentData);
      }
    });

    return fetchedAgents.map(item => ({
      _id: item.kw_uid || item.id || item._id,
      name: item.first_name && item.last_name 
        ? `${item.first_name} ${item.last_name}`.trim()
        : item.first_name || item.last_name || item.name || 'Unknown Agent',
      surname: item.last_name || '',
      phone: item.phone || item.mobile_phone || item.work_phone || 'N/A',
      email: item.email || item.work_email || 'N/A',
      image: item.photo || item.profile_image || '/avtar.jpg',
      office: item.office_name || item.market_center || '',
      city: item.city || item.work_city || item.office_city || item.address_city || '',
      license: item.license_number || '',
      mls_id: item.kw_uid || item.mls_id || '',
      active: item.active !== false,
      marketCenter: item.office_name || item.market_center || ''
    }));
  }, []);

  // Fetch initial agents with improved caching
  useEffect(() => {
    if (!cacheInitialized) return; // Wait for cache to initialize
    
    async function fetchAgents() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAgentsWithCache(1, 20);
        const mappedAgents = processAgentData(data);
        
        // Immediately update state for faster UI response
        setAllAgents(mappedAgents);
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('agents-local-data', JSON.stringify(mappedAgents));
            localStorage.setItem('agents-local-timestamp', Date.now().toString());
          } catch (error) {
            console.warn('Failed to save agents to localStorage:', error);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load agents');
        
        // Try to load from localStorage as fallback
        if (typeof window !== 'undefined') {
          try {
            const savedAgents = localStorage.getItem('agents-local-data');
            const savedTimestamp = localStorage.getItem('agents-local-timestamp');
            const now = Date.now();
            const FALLBACK_DURATION = 24 * 60 * 60 * 1000; // 24 hours
            
            if (savedAgents && savedTimestamp && (now - parseInt(savedTimestamp)) < FALLBACK_DURATION) {
              const parsedAgents = JSON.parse(savedAgents);
              setAllAgents(parsedAgents);
              setError(null); // Clear error since we have fallback data
            }
          } catch (fallbackError) {
            console.warn('Failed to load fallback agents:', fallbackError);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, [fetchAgentsWithCache, processAgentData, cacheInitialized]);

  // Initialize market centers data
  useEffect(() => {
    const mockMarketCenters = [
      {
        _id: 'mc1',
        name: t('Keller Williams Jasmin'),
        address: t('Dist, 2740 King Fahd Branch Road, as Sahafah 6403, Riyadh 13315'),
        phone: '09200-15671',
        email: 'info@kwsaudiarabia.com',
        city: t('Riyadh'),
        type: 'market_center'
      },
      {
        _id: 'mc2', 
        name: t('Keller Williams Jeddah'),
        address: t('Al Khalidiyyah, Jeddah 23421'),
        phone: '09200-15671',
        email: 'info@kwsaudiarabia.com',
        city: t('Jeddah'),
        type: 'market_center'
      }
    ];
    setAllMarketCenters(mockMarketCenters);
  }, [t]);

  // Optimized filtering and pagination with immediate updates
  useEffect(() => {
    // Immediate state updates without delays
    if (filter === "agent") {
      const totalFiltered = filteredAgents.length;
      const endIndex = currentPage * agentsPerPage;
      const paginatedAgents = filteredAgents.slice(0, endIndex);

      setAgents(paginatedAgents);
      setTotalAgents(totalFiltered);
      setMarketCenters([]);
    } else if (filter === "market") {
      const totalFiltered = filteredMarketCenters.length;
      const endIndex = currentPage * agentsPerPage;
      const paginatedMarketCenters = filteredMarketCenters.slice(0, endIndex);

      setMarketCenters(paginatedMarketCenters);
      setTotalAgents(totalFiltered);
      setAgents([]);
    }
    
    // Clear search loading immediately after state update
    if (searchLoading) {
      setSearchLoading(false);
    }
  }, [filteredAgents, filteredMarketCenters, filter, currentPage, agentsPerPage, searchLoading]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filter]);

  // Optimized load more function
  const loadMoreAgents = useCallback(async () => {
    if (loadingMore || !allAgents.length) return;
    
    setLoadingMore(true);
    const nextPage = Math.floor(allAgents.length / 20) + 1;
    
    try {
      const data = await fetchAgentsWithCache(nextPage, 20);
      const newAgents = processAgentData(data);
      
      // Immediate state update
      setAllAgents(prev => {
        const updated = [...prev, ...newAgents];
        
        // Update localStorage with new data
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('agents-local-data', JSON.stringify(updated));
            localStorage.setItem('agents-local-timestamp', Date.now().toString());
          } catch (error) {
            console.warn('Failed to update agents in localStorage:', error);
          }
        }
        
        return updated;
      });
    } catch (err) {
      console.warn('Error loading more agents:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, allAgents.length, fetchAgentsWithCache, processAgentData]);

  const handleAgentClick = (agent) => {
    if (typeof window !== 'undefined') {
      // Store the complete agent data in localStorage for the details page
      const agentDataForStorage = {
        _id: agent._id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        image: agent.image,
        office: agent.office,
        license: agent.license,
        kw_uid: agent.mls_id, // Store kw_uid for property filtering
        kw_id: agent.mls_id, // Keep backward compatibility
        city: agent.city || '', // Use office as city fallback
        marketCenter: agent.office || ''
      };
      localStorage.setItem('selectedAgent', JSON.stringify(agentDataForStorage));
      
      // Navigate to dynamic route with agent ID
      const agentId = agent._id || agent.kw_id || agent.kwId || agent.id;
      router.push(`/agent/${agentId}`);
    }
  };

  const handleMarketCenterClick = (center) => {
    if (typeof window !== 'undefined') {
      // Store market center data in localStorage
      const marketCenterData = {
        _id: center._id,
        name: center.name,
        address: center.address,
        phone: center.phone,
        email: center.email,
        city: center.city,
        type: center.type
      };
      localStorage.setItem('selectedMarketCenter', JSON.stringify(marketCenterData));
      
      // Navigate to market center specific pages
      if (center.name && center.name.toLowerCase().includes('jasmin')) {
        router.push('/jasmin');
      } else if (center.name && center.name.toLowerCase().includes('jeddah')) {
        router.push('/jeddah');
      } 
    }
  };

  return (
    <div>
    <div className="relative p-4 sm:p-6 md:p-8">
      <Header />

      <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

      <div className="relative bg-gray-100">
        <div className="pt-32 sm:pt-32 md:pt-44">
          <h1 className="text-start font-semibold text-2xl sm:text-3xl md:text-[40px] mx-4 sm:mx-10 md:mx-36 text-gray-700" data-translate>
            {t('Find a local estate agent')}
          </h1>
        </div>

        <div className="bg-white shadow-lg mx-4 sm:mx-10 md:mx-36">
          <div className="grid grid-cols-1 md:grid-cols-2 my-6 sm:my-8 md:my-10 p-4 sm:px-6 md:px-10 gap-6 sm:gap-8">

            {/* Left */}
            <div className="space-y-6 md:pr-6">
              <div className="grid grid-cols-1 gap-6">

                {/* Sticky Search */}
                <div className="sticky top-12 sm:top-14 md:top-15 bg-white z-10 py-3 sm:py-4">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 mb-3 sm:mb-4 text-gray-700 text-sm sm:text-base">
                    <span className="font-medium" data-translate>{t('Search by:')}</span>
                    <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="agent"
                        checked={filter === "agent"}
                        onChange={() => setFilter("agent")}
                        className="text-red-600 focus:ring-red-600"
                      />
                      <span data-translate>{t('Agent Name')}</span>
                    </label>
                    <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="market"
                        checked={filter === "market"}
                        onChange={() => setFilter("market")}
                        className="text-red-600 focus:ring-red-600"
                      />
                      <span data-translate>{t('Market Center')}</span>
                    </label>
                  </div>

                  <div className="flex items-center border border-gray-300">
                    <input
                      type="text"
                      placeholder={t(filter === "agent" ? "Enter Name" : "Enter City")}
                      className="flex-1 px-2 sm:px-3 py-2 sm:py-3 outline-none text-sm sm:text-base"
                      value={filterName}
                      onChange={(e) => {
                        const searchValue = e.target.value;
                        setFilterName(searchValue);
                        
                        // Auto-switch to agent tab when typing (assuming user wants to search agents by name or city)
                        if (searchValue.trim() && filter === "market") {
                          setFilter("agent");
                        }
                        
                        // Clear any existing timeout when user types
                        if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                        }
                        
                        // Immediate filtering without delays for better UX
                        // No need for search trigger - filtering happens automatically via useMemo
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          // No need for search trigger - filtering is immediate
                          // Just clear timeout for instant response
                          if (searchTimeoutRef.current) {
                            clearTimeout(searchTimeoutRef.current);
                          }
                        }
                      }}
                    />
                    <button 
                      className="bg-[rgb(206,32,39,255)] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center"
                      onClick={() => {
                        // Clear timeout for immediate search response
                        if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                        }
                        // Focus back to input for better UX
                        const input = document.querySelector('input[type="text"]');
                        if (input) input.focus();
                      }}
                    >
                      <FaSearch size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  <div className="mt-2 text-right">
                    <button
                      className="text-[rgb(206,32,39,255)] text-xs sm:text-sm hover:underline"
                      onClick={() => {
                        setFilterName("");
                        setFilterMarket("");
                        setFilterCity("");
                        // Clear any pending timeouts
                        if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                        }
                      }}
                      data-translate
                    >
                      {t('Clear my search')}
                    </button>
                  </div>
                </div>

                {/* Conditional Rendering - Show agents or market centers */}
                <>
                  {/* Initial Loading State */}
                  {loading && currentPage === 1 && (
                    <Spinner 
                      size="lg" 
                      color="red" 
                      text={t('Loading agents...')}
                      className="py-20"
                    />
                  )}
                  
                  {/* Search Loading State */}
                  {searchLoading && !loading && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
                        <Spinner 
                          size="md" 
                          color="red" 
                          text={t('Searching...')}
                        />
                      </div>
                      {/* Show existing results with opacity while searching */}
                      <div className="opacity-30">
                        {filter === "agent" && agents.map((agent, idx) => (
                          <div key={`search-${agent._id}-${idx}`} className="p-4 border-b border-gray-300">
                            <div className="flex gap-4">
                              <div className="w-24 h-24 bg-gray-300 rounded"></div>
                              <div className="flex-1">
                                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {error && <div className="text-red-500 p-4 text-center">{error}</div>}

                  {!loading && !searchLoading && !error && filter === "agent" && agents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">{t('No agents found.')}</div>
                  )}

                  {!loading && !searchLoading && !error && filter === "market" && marketCenters.length === 0 && (
                    <div className="text-center py-8 text-gray-500">{t('No market centers found.')}</div>
                  )}

                  {/* Show Agents when filter is "agent" */}
                  {!loading && !searchLoading && !error && filter === "agent" && agents.map((agent, idx) => {
                    // Try to get coordinates from agent object (customize field names as per your API)
                    let lat = null, lng = null;
                    if (agent.latitude && agent.longitude) {
                      lat = agent.latitude;
                      lng = agent.longitude;
                    } else if (agent.lat && agent.lng) {
                      lat = agent.lat;
                      lng = agent.lng;
                    } else if (agent.location && agent.location.lat && agent.location.lng) {
                      lat = agent.location.lat;
                      lng = agent.location.lng;
                    } else if (agent.coordinates && Array.isArray(agent.coordinates) && agent.coordinates.length === 2) {
                      lat = agent.coordinates[0];
                      lng = agent.coordinates[1];
                    } else if (agent.city) {
                      // Use city name to get coordinates
                      const cityKey = agent.city.trim().toLowerCase();
                      if (cityCoords[cityKey]) {
                        lat = cityCoords[cityKey].lat;
                        lng = cityCoords[cityKey].lng;
                      }
                    }
                    // Always use a unique key: combine _id and idx if needed
                    let key = agent._id;
                    if (!key || agents.filter(a => a._id === key).length > 1) {
                      key = `${agent._id || 'agent'}-${idx}`;
                    }
                    return (
                      <article
                        key={key}
                        className={`p-3 sm:p-4 flex flex-row items-start gap-3 sm:gap-4 relative ${idx !== agents.length - 1 ? 'border-b border-gray-300' : ''}`}
                        onMouseEnter={() => {
                          if (lat && lng) setHoveredAgentCoords({ lat, lng });
                          else setHoveredAgentCoords({ lat: null, lng: null });
                        }}
                        onMouseLeave={() => setHoveredAgentCoords({ lat: null, lng: null })}
                      >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative">
                          <Image
                            src={agent.image || "/avtar.jpg"}
                            alt={t(`Portrait of ${agent.name}`)}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAgentClick(agent);
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-lg md:text-2xl font-semibold mb-2">{agent.name}</h3>
                          <p className="text-sm sm:text-base mb-2 break-all flex items-center gap-2">
                            <FaPhoneAlt className="text-gray-600" /> {agent.phone}
                          </p>
                          <p className="text-sm sm:text-base mb-4 break-all flex items-center gap-2">
                            <FaEnvelope className="text-gray-600" /> {agent.email}
                          </p>
                          {agent.office && (
                            <p className="text-sm text-gray-500 mb-2">{t('Office:')} {agent.office}</p>
                          )}
                          <button
                            onClick={() => handleAgentClick(agent)}
                            className={`hover:text-[rgb(206,32,39,255)] font-semibold transition-colors py-2 sm:py-3 flex items-center ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end'}
                            gap-1 sm:gap-2 text-base sm:text-base`}
                          >
                            <span data-translate>{t('View Details & Properties')}</span>
                            <FaChevronRight className={`${isRTL ? 'rotate-180' : ''} w-3 h-3 mt-0.5`} />
                          </button>
                        </div>
                      </article>
                    );
                  })}

                  {/* Show Market Centers when filter is "market" */}
                  {!loading && !searchLoading && !error && filter === "market" && marketCenters.map((center, idx) => (
                    <article key={center._id || idx} className={`p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 relative ${
                      idx !== marketCenters.length - 1 ? 'border-b border-gray-300' : ''
                    }`}>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-lg md:text-2xl font-semibold mb-2">{t(center.name)}</h3>
                        <p className="text-sm sm:text-base mb-6 break-all text-gray-700">{t(center.address)}</p>
                        <p className="text-sm sm:text-base mb-2 break-all flex items-center gap-2">
                          <FaPhoneAlt className="text-gray-600" /> {center.phone}
                        </p>
                        <p className="text-sm sm:text-base mb-4 break-all flex items-center gap-2">
                          <FaEnvelope className="text-gray-600" /> {center.email}
                        </p>
                        <button
                          onClick={() => handleMarketCenterClick(center)}
                          className={`hover:text-[rgb(206,32,39,255)] font-semibold transition-colors py-2 sm:py-3 flex items-center ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end'}
                          gap-1 sm:gap-2 text-base sm:text-base`}
                        >
                          <span data-translate>{t('More Details')}</span>
                          <FaChevronRight className={`${isRTL ? 'rotate-180' : ''} w-3 h-3 mt-0.5`} />
                        </button>
                      </div>
                    </article>
                  ))}

                  {!loading && (currentPage * agentsPerPage) < totalAgents && (
                    <div className="flex justify-center mt-4 sm:mt-6">
                      <button
                        className="px-4 sm:px-6 py-2 font-semibold bg-gray-500 text-white text-sm sm:text-base disabled:opacity-50"
                        onClick={() => {
                          if (filter === "agent") {
                            // Check if we need to load more data from API
                            const currentlyShown = currentPage * agentsPerPage;
                            if (currentlyShown >= allAgents.length) {
                              loadMoreAgents();
                            }
                          }
                          setCurrentPage(prev => prev + 1);
                        }}
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
                          <div className="flex items-center gap-2">
                            <Spinner size="sm" color="white" />
                            {t('Loading more...')}
                          </div>
                        ) : (
                          t(filter === "agent" ? "Show More Agents" : "Show More Market Centers")
                        )}
                      </button>
                    </div>
                  )}
                </>
              </div>
            </div>

            {/* Right: Sticky Map */}
            <div className="pl-0 my-6 md:my-10 sticky md:top-20 h-[300px] sm:h-[400px] md:h-[calc(100vh-5rem)]">
              <div className="relative w-full overflow-hidden border border-gray-200 h-full">
                {/* Map iframe */}
                <iframe
                  title="Agent Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                  src={
                    hoveredAgentCoords.lat && hoveredAgentCoords.lng
                      ? `https://maps.google.com/maps?q=${hoveredAgentCoords.lat},${hoveredAgentCoords.lng}&z=15&output=embed`
                      : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4444535.330365576!2d41.51259970861697!3d23.8006960408425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15e8e4f105f8aaaf%3A0x70a8a6a2cb7f9405!2sSaudi%20Arabia!5e0!3m2!1sen!2sin!4v1717315040974!5m2!1sen!2sin"
                  }
                ></iframe>
                {/* City badge overlay */}
                {hoveredAgentCoords.lat && hoveredAgentCoords.lng && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 10,
                      background: 'rgba(206,32,39,0.95)',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '24px',
                      fontWeight: 600,
                      fontSize: 18,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                    }}
                  >
                    {/* Show city name if available */}
                    {(() => {
                      // Find the agent being hovered
                      const hoveredAgent = agents.find(agent => {
                        let lat = null, lng = null;
                        if (agent.latitude && agent.longitude) {
                          lat = agent.latitude;
                          lng = agent.longitude;
                        } else if (agent.lat && agent.lng) {
                          lat = agent.lat;
                          lng = agent.lng;
                        } else if (agent.location && agent.location.lat && agent.location.lng) {
                          lat = agent.location.lat;
                          lng = agent.location.lng;
                        } else if (agent.coordinates && Array.isArray(agent.coordinates) && agent.coordinates.length === 2) {
                          lat = agent.coordinates[0];
                          lng = agent.coordinates[1];
                        } else if (agent.city) {
                          const cityKey = agent.city.trim().toLowerCase();
                          if (cityCoords[cityKey]) {
                            lat = cityCoords[cityKey].lat;
                            lng = cityCoords[cityKey].lng;
                          }
                        }
                        return lat === hoveredAgentCoords.lat && lng === hoveredAgentCoords.lng;
                      });
                      return hoveredAgent && hoveredAgent.city
                        ? hoveredAgent.city
                        : 'Location';
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      
      </div>
    
    </div>
  );
};

// Main component that wraps AgentContent in Suspense
const Agent = () => {
  return (
    <Suspense fallback={
      <Spinner 
        overlay={true}
        size="xl" 
        color="red"
        text="Initializing agents page..."
      />
    }>
      <AgentContent />
    </Suspense>
  );
};

export default Agent;