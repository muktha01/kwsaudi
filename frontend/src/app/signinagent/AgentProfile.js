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
  const agentKwUid = searchParams.get('kw_uid') || searchParams.get('kwUid') || searchParams.get('kw');
    const { t, isRTL } = useTranslation();
    const [events, setEvents] = useState([]);
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    // Missing states and refs used throughout the component
    const [agentProperties, setAgentProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [propertiesLoading, setPropertiesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [imgSrc, setImgSrc] = useState('/avtar.jpg');
    const [links, setLinks] = useState([]);

    const profileRef = useRef(null);
    const calendarRef = useRef(null);
    const agentDriveRef = useRef(null);
    const eventsRef = useRef(null);

    // Small helper assets / urls used in markup
    const bedIconUrl = '/bed.png';
    const bathIconUrl = '/bath.png';

    // Helpers
    const formatPrice = (val) => {
      if (val == null) return '';
      try {
        const n = Number(val);
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(n);
      } catch (e) {
        return val;
      }
    };

    const scrollToSection = (ref) => {
      try {
        if (ref && ref.current) ref.current.scrollIntoView({ behavior: 'smooth' });
      } catch (e) {}
    };

    const retryFetchProperties = () => {
      // simple retry: reload current page to re-trigger data fetch useEffect
      if (typeof window !== 'undefined') window.location.reload();
    };

    const handleReadMore = (post) => {
      if (!post) return;
      const id = post._id || post.id;
      if (id) router.push(`/events/${id}`);
    };
  useEffect(() => {
    // If kw_uid is present in query params, prefer fetching agent by id and properties by-agent
    const fetchAgentByKwUid = async (kw_uid) => {
      setPropertiesLoading(true);
      setLoading(true);
      setError(null);
      try {
        // Fetch agent details from backend by id (backend normalizes agent object)
        const agentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/agents/byid/${encodeURIComponent(kw_uid)}`);
        if (agentRes.ok) {
          const agentData = await agentRes.json();
          if (agentData.success && agentData.agent) {
            const a = agentData.agent;
            const mapped = {
              name: a.full_name || a.name || `${a.first_name || ''} ${a.last_name || ''}`.trim(),
              phone: a.phone || a.mobile_phone || a.office_phone || '',
              email: a.email || a.office_email || '',
              city: a.city || '',
              image: a.photo || a.profile_image_url || a.image_url || '/avtar.jpg',
              _id: a.kw_uid || a._id || kw_uid,
              marketCenter: a.market_center_number || '',
              kw_uid: a.kw_uid || kw_uid,
              kw_id: a.kw_uid || kw_uid
            };
            setAgent(mapped);
            if (mapped.image) setImgSrc(mapped.image);

            // Fetch properties via backend by-agent endpoint
            try {
              const byAgentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/properties/by-agent/${encodeURIComponent(kw_uid)}`);
              if (byAgentRes.ok) {
                const byAgentData = await byAgentRes.json();
                const props = (byAgentData?.properties?.data) || byAgentData?.properties || [];
                setAgentProperties(props);
                setProperties(props);
              } else {
                console.warn('by-agent returned non-ok, clearing properties');
                setAgentProperties([]);
                setProperties([]);
              }
            } catch (err) {
              console.error('Error fetching properties by-agent:', err);
              setAgentProperties([]);
              setProperties([]);
            }

            setError(null);
          } else {
            setAgent(null);
            setAgentProperties([]);
            setProperties([]);
            setError('Agent not found.');
          }
        } else {
          setAgent(null);
          setAgentProperties([]);
          setProperties([]);
          setError('Failed to load agent data.');
        }
      } catch (err) {
        console.error('Error in fetchAgentByKwUid:', err);
        setAgent(null);
        setAgentProperties([]);
        setProperties([]);
        setError('Failed to load agent data.');
      } finally {
        setPropertiesLoading(false);
        setLoading(false);
      }
    };

    // Existing email-based flow (kept for backward compatibility)
    const fetchAgentFromPeopleData = async () => {
      if (!agentEmail) {
        setError('No agent email provided.');
        setPropertiesLoading(false);
        setLoading(false);
        setAgent(null);
        setAgentProperties([]);
        setProperties([]);
        return;
      }
      setPropertiesLoading(true);
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch agent info
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/people-data?offset=0&limit=1000`);
        if (response.ok) {
          const data = await response.json();
          const selectedAgent = (data.data || []).find((agent) => {
            const emails = [
              agent.email,
              agent.work_email,
              agent.kw_email,
              agent.primaryEmail,
              agent.workEmail,
              agent.marketing_email,
              agent.recovery_email
            ].filter(Boolean);
            return emails.some(e => e.toLowerCase() === agentEmail?.toLowerCase());
          });
          if (selectedAgent) {
            // Compose full name with fallbacks
            const name = selectedAgent.name
              || selectedAgent.fullName
              || ((selectedAgent.first_name || selectedAgent.firstName || "") + " " + (selectedAgent.last_name || selectedAgent.lastName || "")).trim()
              || selectedAgent.username
              || "-";
            const phone = selectedAgent.phone
              || selectedAgent.mobile_phone
              || selectedAgent.mobilePhone
              || selectedAgent.work_phone
              || selectedAgent['phone:']
              || selectedAgent['mobile_phone:']
              || "-";
            const email = selectedAgent.email
              || selectedAgent.work_email
              || selectedAgent.kw_email
              || selectedAgent.primaryEmail
              || selectedAgent.workEmail
              || selectedAgent.marketing_email
              || selectedAgent.recovery_email
              || "-";
            const city = selectedAgent.city
              || selectedAgent.primaryCity
              || selectedAgent.work_city
              || selectedAgent.office_city
              || selectedAgent.address_city
              || "-";
            const image = selectedAgent.photo
              || selectedAgent.profile_image
              || selectedAgent.image
              || (selectedAgent.photo && selectedAgent.photo.startsWith('http') ? selectedAgent.photo : null)
              || '/avtar.jpg';
            const kw_uid = selectedAgent.kw_uid
              || selectedAgent.kwUid
              || selectedAgent.id
              || selectedAgent._id
              || selectedAgent.recruit_id
              || "-";
            const marketCenter = selectedAgent.market_center_number
              || selectedAgent.marketCenterNumber
              || selectedAgent.office_name
              || selectedAgent.market_center
              || selectedAgent.marketCenter
              || "";
            setAgent({
              name,
              phone,
              email,
              city,
              image,
              _id: selectedAgent._id || selectedAgent.id || kw_uid,
              marketCenter,
              kw_uid,
              kw_id: kw_uid
            });
            setImgSrc(image);
            // 2. Fetch agent properties by kw_uid
            if (kw_uid && kw_uid !== '-') {
              try {
                // Preferred: backend consolidated endpoint that returns paginated properties
                const byAgentRes = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/agents/properties/by-agent/${encodeURIComponent(kw_uid)}`
                );

                if (byAgentRes.ok) {
                  const byAgentData = await byAgentRes.json();
                  // Controller returns { success: true, properties: { data: [...] } }
                  const props = (byAgentData?.properties?.data) || byAgentData?.properties || [];
                  setAgentProperties(props);
                  setProperties(props);
                } else {
                  // Fallback to older property-counts endpoint if by-agent fails
                  console.warn('by-agent endpoint failed, falling back to property-counts');
                  const propRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/agents/property-counts?offset=0&limit=1000`);
                  if (propRes.ok) {
                    const propData = await propRes.json();
                    const agentWithProps = (propData.agentsWithProperties || []).find(a => String(a.kw_uid) === String(kw_uid));
                    if (agentWithProps) {
                      setAgentProperties(agentWithProps.properties || []);
                      setProperties(agentWithProps.properties || []);
                    } else {
                      setAgentProperties([]);
                      setProperties([]);
                    }
                  } else {
                    setAgentProperties([]);
                    setProperties([]);
                  }
                }
              } catch (err) {
                console.error('Error fetching by-agent properties:', err);
                // On error, fallback
                try {
                  const propRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/agents/property-counts?offset=0&limit=1000`);
                  if (propRes.ok) {
                    const propData = await propRes.json();
                    const agentWithProps = (propData.agentsWithProperties || []).find(a => String(a.kw_uid) === String(kw_uid));
                    if (agentWithProps) {
                      setAgentProperties(agentWithProps.properties || []);
                      setProperties(agentWithProps.properties || []);
                    } else {
                      setAgentProperties([]);
                      setProperties([]);
                    }
                  } else {
                    setAgentProperties([]);
                    setProperties([]);
                  }
                } catch (fallbackErr) {
                  console.error('Fallback property-counts also failed:', fallbackErr);
                  setAgentProperties([]);
                  setProperties([]);
                }
              }
            } else {
              setAgentProperties([]);
              setProperties([]);
            }
            setError(null);
          } else {
            setAgent(null);
            setAgentProperties([]);
            setProperties([]);
            setError('Agent not found.');
          }
        } else {
          setAgent(null);
          setAgentProperties([]);
          setProperties([]);
          setError('Failed to load agent data.');
        }
      } catch (error) {
        setAgent(null);
        setAgentProperties([]);
        setProperties([]);
        setError('Failed to load agent data.');
      } finally {
        setPropertiesLoading(false);
        setLoading(false);
      }
    };

    if (agentKwUid) {
      fetchAgentByKwUid(agentKwUid);
    } else {
      fetchAgentFromPeopleData();
    }
  }, [agentEmail, agentKwUid]);
  
  
    // Removed cache-based agent fetch effect
    
    // Update filteredProperties when properties change
    useEffect(() => {
      setFilteredProperties(properties);
    }, [properties]);
  
    // Removed fallback property extraction from combinedApiData
  
      useEffect(() => {
        const fetchEvents = async () => {
          try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
            
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            setEvents(data);
            //console.log(data.coverImage);
            
          } catch (error) {
            //console.error('Error fetching blogs:', error);
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
          const linksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/links`);
          if (linksResponse.ok) {
            const linksData = await linksResponse.json();
            //console.log('Links data received:', linksData);
            // Backend returns links directly, not wrapped in an object
            setLinks(Array.isArray(linksData) ? linksData : []);
          } else {
            //console.log('Links API response not ok:', linksResponse.status);
          }
        } catch (error) {
          //console.error('Error fetching links:', error);
        }
      };

      fetchBlogsAndLinks();
    }, []);
  
    if (error) {
      return (
        <div className='relative p-6 lg:p-8'>
          <HeaderAgent />
          <div className='text-center bg-[rgb(206,32,39,255)] py-20'>{error}</div>
          <NewFooter />
        </div>
      );
    }
    
    if (loading && !agent) {
      return (
        <div className='relative p-6 lg:p-8'>
          <HeaderAgent/>
          <div className='flex justify-center items-center h-60'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600'></div>
          </div>
          <NewFooter />
        </div>
      );
    }
    


  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
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

      <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-[100px] lg:h-[100px] bg-[rgb(206,32,39,255)] z-0"></div>
      <div className="relative bg-gray-100">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar */}
          {/* Mobile bottom nav (hidden on desktop) */}
<aside className="flex lg:hidden w-full p-2 flex-row mt-30 sticky bottom-0 h-14 bg-white z-10 shadow-md">
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
<aside className="hidden lg:flex md:flex sm:flex lg:w-10 xl:w-64 p-2 lg:p-4 flex-col mt-6 lg:mt-20 pl-0 lg:pl-8 sticky top-0 lg:top-30 h-auto lg:h-screen overflow-x-auto lg:overflow-y-auto bg-white lg:bg-transparent z-10">
  <h1 className="text-xl font-bold text-gray-500 py-4 lg:py-6">{t('Dashboard')}</h1>
  <nav>
    <ul className="flex lg:flex-col gap-4 text-gray-700">
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
          <main className="flex-1 p-2 sm:p-4 lg:p-6">
          
            
            <div className="bg-white mt-8 lg:mt-20 px-2 sm:px-6 lg:px-20" ref={profileRef}>
<p className="font-semibold pt-4 text-[rgb(206,32,39,255)] text-2xl lg:px-10">{t('Agent Space')}</p>
  <p className="font-semibold text-gray-600 text-lg lg:px-10">KW {agent?.city || '-'}</p>
            
        
            {loading ? (
              <div className="hidden lg:flex flex-col lg:flex-row lg:mt-10 mt-10 shadow-xl rounded-3xl overflow-hidden w-full animate-pulse">
                <div className="w-full bg-gray-300 min-h-[80vh] flex flex-col justify-center px-6 sm:px-10 lg:px-16">
                  <div className="h-8 bg-gray-400 rounded mb-4"></div>
                  <div className="h-6 bg-gray-400 rounded mb-2 w-3/4"></div>
                  <div className="h-12 bg-gray-400 rounded mb-4 w-1/2"></div>
                  <div className="h-20 bg-gray-400 rounded w-64"></div>
                </div>
                <div className="w-full bg-gray-300 flex items-center justify-center">
                  <div className="w-32 h-40 sm:w-48 sm:h-56 lg:w-64  bg-gray-400 rounded-full"></div>
                </div>
              </div>
            ) : agent ? (
              <>
<div className="hidden lg:flex flex-col md:flex-row md:mt-10 lg:mt-6 mt-10 shadow-xl rounded-3xl overflow-hidden w-full">

  <div className="w-full md:w-1/2 text-white px-6 sm:px-10 md:px-10 lg:px-16 bg-[rgb(206,32,39,255)] min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center">
  <div className="text-center md:text-left">
    {/* Heading */}
    <h1
      className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl break-words mt-4 sm:mt-2 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {t("Property Sales in Saudi Arabia")}
    </h1>

    {/* Content */}
    <div className="text-sm sm:text-base md:text-lg lg:text-xl">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-10 md:mt-12 lg:mt-20 items-center sm:items-start lg:items-center">
        <p className="tracking-[2.5px]">{t("Property Expert")}</p>
      </div>

      {/* Agent Name */}
      <div
        className={`flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mt-4 items-start break-words ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <span className="whitespace-normal break-words">
          {agent?.name || agent?.fullName || ""}
        </span>
      </div>

      {/* Powered by Keller Williams */}
      <div className="flex mt-6 sm:mt-8 md:mt-10 lg:mt-20 justify-center md:justify-start">
        <Image
          src="/powerdby.png"
          alt={t("Powered by Keller Williams")}
          width={220}
          height={70}
          className="h-auto w-auto"
        />
      </div>
    </div>
  </div>
</div>


  {/* Right Section */}
  <div className="w-full md:w-1/2 relative flex items-center justify-center bg-[rgb(206,32,39,255)] md:bg-transparent lg:bg-transparent mt-8 md:mt-0 lg:mt-0">
    {/* Background Split (Desktop Only) */}
    <div className="absolute inset-0 flex">
      <div className="w-1/2 bg-[rgb(206,32,39,255)]"></div>
      <div className="w-1/2 bg-gray-400"></div>
    </div>

    {/* Agent Image */}
    <div className="relative z-10 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 aspect-square">
      <Image
        src={agent.image || "/avtar.jpg"}
  alt={agent?.name || agent?.fullName || t("Agent")}
  fill
  className="object-cover"
      />
    </div>
  </div>
</div>





{/* Mobile-Only Agent Card Box */}
<div className="flex flex-col bg-[rgb(206,32,39,255)] text-white shadow-lg rounded-2xl gap-4 mt-4 lg:hidden">
  {/* Agent Image */}
  <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mt-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
  
      <Image
  src={agent?.image||'/avtar.jpg'}
   alt={agent?.name || agent?.fullName || 'Agent'}
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
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 justify-center items-center  sm:items-center lg:items-center">
        <p className="tracking-[2.5px]">Property Expert</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 justify-center items-center sm:items-center lg:items-center">
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
  <p className="text-2xl lg:text-4xl font-semibold">
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

<div className="flex flex-col lg:flex-row items-center justify-center mt-4 gap-2 lg:gap-6 px-4 text-center lg:text-left">
  {/* Phone */}
  <span className="flex items-center gap-1 text-gray-500 text-base lg:text-lg">
    {t('Call')}:
  <span className="text-[rgb(206,32,39,255)]">{agent?.phone || "-"}</span>
  </span>

  {/* Divider for desktop */}
  <span className="hidden lg:inline border-l h-5 border-gray-400"></span>

  {/* Email */}
  <span className="flex flex-wrap items-center gap-1 text-gray-500 text-base lg:text-lg">
  {t('Email')}:
  <span className="text-[rgb(206,32,39,255)] break-all">{agent?.email || ""}</span>
</span>

  {/* Divider for desktop */}
  <span className="hidden lg:inline border-l h-5 border-gray-400"></span>

  {/* KW UID */}
  <span className="flex items-center gap-1 text-gray-500 text-base lg:text-lg">
    {t('Kw UID')}:
    <span className="text-[rgb(206,32,39,255)]">
      {agent?.kw_uid || t('Not specified')}
    </span>
  </span>
 </div> 

              </>
            ) : null}

<div className='bg-white'>
   <p className="flex flex-wrap justify-center items-center text-2xl lg:text-3xl mt-10 lg:mt-20 font-semibold mb-6 lg:mb-12 text-center">
  <span className='text-[rgb(206,32,39,255)] mr-2'>{t("Properties from")}</span>
  <span className="break-words">{agent?.name || agent?.fullName || '-'}</span>
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {(agentProperties.length > 0 ? agentProperties : properties).slice(0, visibleCount).map((property, idx) => (
        <div
          key={property._kw_meta?.id || property.id }
          className="bg-white shadow-2xl overflow-hidden w-full cursor-pointer"
          onClick={() => {
            const propertyId = property._kw_meta?.id || property.id || property.list_id || idx;
            router.push(`/propertydetails/${propertyId}`);
          }}
        >
          {/* Image section */}
          <div className="relative w-full h-40 sm:h-48 lg:h-60">
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
          className="px-8 py-3 bg-gray-500 text-white font-semibold text-base transition-colors"
        >
          {t("Load More Properties")}
        </button>
      </div>
    )}
  </div>
)}
               <div className="flex flex-col items-center mt-10 lg:mt-30 ">
      {/* Training Calendar */}
      <h2
        className="text-2xl lg:text-3xl font-semibold mb-10 tracking-[1.5px]"
        ref={calendarRef}
      >
        {t("Training")} <span className="text-[rgb(206,32,39,255)]">{t("Calendar")}</span>
      </h2>

  <div className="flex gap-4 sm:gap-8 lg:gap-10 mb-8 lg:mb-16 flex-wrap justify-center">
        {links
          .filter((link) => link.name === "Jamin" || link.name === "Jeddah")
          .map((link) => {
            
            return (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgb(206,32,39)] text-white px-4 sm:px-8 lg:px-10 py-4 sm:py-6 text-base sm:text-xl font-semibold transition cursor-pointer inline-flex items-center hover:bg-[rgb(180,28,35)]"
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
        className="text-2xl lg:text-3xl font-semibold mb-8 mt-20 tracking-[1.5px]"
        ref={agentDriveRef}
      >
        <span className="text-[rgb(206,32,39,255)]">{t("Agent")}</span> {t("Drive")}
      </h2>

  <div className="flex gap-2 sm:gap-4 mb-4 lg:mb-8 flex-wrap justify-center">
        {links
          .filter((link) => link.name === "Resources" || link.name === "Agent Drive" || link.name === "Drive")
          .map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[rgb(206,32,39,255)] text-white px-6 sm:px-16 lg:px-40 tracking-[1.5px] py-4 sm:py-6 text-lg sm:text-2xl font-semibold transition cursor-pointer inline-block text-center hover:bg-[rgb(180,28,35)]"
            >
             {t("View")} {t(link.name)}
            </a>
          ))}
        
       
       
      </div>
    </div> {/* Filter Bar */}
          
  <p className="flex justify-center items-center text-2xl lg:text-3xl font-semibold py-6 lg:py-10 mt-10 lg:mt-20 tracking-[1.5px]" ref={eventsRef}>
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-10 p-4 ">
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
                           : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
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
                <h3 className="lg:text-2xl text-xl mb-2 font-semibold line-clamp-2">
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