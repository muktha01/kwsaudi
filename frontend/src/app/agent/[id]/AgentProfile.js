'use client';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapPin, Building2, Phone, Mail } from 'lucide-react';
import NewFooter from '@/components/newfooter'
import { FaArrowLeft,FaQuoteLeft ,FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import Header from '@/components/header';
import { dancing } from '@/app/layout';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';

const AgentProfile = (props) => {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id;
  const { t, isRTL, language } = useTranslation();
  
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [combinedApiData, setCombinedApiData] = useState(null); // Cache combined API response
  const [agentsWithPropertiesData, setAgentsWithPropertiesData] = useState(null); // Cache new API response
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [retryCount, setRetryCount] = useState(0);
  const [agentProperties, setAgentProperties] = useState([]);
const [sellEmail, setSellEmail] = useState("");
const [buyEmail, setBuyEmail] = useState("");
  const [sellEmailError, setSellEmailError] = useState("");
  const [buyEmailError, setBuyEmailError] = useState("");
  // Add refs for abort controllers to cancel pending requests
  const agentAbortController = useRef(null);
  const propertiesAbortController = useRef(null);
  const enhancedApiAbortController = useRef(null);

  // Add simple in-memory cache
  const cacheRef = useRef(new Map());

  // Icon URLs
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";
  
  // Optimized function to retry fetching properties
  const retryFetchProperties = useCallback(() => {
    if (retryCount >= 3) {
      setError(t('Maximum retry attempts reached. Please refresh the page.'));
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setError(null);
    setPropertiesLoading(true);
    
    // Clear cache for this agent to force fresh fetch
    const cacheKeys = [
      `enhanced_agent_${agentId}`,
      `agent_properties_${agent?.kw_uid}`,
      `combined_properties_${agent?.kw_uid}`,
      `properties_${agentId}`,
      `agent_${agentId}`
    ];
    cacheKeys.forEach(key => cacheRef.current.delete(key));
    
    // console.log(`Retrying... Attempt ${retryCount + 1}/3`);
  }, [retryCount, agentId, agent?.kw_uid,t]);

  // Cleanup effect for component unmount
  // useEffect(() => {
  //   return () => {
  //     // Cancel all pending requests on unmount
  //     if (agentAbortController.current) {
  //       agentAbortController.current.abort();
  //     }
  //     if (propertiesAbortController.current) {
  //       propertiesAbortController.current.abort();
  //     }
  //     if (enhancedApiAbortController.current) {
  //       enhancedApiAbortController.current.abort();
  //     }
  //   };
  // }, []);

  // Initialize component when agentId changes
  useEffect(() => {
    if (agentId) {
      // Reset loading states for new agent
      setLoading(true);
      setPropertiesLoading(true);
      setInitialLoadComplete(false);
      setError(null);
      
      // Clear previous agent data if it's for a different agent
      if (agent && (agent.kw_uid !== agentId && agent._id !== agentId)) {
        setAgent(null);
        // Don't immediately clear properties - let the data fetching effect handle this
        // This prevents the brief "no properties found" flash
      }
    }
  }, [agentId]); // This will run when navigating to a new agent
  const agentBios = {
    1: {
      text: `
        As a proud member of Keller Williams Saudi Arabia, I am committed to providing personalized, professional, and client-focused real estate services. 
        My knowledge of the local market, paired with a global network, allows me to guide buyers, sellers, and investors toward informed decisions and successful outcomes. 
        Saudi Arabia’s Vision 2030 drives me to contribute to our nation’s growth by helping families and businesses find properties that meet their needs, enhance their lifestyles, and support long-term prosperity.
      `
    },
    2: {
      text: `
        At Keller Williams Saudi Arabia, I dedicate myself to delivering exceptional results through honesty, transparency, and market expertise. 
        My approach is rooted in understanding each client’s unique goals and creating a seamless real estate experience. 
        With Vision 2030 transforming our cities into world-class hubs, I take pride in connecting people to properties that align with both their personal aspirations and the Kingdom’s bright future.
      `
    },
    3: {
      text: `
        As a real estate professional with Keller Williams Saudi Arabia, I combine in-depth market insights with a people-first philosophy to create meaningful property solutions. 
        I believe real estate is more than transactions — it’s about building lasting relationships and helping clients achieve their dreams. 
        In this era of transformation under Vision 2030, I am inspired to support the growth of vibrant communities by helping individuals and families secure homes and investments that stand the test of time.
      `
    },
    4: {
      text: `
        Working with Keller Williams Saudi Arabia allows me to bring world-class real estate practices to our rapidly evolving market. 
        My mission is to empower clients with the knowledge and resources they need to make confident property decisions. 
        Saudi Arabia’s Vision 2030 fuels my passion for contributing to the nation’s development, whether by assisting a family in finding their perfect home or guiding an investor toward high-potential opportunities.
      `
    },
    5: {
      text: `
        At Keller Williams Saudi Arabia, I approach every client relationship with integrity, dedication, and a genuine desire to help. 
        By blending local expertise with global standards, I provide a real estate experience that is both personalized and results-driven. 
        The energy of Vision 2030 motivates me to connect people with properties that contribute to their success and play a role in shaping the Kingdom’s future landscape.
      `
    },
    6: {
      text: `
        As part of Keller Williams Saudi Arabia, I am passionate about guiding clients through one of life’s most important decisions — buying or selling a property. 
        My focus is on understanding needs, anticipating challenges, and delivering solutions that exceed expectations. 
        The rapid progress of Vision 2030 inspires me to help build communities that reflect the ambition, innovation, and diversity of our great nation.
      `
    },
    7: {
      text: `
        Proudly representing Keller Williams Saudi Arabia, I am committed to offering expert guidance and unwavering support throughout every step of the real estate process. 
        I work to ensure that each transaction is handled with professionalism, care, and attention to detail. 
        Vision 2030’s transformative projects and urban expansion drive my commitment to helping clients invest wisely and secure homes that enhance their quality of life.
      `
    },
    8: {
      text: `
        As a real estate agent with Keller Williams Saudi Arabia, I aim to simplify the complex world of property transactions. 
        By combining market analysis, negotiation skills, and client-focused service, I help people make informed and confident choices. 
        Inspired by Vision 2030, I take pride in contributing to the Kingdom’s growth by matching clients with properties that offer both immediate value and long-term potential.
      `
    },
    9: {
      text: `
        At Keller Williams Saudi Arabia, I believe in creating real estate experiences that are as rewarding as the results themselves. 
        My goal is to understand each client’s unique story and translate that into the perfect property match. 
        With Vision 2030 reshaping our cities, I am motivated to help families, investors, and entrepreneurs secure properties that align with both their dreams and the nation’s future.
      `
    },
    10: {
      text: `
        Representing Keller Williams Saudi Arabia, I am dedicated to providing exceptional service that blends market expertise with a personal touch. 
        I focus on building trust, offering honest advice, and delivering outstanding results. 
        Saudi Arabia’s Vision 2030 inspires me to actively contribute to our growing real estate sector by connecting people to homes and investments that reflect the Kingdom’s ambition.
      `
    },
    11: {
      text: `
        Being part of Keller Williams Saudi Arabia allows me to serve clients with a blend of local insight and international best practices. 
        I am driven by a commitment to help people navigate the market with confidence and clarity. 
        Vision 2030’s transformative goals encourage me to help shape the future of our communities by guiding clients toward properties that enrich their lives and secure their futures.
      `
    },
    12: {
      text: `
        As a real estate professional at Keller Williams Saudi Arabia, I view my role as more than selling properties — it’s about guiding people toward opportunities that truly make a difference in their lives. 
        In alignment with Vision 2030, I strive to help clients find properties that not only meet their immediate needs but also position them to benefit from the Kingdom’s long-term growth.
      `
    },
    13: {
      text: `
        At Keller Williams Saudi Arabia, I am committed to excellence in every transaction. 
        I focus on listening to my clients, understanding their vision, and working tirelessly to make it a reality. 
        With Vision 2030 driving urban innovation and development, I take pride in helping clients secure properties that are part of this exciting transformation.
      `
    },
    14: {
      text: `
        Proud to be part of Keller Williams Saudi Arabia, I believe that successful real estate service is built on trust, expertise, and genuine care for each client’s goals. 
        The opportunities emerging from Vision 2030 motivate me to guide clients toward properties that will grow in value, enhance their lifestyles, and contribute to the Kingdom’s evolving landscape.
      `
    },
    15: {
      text: `
        As a representative of Keller Williams Saudi Arabia, I bring passion, professionalism, and market knowledge to every client I serve. 
        My mission is to make the process of buying, selling, or investing as smooth and rewarding as possible. 
        Vision 2030’s blueprint for the Kingdom’s future inspires me to help people find properties that reflect both their aspirations and the exciting new era of growth and innovation in Saudi Arabia.
      `
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  // Helper function to format price
  const getAgentBio = (agent) => {
    const bioTexts = {
      1: "As a proud member of Keller Williams Saudi Arabia, I am committed to providing personalized, professional, and client-focused real estate services. My knowledge of the local market, paired with a global network, allows me to guide buyers, sellers, and investors toward informed decisions and successful outcomes. Saudi Arabia's Vision 2030 drives me to contribute to our nation's growth by helping families and businesses find properties that meet their needs, enhance their lifestyles, and support long-term prosperity.",
      2: "At Keller Williams Saudi Arabia, I dedicate myself to delivering exceptional results through honesty, transparency, and market expertise. My approach is rooted in understanding each client's unique goals and creating a seamless real estate experience. With Vision 2030 transforming our cities into world-class hubs, I take pride in connecting people to properties that align with both their personal aspirations and the Kingdom's bright future.",
      3: "As a real estate professional with Keller Williams Saudi Arabia, I combine in-depth market insights with a people-first philosophy to create meaningful property solutions. I believe real estate is more than transactions — it's about building lasting relationships and helping clients achieve their dreams. In this era of transformation under Vision 2030, I am inspired to support the growth of vibrant communities by helping individuals and families secure homes and investments that stand the test of time.",
      4: "Working with Keller Williams Saudi Arabia allows me to bring world-class real estate practices to our rapidly evolving market. My mission is to empower clients with the knowledge and resources they need to make confident property decisions. Saudi Arabia's Vision 2030 fuels my passion for contributing to the nation's development, whether by assisting a family in finding their perfect home or guiding an investor toward high-potential opportunities.",
      5: "At Keller Williams Saudi Arabia, I approach every client relationship with integrity, dedication, and a genuine desire to help. By blending local expertise with global standards, I provide a real estate experience that is both personalized and results-driven. The energy of Vision 2030 motivates me to connect people with properties that contribute to their success and play a role in shaping the Kingdom's future landscape.",
      6: "As part of Keller Williams Saudi Arabia, I am passionate about guiding clients through one of life's most important decisions — buying or selling a property. My focus is on understanding needs, anticipating challenges, and delivering solutions that exceed expectations. The rapid progress of Vision 2030 inspires me to help build communities that reflect the ambition, innovation, and diversity of our great nation.",
      7: "Proudly representing Keller Williams Saudi Arabia, I am committed to offering expert guidance and unwavering support throughout every step of the real estate process. I work to ensure that each transaction is handled with professionalism, care, and attention to detail. Vision 2030's transformative projects and urban expansion drive my commitment to helping clients invest wisely and secure homes that enhance their quality of life.",
      8: "As a real estate agent with Keller Williams Saudi Arabia, I aim to simplify the complex world of property transactions. By combining market analysis, negotiation skills, and client-focused service, I help people make informed and confident choices. Inspired by Vision 2030, I take pride in contributing to the Kingdom's growth by matching clients with properties that offer both immediate value and long-term potential.",
      9: "At Keller Williams Saudi Arabia, I believe in creating real estate experiences that are as rewarding as the results themselves. My goal is to understand each client's unique story and translate that into the perfect property match. With Vision 2030 reshaping our cities, I am motivated to help families, investors, and entrepreneurs secure properties that align with both their dreams and the nation's future.",
      10: "Representing Keller Williams Saudi Arabia, I am dedicated to providing exceptional service that blends market expertise with a personal touch. I focus on building trust, offering honest advice, and delivering outstanding results. Saudi Arabia's Vision 2030 inspires me to actively contribute to our growing real estate sector by connecting people to homes and investments that reflect the Kingdom's ambition.",
      11: "Being part of Keller Williams Saudi Arabia allows me to serve clients with a blend of local insight and international best practices. I am driven by a commitment to help people navigate the market with confidence and clarity. Vision 2030's transformative goals encourage me to help shape the future of our communities by guiding clients toward properties that enrich their lives and secure their futures.",
      12: "As a real estate professional at Keller Williams Saudi Arabia, I view my role as more than selling properties — it's about guiding people toward opportunities that truly make a difference in their lives. In alignment with Vision 2030, I strive to help clients find properties that not only meet their immediate needs but also position them to benefit from the Kingdom's long-term growth.",
      13: "At Keller Williams Saudi Arabia, I am committed to excellence in every transaction. I focus on listening to my clients, understanding their vision, and working tirelessly to make it a reality. With Vision 2030 driving urban innovation and development, I take pride in helping clients secure properties that are part of this exciting transformation.",
      14: "Proud to be part of Keller Williams Saudi Arabia, I believe that successful real estate service is built on trust, expertise, and genuine care for each client's goals. The opportunities emerging from Vision 2030 motivate me to guide clients toward properties that will grow in value, enhance their lifestyles, and contribute to the Kingdom's evolving landscape.",
      15: "As a representative of Keller Williams Saudi Arabia, I bring passion, professionalism, and market knowledge to every client I serve. My mission is to make the process of buying, selling, or investing as smooth and rewarding as possible. Vision 2030's blueprint for the Kingdom's future inspires me to help people find properties that reflect both their aspirations and the exciting new era of growth and innovation in Saudi Arabia."
    };

    if (!agent) return t(bioTexts[1]);
    
    // Get agent ID or create a hash from agent properties for consistent bio assignment
    let agentIdentifier = 0;
    
    // Try to get a numeric ID first
    if (agent.id && !isNaN(agent.id)) {
      agentIdentifier = parseInt(agent.id);
    } else if (agent.agent_id && !isNaN(agent.agent_id)) {
      agentIdentifier = parseInt(agent.agent_id);
    } else if (agent.list_id && !isNaN(agent.list_id)) {
      agentIdentifier = parseInt(agent.list_id);
    } else if (agent.kw_id && !isNaN(agent.kw_id)) {
      agentIdentifier = parseInt(agent.kw_id);
    } else {
      // If no numeric ID, create a hash from agent name/email for consistent assignment
      const agentString = (agent.name || agent.fullName || agent.email || 'default').toString();
      for (let i = 0; i < agentString.length; i++) {
        agentIdentifier += agentString.charCodeAt(i);
      }
    }
    
    // Cycle through the 15 bios: agent 1 gets bio 1, agent 16 gets bio 1 again, etc.
    const bioIndex = ((agentIdentifier - 1) % 15) + 1;
    
    return t(bioTexts[bioIndex] || bioTexts[1]);
  };

  // Single effect to handle all data fetching for the agent
  useEffect(() => {
    if (!agentId) return;

    const fetchAgentAndProperties = async () => {
      // Check if we have cached properties first
      const propertiesCacheKey = `properties_${agentId}`;
      if (cacheRef.current.has(propertiesCacheKey)) {
        const cachedProperties = cacheRef.current.get(propertiesCacheKey);
        if (cachedProperties && cachedProperties.length > 0) {
          setAgentProperties(cachedProperties);
          setProperties(cachedProperties);
          setFilteredProperties(cachedProperties);
          setPropertiesLoading(false);
          setInitialLoadComplete(true);
          return;
        }
      }

      // Start fresh fetch
      setPropertiesLoading(true);
      
      try {
        // console.log(`Starting to fetch properties for agent ${agentId}`);
        
        // Cancel any previous request
        if (enhancedApiAbortController.current) {
          enhancedApiAbortController.current.abort();
        }

        // Create new abort controller
        enhancedApiAbortController.current = new AbortController();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/agents/kw/agents/property-counts?offset=0&limit=100`,
          {
            signal: enhancedApiAbortController.current.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Find the agent that matches the current agentId
          const selectedAgent = data.agentsWithProperties?.find(
            (agent) => agent.kw_uid?.toString() === agentId?.toString()
          );

          if (selectedAgent) {
            const properties = selectedAgent.properties || [];
            
            setAgentProperties(properties);
            setProperties(properties);
            setFilteredProperties(properties);

            // Cache the properties
            if (properties.length > 0) {
              cacheRef.current.set(propertiesCacheKey, properties);
              // console.log(`Cached ${properties.length} properties for agent ${agentId}`);
            }

            // Limit cache size
            if (cacheRef.current.size > 50) {
              const firstKey = cacheRef.current.keys().next().value;
              cacheRef.current.delete(firstKey);
            }
          } else {
            setAgentProperties([]);
            setProperties([]);
            setFilteredProperties([]);
          }

          // Store full agents data for agent details
          setAgentsWithPropertiesData(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          // console.log('Enhanced API fetch aborted');
          return;
        }
        // console.error("Error fetching properties:", error);
        setAgentProperties([]);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setPropertiesLoading(false);
        setInitialLoadComplete(true);
      }
    };

    fetchAgentAndProperties();

    // Cleanup function
    return () => {
      if (enhancedApiAbortController.current) {
        enhancedApiAbortController.current.abort();
      }
    };
  }, [agentId]); // Only depend on agentId
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
       alert("Download failed");
     } finally {
       setLoading(false);
     }
   };
  // Removed redundant properties fetching effect - now consolidated into main effect above

  useEffect(() => {
    // Fetch agent data using ID from URL params
    const fetchAgentData = async () => {
      if (!agentId) {
        setError(t('No agent ID provided.'));
        setLoading(false);
        return;
      }

      // Cancel any previous request
      if (agentAbortController.current) {
        agentAbortController.current.abort();
      }

      // Create new abort controller
      agentAbortController.current = new AbortController();
      
      setLoading(true);
      setError(null);
      
      try {
        // console.log('Fetching agent data for ID:', agentId);
        
        // Check cache first
        const cacheKey = `agent_${agentId}`;
        if (cacheRef.current.has(cacheKey)) {
          const cachedAgent = cacheRef.current.get(cacheKey);
          setAgent(cachedAgent);
          if (cachedAgent.image) setImgSrc(cachedAgent.image);
          setLoading(false);
          // console.log('Using cached agent data:', cachedAgent);
          return;
        }
        
        // First check if agent data is available in localStorage (from property details page)
        const storedAgent = localStorage.getItem('selectedAgent');
        if (storedAgent) {
          try {
            const agentData = JSON.parse(storedAgent);
            // Check if the stored agent matches the current agentId
            const storedId = String(agentData._id || '');
            const storedKwId = String(agentData.kw_id || '');
            const storedKwUid = String(agentData.kw_uid || '');
            const storedId2 = String(agentData.id || '');
            const currentId = String(agentId);
            
            if (storedId === currentId || storedKwId === currentId || storedKwUid === currentId || storedId2 === currentId) {
              // console.log('Using stored agent data:', agentData);
              setAgent(agentData);
              if (agentData.image) setImgSrc(agentData.image);

              // Cache the localStorage data
              cacheRef.current.set(cacheKey, agentData);
              
              setLoading(false);
              return;
            }
          } catch (e) {
            // console.log('Error parsing stored agent data:', e);
          }
        }
        
        // Try to find agent in enhanced API data first (faster)
        if (agentsWithPropertiesData && agentsWithPropertiesData.success) {
          // console.log('Searching in enhanced API data...');
          
          // Safely handle the arrays
          const agentsWithProps = Array.isArray(agentsWithPropertiesData.agentsWithProperties) 
            ? agentsWithPropertiesData.agentsWithProperties 
            : [];
          const agentsWithoutProps = Array.isArray(agentsWithPropertiesData.agentsWithoutProperties) 
            ? agentsWithPropertiesData.agentsWithoutProperties 
            : [];
            
          const allEnhancedAgents = [...agentsWithProps, ...agentsWithoutProps];
          
          const foundEnhancedAgent = allEnhancedAgents.find(agent =>
            agent.kw_uid === agentId ||
            agent._id === agentId ||
            String(agent._id) === String(agentId)
          );
          
          if (foundEnhancedAgent) {
            // console.log('Found agent in enhanced API:', foundEnhancedAgent);
            const mappedAgent = {
              name: foundEnhancedAgent.name,
              phone: foundEnhancedAgent.phone,
              email: foundEnhancedAgent.email,
              city: foundEnhancedAgent.city,
              image: foundEnhancedAgent.photo || foundEnhancedAgent.image,
              _id: foundEnhancedAgent._id,
              marketCenter: foundEnhancedAgent.market_center_number || "",
              kw_uid: foundEnhancedAgent.kw_uid,
              kw_id: foundEnhancedAgent.kw_uid // Keep backward compatibility
            };
            
            setAgent(mappedAgent);
            if (mappedAgent.image) setImgSrc(mappedAgent.image);

            // Cache the enhanced API data
            cacheRef.current.set(cacheKey, mappedAgent);
            
            setLoading(false);
            return;
          }
        }

        // Only fetch from slow API if enhanced API didn't work
        // console.log('Falling back to combined API...');
        
        // Add timeout - shorter for better UX
        const timeoutId = setTimeout(() => {
          agentAbortController.current?.abort();
        }, 7000); // Reduced to 7 seconds
        
        // If no stored data or no match, fetch from API
        const agentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/combined-data?offset=0&limit=100`, {
          signal: agentAbortController.current.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        clearTimeout(timeoutId);
        
        if (agentRes.ok) {
          const agentData = await agentRes.json();
          // console.log('Agents API response received');
          
          // Cache the combined API data for use in properties extraction
          setCombinedApiData(agentData);
          
          if (agentData.success && agentData.results) {
            // Extract agents from people results
            let allAgents = [];
            
            agentData.results.forEach(result => {
              if (result.success && result.type.includes('people_org') && result.data?.data) {
                allAgents = allAgents.concat(result.data.data);
              }
            });
            
            // Find the specific agent by ID
            const foundAgent = allAgents.find(a => 
              a.kw_uid === agentId || 
              a._id === agentId || 
              a.id === agentId
            );
        
            
            if (foundAgent) {
              const mappedAgent = {
                name: foundAgent.full_name || `${foundAgent.first_name || ''} ${foundAgent.last_name || ''}`.trim(),
                phone: foundAgent.phone || foundAgent.phoneNumber,
                email: foundAgent.email || foundAgent.emailAddress,
                city: foundAgent.city,
                image: foundAgent.photo || foundAgent.profileImage || foundAgent.image,
                _id: foundAgent._id || foundAgent.id,
                marketCenter: foundAgent.market_center_number || foundAgent.marketCenter || "",
                kw_uid: foundAgent.kw_uid,
                kw_id: foundAgent.kw_uid // Keep backward compatibility
              };
              
              setAgent(mappedAgent);
              if (mappedAgent.image) setImgSrc(mappedAgent.image);

              // Cache the API data
              cacheRef.current.set(cacheKey, mappedAgent);
              // Limit cache size
              if (cacheRef.current.size > 50) {
                const firstKey = cacheRef.current.keys().next().value;
                cacheRef.current.delete(firstKey);
              }

              // console.log('Agent found and set:', mappedAgent);
            } else {
              setError(t('Agent not found.'));
            }
          } else {
            setError(t('Failed to load agent data.'));
          }
        } else {
          throw new Error(`Failed to fetch agent data: ${agentRes.status}`);
        }
      } catch (e) {
        if (e.name === 'AbortError') {
          // console.log('Agent fetch aborted');
          return;
        }
        // console.error('Error fetching agent data:', e);
        setError(`${t('Failed to load agent data')}: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (agentId) {
      fetchAgentData();
    }

    // Cleanup function
    return () => {
      if (agentAbortController.current) {
        agentAbortController.current.abort();
      }
    };
  }, [agentId, agentsWithPropertiesData, t]);
  
  // Update filteredProperties when properties change - consolidated into main effects above

  // Removed redundant combined API extraction effect - all data fetching is now consolidated in the main effect above

  // Add a failsafe timeout to ensure propertiesLoading is always set to false
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (propertiesLoading) {
        // console.log('Timeout: Setting propertiesLoading to false after 8 seconds');
        setPropertiesLoading(false);
        // If no properties were loaded, set empty array to avoid infinite loading
        if (properties.length === 0) {
          // console.log('No properties found after timeout, setting empty array');
          setProperties([]);
          setAgentProperties([]);
          setFilteredProperties([]);
        }
      }
    }, 8000); // Reduced to 8 second timeout for better UX

    return () => clearTimeout(timeoutId);
  }, [propertiesLoading, properties.length, initialLoadComplete]);

  if (error) {
    return (
      <div className='relative p-6 md:p-8'>
        <Header />
        <div className='text-center bg-[rgb(206,32,39,255)] py-20'>{error}</div>
        <NewFooter />
      </div>
    );
  }
  
  if (loading && !agent) {
    return (
      <div className='relative p-6 md:p-8'>
        <Header />
        <div className='flex flex-col justify-center items-center h-60 space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600'></div>
          <p className="text-gray-600 text-lg">{t("Loading agent profile...")}</p>
          {retryCount > 0 && (
            <p className="text-gray-500 text-sm">{t("Retry attempt")} {retryCount}/3</p>
          )}
        </div>
        <NewFooter />
      </div>
    );
  }
  
  if (!agent) {
    return (
      <div className='relative p-6 md:p-8'>
        <Header />
        <div className='text-center bg-[rgb(206,32,39,255)] py-20'>
          {error || t('Agent not found')}
        </div>
        <NewFooter />
      </div>
    );
  }

  return (
    <div>
    
    
    <div className='relative p-6 md:p-8 '>
      <Header />
      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

<div className="relative bg-gray-100 px-4 md:px-20 py-4 md:py-10">
  {/* Top Header */}
  <div className="w-full flex flex-col md:flex-row items-start md:px-10 md:items-center justify-between gap-4 md:gap-0">
    {/* Back Button */}
    {/* <div className="flex items-center gap-2 md:mt-30 mt-20 px-4 border rounded-full border-[rgb(206,32,39,255)] py-1 bg-[rgb(206,32,39,255)] h-10">
      <button 
        onClick={() => router.push('/agent')}
        className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full bg-white border border-white text-[rgb(206,32,39,255)] hover:bg-gray-100 cursor-pointer"
      >
        <FaArrowLeft className="w-2 h-2 md:w-3 md:w-3" />
      </button>
      <button 
        onClick={() => router.push('/agent')}
        className="text-[0.6rem] md:text-xs text-white font-medium cursor-pointer hover:text-gray-200 transition-colors"
      >
        Back to Agents
      </button>
    </div> */}
  </div>
  <p className="font-semibold  pt-20 text-[rgb(206,32,39,255)] text-2xl md:px-10"> {agent.name || agent.fullName || ''}</p>
  <p className="font-semibold text-gray-600 text-lg md:px-10"> {t("Keller Williams" )} {agent.city || ''}</p>
  {/* Agent Card Section */}
  <div className="hidden md:flex flex-col md:flex-row md:mt-6 mt-20 shadow-xl rounded-3xl overflow-hidden  w-full">
    {/* Left Section */}
    <div className="w-full text-white px-6 sm:px-10 lg:px-16 bg-[rgb(206,32,39,255)] min-h-[80vh] flex flex-col justify-center">
  {/* Left Section */}
  <div className="text-center md:text-left">
   <h1
  className={`text-xl sm:text-2xl lg:text-3xl break-words mt-6 sm:mt-2 ${
    isRTL ? "text-right" : "text-left"
  }`}
>
      {t("Property Sales in Saudi Arabia")}
    </h1>

    <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">{t("Property Expert")}</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || ''}</span>
      </div>

      {/* Powered by */}
      <div className="flex mt-6 sm:mt-8 lg:mt-30">
  <Image
    src="/powerdby.png"   // your single combined image
    alt={t("Powered by Keller Williams")}
    width={250}
    height={80}
    className="h-auto w-auto"
  />
</div>
  </div>
</div>
</div>

{/* Right Section */}
<div className="w-full relative flex items-center justify-center bg-[rgb(206,32,39,255)] mt-8 md:mt-0">
  {/* Optional Background Split for Desktop */}
  <div className="hidden md:flex absolute inset-0">
    <div className="w-1/2 bg-[rgb(206,32,39,255)]"></div>
    <div className="w-1/2 bg-gray-400"></div>
  </div>

  {/* Agent Image */}
  <div className="relative z-10 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 w-48 h-56 sm:w-64 sm:h-64 lg:w-100 lg:h-100 aspect-square">
    <Image
      src={agent.image || '/avtar.jpg'}
      alt={agent.name || agent.fullName || 'Agent'}
      fill
      className="object-cover"
    />
  </div>
  </div>
</div>




{/* Mobile-Only Agent Card Box */}
<div className="flex flex-col bg-[rgb(206,32,39,255)] text-white shadow-lg rounded-2xl gap-4 mt-4 md:hidden">
  {/* Agent Image */}
  <div className="w-40 h-40 mx-auto mt-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
  
      <Image
       src={agent.image||'/avtar.jpg'}
        alt={agent.name || agent.fullName || 'Agent'}
        width={160}
        height={160}
        className="object-cover w-full h-full"
       
      />
   
  </div>

  {/* Agent Info */}
  <div className="text-center space-y-2  px-10">
    <h2 className="text-xl text-white uppercase ">{t("Property Sales in Saudi Arabia")}</h2>
  
  </div>

  {/* Info Items */}
  <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">{t("Property Expert")}</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || '-'}</span>
      </div>

      {/* Powered by */}
      <div className="flex items-center justify-center mt-6 mb-4 sm:mt-8 lg:mt-30">
  <Image
    src="/powerdby.png"   // your single combined image
    alt={t("Powered by Keller Williams")}
    width={250}
    height={80}
    className="h-auto w-auto"
  />
</div>

 </div>
  </div>
  


  </div>
  <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
  <p className="text-2xl md:text-4xl font-semibold">
    <span className="text-[rgb(206,32,39,255)]">{t("Sell your home with")} </span>
    <span>
  {(() => {
    const fullName = agent?.name || agent?.fullName || "-";
    const parts = fullName.split(" "); // split by space
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" "); // supports multiple surnames

    return (
      <>
        <span className="text-gray-500">{firstName}</span>{" "}
        <span className="text-[rgb(206,32,39,255)] font-semibold">{lastName}</span>
      </>
    );
  })()}
</span>

  </p>
</div>

<div className="flex flex-col md:flex-row items-center justify-center mt-4 gap-2 md:gap-6 px-4 text-center md:text-left">
  {/* Phone */}
  <span className="flex items-center gap-1 text-gray-500 text-base md:text-lg">
    {t("Call :")}
    <span className="text-[rgb(206,32,39,255)]">{agent?.phone || "-"}</span>
  </span>

  {/* Divider for desktop */}
  <span className="hidden md:inline border-l h-5 border-gray-400"></span>

  {/* Email */}
<span className="flex flex-wrap items-center gap-1 text-gray-500 text-base md:text-lg">
  {t('Email')}:
  <span className="text-[rgb(206,32,39,255)] break-all">{agent?.email || ""}</span>
</span>




  {/* Divider for desktop */}
  <span className="hidden md:inline border-l h-5 border-gray-400"></span>

  {/* KW UID */}
  <span className="flex items-center gap-1 text-gray-500 text-base md:text-lg">
    {t("Kw UID :")}
    <span className="text-[rgb(206,32,39,255)]">
      {agentId|| t('Not specified')}
    </span>
  </span>
  

</div>
   <div className="flex justify-center items-stretch mx-2 md:mx-10 bg-white py-10 md:py-30 ">
  <div className="grid grid-cols-1 md:grid-cols-2 w-full ">
    {/* Left Red Box - Sell Home */}
    <div className="bg-[rgb(206,32,39,255)] text-white p-4 md:p-14 relative flex flex-col md:min-h-[420px] min-h-[400px]">
      {/* Content */}
      <div className="pb-24">
        <p
          className={`text-base md:text-[1.6rem] font-normal mb-6 pl-3 ${
            isRTL ? "border-r-8 pr-3" : "border-l-8 pl-3"
          } border-white`}
        >
          {t("Download guide")}
        </p>
        <h2 className="text-2xl md:text-[2.5rem] font-bold mb-4 md:mb-6">
          {t("How to sell your home")}
        </h2>
        <p className="text-base md:text-[1.4rem] mb-4 md:mb-6">
          {t(
            "The guide to selling a property will advise not only on the process but also how you can be super prepared and help to achieve the highest sale price."
          )}
        </p>
      </div>
      {/* Input Group - Responsive */}
  <div
  className={`absolute md:bottom-18 bottom-6 w-full ${
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
            className="w-full px-4 py-2 bg-white text-black text-lg outline-none"
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
            className="cursor-pointer hover:text-black bg-black hover:bg-gray-300 text-white px-8 py-2 text-lg font-semibold border-black disabled:opacity-50"
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
            className={`text-base md:text-[1.6rem] font-normal mb-6 pl-3 ${
              isRTL ? "border-r-8 pr-3" : "border-l-8 pl-3"
            } border-white`}
          >
            {t("Download guide")}
          </p>
          <h2 className="text-2xl md:text-[2.5rem] font-bold mb-4 md:mb-6">
            {t("How to buy a home")}
          </h2>
          <p className="text-base md:text-[1.4rem] mb-4 md:mb-6">
            {t(
              "The following guide to buying a property will explain how to position yourself to negotiate the best price, but importantly ensure you are the winning bidder when up against the competition."
            )}
          </p>
        </div>
        {/* Input Group - Responsive */}
      <div
  className={`absolute md:bottom-18 bottom-6 w-full ${
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
              className="w-full px-4 py-2 bg-white text-black text-lg outline-none"
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
              className="cursor-pointer hover:text-black bg-black hover:bg-gray-300 text-white px-4 md:px-8 py-2 text-lg font-semibold border-black disabled:opacity-50"
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
<div className="w-full px-6 md:px-12 lg:px-20">
  {/* About Section */}
  <div className="flex flex-col md:flex-row ">
    {/* Left Tab */}
    <div className="w-full md:w-1/4">
      <div className="bg-gray-200 border-gray-200 p-3 text-center font-medium">
       <p className='bg-white p-2 font-semibold text-lg'> {t("About")} {agent.name || agent.fullName || '-'}</p>
      </div>
    </div>

    {/* Right Content */}
    <div className="w-full md:w-3/4">
      <div className="rounded-md shadow-md p-6">
        {/* Welcome Title */}
        <h2 className={`${dancing.className} text-3xl mb-4`}>
  {t("Welcome")}
</h2>

        {/* Paragraph */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          {getAgentBio(agent)}
        </p>

        {/* Signature */}
        <p className={`${dancing.className} text-3xl`}>
        {agent.name || agent.fullName || '-'}
</p>
      </div>
      </div>
      </div>
      </div>
      {/* <div className="w-full px-6 md:px-12 lg:px-20 py-12">
    
      <h2 className="text-center text-xl md:text-3xl font-semibold mb-10">
        My customer reviews
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        <div className=" rounded-xl shadow-md p-4 md:p-20 border border-gray-200 flex flex-col items-center text-center bg-white">
          <FaQuoteLeft className="text-gray-300 text-4xl border-1 rounded-full p-1 bg-white shadow-md mb-4" />
          <p className="text-gray-700 text-base md:text-lg  leading-relaxed">
            Absolutely fabulous service received from {agent.name || agent.fullName || '-'} from the very first
            telephone contact! She was very supportive, helpful, professional
            and friendly. I do recommend her to anyone who is looking to sell or
            buy a property.
          </p>
        </div>

       
        <div className=" rounded-xl shadow-md p-4 md:p-20 text-lg border border-gray-200 flex flex-col items-center text-center bg-white">
        <FaQuoteLeft className="text-gray-300 text-4xl border-1 rounded-full p-1 bg-white shadow-md mb-4" />
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            My mum recently bought an apartment in Maidenhead through {agent.name || agent.fullName || '-'} and
            Keller Williams. {agent.name || agent.fullName || '-'} is a great independent estate agent who was
            very helpful throughout the whole process. I would not hesitate
            recommending her versus the larger high street estate agents.
          </p>
        </div>
      </div>
    </div> */}

<p className="flex flex-wrap justify-center items-center text-2xl md:text-3xl mt-10 md:mt-20 font-semibold mb-6 md:mb-12 text-center">
  <span className='text-[rgb(206,32,39,255)] mr-2'>{t("Properties from")}</span>
  <span className="break-words">{agent.name || agent.fullName || '-'}</span>
</p>




{propertiesLoading ? (
  <div className="flex flex-col justify-center items-center h-60 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[rgb(206,32,39,255)]"></div>
    <p className="text-gray-600 text-lg">{t("Loading properties...")}</p>
    {retryCount > 0 && (
      <p className="text-gray-500 text-sm">{t("Retry attempt")} {retryCount}/3</p>
    )}
  </div>
) : error ? (
  <div className="flex flex-col items-center justify-center h-60 text-center px-4 space-y-4">
    <div className="text-[rgb(206,32,39,255)] text-lg font-medium">{error}</div>
    <div className="text-gray-500 text-sm max-w-md">
      {error.includes('Failed to fetch') ? 
        t('Please check your internet connection and try again.') :
        error.includes('Maximum retry') ?
        t('Please refresh the page to try again.') :
        t('There was an issue loading the properties. Please try again.')
      }
    </div>
    {retryCount < 3 && (
      <button 
        onClick={retryFetchProperties} 
        className="px-6 py-2 bg-[rgb(206,32,39,255)] text-white rounded-lg hover:bg-red-700 transition-colors"
        disabled={retryCount >= 3}
      >
        {retryCount > 0 ? `${t("Retry")} (${retryCount}/3)` : t("Retry")}
      </button>
    )}
  </div>
) : (!propertiesLoading && agentProperties.length === 0 && properties.length === 0 && initialLoadComplete) ? (
  <div className="flex flex-col items-center justify-center h-60 text-center px-4">
    <div className="text-gray-500 text-xl font-medium mb-2">
      {t("No properties found for this agent")}
    </div>
  </div>
) : (!initialLoadComplete) ? (
  <div className="flex flex-col justify-center items-center h-60 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[rgb(206,32,39,255)]"></div>
    <p className="text-gray-600 text-lg">{t("Loading properties...")}</p>
  </div>
) : (
  <div className="px-4 md:px-20">
    <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
      {(agentProperties.length > 0 ? agentProperties : properties).slice(0, visibleCount).map((property, idx) => (
        <div
          key={property._kw_meta?.id || property.id }
          className="bg-white shadow-2xl overflow-hidden w-full cursor-pointer"
          onClick={() => {
            localStorage.setItem("selectedProperty", JSON.stringify(property));
            const propertyId = property._kw_meta?.id || property.id || property.list_id || idx;
            router.push(`/propertydetails/${propertyId}`);
          }}
        >
          {/* Image section */}
          <div className="relative w-full h-50 md:h-60">
            <Image
              src={
                property.image ||
                (Array.isArray(property.images) && property.images[0]) ||
                (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                "/propertyfallback.jpg"
              }
              alt={property.title || property.prop_type || "property"}
              fill
              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />

            {/* Beds / Baths overlay */}
            <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
              {/* Beds */}
              <div className="flex flex-col items-center">
                <span className="relative w-5 h-5">
                  <Image src={bedIconUrl} alt={t("bed")} fill className="object-contain invert" />
                </span>
                <span className="text-xs mt-1">
                  {property.total_bed || property.beds || property.bedrooms || 0}
                </span>
              </div>

              {/* Baths */}
              <div className="flex flex-col items-center">
                <span className="relative w-5 h-5">
                  <Image src={bathIconUrl} alt={t("bath")} fill className="object-contain invert" />
                </span>
                <span className="text-xs mt-1">
                  {property.total_bath || property.baths || property.bathrooms || 0}
                </span>
              </div>
            </div>
          </div>
     

          {/* Property Details */}
          <div className="p-4 py-6">
            <h3 className="text-gray-700 text-lg flex justify-start items-center">
              {property.total_bed || property.beds || property.bedrooms
                ? `${property.total_bed || property.beds || property.bedrooms} bed `
                : ""}
              {property.title || property.prop_type || "Property"}
            </h3>

            <span className="flex justify-start text-[rgb(206,32,39,255)] text-lg font-semibold">
              {property?.list_category || property?.list_status || t("Available")}
            </span>

            <p
              className="text-xl font-bold text-gray-600 mb-2 truncate"
              title={property.list_address?.address || property.address}
            >
              {(() => {
                const address = property.list_address?.address || property.address || t('Address not available');
                const words = address.split(" ");
                return words.length > 5 ? words.slice(0, 5).join(" ") + "..." : address;
              })()}
            </p>

            <div className="flex justify-start items-center">
              <span className="relative w-4 h-4 mr-2">
                <Image 
                  src="/currency.png"
                  alt={t("currency")}
                  fill
                  className="object-contain"
                />
              </span>

              <span>
                {property.current_list_price
                  ? formatPrice(property.current_list_price)
                  : property.price
                  ? formatPrice(property.price)
                  : property.original_list_price
                  ? formatPrice(property.original_list_price)
                  : t("Price on request")}
              </span>
            </div>

            
          </div>

          {/* More Details button */}
          <button className="w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2">
            <span>{t("MORE DETAILS")}</span>
            <FaChevronRight className="text-white w-4 h-4" />
          </button>
        </div>
      ))}
    </div>

    {/* Load More Button */}
    {(agentProperties.length > 0 ? agentProperties : properties).length > visibleCount && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setVisibleCount(prev => prev + 6)}
          className="px-8 py-3 bg-gray-500 text-white font-semibold md:text-lg text-base  transition-colors"
        >
          {t("Load More Properties")} 
        </button>
      </div>
    )}
  </div>
)}

      </div>
      <NewFooter />
    </div>
  );
};

export default AgentProfile;