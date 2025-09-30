'use client';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const Tenant = () => {
  const router=useRouter();
  const sections = [
    {
      number: '01',
      title: 'Can You Realistically Afford?',
      description:
        'You want a home, but you also need to live; having monies for bills, outgoings and enjoying yourself is essential.',
    },
    {
      number: '02',
      title: 'Location Vs Budget?',
      description:
        "Do some research on rental properties in your preferred location and ask the advice of your local Keller Williams agent. You may need to make a compromise but it's better than struggling to meet your financial commitments.",
    },
    {
      number: '03',
      title: 'What Kind Of Property Do You Need?',
      description:
        'If you can be flexible, you will have more opportunities, as demand for rental property is high. Families will have different priorities to those who are single; focus on your needs rather than your wants.',
    },
    {
      number: '04',
      title: "What's in your future?",
      description:
        "No one has a crystal ball and life can certainly take us in directions we never imagined, but before you start to view, you need to have an idea of the type of tenancy you're looking for. Typically, it's a twelve-month term for properties let under assured shorthold tenancies, but some landlords prefer shorter or longer contracts, and some are even happy to include break clauses and notice periods. Discuss your needs and concerns with your local agent and we can ensure that the tenancy fits your future plans.",
    },
    {
      number: '05',
      title: 'Do you have references?',
      description:
        'Have you placed yourself in a good position to move? Remember, you will be asked for references and also details of your current employer. Having these things in place will speed up the process and also make it easier.',
    },
    {
      number: '06',
      title: 'Are you ready to move?',
      description:
        "We know the deposit is a big investment, it's normally one or two months' rent. You will need this ready to transfer should you see a property you like – remember, you also need to budget for moving costs and other expenses.",
    },
  ];

  return (
    <div className="">
      <Header />
      <Box
        src="/seller_guide_page.jpeg"
        h3="KW Tenant Guide"
        image="/tenant2.jpg"
      />

      {/* Intro */}
      <main className="px-4 py-6 md:mt-2 mt-10">
        <div className="max-w-full mx-auto text-center">
          <p className="text-xs md:text-base">
          Before You Start Your Search For A Rental Property It&rsquo;s Worth Asking Yourself
          </p>
        </div>
      </main>

      {/* Section Boxes */}
      <div className="max-w-full mx-auto mt-14 ">
        <hr className="w-full border-t border-gray-500" />
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {/* Mobile: stacked vertical layout */}
            <div className="md:hidden px-4 py-6 mx-6">
              <div className="text-3xl py-2 text-gray-400 font-normal mb-1">{section.number}</div>
              <div className="text-sm font-semibold text-black mb-4 tracking-[0.1em] md:tracking-tight">{section.title}</div>
              <div className="text-xs leading-relaxed text-gray-700">{section.description}</div>
            </div>
            {/* Desktop: grid layout */}
            <div className="hidden md:grid grid-cols-12 items-stretch hover:bg-[rgb(206,32,39,255)] group transition duration-300 px-4 min-h-[200px]">
              {/* Number */}
              <div className="md:ml-30 col-span-2 md:col-span-1 flex items-center justify-center text-5xl  text-gray-500 group-hover:text-black font-normal">
                {section.number}
              </div>
              {/* Title */}
              <div className="md:ml-46 col-span-4 md:col-span-4 flex items-center text-base font-semibold tracking-wide text-black group-hover:text-white">
                {section.title}
              </div>
              {/* Vertical Line Between Title and Description - disappears on hover */}
              <div className="col-span-1 flex justify-center">
                <div className="ml-22 w-[1px] bg-[rgb(206,32,39,255)] h-auto md:h-40 my-4 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              {/* Description */}
              <div className="col-span-5 md:col-span-6 flex items-center text-[0.6rem] md:text-[1rem]  leading-relaxed text-gray-700 group-hover:text-white py-4">
                {section.description}
              </div>
            </div>
            {/* Horizontal divider between sections */}
            {index < sections.length - 1 && (
              <hr className="w-full border-t bordeer-0 border-gray-500" />
            )}
          </React.Fragment>
        ))}
      </div>

       <main className="hidden md:block px-4 py-6 md:mt-2 mt-2">
        <div className="max-w-full mx-auto text-center md:mt-16">
          <p className="text-xl md:text-4xl font-normal">KW SAUDI ARABIA</p>
          <hr className="w-32 md:w-68 mx-auto border-0 bg-[rgb(206,32,39,255)] h-[1.5px] mt-4 md:mt-8" />
          <p className="mt-2 md:mt-8 text-xs md:text-base">Together We Do More</p>
          <p className="px-4 md:px-0 text-xs md:text-base">
            Keller Williams is there to help at every big step in the realestate journey.
          </p>
        
            <div className="flex justify-center md:justify-center mt-8 md:mt-16">
  <button className="
    w-56 bg-[rgb(206,32,39,255)] text-white py-3 rounded-full text-base
    relative 
    group transition-all duration-300
    hover:pr-8 hover:pl-4
  ">
    <span className="inline-block transition-all duration-300 group-hover:-translate-x-3" >
    JOIN US
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

      <div className="order-1 md:order-2 mt-10 flex flex-col items-center justify-center">
    <Image
      src="/howwillyouthink.png"
      alt="How Will You Thrive"
      width={800}
      height={400}
      className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
    />
    <button className="bg-[rgb(206,32,39,255)] w-40 text-white px-8 py-1.5 text-xs font-semibold rounded-full block mx-auto md:hidden mt-4 mb-4"  onClick={() => router.push('/contactUs')}> 
      JOIN US
    </button>
  </div>

     
      <Footer />
    </div>
  );
};

export default Tenant;