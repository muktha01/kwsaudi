'use client'
import React, { useEffect, useState, useRef, Suspense, useMemo, useCallback } from 'react';
// import AgentMap from '@/components/AgentMap';
import Header from '@/components/header';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPhoneAlt,FaChevronRight, FaEnvelope, FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { MdPhone } from "react-icons/md";
import Footer from '@/components/newfooter';
import { useTranslation } from '@/contexts/TranslationContext';
import Spinner from '@/components/Spinner';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow, OverlayView } from '@react-google-maps/api';

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

const AgentMap = React.memo(({ 
  isLoaded, 
  agents, 
  hoveredAgent, 
  setHoveredAgent, 
  desktopMap, 
  setDesktopMap, 
  setMapProjection, 
  mapProjection,
  getOffsetCoords,
  handleAgentClick,
  t,
  filterName // Add filterName prop to determine map center
}) => {
  
  // Function to determine map center based on search term or agents
  const getMapCenter = () => {
    // City coordinates for major Saudi cities
    const cityCoordinates = {
      'riyadh': { lat: 24.7136, lng: 46.6753, zoom: 10 },
      'jeddah': { lat: 21.4225, lng: 39.8262, zoom: 10 },
      'mecca': { lat: 21.3891, lng: 39.8579, zoom: 10 },
      'medina': { lat: 24.5247, lng: 39.5692, zoom: 10 },
      'dammam': { lat: 26.4282, lng: 50.1020, zoom: 10 },
      'khobar': { lat: 26.2172, lng: 50.1971, zoom: 10 },
      'dhahran': { lat: 26.2361, lng: 50.1455, zoom: 10 },
      'tabuk': { lat: 28.3998, lng: 36.5700, zoom: 10 }
    };

    // If there's a search term, check if it matches a city
    if (filterName && filterName.trim()) {
      const searchTerm = filterName.trim().toLowerCase();
      if (cityCoordinates[searchTerm]) {
        return cityCoordinates[searchTerm];
      }
    }

    // If agents are available, try to center based on their locations
    if (agents && agents.length > 0) {
      // Check if most agents are from a specific city
      const cityCounts = {};
      agents.forEach(agent => {
        if (agent.city) {
          const cityKey = agent.city.toLowerCase().trim();
          cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
        }
      });

      // Find the city with most agents
      const dominantCity = Object.keys(cityCounts).reduce((a, b) => 
        cityCounts[a] > cityCounts[b] ? a : b, null
      );

      if (dominantCity && cityCoordinates[dominantCity]) {
        return cityCoordinates[dominantCity];
      }
    }

    // Default to Saudi Arabia center view
    return { lat: 24.7136, lng: 46.6753, zoom: 6 };
  };

  const mapCenter = getMapCenter();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      // No cleanup needed for simplified hover
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Spinner size="lg" color="red" text={t('Loading map...')} />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-100"><Spinner size="lg" color="red" text={t('Loading map...')} /></div>}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: mapCenter.lat, lng: mapCenter.lng }} // Dynamic center based on search or agents
        zoom={mapCenter.zoom} // Dynamic zoom level
        onLoad={(map) => {
          setDesktopMap(map);
          setMapProjection(map.getProjection());
        }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {(() => {
          // Track coordinates to handle overlapping markers
          const coordSeen = {};
          
          // Helper to determine if card should show above marker (same logic as properties)
          const shouldShowAbove = (coords) => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) return false;
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
            const mapDiv = desktopMap.getDiv();
            const mapHeight = mapDiv.clientHeight;
            
            // If marker is in the bottom 30% of the map, show card above
            return y > mapHeight * 0.7;
          };

          // Show all agents, but only render those with coordinates (same as properties)
          const agentsToShow = agents; // Show ALL agents like properties
          
          return agentsToShow.map((agent, idx) => {
            // Get agent coordinates - prioritize API coordinates with enhanced fallback
            let lat = null, lng = null;
            
            // First priority: coordinates from API
            if (agent.latitude && agent.longitude) {
              lat = agent.latitude;
              lng = agent.longitude;
            } 
            // Second priority: direct lat/lng properties
            else if (agent.lat && agent.lng) {
              lat = agent.lat;
              lng = agent.lng;
            } 
            // Third priority: location object
            else if (agent.location && agent.location.lat && agent.location.lng) {
              lat = agent.location.lat;
              lng = agent.location.lng;
            } 
            // Fourth priority: coordinates array
            else if (agent.coordinates && Array.isArray(agent.coordinates) && agent.coordinates.length === 2) {
              lat = agent.coordinates[0];
              lng = agent.coordinates[1];
            }
            // Fifth priority: Try to use city coordinates as fallback - ENHANCED
            else if (agent.city) {
              // Add some default city coordinates for major Saudi cities
              const cityCoordinates = {
                'riyadh': { lat: 24.7136, lng: 46.6753 },
                'jeddah': { lat: 21.4225, lng: 39.8262 },
                'mecca': { lat: 21.3891, lng: 39.8579 },
                'medina': { lat: 24.5247, lng: 39.5692 },
                'dammam': { lat: 26.4282, lng: 50.1020 },
                'khobar': { lat: 26.2172, lng: 50.1971 },
                'dhahran': { lat: 26.2361, lng: 50.1455 },
                'tabuk': { lat: 28.3998, lng: 36.5700 }
              };
              
              const cityKey = agent.city.toLowerCase().trim();
              if (cityCoordinates[cityKey]) {
                lat = cityCoordinates[cityKey].lat + (Math.random() - 0.5) * 0.1; // Add small random offset
                lng = cityCoordinates[cityKey].lng + (Math.random() - 0.5) * 0.1;
                // console.log(`📍 Using city fallback for ${agent.name} in ${agent.city}:`, lat, lng);
              }
            }
            
            // Final fallback: If still no coordinates, use Riyadh center with random offset
            if (!lat || !lng) {
              lat = 24.7136 + (Math.random() - 0.5) * 0.2; // Random around Riyadh
              lng = 46.6753 + (Math.random() - 0.5) * 0.2;
              // console.log(`🔄 Using final fallback coordinates for ${agent.name}:`, lat, lng);
            }

            // Handle overlapping coordinates
            const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
            coordSeen[key] = (coordSeen[key] || 0) + 1;
            const offsetCoords = getOffsetCoords([lat, lng], coordSeen[key] - 1);

            const isActive = hoveredAgent && hoveredAgent._id === agent._id;
            const isFixed = hoveredAgent?.fixed && hoveredAgent?._id === agent._id;
            const showAbove = shouldShowAbove(offsetCoords);
            
            // // Debug log for map card visibility
            // if (isActive || isFixed) {
            //   console.log(`🗺️ Showing map card for agent: ${agent.name}, isActive: ${isActive}, isFixed: ${isFixed}`);
            // }
            
            // Create truly unique key for map markers
            const mapUniqueKey = `map-agent-${idx}-${agent._id || 'unknown'}-${agent.name || 'unnamed'}-${lat.toFixed(4)}-${lng.toFixed(4)}`.replace(/\s+/g, '-');

            return (
              <React.Fragment key={mapUniqueKey}>
                {/* Agent Location Badge Overlay */}
                <OverlayView
                  position={offsetCoords}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`bg-[rgb(206,32,39,255)] text-white font-medium rounded-full px-3 py-2 text-sm text-center shadow-lg cursor-pointer
                        ${isFixed ? 'ring-2 ring-black' : ''}
                      `}
                      style={{ 
                        position: 'relative', 
                        zIndex: isActive ? 50 : 10,
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.2s ease-out',
                        willChange: 'transform'
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        
                        // Simple immediate hover like properties
                        if (!hoveredAgent || hoveredAgent._id !== agent._id) {
                          setHoveredAgent({ ...agent, latitude: lat, longitude: lng });
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        
                        // Simple delayed clear like properties
                        setTimeout(() => {
                          setHoveredAgent(prev => {
                            // If current hovered agent is fixed, don't clear it
                            if (prev && prev.fixed && prev._id === agent._id) {
                              return prev;
                            }
                            // Only clear if this is the correct agent and not fixed
                            if (prev && prev._id === agent._id && !prev.fixed) {
                              return null;
                            }
                            return prev;
                          });
                        }, 100);
                      }}
                      onClick={() => {
                        // If already fixed and clicked again, navigate to agent details
                        if (hoveredAgent?.fixed && hoveredAgent?._id === agent._id) {
                          handleAgentClick(agent);
                          return;
                        }
                        
                        // If not fixed, make it fixed (pinned) on first click
                        if (!hoveredAgent?.fixed || hoveredAgent?._id !== agent._id) {
                          setHoveredAgent({ 
                            ...agent, 
                            latitude: lat, 
                            longitude: lng, 
                            fixed: true 
                          });
                          
                          // Smart pan behavior (same as properties)
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
                              
                              // If marker is in bottom 65% of map, pan up
                              if (y > mapHeight * 0.65) {
                                const panAmount = Math.min(300, mapHeight * 0.3);
                                desktopMap.panBy(0, -panAmount);
                              }
                            }
                          }
                        }
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <FaMapMarkerAlt className="text-white w-3 h-3" />
                        {agent.city || agent.name?.split(' ')[0] || 'Agent'}
                      </span>
                    </div>
                  </div>
                </OverlayView>

                {/* Agent Details Card when hovered or fixed */}
                {(isActive || isFixed) && (
                  <OverlayView
                    position={offsetCoords}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div style={{ 
                      marginTop: showAbove ? -280 : 45, 
                      zIndex: 100, 
                      position: 'relative' 
                    }}>
                      <div 
                        className="bg-white  shadow-xl max-w-xs w-72 cursor-pointer border border-gray-200 relative"
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          
                          // Simple immediate hover like properties
                          if (!hoveredAgent || hoveredAgent._id !== agent._id) {
                            setHoveredAgent({ ...agent, latitude: lat, longitude: lng });
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.stopPropagation();
                          
                          // Simple delayed clear like properties
                          setTimeout(() => {
                            setHoveredAgent(prev => {
                              // If current hovered agent is fixed, don't clear it
                              if (prev && prev.fixed && prev._id === agent._id) {
                                return prev;
                              }
                              // Clear hover state
                              if (prev && prev._id === agent._id && !prev.fixed) {
                                return null;
                              }
                              return prev;
                            });
                          }, 100);
                        }}
                        onClick={() => handleAgentClick(agent)}
                      >
                        <div className="p-4">
                          {/* Close button for fixed cards */}
                          {isFixed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setHoveredAgent(null);
                              }}
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold bg-white rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 shadow-sm"
                            >
                              ×
                            </button>
                          )}
                          <div className="flex items-start gap-3 pt-2">
                            <div className="w-16 h-16 flex-shrink-0 relative">
                              <Image
                                src={agent.image || "/avtar.jpg"}
                                alt={agent.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm text-gray-800 truncate mb-1">{agent.name}</h3>
                              {agent.office && (
                                <p className="text-xs text-gray-600 mb-2 truncate">{agent.office}</p>
                              )}
                              <div className="space-y-1">
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <FaPhoneAlt className="w-3 h-3" />
                                  <span className="truncate">{agent.phone}</span>
                                </p>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <FaEnvelope className="w-3 h-3" />
                                  <span className="truncate">{agent.email}</span>
                                </p>
                                {agent.city && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <FaMapMarkerAlt className="w-3 h-3" />
                                    <span className="truncate">{agent.city}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAgentClick(agent);
                            }}
                            className="w-full bg-[rgb(206,32,39,255)] text-white text-xs font-medium py-2 px-3 rounded mt-3 hover:bg-[rgb(186,22,29,255)] transition-colors flex items-center justify-center gap-1"
                          >
                            <span>{t('View Details & Properties')}</span>
                            <FaChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </OverlayView>
                )}
              </React.Fragment>
            );
          }).filter(Boolean); // Remove null entries
        })()}
      </GoogleMap>
    </Suspense>
  );
});

// Custom comparison function for AgentMap memo - simpler like property page
const arePropsEqual = (prevProps, nextProps) => {
  // Allow re-renders when hoveredAgent changes (like property page)
  // This is necessary for agent cards to show/hide on hover
  
  // Check if basic props changed
  if (prevProps.isLoaded !== nextProps.isLoaded) return false;
  if (prevProps.t !== nextProps.t) return false;
  if (prevProps.desktopMap !== nextProps.desktopMap) return false;
  if (prevProps.mapProjection !== nextProps.mapProjection) return false;
  if (prevProps.filterName !== nextProps.filterName) return false; // Check filterName for map center changes
  
  // Check if agents array changed
  if (prevProps.agents.length !== nextProps.agents.length) return false;
  if (prevProps.agents !== nextProps.agents) return false;
  
  // IMPORTANT: Allow re-renders when hoveredAgent changes (simplified)
  // This makes agent cards appear/disappear on hover like properties
  if (prevProps.hoveredAgent !== nextProps.hoveredAgent) return false;
  
  return true;
};

AgentMap.displayName = 'AgentMap';

// Apply custom comparison to prevent unnecessary re-renders
const MemoizedAgentMap = React.memo(AgentMap, arePropsEqual);

// Wrapper component that uses useSearchParams
const AgentContent = () => {
  const { language, isRTL, t } = useTranslation();
  const [agents, setAgents] = useState([]);
  const [allAgents, setAllAgents] = useState([]); // Store all fetched agents
  const [marketCenters, setMarketCenters] = useState([]);
  const [allMarketCenters, setAllMarketCenters] = useState([]); // Store all market centers
  const [filter, setFilter] = useState("agent");
  const [loading, setLoading] = useState(true);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0); // Add loading progress
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 6; // Reduced from 10 to 6 for faster initial load
  const [totalAgents, setTotalAgents] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [mapProjection, setMapProjection] = useState(null);
  const [desktopMap, setDesktopMap] = useState(null);

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDG48YF2dsvPN0qHX3_vSaTJj6aqg3-Oc4"
  });

  const [filterName, setFilterName] = useState("");
  const [filterMarket, setFilterMarket] = useState("");
  const [filterCity, setFilterCity] = useState("");

  // Cache for API responses with localStorage persistence
  const cacheRef = useRef(new Map());
  const [cacheInitialized, setCacheInitialized] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // State for hovered agent's coordinates (for Google Maps)
  const [hoveredAgent, setHoveredAgent] = useState(null);

  // Debug logging for hoveredAgent changes
  // useEffect(() => {
  //   if (hoveredAgent) {
  //     console.log(`🎯 HoveredAgent changed:`, {
  //       name: hoveredAgent.name,
  //       id: hoveredAgent._id,
  //       lat: hoveredAgent.latitude,
  //       lng: hoveredAgent.longitude,
  //       fromSidebar: hoveredAgent.fromSidebar,
  //       fixed: hoveredAgent.fixed
  //     });
  //   } else {
  //     console.log(`🎯 HoveredAgent cleared`);
  //   }
  // }, [hoveredAgent]);

  // Clear fixed agent when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the map area and agent cards
      const mapContainer = document.querySelector('[data-testid="agent-map-container"]');
      if (mapContainer && !mapContainer.contains(event.target)) {
        setHoveredAgent(prev => {
          // Only clear if it's a fixed agent
          if (prev && prev.fixed) {
            return null;
          }
          return prev;
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Helper function to get offset coordinates for overlapping markers (same as propertype.js)
  const getOffsetCoords = useCallback((coords, offset) => {
    const [lat, lng] = coords;
    if (offset === 0) return { lat, lng };
    
    // Add small random offset for overlapping coordinates
    const offsetLat = lat + (offset * 0.001) * (Math.random() - 0.5);
    const offsetLng = lng + (offset * 0.001) * (Math.random() - 0.5);
    
    return { lat: offsetLat, lng: offsetLng };
  }, []);

  // Smooth pan/zoom on hover for desktop map (DISABLED TO PREVENT LAG)
  // useEffect(() => {
  //   if (desktopMap && hoveredAgent && hoveredAgent.latitude && hoveredAgent.longitude) {
  //     // Offset latitude to move marker toward top (same offset as property)
  //     const offsetLat = hoveredAgent.latitude + 0.03;
  //     desktopMap.panTo({ lat: offsetLat, lng: hoveredAgent.longitude });
  //     desktopMap.setZoom(16);
  //   }
  // }, [hoveredAgent, desktopMap]);

  // Reset map when no agent is hovered (DISABLED TO PREVENT LAG)
  // useEffect(() => {
  //   if (desktopMap && (!hoveredAgent || !hoveredAgent.latitude || !hoveredAgent.longitude)) {
  //     desktopMap.panTo({ lat: 24.7136, lng: 46.6753 });
  //     desktopMap.setZoom(6);
  //   }
  // }, [hoveredAgent, desktopMap]);

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
        // console.warn('Failed to load cache from localStorage:', error);
      }
      setCacheInitialized(true);
    }
  }, [cacheInitialized]);

  // Cached API fetch function with localStorage persistence
  const fetchAgentsWithCache = useCallback(async (page = 1, pageSize = 6) => {
    const cacheKey = `agents-page-${page}-size-${pageSize}`;
    
    // Check memory cache first
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }

    try {
      // Use pagination parameters to reduce load time
      const offset = (page - 1) * pageSize;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/agents/kw/combined-data?offset=${offset}&limit=${pageSize}`;
      

      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Reduced to 10 second timeout
      
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      // console.log('API Response Structure:', data);
      
      // Extract coordinates mapping from different data sources
      const coordinatesMap = new Map();
      
      // Process all results to build coordinate mapping
      if (data.success && Array.isArray(data.results)) {
        data.results.forEach(result => {
          if (result.success && result.data) {
            // Check if this is coordinates data (typically from 50394)
            if (result.type && result.type.includes('listings')) {
              // console.log('Found coordinates data from listings:', result.type);
              result.data.forEach(item => {
                if (item._source && item._source.list_address) {
                  // Try multiple sources for agent identification
                  const kw_uid = item._source.co_list_kw_uid || 
                               item._source.kw_uid || 
                               item._source.list_kw_uid ||
                               item._source.list_agent_kw_uid ||
                               item._source.listing_agent_kw_uid ||
                               item._id;
                  
                  // Also get email for matching
                  const email = item._source.list_agent_email || 
                               item._source.agent_email || 
                               item._source.email;
                  
                  const coordinates = item._source.list_address.coordinates_gp || item._source.list_address.coordinates_gs;
                  
                  if ((kw_uid || email) && coordinates) {
                    // Store with multiple key formats for better matching
                    const coordData = {
                      lat: coordinates.lat || coordinates.coordinates?.[1],
                      lng: coordinates.lon || coordinates.coordinates?.[0],
                      city: item._source.city || item._source.list_address.city,
                      email: email,
                      kw_uid: kw_uid
                    };
                    
                    if (coordData.lat && coordData.lng) {
                      // Store with different key formats including email
                      const keys = [];
                      
                      // Add kw_uid based keys
                      if (kw_uid) {
                        keys.push(
                          kw_uid.toString(),
                          parseInt(kw_uid).toString(),
                          `kw_${kw_uid}`,
                          kw_uid
                        );
                      }
                      
                      // Add email based keys
                      if (email) {
                        keys.push(
                          email.toLowerCase(),
                          `email_${email.toLowerCase()}`
                        );
                      }
                      
                      // Add _id based keys
                      if (item._id) {
                        keys.push(
                          item._id.toString(),
                          `id_${item._id}`
                        );
                      }
                      
                      keys.forEach(key => {
                        coordinatesMap.set(key, coordData);
                      });
                      
                      // console.log(`Mapped coordinates for kw_uid ${kw_uid}, email ${email}, _id ${item._id} (multiple formats):`, coordData.lat, coordData.lng);
                    } else if (Array.isArray(coordinates.coordinates)) {
                      const coordData2 = {
                        lat: coordinates.coordinates[1],
                        lng: coordinates.coordinates[0],
                        city: item._source.city || item._source.list_address.city,
                        email: email,
                        kw_uid: kw_uid
                      };
                      
                      // Store with different key formats including email
                      const keys = [];
                      
                      // Add kw_uid based keys
                      if (kw_uid) {
                        keys.push(
                          kw_uid.toString(),
                          parseInt(kw_uid).toString(),
                          `kw_${kw_uid}`,
                          kw_uid
                        );
                      }
                      
                      // Add email based keys
                      if (email) {
                        keys.push(
                          email.toLowerCase(),
                          `email_${email.toLowerCase()}`
                        );
                      }
                      
                      // Add _id based keys
                      if (item._id) {
                        keys.push(
                          item._id.toString(),
                          `id_${item._id}`
                        );
                      }
                      
                      keys.forEach(key => {
                        coordinatesMap.set(key, coordData2);
                      });
                      
                      // console.log(`Mapped array coordinates for kw_uid ${kw_uid}, email ${email}, _id ${item._id} (multiple formats):`, coordinates.coordinates);
                    }
                  }
                }
              });
            }
            
            // Check if this is region data (50394)
            if (result.type && result.type.includes('region')) {
              // console.log('Found region data:', result.type);
              result.data.forEach(item => {
                if (item._source) {
                  const coordinates = item._source.coordinates_gp || item._source.coordinates_gs;
                  const city = item._source.city;
                  
                  if (coordinates && city) {
                    // Store city-level coordinates as fallback
                    const cityKey = `city_${city.toLowerCase()}`;
                    if (coordinates.lat && coordinates.lon) {
                      coordinatesMap.set(cityKey, {
                        lat: coordinates.lat,
                        lng: coordinates.lon,
                        city: city,
                        isCity: true
                      });
                      // console.log(`Mapped city coordinates for ${city}:`, coordinates.lat, coordinates.lon);
                    }
                  }
                }
              });
            }
          }
        });
      }
      
      // console.log('Coordinates Map:', coordinatesMap);
      
      // Store coordinates map for use in processAgentData
      data.coordinatesMap = coordinatesMap;
      
      // Cache the response in memory
      cacheRef.current.set(cacheKey, data);
      
      // Save to localStorage with timestamp
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('agents-cache', JSON.stringify([...cacheRef.current.entries()]));
          localStorage.setItem('agents-cache-timestamp', Date.now().toString());
        } catch (error) {
          // console.warn('Failed to save cache to localStorage:', error);
        }
      }
      
      return data;
    } catch (error) {
      // console.error('Failed to fetch agents:', error);
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

  // Memoized filtered market centers - when market filter is selected, show agents filtered by market center
  const filteredMarketCenters = useMemo(() => {
    // If filter is "market", filter agents by market center/office instead of showing separate market centers
    if (filter === "market") {
      if (!allAgents.length) return [];
      
      // If no search term, return all agents
      if (!filterName.trim()) return allAgents;
      
      const searchTerm = filterName.trim().toLowerCase();
      return allAgents.filter(agent => 
        (agent.office && agent.office.toLowerCase().includes(searchTerm)) ||
        (agent.marketCenter && agent.marketCenter.toLowerCase().includes(searchTerm)) ||
        (agent.city && agent.city.toLowerCase().includes(searchTerm))
      );
    }
    
    // For other filters, return empty array
    return [];
  }, [allAgents, filterName, filter]);

  // Handle URL search parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== filterName) {
      setFilter("agent");
      setFilterName(searchParam);
      setCurrentPage(1); // Reset page when URL search changes
    }
  }, [searchParams, filterName]);

  // Optimized agent processing function
  const processAgentData = useCallback((data) => {
    if (!data.success || !Array.isArray(data.results)) {
      throw new Error(data.message || 'Invalid response format');
    }

    const coordinatesMap = data.coordinatesMap || new Map();
    // console.log('Processing agents with coordinates map:', coordinatesMap);
    // console.log('Available coordinate keys:', Array.from(coordinatesMap.keys()));

    let fetchedAgents = [];
    data.results.forEach(result => {
      if (result.success && result.type && result.type.startsWith('people_org')) {
        const agentData = result.data || [];
        fetchedAgents = fetchedAgents.concat(agentData);
      }
    });

    // console.log('Sample agent kw_uids:', fetchedAgents.slice(0, 5).map(agent => ({
    //   name: `${agent.first_name} ${agent.last_name}`,
    //   kw_uid: agent.kw_uid,
    //   id: agent.id,
    //   _id: agent._id,
    //   email: agent.email || agent.work_email
    // })));

    return fetchedAgents.map(item => {
      // Extract coordinates from API response
      let latitude = null, longitude = null;
      const kw_uid = item.kw_uid || item.id || item._id;
      const email = item.email || item.work_email;
      
      // First priority: Try to get coordinates from the coordinates map using kw_uid
      if (kw_uid && coordinatesMap.has(kw_uid)) {
        const coords = coordinatesMap.get(kw_uid);
        latitude = coords.lat;
        longitude = coords.lng;
      //   console.log(`✓ Agent ${item.first_name} ${item.last_name}: Found mapped coordinates for kw_uid ${kw_uid}:`, latitude, longitude);
       }
      
      // Also try alternative kw_uid formats if no match found
      if (!latitude && !longitude && kw_uid) {
        // Try with different kw_uid formats that might be in the coordinates map
        const alternativeKeys = [
          kw_uid.toString(),
          parseInt(kw_uid).toString(),
          `kw_${kw_uid}`,
          item.id?.toString(),
          item._id?.toString(),
          `id_${item.id}`,
          `id_${item._id}`
        ];
        
        for (const altKey of alternativeKeys) {
          if (altKey && coordinatesMap.has(altKey)) {
            const coords = coordinatesMap.get(altKey);
            latitude = coords.lat;
            longitude = coords.lng;
            //console.log(`✓ Agent ${item.first_name} ${item.last_name}: Found mapped coordinates with alternative key ${altKey}:`, latitude, longitude);
            break;
          }
        }
      }
      
      // Try email matching if still no coordinates found
      if (!latitude && !longitude && email) {
        const emailKeys = [
          email.toLowerCase(),
          `email_${email.toLowerCase()}`
        ];
        
        for (const emailKey of emailKeys) {
          if (coordinatesMap.has(emailKey)) {
            const coords = coordinatesMap.get(emailKey);
            latitude = coords.lat;
            longitude = coords.lng;
            //console.log(`✓ Agent ${item.first_name} ${item.last_name}: Found mapped coordinates with email ${email}:`, latitude, longitude);
            break;
          }
        }
      }
      
      // Second priority: Check for direct coordinates in agent data
      if (!latitude || !longitude) {
        if (item.coordinates_gp) {
          if (item.coordinates_gp.lat && item.coordinates_gp.lon) {
            latitude = item.coordinates_gp.lat;
            longitude = item.coordinates_gp.lon;
            //console.log(`Agent ${item.first_name} ${item.last_name}: Direct coordinates from coordinates_gp:`, latitude, longitude);
          } else if (item.coordinates_gp.coordinates && Array.isArray(item.coordinates_gp.coordinates)) {
            longitude = item.coordinates_gp.coordinates[0];
            latitude = item.coordinates_gp.coordinates[1];
            //console.log(`Agent ${item.first_name} ${item.last_name}: Direct array coordinates from coordinates_gp:`, latitude, longitude);
          }
        }
      }
      
      // Third priority: Check coordinates_gs
      if (!latitude || !longitude) {
        if (item.coordinates_gs) {
          if (item.coordinates_gs.lat && item.coordinates_gs.lon) {
            latitude = item.coordinates_gs.lat;
            longitude = item.coordinates_gs.lon;
            //console.log(`Agent ${item.first_name} ${item.last_name}: Direct coordinates from coordinates_gs:`, latitude, longitude);
          } else if (item.coordinates_gs.coordinates && Array.isArray(item.coordinates_gs.coordinates)) {
            longitude = item.coordinates_gs.coordinates[0];
            latitude = item.coordinates_gs.coordinates[1];
            //console.log(`Agent ${item.first_name} ${item.last_name}: Direct array coordinates from coordinates_gs:`, latitude, longitude);
          }
        }
      }
      
      // Fourth priority: City-level coordinates as fallback
      if (!latitude || !longitude) {
        const agentCity = item.city || item.work_city || item.office_city || item.address_city;
        if (agentCity) {
          const cityKey = `city_${agentCity.toLowerCase()}`;
          if (coordinatesMap.has(cityKey)) {
            const cityCoords = coordinatesMap.get(cityKey);
            latitude = cityCoords.lat;
            longitude = cityCoords.lng;
            //console.log(`Agent ${item.first_name} ${item.last_name}: Using city coordinates for ${agentCity}:`, latitude, longitude);
          }
        }
      }
      
      // Last resort: Direct lat/lng properties
      if (!latitude || !longitude) {
        latitude = item.latitude || item.lat;
        longitude = item.longitude || item.lng || item.lon;
        if (latitude && longitude) {
          //console.log(`Agent ${item.first_name} ${item.last_name}: Fallback direct coordinates:`, latitude, longitude);
        }
      }

      const agentData = {
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
        marketCenter: item.office_name || item.market_center || '',
        // Add coordinates from mapping or direct data
        latitude: latitude,
        longitude: longitude,
        coordinates: latitude && longitude ? [latitude, longitude] : null,
        // Add kw_uid for easy identification
        kw_uid: item.kw_uid
      };

      // Log agent with coordinates for debugging
      // if (latitude && longitude) {
      //   console.log(`✓ Agent with coordinates:`, agentData.name, `(${latitude}, ${longitude})`, `kw_uid: ${agentData.kw_uid}`);
      // } else {
      //   console.log(`⚠ Agent without coordinates:`, agentData.name, `City: ${agentData.city}`, `kw_uid: ${agentData.kw_uid}`);
      // }

      return agentData;
    });
  }, []);

  // Fetch initial agents with improved caching
  useEffect(() => {
    if (!cacheInitialized) return; // Wait for cache to initialize
    
    async function fetchAgents() {
      setLoading(true);
      setError(null);
      setLoadingProgress(10); // Initial progress

      try {
        setLoadingProgress(30); // Progress update
        const data = await fetchAgentsWithCache(1, 6); // Start with 6 agents for fastest initial load
        setLoadingProgress(60); // Progress update
        const mappedAgents = processAgentData(data);
        setLoadingProgress(80); // Progress update
        
        // Immediately update state for faster UI response
        setAllAgents(mappedAgents);
        setLoadingProgress(100); // Complete
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('agents-local-data', JSON.stringify(mappedAgents));
            localStorage.setItem('agents-local-timestamp', Date.now().toString());
          } catch (error) {
            // console.warn('Failed to save agents to localStorage:', error);
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
            //console.warn('Failed to load fallback agents:', fallbackError);
          }
        }
      } finally {
        setLoading(false);
        setLoadingProgress(0); // Reset progress
      }
    }

    fetchAgents();
  }, [fetchAgentsWithCache, processAgentData, cacheInitialized]);

  // Initialize market centers data
  // useEffect(() => {
  //   const mockMarketCenters = [
  //     {
  //       _id: 'mc1',
  //       name: t('Keller Williams Jasmin'),
  //       address: t('Dist, 2740 King Fahd Branch Road, as Sahafah 6403, Riyadh 13315'),
  //       phone: '09200-15671',
  //       email: 'info@kwsaudiarabia.com',
  //       city: t('Riyadh'),
  //       type: 'market_center'
  //     },
  //     {
  //       _id: 'mc2', 
  //       name: t('Keller Williams Jeddah'),
  //       address: t('Al Khalidiyyah, Jeddah 23421'),
  //       phone: '09200-15671',
  //       email: 'info@kwsaudiarabia.com',
  //       city: t('Jeddah'),
  //       type: 'market_center'
  //     }
  //   ];
  //   setAllMarketCenters(mockMarketCenters);
  // }, [t]);

  // Update displayed data when filters change - Use progressive loading
  const updateDisplayedData = useCallback(() => {
    if (filter === "agent") {
      // Progressive loading: show first N agents based on current page
      const startIndex = 0;
      const endIndex = currentPage * agentsPerPage;
      const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

      setAgents(paginatedAgents);
      setTotalAgents(filteredAgents.length);
      setHasNextPage(endIndex < filteredAgents.length);
      setHasPrevPage(false); // We're using progressive loading, not classic pagination
      setMarketCenters([]);
    } else if (filter === "market") {
      // When market filter is selected, show agents filtered by market center
      const startIndex = 0;
      const endIndex = currentPage * agentsPerPage;
      const paginatedAgents = filteredMarketCenters.slice(startIndex, endIndex);

      setAgents(paginatedAgents); // Show agents, not market centers
      setTotalAgents(filteredMarketCenters.length);
      setHasNextPage(endIndex < filteredMarketCenters.length);
      setHasPrevPage(false);
      setMarketCenters([]); // Clear market centers since we're showing agents
    }
  }, [filteredAgents, filteredMarketCenters, filter, currentPage, agentsPerPage]);

  // Memoize the displayed agents to prevent unnecessary re-renders
  const displayedAgents = useMemo(() => agents, [agents]);

  // Call updateDisplayedData when dependencies change
  useEffect(() => {
    updateDisplayedData();
  }, [updateDisplayedData]);

  // Optimized load more function
  const loadMoreAgents = useCallback(async () => {
    if (loadingMore || !allAgents.length) return;
    
    setLoadingMore(true);
    const nextPage = Math.floor(allAgents.length / 6) + 1; // Use 6 as page size for faster loading
    
    try {
      const data = await fetchAgentsWithCache(nextPage, 6);
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
           // console.warn('Failed to update agents in localStorage:', error);
          }
        }
        
        return updated;
      });
    } catch (err) {
      //console.warn('Error loading more agents:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, allAgents.length, fetchAgentsWithCache, processAgentData]);

  // Stabilize handleAgentClick with useCallback
  const handleAgentClick = useCallback((agent) => {
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
  }, [router]);

  // Stabilize handleMarketCenterClick with useCallback
  const handleMarketCenterClick = useCallback((center) => {
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
  }, [router]);

  // Stabilize setHoveredAgent to prevent re-renders (simplified like property page)
  const stableSetHoveredAgent = useCallback((agent) => {
    setHoveredAgent(agent);
  }, []);

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
                        onChange={() => {
                          setFilter("agent");
                          setCurrentPage(1); // Reset page when changing filter
                        }}
                        className="text-red-600 focus:ring-red-600"
                      />
                      <span data-translate>{t('Agent Name')}</span>
                    </label>
                    <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="market"
                        checked={filter === "market"}
                        onChange={() => {
                          setFilter("market");
                          setCurrentPage(1); // Reset page when changing filter
                        }}
                        className="text-red-600 focus:ring-red-600"
                      />
                      <span data-translate>{t('Market Center')}</span>
                    </label>
                  </div>

                  <div className="flex items-center border border-gray-300 relative">
                    <input
                      type="text"
                      placeholder={t(filter === "agent" ? "Enter Name" : "Enter City")}
                      className="flex-1 px-2 sm:px-3 py-2 sm:py-3 outline-none text-sm sm:text-base pr-10"
                      value={filterName}
                      onChange={(e) => {
                        const searchValue = e.target.value;
                        setFilterName(searchValue);
                        setCurrentPage(1); // Reset page when searching
                        
                        // Remove auto-switch logic to allow market center filtering
                        // if (searchValue.trim() && filter === "market") {
                        //   setFilter("agent");
                        // }
                      }}
                    />
                    {filterName && (
                      <button
                        className="absolute right-12 sm:right-16 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setFilterName("");
                          setFilterMarket("");
                          setFilterCity("");
                          setCurrentPage(1);
                          
                          // Clear URL search parameters as well
                          const url = new URL(window.location);
                          url.searchParams.delete('search');
                          router.replace(url.pathname, { scroll: false });
                        }}
                        title={t('Clear search')}
                      >
                        {/* <FaTimes size={14} /> */}
                      </button>
                    )}
                    <button 
                      className="bg-[rgb(206,32,39,255)] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center"
                      onClick={() => {
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
                        setCurrentPage(1); // Reset page when clearing search
                        
                        // Clear URL search parameters as well
                        const url = new URL(window.location);
                        url.searchParams.delete('search');
                        router.replace(url.pathname, { scroll: false });
                      }}
                      data-translate
                    >
                      {t('Clear my search')}
                    </button>
                  </div>
                </div>

                {/* Search notification banner */}
                {/* {(filterName || searchParams.get('search')) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaSearch className="text-blue-600" size={16} />
                      <span className="text-blue-800 text-sm">
                        {t('Showing results for')}: "<strong>{filterName || searchParams.get('search')}</strong>"
                      </span>
                    </div>
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      onClick={() => {
                        setFilterName("");
                        setFilterMarket("");
                        setFilterCity("");
                        setCurrentPage(1);
                        
                        // Clear URL search parameters as well
                        const url = new URL(window.location);
                        url.searchParams.delete('search');
                        router.replace(url.pathname, { scroll: false });
                      }}
                    >
                      <FaTimes size={12} />
                      {t('Clear')}
                    </button>
                  </div>
                )} */}

                {/* Conditional Rendering - Show agents or market centers */}
                <>
                  {/* Initial Loading State */}
                  {loading && currentPage === 1 && (
                    <div className="py-20 text-center">
                      <Spinner 
                        size="lg" 
                        color="red" 
                        text={t('Loading agents...')}
                        className="mb-4"
                      />
                      {/* {loadingProgress > 0 && (
                        <div className="max-w-xs mx-auto">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[rgb(206,32,39,255)] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${loadingProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{loadingProgress}% {t('loaded')}</p>
                        </div>
                      )} */}
                    </div>
                  )}
                  
                  {error && <div className="text-red-500 p-4 text-center">{error}</div>}

                  {!loading && !error && (filter === "agent" || filter === "market") && agents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {filter === "agent" ? t('No agents found.') : t('No agents found for the selected market center criteria.')}
                    </div>
                  )}

                  {/* Show Agents when filter is "agent" or "market" */}
                  {!loading && !error && (filter === "agent" || filter === "market") && agents.map((agent, idx) => {
                    // Try to get coordinates from agent object - use same priority as map component
                    let lat = null, lng = null;
                    
                    // First priority: coordinates from API
                    if (agent.latitude && agent.longitude) {
                      lat = agent.latitude;
                      lng = agent.longitude;
                    } 
                    // Second priority: direct lat/lng properties
                    else if (agent.lat && agent.lng) {
                      lat = agent.lat;
                      lng = agent.lng;
                    } 
                    // Third priority: location object
                    else if (agent.location && agent.location.lat && agent.location.lng) {
                      lat = agent.location.lat;
                      lng = agent.location.lng;
                    } 
                    // Fourth priority: coordinates array
                    else if (agent.coordinates && Array.isArray(agent.coordinates) && agent.coordinates.length === 2) {
                      lat = agent.coordinates[0];
                      lng = agent.coordinates[1];
                    }
                    // Fifth priority: Try to use city coordinates as fallback (same as map)
                    else if (agent.city) {
                      // Add some default city coordinates for major Saudi cities
                      const cityCoordinates = {
                        'riyadh': { lat: 24.7136, lng: 46.6753 },
                        'jeddah': { lat: 21.4225, lng: 39.8262 },
                        'mecca': { lat: 21.3891, lng: 39.8579 },
                        'medina': { lat: 24.5247, lng: 39.5692 },
                        'dammam': { lat: 26.4282, lng: 50.1020 },
                        'khobar': { lat: 26.2172, lng: 50.1971 },
                        'dhahran': { lat: 26.2361, lng: 50.1455 },
                        'tabuk': { lat: 28.3998, lng: 36.5700 }
                      };
                      
                      const cityKey = agent.city.toLowerCase().trim();
                      if (cityCoordinates[cityKey]) {
                        lat = cityCoordinates[cityKey].lat + (Math.random() - 0.5) * 0.1; // Add small random offset
                        lng = cityCoordinates[cityKey].lng + (Math.random() - 0.5) * 0.1;
                      }
                    }
                    
                    // Create truly unique key by combining multiple identifiers with index
                    const uniqueKey = `agent-${idx}-${agent._id || 'unknown'}-${agent.name || 'unnamed'}-${agent.phone || 'no-phone'}`.replace(/\s+/g, '-');
                    
                    return (
                      <article
                        key={uniqueKey}
                        className={`p-3 sm:p-4 flex flex-row items-start gap-3 sm:gap-4 relative transition-all duration-200 hover:bg-gray-50 hover:shadow-md cursor-pointer ${idx !== agents.length - 1 ? 'border-b border-gray-300' : ''}`}
                        onMouseEnter={() => {
                          // Enhanced hover like properties - set agent with coordinates
                          if (lat && lng) {
                           // console.log(`🖱️ Hovering over agent: ${agent.name} at coordinates:`, lat, lng);
                            setHoveredAgent({ 
                              ...agent, 
                              latitude: lat, 
                              longitude: lng,
                              // Add flag to indicate this came from sidebar hover
                              fromSidebar: true
                            });
                          } else {
                            //console.log(`⚠️ Agent ${agent.name} has no coordinates to show on map - City: ${agent.city}`);
                            // Even without exact coordinates, try to show something on map if we have city
                            if (agent.city) {
                             // console.log(`📍 Trying to show ${agent.name} using city fallback`);
                              setHoveredAgent({ 
                                ...agent, 
                                latitude: lat || 24.7136, // Riyadh fallback
                                longitude: lng || 46.6753,
                                fromSidebar: true,
                                isFallback: true
                              });
                            }
                          }
                        }}
                        onMouseLeave={() => {
                          // Simple leave like properties - clear hover state unless fixed
                          //console.log(`🖱️ Left agent: ${agent.name}`);
                          setHoveredAgent(prev => {
                            // If current hovered agent is fixed, don't clear it
                            if (prev && prev.fixed && prev._id === agent._id) {
                              ////console.log(`🔒 Agent ${agent.name} is fixed, not clearing hover`);
                              return prev;
                            }
                            // Clear hover state
                          //  console.log(`🧹 Clearing hover for agent: ${agent.name}`);
                            return null;
                          });
                        }}
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
                  {/* {!loading && !error && filter === "market" && marketCenters.map((center, idx) => (
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
                  ))} */}

                  {/* Load More Button - similar to Properties.js */}
                  {!loading && hasNextPage && (
                    <div className="flex justify-center mt-4 sm:mt-6">
                      <button
                        className="px-4 sm:px-6 py-2 font-semibold bg-gray-500 text-white text-sm sm:text-base disabled:opacity-50 transition-colors"
                        onClick={() => {
                          if (filter === "agent" || filter === "market") {
                            // Check if we need to load more data from API
                            const currentlyShown = agents.length;
                            if (currentlyShown >= allAgents.length - 2) { // Load more when close to end
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
                          t("Show More Agents")
                        )}
                      </button>
                    </div>
                  )}
                </>
              </div>
            </div>

            {/* Right: Sticky Map */}
            <div className="pl-0 my-6 md:my-10 sticky md:top-20 h-[300px] sm:h-[400px] md:h-[calc(100vh-5rem)]">
              <div 
                className="relative w-full overflow-hidden border border-gray-200 h-full"
                data-testid="agent-map-container"
              >
                <AgentMap
                  isLoaded={isLoaded}
                  agents={displayedAgents}
                  hoveredAgent={hoveredAgent}
                  setHoveredAgent={stableSetHoveredAgent}
                  desktopMap={desktopMap}
                  setDesktopMap={setDesktopMap}
                  setMapProjection={setMapProjection}
                  mapProjection={mapProjection}
                  getOffsetCoords={getOffsetCoords}
                  handleAgentClick={handleAgentClick}
                  filterName={filterName} // Pass filterName for dynamic map centering
                  t={t}
                />
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