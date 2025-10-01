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
  const router=useRouter()
  const { t, language, isRTL } = useTranslation();
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/kw-training`);
        if (!res.ok) return;
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
    <div>
      <Header />
      <Box
        h3={page.pageName}
         src={heroSrc}
        image={
          '/ourculture2.jpg'
        }
      />

      <section className="bg-white  md:pb-16 mb-4  text-center">
      <div className=" mx-auto">
       <Image src="/keller.png" alt={t("Gary Keller")}
       width={1800} height={700} 
       className="mx-auto w-full h-auto" /> </div>
      </section>

      <section className="bg-white py-6 md:py-10 px-6 text-center">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-x-16 gap-y-10 max-w-full md:mx-auto mx-6">
          <div>
            <p className="text-xl md:text-5xl md:font-normal font-bold mb-2">1200+</p>
            <div className="mx-auto my-2 h-[1px] max-w-[200px] w-full bg-gradient-to-r from-[rgb(206,32,39,255)] via-[rgb(206,32,39,255)] to-black" />

            <p className="md:text-base text-sm text-gray-600">{t("Hours of On Demand")}<br />{t("Learning")}</p>
          </div>

          <div>
          <p className="text-xl md:text-5xl md:font-normal font-bold mb-2">68+</p>
          <div className="mx-auto my-2 h-[1px] max-w-[200px] w-full bg-gradient-to-r from-[rgb(206,32,39,255)] via-[rgb(206,32,39,255)] to-black" />

          <p className="md:text-base text-sm text-gray-600">{t("Unique Courses")}<br />{t("Available")}</p>
          </div>

          <div>
          <p className="text-xl md:text-5xl md:font-normal font-bold mb-2">100+</p>
          <div className="mx-auto my-2 h-[1px] max-w-[200px] w-full bg-gradient-to-r from-[rgb(206,32,39,255)] via-[rgb(206,32,39,255)] to-black" />

          <p className="md:text-base text-sm text-gray-600">{t("Live Training Events")}<br />{t("Worldwide")}</p>
          </div>
        </div>
      </section>
      

     
      <section className="relative mt-4 w-full min-h-[61vh] md:min-h-screen text-white flex items-center justify-center">
        <Image src="/coaching.png" alt={t("Training Stage Background")}  fill className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-full px-6 text-center">
          <h1 className="text-2xl md:text-4xl md:font-normal font-bold mb-6">{t("TRAINING & COACHING")}</h1>
          <hr className="w-30 md:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 md:mb-8 mb-10" />
          <p className="text-sm md:text-[1.1rem] leading-relaxed font-normal md:px-70"> {t("Named The #1 Training Organization In The World By Training Magazine In 2015, We're Often Described As A Training And Coaching Company Cleverly Disguised As A Real Estate Franchise.")}</p>
        </div>
      </section>

      <section className="md:py-16 py-4">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
          <div className="text-center md:text-center">
            <h2 className="text-xl md:text-3xl md:font-semibold font-semibold text-[rgb(206,32,39,255)] mb-6">{t("In Person & Online Sessions")}</h2>
            <p className="md:text-[1.3rem] text-[0.8rem] text-gray-700 mb-8 mx-6 md:mx-0 md:px-20">{t("At KW Saudi Arabia, we provide flexible training to suit your needs. Join in-person events to connect and learn from top talent, or access online sessions for world-class training anytime. Elevate your career—explore our sessions today!")}</p>
         <div className="flex justify-center md:justify-center">
  <button className="cursor-pointer md:px-10 px-4  bg-[rgb(206,32,39,255)] text-white py-2 md:py-3 text-xs md:text-sm  relative overflow-hidden group rounded-full transition-all duration-300 hover:pr-10 hover:pl-10" onClick={() => router.push('/ourCulture/whyKW')}>
                                  <span className="inline-block md:text-base text-sm font-semibold transition-all duration-300 group-hover:-translate-x-3">
                                  {t("CONTACT US")}
                                  </span>
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white group-hover:translate-x-0 translate-x-4">
                                    <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
                                  </span>
                                </button>
</div>

</div>
          <div className="text-center md:text-center mt-4 md:mt-0">
          <h2 className="text-xl md:text-3xl md:font-semibold font-semibold text-[rgb(206,32,39,255)] mb-6">{t("Events")}</h2>
          <p className="md:text-[1.3rem] text-[0.8rem] text-gray-700 mx-6 md:mx-0 mb-8 md:px-20">{t("Network and learn with top real estate talent at Keller Williams events. From Family Reunion to Mega Agent Camp and Masterminds, connect with top producers, bold thinkers, and market makers. No other event compares.")}</p>
          <div className="flex justify-center md:justify-center">
   <button className="cursor-pointer md:px-10 px-4  bg-[rgb(206,32,39,255)] text-white py-2 md:py-3 text-xs md:text-sm  relative overflow-hidden group rounded-full transition-all duration-300 hover:pr-10 hover:pl-10" onClick={() => router.push('/ourCulture/whyKW')}>
                                   <span className="inline-block md:text-base text-sm font-semibold transition-all duration-300 group-hover:-translate-x-3">
                               {t("LEARN MORE")}
                                   </span>
                                   <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white group-hover:translate-x-0 translate-x-4">
                                     <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
                                   </span>
                                 </button>
</div>

          </div>
        </div>
      </section>

      <section className="relative w-full min-h-[61vh] md:min-h-screen text-white flex items-center justify-center">
        <Image src="/buildexperties.jpg" alt={t("Build Expertise Background")} fill className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-full px-6 text-center">
          <h1 className="text-2xl md:text-4xl font-normal md:tracking-[0.1rem] tracking-[0.2rem] md:mb-10 mb-5">{t("BUILD EXPERTISE")}</h1>
          <hr className="w-30 md:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 md:mb-8 mb-10" />

          <p className="text-sm md:text-[1.1rem] leading-relaxed md:font-normal md:mx-50 mx-4">{t("Keller Williams University Provides The Most Advanced And Comprehensive Learning Opportunities In Real Estate And Empowers You To Become The Expert In Your Local Market.")}</p>
        </div>
      </section>

     
      {/* BOOKS SECTION */}
{/* BOOKS SECTION */}
<section className="md:py-8 py-2 mx-0 md:mx-10">
  <div>
    <div className="flex flex-col md:flex-row items-center md:items-center">

      {/* Left side - Books */}
      <div className="w-full flex justify-center md:justify-start mb-8 md:mb-0 ">
        <div className="flex">
          <Image
            src="/bookblue.png"
            alt={t("The Millionaire Real Estate Investor")}
            width={200}
            height={150}
            className={`bottom-0 w-[220px] h-[140px] md:w-[450px] md:h-[300px] rotate-[-8deg] 
              ${isRTL ? 'md:-mr-30 -mr-14 z-30' : 'md:-ml-30 -ml-14 z-10'}`}
          />
          <Image
            src="/book.png"
            alt={t("Your First Home")}
            width={200}
            height={150}
            className={`bottom-0 w-[220px] h-[140px] md:w-[450px] md:h-[300px] rotate-[-6deg] 
              ${isRTL ? 'md:-mr-66 -mr-36 z-20' : 'md:-ml-64 -ml-40 z-20'}`}
          />
          <Image
            src="/bookred.png"
            alt={t("The Millionaire Real Estate Agent")}
            width={200}
            height={150}
       
  className={`bottom-0 w-[220px] h-[140px] md:w-[450px] md:h-[300px] rotate-[-10deg] 
    ${isRTL ? 'md:-mr-66 -mr-40 z-10' : 'md:-ml-64 -ml-40 z-30'}`}
          />
          <Image
            src="/bookwhite.png"
            alt={t("The ONE Thing")}
            width={200}
            height={150}
            className={`bottom-0 w-[220px] h-[140px] md:w-[450px] md:h-[300px] rotate-[-6deg] 
    ${isRTL ? 'md:-mr-63 -mr-36 z-0' : 'md:-ml-74 -ml-40 z-30'}`}
          />
        </div>
      </div>

  
      <div className="w-full md:w-1/2 md:pl-8 flex items-center justify-center md:justify-end px-2"> 
      <h2 className="text-xl md:text-4xl font-normal text-[rgb(206,32,39,255)] text-center
       md:text-right break-words"> {t("BEST SELLING")} <br /> {t("BOOKS")} </h2> </div>
    </div>
  </div>
</section>
<hr className='mt-10'></hr>




{/* TRAINING SECTION */}
<section className="py-16 bg-white overflow-hidden">
  <div className="mx-5 md:mx-10 ">
    <div className="flex flex-col md:flex-row items-center justify-center">

      {/* Left side - Iframe */}
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0 ">
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
      <div className="w-full md:w-1/2 md:pl-8 flex items-center justify-center md:justify-end px-2">
        <h2 className="text-xl md:text-4xl font-normal text-[rgb(206,32,39,255)] text-center md:text-right break-words">
          {t("ONGOING TRAINING")} <br /> {t("DEVELOPMENT")}
        </h2>
      </div>
    </div>
  </div>
</section>



      <section className="relative w-full min-h-[61vh] md:min-h-screen text-white flex items-center justify-center">
        <Image src="/removelimits.jpg" alt={t("Remove Limits Background")} fill className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-full px-6 text-center">
           <h1 className="text-2xl md:text-4xl font-normal md:tracking-[0.1rem] tracking-[0.2rem] md:mb-10 mb-5">{t("REMOVE LIMITS")}</h1>
          <hr className="w-34 md:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 mb-8" />
          <p className="text-sm md:text-[1.1rem] leading-relaxed md:font-normal md:mx-50 mx-4">{t("Your Business Grows To The Extent That You Do! Award-winning Kw Maps Coaching Offers A Breadth Of High-accountability Programs Designed To Turn Your Biggest Goals Into Realty. Our Coaches Are Experts On Industry Best Practices, The Models Of Mrea And Keller Williams Systems, Putting Them In A Unique Position To Guide You To The Next Level.")}</p>
        </div>
      </section>

      <main className="flex px-4 py-6 md:mt-24 mt-4">
  <div className="mx-auto text-center md:px-70 px-10">
    <p className="text-2xl md:text-4xl tracking-[0.1em]">{t("CONNECT WITH US")}</p>
    <hr className="w-48 md:w-72 mx-auto bg-[rgb(206,32,39,255)] h-[2px] border-0 mt-6 md:mt-10" />

    <div className="mt-6 md:mt-10">
      <p className="text-sm md:text-base leading-relaxed px-2 md:px-6">
        {t("The Best Information Always Comes From A Face-to-face Conversation With A Local Market Expert – That's Your Kw Team Leader. Reach Out To Discuss The Market Of The Moment With A Team Leader Today.")}
      </p>
    </div>
  </div>
</main>


<div className="flex justify-center my-6">
  <Link href="/contactUs">
    <button className="cursor-pointer flex justify-center items-center text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] hover:bg-gray-600 text-white py-3 md:px-20 px-4 mt-5 rounded-full focus:outline-none transition w-auto">
      {t("Join a Keller Williams Market Center Near You")}
    </button>
  </Link>
</div>



      
     
      <Footer />
    </div>
  );
}
