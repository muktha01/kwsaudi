"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import NewFooter from "@/components/newfooter";
import Box from '@/components/box';
import api from '@/utils/api';
import { FaPlus } from "react-icons/fa";
import { useTranslation } from '@/contexts/TranslationContext';

const InstantValuationClient = () => {
  const [propertyType, setpropertyType] = useState([]);
  const [loading, setLoadingProperties] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const { language, isRTL, t } = useTranslation();
  const [heroSrc, setHeroSrc] = useState('/instant-valuation-default.jpg'); 
  const [page, setPage] = useState('');

  // Cache configuration
  const CACHE_KEY = 'instant-valuation-page-cache';
  const CACHE_EXPIRY_KEY = 'instant-valuation-page-cache-expiry';
  const SESSION_CACHE_KEY = 'instant-valuation-page-session-cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const [formData, setFormData] = useState({
    city: '',
    address: '',
    fullname: '',
    mobileNumber: '',
    bedrooms: '',
    property_type: '',
    valuation_type: '',
    promotionalConsent: false,
    personalDataConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/filters`);
      const data = await res.json();

      // ✅ propertyTypes is already an array
      const uniqueTypes = Array.isArray(data?.data?.propertyTypes)
        ? [...new Set(data.data.propertyTypes)]
        : [];

      setpropertyType(uniqueTypes);
    } catch (error) {
      // console.error("Error fetching property types:", error);
      setpropertyType([]);
    } finally {
      setLoadingProperties(false);
    }
  };
  fetchProperties();
}, []);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const payload = {
        ...formData,
        formType: 'instant-valuation'
      };
      const response = await api.post('/leads', payload);
      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Thank you! Your valuation request has been submitted successfully.');
        setFormData({
          city: '',
          address: '',
          fullname: '',
          mobileNumber: '',
          bedrooms: '',
          property_type: '',
          valuation_type: '',
          promotionalConsent: false,
          personalDataConsent: false
        });
      }
    } catch (error) {
      setSubmitMessage('Sorry, there was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Debug log for property types
    // console.log("Property Types:", propertyType);
  }, [propertyType]);

  const fetchFreshData = useCallback(async (isBackgroundUpdate = false) => {
    try {
      if (!isBackgroundUpdate) {
        setPageLoading(true);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/instant-valuation`, {
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
      
      let heroSrcValue = '/instant-valuation-default.jpg'; // Better default fallback
      if (page?.backgroundImage) {
        const cleanPath = page.backgroundImage.replace(/\\/g, '/');
        heroSrcValue = cleanPath.startsWith('http')
          ? cleanPath
          : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
        setHeroSrc(heroSrcValue);
      } else {
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
       // console.log('✅ Jasmin page updated with latest data');
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        // console.warn('Jasmin page fetch timeout');
      }
      //console.error('Error fetching jasmin page:', error);
      
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
              //console.warn('Error parsing cached jasmin data:', parseError);
            }
          }
        }
      }
    } finally {
      if (!isBackgroundUpdate) {
        setPageLoading(false);
      }
    }
  }, [setPageLoading, setPage, setHeroSrc, CACHE_KEY, CACHE_EXPIRY_KEY, SESSION_CACHE_KEY, CACHE_DURATION]);

  // Fetch page data and background image
  useEffect(() => {
    // Try to load from cache first for immediate display
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      const now = Date.now();
      
      if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
        try {
          const parsedData = JSON.parse(cachedData);
          setPage(parsedData.page);
          setHeroSrc(parsedData.heroSrc || '/instant-valuation-default.jpg');
          // Still fetch fresh data in background
          fetchFreshData(true);
          return;
        } catch (error) {
          //console.warn('Error parsing cached data:', error);
        }
      }
    }
    
    fetchFreshData();
  }, [fetchFreshData]);

  return (
    <div>
      <div className="relative p-6 md:p-8">
        <Header />
        <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>
        <div className="relative bg-white">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 space-y-8">
              {pageLoading ? (
                <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                  <div className="text-gray-500">{t('Loading image...')}</div>
                </div>
              ) : (
                <Image 
                  src={heroSrc} 
                  alt={t("Instant Valuation Image")} 
                  width={500} 
                  height={500} 
                  className="w-full h-auto object-cover "
                  
                  loading="lazy"
                 
                  
                />
              )}
              <div className={`text-gray-700 ${isRTL ? 'md:pl-30' : 'md:pr-30'} md:text-lg text-md leading-relaxed mx-2 md:mx-0 mt-6`}>
                <p>
                  {t('Your valuation is based on millions of pieces of data, from sold house prices in your area to current market trends and the size of your home.')}
                </p>
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="mt-6 font-semibold md:text-lg text-base">
                    {t('Included with your valuation :')}
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className={`flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <FaPlus className="text-[rgb(206,32,39,255)] mt-1" />
                      <span className="md:text-lg text-base">{t('Agent will contact you')}</span>
                    </li>
                    <li className={`flex items-start gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <FaPlus className="text-[rgb(206,32,39,255)] mt-1" />
                      <span className="md:text-lg text-base">{t('We help you sell your property')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 p-8 mt-0 md:mt-20 mr-10">
              <h3 className={`text-xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('Your Free, Online Valuation Starts Here..')}
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="city"
                  placeholder={t("Enter your city")}
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-1"
                />
                <input
                  type="text"
                  name="fullname"
                  placeholder={t("Name")}
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2"
                />
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder={t("Number")}
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2"
                />
                <select 
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2 text-gray-500"
                >
                  <option value="">{t("Bedrooms")}</option>
                  <option value="1">{t("1 Bedroom")}</option>
                  <option value="2">{t("2")}</option>
                  <option value="3">{t("3")}</option>
                  <option value="4">{t("4")}</option>
                  <option value="5">{t("5")}</option>
                  <option value="6">{t("6")}</option>
                  <option value="6+">{t("6+")}</option>
                </select>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2 text-gray-500"
                >
                  <option value="">{t("Property Type")}</option>
                  {propertyType.map((type, idx) => (
                    <option key={idx} value={type}>
                      {t(type)}
                    </option>
                  ))}
                </select>
                <select 
                  name="valuation_type"
                  value={formData.valuation_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2 text-gray-500"
                >
                  <option value="">{t("Type of valuation")}</option>
                  <option value="Sale">{t("Sale")}</option>
                  <option value="Letting">{t("Letting")}</option>
                  <option value="Both">{t("Both")}</option>
                </select>
                <button 
                type="submit"
                disabled={isSubmitting}
                className={`cursor-pointer flex ${isRTL ? 'justify-end' : 'justify-start'} text-white px-6 font-semibold p-2 ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[rgb(206,32,39,255)]'
                }`}
              >
                {t(isSubmitting ? 'SUBMITTING...' : 'SUBMIT')}
              </button>
              {/* Submit Message below button */}
              {submitMessage && (
                <div className={`mt-4 p-3 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {t(submitMessage)}
                </div>
              )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <NewFooter />
    </div>
  );
};

export default InstantValuationClient;
