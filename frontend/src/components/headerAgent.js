'use client'
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaBars, FaTimes, FaChevronUp } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../contexts/TranslationContext';

const Header = () => {
  const { language, isTranslating, switchToLanguage, t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
const [desktopAtTop, setDesktopAtTop] = useState(true);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
 const [isAtTop, setIsAtTop] = useState(true);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSubmenu = (key) => setOpenSubmenu(prev => (prev === key ? null : key));
  const [isVisible, setIsVisible] = useState(true);
    const prevScrollY = useRef(0);
  const handleLanguageSwitch = async (newLanguage) => {
    try {
      await switchToLanguage(newLanguage);
      setIsMenuOpen(false); // close on switch in mobile
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  // Sign out logic: clear localStorage and redirect
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/';
    }
  };
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu on outside click
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
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
              priority
            />
          </Link>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex justify-end items-center ">
          {/* Language Dropdown */}
          <div className="relative group">
            <button
              type="button"
              disabled={isTranslating}
              className="flex items-center font-semibold px-4 h-[63.5px] text-white bg-gray-700 text-[0.9rem] border border-gray-700 hover:bg-gray-300 hover:text-black disabled:opacity-50"
            >
              {isTranslating ? t('Translating...') : (language === 'ar' ? 'عربي' : 'English')}
              <FaChevronDown className="ml-1" />
            </button>
            <div className="absolute left-0 top-full min-w-[120px] bg-gray-950/95 shadow-lg z-40 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all duration-200 py-2 px-2 space-y-1 border-t-4 border-transparent group-hover:border-red-700 font-semibold">
              <button
                onClick={() => handleLanguageSwitch('en')}
                disabled={isTranslating || language === 'en'}
                className="block w-full text-left px-3 py-1 text-white text-[0.9rem] hover:text-[rgb(206,32,39,255)] transition-colors"
              >
                English
              </button>
              <div className="h-px bg-gray-700 my-1 w-full" />
              <button
                onClick={() => handleLanguageSwitch('ar')}
                disabled={isTranslating || language === 'ar'}
                className="block w-full text-left px-3 py-1 text-white text-[0.9rem] hover:text-[rgb(206,32,39,255)] transition-colors"
              >
                عربي
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="bg-[rgb(206,32,39)] text-white px-4 h-[63.5px] text-[0.9rem] font-semibold transition cursor-pointer border border-[rgb(206,32,39)]"
          >
            {t('Sign Out')}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          ref={buttonRef}
          className="md:hidden text-white focus:outline-none p-2"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute md:hidden top-full left-0 right-0 py-4 px-4 space-y-4 shadow-lg bg-black backdrop-blur-sm z-50 border-t-4 border-[rgb(206,32,39,255)]"
          >
            {/* Language Dropdown in Mobile */}
            <div
              onClick={() => toggleSubmenu('language')}
              className="flex justify-between items-center px-2 text-white cursor-pointer border-b border-gray-700 py-2"
            >
              <span>{language === 'ar' ? 'عربي' : 'English'}</span>
              {openSubmenu === 'language' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openSubmenu === 'language' && (
              <div className="bg-gray-700 px-3 py-2 space-y-2">
                <button
                  onClick={() => handleLanguageSwitch('en')}
                  disabled={language === 'en'}
                  className="block w-full text-left text-white disabled:opacity-50"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageSwitch('ar')}
                  disabled={language === 'ar'}
                  className="block w-full text-left text-white disabled:opacity-50"
                >
                  عربي
                </button>
              </div>
            )}

            {/* Sign Out in Mobile */}
            <button
              onClick={handleSignOut}
              className="w-full bg-[rgb(206,32,39)] text-white py-2 text-[0.9rem] font-semibold border border-[rgb(206,32,39)]"
            >
              {t('Sign Out')}
            </button>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
