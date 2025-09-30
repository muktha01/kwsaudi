'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Building2, Phone, Mail } from 'lucide-react';
import NewFooter from '@/components/newfooter'
import { FaArrowLeft,FaQuoteLeft ,FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faFolder, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import HeaderAgent from '@/components/headerAgent';
import { dancing } from '@/app/layout';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';

const AgentProfile = () => {
   const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const agentEmail = searchParams.get('email');
    const { t, isRTL } = useTranslation();
    const [events, setEvents] = useState([]);
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [combinedApiData, setCombinedApiData] = useState(null); // Cache combined API response
    const [agentsWithPropertiesData, setAgentsWithPropertiesData] = useState(null); // Cache new API response
    const [loading, setLoading] = useState(true);
    const [propertiesLoading, setPropertiesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [retryCount, setRetryCount] = useState(0);
    const [agentProperties, setAgentProperties] = useState([]);
    const [blogs, setBLogs] = useState([]);
    const [links, setLinks] = useState([]);
    const eventsRef = useRef(null);
    const agentDriveRef = useRef(null);
    const calendarRef = useRef(null);
    const profileRef = useRef(null);
    
    // Function to scroll to section
    const scrollToSection = (ref, topOffset = 150) => {
  if (ref && ref.current) {
    const element = ref.current;
    const y = element.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

    
    // Icon URLs
    const bedIconUrl = "/bed.png";
    const bathIconUrl = "/bath.png";
    
    // Function to handle read more
      const handleReadMore = (post) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedEvent', JSON.stringify(post));
       router.push(`/ourCulture/events/${post._id}`);
    }
  };
    
    // Function to retry fetching properties
    const retryFetchProperties = () => {
      setRetryCount(prev => prev + 1);
      setError(null);
      setPropertiesLoading(true);
      // The useEffect will run again due to retryCount change
    };
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
    
    // Helper function to format price
    const formatPrice = (price) => {
      if (!price) return '0';
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  
    // Helper function to get agent bio based on agent data
    const getAgentBio = (agent) => {
      if (!agent) return t('agentBio1');
      
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
      
      return t(`agentBio${bioIndex}`);
    };

  useEffect(() => {
    const fetchAgentsWithPropertiesData = async () => {
      try {
        console.log("Fetching enhanced agents with properties data...");
        setPropertiesLoading(true);
        const response = await fetch(
          `http://localhost:5001/api/agents/kw/agents/property-counts?offset=0&limit=100`
        );

        if (response.ok) {
          const data = await response.json();

          // Find the agent that matches the current agentEmail
          const selectedAgent = data.agentsWithProperties.find(
            (agent) => {
              return (agent.email && agent.email.toLowerCase() === agentEmail?.toLowerCase()) ||
                     (agent.work_email && agent.work_email.toLowerCase() === agentEmail?.toLowerCase());
            }
          );

          if (selectedAgent) {
            setAgentProperties(selectedAgent.properties || []);
            console.log("Selected Agent:", selectedAgent.name);
            console.log("Properties:", selectedAgent.properties);
            setPropertiesLoading(false);
          } else {
            console.warn("No agent found with this email");
            setAgentProperties([]);
            setPropertiesLoading(false);
          }

          // Store full agents data if needed
          setAgentsWithPropertiesData(data);
        } else {
          console.log("Enhanced API not available, will use fallback");
          setPropertiesLoading(false);
        }
      } catch (error) {
        console.log("Enhanced API error, will use fallback:", error);
        setPropertiesLoading(false);
      }
    };

    if (agentEmail) {
      fetchAgentsWithPropertiesData();
    }
  }, [agentEmail]);
  
  
    useEffect(() => {
      // Fetch agent data using email from URL params
      const fetchAgentData = async () => {
        if (!agentEmail) {
          setError('No agent email provided.');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
          console.log('Fetching agent data for email:', agentEmail);
          
          // First check if agent data is available in localStorage (from property details page)
          if (typeof window !== 'undefined') {
            const storedAgent = localStorage.getItem('selectedAgent');
            if (storedAgent) {
              try {
                const agentData = JSON.parse(storedAgent);
                // Check if the stored agent matches the current agentEmail
                const storedEmail = String(agentData.email || '').toLowerCase();
              const currentEmail = String(agentEmail || '').toLowerCase();
              
              console.log('Comparing emails:', {
                storedEmail,
                currentEmail,
                match: storedEmail === currentEmail
              });
              
                if (storedEmail === currentEmail) {
                  console.log('Using stored agent data:', agentData);
                  setAgent(agentData);
                  if (agentData.image) setImgSrc(agentData.image);
                  setLoading(false);
                  return;
                }
              } catch (e) {
                console.log('Error parsing stored agent data:', e);
              }
            }
          }
          
          // First try to find agent in enhanced API data
          if (agentsWithPropertiesData && agentsWithPropertiesData.success) {
            console.log('Searching in enhanced API data...');
            
            // Safely handle the arrays
            const agentsWithProps = Array.isArray(agentsWithPropertiesData.agentsWithProperties) 
              ? agentsWithPropertiesData.agentsWithProperties 
              : [];
            const agentsWithoutProps = Array.isArray(agentsWithPropertiesData.agentsWithoutProperties) 
              ? agentsWithPropertiesData.agentsWithoutProperties 
              : [];
              
            const allEnhancedAgents = [...agentsWithProps, ...agentsWithoutProps];
            
            const foundEnhancedAgent = allEnhancedAgents.find(agent => {
              return (agent.email && agent.email.toLowerCase() === agentEmail.toLowerCase()) ||
                     (agent.work_email && agent.work_email.toLowerCase() === agentEmail.toLowerCase());
            });
            
            if (foundEnhancedAgent) {
              console.log('Found agent in enhanced API:', foundEnhancedAgent);
              const mappedAgent = {
                name: foundEnhancedAgent.name,
                phone: foundEnhancedAgent.phone,
                email: foundEnhancedAgent.email || foundEnhancedAgent.work_email,
                city: foundEnhancedAgent.city,
                image: foundEnhancedAgent.photo || foundEnhancedAgent.image,
                _id: foundEnhancedAgent._id,
                marketCenter: foundEnhancedAgent.market_center_number || "",
                kw_uid: foundEnhancedAgent.kw_uid,
                kw_id: foundEnhancedAgent.kw_uid // Keep backward compatibility
              };
              
              setAgent(mappedAgent);
              if (mappedAgent.image) setImgSrc(mappedAgent.image);
              
              // Set properties directly from enhanced API
              if (foundEnhancedAgent.properties && Array.isArray(foundEnhancedAgent.properties) && foundEnhancedAgent.properties.length > 0) {
                console.log(`Setting ${foundEnhancedAgent.properties.length} properties from enhanced API`);
                setProperties(foundEnhancedAgent.properties);
              } else {
                console.log('No properties found for this agent in enhanced API');
                setProperties([]);
              }
              
              setLoading(false);
              return;
            }
          }
          
          // If no stored data or no match, fetch from API
          const agentRes = await fetch(`http://localhost:5001/api/agents/kw/combined-data?offset=0&limit=100`);
          
          if (agentRes.ok) {
            const agentData = await agentRes.json();
            console.log('Agents API response:', agentData);
            
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
              
              // Find the specific agent by email
              const foundAgent = allAgents.find(a => {
                return (a.email && a.email.toLowerCase() === agentEmail.toLowerCase()) ||
                       (a.work_email && a.work_email.toLowerCase() === agentEmail.toLowerCase());
              });
              
              if (foundAgent) {
                const mappedAgent = {
                  name: foundAgent.full_name || `${foundAgent.first_name || ''} ${foundAgent.last_name || ''}`.trim(),
                  phone: foundAgent.phone || foundAgent.phoneNumber,
                  email: foundAgent.email || foundAgent.work_email || agentEmail,
                  city: foundAgent.city,
                  image: foundAgent.photo || foundAgent.profileImage || foundAgent.image,
                  _id: foundAgent._id || foundAgent.id,
                  marketCenter: foundAgent.market_center_number || foundAgent.marketCenter || "",
                  kw_uid: foundAgent.kw_uid,
                  kw_id: foundAgent.kw_uid // Keep backward compatibility
                };
                
                setAgent(mappedAgent);
                if (mappedAgent.image) setImgSrc(mappedAgent.image);
                console.log('Agent found and set:', mappedAgent);
              } else {
                setError('Agent not found.');
              }
            } else {
              setError('Failed to load agent data.');
            }
          } else {
            throw new Error(`Failed to fetch agent data: ${agentRes.status}`);
          }
        } catch (e) {
          console.error('Error fetching agent data:', e);
          setError(`Failed to load agent data: ${e.message}`);
        } finally {
          setLoading(false);
        }
      };
      
      if (agentEmail) {
        fetchAgentData();
      }
    }, [agentEmail, agentsWithPropertiesData]);
    
    // Update filteredProperties when properties change
    useEffect(() => {
      setFilteredProperties(properties);
    }, [properties]);
  
    useEffect(() => {
      // Extract properties from the cached combined API data and filter for this agent
      const extractAndFilterProperties = () => {
        if (!agent || !combinedApiData) {
          console.log('Missing data:', { agent: !!agent, combinedApiData: !!combinedApiData });
          return;
        }
        setPropertiesLoading(true);
        setError(null);
        
        try {
          // console.log('Starting property extraction...');
          // console.log('Extracting properties for agent:', agent);
          // console.log('Agent kw_uid:', agent.kw_uid);
          // console.log('Combined API Data structure:', combinedApiData);
          
          if (combinedApiData.success && combinedApiData.results) {
            // Extract properties from the listings results
            let allProperties = [];
            
            combinedApiData.results.forEach(result => {
              if (result.success && result.type.includes('listings_region')) {
                // Handle different possible data structures
                let properties = [];
                
                if (result.data?.hits?.hits) {
                  // Elasticsearch structure
                  properties = result.data.hits.hits.map(hit => ({
                    ...hit._source,
                    _kw_meta: { id: hit._id, score: hit._score ?? null },
                  }));
                } else if (result.data?.data) {
                  // Direct data array structure
                  properties = result.data.data.map((property, index) => ({
                    ...property,
                    _kw_meta: { id: property.id || index, score: null },
                  }));
                } else if (Array.isArray(result.data)) {
                  // Direct array structure
                  properties = result.data.map((property, index) => ({
                    ...property,
                    _kw_meta: { id: property.id || index, score: null },
                  }));
                }
                
                allProperties = allProperties.concat(properties);
              }
            });
            
            console.log('All extracted properties:', allProperties.length);
            console.log('Sample property structure:', allProperties[0]);
            
            // Filter properties by agent's kw_uid
            const agentPropertiesFromCombined = allProperties.filter(property => {
              const listKwUid = property.list_kw_uid || property.listing_agent_kw_uid || property.agent_kw_uid || '';
              const match = String(listKwUid) === String(agent.kw_uid);
              if (match) {
                console.log('Found matching property for agent:', property);
              }
              return match;
            });
            
            console.log('Filtered properties for agent:', agentPropertiesFromCombined.length);
            console.log('Agent kw_uid being searched:', agent.kw_uid);
            console.log('Sample property kw_uid values:', allProperties.slice(0, 3).map(p => ({
              id: p._kw_meta?.id,
              list_kw_uid: p.list_kw_uid,
              listing_agent_kw_uid: p.listing_agent_kw_uid,
              agent_kw_uid: p.agent_kw_uid
            })));
            
            setProperties(agentPropertiesFromCombined);
            
            // Fallback: if no agent-specific properties found, show some sample properties for testing
            if (agentPropertiesFromCombined.length === 0 && allProperties.length > 0) {
              console.log('No agent-specific properties found. Showing first 6 properties for testing...');
              setProperties(allProperties.slice(0, 6));
            }
          } else {
            console.log('No valid data in cached API response');
            setProperties([]);
          }
          
        } catch (e) {
          console.error('Error extracting properties:', e);
          setError(`Failed to load properties: ${e.message}`);
          setProperties([]);
        } finally {
          setPropertiesLoading(false);
        }
      };
      
      if (agent && combinedApiData && agentProperties.length === 0) {
        extractAndFilterProperties();
      }
    }, [agent, combinedApiData, retryCount, agentProperties.length]);
  
      useEffect(() => {
        const fetchEvents = async () => {
          try {
            setLoading(true);
            setError(null);
            const res = await fetch('http://localhost:5001/api/events');
            
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            setEvents(data);
            console.log(data.coverImage);
            
          } catch (error) {
            console.error('Error fetching blogs:', error);
            setError('Failed to load events. Please try again later.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchEvents();
      }, []);   
       

    // Fetch blogs and links data
    useEffect(() => {
      const fetchBlogsAndLinks = async () => {
       

        try {
          // Fetch links
          // console.log('Fetching links from API...');
          const linksResponse = await fetch('http://localhost:5001/api/links');
          if (linksResponse.ok) {
            const linksData = await linksResponse.json();
            console.log('Links data received:', linksData);
            // Backend returns links directly, not wrapped in an object
            setLinks(Array.isArray(linksData) ? linksData : []);
          } else {
            console.log('Links API response not ok:', linksResponse.status);
          }
        } catch (error) {
          console.error('Error fetching links:', error);
        }
      };

      fetchBlogsAndLinks();
    }, []);
  
    if (error) {
      return (
        <div className='relative p-6 md:p-8'>
          <HeaderAgent />
          <div className='text-center bg-[rgb(206,32,39,255)] py-20'>{error}</div>
          <NewFooter />
        </div>
      );
    }
    
    if (loading && !agent) {
      return (
        <div className='relative p-6 md:p-8'>
          <HeaderAgent/>
          <div className='flex justify-center items-center h-60'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600'></div>
          </div>
          <NewFooter />
        </div>
      );
    }
    
    if (!agent && !loading) {
      return (
        <div className='relative p-6 md:p-8'>
          <HeaderAgent />
          <div className='text-center bg-[rgb(206,32,39,255)] py-20'>
            {!agentEmail ? t('No agent email provided') : (error || t('Agent not found'))}
          </div>
          <NewFooter />
        </div>
      );
    }

  return (
    <div className="relative p-4 sm:p-6 md:p-8">
      <HeaderAgent />

      {/* Global loader overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[rgb(206,32,39,255)]"></div>
            <p className="mt-4 text-lg text-gray-700">{t('Loading agent profile...')}</p>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-[rgb(206,32,39,255)] z-0"></div>
      <div className="relative bg-gray-100">
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Sidebar */}
          {/* Mobile bottom nav (hidden on desktop) */}
<aside className="flex md:hidden w-full p-2 flex-row mt-30 sticky bottom-0 h-14 bg-white z-10 shadow-md">
  <nav className="w-full">
    <ul className="flex flex-row justify-around items-center text-gray-700">
      <li
        className="flex flex-col items-center gap-1 cursor-pointer hover:text-[rgb(206,32,39,255)]"
        onClick={() => scrollToSection(profileRef)}
      >
        <FontAwesomeIcon icon={faUser} />
        <span className="text-xs">{t('Profile')}</span>
      </li>
      <li
        className="flex flex-col items-center gap-1 cursor-pointer hover:text-[rgb(206,32,39,255)]"
        onClick={() => scrollToSection(calendarRef)}
      >
        <FontAwesomeIcon icon={faCalendar} />
        <span className="text-xs">{t('Calendar')}</span>
      </li>
      <li
        className="flex flex-col items-center gap-1 cursor-pointer hover:text-[rgb(206,32,39,255)]"
        onClick={() => scrollToSection(agentDriveRef)}
      >
        <FontAwesomeIcon icon={faFolder} />
        <span className="text-xs">{t('Agent Drive')}</span>
      </li>
      <li
        className="flex flex-col items-center gap-1 cursor-pointer hover:text-[rgb(206,32,39,255)]"
        onClick={() => scrollToSection(eventsRef)}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span className="text-xs">{t('Events')}</span>
      </li>
    </ul>
  </nav>
</aside>

{/* Desktop sidebar (hidden on mobile) */}
<aside className="hidden md:flex w-56 md:w-64 p-2 md:p-4 flex-col mt-6 md:mt-20 pl-0 md:pl-8 sticky top-0 md:top-30 h-auto md:h-screen overflow-x-auto md:overflow-y-auto bg-white md:bg-transparent z-10">
  <h1 className="text-xl font-bold text-gray-500 py-4 md:py-6">{t('Dashboard')}</h1>
  <nav>
    <ul className="flex md:flex-col gap-4 text-gray-700">
      <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]" onClick={() => scrollToSection(profileRef)}>
        <FontAwesomeIcon icon={faUser} /> {t('Profile')}
      </li>
      <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]" onClick={() => scrollToSection(calendarRef)}>
        <FontAwesomeIcon icon={faCalendar} /> {t('Calendar')}
      </li>
      <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]" onClick={() => scrollToSection(agentDriveRef)}>
        <FontAwesomeIcon icon={faFolder} /> {t('Agent Drive')}
      </li>
      <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]" onClick={() => scrollToSection(eventsRef)}>
        <FontAwesomeIcon icon={faCalendarAlt} /> {t('Events')}
      </li>
    </ul>
  </nav>
</aside>


          {/* Main Content */}
          <main className="flex-1 p-2 sm:p-4 md:p-6">
          
            
            <div className="bg-white mt-8 md:mt-20 px-2 sm:px-6 md:px-10 lg:px-20" ref={profileRef}>
<p className="font-semibold pt-4 text-[rgb(206,32,39,255)] text-2xl md:px-10">{t('Agent Space')}</p>
  <p className="font-semibold text-gray-600 text-lg md:px-10">KW {agent.city}</p>
            
            {/* Profile Card with loading skeleton */}
            {loading ? (
              <div className="hidden md:flex flex-col md:flex-row md:mt-10 mt-10 shadow-xl rounded-3xl overflow-hidden w-full animate-pulse">
                <div className="w-full bg-gray-300 min-h-[80vh] flex flex-col justify-center px-6 sm:px-10 lg:px-16">
                  <div className="h-8 bg-gray-400 rounded mb-4"></div>
                  <div className="h-6 bg-gray-400 rounded mb-2 w-3/4"></div>
                  <div className="h-12 bg-gray-400 rounded mb-4 w-1/2"></div>
                  <div className="h-20 bg-gray-400 rounded w-64"></div>
                </div>
                <div className="w-full bg-gray-300 flex items-center justify-center">
                  <div className="w-32 h-40 sm:w-48 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            ) : agent ? (
              <>
  <div className="hidden md:flex flex-col md:flex-row md:mt-6 mt-10 shadow-xl rounded-3xl overflow-hidden w-full">
    {/* Left Section */}
  <div className="w-full text-white px-4 sm:px-8 lg:px-12 bg-[rgb(206,32,39,255)] min-h-[60vh] flex flex-col justify-center">
  {/* Left Section */}
  <div className="text-center md:text-left">
    <h1
  className={`text-xl sm:text-2xl lg:text-3xl break-words mt-6 sm:mt-2 ${
    isRTL ? "text-right" : "text-left"
  }`}
>
      {t('Property Sales in Saudi Arabia')}
    </h1>

    <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">{t('Property Expert')}</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || ''}</span>
      </div>

      {/* Powered by */}
      <div className="flex mt-6 sm:mt-8 lg:mt-30">
  <Image
    src="/powerdby.png"   // your single combined image
    alt="Powered by Keller Williams"
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
  <div className="relative z-10 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 w-32 h-40 sm:w-48 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 aspect-square">
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
  <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mt-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
  
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
    <h2 className="text-xl text-white uppercase ">Property Sales in Saudi Arabia</h2>
  
  </div>

  {/* Info Items */}
  <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">Property Expert</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || '-'}</span>
      </div>

      {/* Powered by */}
      <div className="flex items-center justify-center mt-6 mb-4 sm:mt-8 lg:mt-30">
  <Image
    src="/powerdby.png"   // your single combined image
    alt="Powered by Keller Williams"
    width={250}
    height={80}
    className="h-auto w-auto"
  />
</div>

 </div>
  </div>
  


 
  <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
  <p className="text-2xl md:text-4xl font-semibold">
    <span className="text-[rgb(206,32,39,255)]">{t('Sell your home with ')}</span>
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
    {t('Call')}:
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
    {t('Kw UID')}:
    <span className="text-[rgb(206,32,39,255)]">
      {agent?.kw_uid || t('Not specified')}
    </span>
  </span>
 </div> 

              </>
            ) : null}

<div className='bg-white'>
   <p className="flex flex-wrap justify-center items-center text-2xl md:text-3xl mt-10 md:mt-20 font-semibold mb-6 md:mb-12 text-center">
  <span className='text-[rgb(206,32,39,255)] mr-2'>{t("Properties from")}</span>
  <span className="break-words">{agent.name || agent.fullName || '-'}</span>
</p>

{propertiesLoading ? (
  <div className="flex justify-center items-center h-60">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
  </div>
) : error ? (
  <div className="flex flex-col items-center justify-center h-60 text-center px-4">
    <div className="text-red-500 text-lg font-medium mb-2">{error}</div>
    <div className="text-gray-500 text-sm mb-4">
      {error.includes('Failed to fetch') ? 
        'Please check your internet connection and try again.' :
        'There was an issue loading the properties. Please try again.'
      }
    </div>
    <button 
      onClick={retryFetchProperties} 
      className="px-6 py-2 bg-[rgb(206,32,39,255)] text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Retry
    </button>
  </div>
) : (agentProperties.length === 0 && properties.length === 0) ? (
  <div className="flex flex-col items-center justify-center h-60 text-center px-4">
    <div className="text-gray-500 text-xl font-medium mb-2">
      {t("No properties found for this agent")}
    </div>
   
  </div>
) : (
  <div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
          <div className="relative w-full h-40 sm:h-48 md:h-60">
            <Image
              src={
                property.image ||
                (Array.isArray(property.images) && property.images[0]) ||
                (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                "/properysmallfalback.jpg"
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
              {property?.list_category || property?.list_status || "Available"}
            </span>

            <p
              className="text-xl font-bold text-gray-600 mb-2 truncate"
              title={property.list_address?.address || property.address}
            >
              {(() => {
                const address = property.list_address?.address || property.address || 'Address not available';
                const words = address.split(" ");
                return words.length > 5 ? words.slice(0, 5).join(" ") + "..." : address;
              })()}
            </p>

            <div className="flex justify-start items-center">
              <span className="relative w-4 h-4 mr-2">
                <Image 
                  src="/currency.png"
                  alt="currency"
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
                  : "Price on request"}
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
          className="px-8 py-3 bg-gray-500 text-white font-semibold text-base rounded-lg transition-colors"
        >
          {t("Load More Properties")}
        </button>
      </div>
    )}
  </div>
)}
               <div className="flex flex-col items-center mt-10 md:mt-30 ">
      {/* Training Calendar */}
      <h2
        className="text-2xl md:text-3xl font-semibold mb-10 tracking-[1.5px]"
        ref={calendarRef}
      >
        {t("Training")} <span className="text-[rgb(206,32,39,255)]">{t("Calendar")}</span>
      </h2>

  <div className="flex gap-4 sm:gap-8 md:gap-10 mb-8 md:mb-16 flex-wrap justify-center">
        {links
          .filter((link) => link.name === "Jamin" || link.name === "Jeddah")
          .map((link) => {
            
            return (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgb(206,32,39)] text-white px-4 sm:px-8 md:px-10 py-4 sm:py-6 text-base sm:text-xl font-semibold transition cursor-pointer inline-flex items-center hover:bg-[rgb(180,28,35)]"
              >
                <span className="text-lg">{t("KW Saudi Arabia")}</span>
                <span
  className={`text-3xl ${isRTL ? "mr-10" : "ml-40"}`}
>
  {t(link.name)}
</span>
              </a>
            );
          })}
        
      
      </div>

      {/* Agent Drive */}
      <h2
        className="text-2xl md:text-3xl font-semibold mb-8 mt-20 tracking-[1.5px]"
        ref={agentDriveRef}
      >
        <span className="text-[rgb(206,32,39,255)]">{t("Agent")}</span> {t("Drive")}
      </h2>

  <div className="flex gap-2 sm:gap-4 mb-4 md:mb-8 flex-wrap justify-center">
        {links
          .filter((link) => link.name === "Resources" || link.name === "Agent Drive" || link.name === "Drive")
          .map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[rgb(206,32,39,255)] text-white px-6 sm:px-16 md:px-24 lg:px-40 tracking-[1.5px] py-4 sm:py-6 text-lg sm:text-2xl font-semibold transition cursor-pointer inline-block text-center hover:bg-[rgb(180,28,35)]"
            >
             {t("View")} {t(link.name)}
            </a>
          ))}
        
       
       
      </div>
    </div> {/* Filter Bar */}
          
  <p className="flex justify-center items-center text-2xl md:text-3xl font-semibold py-6 md:py-10 mt-10 md:mt-20 tracking-[1.5px]" ref={eventsRef}>
  <span className="text-[rgb(206,32,39)]">{t("View Our")}&nbsp;</span>{t("Events")}
</p>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-2 ">
              <div className="text-lg text-gray-600">{t("Loading events...")}</div>
            </div>
          )}
    
          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-[rgb(206,32,39)] text-center">
                {error}
              </div>
            </div>
          )}
    
          {/* Blog Cards */}
          {!loading && !error && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-10 p-2 sm:p-4 md:px-8 lg:px-16 ">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="text-lg text-gray-600">{t("No events found.")}</div>
          </div>
        ) : (
          events.map((post, index) => (
            <div
              key={post._id || index}
              className="bg-white shadow-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="w-full h-60 bg-gray-200 relative">
                <Image
                 src={
                   post.coverImage
                     ? (() => {
                         const cleanPath = post.coverImage.replace(/\\/g, "/");
                         return cleanPath.startsWith("http")
                           ? cleanPath
                           : `http://localhost:5001/${cleanPath}`;
                       })()
                     : "/event.png"
                 }
                 alt={post.title || t("Event")}
                 fill
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
              </div>
    
              <div className="p-4 flex flex-col flex-grow">
                {post.createdAt && (
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                )}
                <h3 className="md:text-2xl text-xl mb-2 font-semibold line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-base line-clamp-3 mb-3">
                  {post.description}
                </p>
    
                <button
                  onClick={() => handleReadMore(post)}
                  className="mt-auto w-full px-4 py-2 bg-[rgb(206,32,39)] text-white transition-colors text-base font-semibold hover:bg-[rgb(180,28,35)]"
                >
                  {t("Read More")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    )}
      </div>
            </div>
          </main>
        </div>
      </div>
      <NewFooter></NewFooter>
    </div>
  );
};

export default AgentProfile;
