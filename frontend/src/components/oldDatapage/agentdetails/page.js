'use client';
import Image from 'next/image';
import Footer from '@/components/footer';
import { useState,useRef,useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  FaSearch, FaBars, FaTimes, FaBuilding,
  FaNetworkWired, FaUserTie, FaKey, FaUser,
  FaUsers, FaGlobe, FaHome, FaEnvelope, FaPhone,
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
  FaTwitter, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaChevronDown 
} from "react-icons/fa";
import Link from 'next/link';
export default function AgentProfile() {
   const params = useParams();
   const id = params.id;
   const [agent, setAgent] = useState(null);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
       const [isVisible, setIsVisible] = useState(true);  
       const [isAtTop, setIsAtTop] = useState(true);  
       const prevScrollY = useRef(0);
     
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

   useEffect(() => {
     if (typeof window !== 'undefined') {
       const stored = localStorage.getItem('selectedAgent');
       if (stored) {
         const agentData = JSON.parse(stored);
         if (agentData && agentData._id === id) {
           setAgent(agentData);
         }
       }
     }
   }, [id]);
     
 const property=[
    {
      image: "https://storage.googleapis.com/attachment-listing-prod-5af4/2000043542/listing/30cbbba08226bd44d555e39b/cu4ddknndonc773t63hg.png",
      price: 580000,
      agent: "Aisha Alghamdi",
      type: "Residential",
      beds: 2,
      baths: 1,
      area: 200,
      location: "Hail, Saudi Arabia",
    },
    {
      image: "https://storage.googleapis.com/attachment-listing-prod-5af4/2000043542/listing/46a12c34c40bc918adfe272e/cu940vrpaooc70pb9f4g.png",
      price: 715001,
      agent: "Khaled Alrashid",
      type: "Residential",
      beds: 3,
      baths: 2,
      area: 310,
      location: "Taif, Saudi Arabia",
    },
    
    {
      image: "https://storage.googleapis.com/attachment-listing-prod-5af4/2000043179/listing/e36de373fe8179a94c991478/cudvqtahr9cs770mmdi0.jpeg",
      price: 980000,
      agent: "Badr Alzahrani",
      type: "Residential",
      beds: 4,
      baths: 3,
      area: 370,
      location: "Al Khobar, Saudi Arabia",
    },
 ]
 const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";
  const areaIconUrl = "/area.png";
  if (!agent) {
    return (
      <div className='relative p-6 md:p-8'>
        {/* <Header /> */}
        <div className='text-center text-red-600 py-20'>No agent found.</div>
        <Footer />
      </div>
    );
  }
  return (

   <div>
     <header className={`  
        fixed top-0 w-full z-50  
        flex justify-between items-center px-4 sm:px-6 py-2
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
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link href="/ourCulture" className="text-[0.6rem]  text-white hover:text-gray-300 transition-colors">
            About Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/properties" className="text-[0.6rem] text-white hover:text-gray-300 transition-colors">
            Search
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/franchise" className="text-[0.6rem] text-white hover:text-gray-300 transition-colors">
            Join Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/contactUs" className="text-[0.6rem] text-white hover:text-gray-300 transition-colors">
            Contact Us
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="/contactUs" className="text-[0.6rem] text-white hover:text-gray-300 transition-colors">
            Instant Valuation
          </Link>
          <div className="w-px h-4 bg-gray-300/50"></div>
          <Link href="#" className="text-[0.6rem] text-white hover:text-gray-300 transition-colors">
            عربي
          </Link>
          <Link 
            href="#" 
            className="border border-white px-4 py-1.5 rounded-full text-white hover:bg-white hover:text-black transition-colors text-[0.6rem]"
          >
            Sign In/Register
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
          <div className={`absolute md:hidden top-full left-0 right-0 py-4 px-6 space-y-4 shadow-lg bg-gray-950/95 backdrop-blur-sm`}>
            <Link href="/ourCulture" className="block py-2 text-white hover:text-gray-300 transition-colors">
              About Us
            </Link>
            <Link href="/properties" className="block py-2 text-white hover:text-gray-300 transition-colors">
              Search
            </Link>
            <Link href="/franchise" className="block py-2 text-white hover:text-gray-300 transition-colors">
              Join Us
            </Link>
            <Link href="/contactUs" className="block py-2 text-white hover:text-gray-300 transition-colors">
              Contact Us
            </Link>
            <Link href="/contactUs" className="block py-2 text-white hover:text-gray-300 transition-colors">
              Instant Valuation
            </Link>
            <Link href="#" className="block py-2 text-white hover:text-gray-300 transition-colors">
              عربي
            </Link>
            <Link 
              href="#" 
              className="w-full border border-white px-4 py-2 rounded-full text-white hover:bg-white hover:text-black transition-colors mt-2 inline-block text-center"
            >
              Sign In/Register
            </Link>
          </div>
        )}
      </header>
     <div className="bg-white min-h-screen">
      {/* Header */}
     

      {/* Agent Info */}
      <section className="relative flex justify-center px-4 pt-20">
  {/* Agent Image */}
  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
    <Image
      src="h" // Your image
      alt="Agent"
      width={150}
      height={150}
      className="rounded-full border-4 border-white shadow-lg"
    />
  </div>

  {/* White Info Box */}
  <div className="bg-gray-100 rounded-2xl p-6 w-full max-w-4xl mt-20 pt-16 text-center shadow z-0">
    <div className="text-xl font-semibold tracking-wide md:mt-4 md:mb-10 text-center">
  <div className="inline-block">
    <div className="flex justify-center mt-4">
      <span className="mr-2">ALAA</span>
      <span>MOFTAH</span>
    </div>
    <hr className="mt-2 w-40 md:w-200 mx-auto text-gray-400" />
  </div>
</div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
      <div className="flex justify-center md:justify-center">
        <div>
          <p>KW ID:   2000070266</p>
          <p>City:   Riyadh</p>
          <p>Market Center:   Jeddah</p>
        </div>
      </div>
      <div className="flex justify-center md:justify-end">
        <div>
          <p>+966500600592</p>
          <p>alaa.moftah@kwsaudiarabia.com</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Property Count */}
      
      <div className='mt-8'> 
          <span className=" text-[0.8rem] font-sm mx-4 md:mx-30">PROPERTY COUNT : 7</span>
      </div>
   

      {/* Agent Listings Heading */}
      <div className="text-center text-3xl font-medium py-6">
        AGENT LISTINGS
      </div>
        <div className="min-h-screen p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.map((prop, idx) => (
        <div key={idx} className="bg-gray-100 rounded-3xl overflow-hidden w-full">
          <div className="relative w-full h-60">
            <Link href={`/properties/propertyDetails`} passHref>
             
                <Image
                  src={prop.image}
                  alt="property"
                  fill
                  className="object-cover rounded-3xl cursor-pointer hover:opacity-90 transition-opacity"
                />
           
            </Link>
          
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <span className="relative w-5 h-5">
                            <Image src='/currency.png' alt="currency" fill className="object-cover rounded-3xl" />
                          </span>
                          {prop.price.toLocaleString()}
                        </h2>
                        <p className="text-sm">{prop.agent}</p>
                      </div>
      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm mb-2">
                          <span className="flex items-center gap-2 mr-4">
                            <span className="relative w-6 h-6">
                              <Image src={bathIconUrl} alt="bath" fill className="object-contain" />
                            </span>
                            {prop.baths}
                          </span>
                          <span className="flex items-center gap-2 mr-4">
                            <span className="relative w-6 h-6">
                              <Image src={bedIconUrl} alt="bed" fill className="object-contain" />
                            </span>
                            {prop.beds}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="relative w-6 h-6">
                              <Image src={areaIconUrl} alt="area" fill className="object-contain" />
                            </span>
                            {prop.area}
                          </span>
                        </div>
                        <p className="text-[0.7rem] mb-2">{prop.type}</p>
                      </div>
      
                      <p className="text-xs">{prop.location}</p>
                      <button className="mt-10 w-full bg-black text-white py-2 rounded-full text-sm hover:bg-red-700 transition">
                        View Property Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      
            <div className="flex justify-center items-center">
              <button className="w-3/6 py-2 px-8 bg-red-700 hover:bg-red-950 text-white font-normal rounded-full transition">
                View More Properties..
              </button>
            </div>
            <div className='mt-4'>
                    {/* Title Banner */}
                    <div className="bg-red-700 flex justify-center relative">
                      <div className="relative h-14">
                        {/* KW Logo */}
                        <Image
                          src="/kwlinelogo.png"
                          alt="KW Logo"
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                       
                      </div>
                    </div>
                     </div>
                      <hr className="w-6/12 mx-auto bg-red-500 h-[1.5px] mt-5 md:mt-10 mb-16" />
            <Footer></Footer>
    </div>
   </div>
  );
}
