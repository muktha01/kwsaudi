'use client'
import React, { use } from 'react';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { useState,useEffect,useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FaChevronUp } from 'react-icons/fa';
import { 
    FaSearch, FaBars, FaTimes, FaBuilding,
    FaNetworkWired, FaUserTie, FaKey, FaUser,
    FaUsers, FaGlobe, FaHome, FaEnvelope, FaPhone,
    FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
    FaTwitter, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaChevronDown 
  } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/footer';
import {  User } from 'lucide-react';
const AgentProfile = () => {   
  const [isVisible, setIsVisible] = useState(true);  
  const [isAtTop, setIsAtTop] = useState(true);  
  const prevScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // simulate toggle
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Read selected agent data from localStorage on component mount
  useEffect(() => {
    const agentData = localStorage.getItem('selectedAgent');
    if (agentData) {
      try {
        const agent = JSON.parse(agentData);
        setSelectedAgent(agent);
      } catch (error) {
        console.error('Error parsing agent data:', error);
      }
    }
  }, []);

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
const[expanded,setExpanded]=useState(false);
   const handleToggle=()=>{
   setExpanded(prev => !prev);
   }
  return (
   <div className='min-h-screen '>
     <header className={`  
        fixed top-0 w-full z-50  
        flex justify-between items-center px-4 sm:px-6 py-4
        transition-all duration-300 ease-in-out  
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}  
        ${isAtTop ? 'bg-gray-950/90 backdrop-blur-sm' : 'bg-gray-950/90 backdrop-blur-sm'}  
      `}>
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image 
              src="https://static.wixstatic.com/media/36a881_0cd959d32d904bd7be76303fb23dec0a~mv2.png/v1/fill/w_279,h_63,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design.png" 
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
          <Link href="/ourCulture" className="text-[0.8rem]  text-white hover:text-gray-300 transition-colors">
            About Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/properties" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
            Search
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/franchise" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
            Join Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/contactUs" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
            Contact Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/contactUs" className="text-[0.8rem] text-white hover:text-gray-300 transition-colors">
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
      <div className='mt-16 lg:mt-70 bg-[#f5f6f8]'>
    <div className="flex justify-center items-center min-h-full mt-20 lg:mt-40 bg-[#f5f6f8] px-4">
      <div className="bg-white rounded-2xl shadow max-w-full w-full overflow-hidden lg:max-w-full lg:mx-50 border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start p-6 lg:p-2 gap-8">
          {/* Agent Image - Mobile: centered, Desktop: original position */}
          <div className="flex flex-col items-center lg:absolute lg:top-50 lg:left-1/3 lg:transform lg:-translate-x-1/2 z-10 w-full lg:w-auto">
          <Image
  src={selectedAgent?.image || "/default-avatar.png"}  // Add fallback image if needed
  alt={selectedAgent?.name || "Agent"}
  width={200}
  height={200}
  className="w-[200px] h-[200px] rounded-full object-cover"
/>



       
            <div className="mt-4 lg:mt-6 lg:ml-0">
              <button className="px-6 md:py-4 py-2 mt-4 md:mt-6 font-semibold text-sm md:text-lg bg-[#2e2e41] text-white rounded-full hover:bg-black transition">
                Connect with Me
              </button>
            </div>
          </div>
          
          {/* Agent Info */}
          <div className="flex-1 space-y-2 lg:ml-40 w-full lg:w-auto  md:items-center lg:text-center mt-4 lg:mt-4">
            <h2 className="text-2xl lg:text-4xl font-semibold text-gray-800 md:ml-0 ml-20">{selectedAgent?.name || "Agent Name"}</h2>
            <p className="text-lg md:ml-0 ml-6">Keller Williams Saudi Arabia</p>

            <div className="flex items-center text-base font-normal justify-center lg:justify-right gap-2">
              <MapPin size={16} className='mt-1'/> {selectedAgent?.city || "City"} 
              <span className="mx-1"></span> 
              <FaGlobe size={14} className="mt-1" /> English
            </div>

            <div className="mt-4 space-y-2 text-base">
              <div className="flex font-normal items-start justify-center lg:justify-right text-blue-600 gap-2">
                <Phone size={18} className='text-black' />
                <a href={`tel:${selectedAgent?.phone || ""}`}>{selectedAgent?.phone || "Phone Number"}</a>
              </div>

              <div className="flex font-normal items-center justify-center lg:justify-right text-blue-600 gap-2">
                <Mail size={18} className='text-black'/>
                <a href={`mailto:${selectedAgent?.email || ""}`}>{selectedAgent?.email || "Email"}</a>
              </div>

              <div className="flex font-normal items-center justify-center lg:justify-right text-blue-600 gap-2">
                <FaGlobe size={18} className='text-black'/>
                <a href="https://sandihill.kw.com" target="_blank" rel="noreferrer">
                  https://sandihill.kw.com
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex items-center py-6 lg:py-10 justify-center lg:justify-right text-gray-600 gap-8">
                <i className="fab fa-youtube"></i>
                <i className="fab fa-facebook"></i>
                <i className="fab fa-linkedin"></i>
                <i className="fab fa-instagram"></i>
              </div>
            </div>
          </div>
        </div>
       
        {/* Footer License Note */}
        <div className="text-xs text-gray-500 bg-gray-100 text-center lg:text-left px-4 lg:px-20 py-4">
          License #: 0740430 - TX / Director of Operations at SWR Group @ Keller Williams® | REALTOR® at SWR Group | Two Hills Realty Team
        </div>
      </div>
    </div>
    
    <div className="w-full text-center py-5 text-gray-400 md:text-sm text-xs">
      Each Keller Williams® office is independently owned and operated
    </div>
    
    <div className="w-full flex flex-col items-center justify-center mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">About Me</h2>
      <div className="px-4 lg:px-80 py-6 text-gray-700 text-base">
      <p className="text-start whitespace-pre-line">
  Sandi Hill is a dedicated and experienced realtor serving the vibrant North Texas region. With a rich background in education, Sandi brings a unique perspective and exceptional communication skills to the real estate market. Her genuine passion for helping people, combined with her extensive knowledge of the local area, make her a trusted advisor and advocate for her clients.

  {'\n\n'}
  Before embarking on her successful career in real estate, Sandi spent over two decades as an esteemed teacher. Her years of teaching have honed her ability to listen attentively, understand individual needs, and effectively communicate with people from all walks of life. Sandi&apos;s clients appreciate her patient and thorough approach, as she takes the time to guide them through every step of the real estate process, ensuring their peace of mind and satisfaction.
</p>

        {expanded && (
          <p className="mt-4 text-start whitespace-pre-line">
          Sandi possesses a deep understanding of the North Texas market, including its diverse neighborhoods, schools, amenities, and unique offerings. Whether clients are looking to buy their dream home, sell a property, or invest in real estate, Sandi&apos;s market expertise allows her to provide invaluable insights and assist them in making informed decisions. She leverages her vast network and stays up-to-date with market trends, ensuring her clients have a competitive edge in this dynamic industry.
        
          {'\n\n'}
          Beyond her professional endeavors, Sandi finds joy in spending time with her loving family, including her husband Keith who has joined her in Real Estate. Despite her demanding schedule, she values quality time with her loved ones and cherishes the moments shared with family and friends. Sandi and Keith&apos;s home is always filled with warmth and laughter, creating a welcoming environment for everyone they encounter.
        
          {'\n\n'}
          Sandi&apos;s commitment to excellence extends beyond her real estate practice. She actively contributes to her local community, participating in charitable initiatives and organizations that uplift and support others. Her dedication to making a positive impact is evident in all aspects of her life.
        
          {'\n\n'}
          If you are seeking a knowledgeable, trustworthy, and personable realtor in North Texas, Sandi Hill is the ideal choice. She will go above and beyond to ensure your real estate goals are achieved, providing a seamless and rewarding experience every step of the way. Contact Sandi today to embark on your real estate journey with a reliable and dedicated professional by your side.
        </p>
        
        )}

        {/* Toggle Button with Icon */}
        <div className="mt-4 flex items-center gap-1 text-gray-800 cursor-pointer w-fit" onClick={handleToggle}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />} 
          <span>{expanded ? 'See Less' : 'See More'}</span>
        </div>
      </div>
      
      <h1 className='text-2xl font-bold'>My Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-56 text-base py-10 text-gray-700">
        <div className="flex justify-center lg:justify-center">
          <div>
            <p className='font-semibold'>LANGUAGES</p>
            <p>English</p>
            <p className='font-semibold mt-8'>SPECIALITIES AND DESIGNATIONS</p>
            <p>ABR, SRS, PSA, RENE</p>
          </div>
        </div>
        <div className="flex justify-left lg:justify-center">
          <div>
            <p className='font-semibold'>MARKET CENTER</p>
            <p>Keller Williams Frisco Stars</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col lg:flex-row px-4 lg:px-20 bg-white gap-6 lg:gap-10 min-h-[400px]">
      {/* Left Column */}
      <div className="lg:w-1/2 flex flex-col justify-between space-y-8 lg:ml-20 my-15 h-full">
        {/* Logo */}
        <Image
  src="/agentdetail.png"
  alt="KW Frisco Stars Logo"
  width={360}
  height={64}
  className="w-[220px] h-[40px] md:w-[360px] md:h-[64px] object-contain"
/>



        {/* Office Info */}
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MapPin size={18} /> Keller Williams Frisco Stars
          </h3>
          <p className='ml-6 pt-2'>4783 Preston Road, Ste. 100</p>
          <p className='ml-6'>Frisco, TX 75034</p>
          <p className="mt-2 flex items-center gap-2 text-sm ml-6 text-gray-600">
            <Phone size={16} /> Office (972) 712-9898
          </p>
        </div>

        <hr className='w-80' />

        {/* Agent Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xl text-gray-800 font-semibold">
            <User size={18} /> {selectedAgent?.name || "Agent Name"}
          </div>
          <p className="ml-6">
            REALTOR® at Keller Williams Saudi Arabia
          </p>
          <p className="text-xs ml-6 text-gray-500">License Number</p>
          <p className="flex items-center gap-2 ml-6 text-sm">
            <Phone size={16} /> Mobile {selectedAgent?.phone || "Phone Number"}
          </p>
          <p className="flex items-center gap-2 ml-6 text-sm">
            <Mail size={16} /> {selectedAgent?.email || "Email"}
          </p>

          {/* Social Icons */}
          <div className="flex gap-8 mt-4 ml-6 text-black text-sm">
            <i className="fab fa-youtube"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-linkedin"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>
      </div>

      {/* Right Column (Map) - Maintains exact size on all screens */}
      <div className="hidden md:flex md:w-1/2  h-full">
      <iframe
  title="Keller Williams Frisco Stars Map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.0579185741346!2d-96.806298!3d33.118425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c3d31354b472d%3A0x9e7e2e6c6b47960!2sFrisco%2C%20TX!5e0!3m2!1sen!2sus!4v1684094319273!5m2!1sen!2sus"
  className="w-full h-full min-h-[580px]"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

      </div>
    </div>
</div>
    <Footer></Footer>
   </div>
  );
};

export default AgentProfile;
