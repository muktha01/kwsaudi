'use client'
import React, { useEffect, useState ,useRef } from 'react';
import Box from '@/components/box';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from '@/utils/api';
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { FaCheck } from "react-icons/fa";
import { useTranslation } from '@/contexts/TranslationContext';
const Franchise = () => {
  // Add state to track screen size
  const [isMobile, setIsMobile] = useState(false);
  const [phone, setPhone] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    educationStatus: '',
    dob: '',
    message: '',
    promotionalConsent: false,
    personalDataConsent: false
  });
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
    const videoRef = useRef(null);
    const { t, isRTL, language } = useTranslation();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {}); // play might need catch in some browsers
          } else {
            video.pause();
          }
        },
        { threshold: 0.5 } // play/pause when 50% visible
      );
      observer.observe(video);
    }

    return () => {
      if (observer && video) observer.unobserve(video);
    };
  }, []);
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/franchise`);
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
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.post('/leads', {
        ...form,
        formType: 'franchise'
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage(t('Thank you! Your franchise application has been submitted successfully.'));
        // Reset form
        setForm({
          fullName: '',
          mobileNumber: '',
          email: '',
          city: '',
          educationStatus: '',
          dob: '',
          message: '',
          promotionalConsent: false,
          personalDataConsent: false
        });
      }
    } catch (error) {
      // console.error('Error submitting form:', error);
      setSubmitMessage(t('Sorry, there was an error submitting your application. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative ${isRTL ? 'rtl' : ''}`}>
      <Header />

      <Box
        h3={t(page.backgroundOverlayContent)}
          src={heroSrc}
        image={
          'https://static.wixstatic.com/media/36a881_d93a5085a707440e9b7a3346a80846a1~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7-removebg-preview.png'
        }
      ></Box>

     
            
       
      
        
       
            {/* Big Life Box */}
            <main className="px-4 md:py-10 py-2 ">
  <div className="mx-auto text-center ">
    <h1 className="text-2xl md:text-3xl font-semibold md:font-semibold tracking-[0.05em] md:tracking-[0.1em] text-gray-800 leading-snug">
      {t("WE WANT YOU TO")} <span className="text-[rgb(206,32,39,255)]">{t("LIVE A BIG LIFE")}</span>
    </h1>

    <hr className="w-32 sm:w-48 md:w-60 lg:w-72 border-0 mx-auto bg-[rgb(206,32,39,255)] h-[2px] mt-6 md:mt-14" />

    <div className="mt-6 sm:mt-10 px-2 sm:px-6 md:px-34">
      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
        {t(`Our Mission Is To Help You To Build Careers Worth Having, Businesses Worth Owning, Lives Worth Living, Experiences Worth Giving And Legacies Worth Leaving. To That End We Want This To Be The Most Amazing Place To Be An Estate Agent In The UK And Globally. And We Want The Best Leadership For Our Market Centres.`)}
      </p>
    </div>
  </div>
</main>

            {/* Black Strip Section */}
            <div className="relative min-h-[40vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        src="https://dev1.w4u.us/About_us_ssection%20video.mp4"
       
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Foreground content */}
      <main className={`relative z-10 px-4 py-6 text-center text-white `}>
        <p className="md:text-sm text-xs tracking-widest">{t("WHERE")}</p>

        <h1 className="text-xl md:text-4xl font-normal mt-4">
          {t("TRUE FINANCIAL FREEDOM BEGINS")}
        </h1>

        <hr className="w-48 md:w-[30rem] border-0 mx-auto bg-[rgb(206,32,39)] h-[2px] rounded-full mt-6 md:mt-14" />

        <div className="mt-10">
          <p className="text-xs md:text-base max-w-2xl mx-auto">
            {t(`As A Company Founded On Proven Systems And Models, Keller Williams Provides The Blueprint For Building A Big Business And An Even Bigger Life.`)}
          </p>

          <div className="flex justify-center mt-6 md:mt-10">
            <button
              className="cursor-pointer md:px-10 px-4 bg-[rgb(206,32,39)] text-white py-2 md:py-3 text-xs md:text-sm mt-6 relative overflow-hidden group rounded-full transition-all duration-300 hover:px-12"
              onClick={() => router.push("/ourCulture/whyKW")}
            >
              <span className="inline-block md:text-base text-sm font-semibold transition-all duration-300 group-hover:-translate-x-3">
                {t("GET STARTED")}
              </span>
              <span className={`absolute ${isRTL ? 'left-4 group-hover:translate-x-0 translate-x-[-4]' : 'right-4 group-hover:translate-x-0 translate-x-4'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white`}>
                {isRTL ? <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" /> : <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
      
     

      <div className="w-full py-6  md:py-12 px-8">
      <div className="mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Left Section */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="md:text-3xl text-2xl  font-semibold leading-snug">
            {t("WE WANT")} <span className="text-[rgb(206,32,39,255)]">{t("YOU TO LIVE")}</span><br /> {t("A BIG LIFE")}
          </h2>
          <p className="mt-8 text-base md:text-lg leading-relaxed ">
            {t(`At Keller Williams Saudi Arabia, we empower entrepreneurs to build thriving businesses, create lasting legacies, and achieve true financial freedom. Our Franchise model is designed to give you the tools, training, and support you need to lead in your market and grow beyond it.`)}
          </p>

          <h3 className="mt-8 font-bold md:text-xl text-lg text-[rgb(206,32,39,255)]">{t("WHY PARTNER WITH US?")}</h3>
  <ul className="mt-6 space-y-6 text-sm">
    <li>
    <span className="flex items-center gap-2 md:text-lg text-base font-semibold">
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    {t("Competitive Investment Costs")}
  </span>
      <span className="md:text-base text-sm">{t("Start your franchise with one of the most cost-effective models in the industry.")}</span>
    </li>
    <li>
    <span className={`flex items-center gap-2  text-lg font-semibold `}>
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    {t("Limitless Earning Potential")}
  </span>
      
      <span className="md:text-base text-sm">{t("Your success is only limited by your ambition and effort.")}</span>
    </li>
    <li>
    <span className={`flex items-center gap-2  md:text-lg text-base font-semibold`}>
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    {t("24/7 Training & Support")}
  </span>
      
      <span className="md:text-base text-sm">{t("Access world-class coaching, mentorship, and operational guidance anytime.")}</span>
    </li>
    <li>
    <span className={`flex items-center gap-2  md:text-lg text-base font-semibold `}>
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    {t("Industry-Leading Technology")}
  </span>
      
      <span className="md:text-base text-sm">{t("Stay ahead with innovative tools that drive efficiency and growth.")}</span>
    </li>
    <li>
    <span className={`flex items-center gap-2  md:text-lg text-base font-semibold `}>
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    {t("Additional Growth Opportunities")}
  </span>
      
      <span className="md:text-base text-sm">{t("Expand your business with multiple revenue streams and service offerings.")}</span>
    </li>
    <li>
    <span className={`flex items-center gap-2 md:text-lg text-base font-semibold`}>
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    {t("One-of-a-Kind Culture")}
  </span>
      
      <span className="md:text-base text-sm">{t("Join a collaborative, success-driven network that celebrates your wins.")}</span>
    </li>
  </ul>


          <h1 className="mt-8">
            <span className="font-bold text-[rgb(206,32,39,255)] md:text-xl text-lg">{t("SHAPE YOUR FUTURE IN REAL ESTATE")}</span>
            <p className={`text-base md:text-lg mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t(`Ready to own a piece of the world's largest real estate franchise? Fill out the Franchise Application and take your first step toward building a business that offers both financial rewards and personal fulfillment.`)}
            </p>
          </h1>
        </div>

        {/* Right Section - Form */}
        <div className={`bg-white text-black p-8 shadow-lg ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="text-2xl font-medium mb-6 flex justify-center">{t("Franchise Application")}</h3>
          
        

          <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">{t("Full Name")}</label>
    <input 
      type="text" 
      name="fullName"
      placeholder={t("Full Name")} 
      value={form.fullName}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">{t("Mobile Number")}</label>
    <input 
      type="text" 
      name="mobileNumber"
      placeholder={t("Mobile Number")} 
      value={form.mobileNumber}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">{t("Email Address")}</label>
    <input 
      type="email" 
      name="email"
      placeholder={t("Email Address")} 
      value={form.email}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">{t("City")}</label>
    <input 
      type="text" 
      name="city"
      placeholder={t("City")}
      value={form.city}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">{t("Education")}</label>
    <input 
      type="text" 
      name="educationStatus"
      placeholder={t("Education")}
      value={form.educationStatus}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">{t("Date of Birth")}</label>
    <input 
      type="date" 
      name="dob"
      value={form.dob}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">{t("Message")}</label>
    <textarea 
      name="message"
      placeholder={t("Message")}
      rows={3}
      value={form.message}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      >
    </textarea>
  </div>
</div>


            {/* Checkbox */}
            <div className={`text-xs text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
  <h1 className="font-semibold mb-2">{t("Promotional Declaration")}</h1>
  <div className={`flex items-start space-x-2 `}>
    <input 
      type="checkbox" 
      id="permission" 
      name="promotionalConsent"
      checked={form.promotionalConsent}
      onChange={handleInputChange}
      className="mt-1" 
    />
    <label htmlFor="permission" className="leading-snug">
      {t("I consent to receiving promotional content, text messages, and calls regarding Keller Williams services.")}
    </label>
  </div>
</div>

            {/* GDPR notice */}
            <div className={`text-xs text-gray-500 leading-snug ${isRTL ? 'text-right' : 'text-left'}`}>
  <h1 className="font-semibold mb-2">{t("Personal Data Protection Declaration")}</h1>
  
  <div className={`flex items-start mb-2 space-x-2`}>
    <input 
      type="checkbox" 
      id="dataPermission" 
      name="personalDataConsent"
      checked={form.personalDataConsent}
      onChange={handleInputChange}
      className="mt-1" 
    />
    <label htmlFor="dataPermission" className="leading-snug">
      {t(`At Keller Williams Saudi Arabia, we care about your security. In order to fulfill our obligations to inform arising from Article 10 of the Personal Data Protection Law, you can obtain your Personal Data Protection Information and Personal Data Sharing Permission from our valued visitors. We kindly request you to read and approve the text in the link below.`)}
    </label>
  </div>
</div>


            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={` cursor-pointer w-full font-bold py-3 mt-4 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[rgb(206,32,39,255)] text-white'
              }`}
            >
              {t(isSubmitting ? 'SUBMITTING...' : 'SUBMIT')}
            </button>
            {/* Submit Message below button */}
            {submitMessage && (
              <div className={`mt-4 p-3 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(submitMessage)}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
    

     
      <Footer />
    </div>
    
  );
};

export default Franchise;
