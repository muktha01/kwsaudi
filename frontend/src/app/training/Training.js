'use client'
import React from 'react';
import {useState,useEffect} from 'react';
import Header from '@/components/header';
import Box from '@/components/box';
import Footer from '@/components/newfooter';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
export default function Training() {
  const [heroSrc, setHeroSrc] = useState('/');
  const[page,setPage]=useState('');
   const [loading, setLoading] = useState(true);
  const router=useRouter()
  const { t, language, isRTL } = useTranslation();
  useEffect(() => {
    const CACHE_KEY = 'training_page_data';
    const CACHE_EXPIRY_KEY = 'training_page_data_expiry';
    const SESSION_CACHE_KEY = 'training_page_session';
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

    const fetchPageHero = async () => {
      // Step 1: Show cached data immediately (if available)
      const showCachedDataImmediately = () => {
        if (typeof window !== 'undefined') {
          // Check sessionStorage first for ultra-fast access
          const sessionData = sessionStorage.getItem(SESSION_CACHE_KEY);
          if (sessionData) {
            try {
              const parsedData = JSON.parse(sessionData);
              setPage(parsedData.page);
              setHeroSrc(parsedData.heroSrc);
              return true; // Cached data was shown
            } catch (e) {
              //console.warn('Error parsing session cache:', e);
            }
          }

          // Check localStorage for persistent cache
          const cachedData = localStorage.getItem(CACHE_KEY);
          const cachedExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
          const now = Date.now();

          if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
            try {
              const parsedData = JSON.parse(cachedData);
              // Copy to session storage for ultra-fast next access
              sessionStorage.setItem(SESSION_CACHE_KEY, cachedData);
              setPage(parsedData.page);
              setHeroSrc(parsedData.heroSrc);
              return true; // Cached data was shown
            } catch (e) {
              //console.warn('Error parsing localStorage cache:', e);
            }
          }
        }
        return false; // No cached data
      };

      // Step 2: Fetch fresh data function
      const fetchFreshData = async (isBackgroundUpdate = false) => {
        try {
          if (!isBackgroundUpdate) {
            setLoading(true);
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/kw-training`, {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'max-age=300', // 5 minutes browser cache
            }
          });

          clearTimeout(timeoutId);

          if (!res.ok) {
            // Try to use expired cache if API fails
            if (typeof window !== 'undefined') {
              const cachedData = localStorage.getItem(CACHE_KEY);
              if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setPage(parsedData.page);
                setHeroSrc(parsedData.heroSrc);
                return;
              }
            }
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const page = await res.json();
          setPage(page);
          
          let heroSrcValue = '/';
          if (page?.backgroundImage) {
            const cleanPath = page.backgroundImage.replace(/\\/g, '/');
            heroSrcValue = cleanPath.startsWith('http')
              ? cleanPath
              : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
            setHeroSrc(heroSrcValue);
          }

          // Cache the fresh data in both localStorage and sessionStorage
          if (typeof window !== 'undefined') {
            const dataToCache = {
              page: page,
              heroSrc: heroSrcValue
            };
            const now = Date.now();
            localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
            localStorage.setItem(CACHE_EXPIRY_KEY, (now + CACHE_DURATION).toString());
            sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(dataToCache));
          }

          // Show update notification for background updates
          if (isBackgroundUpdate) {
            //console.log('✅ Training page updated with latest data');
          }

        } catch (error) {
          if (error.name === 'AbortError') {
           // console.warn('Training page fetch timeout');
          }
          //console.error('Error fetching training page:', error);
          
          if (!isBackgroundUpdate) {
            // Try to use expired cache if API fails
            if (typeof window !== 'undefined') {
              const cachedData = localStorage.getItem(CACHE_KEY);
              if (cachedData) {
                try {
                  const parsedData = JSON.parse(cachedData);
                  setPage(parsedData.page);
                  setHeroSrc(parsedData.heroSrc);
                } catch (parseError) {
                  //console.warn('Error parsing cached training data:', parseError);
                }
              }
            }
          }
        } finally {
          if (!isBackgroundUpdate) {
            setLoading(false);
          }
        }
      };

      // Main execution flow
      try {
        // Try to show cached data immediately
        const cachedDataShown = showCachedDataImmediately();

        if (cachedDataShown) {
          // User sees cached data instantly, now fetch fresh data in background
          setTimeout(() => fetchFreshData(true), 100); // Small delay to let UI render
        } else {
          // No cached data, show loading and fetch fresh data
          await fetchFreshData(false);
        }

      } catch (err) {
       // console.error('Error in fetchPageHero:', err);
        setLoading(false);
      }
    };

    fetchPageHero();
  }, []);

  // Client-side cache initialization effect to avoid hydration errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check sessionStorage first for ultra-fast access
        const sessionData = sessionStorage.getItem('training_page_session');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          if (parsedData.page && !page) setPage(parsedData.page);
          if (parsedData.heroSrc && parsedData.heroSrc !== '/' && (!heroSrc || heroSrc === '/')) {
            setHeroSrc(parsedData.heroSrc);
          }
          return;
        }

        // Fallback to localStorage
        const cachedData = localStorage.getItem('training_page_data');
        const cachedExpiry = localStorage.getItem('training_page_data_expiry');
        const now = Date.now();
        if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData.page && !page) setPage(parsedData.page);
          if (parsedData.heroSrc && parsedData.heroSrc !== '/' && (!heroSrc || heroSrc === '/')) {
            setHeroSrc(parsedData.heroSrc);
          }
          // Copy to session storage for next access
          sessionStorage.setItem('training_page_session', cachedData);
        }
      } catch (e) {
        //console.warn('Error reading cached training data in client effect:', e);
      }
    }
  }, [heroSrc,page]); // Run once on mount
  return (
    <div>
      <Header />
      <Box
        h3={page.pageName}
         src={heroSrc}
        // image={
        //   '/ourculture2.jpg'
        // }
      />

  <section className="bg-white  lg:pb-16 mb-4  text-center">
      <div className=" mx-auto">
       <Image src="/keller.png" alt={t("Gary Keller")}
       width={1800} height={700} 
       className="mx-auto w-full h-auto" /> </div>
      </section>

  <section className="bg-white py-6 lg:py-10 px-6 text-center">
  <div className="grid grid-cols-3 sm:grid-cols-3 gap-x-16 gap-y-10 max-w-full lg:mx-auto mx-6">
          <div>
            <p className="text-xl lg:text-5xl lg:font-normal font-bold mb-2">1200+</p>
            <div className="mx-auto my-2 h-[1px] max-w-[200px] w-full bg-gradient-to-r from-[rgb(206,32,39,255)] via-[rgb(206,32,39,255)] to-black" />

            <p className="lg:text-base text-sm text-gray-600">{t("Hours of On Demand")}<br />{t("Learning")}</p>
          </div>

          <div>
          <p className="text-xl lg:text-5xl lg:font-normal font-bold mb-2">68+</p>
          <div className="mx-auto my-2 h-[1px] max-w-[200px] w-full bg-gradient-to-r from-[rgb(206,32,39,255)] via-[rgb(206,32,39,255)] to-black" />

          <p className="lg:text-base text-sm text-gray-600">{t("Unique Courses")}<br />{t("Available")}</p>
          </div>

          <div>
          <p className="text-xl lg:text-5xl lg:font-normal font-bold mb-2">100+</p>
          <div className="mx-auto my-2 h-[1px] max-w-[200px] w-full bg-gradient-to-r from-[rgb(206,32,39,255)] via-[rgb(206,32,39,255)] to-black" />

          <p className="lg:text-base text-sm text-gray-600">{t("Live Training Events")}<br />{t("Worldwide")}</p>
          </div>
        </div>
      </section>
      

     
  <section className="relative mt-4 w-full min-h-[61vh] lg:min-h-screen text-white flex items-center justify-center">
        <Image src="/coaching.png" alt={t("Training Stage Background")}  fill className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-full px-6 text-center">
          <h1 className="text-2xl lg:text-4xl lg:font-normal font-bold mb-6">{t("TRAINING & COACHING")}</h1>
          <hr className="w-30 lg:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 lg:mb-8 mb-10" />
          <p className="text-sm lg:text-[1.1rem] leading-relaxed font-normal lg:px-70"> {t("Named The #1 Training Organization In The World By Training Magazine In 2015, We're Often Described As A Training And Coaching Company Cleverly Disguised As A Real Estate Franchise.")}</p>
        </div>
      </section>

  <section className="lg:py-16 py-4">
  <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
          <div className="text-center lg:text-center">
            <h2 className="text-xl lg:text-3xl lg:font-semibold font-semibold text-[rgb(206,32,39,255)] mb-6">{t("In Person & Online Sessions")}</h2>
            <p className="lg:text-[1.3rem] text-[0.8rem] text-gray-700 mb-8 mx-6 lg:mx-0 lg:px-20">{t("At KW Saudi Arabia, we provide flexible training to suit your needs. Join in-person events to connect and learn from top talent, or access online sessions for world-class training anytime. Elevate your career—explore our sessions today!")}</p>
         <div className="flex justify-center lg:justify-center">
  <button className="cursor-pointer lg:px-10 px-4  bg-[rgb(206,32,39,255)] text-white py-2 lg:py-3 text-xs lg:text-sm  relative overflow-hidden group rounded-full transition-all duration-300 hover:pr-10 hover:pl-10" onClick={() => router.push('/contactUs')}>
                                  <span className="inline-block lg:text-base text-sm font-semibold transition-all duration-300 group-hover:-translate-x-3">
                                  {t("CONTACT US")}
                                  </span>
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white group-hover:translate-x-0 translate-x-4">
                                      <ChevronRight className={`text-white w-4 h-4 lg:w-6 lg:h-6 ${isRTL ? 'rotate-180' : ''}`} />
                                  </span>
                                </button>
</div>

</div>
          <div className="text-center lg:text-center mt-4 lg:mt-0">
          <h2 className="text-xl lg:text-3xl lg:font-semibold font-semibold text-[rgb(206,32,39,255)] mb-6">{t("Events")}</h2>
          <p className="lg:text-[1.3rem] text-[0.8rem] text-gray-700 mx-6 lg:mx-0 mb-8 lg:px-20">{t("Network and learn with top real estate talent at Keller Williams events. From Family Reunion to Mega Agent Camp and Masterminds, connect with top producers, bold thinkers, and market makers. No other event compares.")}</p>
          <div className="flex justify-center lg:justify-center">
   <button className="cursor-pointer lg:px-10 px-4  bg-[rgb(206,32,39,255)] text-white py-2 lg:py-3 text-xs lg:text-sm  relative overflow-hidden group rounded-full transition-all duration-300 hover:pr-10 hover:pl-10" onClick={() => router.push('/ourCulture/events')}>
                                   <span className="inline-block lg:text-base text-sm font-semibold transition-all duration-300 group-hover:-translate-x-3">
                               {t("LEARN MORE")}
                                   </span>
                                   <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white group-hover:translate-x-0 translate-x-4">
                                      <ChevronRight className={`text-white w-4 h-4 lg:w-6 lg:h-6 ${isRTL ? 'rotate-180' : ''}`} />
                                   </span>
                                 </button>
</div>

          </div>
        </div>
      </section>

      <section className="relative w-full min-h-[61vh] lg:min-h-screen text-white flex items-center justify-center">
        <Image src="/buildexperties.jpg" alt={t("Build Expertise Background")} fill className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-full px-6 text-center">
          <h1 className="text-2xl lg:text-4xl font-normal lg:tracking-[0.1rem] tracking-[0.2rem] lg:mb-10 mb-5">{t("BUILD EXPERTISE")}</h1>
          <hr className="w-30 lg:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 lg:mb-8 mb-10" />

          <p className="text-sm lg:text-[1.1rem] leading-relaxed lg:font-normal lg:mx-50 mx-4">{t("Keller Williams University Provides The Most Advanced And Comprehensive Learning Opportunities In Real Estate And Empowers You To Become The Expert In Your Local Market.")}</p>
        </div>
      </section>

     
      {/* BOOKS SECTION */}
{/* BOOKS SECTION */}
<section className="lg:py-8 py-2 mx-0 lg:mx-10">
  <div>
    <div className="flex flex-col lg:flex-row items-center lg:items-center">

      {/* Left side - Books */}
      <div className={`w-full flex justify-center  ${isRTL ? 'lg:pr-0 lg:pl-60' : 'lg:pl-0 lg:pr-60'}  lg:justify-start mb-8 lg:mb-0`}>
        <div className="flex">
          <Image
            src="/bookblue.png"
            alt={t("The Millionaire Real Estate Investor")}
            width={200}
            height={150}
            className={`bottom-0 w-[220px] h-[140px] md:w-[320px] md:h-[210px] lg:w-[450px] lg:h-[300px] rotate-[-8deg]
              ${isRTL ? 'lg:-mr-30 md:-mr-20 -mr-14 z-30' : 'lg:-ml-30 md:-ml-20 -ml-14 z-10'}`}
          />
          <Image
            src="/book.png"
            alt={t("Your First Home")}
            width={200}
            height={150}
            className={`bottom-0 w-[220px] h-[140px] md:w-[320px] md:h-[210px] lg:w-[450px] lg:h-[300px] rotate-[-6deg]
              ${isRTL ? 'lg:-mr-66 md:-mr-50 -mr-40 z-20' : 'lg:-ml-64 md:-ml-50 -ml-40 z-20'}`}
          />
          <Image
            src="/bookred.png"
            alt={t("The Millionaire Real Estate Agent")}
            width={200}
            height={150}
            className={`bottom-0 w-[220px] h-[140px] md:w-[320px] md:h-[210px] lg:w-[450px] lg:h-[300px] rotate-[-10deg]
              ${isRTL ? 'lg:-mr-66 md:-mr-50 -mr-40 z-10' : 'lg:-ml-64 md:-ml-50 -ml-40 z-30'}`}
          />
          <Image
            src="/bookwhite.png"
            alt={t("The ONE Thing")}
            width={200}
            height={150}
            className={`bottom-0 w-[220px] h-[140px] md:w-[320px] md:h-[210px] lg:w-[450px] lg:h-[300px] rotate-[-6deg]
              ${isRTL ? 'lg:-mr-63 md:-mr-50 -mr-40 z-0' : 'lg:-ml-74 md:-ml-52 -ml-40 z-30'}`}
          />
        </div>
      </div>

      {/* Right side - Title */}
      <div className="w-full lg:w-1/2 lg:pl-8 flex items-center justify-center lg:justify-end px-2">
        <h2 className="text-xl lg:text-4xl font-normal text-[rgb(206,32,39,255)] text-center lg:text-right break-words">
          {t("BEST SELLING")} <br /> {t("BOOKS")}
        </h2>
      </div>
    </div>
  </div>
</section>

<hr className='mt-10'></hr>




{/* TRAINING SECTION */}
<section className="py-16 bg-white overflow-hidden">
  <div className="mx-5 lg:mx-10 ">
    <div className="flex flex-col lg:flex-row items-center justify-center">

      {/* Left side - Iframe */}
      <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0 ">
        <div className="relative w-full aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/Ha3HOtIQEKQ?rel=0"
            title={t("Unlock Exceptional Results With This Real Estate Farming Model")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>

      {/* Right side - Text */}
      <div className="w-full lg:w-1/2 lg:pl-8 flex items-center justify-center lg:justify-end px-2">
        <h2 className="text-xl lg:text-4xl font-normal text-[rgb(206,32,39,255)] text-center lg:text-right break-words">
          {t("ONGOING TRAINING")} <br /> {t("DEVELOPMENT")}
        </h2>
      </div>
    </div>
  </div>
</section>



      <section className="relative w-full min-h-[61vh] lg:min-h-screen text-white flex items-center justify-center">
        <Image src="/removelimits.jpg" alt={t("Remove Limits Background")} fill className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-full px-6 text-center">
           <h1 className="text-2xl lg:text-4xl font-normal lg:tracking-[0.1rem] tracking-[0.2rem] lg:mb-10 mb-5">{t("REMOVE LIMITS")}</h1>
          <hr className="w-34 lg:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 mb-8" />
          <p className="text-sm lg:text-[1.1rem] leading-relaxed lg:font-normal lg:mx-50 mx-4">{t("Your Business Grows To The Extent That You Do! Award-winning Kw Maps Coaching Offers A Breadth Of High-accountability Programs Designed To Turn Your Biggest Goals Into Realty. Our Coaches Are Experts On Industry Best Practices, The Models Of Mrea And Keller Williams Systems, Putting Them In A Unique Position To Guide You To The Next Level.")}</p>
        </div>
      </section>

      <main className="flex px-4 py-6 lg:mt-24 mt-4">
  <div className="mx-auto text-center lg:px-70 px-10">
    <p className="text-2xl lg:text-4xl tracking-[0.1em]">{t("CONNECT WITH US")}</p>
    <hr className="w-48 lg:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 mt-6 lg:mt-10" />

    <div className="mt-6 lg:mt-10">
      <p className="text-sm lg:text-base leading-relaxed px-2 lg:px-6">
        {t("The Best Information Always Comes From A Face-to-face Conversation With A Local Market Expert – That's Your Kw Team Leader. Reach Out To Discuss The Market Of The Moment With A Team Leader Today.")}
      </p>
    </div>
  </div>
</main>


<div className="flex justify-center my-6">
  <Link href="/contactUs">
    <button className="cursor-pointer flex justify-center items-center text-sm lg:text-base font-semibold bg-[rgb(206,32,39,255)] hover:bg-gray-600 text-white py-3 lg:px-20 px-4 mt-5 rounded-full focus:outline-none transition w-auto">
      {t("Join a Keller Williams Market Center Near You")}
    </button>
  </Link>
</div>



      
     
      <Footer />
    </div>
  );
}
