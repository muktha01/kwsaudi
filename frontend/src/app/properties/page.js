'use client'
import React from 'react';
import Image from 'next/image';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { ArrowRight } from 'lucide-react';
import { useState,useRef,useEffect,useMemo } from 'react';
import { FaChevronUp,FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { FaSearch, FaCheckCircle,FaBars, FaGavel, FaTimes,FaStar, FaGlobeAmericas, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
const Properties = () => {
  // Create refs and drag state for each carousel
  const residentialScrollRef = useRef(null);
  const commercialScrollRef = useRef(null);
  const soldScrollRef = useRef(null);
  const rentalScrollRef = useRef(null);
  const auctionScrollRef = useRef(null);
  const newDevScrollRef = useRef(null);
  const internationalScrollRef = useRef(null);

  // Drag state for each carousel
  const [dragState, setDragState] = useState({
    residential: { isDragging: false, startX: 0, scrollLeft: 0 },
    commercial: { isDragging: false, startX: 0, scrollLeft: 0 },
    sold: { isDragging: false, startX: 0, scrollLeft: 0 },
    rental: { isDragging: false, startX: 0, scrollLeft: 0 },
    auction: { isDragging: false, startX: 0, scrollLeft: 0 },
    newDev: { isDragging: false, startX: 0, scrollLeft: 0 },
    international: { isDragging: false, startX: 0, scrollLeft: 0 },
  });

  // Helper to get ref and state key for each carousel
  const getCarouselConfig = (key) => {
    switch (key) {
      case 'residential': return { ref: residentialScrollRef, stateKey: 'residential' };
      case 'commercial': return { ref: commercialScrollRef, stateKey: 'commercial' };
      case 'sold': return { ref: soldScrollRef, stateKey: 'sold' };
      case 'rental': return { ref: rentalScrollRef, stateKey: 'rental' };
      case 'auction': return { ref: auctionScrollRef, stateKey: 'auction' };
      case 'newDev': return { ref: newDevScrollRef, stateKey: 'newDev' };
      case 'international': return { ref: internationalScrollRef, stateKey: 'international' };
      default: return { ref: null, stateKey: '' };
    }
  };

  // Drag handlers for each carousel
  const handleMouseDown = (key) => (e) => {
    const { ref, stateKey } = getCarouselConfig(key);
    setDragState((prev) => ({
      ...prev,
      [stateKey]: {
        ...prev[stateKey],
        isDragging: true,
        startX: e.pageX - ref.current.offsetLeft,
        scrollLeft: ref.current.scrollLeft,
      },
    }));
  };

  const handleMouseLeave = (key) => () => {
    const { stateKey } = getCarouselConfig(key);
    setDragState((prev) => ({
      ...prev,
      [stateKey]: { ...prev[stateKey], isDragging: false },
    }));
  };

  const handleMouseUp = (key) => () => {
    const { stateKey } = getCarouselConfig(key);
    setDragState((prev) => ({
      ...prev,
      [stateKey]: { ...prev[stateKey], isDragging: false },
    }));
  };

  const handleMouseMove = (key) => (e) => {
    const { ref, stateKey } = getCarouselConfig(key);
    if (!dragState[stateKey].isDragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - dragState[stateKey].startX) * 1;
    ref.current.scrollLeft = dragState[stateKey].scrollLeft - walk;
  };

  // Dynamic property types state
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState(null);

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      setLoadingListings(true);
      setListingsError(null);
      try {
        const res = await fetch('http://localhost:5001/api/listings/list/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            limit: 2000,
            
            page: 1,

          })
        });
        const data = await res.json();
        console.log(data);
        
        let fetched = [];
        if (Array.isArray(data?.data)) {
          fetched = data.data;
        }
        setListings(fetched);
      } catch (err) {
        setListingsError('Failed to load listings');
      } finally {
        setLoadingListings(false);
      }
    }
    fetchListings();
  }, []);

  // Show scroll button state for each carousel
  const [showScrollButton, setShowScrollButton] = useState({
    residential: false,
    commercial: false,
    sold: false,
    rental: false,
    auction: false,
    newDev: false,
    international: false,
  });

  const [showBackButton, setShowBackButton] = useState({ residential: false, commercial: false });

  // Check overflow for each carousel
  useEffect(() => {
    const el = residentialScrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton((prev) => ({ ...prev, residential: true }));
      } else {
        setShowScrollButton((prev) => ({ ...prev, residential: false }));
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listings]);

  useEffect(() => {
    const el = commercialScrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton((prev) => ({ ...prev, commercial: true }));
      } else {
        setShowScrollButton((prev) => ({ ...prev, commercial: false }));
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listings]);

  useEffect(() => {
    const el = soldScrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton((prev) => ({ ...prev, sold: true }));
      } else {
        setShowScrollButton((prev) => ({ ...prev, sold: false }));
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listings]);

  useEffect(() => {
    const el = rentalScrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton((prev) => ({ ...prev, rental: true }));
      } else {
        setShowScrollButton((prev) => ({ ...prev, rental: false }));
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listings]);

  useEffect(() => {
    const el = auctionScrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton((prev) => ({ ...prev, auction: true }));
      } else {
        setShowScrollButton((prev) => ({ ...prev, auction: false }));
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listings]);

  useEffect(() => {
    const el = newDevScrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton((prev) => ({ ...prev, newDev: true }));
      } else {
        setShowScrollButton((prev) => ({ ...prev, newDev: false }));
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listings]);

  useEffect(() => {
    const el = internationalScrollRef.current;
    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton((prev) => ({ ...prev, international: true }));
      } else {
        setShowScrollButton((prev) => ({ ...prev, international: false }));
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [listings]);

  // Generic scroll function for each carousel
  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = residentialScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowBackButton(prev => ({
        ...prev,
        residential: el.scrollLeft > 0
      }));
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [listings]);

  useEffect(() => {
    const el = commercialScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowBackButton(prev => ({
        ...prev,
        commercial: el.scrollLeft > 0
      }));
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [listings]);

  const handleScrollSold = () => {
    const el = soldScrollRef.current;
    setShowBackButton(prev => ({
      ...prev,
      sold: el && el.scrollLeft > 0
    }));
  };

  useEffect(() => {
    const el = soldScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScrollSold);
    handleScrollSold();
    return () => el.removeEventListener("scroll", handleScrollSold);
  }, [listings]);

  const handleScrollRental = () => {
    const el = rentalScrollRef.current;
    setShowBackButton(prev => ({
      ...prev,
      rental: el && el.scrollLeft > 0
    }));
  };

  useEffect(() => {
    const el = rentalScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScrollRental);
    handleScrollRental();
    return () => el.removeEventListener("scroll", handleScrollRental);
  }, [listings]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
       const [isVisible, setIsVisible] = useState(true);  
       const [isAtTop, setIsAtTop] = useState(true);  
       const prevScrollY = useRef(0);
      
   
 
 
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
     
  // const categories = [
  //   {
  //     image:'/residential.png',
  //     title: 'Residential',
  //     subtitle: 'Active Properties',
  //     href: '/residential'
  //   },
  //   {
  //     image:'/commercial.png',
  //     title: 'Commercial',
  //     subtitle: 'Active Properties',
  //     href: '/commercial'
  //   },
  //   {
  //     image:'/sold3.png',
  //     title: 'Sold',
  //     subtitle: 'Properties',
  //     href: '/sold'
  //   },
  //   {
  //     image:'/rental.png',
  //     title: 'Rental',
  //     subtitle: 'Properties',
  //     href: '/rental'
  //   },
  //   {
  //     image:'/auction.png',
  //     title: 'Auction',
  //     subtitle: 'Properties',
  //     href: '/auction'
  //   },
  //   {
  //     image:'/newdevelopment.png',
  //     title: 'New',
  //     subtitle: 'Development',
  //     href: '/new-development'
  //   },
  //   {
  //     image:'/international.png',
  //     title: 'International',
  //     subtitle: 'Properties',
  //     href: '/international'
  //   }
  // ];

  // Add refs for each property section
  const residentialRef = useRef(null);
  const soldRef = useRef(null);
  const CommercialRef = useRef(null);
  const rentalRef = useRef(null);
  const auctionRef = useRef(null);
  const newDevRef = useRef(null);
  const internationalRef = useRef(null);

  // Map categories to refs (order must match grid order)
  const sectionRefs = [
    residentialRef, // Residential
    CommercialRef,           // Commercial (no section)
    soldRef,        // Sold
    rentalRef,      // Rental
    auctionRef,     // Auction
    newDevRef,      // New Development
    internationalRef // International
  ];

  useEffect(() => {
    // Fetch property types from API
    async function fetchPropertyTypes() {
      setLoadingTypes(true);
      setTypesError(null);
      try {
        const res = await fetch('http://localhost:5001/api/listings/list/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            limit: 2000,
           
            page: 1,
           
          })
        });
        const data = await res.json();
        let listings = [];
        if (Array.isArray(data?.data)) {
          listings = data.data;
        }
        const types = Array.from(new Set(listings.map(item => item.propertyType || item.prop_type).filter(Boolean)));
        setPropertyTypes(types);
      } catch (err) {
        setTypesError('Failed to load property types');
      } finally {
        setLoadingTypes(false);
      }
    }
    fetchPropertyTypes();
  }, []);

  const router = useRouter();

  const handleScrollAuction = () => {
    const el = auctionScrollRef.current;
    setShowBackButton(prev => ({
      ...prev,
      auction: el && el.scrollLeft > 0
    }));
  };

  const handleScrollDev = () => {
    const el = newDevScrollRef.current;
    setShowBackButton(prev => ({
      ...prev,
      newDev: el && el.scrollLeft > 0
    }));
  };

  const handleScrollInternatinal = () => {
    const el = internationalScrollRef.current;
    setShowBackButton(prev => ({
      ...prev,
      international: el && el.scrollLeft > 0
    }));
  };

  useEffect(() => {
    const el = auctionScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScrollAuction);
    handleScrollAuction();
    return () => el.removeEventListener("scroll", handleScrollAuction);
  }, [listings]);

  useEffect(() => {
    const el = newDevScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScrollDev);
    handleScrollDev();
    return () => el.removeEventListener("scroll", handleScrollDev);
  }, [listings]);

  useEffect(() => {
    const el = internationalScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScrollInternatinal);
    handleScrollInternatinal();
    return () => el.removeEventListener("scroll", handleScrollInternatinal);
  }, [listings]);

  // Helper function to format numbers with commas
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  };

  return (
    <div className="relative p-6 md:p-8 ">
      <Header></Header>
      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

{/* Hero Section */}
<div className="relative min-h-[74vh] md:min-h-screen flex items-center justify-center bg-gray-100">
<section className="relative w-full h-[74vh] md:h-screen flex items-center justify-center " >
  <main className="max-w-full mx-auto px-4 w-full flex flex-col items-center justify-center">
    {/* Icon and Title */}
    <div className="text-center flex flex-col items-center justify-center">
      <div className="mx-auto flex justify-center items-center md:mb-4 mb-2 relative w-15 h-15 md:w-[90px] md:h-[90px] ">
        <Image 
          src="/property.jpg" 
          alt="property" 
          fill 
          className="object-cover rounded-full "
        />
      </div>
      <h1 className="text-3xl mx-10 md:text-2xl md:tracking-[0.2em] tracking-[0.1em] font-normal mb-4">Properties In Saudi Arabia</h1>
      <p className="text-[0.8rem] md:text-[0.9rem] md:tracking-[0.1em] text-gray-600 max-w-full mx-auto px-4">
        Looking For A New Home And Not Sure Which Neighborhood Suits You? Explore Everything You 
      </p>
      <p className="text-[0.8rem] md:text-[0.9rem] md:tracking-[0.1em] text-gray-600 max-w-full mx-auto px-4">
        Need To Know About The Communities In Doha. View Nearby Locations, Landmarks, Reviews, 
      </p>
      <p className="text-[0.8rem] md:text-[0.9rem] md:tracking-[0.1em] text-gray-600 max-w-full mx-auto px-4">
        Prices, FAQ&rsquo;s, And More.
      </p>
    </div>
    {/* Search Section */}
    <div className="max-w-[920px] mx-auto mt-10 w-full flex flex-col items-center justify-center">
      {/* Laptop View (unchanged) */}
      <div className="hidden md:flex flex-row w-full shadow-md overflow-hidden rounded-full border bg-white">
        {/* Search Input */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="City, Area or Building"
            className="w-full pl-12 pr-4 py-3 text-sm md:text-base text-gray-800 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="md:w-48 w-20 border-l border-gray-400 flex items-center">
          <select className="w-full py-3 px-4 text-sm md:text-base bg-white text-gray-700 focus:outline-none focus:ring-0">
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
          </select>
        </div>
        {/* Search Button */}
        <button className="bg-[rgb(206,32,39,255)] text-white px-12 py-3 text-sm md:text-base font-medium border-none outline-none">
          Search
        </button>
      </div>
      {/* Mobile View (search input and dropdown in one group, button below) remains unchanged */}
      <div className="md:hidden flex flex-col gap-2 mx-4 w-full items-center justify-center">
        <div className="flex w-full max-w-md mx-auto">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="City, Area or Building"
              className="w-full pl-10 pr-2 py-2 text-[0.8rem] md:text-sm border border-gray-500 rounded-l-lg focus:outline-none focus:ring-0"
            />
          </div>
          {/* Property Type Dropdown */}
          <select className="w-32 py-2 px-2 text-sm border border-gray-500 border-l-0 rounded-r-lg focus:outline-none focus:ring-0">
            <option value="">Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
          </select>
        </div>
        {/* Search Button (full width below) */}
        <button className="bg-[rgb(206,32,39,255)] text-white justify-center items-center font-semibold w-30 py-2 text-xs rounded-full mt-1 focus:outline-none focus:ring-0 block mx-auto">
          Search
        </button>
      </div>
    </div>
  </main>
</section>
</div>

        {/* Property Categories */}
        {/* Mobile: horizontal scroll for first 4, rest centered below */}
        {/* <div className="md:hidden">
          <div className="flex overflow-x-auto gap-4 pb-2 mx-1 mt-2">
            {categories.slice(0, 4).map((category, index) => (
              <button
                key={index}
                type="button"
                className="flex-shrink-0 focus:outline-none"
                onClick={() => {
                  const ref = sectionRefs[index];
                  if (ref && ref.current) {
                    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: 'auto' }}
              >
                <div className="flex flex-col items-center p-2 rounded-lg text-center bg-white">
                  <Image 
                    src={category.image} 
                    alt={category.title + ' icon'} 
                    width={48} 
                    height={48} 
                    className="object-contain w-8 h-8" 
                  />
                  <p className="text-[0.5rem] text-gray-700 mt-1">{category.title}</p>
                  <p className="text-[0.5rem] text-gray-700">{category.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categories.slice(4).map((category, index) => (
              <button
                key={index + 4}
                type="button"
                className="focus:outline-none"
                onClick={() => {
                  const ref = sectionRefs[index + 4];
                  if (ref && ref.current) {
                    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: 'auto' }}
              >
                <div className="flex flex-col items-center p-2 rounded-lg text-center bg-white">
                  <Image 
                    src={category.image} 
                    alt={category.title + ' icon'} 
                    width={48} 
                    height={48} 
                    className="object-contain w-8 h-8" 
                  />
                  <p className="text-[0.5rem] text-gray-700 mt-1">{category.title}</p>
                  <p className="text-[0.5rem] text-gray-700">{category.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div> */}
        {/* Desktop: grid layout */}
        {/* <div className="hidden md:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 max-w-full mx-12">
          {categories.map((category, index) => (
            <button
              key={index}
              type="button"
              className="group focus:outline-none"
              onClick={() => {
                const ref = sectionRefs[index];
                if (ref && ref.current) {
                  ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: '100%' }}
            >
              <div className="flex flex-col items-center p-0 rounded-lg text-center ">
                <div className="mb-2">
                  <Image 
                    src={category.image} 
                    alt={category.title + ' icon'} 
                    width={48} 
                    height={48} 
                    className="object-contain w-12 h-12" 
                  />
                </div>
                <p className="text-base text-gray-500 mb-1">{category.title}</p>
                <p className="text-base text-gray-500">{category.subtitle}</p>
              </div>
            </button>
          ))}
        </div> */}
        {/* <div className="flex justify-center items-center md:my-22 my-4 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-8">
  <hr className="md:w-140 w-50 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px]" />
</div> */}
        {/* New Property Cards Section */}
        <div ref={residentialRef} className="md:mt-10 mt-10 md:mx-12 scroll-mt-24">
  <div className="flex items-center justify-between md:mx-10 flex-wrap gap-4">
    <p className="flex items-center text-xl md:text-3xl font-normal"> 
      <Image
        src="/residential.png"
        alt="Residential"
        width={40}
        height={40}
        className="w-8 h-8 md:w-16 md:h-16 mr-5"></Image>
      <span className="text-gray-500 ">Residential Active Properties</span>
    </p>

    {/* Right: Button */}
    <Link href="/properties/active">
    <button className="hidden md:flex text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-2 rounded-lg hover:bg-red-950 transition">
      Click Here To View All Residential Properties
    </button>
    </Link>
    </div>
    


          {/* First Home Block */}
          <div className="mb-2 md:mb-10">
           {/* First Home Block */}
      <div className="relative w-full px-5 md:px-10 md:py-10 py-5 bg-white">
        {/* Backward Button */}
        {showBackButton.residential && !loadingListings && listings.length > 0 && (
          <button
            onClick={() => scrollLeft(residentialScrollRef)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 \
                   bg-white border border-gray-300 rounded-full p-2 md:p-4 \
                   shadow-md z-10 hover:shadow-lg transition"
          >
            <FaChevronLeft 
              className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
            />
          </button>
        )}
    {loadingListings ? (
      <div className="text-center text-gray-500 py-10">Loading listings...</div>
    ) : listingsError ? (
      <div className="text-center text-red-500 py-10">{listingsError}</div>
    ) : listings.length === 0 ? (
      <div className="text-center text-gray-500 py-10">No listings found.</div>
    ) : (
      <div
        ref={residentialScrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
        onMouseDown={handleMouseDown('residential')}
        onMouseLeave={handleMouseLeave('residential')}
        onMouseUp={handleMouseUp('residential')}
        onMouseMove={handleMouseMove('residential')}
        style={{ cursor: dragState.residential.isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
      >
        {listings
          .filter(
            property =>
              (property.propertyType && ['residential', 'apartment', 'villa', 'house'].includes(property.propertyType.toLowerCase())) ||
              (property.prop_type && ['residential', 'apartment', 'villa', 'house'].includes(property.prop_type.toLowerCase()))
          )
          .map((property, index) => (
            <div
              key={property._kw_meta?.id || property.id || index}
              className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 max-w-[80%] sm:max-w-[50%] md:max-w-[30%] md:h-[330px] h-[200px] rounded-xl overflow-hidden shadow-md bg-white relative cursor-pointer"
              onClick={() => {
                localStorage.setItem('selectedProperty', JSON.stringify(property));
                router.push(`/propertydetails/${property._kw_meta?.id || property.id || index}`);
              }}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* 360 logo overlay */}
              <div className="absolute top-3 left-3 z-20 w-10 h-10">
                <Image
                  src="/360logo.png"
                  alt="360 logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              {(
                property.image ||
                (Array.isArray(property.images) && property.images[0]) ||
                (Array.isArray(property.photos) && property.photos[0]?.ph_url)
              ) ? (
                <Image
                  src={
                    property.image ||
                    (Array.isArray(property.images) && property.images[0]) ||
                    (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                    '/property.jpg'
                  }
                  alt={property.title || property.prop_type || 'Property'}
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
                Coming Soon!
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-white drop-shadow">
                <h3 className="text-md font-semibold">{property.title || property.prop_type || 'Property'}</h3>
                <p className="text-sm">
                  {typeof property.location === 'string'
                    ? property.location
                    : property.list_address?.city ||'-'}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
                {property.price ? `SAR ${formatPrice(property.price)}` : property.current_list_price ? `SAR ${formatPrice(property.current_list_price)}` : ''}
              </div>
            </div>
          ))}
      </div>
    )}
    {showScrollButton.residential && !loadingListings && listings.length > 0 && (
      <button
        onClick={() => scrollRight(residentialScrollRef)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 \
              bg-white border border-gray-300 rounded-full p-2 md:p-4 \
              shadow-md z-10 hover:shadow-lg transition"
      >
        <ChevronRight 
          className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
        />
      </button>
    )}
</div>
           
          </div>
        </div>
        <Link href="/properties/active">
    <button className="block md:hidden mx-auto text-sm mb-10 md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
      Click Here
    </button>
    </Link>
    
     {/* New Property Cards Section */}
     <div ref={CommercialRef} className="md:mt-10 mt-10 md:mx-12 scroll-mt-24">
  <div className="flex items-center justify-between md:mx-10 flex-wrap gap-4">
    <p className="flex items-center text-xl md:text-3xl font-normal"> 
      <Image
        src="/commercial.png"
        alt="commercial"
        width={40}
        height={40}
        className="w-8 h-8 md:w-16 md:h-16 mr-5"></Image>
      <span className="text-gray-500 ">Commercial Active Properties</span>
    </p>

    {/* Right: Button */}
    <Link href="/properties/active">
    <button className="hidden md:flex text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-2 rounded-lg hover:bg-red-950 transition">
      Click Here To View All Commercial Active Properties
    </button>
    </Link>
    </div>
    


          {/* First Home Block */}
          <div className="mb-2 md:mb-10">
           {/* First Home Block */}
      <div className="relative w-full px-5 md:px-10 md:py-10 py-5 bg-white">
        {/* Backward Button */}
        {showBackButton.commercial && !loadingListings && listings.length > 0 && (
          <button
            onClick={() => scrollLeft(commercialScrollRef)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 \
                   bg-white border border-gray-300 rounded-full p-2 md:p-4 \
                   shadow-md z-10 hover:shadow-lg transition"
          >
            <FaChevronLeft 
              className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
            />
          </button>
        )}
    {loadingListings ? (
      <div className="text-center text-gray-500 py-10">Loading listings...</div>
    ) : listingsError ? (
      <div className="text-center text-red-500 py-10">{listingsError}</div>
    ) : listings.length === 0 ? (
      <div className="text-center text-gray-500 py-10">No listings found.</div>
    ) : (
      <div
        ref={commercialScrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
        onMouseDown={handleMouseDown('commercial')}
        onMouseLeave={handleMouseLeave('commercial')}
        onMouseUp={handleMouseUp('commercial')}
        onMouseMove={handleMouseMove('commercial')}
        style={{ cursor: dragState.commercial.isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
      >
        {listings
          .filter(
            property =>
              (property.propertyType && ['commercial', 'office', 'shop'].includes(property.propertyType.toLowerCase())) ||
              (property.prop_type && ['commercial', 'office', 'shop'].includes(property.prop_type.toLowerCase()))
          )
          .map((property, index) => (
            <div
              key={property._kw_meta?.id || property.id || index}
              className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 max-w-[80%] sm:max-w-[50%] md:max-w-[30%] md:h-[330px] h-[200px] rounded-xl overflow-hidden shadow-md bg-white relative cursor-pointer"
              onClick={() => {
                localStorage.setItem('selectedProperty', JSON.stringify(property));
                router.push(`/propertydetails/${property._kw_meta?.id || property.id || index}`);
              }}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* 360 logo overlay */}
              <div className="absolute top-3 left-3 z-20 w-10 h-10">
                <Image
                  src="/360logo.png"
                  alt="360 logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              {(
                property.image ||
                (Array.isArray(property.images) && property.images[0]) ||
                (Array.isArray(property.photos) && property.photos[0]?.ph_url)
              ) ? (
                <Image
                  src={
                    property.image ||
                    (Array.isArray(property.images) && property.images[0]) ||
                    (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                    '/property.jpg'
                  }
                  alt={property.title || property.prop_type || 'Property'}
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
                Coming Soon!
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-white drop-shadow">
                <h3 className="text-md font-semibold">{property.title || property.prop_type || 'Property'}</h3>
                <p className="text-sm">
                  {typeof property.location === 'string'
                    ? property.location
                    : property.list_address?.city ||'-'}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
                {property.price ? `SAR ${formatPrice(property.price)}` : property.current_list_price ? `SAR ${formatPrice(property.current_list_price)}` : ''}
              </div>
            </div>
          ))}
      </div>
    )}
    {showScrollButton.commercial && !loadingListings && listings.length > 0 && (
      <button
        onClick={() => scrollRight(commercialScrollRef)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 \
              bg-white border border-gray-300 rounded-full p-2 md:p-4 \
              shadow-md z-10 hover:shadow-lg transition"
      >
        <ChevronRight 
          className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
        />
      </button>
    )}
</div>
           
          </div>
        </div>
        <Link href="/properties/active">
    <button className="block md:hidden mx-auto text-sm mb-10 md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
      Click Here
    </button>
    </Link>
  
         {/* sold Property Cards Section */}
         <div ref={soldRef} className="md:mt-10 mt-4 md:mx-12 scroll-mt-24">
  <div className="flex items-center justify-between md:mx-10">
    <p className="flex items-center text-xl md:text-3xl font-normal"> 
      <Image
        src="/sold3.png"
        alt="Residential"
        width={40} 
        height={40}
        className="w-8 h-8 md:w-16 md:h-16 mr-5"
      />
      <span className="text-gray-500">Sold Properties</span>
    </p>

    {/* Right: Button */}
    <Link href="/properties/sold"> 
    <button className="hidden md:flex text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-2 rounded-lg hover:bg-red-950 transition">
      Click Here To View All Sold Properties
    </button>
    </Link>
    </div>
   
  

  {/* First Home Block */}
  <div className="mb-2 md:mb-10">
   {/* First Home Block */}
   <div className="relative w-full px-6 md:px-10 md:py-10 py-5 bg-white">
   {showBackButton.sold && !loadingListings && listings.length > 0 && (
  <button
    onClick={() => { scrollLeft(soldScrollRef); handleScrollSold(); }}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 
               bg-white border border-gray-300 rounded-full p-2 md:p-4 
               shadow-md z-10 hover:shadow-lg transition"
  >
    <FaChevronLeft 
      className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
    />
  </button>
)}

  {loadingListings ? (
    <div className="text-center text-gray-500 py-10">Loading listings...</div>
  ) : listingsError ? (
    <div className="text-center text-red-500 py-10">{listingsError}</div>
  ) : listings.length === 0 ? (
    <div className="text-center text-gray-500 py-10">No listings found.</div>
  ) : (
    <div
      ref={soldScrollRef}
      className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
      onMouseDown={handleMouseDown('sold')}
      onMouseLeave={handleMouseLeave('sold')}
      onMouseUp={handleMouseUp('sold')}
      onMouseMove={handleMouseMove('sold')}
      style={{ cursor: dragState.sold.isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
    >
      {listings
        .filter(
          property =>
            (property.propertyType && property.propertyType.toLowerCase() === 'sold') ||
            (property.list_status && property.list_status.toLowerCase() === 'sold')
        )
        .map((property, index) => (
          <div
            key={property._kw_meta?.id || property.id || index}
            className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 max-w-[80%] sm:max-w-[50%] md:max-w-[30%] md:h-[330px] h-[200px] rounded-xl overflow-hidden shadow-md bg-white relative cursor-pointer"
            onClick={() => {
              localStorage.setItem('selectedProperty', JSON.stringify(property));
              router.push(`/propertydetails/${property._kw_meta?.id || property.id || index}`);
            }}
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* 360 logo overlay */}
            <div className="absolute top-3 left-3 z-20 w-10 h-10">
              <Image
                src="/360logo.png"
                alt="360 logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            {(
              property.image ||
              (Array.isArray(property.images) && property.images[0]) ||
              (Array.isArray(property.photos) && property.photos[0]?.ph_url)
            ) ? (
              <Image
                src={
                  property.image ||
                  (Array.isArray(property.images) && property.images[0]) ||
                  (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                  '/property.jpg'
                }
                alt={property.title || property.prop_type || 'Property'}
                fill
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
              Coming Soon!
              </div>
            )}
            <div className="absolute bottom-4 left-4 text-white drop-shadow">
              <h3 className="text-md font-semibold">{property.title || property.prop_type || 'Property'}</h3>
              <p className="text-sm">
                {typeof property.location === 'string'
                  ? property.location
                  : property.list_address?.city ||'-'}
              </p>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
              {property.price ? `SAR ${formatPrice(property.price)}` : property.current_list_price ? `SAR ${formatPrice(property.current_list_price)}` : ''}
            </div>
          </div>
        ))}
    </div>
  )}

  {showScrollButton.sold && !loadingListings && listings.length > 0 && (
    <button
    onClick={() => { scrollRight(soldScrollRef); handleScrollSold(); }}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 
               bg-white border border-gray-300 rounded-full p-2 md:p-4 
               shadow-md z-10 hover:shadow-lg transition"
  >
   <ChevronRight 
   className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
 />
 
  </button>
  )}
</div>
  </div>


        </div>
        <Link href="/properties/sold">
    <button className="block md:hidden text-sm mb-10 md:text-base mx-auto font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
      Click Here
    </button>
    </Link>
         {/* rent Property Cards Section */}
         <div ref={rentalRef} className="md:mt-10 mt-4 md:mx-12 scroll-mt-24">
  <div className="flex items-center justify-between md:mx-10 flex-wrap gap-4">
    <p className="flex items-center text-xl md:text-3xl font-normal"> 
      <Image src="/rental.png" alt="Residential" width={40} 
  height={40}
  className="w-8 h-8 md:w-16 md:h-16 mr-5"></Image>
      <span className="text-gray-500">Rental Properties</span>
    </p>

    {/* Right: Button */}
    <Link href="/properties/rent">
    <button className="hidden md:flex text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-2 rounded-lg hover:bg-red-950 transition">
      Click Here To View All Rental Properties
    </button>
    </Link>
    </div>
   



          {/* First Home Block */}
          <div className="mb-2 md:mb-10">
            {/* First Home Block */}
      <div className="relative w-full md:px-10 px-6 md:py-10 py-5 bg-white">
      {showBackButton.rental && !loadingListings && listings.length > 0 && (
  <button
    onClick={() => { scrollLeft(rentalScrollRef); handleScrollRental(); }}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 
               bg-white border border-gray-300 rounded-full p-2 md:p-4 
               shadow-md z-10 hover:shadow-lg transition"
  >
    <FaChevronLeft 
      className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
    />
  </button>
)}

  {loadingListings ? (
    <div className="text-center text-gray-500 py-10">Loading listings...</div>
  ) : listingsError ? (
    <div className="text-center text-red-500 py-10">{listingsError}</div>
  ) : listings.length === 0 ? (
    <div className="text-center text-gray-500 py-10">No listings found.</div>
  ) : (
    <div
      ref={rentalScrollRef}
      className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
      onMouseDown={handleMouseDown('rental')}
      onMouseLeave={handleMouseLeave('rental')}
      onMouseUp={handleMouseUp('rental')}
      onMouseMove={handleMouseMove('rental')}
      style={{ cursor: dragState.rental.isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
    >
      {listings
        .filter(
          property => {
            const type = property.propertyType ? property.propertyType.toLowerCase() : '';
            const propType = property.prop_type ? property.prop_type.toLowerCase() : '';
            const listCat = property.list_category ? property.list_category.toLowerCase() : '';
            return (
              ['rental', 'rent'].includes(type) ||
              ['rental', 'rent'].includes(propType) ||
              ['rental', 'for rent'].includes(listCat)
            );
          }
        )
        .map((property, index) => (
          <div
            key={property._kw_meta?.id || property.id || index}
            className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 max-w-[80%] sm:max-w-[50%] md:max-w-[30%] md:h-[330px] h-[200px] rounded-xl overflow-hidden shadow-md bg-white relative cursor-pointer"
            onClick={() => {
              localStorage.setItem('selectedProperty', JSON.stringify(property));
              router.push(`/propertydetails/${property._kw_meta?.id || property.id || index}`);
            }}
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* 360 logo overlay */}
            <div className="absolute top-3 left-3 z-20 w-10 h-10">
              <Image
                src="/360logo.png"
                alt="360 logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            {(
              property.image ||
              (Array.isArray(property.images) && property.images[0]) ||
              (Array.isArray(property.photos) && property.photos[0]?.ph_url)
            ) ? (
              <Image
                src={
                  property.image ||
                  (Array.isArray(property.images) && property.images[0]) ||
                  (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                  '/property.jpg'
                }
                alt={property.title || property.prop_type || 'Property'}
                fill
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
              Coming Soon!
              </div>
            )}
       
          <div className="absolute bottom-4 left-4 text-white drop-shadow">
            <h3 className="text-md font-semibold">{property.title || property.prop_type || 'Property'}</h3>
            <p className="text-sm">
              {typeof property.location === 'string'
                ? property.location
                : property.list_address?.city ||'-'}
            </p>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {property.price ? `SAR ${formatPrice(property.price)}` : property.current_list_price ? `SAR ${formatPrice(property.current_list_price)}` : ''}
          </div>
        </div>
      ))}
    </div>
  )}

  {showScrollButton.rental && !loadingListings && listings.length > 0 && (
     <button
     onClick={() => { scrollRight(rentalScrollRef); handleScrollRental(); }}
     className="absolute right-0 top-1/2 transform -translate-y-1/2 
                bg-white border border-gray-300 rounded-full p-2 md:p-4 
                shadow-md z-10 hover:shadow-lg transition"
   >
    <ChevronRight 
    className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
  />
  
   </button>
  )}
</div>
           
          </div>
        </div>
        <Link href="/properties/rent">
    <button className="block md:hidden mx-auto text-sm mb-10 md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
      Click Here
    </button>
    </Link>
         {/* sold Property Cards Section */}
         <div ref={auctionRef} className="md:mt-10 mt-4 md:mx-12 scroll-mt-24">
  <div className="flex items-center justify-between md:mx-10 flex-wrap gap-4">
    <p className="flex items-center text-xl md:text-3xl font-normal"> 
      <Image src="/auction.png" alt="Residential"width={40} 
  height={40}
  className="w-8 h-8 md:w-16 md:h-16 mr-5"></Image>
      <span className="text-gray-500">Auction Properties</span>
    </p>
    {/* Right: Button */}
    <Link href="/properties/auction">
    <button className="hidden md:flex text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-2 rounded-lg hover:bg-red-950 transition">
      Click Here To View All Auction Properties
    </button>
    </Link>
  </div>
  <div className=" mb-2 md:mb-10">
    <div className="relative w-full md:px-10 px-6 md:py-10 py-5 bg-white">
    {showBackButton.auction && !loadingListings && listings.length > 0 && (
  <button
    onClick={() => { scrollLeft(auctionScrollRef); handleScrollAuction(); }}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 
               bg-white border border-gray-300 rounded-full p-2 md:p-4 
               shadow-md z-10 hover:shadow-lg transition"
  >
    <FaChevronLeft 
      className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
    />
  </button>
)}
      {loadingListings ? (
        <div className="text-center text-gray-500 py-10">Loading listings...</div>
      ) : listingsError ? (
        <div className="text-center text-red-500 py-10">{listingsError}</div>
      ) : (() => {
        const auctionListings = listings.filter(property => {
          const type = property.propertyType ? property.propertyType.toLowerCase() : '';
          const propType = property.prop_type ? property.prop_type.toLowerCase() : '';
          const listCat = property.list_category ? property.list_category.toLowerCase() : '';
          return type === 'auction' || propType === 'auction' || listCat === 'auction';
        });
        if (auctionListings.length === 0) {
          return (
            <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
            Coming Soon!
            </div>
          );
        }
        return (
          <div
            ref={auctionScrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
            onMouseDown={handleMouseDown('auction')}
            onMouseLeave={handleMouseLeave('auction')}
            onMouseUp={handleMouseUp('auction')}
            onMouseMove={handleMouseMove('auction')}
            style={{ cursor: dragState.auction.isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
          >
            {auctionListings.map((property, index) => (
              <div
                key={property._kw_meta?.id || property.id || index}
                className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 max-w-[80%] sm:max-w-[50%] md:max-w-[30%] md:h-[330px] h-[200px] rounded-xl overflow-hidden shadow-md bg-white relative cursor-pointer"
                onClick={() => {
                  localStorage.setItem('selectedProperty', JSON.stringify(property));
                  router.push(`/propertydetails/${property._kw_meta?.id || property.id || index}`);
                }}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* 360 logo overlay */}
                <div className="absolute top-3 left-3 z-20 w-10 h-10">
                  <Image
                    src="/360logo.png"
                    alt="360 logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {(
                  property.image ||
                  (Array.isArray(property.images) && property.images[0]) ||
                  (Array.isArray(property.photos) && property.photos[0]?.ph_url)
                ) ? (
                  <Image
                    src={
                      property.image ||
                      (Array.isArray(property.images) && property.images[0]) ||
                      (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                      '/property.jpg'
                    }
                    alt={property.title || property.prop_type || 'Property'}
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
                  Coming Soon!
                  </div>
                )}
                <div className="absolute bottom-4 left-4 text-white drop-shadow">
                  <h3 className="text-md font-semibold">{property.title || property.prop_type || 'Property'}</h3>
                  <p className="text-sm">
                    {typeof property.location === 'string'
                      ? property.location
                      : property.list_address?.city ||'-'}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {property.price ? `SAR ${formatPrice(property.price)}` : property.current_list_price ? `SAR ${formatPrice(property.current_list_price)}` : ''}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      {showScrollButton.auction && !loadingListings && listings.length > 0 && (
        <button
          onClick={() => scrollRight(auctionScrollRef)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 \
               bg-white border border-gray-300 rounded-full p-2 md:p-4 \
               shadow-md z-10 hover:shadow-lg transition"
        >
          <ChevronRight 
            className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
          />
        </button>
      )}
    </div>
  

           
          </div>
        </div>
        <Link href="/properties/auction">
    <button className="block md:hidden mx-auto mb-10 text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
      Click Here
    </button>
    </Link>
         {/* sold Property Cards Section */}
         <div ref={newDevRef} className="md:mt-10 mt-4 md:mx-12 scroll-mt-24">
  <div className="flex items-center justify-between md:mx-10 flex-wrap gap-4">
    <p className="flex items-center text-xl md:text-3xl font-normal"> 
      <Image
        src="/newdevelopment.png"
        alt="Residential"
        width={40} 
        height={40}
        className="w-8 h-8 md:w-16 md:h-16 mr-5"></Image>
      <span className="text-gray-500">New Development</span>
    </p>
    {/* Right: Button */}
    <Link href="/properties/newdevelopment">
    <button className="hidden md:flex text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-2 rounded-lg hover:bg-red-950 transition">
      Click Here To View All New Development Properties
    </button>
    </Link>
  </div>
  <div className=" mb-2 md:mb-10">
    <div className="relative w-full px-6 md:px-10 md:py-10 py-5 bg-white">
    {showBackButton.newDev && !loadingListings && listings.length > 0 && (
  <button
    onClick={() => { scrollLeft(newDevScrollRef); handleScrollDev(); }}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 
               bg-white border border-gray-300 rounded-full p-2 md:p-4 
               shadow-md z-10 hover:shadow-lg transition"
  >
    <FaChevronLeft 
      className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
    />
  </button>
)}
      {loadingListings ? (
        <div className="text-center text-gray-500 py-10">Loading listings...</div>
      ) : listingsError ? (
        <div className="text-center text-red-500 py-10">{listingsError}</div>
      ) : (() => {
        const newDevListings = listings.filter(property => {
          const type = property.propertyType ? property.propertyType.toLowerCase() : '';
          const propType = property.prop_type ? property.prop_type.toLowerCase() : '';
          const listCat = property.list_category ? property.list_category.toLowerCase() : '';
          return (
            ['new development', 'newdevelopment', 'development'].includes(type) ||
            ['new development', 'newdevelopment', 'development'].includes(propType) ||
            ['new development', 'newdevelopment', 'development'].includes(listCat)
          );
        });
        if (newDevListings.length === 0) {
          return (
            <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
            Coming Soon!
            </div>
          );
        }
        return (
          <div
            ref={newDevScrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
            onMouseDown={handleMouseDown('newDev')}
            onMouseLeave={handleMouseLeave('newDev')}
            onMouseUp={handleMouseUp('newDev')}
            onMouseMove={handleMouseMove('newDev')}
            style={{ cursor: dragState.newDev.isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
          >
            {newDevListings.map((property, index) => (
              <div
                key={property._kw_meta?.id || property.id || index}
                className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 max-w-[80%] sm:max-w-[50%] md:max-w-[30%] md:h-[330px] h-[200px] rounded-xl overflow-hidden shadow-md bg-white relative cursor-pointer"
                onClick={() => {
                  localStorage.setItem('selectedProperty', JSON.stringify(property));
                  router.push(`/propertydetails/${property._kw_meta?.id || property.id || index}`);
                }}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* 360 logo overlay */}
                <div className="absolute top-3 left-3 z-20 w-10 h-10">
                  <Image
                    src="/360logo.png"
                    alt="360 logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {(
                  property.image ||
                  (Array.isArray(property.images) && property.images[0]) ||
                  (Array.isArray(property.photos) && property.photos[0]?.ph_url)
                ) ? (
                  <Image
                    src={
                      property.image ||
                      (Array.isArray(property.images) && property.images[0]) ||
                      (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                      '/property.jpg'
                    }
                    alt={property.title || property.prop_type || 'Property'}
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
                  Coming Soon!
                  </div>
                )}
                <div className="absolute bottom-4 left-4 text-white drop-shadow">
                  <h3 className="text-md font-semibold">{property.title || property.prop_type || 'Property'}</h3>
                  <p className="text-sm">
                    {typeof property.location === 'string'
                      ? property.location
                      : property.list_address?.city ||'-'}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {property.price ? `SAR ${formatPrice(property.price)}` : property.current_list_price ? `SAR ${formatPrice(property.current_list_price)}` : ''}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      {showScrollButton.newDev && !loadingListings && listings.length > 0 && (
        <button
          onClick={() => scrollRight(newDevScrollRef)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 \
               bg-white border border-gray-300 rounded-full p-2 md:p-4 \
               shadow-md z-10 hover:shadow-lg transition"
        >
          <ChevronRight 
            className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
          />
        </button>
      )}
    </div>

   
          </div>
        </div>
        <Link href="/properties/newdevelopment">
  <button className="block md:hidden mx-auto text-sm mb-10 md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
    Click Here
  </button>
</Link>
         {/* sold Property Cards Section */}
         <div ref={internationalRef} className="md:mt-10 mt-4 md:mx-12 scroll-mt-24">
  <div className="flex items-center justify-between md:mx-10 flex-wrap gap-4">
    <p className="flex items-center text-xl md:text-3xl font-normal"> 
      <Image
        src="/international.png"
        alt="Residential"
        width={40} 
        height={40}
        className="w-8 h-8 md:w-16 md:h-16 mr-5"></Image>
      <span className="text-gray-500">International Properties</span>
    </p>
    {/* Right: Button */}
    <Link href="https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721">
    <button className="hidden md:flex text-sm font-semibold md:text-base  bg-[rgb(206,32,39,255)] text-white px-4 py-2 rounded-lg hover:bg-red-950 transition">
      Click Here To View All International Properties
    </button>
    </Link>
  </div>
  <div className=" mb-2">
    <div className="relative w-full px-6 md:px-10 md:py-10 py-5 bg-white">
    {showBackButton.international && !loadingListings && listings.length > 0 && (
  <button
    onClick={() => { scrollLeft(internationalScrollRef); handleScrollInternatinal(); }}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 
               bg-white border border-gray-300 rounded-full p-2 md:p-4 
               shadow-md z-10 hover:shadow-lg transition"
  >
    <FaChevronLeft 
      className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
    />
  </button>
)}
      {loadingListings ? (
        <div className="text-center text-gray-500 py-10">Loading listings...</div>
      ) : listingsError ? (
        <div className="text-center text-red-500 py-10">{listingsError}</div>
      ) : (() => {
        const internationalListings = listings.filter(property => {
          const type = property.propertyType ? property.propertyType.toLowerCase() : '';
          const propType = property.prop_type ? property.prop_type.toLowerCase() : '';
          const listCat = property.list_category ? property.list_category.toLowerCase() : '';
          return type === 'international' || propType === 'international' || listCat === 'international';
        });
        if (internationalListings.length === 0) {
          return (
            <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
              Coming Soon!
            </div>
          );
        }
        return (
          <div
            ref={internationalScrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
            onMouseDown={handleMouseDown('international')}
            onMouseLeave={handleMouseLeave('international')}
            onMouseUp={handleMouseUp('international')}
            onMouseMove={handleMouseMove('international')}
            style={{ cursor: dragState.international.isDragging ? 'grabbing' : 'grab', scrollSnapType: 'x mandatory' }}
          >
            {internationalListings.map((property, index) => (
              <div
                key={property._kw_meta?.id || property.id || index}
                className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 max-w-[80%] sm:max-w-[50%] md:max-w-[30%] md:h-[330px] h-[200px] rounded-xl overflow-hidden shadow-md bg-white relative cursor-pointer"
                onClick={() => {
                  localStorage.setItem('selectedProperty', JSON.stringify(property));
                  router.push(`/propertydetails/${property._kw_meta?.id || property.id || index}`);
                }}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* 360 logo overlay */}
                <div className="absolute top-3 left-3 z-20 w-10 h-10">
                  <Image
                    src="/360logo.png"
                    alt="360 logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {(
                  property.image ||
                  (Array.isArray(property.images) && property.images[0]) ||
                  (Array.isArray(property.photos) && property.photos[0]?.ph_url)
                ) ? (
                  <Image
                    src={
                      property.image ||
                      (Array.isArray(property.images) && property.images[0]) ||
                      (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                      '/property.jpg'
                    }
                    alt={property.title || property.prop_type || 'Property'}
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg md:text-2xl animate-pulse rounded-xl border-2 border-dashed border-[rgb(206,32,39,255)]">
                  Coming Soon!
                  </div>
                )}
                <div className="absolute bottom-4 left-4 text-white drop-shadow">
                  <h3 className="text-md font-semibold">{property.title || property.prop_type || 'Property'}</h3>
                  <p className="text-sm">
                    {typeof property.location === 'string'
                      ? property.location
                      : property.list_address?.city ||'-'}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  {property.price ? `SAR ${formatPrice(property.price)}` : property.current_list_price ? `SAR ${formatPrice(property.current_list_price)}` : ''}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      {showScrollButton.international && !loadingListings && listings.length > 0 && (
        <button
          onClick={() => scrollRight(internationalScrollRef)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 \
               bg-white border border-gray-300 rounded-full p-2 md:p-4 \
               shadow-md z-10 hover:shadow-lg transition"
        >
          <ChevronRight 
            className="cursor-pointer text-[rgb(206,32,39,255)] w-6 h-6 md:w-[50px] md:h-[50px]" 
          />
        </button>
      )}
    </div>
 

           
          </div>
        </div>
        <Link href="https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721">
    <button className="block md:hidden mx-auto mb-10 text-sm md:text-base font-semibold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-lg hover:bg-red-700 transition">
      Click Here
    </button>
    </Link>
      
      {/* How Will You Think image and KW logo bar */}
      <div className="flex flex-col">
        <div className="order-1 md:order-2 flex flex-col items-center justify-center">
          <Image
            src="/howwillyouthink.png"
            alt="How Will You Thrive"
            width={800}
            height={400}
            className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
          />
          <button className="bg-[rgb(206,32,39,255)] w-40 text-white px-8 py-1.5 text-xs font-semibold rounded-full block mx-auto md:hidden mt-4 mb-4"  onClick={() => router.push('/contactUs')}>
            JOIN US
          </button>
        </div>
        {/* Red bar with centered KW logo */}
        <div className="order-2 md:order-1 bg-[rgb(206,32,39,255)] flex items-center justify-center h-[25px] md:h-[80px]">
          <Image
            src="/kwline1.png"
            alt="KW Logo Center"
            width={80}
            height={80}
            className="object-contain mx-auto w-7 h-7 md:w-20 md:h-20"
          />
        </div>
      </div>
      {/* Red horizontal line */}
      <div className="hidden md:flex justify-center items-center my-20 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-8">
        <hr className="md:w-160 w-60 mx-auto bg-[rgb(206,32,39,255)] border-0  h-[2px]" />
      </div>
      {/* Dynamic Property Types Section */}
     
      <Footer />
    </div>
  );
};

export default Properties;
