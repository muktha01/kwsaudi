'use client'
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
const Buyerguid = () => {
  const router = useRouter();
  const timelineRef = useRef(null);
  const [markerTop, setMarkerTop] = useState(0);
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
const { language, isRTL, t } = useTranslation();

  const steps = [
    {
      id:'1.',
      title: t('Home Visit'),
      content: t(`We'll Arrange To Visit The Homes You've Selected, Together And In-person, To Determine The Best Fit For You.\n\nHow Can I Make The Most Of My Time When Visiting Homes? +\n\nWhat Should I Expect When Visiting Homes? +\n\nHow Many Homes Should I Visit? +\n\nWhat Should I Look For When Visiting Homes? +`),
      align: 'right',
    },
    {
      id:'2.',
      title: t('Making An Offer'),
      content: t(`Once You've Narrowed Down Your List And Have A Clear Favorite, Collaborate With Us To Make An Offer On A Home.\n\nWhat Should I Include With My Offer? +\n\nWhat Are The Most Common Contingencies? +\n\nWhat Happens If I Face Multiple Offers? +\n\nWhat Is A Counteroffer? +`),
      align: 'left',
    },
    {
      id:'3.',
      title: t('Execute Contract'),
      content: t(`The Crucial Period Between An Offer And A Final Contract Is An Important Time To Stay In Close Contact With Your Keller Williams Agent So You're Equipped With All The Information You Need To Make Smart Decisions.\n\nWhat Should I Expect To See In The Contract? +\n\nHow Do I Know When To Negotiate And When To Let Go? +\n\nWhat Are Common Contract Pitfalls I Should Avoid? +`),
      align: 'right',
    },
    {
      id:'4.',
      title: t('Schedule Home Inspection'),
      content: t(`As Soon Your Offer Is Accepted, You Should Schedule Your Home Inspection. If You're Buying In A Busy Season, It May Take Time To Find An Available Inspector, So Rely On Your Keller Williams Agent To Recommend Trusted Home Inspectors.\n\nWhat's Included On A Home Inspection?+\n\nWhat Should I Watch For During The Home Inspection? +\n\nI've Got The Home Inspection Report, Now What? +`),
      align: 'left',
    },
   {
    id:'5.',
      title: t('Get a Home Warranty'),
      content: t(`Some Home Sellers Pay For A Home Warranty That Covers Them While Their Home Is On The Market And Conveys To The Buyers After The Sale. You Can Ask Your Real Estate Agent For Advice About Negotiating For The Sellers To Pay For A Warranty Or Buying One Yourself.\n\nWhat Is A Home Warranty? +\n\nDo I Need A Home Warranty? +\n\nWhat Should I Look For In A Home Warranty? +`),
      align: 'right',
    },
    {
      id:'6.',
      title: t('Close'),
      content: t(`While You May Feel Jittery Before Your Closing, Your Kw Agent And Lender Should Have You Fully Prepared For The Day. As The Buyer, You Choose The Title Company For Your Title Search And The Closing. Your Agent And Lender Can Recommend Reliable Title Companies.\n\nWhat Should I Do Before The Closing?+\n\nWhat Can I Expect When Closing? +\n\nWhat Paperwork Is Required To Close? +\n\nWhat's Next? +`),
      align: 'left',
    }
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/buyer-guide`);
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
          image="/buyer2.jpg"
        />
    

    <main className="px-4 md:px-46 ">
  <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-0 md:mb-8">
      <div className="w-full md:w-auto">  {/* Removed text-center from here since parent has it */}
        <h1 className="text-2xl md:text-3xl  py-2 md:py-8">{t('Home ')}<span className='text-red-700'>{t('Buying ')}</span> {t('Tips from Keller Williams')}</h1>
       <div className={`mx-4 md:mx-0 tracking-normal mt-2 md:mt-0  md:tracking-normal `}>
       <p className="text-md md:text-lg leading-7">
          {t('Our Experience, A House Is Not A Dream Home Because Of Its Size Or Colour. Its About How You Feel When You Walk Through The Front Door – The Way You Can Instantly See Your Life Unfolding There. This Is About More Than Real Estate. It\'s About Your Life And Your Dreams..')}
      
       
</p>

       </div>
      </div>
    </div>
  </div>
</main>

      {/* Timeline Section */}
      <div ref={timelineRef} className="relative bg-white pt-12 pb-24 md:mt-10">
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
      {/* mobile Content Sections */}
      <div className="max-w-full mx-auto space-y-20 md:space-y-42">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-start px-4 md:px-8 lg:px-24`}
            >
             <div className={`mx-4 md:hidden mb-4 ${isRTL ? (step.align === 'right' ? 'text-right' : 'text-left') : (step.align === 'right' ? 'text-left' : 'text-right')}`}>
  {/* Step Number */}


  {/* Title - Reverse align compared to number */}
  <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
    <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-2xl font-normal  inline-block">
      {t(step.title)}
    </h2>
    <p className="whitespace-pre-line mt-2 text-md">{t(step.content)}</p>
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
                        {t(step.title)}
                      </h2>
                      <p className="whitespace-pre-line mt-2 md:mt-4 leading-7 text-lg">{t(step.content)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Content on the right side for RTL (opposite of English left) */}
                    <div className="hidden md:block text-right px-0 md:px-8">
                      <span className="text-gray-500 text-4xl font-normal">{`${index + 1}.`}</span>
                      <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal mt-4">
                        {t(step.title)}
                      </h2>
                      <p className="whitespace-pre-line mt-2 leading-7 md:mt-4 text-lg">{t(step.content)}</p>
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
                        {t(step.title)}
                      </h2>
                      <p className="whitespace-pre-line mt-2 md:mt-4 leading-7 text-lg">{t(step.content)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block text-right px-0 md:px-8">
                      <span className="text-gray-500 text-4xl font-normal">{`${index + 1}.`}</span>
                      <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal mt-4">
                        {t(step.title)}
                      </h2>
                      <p className="whitespace-pre-line mt-2 leading-7 md:mt-4 text-lg">{t(step.content)}</p>
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

export default Buyerguid;