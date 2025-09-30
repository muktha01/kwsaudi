'use client'
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationContext'
const Sellerguid = () => {
  const timelineRef = useRef(null);
  const [markerTop, setMarkerTop] = useState(0);
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
  const { language, isRTL, t } = useTranslation();
  const steps = [
    {
      title: t('Manageviewings'),
      content: t('Once You\'ve Chosen Your Keller Williams Agent, And Together Have Prepped Your House For Sale And Set A Price, You\'re Ready For The Public To See Your Home.\n\nWhat Is A Viewing? +\n\nHow Do I Prepare My House For A Viewing? +\n\nWhat Can I Expect When People View My House? +\n\nSelling Your Home Guide.'),
      align: 'right',
    },
    {
      title: t('Review Offers'),
      content: t('Congratulations! You Received A Message From Your Kw Agent That You Have An Offer On Your Home. Now You Need To Evaluate That Offer And Decide How To Respond\n\nWhat Is An Offer? +\n\nHow Do I Evaluate Each Offer? +\n\nWhat Happens If I Receive Multiple Offers? +'),
      align: 'left',
    },
    {
      title: t('Prepare For Inspection'),
      content: t('Most Buyers Request A Home Inspection As A Condition Of Their Offer. While A Home Inspector Will Dig More Deeply Into Your Home Than A Buyer, The Preparation You Made Before Your First Viewing Should Help You Get Ready For The Inspection. Your Keller Williams Agent Can Give You Personalised Advice, Too.\n\nWhat Is A Home Inspection? +\n\nWhat Is Looked At During A Home Inspection? +\n\nWhat\'s Not Looked At During A Home Inspection? +\n\nHow Should I Prepare For An Inspection? +\n\nWhat Happens Now? +'),
      align: 'right',
    },
    {
      title: t('Completion'),
      content: t('While It\'s Tempting To Focus On Your Next Move, Your Keller Williams Agent Is Likely To Remind You That Until The Completion Is Over, You Have Some Final Responsibilities As A Seller.\n\nWhat Should I Do Before The Completion? +\n\nWhat Can I Expect When We Complete? +\n\nWhat\'s Next? +'),
      align: 'left',
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
useEffect(() => {
  const fetchPageHero = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/page/slug/seller-guide');
      if (!res.ok) return;
      // console.log(res);
      
      const page = await res.json();
      setPage(page)
      if (page?.backgroundImage) {
        // Ensure forward slashes in image path and support absolute URLs
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

  return (
    <div className="relative">
      <Header />

      

        <Box
        src={heroSrc}
          h3={page.backgroundOverlayContent}
         
        />
    

      {/* Main Content Section */}
<main className="px-4 md:px-46 py-2">
  <div className="  md:p-0 max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-0 md:mb-8">
      <div className="w-full md:w-auto"> 
        <h1 className="text-2xl md:text-3xl md:py-8 py-4">{t('Selling Your ')}<span className='text-[rgb(206,32,39,255)]'>{t('Home')}</span> {t('Guide')}</h1>
        <p className="text-md md:text-lg">
        {t('You\'re Ready To Sell Your Property. And, While You\'re Looking Forward To Seeing The Word \"SOLD\" Posted From The Curb, You Know There\'s A Lot To Consider Along The Way.')}
       
        
        {t('One Of Your First Decisions Is To Select A Real Estate Company And Real Estate Agent Who\'ll Join You In The Process.')}
        </p>
      </div>
    </div>
  </div>
</main>

      {/* Timeline Section */}
      <div ref={timelineRef} className="relative bg-white pt-12 pb-24">
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
  <span className="w-6 h-[2.5px] bg-[rgb(206,32,39,255)]" />
</div>

    </div>
      </div>
      {/* Content Sections */}
        <div className="max-w-full mx-auto space-y-12 md:space-y-42">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-start px-4 md:px-8 lg:px-24`}
            >
             <div className={`mx-4 md:hidden mb-4 `}>
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


              {/* Desktop: Number on opposite side of vertical line */}
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
                      <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal mt-4">
                        {step.title}
                      </h2>
                      <p className="whitespace-pre-line mt-2 md:mt-4 leading-7 text-lg">{step.content}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block text-right px-0 md:px-8">
                      <span className="text-gray-500 text-4xl font-normal">{`${index + 1}.`}</span>
                      <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal mt-4">
                        {step.title}
                      </h2>
                      <p className="whitespace-pre-line mt-2 leading-7 md:mt-4 text-lg">{step.content}</p>
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

 
  <div className="hidden md:flex justify-center py-2 md:py-16">
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

export default Sellerguid;