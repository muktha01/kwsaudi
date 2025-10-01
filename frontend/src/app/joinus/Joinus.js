'use client'
import React,{useState,useEffect} from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import Image from 'next/image';
import Box from '@/components/box';
import Header from '@/components/header';
import NewFooter from '@/components/newfooter';
const Joinus = (props) => {
  // Form state for join us
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, formType: 'join-us' })
      });
      if (response.ok) {
        setSubmitMessage(t('Thank you! Your message has been sent successfully.'));
        setFormData({
          fullName: '',
          mobileNumber: '',
          email: '',
          city: '',
          message: ''
        });
      } else {
        setSubmitMessage(t('Sorry, there was an error sending your message. Please try again.'));
      }
    } catch (error) {
      setSubmitMessage(t('Sorry, there was an error sending your message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };
  const { t,isRTL  } = useTranslation();
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/join-us`);
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
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/filters`);
        const data = await res.json();
        const apiCities = Array.isArray(data?.data?.cities) ? data.data.cities : [];
        setCities(apiCities);
      } catch (error) {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);
  return (
    <div className="">
      {/* Hero Section */}
      <Header />

      <Box
        src='/kw_technology_page.jpeg'
        h3={page.backgroundOverlayContent}
        image={'/joinus.png'}
      ></Box>
 
      <div className=" px-10 md:pl-20">
        <div className="grid md:grid-cols-2 gap-0 items-start ">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold md:py-5 text-black">
                {t('Shape Your')} <br />
                <span className="text-[rgb(206,32,39,255)]">{t('Future')}</span>
                {" "}{t('in Real Estate')}
              </h2>
             <p
  className={`mt-4 md:text-lg text-md text-gray-700 
    ${isRTL ? 'md:pl-50 text-right' : 'md:pr-50 text-left'}`}
>

                {t('Are you ready to unlock your potential in the real estate industry? Join us at Keller Williams Saudi Arabia Career Night to learn more about how you can become a successful real estate agent with the world\'s largest real estate franchise.')}
              </p>
            </div>
            {/* Why Attend */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('Why Us?')}</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(206,32,39,255)] font-bold mt-1">✓</span>
                  <span className='md:text-lg text-md'>{t('One-of-a-kind culture')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(206,32,39,255)] font-bold mt-1">✓</span>
                  <span className='md:text-lg text-md'>{t('Limitless earning potential')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(206,32,39,255)] font-bold mt-1">✓</span>
                  <span className='md:text-lg text-md'>{t('Industry-leading technology')}</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Right Column - Form */}
          <div className="bg-white shadow-md  p-8">
            <h3 className="text-xl font-bold text-center mb-6">{t('Join Us Today')}</h3>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <label className='block mb-2'>{t('Full Name')}</label>
              <input
                type="text"
                name="fullName"
                placeholder={t('Full Name')}
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border  focus:outline-none focus:ring-2"
                required
              />
              <label className='block mb-2'>{t('Mobile Number')}</label>
              <input
                type="tel"
                name="mobileNumber"
                placeholder={t('Mobile Number')}
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 "
                required
              />
              <label className='block mb-2'>{t('Email Address')}</label>
              <input
                type="email"
                name="email"
                placeholder={t('Email Address')}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 "
                required
              />
              <label className='block mb-2'>{t('City')}</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 "
                required
                disabled={loadingCities}
              >
                <option value="">{loadingCities ? t('Loading cities...') : t('Select your city')}</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{t(city)}</option>
                ))}
                <option value="Other">{t('Other')}</option>
              </select>
              {/* ✅ Message textarea added */}
              <label className="block mb-2">{t('Message')}</label>
              <textarea
                name="message"
                placeholder={t('Your Message')}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border h-24 resize-none focus:outline-none focus:ring-2 "
                required
              ></textarea>
              {/* ✅ Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[rgb(206,32,39,255)] text-white font-semibold py-2 hover:bg-red-700 transition"
              >
                {isSubmitting ? t('Submitting...') : t('Submit')}
              </button>
              {/* Submit Message below button */}
              {submitMessage && (
                <div className={`mt-4 p-3 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
     
          
          <div className="flex justify-center py-2 md:py-0">
                   <Image
                     src="/howwillyouthink.png"
                     alt="How Will You Thrive"
                     width={800}
                     height={400}
                   
                   />
                 </div>
           
                 {/* <hr className="w-8/12 md:w-5/12 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-2 md:mt-14 mb-10" /> */}
      
      <NewFooter></NewFooter>
    </div>
  );
};

export default Joinus;
