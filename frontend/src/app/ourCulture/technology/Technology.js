'use client';
import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationContext';

const Technology = () => {
  const timelineRef1 = useRef(null);
  const timelineRef2 = useRef(null);
  const [markerTop1, setMarkerTop1] = useState(0);
  const [markerTop2, setMarkerTop2] = useState(0);
  const [heroSrc, setHeroSrc] = useState('/'); 
  const [page, setPage] = useState('');
  const { t, language, isRTL } = useTranslation();

  const steps = [
    {
      title: t('COMMAND YOUR DATABASE'),
      content: t(`WITH CONTACTS AND SMART PLANS

      • Build Your Command Database And Manage Your Contacts
• Deliver Neighborhood-Level Insights To Your Contacts
• Systematize Your Touch Campaigns And More With SmartPlans
• Customize And Manage Your Smart Plans`),
      image: '/technology1.png',
    },
    {
      title: t('COMMAND YOUR CONSUMER EXPERIENCE'),
      content: t(`WITH THE KW APP AND SITES

      • Guide, A Fully-Customizable Client Companion, Facilitates The Entire Transaction
• Win Consumer Loyalty By Refining Their Search
• Give Home Buyers A Deeper Understanding Of Neighborhoods
• Help Clients Organize, Rank, And Then Discuss Listings`),
      image: '/technology2.png',
    },
     {
      title: t('COMMAND YOUR MARKETING'),
      content: t(`WITH DESIGNS, CAMPAIGNS, & SITES

      • Guide, A Fully-Customizable Client Companion, Facilitates The Entire Transaction
• Win Consumer Loyalty By Refining Their Search
• Give Home Buyers A Deeper Understanding Of Neighborhoods
• Help Clients Organize, Rank, And Then Discuss Listings`),
      image: '/technology3.png',
    },
     {
      title: t('COMMAND YOUR NETWORK'),
      content: t(`• Tap Into The Largest, Most-profitable Real Estate Network On The Planet.
• Get The Opportunity To Connect And Co-broke With Real Kw Agents Worldwide In 50 Over Regions.`),

      image: '/technology4.png',
    },
     {
      title: t('COMMAND YOUR REFERRALS BUSINESS'),
      content: t(`WITH REFERRALS

      • Manage Your Referrals Easily, So You Can Connect Clients With Agents, Negotiate Deals, And Track Transactions – Anytime, Anywhere.
• Identify Agents Across The Globe Based On Specialization, Location, Production, Or Membership, And Add Them To Your Referral Network.
• Fan Out Referral Opportunities To A Large Group Of Agents To Find The Perfect Match For Your Client At A Hyperlocal Level.
• Send Referrals To Trusted Agents In Your Network, Setting Rates, Expiration Dates, And Other Conditions.`),
      image: '/technology5.png',
    },
     {
      title: t('COMMAND YOUR DAY'),
      content: t(`WITH GOALS, TASKS, AND REPORTS

      • Turn Your To-do List Into Action Items By Creating Contact-specific Tasks That Are Visible Across Tasks, Contacts, And Your Dashboard.
• Schedule Due Dates And Reminders To Stay On Top Of Your Most Important Tasks.
• Set Goals For Your Business Including Listings, Gci, Profit, And More.
• View Personal And Comparison Reporting To Understand The Health Of Your Database.`),
      image: '/technology6.png',
    },
    
  ];

   const steps2 = [
    {
      title: t('COMMAND YOUR TEAM SET UP'),
      content: t(`MOVE FROM DISPARATE TO STREAMLINED BY STANDARDIZING THE WAY YOUR TEAM OPERATES AND TRANSITIONING TO COMMAND.

• Get Prepped For Your Team Account
• Transition Your Team To Command
• Create And Manage Team Leads
• Create And Manage Team Smartplans`),
      image: '/technology7.png',
    },
    {
      title: t('COMMAND YOUR DATABASE FOR TEAMS'),
      content: t(`WITH CONTACTS AND SMARTPLANS BUILD, CUSTOMIZE, AND MANAGE A COLLECTIVE DATABASE THAT HELPS YOUR TEAM RUN LIKE CLOCKWORK

      • View, Add, And Import Team Contacts
• Customize And Manage Team Contacts
• Communicate To Those Team Contacts
`),
      image: '/technology8.png',
    },
     {
      title: t('COMMAND YOUR TRANSACTIONS FOR TEAMS'),
      content: t(`With Opportunities Command Offers The Central Hub You've Been Searching For – Allowing You To Lead With Confidence And Support Your Team In Delivering High-quality Service At Every Step Of The Transaction.

      • Create And Customize Your Team Opportunity Pipeline
• Manage Your Team Opportunities
• Create, Manage, And Share Offers
• Create And Connect Your Document Management Accounts
• Create And Manage Compliance Documents`),
      image: '/technology9.png',
    },
  ]

  useEffect(() => {
    const handleScroll1 = () => {
      if (!timelineRef1.current) return;
      const timelineRect = timelineRef1.current.getBoundingClientRect();
      const timelineStart = window.scrollY + timelineRect.top;
      const timelineHeight = timelineRect.height;
      const currentScroll = window.scrollY + 200;
      let progress = (currentScroll - timelineStart) / timelineHeight;
      progress = Math.max(0, Math.min(progress, 1));
      setMarkerTop1(progress * 100);
    };
    window.addEventListener('scroll', handleScroll1);
    handleScroll1();
    return () => window.removeEventListener('scroll', handleScroll1);
  }, []);

  useEffect(() => {
    const handleScroll2 = () => {
      if (!timelineRef2.current) return;
      const timelineRect = timelineRef2.current.getBoundingClientRect();
      const timelineStart = window.scrollY + timelineRect.top;
      const timelineHeight = timelineRect.height;
      const currentScroll = window.scrollY + 200;
      let progress = (currentScroll - timelineStart) / timelineHeight;
      progress = Math.max(0, Math.min(progress, 1));
      setMarkerTop2(progress * 100);
    };
    window.addEventListener('scroll', handleScroll2);
    handleScroll2();
    return () => window.removeEventListener('scroll', handleScroll2);
  }, []);
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/kw-technology`);
        if (!res.ok) return;
        // console.log(res);
        
        const page = await res.json();
        setPage(page)
        if (page?.backgroundImage) {
           const cleanPath = page.backgroundImage.replace(/\\/g, '/');
        setHeroSrc(
          cleanPath.startsWith('http')
            ? cleanPath
            : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`
        );
        }
      } catch (e) {
        // console.error('Error fetching page hero:', e);
      }
    };
    fetchPageHero();
  }, []);
  return (
    <div className="relative">
      <Header />

      <Box
          src={heroSrc}
        h3={page.backgroundOverlayContent}
        image="https://static.wixstatic.com/media/36a881_a82aacde83a9442dae07d99a846cadf4~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8-removebg-preview%20(1).png"
      />

     
    

      {/* Section Title */}
      <div className="md:my-10 mt-4">
        <h1 className={`text-2xl md:text-3xl py-2 md:py-2 flex justify-center text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("COMMAND FOR SOLO AGENT")}
        </h1>
        <hr className="w-50 md:w-50 mx-auto bg-[rgb(206,32,39,255)] h-[1.5px] border-0 " />
      </div>

      {/* Timeline Section */}
      <div ref={timelineRef1} className="relative bg-white pt-2 pb-2">
        {/* Vertical Line */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-black z-0" />

        {/* Marker */}
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 z-10 h-full">
          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              top: `${markerTop1}%`,
              transition: 'top 0.1s ease-out',
            }}
          >
            <div className="w-6 h-6 relative flex items-start justify-center">
              <span className="w-6 h-0.5 bg-[rgb(206,32,39,255)]" />
            </div>
          </div>
        </div>

        {/* Step Sections */}
        <div className="max-w-full mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 items-center px-4 md:px-8 lg:px-24 gap-1 md:my-4"
            >
              {/* Left Image (Desktop) */}
              <div className="hidden md:flex justify-center">
                <Image
                  src={step.image}
                  alt={t(step.title)}
                  width={400}
                  height={200}
                  className="object-contain"
                />
              </div>

{/* Mobile Layout */}
<div className="md:hidden flex flex-col items-center px-4">
  <Image
    src={step.image}
    alt={t(step.title)}
    width={400}
    height={200}
    className="w-full max-w-xs object-contain"
  />
 
</div>
              {/* Right Text */}
              <div className={`text-left ml-8 ${isRTL ? 'text-right mr-8 ml-0' : 'text-left'}`}>
                <h2 className="text-[rgb(206,32,39,255)] text-2xl font-semibold uppercase mb-2">
                  {t(step.title)}
                </h2>
                <p className="whitespace-pre-line text-md md:text-lg leading-relaxed">
                  {t(step.content)}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

{/* Section Title */}
      <div className="md:my-30 mt-4">
       <h1 className={`text-2xl md:text-3xl py-2 md:py-2 flex justify-center text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("Command For Solo Teams")}
        </h1>
        <hr className="w-50 md:w-50 mx-auto bg-[rgb(206,32,39,255)] h-[1.5px] border-0 " />
      </div>

{/* Timeline Section */}
      <div ref={timelineRef2} className="relative bg-white pt-2 pb-2">
        {/* Vertical Line */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-black z-0" />

        {/* Marker */}
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 z-10 h-full">
          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              top: `${markerTop2}%`,
              transition: 'top 0.1s ease-out',
            }}
          >
            <div className="w-6 h-6 relative flex items-start justify-center">
              <span className="w-6 h-0.5 bg-[rgb(206,32,39,255)]" />
            </div>
          </div>
        </div>

        {/* Step Sections */}
        <div className="max-w-full mx-auto">
          {steps2.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 items-center px-4 md:px-8 lg:px-24 gap-8 my-4"
            >
              {/* Left Image (Desktop) */}
              <div className="hidden md:flex justify-center">
                <Image
                  src={step.image}
                  alt={t(step.title)}
                  width={400}
                  height={200}
                  className="object-contain"
                />
              </div>

{/* Mobile Layout */}
<div className="md:hidden flex flex-col items-center px-4 ">
  <Image
    src={step.image}
    alt={t(step.title)}
    width={400}
    height={200}
    className="w-full max-w-xs object-contain"
  />
 
</div>
              {/* Right Text */}
              <div className={`text-left ml-8 ${isRTL ? 'text-right mr-8 ml-0' : 'text-left'}`}>
                <h2 className="text-[rgb(206,32,39,255)] text-2xl font-semibold uppercase mb-2">
                  {t(step.title)}
                </h2>
                <p className="whitespace-pre-line text-md md:text-lg  leading-relaxed">
                  {t(step.content)}
                </p>
              </div>

             

            </div>
          ))}
        </div>
      </div>
      {/* Final Image */}
      <div className="flex justify-center py-2 md:py-16">
        <Image
          src="/howwillyouthink.png"
          alt={t("How Will You Thrive")}
          width={800}
          height={400}
        />
      </div>

     
      <Footer />
    </div>
  );
};

export default Technology;
