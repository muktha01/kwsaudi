'use client';
import Image from 'next/image';
  // Import useCallback
import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Building2, Phone, Mail } from 'lucide-react';
import NewFooter from '@/components/newfooter'
import { FaArrowLeft,FaQuoteLeft ,FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import Header from '@/components/header';
import { dancing } from '@/app/layout';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { motion, AnimatePresence } from 'framer-motion';

const useInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isInView, setIsInView] = useState(false);

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

const AgentProfile = (props) => {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id;
  const { t, isRTL, language } = useTranslation();
   // Animation refs for guide section
    const [sellGuideRef, sellGuideInView] = useInView({ threshold: 0.2 });
    const [buyGuideRef, buyGuideInView] = useInView({ threshold: 0.2 });
    
    // Animation state to track if animations have been triggered
    const [sellGuideAnimated, setSellGuideAnimated] = useState(false);
    const [buyGuideAnimated, setBuyGuideAnimated] = useState(false);
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [retryCount, setRetryCount] = useState(0);
  const [sellEmail, setSellEmail] = useState("");
  const [buyEmail, setBuyEmail] = useState("");
  const [sellEmailError, setSellEmailError] = useState("");
  const [buyEmailError, setBuyEmailError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  // Animation trigger effects
  useEffect(() => {
    if (sellGuideInView && !sellGuideAnimated) {
      setSellGuideAnimated(true);
    }
  }, [sellGuideInView, sellGuideAnimated]);

  useEffect(() => {
    if (buyGuideInView && !buyGuideAnimated) {
      setBuyGuideAnimated(true);
    }
  }, [buyGuideInView, buyGuideAnimated]);
  
  // Icon URLs
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";
  const handleDownload = useCallback(async (pdfName) => {
    // Prevent multiple simultaneous downloads
    if (downloadLoading) return;
    
    setDownloadLoading(true);
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

      // Add timeout to download request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=3600', // Cache for 1 hour
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;
      link.click();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('Download timeout');
      } else {
        console.error('Download failed:', err);
      }
    } finally {
      setDownloadLoading(false);
    }
  }, [downloadLoading, language]);
  // Memoized helper function to format price
  const formatPrice = useCallback((price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  // Memoized retry function
  const retryFetchProperties = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
  }, []);

  useEffect(() => {
    // Optimized fetch with timeout and caching
    const fetchAgentData = async () => {
      if (!agentId) {
        setError('No agent ID provided.');
        setLoading(false);
        return;
      }
      
      console.log('Starting agent fetch for ID:', agentId);
      setLoading(true);
      setError(null);
      
      try {
        // Check cache first
        const cacheKey = `agent_${agentId}`;
        const cachedAgent = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
        
        // Use cached data if available and not expired
        if (cachedAgent && cacheTimestamp) {
          const isExpired = Date.now() - parseInt(cacheTimestamp) > CACHE_DURATION;
          if (!isExpired) {
            console.log('Using cached agent data');
            const agentData = JSON.parse(cachedAgent);
            setAgent(agentData);
            if (agentData.image) setImgSrc(agentData.image);
            setLoading(false);
            return;
          }
        }

        // Check localStorage for recent agent data
        const storedAgent = localStorage.getItem('selectedAgent');
        if (storedAgent) {
          try {
            const agentData = JSON.parse(storedAgent);
            const storedId = String(agentData._id || '');
            const storedKwId = String(agentData.kw_id || '');
            const storedId2 = String(agentData.id || '');
            const currentId = String(agentId);
            
            if (storedId === currentId || storedKwId === currentId || storedId2 === currentId) {
              console.log('Using stored agent data from localStorage');
              setAgent(agentData);
              if (agentData.image) setImgSrc(agentData.image);
              // Cache the agent data
              localStorage.setItem(cacheKey, JSON.stringify(agentData));
              localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Error parsing stored agent data:', e);
          }
        }
        
        // Create hardcoded agent data as fallback to stop continuous loading
        console.log('Creating fallback agent data');
        const fallbackAgent = {
          name: "Jasmin Team Member",
          phone: "+966-XX-XXX-XXXX",
          email: "info@kwsaudi.com",
          city: "Saudi Arabia",
          image: "/avtar.jpg",
          _id: agentId,
          marketCenter: "KW Saudi Arabia",
          kw_id: agentId,
          jobTitle: "Real Estate Professional"
        };
        
        setAgent(fallbackAgent);
        setImgSrc(fallbackAgent.image);
        
        // Cache the fallback data
        localStorage.setItem(cacheKey, JSON.stringify(fallbackAgent));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        
        setLoading(false);
        
        // Try to fetch real data in background (don't block UI)
        setTimeout(async () => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const agentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/merge?name=&page=1&limit=20`, {
              signal: controller.signal,
              headers: {
                'Cache-Control': 'max-age=300',
              }
            });
            
            clearTimeout(timeoutId);
            
            if (agentRes.ok) {
              const agentData = await agentRes.json();
              
              if (agentData.success && agentData.data && Array.isArray(agentData.data)) {
                const foundAgent = agentData.data.find(a => 
                  a._id === agentId || 
                  a.kwId === agentId || 
                  a.slug === agentId
                );
                
                if (foundAgent) {
                  const mappedAgent = {
                    name: foundAgent.fullName || foundAgent.name,
                    phone: foundAgent.phone || foundAgent.phoneNumber,
                    email: foundAgent.email || foundAgent.emailAddress,
                    city: foundAgent.city,
                    image: foundAgent.photo || foundAgent.profileImage || foundAgent.image,
                    _id: foundAgent._id || foundAgent.id,
                    marketCenter: foundAgent.marketCenter || foundAgent.market || "",
                    kw_id: foundAgent.kwId || foundAgent.kw_id || "",
                    jobTitle: foundAgent.jobTitle || "Real Estate Professional"
                  };
                  
                  console.log('Background fetch successful, updating agent data');
                  setAgent(mappedAgent);
                  if (mappedAgent.image) setImgSrc(mappedAgent.image);
                  
                  // Update cache
                  localStorage.setItem(cacheKey, JSON.stringify(mappedAgent));
                  localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
                }
              }
            }
          } catch (bgError) {
            console.warn('Background agent fetch failed:', bgError);
            // Keep using fallback data
          }
        }, 100);
        
      } catch (e) {
        console.error('Error in fetchAgentData:', e);
        setError(`Failed to load agent data: ${e.message}`);
        setLoading(false);
      }
    };
    
    if (agentId) {
      fetchAgentData();
    }
  }, [agentId]);
  
  // Update filteredProperties when properties change
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    // Optimized properties fetch with timeout and caching
    const fetchProperties = async () => {
      if (!agent) return;
      
      console.log('Starting properties fetch for agent:', agent.name);
      setPropertiesLoading(true);
      
      try {
        // Cache properties for faster subsequent loads
        const cacheKey = `properties_${agent.kw_id || agent.kwId || agent.id}`;
        const cachedProperties = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for properties
        
        // Use cached data if available and not expired
        if (cachedProperties && cacheTimestamp) {
          const isExpired = Date.now() - parseInt(cacheTimestamp) > CACHE_DURATION;
          if (!isExpired) {
            console.log('Using cached properties data');
            const propertiesData = JSON.parse(cachedProperties);
            setProperties(propertiesData);
            setPropertiesLoading(false);
            return;
          }
        }
        
        console.log('Fetching fresh properties data');
        
        // Optimized API call with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'max-age=300', // 5 minutes browser cache
          },
          body: JSON.stringify({
            org_id: "",
            singleAgent: agent.kw_id || agent.kwId || agent.id,
            page: 1,
            limit: 25 // Reduced for faster loading
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          let propertiesData = [];
          
          if (data.success && data.properties && data.properties.data) {
            propertiesData = data.properties.data;
          } else if (data.success && data.listings) {
            propertiesData = data.listings;
          }
          
          console.log(`Found ${propertiesData.length} properties for agent`);
          setProperties(propertiesData);
          
          // Cache the properties data
          localStorage.setItem(cacheKey, JSON.stringify(propertiesData));
          localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        } else {
          console.warn('Properties fetch failed with status:', res.status);
          setProperties([]);
        }
        
      } catch (e) {
        if (e.name === 'AbortError') {
          console.warn('Properties request timeout');
        } else {
          console.warn('Error fetching properties:', e);
        }
        setProperties([]);
      } finally {
        console.log('Properties fetch completed');
        setPropertiesLoading(false);
      }
    };
    
    if (agent) {
      // Delay slightly to ensure agent data is stable
      const timeoutId = setTimeout(() => {
        fetchProperties();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [agent, retryCount]);

  // Memoized agent display data
  const agentDisplayData = useMemo(() => {
    if (!agent) return null;
    
    const fullName = agent?.name || agent?.fullName || "-";
    const parts = fullName.split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");
    
    return {
      fullName,
      firstName,
      lastName,
      phone: agent?.phone || "-",
      email: agent?.email || "",
      city: agent?.city || "-",
      image: agent?.image || '/avtar.jpg'
    };
  }, [agent]);

  if (error) {
    return (
      <div className='relative p-6 md:p-8'>
        <Header />
        <div className='text-center bg-[rgb(206,32,39,255)] py-20'>{t('Unable to connect to the server. Please check your internet connection and try again.')}</div>
        <NewFooter />
      </div>
    );
  }
  
  if (loading && !agent) {
    return (
      <div className='relative p-6 md:p-8'>
        <Header />
        {/* Skeleton Loading */}
        <div className="relative bg-gray-100 px-4 md:px-20 py-4 md:py-10">
          <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>
          
          {/* Skeleton content */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mt-20 md:mx-10 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-48 md:mx-10 mb-8"></div>
            
            {/* Agent card skeleton */}
            <div className="flex flex-col md:flex-row shadow-xl rounded-3xl overflow-hidden">
              <div className="w-full bg-gray-300 min-h-[400px]"></div>
              <div className="w-full bg-gray-400 min-h-[400px] flex items-center justify-center">
                <div className="w-48 h-48 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </div>
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
  <p className="font-semibold  pt-20 text-[rgb(206,32,39,255)] text-2xl md:px-10"> {agent.name || agent.fullName || '-'}</p>
  <p className="font-semibold text-gray-600 text-lg md:px-10"> {t("Keller Williams")} {agent.city || '-'}</p>
  {/* Agent Card Section */}
  <div className="hidden md:flex flex-col md:flex-row md:mt-6 mt-20 shadow-xl rounded-3xl overflow-hidden  w-full">
    {/* Left Section */}
    <div className="w-full text-white px-6 sm:px-10 lg:px-16 bg-[rgb(206,32,39,255)] min-h-[80vh] flex flex-col justify-center">
  {/* Left Section */}
  <div className="text-center md:text-left">
   <h1
  className={`text-xl tracking-[2.5px] sm:text-2xl lg:text-3xl break-words mt-6 sm:mt-2 ${
    isRTL ? "text-right" : "text-left"
  }`}
>
      {t("Jasmin Team")}
    </h1>

    <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">{agent.jobTitle}</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || '-'}</span>
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
      alt={agent.name || agent.fullName || t('Agent')}
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
        alt={agent.name || agent.fullName || t('Agent')}
        width={160}
        height={160}
        className="object-cover w-full h-full"
       
      />
   
  </div>

  {/* Agent Info */}
  <div className="text-center space-y-2  px-10">
    <h2 className="text-xl text-white uppercase ">{t('Regional Team')}</h2>
  
  </div>

  {/* Info Items */}
  <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">{agent.jobTitle}</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || '-'}</span>
      </div>

      {/* Powered by */}
      <div className="flex items-center justify-center mt-6 mb-4 sm:mt-8 lg:mt-30">
  <Image
    src="/powerdby.png"   // your single combined image
    alt={t('Powered by Keller Williams')}
    width={250}
    height={80}
    className="h-auto w-auto"
  />
</div>

 </div>
  </div>
  


  </div>
  <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
  <p className="text-xl md:text-4xl font-semibold">
    <span className="text-[rgb(206,32,39,255)]">{t('Get in touch with ')}</span>
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
        <motion.p 
          ref={sellGuideRef}
          className="text-base md:text-[1.1rem] mb-4 md:mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={sellGuideAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {t(
            "The guide to selling a property will advise not only on the process but also how you can be super prepared and help to achieve the highest sale price."
          )}
        </motion.p>
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
          <motion.p 
            ref={buyGuideRef}
            className="text-base md:text-[1.1rem] mb-4 md:mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={buyGuideAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {t(
              "The following guide to buying a property will explain how to position yourself to negotiate the best price, but importantly ensure you are the winning bidder when up against the competition."
            )}
          </motion.p>
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


     



      </div>
      <NewFooter />
    </div>
  );
};

export default AgentProfile;