'use client'
import React from 'react';
import Image from 'next/image';

const Box = ({ src, image, h3 }) => {
  // Check if src is valid (not empty, not just '/', and not undefined)
  const isValidSrc = src && src !== '/' && src.length > 1;
  
  return (
    <div className=" p-6 md:p-8">
    <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image - only render if src is valid */}
        {isValidSrc && (
          <div className="absolute inset-0">
            <Image
              src={src}
              alt="Background"
              fill
              className="object-cover "
              priority
            />
          </div>
        )}
        {/* Fallback background color when no valid image */}
        {!isValidSrc && (
          <div className="absolute inset-0 bg-gray-800"></div>
        )}
        <div className="absolute inset-0 bg-black/25"></div>

        {/* Content Box */}
        <div className="relative z-10 flex items-center justify-center h-[86vh] md:h-[78vh] px-4 md:px-10">
          
          {/* Mobile View */}
          <div className="w-full md:hidden flex items-center justify-center">
            <div className=" max-w-sm mx-auto px-10 py-10 rounded-3xl flex flex-col items-center justify-center text-center">
          
              <h3 className="text-4xl font-semibold text-white ">
                {h3}
              </h3>
              
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-center w-full">
            <div className=" w-full   items-center justify-center text-center">
              <h3 className="text-5xl font-semibold text-white  mb-4">
                {h3}
              </h3>
            
            </div>
          </div>
         

{/* Hero Section */}
{/* <div className="relative min-h-[76vh]">
      
        <div className="absolute inset-0">
          <Image
            src={src}
            alt="Background"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="inset-0 bg-opacity-60 z-10" />

   
     

    
  

</div> */}

        </div>
      </div>
    </div>
  );
};

export default Box;
