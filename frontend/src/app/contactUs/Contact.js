'use client'
import React, { useState,useEffect } from 'react';
import Box from '@/components/box';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import api from '@/utils/api';
import { useTranslation } from '@/contexts/TranslationContext';

const Contact = () => {
  const { t, isRTL, language } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    enquiryType: 'General Enquiry',
    message: '',
   
  });
  const [heroSrc, setHeroSrc] = useState('/')
  const[page,setPage]=useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  useEffect(() => {
    const CACHE_KEY = 'contact_page_data';
    const CACHE_EXPIRY_KEY = 'contact_page_data_expiry';
    const SESSION_CACHE_KEY = 'contact_page_session';
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

    const fetchPageHero = async () => {
      // Step 1: Show cached data immediately (if available)
      const showCachedDataImmediately = () => {
        if (typeof window !== 'undefined') {
          // Check sessionStorage first for ultra-fast access
          const sessionData = sessionStorage.getItem(SESSION_CACHE_KEY);
          if (sessionData) {
            try {
              const parsedData = JSON.parse(sessionData);
              setPage(parsedData.page);
              setHeroSrc(parsedData.heroSrc);
              return true; // Cached data was shown
            } catch (e) {
              console.warn('Error parsing session cache:', e);
            }
          }

          // Check localStorage for persistent cache
          const cachedData = localStorage.getItem(CACHE_KEY);
          const cachedExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
          const now = Date.now();

          if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
            try {
              const parsedData = JSON.parse(cachedData);
              // Copy to session storage for ultra-fast next access
              sessionStorage.setItem(SESSION_CACHE_KEY, cachedData);
              setPage(parsedData.page);
              setHeroSrc(parsedData.heroSrc);
              return true; // Cached data was shown
            } catch (e) {
              console.warn('Error parsing localStorage cache:', e);
            }
          }
        }
        return false; // No cached data
      };

      // Step 2: Fetch fresh data function
      const fetchFreshData = async (isBackgroundUpdate = false) => {
        try {
          if (!isBackgroundUpdate) {
            setLoading(true);
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/contact-us`, {
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
          
          let heroSrcValue = '/';
          if (page?.backgroundImage) {
            const cleanPath = page.backgroundImage.replace(/\\/g, '/');
            heroSrcValue = cleanPath.startsWith('http')
              ? cleanPath
              : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
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
            console.log('✅ Contact page updated with latest data');
          }

        } catch (error) {
          if (error.name === 'AbortError') {
            console.warn('Contact page fetch timeout');
          }
          console.error('Error fetching contact page:', error);
          
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
                  console.warn('Error parsing cached contact data:', parseError);
                }
              }
            }
          }
        } finally {
          if (!isBackgroundUpdate) {
            setLoading(false);
          }
        }
      };

      // Main execution flow
      try {
        // Try to show cached data immediately
        const cachedDataShown = showCachedDataImmediately();

        if (cachedDataShown) {
          // User sees cached data instantly, now fetch fresh data in background
          setTimeout(() => fetchFreshData(true), 100); // Small delay to let UI render
        } else {
          // No cached data, show loading and fetch fresh data
          await fetchFreshData(false);
        }

      } catch (err) {
        console.error('Error in fetchPageHero:', err);
        setLoading(false);
      }
    };

    fetchPageHero();
  }, []);

  // Client-side cache initialization effect to avoid hydration errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check sessionStorage first for ultra-fast access
        const sessionData = sessionStorage.getItem('contact_page_session');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          if (parsedData.page && !page) setPage(parsedData.page);
          if (parsedData.heroSrc && parsedData.heroSrc !== '/' && (!heroSrc || heroSrc === '/')) {
            setHeroSrc(parsedData.heroSrc);
          }
          return;
        }

        // Fallback to localStorage
        const cachedData = localStorage.getItem('contact_page_data');
        const cachedExpiry = localStorage.getItem('contact_page_data_expiry');
        const now = Date.now();
        if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData.page && !page) setPage(parsedData.page);
          if (parsedData.heroSrc && parsedData.heroSrc !== '/' && (!heroSrc || heroSrc === '/')) {
            setHeroSrc(parsedData.heroSrc);
          }
          // Copy to session storage for next access
          sessionStorage.setItem('contact_page_session', cachedData);
        }
      } catch (e) {
        console.warn('Error reading cached contact data in client effect:', e);
      }
    }
  }, [page,heroSrc]); // Run once on mount
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.post('/leads', {
        ...formData,
        formType: 'contact-us'
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage(t('Thank you! Your message has been sent successfully.'));
        // Reset form
        setFormData({
          fullName: '',
          mobileNumber: '',
          email: '',
          enquiryType: 'General Enquiry',
          message: '',
         
        });
      }
      
    } catch (error) {
      // console.error('Error submitting form:', error);
      setSubmitMessage(t('Sorry, there was an error sending your message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Header />
      <Box
          src={heroSrc}
        h3={t(page.backgroundOverlayContent)}
     
      />

      {/* Contact Form */}
      <div className="w-full md:px-70 px-10 py-10">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              placeholder={t("E.g. John Doe")}
              value={formData.fullName}
              onChange={handleInputChange}
              className="peer w-full border-b border-gray-400 bg-transparent 
                         focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 
                         placeholder-transparent focus:placeholder-gray-400"
            />
            <label
              htmlFor="fullName"
              className={`absolute ${isRTL ? "right-0" : "left-0"} text-gray-500 text-[1.1rem] transition-all ${
  formData.fullName
    ? "-top-3.5 text-sm text-black"
    : "top-2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black"
}`}

            >
              {t("Full Name")}
            </label>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                placeholder={t("E.g. +966 512 345 678")}
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="peer w-full border-b border-gray-400 bg-transparent 
                           focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 
                           placeholder-transparent focus:placeholder-gray-400"
              />
              <label
  htmlFor="mobileNumber"
  className={`absolute ${isRTL ? "right-0" : "left-0"} text-gray-500 text-[1.1rem] transition-all ${
    formData.mobileNumber
      ? "-top-3.5 text-sm text-black"
      : "top-2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black"
  }`}
>
  {t("Phone Number")}
</label>

            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={t("E.g. john@example.com")}
                value={formData.email}
                onChange={handleInputChange}
                className="peer w-full border-b border-gray-400 bg-transparent 
                           focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 
                           placeholder-transparent focus:placeholder-gray-400"
              />
              <label
                htmlFor="email"
                className={`absolute ${isRTL ? "right-0" : "left-0"} text-gray-500 text-[1.1rem] transition-all ${
  formData.email
    ? "-top-3.5 text-sm text-black"
    : "top-2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black"
}`}

              >
                {t("Email Address")}
              </label>
            </div>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <select
              id="enquiryType"
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleInputChange}
              className="w-full border-b border-gray-400 bg-transparent 
                         focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 text-gray-700"
            >
              <option value="General Enquiry">{t("General Enquiry")}</option>
              <option value="Agent Related Enquiry">{t("Agent Related Enquiry")}</option>
              <option value="Market Center Related Enquiry">{t("Market Center Related Enquiry")}</option>
            </select>
            <label
              htmlFor="enquiryType"
              className={`absolute ${isRTL ? "right-0" : "left-0"} -top-3.5 text-gray-500 text-[1.1rem]`}

            >
              {t("Select")}
            </label>
          </div>

          {/* Message with FULL BORDER + floating label */}
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder={t("Write your message here")}
              value={formData.message}
              onChange={handleInputChange}
              className="peer w-full border border-gray-400 bg-transparent 
                         focus:outline-none focus:border-black p-3 
                         text-[1.1rem] placeholder-transparent focus:placeholder-gray-400"
            ></textarea>
            <label
              htmlFor="message"
              className={`absolute text-gray-500 text-[1.1rem] transition-all bg-white px-1 ${
  formData.message
    ? `${isRTL ? "-top-2 right-2 text-sm text-black" : "-top-2 left-2 text-sm text-black"}`
    : `${isRTL ? "right-3 top-3 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:right-2 peer-focus:text-sm peer-focus:text-black" : "left-3 top-3 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-sm peer-focus:text-black"}`
}`}

            >
              {t("Message")}
            </label>
          </div>

         
       

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer font-semibold px-6 py-2 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                  : 'bg-[rgb(206,32,39,255)] text-white'
              }`}
            >
              {t(isSubmitting ? 'Sending...' : 'Send')}
            </button>
            {/* Submit Message below button */}
            {submitMessage && (
              <div className={`mt-4 p-4 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {submitMessage}
              </div>
            )}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
