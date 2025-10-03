'use client'
import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch, FaBars, FaTimes, FaBuilding,
  FaNetworkWired, FaUserTie, FaKey, FaUser,
  FaUsers, FaGlobe, FaHome, FaEnvelope, FaPhone,
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
  FaTwitter, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../contexts/TranslationContext';
// import GoogleTranslate, { setGoogleTranslateLanguage } from './GoogleTranslate'; // Removed Google Translate import

const Header = () => {
  const { language, isRTL, toggleLanguage, switchToLanguage, translatePage, t, isTranslating } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const prevScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopAtTop, setDesktopAtTop] = useState(true);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleSubmenu = (key) => {
    setOpenSubmenu(prev => (prev === key ? null : key));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle language switching safely
  const handleLanguageSwitch = async (newLanguage) => {
    try {
      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false);
        setOpenSubmenu(null);
      }

      console.log(`Header: Switching to ${newLanguage}`);
      
      // Always use our custom translation system
      await switchToLanguage(newLanguage);
      
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;
      
      // Add a smooth transition with requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setDesktopAtTop(currentScrollY < scrollThreshold);
        setIsAtTop(currentScrollY < scrollThreshold);
        setIsVisible(true);
      });
      
      prevScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔴 Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setOpenSubmenu(null);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const menuItems = [
    {
      label: t('Sell'), key: 'sell', submenu: [
        { label: t('Instant Valuation'), href: '/instantvaluation' },
        { label: t('Seller Guide'), href: '/seller/sellerguid' },
        { label: t('Book/Search KW Agent'), href: '/agent' },
        { label: t('Five Steps To Sell'), href: '/seller' },
      ]
    },
    {
      label: t('Buy'), key: 'buy', submenu: [
        { label: t('Property Search'), href: '/buyer' },
        { label: t('New Development'), href: '/properties/newdevelopment' },
        { label: t('Buyer Guide'), href: '/buyer/buyerguid' }
      ]
    },
    {
      label: t('Rent'), key: 'search', submenu: [
        { label: t('Rental Search'), href: '/properties/rent' },
        { label: t('Recently Rented'), href: '/properties/recentlyrented' },
      ]
    },
    {
      label: t('About'), key: 'about', submenu: [
        { label: t('About Us'), href: "/aboutus" },
        { label: t('Why KW'), href: "/ourCulture/whyKW" },
        { label: t("KW Training"), href: "/training" },
        { label: t("KW Technology"), href: "/ourCulture/technology" },
        { label: t("KW University"), href: "https://console.command.kw.com/connect/learning" },
      ]
    },
    {
      label: t('Search Agent/Market Center'), key: 'searchagent', submenu: [
        { label: t('KW Agent'), href: '/agent' },
        { label: t("Jasmine MC"), href: "/jasmin" },
        { label: t("Jeddah MC"), href: "/jeddah" },
      ]
    },
    {
      label: t('Join Us'), key: 'join', submenu: [
        { label: t('Become an Agent'), href: '/joinus' },
        { label: t('Franchise'), href: '/franchise' }
      ]
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Hidden Google Translate widget container */}
      {/* <GoogleTranslate /> */}
      <header
        className={`
          pointer-events-auto
          flex justify-between items-left h-[63.5px]
          transition-all duration-500 ease-out
          translate-y-0
          bg-black backdrop-blur-sm
          ${isMobile ? (isAtTop ? 'm-10' : 'mx-6 my-0') : (desktopAtTop ? 'm-14' : 'mx-8 my-0')}
        `}
        style={{
          transform: `translateY(0)`,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), margin 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Desktop Logo */}
        <div className="hidden md:flex flex-shrink-0 items-center h-[63.5px]">
          <Link href="/" className="block h-full">
            <Image
              src={language === 'ar' ? "/logoarebic.png" : "/headerlogo.png"}
              alt={t('KW Saudi Arabia Logo')}
              width={279}
              height={64}
              className="h-full w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden flex-shrink-0 items-center h-[63.5px]">
          <Link href="/" className="block h-full">
            <Image
              src="/kwline.png"
              alt={t('KW Saudi Arabia Logo')}
              width={279}
              height={64}
              className="h-full w-auto object-contain"
              
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center header-nav">
          {menuItems.map(item => (
            <div key={item.key} className="relative group">
              {item.submenu ? (
                <>
                  <button
                    type="button"
                    className={`flex items-center gap-1 text-[0.9rem] text-white font-semibold transition-colors focus:outline-none
                      ${[t('Join Us'), t('Contact')].includes(item.label) ? 'text-[rgb(206,32,39,255)]' : ''}
                      group-hover:text-white group-hover:bg-red-700 group-hover:border-red-700
                      px-4 h-[63.5px] border border-transparent
                    `}
                  >
                    {item.label}
                    <FaChevronDown className="ml-1" />
                  </button>
                  <div className="absolute left-0 top-full min-w-[180px] bg-gray-950/95 border-t-4 border-transparent group-hover:border-red-700
                    shadow-lg z-40 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all duration-200 mt-0 py-2 px-2 space-y-1">
                    {item.submenu.map((sub, idx) => (
                      <React.Fragment key={sub.href}>
                        <Link
                          href={sub.href}
                          className="block px-3 py-1 font-semibold text-white text-[0.9rem] hover:text-[rgb(206,32,39,255)] whitespace-nowrap transition-colors"
                        >
                          {sub.label}
                        </Link>
                        {idx !== item.submenu.length - 1 && (
                          <div className="h-px bg-gray-700 my-1 w-full" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-[0.9rem] font-semibold transition-colors px-4 h-[63.5px] border border-transparent
                    ${[t('Join Us'), t('Contact')].includes(item.label) ? 'text-[rgb(206,32,39,255)] hover:text-white hover:bg-red-700 hover:border-red-700' : 'text-white hover:text-white hover:bg-red-700 hover:border-red-700'}
                  `}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {/* Language Dropdown */}
          <div className="flex">
            <div className="relative group">
              <button
                type="button"
                className="flex items-center font-semibold px-4 h-[63.5px] text-white bg-gray-700 text-[0.9rem] border border-gray-700 hover:bg-gray-300 hover:text-black"
                data-no-translate="true"
                key={`lang-btn-${language}`}
              >
                {language === 'ar' ? t('عربي') : t('English')}
                <FaChevronDown className={`ml-1 ${isRTL ? 'rtl-ml-1' : ''}`} />
              </button>
              <div className="absolute left-0 top-full min-w-[120px] bg-gray-950/95 shadow-lg z-40
                opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none
                transition-all duration-200 py-2 px-2 space-y-1 border-t-4 border-transparent group-hover:border-red-700 font-semibold"
     data-no-translate="true"
>
    <button
        onClick={() => handleLanguageSwitch('en')}
        disabled={language === 'en'}
        className="w-full text-left px-3 py-1 text-white text-[0.9rem] hover:text-[rgb(206,32,39,255)] transition-colors disabled:opacity-50"
    >
        {t('English')}
    </button>
    <div className="h-px bg-gray-700 my-1 w-full" />
    <button
        onClick={() => handleLanguageSwitch('ar')}
        disabled={language === 'ar'}
        className="w-full text-left px-3 py-1 text-white text-[0.9rem] hover:text-[rgb(206,32,39,255)] transition-colors disabled:opacity-50"
    >
        {t('عربي')}
    </button>
</div>

            </div>

            {/* Contact Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center font-semibold px-4 h-[63.5px] text-white bg-red-700 text-[0.9rem] border border-red-700 border-l-0"
              >
                {t('Contact')}
                <FaChevronDown className={`ml-1 ${isRTL ? 'rtl-ml-1' : ''}`} />
              </button>
              <div className="absolute left-0 top-full min-w-[160px] bg-gray-950/95 shadow-lg z-40
                opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none
                transition-all duration-200 py-2 px-2 space-y-1 border-t-4 border-transparent group-hover:border-red-700 font-semibold">
                <Link href="/agent" className="block px-3 py-1 text-white text-[0.9rem] hover:text-[rgb(206,32,39,255)]">{t('KW Agent')}</Link>
                <div className="h-px bg-gray-700 my-1 w-full" />
                <Link href="/contactUs" className="block px-3 py-1 text-white text-[0.9rem] hover:text-[rgb(206,32,39,255)]">{t('Contact Us')}</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          ref={buttonRef}
          className="md:hidden text-white focus:outline-none p-2"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? t('Close menu') : t('Open menu')}
        >
          {isMenuOpen ? <FaTimes size={20} className="text-white" /> : <FaBars size={20} className="text-white" />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute md:hidden top-full left-0 right-0 py-4 ml-24 mr-2 px-4 space-y-4 shadow-lg bg-black backdrop-blur-sm z-50 border-t-4 border-[rgb(206,32,39,255)]"
          >
            {menuItems.map(item => (
              <div key={item.key}>
                {item.submenu ? (
                  <div
                    onClick={() => toggleSubmenu(item.key)}
                    className="flex justify-between items-center px-2 text-white hover:text-gray-300 transition-colors cursor-pointer border-b border-gray-700"
                  >
                    <span className={openSubmenu === item.key ? 'text-white font-semibold' : 'text-white'}>
                      {item.label}
                    </span>
                    {openSubmenu === item.key ? (
                      <FaChevronUp className="text-white" />
                    ) : (
                      <FaChevronDown className="text-white" />
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-1 font-semibold transition-colors border-b border-gray-700 text-white hover:text-[rgb(206,32,39,255)]"
                  >
                    {item.label}
                  </Link>
                )}

                {item.submenu && openSubmenu === item.key && (
                  <div className="mt-1 space-y-3 text-base text-white bg-gray-700 px-3 py-2">
                    {item.submenu.map((sub, idx) => (
                      <React.Fragment key={sub.href}>
                        <Link href={sub.href} className="block">{sub.label}</Link>
                        {idx !== item.submenu.length - 1 && <div className="h-px bg-gray-400 my-1 w-full" />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Language Dropdown */}
            <div
              onClick={() => toggleSubmenu('language')}
              className="flex justify-between items-center px-2 text-white hover:text-gray-300 transition-colors cursor-pointer py-1 border-b border-gray-700"
              data-no-translate="true"
              key={`mobile-lang-${language}`}
            >
              <span className={openSubmenu === 'language' ? ' font-semibold underline' : 'text-white'}>
                {language === 'ar' ? t('عربي') : t('English')}
              </span>
              {openSubmenu === 'language' ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
            </div>
            {openSubmenu === 'language' && (
              <div className=" text-base text-white bg-gray-700 px-3 py-2">
                <button
                  onClick={() => handleLanguageSwitch('en')}
                  disabled={language === 'en'}
                  className="block w-full text-left disabled:opacity-50"
                  data-no-translate="true"
                >
                  {t('English')}
                </button>
                <div className="h-px bg-gray-400 my-1 w-full" />
                <button
                  onClick={() => handleLanguageSwitch('ar')}
                  disabled={language === 'ar'}
                  className="block w-full text-left disabled:opacity-50"
                  data-no-translate="true"
                >
                  {t('عربي')}
                </button>
              </div>
            )}

            {/* Mobile Contact Dropdown */}
            <div
              onClick={() => toggleSubmenu('contact')}
              className="flex justify-between items-center  text-white bg-[rgb(206,32,39,255)] px-2 py-2 cursor-pointer border border-[rgb(206,32,39,255)]"
            >
              <span className={openSubmenu === 'contact' ? ' font-semibold' : 'text-white'}>{t('Contact')}</span>
              {openSubmenu === 'contact' ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
            </div>
            {openSubmenu === 'contact' && (
              <div className="mt-1 text-base text-white bg-gray-700 px-3 py-2">
                <Link href="/agent" className="block">{t('KW Agent')}</Link>
                <div className="h-px bg-gray-400 my-1 w-full" />
                <Link href="/contactUs" className="block">{t('Contact Us')}</Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
