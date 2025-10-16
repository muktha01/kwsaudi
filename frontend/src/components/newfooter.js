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
  const [footerAgents, setFooterAgents] = useState([]);
  const [footerAgentsError, setFooterAgentsError] = useState(null);
  // Test input for alternate sign-in
  const [testAgentEmail, setTestAgentEmail] = useState("");
  const [testLoginError, setTestLoginError] = useState(null);
  // Handler for test sign-in
  const handleTestSignIn = () => {
    const trimmedEmail = testAgentEmail.trim();
    if (!trimmedEmail) {
      setTestLoginError(t('Please enter your email address.'));
      return;
    }
    const found = footerAgents.find(agent => {
      const emails = [agent.email, agent.work_email, agent.kw_email].filter(Boolean);
      return emails.some(e => e.toLowerCase() === trimmedEmail.toLowerCase());
    });
    if (found) {
      setTestLoginError(null);
  const kwUid = found.kw_uid || '';
  const url = kwUid
    ? `/signinagent?email=${encodeURIComponent(trimmedEmail)}&kw_uid=${encodeURIComponent(kwUid)}`
    : `/signinagent?email=${encodeURIComponent(trimmedEmail)}`;
  router.push(url);
    } else {
      setTestLoginError('Agent not found. Please check your email address.');
    }
  };
  const router=useRouter();

  // Fetch analytics footer content
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-management/`)
      .then((res) => res.json())
      .then((data) => {
        setFooterContent(data.footer || "");
      });

    // Fetch agent data for footer
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/kw/people-data?offset=0&limit=1000`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch agents');
        return res.json();
      })
      .then((data) => {
        setFooterAgents(data.data || []);
      })
      .catch((err) => {
        setFooterAgentsError('Failed to fetch agents');
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

    // Validate email using footerAgents fetched from /people-data
    const foundAgent = footerAgents.find(agent => {
      const emails = [agent.email, agent.work_email, agent.kw_email].filter(Boolean);
      return emails.some(e => e.toLowerCase() === email.toLowerCase());
    });

    if (foundAgent) {
      setAgentLoginSuccess(true);
      setLoginError(null);
      setMobileLoginError(null);
      const kwUid = foundAgent.kw_uid || '';
      const url = kwUid
        ? `/signinagent?email=${encodeURIComponent(email)}&kw_uid=${encodeURIComponent(kwUid)}`
        : `/signinagent?email=${encodeURIComponent(email)}`;
      router.push(url);
    } else {
      setAgentLoginSuccess(false);
      setLoginError(t('You must login with a registered agent email.'));
      setMobileLoginError(t('You must login with a registered agent email.'));
    }
  };

  // Function to handle manual email login using footerAgents
  const handleManualLogin = (email, isMobile = false) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      if (isMobile) {
        setMobileLoginError(t('Please enter your email address.'));
      } else {
        setLoginError(t('Please enter your email address.'));
      }
      return;
    }

    // Find agent by email in footerAgents
    const found = footerAgents.find(agent => {
      const emails = [agent.email, agent.work_email, agent.kw_email].filter(Boolean);
      return emails.some(e => e.toLowerCase() === trimmedEmail.toLowerCase());
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
        city: found.city || "",
        kw_uid: found.kw_uid
      };

  // Removed localStorage usage
      
      if (isMobile) {
        setMobileLoginError(null);
      } else {
        setLoginError(null);
      }
      const kwUid = mappedAgent.kw_uid || '';
      const url = kwUid
        ? `/signinagent?email=${encodeURIComponent(trimmedEmail)}&kw_uid=${encodeURIComponent(kwUid)}`
        : `/signinagent?email=${encodeURIComponent(trimmedEmail)}`;
      router.push(url);
    } else {
      if (isMobile) {
        setMobileLoginError('Agent not found. Please check your email address.');
      } else {
        setLoginError('Agent not found. Please check your email address.');
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

  // (Removed old combined-data fetch for allAgents)
  
  return (
    <div className="flex flex-col ">
      {/* Main Content */}
     

      {/* Footer */}
      {/* Test Sign-In Section (for testing in a different place) */}
      <div className="w-full flex flex-col items-center my-6">
        <div className="max-w-xs w-full bg-gray-100 p-4 rounded shadow border border-gray-200">
          <h4 className="font-semibold mb-2 text-gray-700">{t('Test Agent Sign In')}</h4>
          <input
            type="email"
            value={testAgentEmail}
            onChange={e => setTestAgentEmail(e.target.value)}
            placeholder={t('Enter your agent email')}
            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded text-sm"
            onKeyPress={e => { if (e.key === 'Enter') handleTestSignIn(); }}
          />
          <button
            type="button"
            onClick={handleTestSignIn}
            className="w-full bg-[rgb(206,32,39,255)] text-white py-2 rounded font-medium hover:bg-[rgb(186,22,29,255)] transition-colors"
          >
            {t('Test Sign In')}
          </button>
          {testLoginError && <p className="text-red-600 text-xs mt-2">{testLoginError}</p>}
        </div>
      </div>
      <footer className="mt-auto lg:mt-10 lg:mx-8">
        {/* Desktop Footer */}
        <div className="border-t border-gray-300 hidden lg:block">
          {/* Top Footer */}
         {/* Top Footer */}
<div className="lg:mx-10 mx-4 py-10 hidden lg:flex justify-between gap-10">
  
  {/* Logo */}
  <div className="flex-shrink-0">
    <Image
      src={language === 'ar' ? "/logoarebic.png" : "/headerlogo.png"}
      alt="Keller Williams"
      width={180}
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
      login();
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
  <div className="lg:mx-8 mx-auto py-6">
    {/* Agent List Section - Desktop */}
    {/* {footerAgents.length > 0 && (
      <div className="my-6">
        <h4 className="font-semibold mb-2 text-gray-700">{t('Our Agents')}</h4>
        <ul className="text-sm text-gray-700 max-h-60 overflow-y-auto">
          {footerAgents.map((agent, idx) => {
            // Always include idx in the key to guarantee uniqueness
            const key = `${agent.kw_uid || agent._id || 'noid'}-${agent.email || agent.work_email || 'noemail'}-${idx}`;
            return (
              <li key={key}>
                {(agent.name || `${agent.first_name || ''} ${agent.last_name || ''}`)} - {(agent.email || agent.work_email)}
              </li>
            );
          })}
        </ul>
      </div>
    )} */}
    <div className="flex flex-col lg:flex-row lg:justify-between items-start text-sm text-gray-600">

      {/* Left Text */}
      <div className="flex flex-col space-y-1 lg:space-y-0 lg:mr-4">
        <div>
          <Link href='/TermsofUse'>{t('Terms of Use')}</Link> | 
          <Link href="/PrivacyPolicy" className="mx-2">{t('Privacy Policy')}</Link> | 
               
          <span className="mx-2">{t('REGA License Number #1200018764')}</span> | 
          <span className="mx-2">{t('شركة الياسمين لإدارة و تطوير العقارات')}</span>
       </div>
        <p className="text-gray-500 mt-4">
          {t('Copyright © 1998-2025 Keller Williams Realty, LLC')} <br />
          {t('Keller Williams Realty, LLC, a franchise company, is an Equal Opportunity Employer and supports the Fair Housing Act. Each Keller Williams® office is independently owned and operated.')}
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex flex-row lg:items-end mt-4 lg:mt-0 space-x-4  text-xl">
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
<div className="  p-6 lg:hidden">
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
                  login();
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
  <Link href="/PrivacyPolicy" className="mx-2">{t('Privacy Policy')}</Link> | 
    <span className="mx-2">{t('REGA License Number #1200018764')}</span> | 
                  <a href='#' className="mx-2">{t('شركة الياسمين لإدارة و تطوير العقارات')}</a>
  </div>
  <p className="text-sm mx-2 text-gray-500 mt-3 text-center lg:text-left mb-2">
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