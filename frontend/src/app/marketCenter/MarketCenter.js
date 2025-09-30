'use client'

import React, { useState } from 'react';
import Header from '@/components/header';
import dynamic from 'next/dynamic';
import { FaPhoneAlt, FaChevronRight, FaEnvelope, FaSearch } from 'react-icons/fa';
import { useTranslationHook } from '@/hooks/useTranslation';

const Footer = dynamic(() => import('@/components/newfooter'), { ssr: false });

const marketCenters = [
  {
    name: "Keller Williams Jasmin",
    city: "Riyadh",
    address: "Dist, 2740 King Fahd Branch Rd, as Sahafah, 6403, Riyadh 13315",
    phone: "09200-15671",
    email: "info@kwsaudiarabia.com",
    link: "/jasmin"
  },
  {
    name: "Keller Williams Jeddah",
    city: "Jeddah",
    address: "Al Khalidiyyah, Jeddah 23421",
    phone: "09200-15671",
    email: "info@kwsaudiarabia.com",
    link: "/jeddah"
  }
];


const MarketCenter = () => {
  const [filterCity, setFilterCity] = useState("");
  const { t } = useTranslationHook();

  // filter market centers by city name
  const filteredCenters = marketCenters.filter(center =>
    center.city.toLowerCase().includes(filterCity.toLowerCase())
  );

  return (
    <div>
      <div className="relative p-4 sm:p-6 md:p-8">
        <Header />

        <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

        <div className="relative bg-gray-100">
          <div className="pt-32 sm:pt-32 md:pt-44">
            <h1 className="text-start font-semibold text-2xl sm:text-3xl md:text-[40px] mx-4 sm:mx-10 md:mx-36 text-gray-700">
              {t('Find a Market Center')}
            </h1>
          </div>

          <div className="bg-white shadow-lg mx-4 sm:mx-10 md:mx-36">
            <div className="grid grid-cols-1 md:grid-cols-2 my-6 sm:my-8 md:my-10 p-4 sm:px-6 md:px-10 gap-6 sm:gap-8">

              {/* Left */}
              <div className="space-y-6 md:pr-6">
                <div className="grid grid-cols-1 gap-6">

                  {/* Search by City */}
                  <div className="sticky top-12 sm:top-14 md:top-15 bg-white z-10 py-3 sm:py-4">
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 mb-3 sm:mb-4 text-gray-700 text-sm sm:text-base">
                      <span className="font-medium">{t('Search by:')}</span>
                      <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked
                          readOnly
                          className="text-red-600 focus:ring-red-600"
                        />
                        {t('City')}
                      </label>
                    </div>

                    <div className="flex items-center border border-gray-300">
                      <input
                        type="text"
                        placeholder={t('Enter City')}
                        className="flex-1 px-2 sm:px-3 py-2 sm:py-3 outline-none text-sm sm:text-base"
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                      />
                      <button className="bg-[rgb(206,32,39,255)] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center">
                        <FaSearch size={20} className="sm:w-6 sm:h-6" />
                      </button>
                    </div>

                    <div className="mt-2 text-right">
                      <button
                        className="cursor-pointer text-[rgb(206,32,39,255)] text-xs sm:text-sm hover:underline"
                        onClick={() => setFilterCity("")}
                      >
                        {t('Clear my search')}
                      </button>
                    </div>
                  </div>

                  {/* Market Centers List */}
                  {filteredCenters.length > 0 ? (
  <div className="divide-y divide-gray-300">
    {filteredCenters.map((center, idx) => (
      <article
        key={idx}
        className="p-3 sm:p-4 flex flex-col gap-2"
      >
        <h3 className="text-lg sm:text-lg md:text-2xl font-semibold mb-2">{t(center.name)}</h3>
        <p className="text-sm md:text-base mb-2 sm:mb-4">{t(center.address)}</p>
        <p className="text-sm md:text-base break-all flex items-center gap-2">
          <FaPhoneAlt className="text-gray-600" /> {center.phone}
        </p>
        <p className="text-sm md:text-base break-all flex items-center gap-2">
          <FaEnvelope className="text-gray-600" /> {center.email}
        </p>
        <a
          href={center.link}
          className="hover:text-[rgb(206,32,39,255)] font-semibold transition-colors py-2 sm:py-3 flex items-center justify-start gap-1 sm:gap-2 text-base sm:text-base"
        >
          {t('More Details')} <FaChevronRight className="w-3 h-3 mt-0.5" />
        </a>
      </article>
    ))}
  </div>
) : (
  <div className="p-4 text-gray-500">
    {t('No market center found for this city.')}
  </div>
)}


                </div>
              </div>

              {/* Right: Sticky Map */}
              <div className="pl-0 my-6 md:my-10 sticky md:top-20 h-[300px] sm:h-[400px] md:h-[calc(100vh-5rem)]">
                <div className="relative w-full overflow-hidden border border-gray-200 h-full">
                  <iframe
                    title={t('Saudi Arabia Map')}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4444535.330365576!2d41.51259970861697!3d23.8006960408425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15e8e4f105f8aaaf%3A0x70a8a6a2cb7f9405!2sSaudi%20Arabia!5e0!3m2!1sen!2sin!4v1717315040974!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MarketCenter;
