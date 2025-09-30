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
    const fetchPageHero = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/page/slug/contact-us');
        if (!res.ok) return;
       
        
        const page = await res.json();
        // console.log(page);
        setPage(page)
       if (page?.backgroundImage) {
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
