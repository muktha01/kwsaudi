'use client'
import React, { useState, useEffect, useRef } from "react";
import { 
  FaSearch, FaBars, FaTimes, FaBuilding,
  FaNetworkWired, FaUserTie, FaKey, FaUser,
  FaUsers, FaGlobe, FaHome, FaEnvelope, FaPhone,
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
  FaTwitter, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaChevronDown 
} from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronUp } from 'react-icons/fa';
const Header = () => {
  // const [isMenuOpens, setIsMenuOpens] = useState(false);
  const [isVisible, setIsVisible] = useState(true);  
  const [isAtTop, setIsAtTop] = useState(true);  
  const prevScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // simulate toggle
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (key) => {
    setOpenSubmenu(prev => (prev === key ? null : key));
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {  
    const handleScroll = () => {  
      const currentScrollY = window.scrollY;  

      // At the very top  
      if (currentScrollY < 10) {  
        setIsAtTop(true);  
        setIsVisible(true);  
        return;  
      } else {  
        setIsAtTop(false);  
      }  

      // Scrolling down → Hide header  
      if (currentScrollY > prevScrollY.current) {  
        setIsVisible(false);  
      }  
      // Scrolling up → Show header  
      else {  
        setIsVisible(true);  
      }  

      prevScrollY.current = currentScrollY;  
    };  

    window.addEventListener('scroll', handleScroll, { passive: true });  
    return () => window.removeEventListener('scroll', handleScroll);  
  }, []);
  const menuItems = [
    { label: 'PROPERTIES', key: 'properties',  submenu: [
      { label: 'ACTIVE', href: '/properties/active' },
      { label: 'SOLD', href: '/properties/sold' },
      { label: 'RENT', href: '/properties/rent' },
      { label: 'AUCTION', href: '/properties/auction' },
      { label: 'INTERNATIONAL', href: 'https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721' }
    ]},
    { label: 'MARKET CENTER', key: 'market', submenu: [
      { label: 'ALL MC', href: '/marketCenter' },
      { label: 'JASMINE', href: '/riyadh' },
      { label: 'JEDDAH', href: '/jeddah' }
    ] },
    { label: 'BUYER', key: 'buyer', submenu: [
      { label: 'SEARCH PROPERTY', href: '/properties' },
      { label: 'AUCTION', href: '/properties/auction' },
      { label: 'NEW DEVELOPMENT', href: '/properties/newdevelopment' },
      { label: 'BUYING GUIDE', href: '/buyer/buyerguid' }
    ]},
    { label: 'TENANT', key: 'tenant', submenu: [
      { label: 'RENT SEARCH', href: '/properties/rent' },
      { label: 'TENANT GUIDE', href: '/tenant' }
    ] },
    { label: 'SELLER', key: 'seller',  submenu: [
      { label: 'SEARCH AGENT', href: '/agent' },
      { label: 'FIVE STEPS TO SELL', href: '/seller' },
      { label: 'SELLER GUIDE', href: 'seller/sellerguid' }
    ]},
    { label: 'OUR CULTURE', key: 'culture', submenu: [
      { label: 'OUR PROMISE', href: '/ourpromise' },
      { label: 'ABOUT US', href: '/ourCulture' },
      { label: 'WHY KW', href: '/ourCulture/whyKW' },
      { label: 'KW TRAINING', href: '/culture/training' },
      { label: 'KW TECHNOLOGY', href: '/ourCulture/kwuniversity"' }
    ] },
    { label: 'FRANCHISE', key: 'franchise',href: '/franchise'   },
    { label: 'LOGIN', key: 'login',href: '/franchise' },
    { label: 'CONTACT US', key: 'contact',href: '/contactUs' },
    { label: 'JOIN US', key: 'join' ,href: '/joinus'},
    { label: 'INSTANT VALUATION', key: 'valuation',href: '/instantvaluation' },
    { label: 'TERMS & POLICY', key: 'terms',href: '#' },
  ];

  return (
    <div className="relative">
      {/* Navbar */}
      <header className={`  
        fixed top-0 w-full z-50  
        flex justify-between items-center px-4 sm:px-6 py-4
        transition-all duration-300 ease-in-out  
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}  
      
         ${isAtTop && !isMenuOpen ? 'bg-transparent' : 'bg-gray-950/90 backdrop-blur-sm'}  
      `}>
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image 
              src="/kwlogohome.png" 
              alt="KW Saudi Arabia Logo" 
              width={279}
              height={63}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 tracking-wider">
          <Link href="/aboutus" className="text-[0.8rem]  text-white hover:text-gray-300 transition-colors">
            About Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/properties" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
            Search
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/joinus" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
            Join Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/contactUs" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
            Contact Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/instantvaluation" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
            Instant Valuation
          </Link>
        
          <Link href="#" className="text-[0.8rem] ml-4 mr-8 text-white hover:text-gray-300 transition-colors">
            عربي
          </Link>
          <Link 
            href="#" 
            className="border border-white px-4 py-1.5 rounded-full text-white hover:bg-white hover:text-black transition-colors text-[0.8rem]"
          >
            Agent Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none p-2" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <FaTimes size={20} className="text-white" />
          ) : (
            <FaBars size={20} className="text-white" />
          )}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          
        <div className="absolute md:hidden top-full ml-10 left-0 right-0 py-4  px-6 space-y-4 shadow-lg bg-gray-950/90 backdrop-blur-sm z-50">
          {menuItems.map(item => (
            <div key={item.key}>
              {item.submenu ? (
                <div
                  onClick={() => toggleSubmenu(item.key)}
                  className="flex justify-between items-center text-white hover:text-gray-300 transition-colors cursor-pointer py-1"
                >
                  <span
                    className={
                      openSubmenu === item.key
                        ? (["JOIN US", "CONTACT US"].includes(item.label)
                          ? 'text-[rgb(206,32,39,255)] font-semibold underline'
                          : 'text-[rgb(206,32,39,255)] font-semibold underline')
                        : ["JOIN US", "CONTACT US"].includes(item.label)
                        ? 'text-[rgb(206,32,39,255)] font-semibold'
                        : 'text-white'
                    }
                  >
                    {item.label}
                  </span>
                  {item.submenu && (
                    openSubmenu === item.key ? (
                      <FaChevronUp size={14} className="text-white" />
                    ) : (
                      <FaChevronDown size={14} className="text-[rgb(206,32,39,255)]" />
                    )
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`block py-1 font-semibold transition-colors ${["JOIN US", "CONTACT US"].includes(item.label) ? 'text-[rgb(206,32,39,255)] hover:text-[rgb(206,32,39,255)]' : 'text-white hover:text-[rgb(206,32,39,255)]'}`}
                >
                  {item.label}
                </Link>
              )}
              {/* Submenu */}
              {item.submenu && openSubmenu === item.key && (
                <div className="mt-1 space-y-3 text-base text-gray-300">
                  {item.submenu.map(sub => (
                    <Link href={sub.href} key={sub.href} className="block hover:text-white">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </header>
    </div>
  );
}

export default Header;