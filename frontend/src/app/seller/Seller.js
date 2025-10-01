'use client'
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
const Seller = () => {
  const timelineRef = useRef(null);
  const [markerTop, setMarkerTop] = useState(0);
  const [heroSrc, setHeroSrc] = useState('/')
  const[page,setPage]=useState('');
const router=useRouter();
const { language, isRTL, t } = useTranslation();
  const steps = [
    {
      title: t('Reason For Selling'),
      content: t('Deciding To Sell Your Home Can Be A Very Emotional Process, No Matter The Reason. The First Step In Selling Is To Understand Your Motivation And Goal. If You Are Selling Because Of Outside Circumstances, You Probably Have A Timeline To Work Within\n\nWhy Do You Want To Sell Your Home ? +\n\nTalk With Your Keller Williams Agent About Their Strategy To Sell Your Home.'),
      align: 'right',
    },
    {
      title: t('Hire The Right Agent'),
      content: t('In This Fast-paced Real Estate Environment, Having The Right Real Estate Agent Sell Your Home Is Extremely Important. In Most Urban Areas, Inventory Is Low, So You Don\'t Want To Underprice Nor Over-price Your Home For Today\'s Market. Selling Is A Combination Of Pricing Right, Strategic Marketing, Staging, And Bringing In The Right Buyer At The Right Time.\n\nThen Choosing A Real Estate Professional +'),
      align: 'left',
    },
    {
      title: t('Price Your Home'),
      content: t('Your KW Agent will provide you with a CMA (Comparative Market Analysis). This report can be the most important tool in determining the listing price. Review the CMA carefully with your Agent so you understand the current. Studying the past sales will not only help you understand the pricing strategy but give you a realistic expectation as to how much your home might appraise for when you go under contract. Remember, the listing price of a similar home is your competition, not a comparable for value.\n\nThe CMA reports usually contain +'),
      align: 'right',
    },
    {
      title: t('Preparing Your Home for Sell'),
      content: t('Once you decide to sell your house, it is no longer your home. Your house was a big investment and now you should get what it is worth. First impressions are everything when selling your home. You want buyers to be excited to get out of the car and come into the home.\n\nYour KW Agent will guide you with a few suggestions such as +'),
      align: 'left',
    },
    {
      title: t('Be Ready'),
      content: t('To sell your home, you must be flexible and ready. Living in a home for sale isn\'t always the easiest, especially with children.\n\nHave a schedule +\n\nThe CMA reports usually contain +'),
      align: 'right',
    },
  ];

   useEffect(() => {
  const handleScroll = () => {
    if (!timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const timelineStart = window.scrollY + timelineRect.top;
    const timelineHeight = timelineRect.height;
    const currentScroll = window.scrollY+200;

    let progress = (currentScroll - timelineStart) / timelineHeight;

    // Clamp the progress between 0 and 1
    progress = Math.max(0, Math.min(progress, 1));

    setMarkerTop(progress * 100);
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Fetch list of PDFs from backend


 
useEffect(() => {
  const fetchPageHero = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/five-steps-to-sell`);
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
          image="https://static.wixstatic.com/media/36a881_0ed2d4fa08bb4022acbbb9e48b783092~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4-removebg-preview.png"
        />
    

      {/* Main Content Section */}
      <main className="px-4 md:px-40 py-2  md:mt-2">
      <div className=" max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <div className="w-full md:w-auto text-center">
            <h1 className="text-2xl md:text-3xl md:py-8 py-4">{t('Five Steps To Sell')}</h1>
            {/* <hr className="w-8/12 md:w-5/12 mx-auto border-0 bg-[rgb(206,32,39,255)] h-[1.5px] mt-2 md:mt-10 mb-10" /> */}
<p className={`text-md md:text-lg `}>
  {t(`You're Ready To Sell Your Property. And, While You're Looking Forward To Seeing The Word "SOLD" Posted From The Curb, You Know There's A Lot To Consider Along The Way. One Of Your First Decisions Is To Select A Real Estate Company And Real Estate Agent Who'll Join You In The Process.`)}
</p>


            </div>
          </div>
        </div>
      </main>

      {/* Timeline Section */}
      <div ref={timelineRef} className="relative bg-white pt-2 pb-10">
        {/* Center Vertical Line - hidden on mobile */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-black z-0" />

       
        {/* Red Marker over vertical line */}
  <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 z-10 h-full">
    <div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{
        top: `${markerTop}%`,
        transition: 'top 0.1s ease-out',
      }}
    >
     <div className="w-6 h-6 relative flex items-start justify-center">
  <span className="w-8 h-[2.5px] bg-[rgb(206,32,39,255)]" />
</div>

    </div>
      </div>
      {/* Content Sections */}
        <div className="max-w-full mx-auto space-y-12 md:space-y-48">
        {steps.map((step, index) => (
  <div
    key={index}
    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start px-4 md:px-8 lg:px-24"
  >
    {/* ✅ MOBILE ONLY */}
    <div className={`md:hidden mx-4 mb-4 `}>
      {/* Step Number */}
      <div className={`flex `}>
        <span className="text-gray-500 text-2xl font-normal block mb-1">{`${index + 1}.`}</span>
      </div>

      {/* Title - Same align as number for RTL */}
      <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-[rgb(206,32,39,255)] text-2xl md:text-3xl font-normal  inline-block">
          {step.title}
        </h2>
        <p className="whitespace-pre-line mt-2 text-md">{step.content}</p>
      </div>
    </div>

    {/* ✅ DESKTOP ONLY */}
    {isRTL ? (
      // RTL Layout - flip the entire logic (opposite of English)
      step.align === 'right' ? (
        <>
          {/* Empty div for the right side */}
          <div className="hidden md:block"></div>
          {/* Content on the left side for RTL (opposite of English right) */}
          <div className="hidden md:block text-right px-0 md:px-8">
            <span className="text-gray-500 text-4xl font-normal">{`${index + 1}.`}</span>
            <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal mt-4">
              {step.title}
            </h2>
            <p className="whitespace-pre-line mt-2 md:mt-4 leading-7 text-lg">{step.content}</p>
          </div>
        </>
      ) : (
        <>
          {/* Content on the right side for RTL (opposite of English left) */}
          <div className="hidden md:block text-right px-0 md:px-8">
            <span className="text-gray-500 text-4xl font-normal">{`${index + 1}.`}</span>
            <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal mt-4">
              {step.title}
            </h2>
            <p className="whitespace-pre-line mt-2 leading-7 md:mt-4 text-lg">{step.content}</p>
          </div>
          {/* Empty div for the left side */}
          <div className="hidden md:block"></div>
        </>
      )
    ) : (
      // LTR Layout - original logic
      step.align === 'right' ? (
        <>
          {/* Empty div for the left side */}
          <div className="hidden md:block"></div>
          <div className="hidden md:block text-left px-0 md:px-8">
            <span className="text-gray-500 text-4xl font-normal">{`${index + 1}.`}</span>
            <h2 className="text-[rgb(206,32,39,255)] text-xl md:text-3xl font-normal mt-4">{step.title}</h2>
            <p className="whitespace-pre-line mt-2 md:mt-4 md:text-lg text-md">{step.content}</p>
          </div>
        </>
      ) : (
        <>
          <div className="hidden md:block text-right px-0 md:px-8">
            <span className="text-gray-500 text-4xl font-normal">{`${index + 1}.`}</span>
            <h2 className="text-[rgb(206,32,39,255)] text-xl md:text-3xl font-normal mt-4">{step.title}</h2>
            <p className="whitespace-pre-line mt-2 md:mt-4 md:text-lg text-md">{step.content}</p>
          </div>
          {/* Empty div for the right side */}
          <div className="hidden md:block"></div>
        </>
      )
    )}
  </div>
))}
</div>
</div>

<div className="order-1 md:order-2 flex flex-col items-center justify-center">
    <Image
      src="/howwillyouthink.png"
      alt={t("How Will You Thrive")}
      width={800}
      height={400}
      className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
      
    />
   
  </div>
 
      
      <Footer />
    </div>
  );
}

export default Seller;