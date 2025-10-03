'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState,useEffect } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaTiktok, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from '@/contexts/TranslationContext';
import { GoogleOAuthProvider, useGoogleLogin  } from '@react-oauth/google';
import { useRouter } from "next/navigation";
import { Space_Mono } from "next/font/google";

export default function Home() {
  const { language,isRTL, t } = useTranslation();
  const [open, setOpen] = useState(null);
  const [googleIdToken, setGoogleIdToken] = useState(null);
  const [agentLoginSuccess, setAgentLoginSuccess] = useState(false);
  const [agents, setAgents] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [agentEmail, setAgentEmail] = useState("");
  const [mobileAgentEmail, setMobileAgentEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [mobileLoginError, setMobileLoginError] = useState(null);
  const [footerContent, setFooterContent] = useState("");
  const router=useRouter();

  // Fetch analytics footer content
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-management/`)
      .then((res) => res.json())
      .then((data) => {
        setFooterContent(data.footer || "");
      });
  }, []);

  const toggleMenu = (menu) => {
    setOpen(open === menu ? null : menu);
  };
  
  const handleGoogleClick = () => {
    window.open("https://accounts.google.com/signin", "_blank", "width=500,height=600");
  };
  const handleGoogleSuccess = (credentialResponse) => {
    setGoogleIdToken(credentialResponse.credential);
    setLoginError(null);
    setMobileLoginError(null);
    setAgentLoginSuccess(false);

    // Decode JWT to get email
    let email = null;
    try {
      const base64Url = credentialResponse.credential.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(
        Array.prototype.map.call(atob(base64), function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const payload = JSON.parse(jsonPayload);
      email = payload.email; // Use regular email field from Google
      if (!email) throw new Error('No email in credential payload');
    } catch (e) {
      setLoginError(t('Sign in with valid kw email id.'));
      setMobileLoginError(t('Sign in with valid kw email id.'));
      return;
    }

    // Fetch agents and validate email
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/combined-data?offset=0&limit=1000`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.results) {
          let allAgents = [];
          // Extract agents from the API response
          data.results.forEach(result => {
            if (result.success && result.type.includes('people_org') && result.data?.data) {
              allAgents = allAgents.concat(result.data.data);
            }
          });

          // Check if the email exists in agent data
          const found = allAgents.some(agent => {
            return (agent.email && agent.email.toLowerCase() === email.toLowerCase()) ||
                   (agent.work_email && agent.work_email.toLowerCase() === email.toLowerCase());
          });

          if (found) {
            setAgentLoginSuccess(true);
            setLoginError(null);
            setMobileLoginError(null);
            if (typeof window !== "undefined") {
              // Store the agent email for the signin page
              localStorage.setItem('agentEmail', email);
              router.push(`/signinagent?email=${encodeURIComponent(email)}`);
            }
          } else {
            setAgentLoginSuccess(false);
            setLoginError(t('You must login with a registered agent email.'));
            setMobileLoginError(t('You must login with a registered agent email.'));
          }
        } else {
          setAgentLoginSuccess(false);
          setLoginError(t('Error loading agent data.'));
          setMobileLoginError(t('Error loading agent data.'));
        }
      })
      .catch(() => {
        setAgentLoginSuccess(false);
        setLoginError(t('Error validating agent email.'));
        setMobileLoginError(t('Error validating agent email.'));
      });
  };

  // Function to handle manual email login
  const handleManualLogin = async (email, isMobile = false) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      if (isMobile) {
        setMobileLoginError(t('Please enter your email address.'));
      } else {
        setLoginError(t('Please enter your email address.'));
      }
      return;
    }

    try {
      // Fetch agents from the combined API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/combined-data?offset=0&limit=1000`);
      const data = await res.json();

      if (data.success && data.results) {
        let allAgents = [];
        
        // Extract agents from the API response
        data.results.forEach(result => {
          if (result.success && result.type.includes('people_org') && result.data?.data) {
            allAgents = allAgents.concat(result.data.data);
          }
        });

        // Find agent by email
        const found = allAgents.find(agent => {
          return (agent.email && agent.email.toLowerCase() === trimmedEmail.toLowerCase()) ||
                 (agent.work_email && agent.work_email.toLowerCase() === trimmedEmail.toLowerCase());
        });

        if (found) {
          // Map the agent data properly
          const mappedAgent = {
            _id: found.kw_uid || found._id,
            name: found.first_name && found.last_name 
              ? `${found.first_name} ${found.last_name}`.trim()
              : found.name || 'Unknown Agent',
            phone: found.phone || found.mobile_phone || found.work_phone || 'N/A',
            email: found.email || found.work_email || trimmedEmail,
            image: found.photo || found.profile_image || '/avtar.jpg',
            city:found.city||"",
            kw_uid: found.kw_uid
          };

          localStorage.setItem('selectedAgent', JSON.stringify(mappedAgent));
          localStorage.setItem('agentEmail', trimmedEmail);
          
          if (isMobile) {
            setMobileLoginError(null);
          } else {
            setLoginError(null);
          }
          
          router.push(`/signinagent?email=${encodeURIComponent(trimmedEmail)}`);
        } else {
          if (isMobile) {
            setMobileLoginError('Agent not found. Please check your email address.');
          } else {
            setLoginError('Agent not found. Please check your email address.');
          }
        }
      } else {
        if (isMobile) {
          setMobileLoginError('Error loading agent data.');
        } else {
          setLoginError('Error loading agent data.');
        }
      }
    } catch (err) {
      // console.error('Error fetching agent data:', err);
      if (isMobile) {
        setMobileLoginError('Error connecting to server.');
      } else {
        setLoginError('Error connecting to server.');
      }
    }
  };
  const handleGoogleFailure = (error) => {
    // console.error('Google OAuth Failed:', error);
    setLoginError('Google authentication failed. Please try again.');
    setMobileLoginError('Google authentication failed. Please try again.');
  };
  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleFailure,
  });

  useEffect(() => {
    async function fetchAllAgents() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all agents (no pagination on API call)
        const queryParams = new URLSearchParams({
          offset: '0',
          limit: '1000', // Get all agents
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/combined-data?${queryParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${googleIdToken}` 

          },
        });

        const data = await res.json();
        // console.log('API Response:', data);

        if (data.success && data.results) {
          let allFetchedAgents = [];
          
          // Extract agent data from the results array
          data.results.forEach(result => {
            if (result.success && result.type.includes('people_org')) {
              // Get the actual agent data from the nested structure
              const agentData = result.data?.data || [];
              allFetchedAgents = allFetchedAgents.concat(agentData);
            }
          });
          
          // console.log('Extracted agents:', allFetchedAgents);
          
          // Map the API response to agent format
          const mappedAgents = allFetchedAgents.map(item => ({
            _id: item.kw_uid || item.id || item._id,
            name: item.first_name && item.last_name 
              ? `${item.first_name} ${item.last_name}`.trim()
              : item.first_name || item.last_name || item.name || 'Unknown Agent',
            phone: item.phone || item.mobile_phone || item.work_phone || 'N/A',
            email: item.email || item.work_email || 'N/A',
            image: item.photo || item.profile_image || '/avtar.jpg',
            office: item.office_name || item.market_center || '',
            license: item.license_number || '',
            mls_id: item.kw_uid || item.mls_id || '',
            active: item.active !== false
          }));

          // Store all agents
          setAllAgents(mappedAgents);
        } else {
          setError(data.message || 'Failed to load agents');
        }
      } catch (err) {
        setError('Failed to load agents');
        // console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    }

    // Fetch all agents once
    fetchAllAgents();
  }, [googleIdToken]); // Only run once on mount
  
  return (
    <div className="flex flex-col ">
      {/* Main Content */}
     

      {/* Footer */}
      <footer className="mt-auto md:mt-10 md:mx-8">
        {/* Desktop Footer */}
        <div className="border-t border-gray-300 hidden md:block">
          {/* Top Footer */}
         {/* Top Footer */}
<div className="md:mx-10 mx-4 py-10 hidden md:flex justify-between gap-10">
  
  {/* Logo */}
  <div className="flex-shrink-0">
    <Image
      src={language === 'ar' ? "/logoarebic.png" : "/headerlogo.png"}
      alt="Keller Williams"
      width={250}
      height={180}
    />
  </div>

  {/* Columns */}
  <div className="flex flex-1 justify-between gap-10">
    
    {/* OUR CULTURE */}
    <div>
      <h3 className="text-black font-semibold mb-3">{t('OUR CULTURE')}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/aboutus">{t('About Us')}</Link></li>
        <li><Link href="/ourCulture/whyKW">{t('Why KW')}</Link></li>
        <li><Link href="/training">{t('Training')}</Link></li>
        <li><Link href="/ourCulture/technology">{t('Technology')}</Link></li>
        <li><Link href="/ourCulture/news">{t('News')}</Link></li>
        <li><Link href="/ourCulture/events">{t('Events')}</Link></li>
      </ul>
    </div>

    {/* SEARCH */}
    <div>
      <h3 className="text-black font-semibold mb-3">{t('SEARCH')}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/buyer">{t('Properties')}</Link></li>
        <li><Link href="/agent">{t('Agent')}</Link></li>
        <li><Link href="/marketCenter">{t('Market Center')}</Link></li>
        <li>
          <a 
            href="https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {t('Worldwide')}
          </a>
        </li>
      </ul>
    </div>

    {/* OTHERS */}
    <div>
      <h3 className="text-black font-semibold mb-3">{t('OTHERS')}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/contactUs">{t('Contact')}</Link></li>
        <li><Link href="/instantvaluation">{t('Instant Valuation')}</Link></li>
        <li><Link href="/franchise">{t('Open a Franchise')}</Link></li>
      </ul>
    </div>

    {/* KNOWLEDGE */}
    <div>
      <h3 className="text-black font-semibold mb-3">{t('KNOWLEDGE')}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/seller/sellerguid">{t('Seller Guide')}</Link></li>
        <li><Link href="/buyer/buyerguid">{t('Buyer Guide')}</Link></li>
        <li><Link href="/seller">{t('Five Steps to Sell')}</Link></li>
      </ul>
    </div>

    
   <GoogleOAuthProvider clientId="338139799424-0k3qfr1ip78n50gnn65g6odqj49no69p.apps.googleusercontent.com">
      <div className="bg-[rgb(206,32,39,255)] text-white p-5 max-w-[250px] rounded shadow">

        <h3 className="text-lg font-semibold mb-4">{t('AGENT PORTAL')}</h3>

        <p className="text-xs mb-3">
          {t('Access your dashboard, tools, and resources to grow your business.')}
        </p>
{!agentLoginSuccess ? (
  <div className="space-y-3">
   <div 
  className="relative w-full cursor-pointer" 
  onClick={() => login()}
>
  <input
    type="email"
    value={agentEmail}
    readOnly
    placeholder={t('Enter your email')}
    className="w-full px-3 py-2 pr-10 bg-white text-black text-sm outline-none border border-gray-300 cursor-pointer"
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        handleManualLogin(agentEmail, false);
      }
    }}
  />

  <div 
    className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
  >
    <Image
      src="/redgoogle-removebg-preview.png"
      alt={t("Google Logo")}
      width={30}
      height={30}
    />
  </div>
</div>

    
    <button
      type="button"
      onClick={() => handleManualLogin(agentEmail, false)}
      className="w-full flex justify-center bg-white text-[rgb(206,32,39,255)] py-2 text-sm font-medium hover:bg-gray-100 transition-colors px-4"
    >
      {t('Sign In')}
    </button>

    {loginError && (
      <p className="text-white text-xs mt-2">{loginError}</p>
    )}
  </div>
) : (
  <p className="text-white text-sm">{t('Logged in successfully')}</p>
)}
 

        {/* {loading && <p className="text-white text-xs mt-2">{t('Loading agents...')}</p>}
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>} */}
        
      </div>
    </GoogleOAuthProvider>
  </div>


           
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-300 mt-6">
  <div className="md:mx-8 mx-auto py-6">
    <div className="flex flex-col md:flex-row md:justify-between items-start text-sm text-gray-600">

      {/* Left Text */}
      <div className="flex flex-col space-y-1 md:space-y-0 md:mr-4">
        <div>
          <Link href='/TermsofUse'>{t('Terms of Use')}</Link> | 
          <Link href="/PrivacyPolicy" className="mx-2">{t('Privacy Policy')}</Link> | 
               
          <span className="mx-2">{t('REGA License Number #1200018764')}</span> | 
          <span className="mx-2">{t('شركة المقيّمين لإدارة وتطوير العقارات')}</span>
       </div>
        <p className="text-gray-500 mt-4">
          {t('Copyright © 1998-2025 Keller Williams Realty, LLC')} <br />
          {t('Keller Williams Realty, LLC, a franchise company, is an Equal Opportunity Employer and supports the Fair Housing Act. Each Keller Williams® office is independently owned and operated.')}
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex flex-row md:items-end mt-4 md:mt-0 space-x-4  text-xl">
        <a href="https://www.snapchat.com/add/kwsaudiarabia?invite_id=uOPm-ny1&locale=en_SA%40calendar%3Dgregorian&share_id=AYEA3l8WSMqsIdDUTwPzow&sid=26f1fc0b18b4498197cf201797833561">
          <i className="fab fa-snapchat"></i>
        </a>
        <a href="https://www.tiktok.com/@kw.saudiarabia" rel="noopener noreferrer">
          <i className="fab fa-tiktok"></i>
        </a>
        <a href="https://www.facebook.com/kellerwilliamssaudiarabia">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://www.instagram.com/kwsaudiarabia">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.youtube.com/@KWSaudiArabia">
          <i className="fab fa-youtube"></i>
        </a>
        <a href="https://www.linkedin.com/company/kwsaudiarabia/" aria-label="LinkedIn">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
</div>
    <hr className="border-gray-300 " />

    <p className="text-center text-gray-500 text-sm py-4">{t('Powered By : X-360.ai')}</p>
  
</div>
</div>

       {/* Mobile Footer */}
<div className="  p-6 md:hidden">
  {/* Menu Sections */}
  <div className="space-y-3">
    {/* OUR CULTURE */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("culture")}
      >
        {t('OUR CULTURE')}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "culture" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "culture" && (
        <ul className="pl-4 mt-2 text-md space-y-2">
          <li><Link href="/aboutus">{t('About Us')}</Link></li>
          <li><Link href="/ourCulture/whyKW">{t('Why KW')}</Link></li>
          <li><Link href="/training">{t('Training')}</Link></li>
          <li><Link href="/ourCulture/technology">{t('Technology')}</Link></li>
          <li><Link href="/ourCulture/news">{t('News')}</Link></li>
          <li><Link href="/ourCulture/events">{t('Events')}</Link></li>
        </ul>
      )}
    </div>

    {/* SEARCH */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("search")}
      >
        {t('SEARCH')}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "search" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "search" && (
        <ul className="pl-4 mt-2  text-md space-y-2">
          <li><Link href="/buyer">{t('Properties')}</Link></li>
          <li><Link href="/agent">{t('Agent')}</Link></li>
          <li><Link href="/marketCenter">{t('Market Center')}</Link></li>
          <li>
            <a
              href="https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Worldwide')}
            </a>
          </li>
        </ul>
      )}
    </div>

    {/* OTHERS */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("others")}
      >
        {t('OTHERS')}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "others" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "others" && (
        <ul className="pl-4 mt-2  text-md space-y-2">
          <li><Link href="/contactUs">{t('Contact')}</Link></li>
          <li><Link href="/instantvaluation">{t('Instant Valuation')}</Link></li>
          <li><Link href="/franchise">{t('Open a Franchise')}</Link></li>
        </ul>
      )}
    </div>

    {/* KNOWLEDGE */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("knowledge")}
      >
        {t('KNOWLEDGE')}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "knowledge" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "knowledge" && (
        <ul className="pl-4 mt-2  text-md space-y-2">
          <li><Link href="/seller/sellerguid">{t('Seller Guide')}</Link></li>
          <li><Link href="/buyer/buyerguid">{t('Buyer Guide')}</Link></li>
          <li><Link href="/seller">{t('Five Steps to Sell')}</Link></li>
        </ul>
      )}
    </div>

    {/* AGENT PORTAL */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("portal")}
      >
        {t('AGENT PORTAL')}
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "portal" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "portal" && (
        <div className="pl-4 mt-2 shadow-md p-4 border border-gray-200 bg-[rgb(206,32,39,255)] text-md space-y-3">
          <p className="text-sm text-white">
            {t('Access your dashboard, tools and resources to grow your business.')}
          </p>
          
          <div className="relative w-full">
            <input
              type="email"
              value={mobileAgentEmail}
                 readOnly
              onChange={e => setMobileAgentEmail(e.target.value)}
              placeholder={t('Enter your email')}
              className="w-full px-3 py-2 pr-10 bg-white text-black text-sm outline-none border border-gray-300"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleManualLogin(mobileAgentEmail, true);
                }
              }}
            />
            <button
              type="button"
              onClick={() => login()}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              title={t('Sign in with Google')}
            >
              <Image
                src="/redgoogle-removebg-preview.png"
                alt={t('Google Logo')}
                width={30}
                height={30}
              />
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => handleManualLogin(mobileAgentEmail, true)}
            className="w-full flex justify-center bg-white text-[rgb(206,32,39,255)] py-2 text-sm font-medium hover:bg-gray-100 transition-colors px-4"
          >
            {t('Sign In')}
          </button>

          {mobileLoginError && (
            <p className="text-white text-xs mt-2">{mobileLoginError}</p>
          )}
        </div>
      )}
    </div>
  </div>

  {/* App Store Buttons */}
 

  <hr className="border-gray-500 my-6" />

  {/* Social Icons */}
  <div className="flex justify-center space-x-4 text-xl">
    <a href="https://www.snapchat.com/add/kwsaudiarabia?invite_id=uOPm-ny1"><i className="fab fa-snapchat"></i></a>
    <a href="https://www.facebook.com/kellerwilliamssaudiarabia"><i className="fab fa-facebook"></i></a>
    <a href="https://www.instagram.com/kwsaudiarabia"><i className="fab fa-instagram"></i></a>
    <a href="https://www.youtube.com/@KWSaudiArabia"><i className="fab fa-youtube"></i></a>
    <a href="https://www.linkedin.com/company/kwsaudiarabia/"><i className="fab fa-linkedin"></i></a>
  </div>

  {/* Footer Links */}
  <div className="flex flex-wrap justify-center gap-1 text-gray-600 text-sm mt-6 ">
    <Link href="/TermsofUse">{t('Terms of Use')} | </Link>
    <a href="https://stonedtailor.wixstudio.com/kwsaudiarabia/privacypolicy">{t('Privacy Policy')} | </a>
    <span className="mx-2">{t('REGA License Number #1200018764')}</span> | 
                  <a href='#' className="mx-2">{t('شركة المقيّمين لإدارة وتطوير العقارات')}</a>
  </div>
  <p className="text-sm mx-2 text-gray-500 mt-3 text-center md:text-left mb-2">
                {t('Copyright © 1998-2025 Keller Williams Realty, LLC')} <br />
                {t('Keller Williams Realty, LLC, a franchise company, is an Equal Opportunity Employer and supports the Fair Housing Act. Each Keller Williams® office is independently owned and operated.')}
              </p>
              <p className=" border-t py-4 border-gray-300 flex justify-center align-items-center text-cente text-gray-500 text-sm">{t('Powered By : X-360.ai')}</p>
              {/* Inject analytics footer content */}
              {footerContent && (
                <div dangerouslySetInnerHTML={{ __html: footerContent }} />
              )}
</div>

      </footer>
    </div>
  );
}