'use client'
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Box from '@/components/box';
import Footer from '@/components/footer';
import Image from 'next/image';
import CeoTeam from '@/components/ceoTeam';
import Howwill from '@/components/Howwill';
import { useRouter } from 'next/navigation';
import {
  FaArrowUpRightFromSquare,
  FaBookOpen,
  FaStar,
  FaAnchor,
  FaCertificate,
  
} from 'react-icons/fa6';
import { FaShieldAlt } from 'react-icons/fa';

const OurCulture = () => {
  const router=useRouter();
  const [page, setPage] = useState(null);
  const cards = [
    {
      icon: <FaArrowUpRightFromSquare className="text-3xl mb-4" />,
      title: 'OUR MISSION',
      text: `TO BUILD CAREERS WORTH HAVING, BUSINESSES
WORTH OWNING, LIVES WORTH LIVING, EXPERIENCES
WORTH GIVING, AND LEGACIES WORTH LEAVING.`,
    },
    {
      icon: <FaBookOpen className="text-3xl mb-4" />,
      title: 'OUR VALUES',
      text: 'GOD, FAMILY, THEN BUSINESS.',
    },
    {
      icon: <FaStar className="text-3xl mb-4" />,
      title: 'OUR VISION',
      text:
        'TO BE THE REAL ESTATE COMPANY OF CHOICE FOR AGENTS AND THEIR CUSTOMERS.',
    },
    {
      icon: <FaAnchor className="text-3xl mb-4" />,
      title: 'OUR PERSPECTIVE',
      text: `A TECHNOLOGY COMPANY THAT PROVIDES THE REAL ESTATE PLATFORM THAT OUR AGENTS' BUYERS AND SELLERS PREFER. KELLER WILLIAMS THINKS LIKE A TOP PRODUCER, ACTS LIKE A TRAINER-CONSULTANT, AND FOCUSES ALL ITS ACTIVITIES ON SERVICE, PRODUCTIVITY, AND PROFITABILITY`,
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'WI4C2TES',
      text: `OUR BELIEF SYSTEM
WIN-WIN: OR NO DEAL
INTEGRITY: DO THE RIGHT THING
CUSTOMERS: ALWAYS COME FIRST
COMMITMENT: IN ALL THINGS
COMMUNICATION: SEEK FIRST TO UNDERSTAND
CREATIVITY: IDEAS BEFORE RESULTS
TEAMWORK: TOGETHER EVERYONE ACHIEVES MORE
TRUST: STARTS WITH HONESTY
EQUITY: OPPORTUNITIES FOR ALL
SUCCESS: RESULTS THROUGH PEOPLE`
    },
  ];
  
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/our-culture`);
        if (!res.ok) return;
        console.log(res);
        
        const pageData = await res.json();
        setPage(pageData);
      } catch (e) {
        console.error('Error fetching page hero:', e);
      }
    };
    fetchPageHero();
  }, []);

  return (
    <div className="relative">
      <Header />
      <Box
        h3="About Us"
        src="/ourculturebg.jpg"
        image="https://static.wixstatic.com/media/36a881_a82aacde83a9442dae07d99a846cadf4~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8-removebg-preview%20(1).png"
      />

<div className="lg:hidden order-1 lg:order-2 flex flex-col items-center justify-center">
    <Image
      src="/howwillyouthink.png"
      alt="How Will You Thrive"
      width={800}
      height={400}
      className="w-70 h-20 lg:w-[800px] lg:h-[400px] object-contain"
    />
    <button className="bg-[rgb(206,32,39,255)] w-40 text-white px-8 py-1.5 text-xs font-semibold rounded-full block mx-auto lg:hidden mt-4 mb-4" onClick={() => router.push('/contactUs')}>
      JOIN US
    </button>
  </div>
      {/* Insert mobile-only intro text above OUR BELIEFS */}
      <div className="lg:hidden px-4 lg:py-4 py-4">
        <div className="mx-auto text-center">
          <div className="mt-1">
            <p className="text-xs leading-[1.6]">
            We Are Looking To Introduce The Individuals Who Are Instrumental In Driving Our Success. We Believe That Every Moment Holds Great Promise, And We Are Passionate About Our Daily
          
       
          Work. We Have The Most Skilled Employees At Every Stage Of Our Operations. Our Leadership Team Is A Diverse Group Of Individuals Who Bring A Wealth Of Experience From Various
     
       
          Areas Within The Company.
            </p>
          </div>
        </div>
      </div>
      {/* Intro Text */}
      <main className="px-4 lg:mt-10 mt-4">
        <div className="mx-auto text-center">
        <span className="lg:font-normal text-lg tracking-[0.2em] lg:text-4xl no-underline bg-transparent leading-[1.3]">
  OUR BELIEFS
</span>


          <hr className="w-30 lg:w-46 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-1 lg:mt-8" />
          <div className="lg:mt-10 lg:py-0 py-10">
          <p className="lg:mx-65 mx-4 font-normal tracking-[0em] lg:text-[1rem] text-xs lg:font-normal  no-underline bg-transparent leading-[1.6]">
          We Believe That The Company We Keep Can Contribute To Our Lives In Untold Ways.
  To Help Cement This Understanding We&rsquo;ve Formalized A


              Belief System That Guides How We Treat Each Other.
            </p>
          </div>
        </div>
      </main>

      {/* Cards Grid */}
<div className="hidden lg:block max-w-full mx-auto px-10 py-10 lg:mt-7 lg:mb-0">
  {/* First 3 Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    {cards.slice(0, 3).map((card, index) => (
      <div
        key={index}
        className="group flex flex-col items-center justify-start rounded-xl bg-gray-100 px-6 py-14 text-center shadow-sm min-h-[300px] hover:shadow-md transition-all duration-300 ease-in-out"
      >
        {/* Icon moves up, right, and rotates */}
        <div className="group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:rotate-10 transform-gpu transition-all duration-300 ease-in-out">
          {card.icon}
        </div>
        {/* Text moves up */}
        <div className="group-hover:-translate-y-2 transition-transform duration-300 ease-in-out">
          <h3 className="mb-4 text-xl font-semibold tracking-wide">
            {card.title}
          </h3>
          <p className="lg:text-[0.8rem] leading-5 tracking-wide uppercase text-neutral-600 whitespace-pre-line">
            {card.text}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Last 2 Cards Centered Horizontally */}
  <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 ">
    {cards.slice(3).map((card, index) => (
      <div
        key={index}
        className="group w-full sm:w-[300px] lg:w-[400px] min-h-[340px] flex flex-col items-center rounded-xl bg-gray-100 px-6 py-8 text-center shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
      >
        {/* Icon moves up, right, and rotates */}
        <div className="mb-4 flex-shrink-0 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:rotate-10 transform-gpu transition-all duration-300 ease-in-out">
          {card.icon}
        </div>
        
        {/* Content moves up */}
        <div className="group-hover:-translate-y-2 transition-transform duration-300 ease-in-out">
          <h3 className="mb-4 text-xl font-semibold tracking-wide line-clamp-2">
            {card.title}
          </h3>
        </div>
        
        {/* Text content moves up */}
        <div className="flex-1 overflow-y-auto w-full group-hover:-translate-y-2 transition-transform duration-300 ease-in-out">
          <p className="lg:text-[0.8rem] leading-5 text-neutral-600 whitespace-pre-line">
            {card.text}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
<hr className=" hidden w-11/12 lg:w-6/12 mx-auto bg-gray-200 mt-2 lg:mt-8" />
 <main className="hidden lg:block px-4 py-6">
        <div className="mx-auto text-center">
         
          <div className="mt-1">
            <p className="text-xs lg:mx-45 mx-0 lg:text-[1rem]">
            We Are Looking To Introduce The Individuals Who Are Instrumental In Driving Our Success. We Believe That Every Moment Holds Great Promise, And We Are Passionate About Our Daily Work. We Have The Most Skilled Employees At Every Stage Of Our Operations. Our Leadership Team Is A Diverse Group Of Individuals Who Bring A Wealth Of Experience From Various Areas Within The Company.
            </p>
          </div>
        </div>
      </main>
      <CeoTeam page={page}></CeoTeam>
<Howwill></Howwill>
       <hr className=" hidden lg:block w-8/12 lg:w-6/12 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-10 lg:mt-20 mb-10" />
      <Footer />
    </div>
  );
};

export default OurCulture;
