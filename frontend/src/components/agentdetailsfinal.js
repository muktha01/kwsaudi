'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MapPin, Building2, Phone, Mail } from 'lucide-react';
import NewFooter from '@/components/newfooter'
import { FaArrowLeft,FaQuoteLeft ,FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import Header from '@/components/header';
import { dancing } from '@/app/layout';
import { useParams, useRouter } from 'next/navigation';

const AgentProfile = (props) => {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id;
  
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
  // Icon URLs
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";
  
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
    if (!agent) return agentBios[1]?.text || '';
    
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
    
    return agentBios[bioIndex]?.text || agentBios[1]?.text;
  };

useEffect(() => {
  const fetchAgentsWithPropertiesData = async () => {
    try {
      console.log("Fetching enhanced agents with properties data...");
      setPropertiesLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/kw/agents/property-counts?offset=0&limit=100`
      );

      if (response.ok) {
        const data = await response.json();

        // Find the agent that matches the current agentId
        const selectedAgent = data.agentsWithProperties.find(
          (agent) => agent.kw_uid?.toString() === agentId?.toString()
        );

        if (selectedAgent) {
          setAgentProperties(selectedAgent.properties || []);
          console.log("Selected Agent:", selectedAgent.name);
          console.log("Properties:", selectedAgent.properties);
          setPropertiesLoading(false);
        } else {
          console.warn("No agent found with this ID");
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

  if (agentId) {
    fetchAgentsWithPropertiesData();
  }
}, [agentId]);


  useEffect(() => {
    // Fetch agent data using ID from URL params
    const fetchAgentData = async () => {
      if (!agentId) {
        setError('No agent ID provided.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching agent data for ID:', agentId);
        
        // First check if agent data is available in localStorage (from property details page)
        const storedAgent = localStorage.getItem('selectedAgent');
        if (storedAgent) {
          try {
            const agentData = JSON.parse(storedAgent);
            // Check if the stored agent matches the current agentId (handle both string and number comparisons)
            const storedId = String(agentData._id || '');
            const storedKwId = String(agentData.kw_id || '');
            const storedKwUid = String(agentData.kw_uid || '');
            const storedId2 = String(agentData.id || '');
            const currentId = String(agentId);
            
            console.log('Comparing IDs:', {
              storedId,
              storedKwId, 
              storedKwUid,
              storedId2,
              currentId,
              match: storedId === currentId || storedKwId === currentId || storedKwUid === currentId || storedId2 === currentId
            });
            
            if (storedId === currentId || storedKwId === currentId || storedKwUid === currentId || storedId2 === currentId) {
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
          
          const foundEnhancedAgent = allEnhancedAgents.find(agent =>
            agent.kw_uid === agentId ||
            agent._id === agentId ||
            String(agent._id) === String(agentId)
          );
          
          if (foundEnhancedAgent) {
            console.log('Found agent in enhanced API:', foundEnhancedAgent);
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
        const agentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/combined-data?offset=0&limit=100`);
        
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
    
    if (agentId) {
      fetchAgentData();
    }
  }, [agentId, agentsWithPropertiesData]);
  
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
        console.log('Starting property extraction...');
        console.log('Extracting properties for agent:', agent);
        console.log('Agent kw_uid:', agent.kw_uid);
        console.log('Combined API Data structure:', combinedApiData);
        
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
        <div className='flex justify-center items-center h-60'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600'></div>
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
          {error || 'Agent not found'}
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
  <p className="font-semibold text-gray-600 text-lg md:px-10"> Keller Williams {agent.city || ''}</p>
  {/* Agent Card Section */}
  <div className="hidden md:flex flex-col md:flex-row md:mt-6 mt-20 shadow-xl rounded-3xl overflow-hidden  w-full">
    {/* Left Section */}
    <div className="w-full text-white px-6 sm:px-10 lg:px-16 bg-[rgb(206,32,39,255)] min-h-[80vh] flex flex-col justify-center">
  {/* Left Section */}
  <div className="text-center md:text-left">
    <h1 className="text-xl sm:text-2xl lg:text-3xl break-words mt-6 sm:mt-2">
      Property Sales in Saudi Arabia
    </h1>

    <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">Property Expert</p>
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
  


  </div>
  <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
  <p className="text-2xl md:text-4xl font-semibold">
    <span className="text-[rgb(206,32,39,255)]">Sell your home with </span>
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
  <span className="flex items-center gap-1 text-gray-500 text-lg">
    Call:
    <span className="text-[rgb(206,32,39,255)]">{agent?.phone || "-"}</span>
  </span>

  {/* Divider for desktop */}
  <span className="hidden md:inline border-l h-5 border-gray-400"></span>

  {/* Email */}
  <span className="flex items-center gap-1 text-gray-500 text-lg">
    Email:
    <span className="text-[rgb(206,32,39,255)]">{agent?.email || "-"}</span>
  </span>

  {/* Divider for desktop */}
  <span className="hidden md:inline border-l h-5 border-gray-400"></span>

  {/* KW UID */}
  <span className="flex items-center gap-1 text-gray-500 text-lg">
    Kw UID:
    <span className="text-[rgb(206,32,39,255)]">
      {agentId|| 'Not specified'}
    </span>
  </span>
  

</div>
<div className="flex justify-center items-stretch mx-2 md:mx-10 bg-white py-10 md:py-30 ">

  <div className="grid grid-cols-1 md:grid-cols-2 w-full ">

    {/* Left Red Box */}
    <div className="bg-[rgb(206,32,39,255)] text-white p-4 md:p-14 relative flex flex-col md:min-h-[420px] min-h-[400px]">

      {/* Content */}
      <div className="pb-24">
          <p className="text-base md:text-[1.6rem] font-normal mb-6 pl-3 border-l-8 border-white">
            Download guide
          </p>

        <h2 className="text-2xl md:text-[2.5rem] font-bold mb-4 md:mb-6">How to sell your home</h2>

        <p className="text-base md:text-[1.4rem] mb-4 md:mb-6">
          The guide to selling a property will advise not only on the process but also how you can be super prepared and help to achieve the highest sale price.
        </p>
      </div>

      {/* Input Group - Responsive */}
      <div className="absolute md:bottom-18 md:left-14 md:right-6 bottom-6 left-2 right-auto w-full">
           <div className="hidden md:flex w-full  md:max-w-lg items-center">
            <input
              type="text"
              placeholder="Email Address"
              className="w-full px-4 py-2 bg-white text-black text-lg outline-none"
            />
            <button className="cursor-pointer hover:text-black bg-black hover:bg-gray-200 text-white px-4 md:px-8 py-2 text-lg font-semibold border-black">
              Download
            </button>
          </div>

          <div className="flex md:hidden w-65  flex-col gap-2">
            <input
              type="text"
              placeholder="Email Address"
               className="py-3 px-2 shadow-2xl text-black font-normal   bg-white text-base outline-none"
            />
            <button className="cursor-pointer hover:text-black bg-black hover:bg-red-950 text-white px-8 py-2 text-base font-semibold border-black">
              Download
            </button>
          </div>
        </div>

    </div>

    {/* Right Image Box */}
    <div className="relative flex flex-col md:min-h-[420px] min-h-[400px]">

      <Image
        src="/3.jpg"
        alt="Home"
        fill
        className="object-cover grayscale"
      />
      <div className="absolute inset-0 bg-gray-500/50"></div>

      <div className="absolute inset-0 bg-opacity-40 p-4 md:p-14 text-white flex flex-col h-full">

        {/* Content */}
        <div className="pb-24">
          <p className="text-base md:text-[1.6rem] font-normal mb-6 pl-3 border-l-8 border-white">
            Download guide
          </p>

          <h2 className="text-2xl md:text-[2.5rem] font-bold mb-4 md:mb-6">
            How to buy a home
          </h2>

          <p className="text-base md:text-[1.4rem] mb-4 md:mb-6">
            The following guide to buying a property will explain how to position yourself to negotiate the best price, but importantly ensure you are the winning bidder when up against the competition.
          </p>
        </div>

        {/* Input Group - Responsive */}
     <div className="absolute md:bottom-18 md:left-14 md:right-6 bottom-6 left-2 right-auto w-full">
           <div className="hidden md:flex w-full  md:max-w-lg items-center">
            <input
              type="text"
              placeholder="Email Address"
              className="w-full px-4 py-2 bg-white text-black text-lg outline-none"
            />
            <button className="cursor-pointer hover:text-black bg-black hover:bg-gray-200 text-white px-4 md:px-8 py-2 text-lg font-semibold border-black">
              Download
            </button>
          </div>

          <div className="flex md:hidden w-65  flex-col gap-2">
            <input
              type="text"
              placeholder="Email Address"
               className="py-3 px-2 shadow-2xl text-black font-normal bg-white text-base outline-none"
            />
            <button className="cursor-pointer hover:text-black bg-black hover:bg-red-950 text-white px-8 py-2 text-base font-semibold border-black">
              Download
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>

</div>
<div className="w-full px-6 md:px-12 lg:px-20 py-10">
  {/* About Section */}
  <div className="flex flex-col md:flex-row ">
    {/* Left Tab */}
    <div className="w-full md:w-1/4">
      <div className="bg-gray-200 border-gray-200 p-3 text-center font-medium">
       <p className='bg-white p-2 font-semibold text-lg'> About {agent.name || agent.fullName || '-'}</p>
      </div>
    </div>

    {/* Right Content */}
    <div className="w-full md:w-3/4">
      <div className="rounded-md shadow-md p-6">
        {/* Welcome Title */}
        <h2 className={`${dancing.className} text-3xl mb-4`}>
  Welcome
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

    <p className="flex justify-center items-center text-2xl font-semibold mb-10 md:mb-12">
  Properties from {agent.name || agent.fullName || '-'}
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
      No properties found for this agent
    </div>
   
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
                "/formimage.jpg"
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
            <span>MORE DETAILS</span>
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
          className="px-8 py-3 bg-gray-500 text-white font-bold text-lg rounded-lg transition-colors"
        >
          Load More Properties 
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