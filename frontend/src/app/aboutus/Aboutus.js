'use client'
import React, { useRef,useState, useEffect } from 'react';
import Header from '@/components/header';
import Box from '@/components/box';
import Footer from '@/components/newfooter';
import Image from 'next/image';


import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useTranslation } from '@/contexts/TranslationContext';
import { employeeAPI } from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';


export default function Aboutus() {
  const [heroSrc, setHeroSrc] = useState('/'); 
  const [page, setPage] = useState('');
  const videoRef = useRef(null);

  const { t, isRTL } = useTranslation();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {}); // play might need catch in some browsers
          } else {
            video.pause();
          }
        },
        { threshold: 0.5 } // play/pause when 50% visible
      );
      observer.observe(video);
    }

    return () => {
      if (observer && video) observer.unobserve(video);
    };
  }, []);

  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/page/slug/about-us');
        if (!res.ok) return;
        // console.log(res);
        
        const page = await res.json();
        setPage(page)
        if (page?.backgroundImage) {
           const cleanPath = page.backgroundImage.replace(/\\/g, '/');
        setHeroSrc(
          cleanPath.startsWith('http')
            ? cleanPath
            : `http://localhost:5001/${cleanPath}`
        );
        }
      } catch (e) {
        // console.error('Error fetching page hero:', e);
      }
    };
    fetchPageHero();
  }, []);
   const { language } = useTranslation();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router=useRouter();
    const images = [
      '/M.AWAD.png',
      '/Sarah Said.png',
      '/Abdullah Bakeer.png',
      '/Khalid Yaseen Baig.png',
      '/Rawan Rahhal.png',
      '/Areej Al Rashed.png',
      '/Essa Aljuwaied.png',
      '/Zeeshan Saif.png',
      '/Abdulaziz.png',
     
      '/Amro Nada.png',
     
      
      '/Hamdan Alkatheeri.png',
      
     
      
     
      
      
    ];
     const handleAgentClick = (agent) => {
      if (typeof window !== 'undefined') {
        // Navigate to dynamic route with agent ID
        const agentId = agent._id || agent.kw_id || agent.kwId || agent.id;
        router.push(`/aboutus/${agentId}`);
      }
    };
    
    useEffect(() => {
      const fetchTeamMembers = async () => {
        try {
          setLoading(true);
          const response = await employeeAPI.getEmployeesByTeam('Regional Team');
  
          if (response.success && response.employees) {
            setTeamMembers(response.employees);
          } else {
            // console.warn('No team members found from API');
            setTeamMembers([]);
          }
        } catch (error) {
          // console.error('Error fetching team members:', error);
          setError(error.message);
          setTeamMembers([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTeamMembers();
    }, []);
  return (
    <div className={isRTL ? 'rtl' : ''}>
      <Header />

      <Box
      
        src={heroSrc}
        h3={page.backgroundOverlayContent}
        
      />

      <div className="px-10 md:px-20 py-2 text-black bg-white">
        {/* Heading + Image on same line */}
        <div className="md:flex md:items-start md:justify-between md:gap-10">
          {/* Text Section */}
          <div className="md:w-2/3">
            <div className="mb-6">
                <p className='text-[rgb(206,32,39,255)] text-xl py-4'>{t('About Us')}</p>
              <h2 className={`text-2xl md:text-3xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('Empowering Real Estate Across Saudi Arabia')}
              </h2>
            </div>

            <div className={`space-y-4 text-md md:text-lg leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
              <p>{t('KW Saudi Arabia — Building Dreams, Creating Opportunities')}</p>
              <p>
                {t("KW Saudi Arabia is part of Keller Williams, the world's largest real estate technology and franchise company. Founded on values of integrity, excellence, and innovation, KW Saudi Arabia is transforming how people buy, sell, and invest in real estate across the Kingdom.")}
                
              </p>
              <p>
                {t("We partner with developers, investors, and homeowners to unlock the true potential of Saudi Arabia's thriving real estate market.")}
                
              </p>
              <p>
                {t("KW Saudi Arabia is more than real estate — it's a platform for building communities, growing wealth, and shaping the future of property in the Kingdom. We believe in \"people before profit.\"")}
                
              </p>
            </div>
          </div>

          {/* Video Section */}
           <div className="md:w-1/3 md:mt-30 mt-10">
      <video
        ref={videoRef}
        src='https://dev1.w4u.us/About_us_ssection%20video.mp4'
        height={350}
      
        loop
        playsInline
        preload="metadata"
        
      />
    </div>
        </div>

        {/* Bottom Grid Section */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 md:mt-16 ${isRTL ? 'text-right' : 'text-left'} mb-10 md:mb-20`}>
  {/* First Column */}
  <div>
    <h3 className="text-lg md:text-3xl md:leading-16 tracking-[0.1rem]">
      {t('Our Operating ')} <br />
      {t('Principles')}
    </h3>
  </div>

  {/* Second Column */}
  <div>
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">{t('Our Mission')}</h3>
    <p className='md:text-lg text-md'>
      {t('To Build Careers Worth Having, Businesses Worth Owning, Lives Worth Living, Experiences Worth Giving, And Legacies Worth Leaving.')}
    </p>
  </div>

  {/* Third Column */}
  <div>
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">{t('Our Vision')}</h3>
    <p className='md:text-lg text-md'>
      {t('To Be The Real Estate Company Of Choice For Agents And Their Customers.')}
    </p>
  </div>

  {/* Extra Content - Second Column */}
  <div className="md:col-start-2">
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">{t('Our Perspective')}</h3>
    <p className='md:text-lg text-md'>
    {t("A Technology Company That Provides The Real Estate Platform That Our Agents' Buyers And Sellers Prefer. Keller Williams Thinks Like A Top Producer, Acts Like A Trainer-consultant, And Focuses All Its Activities On Service, Productivity, And Profitability.")}
    </p>
  </div>

  {/* Extra Content - Third Column */}
  <div>
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">{t('WI4C2TES')}</h3>
    <p className='md:text-lg text-md'>
    {t('Our Belief System Win-win: Or No Deal Integrity: Do The Right Thing Customers: Always Come First Commitment: In All Things Communication: Seek First To Understandcreativity: Ideas Before Results Teamwork: Together Everyone Achieves More Trust: Starts With Honesty Equity: Opportunities For Allsuccess: Results Through People.')}
    </p>
  </div>
</div>

      </div>
 <div>
      <div className="pt-4 mx-10 md:mx-10">
        <div className="flex flex-col md:flex-row md:px-20 items-start">
          <div className="md:w-140 h-[40vh] w-full md:h-full items-start">
            <Image
              src='/ceoimage.png'
              alt="CEO"
              width={800}
              height={500}
              className="h-[40vh] md:h-full w-full md:w-140 border border-gray-400"
            />
          </div>

          <div className={`w-full md:w-full flex flex-col justify-center items-center text-center mt-10 px-2 md:px-10 ${isRTL ? 'text-right' : 'text-center'}`}>
            <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-[rgb(206,32,39,255)]">
              {t('MEET OUR CEO')}
            </h1>
            <p className="mt-4 md:text-lg text-md md:leading-relaxed leading-normal mx-w-sm">
              {t('More than ever, we want to thank and recognize our agents and partners for diligently bringing their very best when their clients need it most. As a company built by agents, and for agents, we wake up every day asking ourselves how we can best support them.')}
            </p>
            <p className="mt-4 md:text-lg text-md md:leading-relaxed leading-normal mx-w-sm">
              {t('KW has cultivated an agent-centric, technology-driven, and education-based culture that rewards agents as stakeholders.')}
            </p>
            <p className="mt-4 md:text-lg text-md md:leading-relaxed leading-normal mx-w-sm">
              {t('Regional team members, market center team members, and agent partners. No one succeeds alone, and this is truly a shared moment in recognition of our continuous achievements together.')}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-white mt-6 md:mt-20">
        <div className="flex flex-col md:flex-row border-t border-b md:border-r border-black">
        <div className={`w-full md:w-1/2 flex justify-center items-center 
                         md:sticky md:top-0 top-20 h-auto md:h-screen 
                          ${isRTL?'md:border-l':'md:border-r'} border-black
                         py-4 md:py-0`}>
            <div className="text-center px-4 mb-10 md:mb-0">
              <h2 className={`text-3xl md:text-4xl md:font-normal font-semibold mb-2 `}>{t('OUR TEAM')}</h2>
              <div className="w-30 h-0.5 bg-[rgb(206,32,39,255)] border-0 mb-2 mx-auto mt-4 md:mt-10"></div>
              <p className={`text-lg tracking-wider mt-4 md:mt-10`}>{t('Regional Team')}</p>
            </div>
          </div>

           <div className="w-full md:w-1/2">
            {loading && (
              <div className="flex justify-center items-center h-60">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[rgb(206,32,39,255)] border-solid"></div>
              </div>
            )}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && teamMembers.length === 0 && <div>{t('No agents found.')}</div>}
            {!loading && !error && teamMembers.map((agent, idx) => (
              <React.Fragment key={agent._id || idx}>
          <article>
           <div className={`cursor-pointer p-4 md:mx-3 flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start gap-4 relative`}
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.setItem('selectedAgent', JSON.stringify(agent));
                        handleAgentClick(agent)
                      }}
                    
                    >
                  {/* Agent Image */}
                   <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 relative md:mx-3 rounded-lg overflow-hidden">
                   
                      <Image 
                                   src={
                                     agent.profileImage && agent.profileImage.startsWith('http')
                                       ? agent.profileImage
                                       : agent.profileImage
                                         ? `http://localhost:5001/${agent.profileImage.replace(/\\/g, '/')}`
                                         : '/avtar.png'
                                   }
                                   alt={t(`Portrait of ${agent.name}`)}
                                   width={192}
                                   height={192}
                                   className="object-contain"
                                 />
                               
                    
                  </div>
                      {/* Vertical Divider */}
                      <div className="hidden md:block w-px bg-gray-300 mx-2" />
                      {/* Agent Info */}
                      <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 ">
                          <h3 className="text-lg sm:text-lg md:text-2xl font-semibold tracking-[0.1em] uppercase md:mb-2">{agent.name}</h3>
                          {/* <p className="text-sm text-gray-500 ml-auto">{agent.city}</p> */}
                        </div>
                        <p className="md:text-sm text-[0.7rem] text-[rgb(206,32,39,255)]  mb-2 md:mb-2 break-all">{agent.jobTitle}</p>
                        <div className="mt-6 space-y-2">
            <p className="flex items-center gap-2 md:text-base text-sm mb-2 md:mb-2 break-all">
              <FaPhoneAlt className="text-gray-600" />
              {agent.phone}
            </p>
            <p className="flex items-center gap-2 md:text-base text-sm mb-4 md:mb-12 break-all">
              <FaEnvelope className="text-gray-600" />
              {agent.email}
            </p>
          </div>
          </div>
            </div>
          <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} pr-10`}>
            <Image
              src={language === 'ar' ? "/logoarebic.png" : "/headerlogo.png"}
              alt={t("Keller Williams")}
              width={180}
              height={50}
              className="mb-4 w-28 md:w-44 lg:w-48 h-auto"
            />
          </div>
          
          
                        
                    
                    </article>
          
                    
                     {/* Divider - Same as before */}
                    {idx !== teamMembers.length - 1 && (
            <hr className="border-t border-black w-full" />
          )}
          
                        
                  </React.Fragment>
                ))}
                  </div>
        </div>
      </div>
    </div>
    <div>
      <main className="px-4 py-2 md:py-6 md:mt-2">
        <div className="max-w-full mx-auto text-center md:mt-14">
          <p className="text-2xl md:text-4xl font-normal">
            {t('KW SAUDI ARABIA')}
          </p>
          <hr className="w-48 md:w-96 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-6 md:mt-16" />
          <p className="mt-4 md:mt-8 md:text-base text-sm">{t('Together We Do More')}</p>
          <p className="px-4 md:px-0 md:text-base text-sm">{t('Keller Williams Is There To Help At Every Big Step In The Realestate Journey.')}</p>
          <div className="flex justify-center md:justify-center mt-6 md:mt-10">
            <button className="
              cursor-pointer md:px-20 px-10 bg-[rgb(206,32,39,255)] text-white py-2 md:py-3 rounded-full text-sm
              relative overflow-hidden
              group transition-all duration-300
              hover:pr-20 hover:pl-16
            ">
              <span className="inline-block font-semibold text-sm transition-all duration-300" onClick={() => router.push('/contactUs')}>
                {t('JOIN US')}
              </span>
              <span className="
                absolute right-4 top-1/2 -translate-y-1/2
                opacity-0 group-hover:opacity-100
                transition-all duration-300 text-black
                group-hover:translate-x-0 translate-x-4
              ">
                ⟶
              </span>
            </button>
          </div>
        </div>
      </main>
      <div className="order-1 md:order-2 flex flex-col items-center justify-center py-2 md:py-0">
        <Image
          src="/howwillyouthink.png"
          alt={t('How Will You Thrive')}
          width={800}
          height={400}
          className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
        />
      </div>
    </div>
      <Footer />
    </div>
  );
}
