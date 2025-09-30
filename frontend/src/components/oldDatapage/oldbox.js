'use client'
import React from 'react';
import Image from 'next/image';

const Box = ({ src, image, h3 }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative min-h-[76vh] md:min-h-[100vh]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={src}
            alt="Background"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Content Box - Different styles for mobile and desktop */}
        <div className="relative z-10 flex flex-col items-center  justify-end min-h-[46vh] md:min-h-[100vh]  px-10">
          {/* Mobile View */}
          <div className="w-full md:hidden ">
            <div className="bg-gray-500/50 backdrop-blur-sm max-w-sm mx-auto px-8 py-0 mt-0 rounded-3xl">
              <div className="flex flex-col items-center">
              <div className="relative w-25 h-20"> 
  <Image
    src={image}
    alt="Hero"
    width={128} 
    height={128}
    className="object-cover rounded-full w-full h-full" 
  />
</div>
<hr className='w-25 h-[1.3px] bg-[rgb(206,32,39,255)] border-0'/>
<h3 className="text-lg font-normal py-4 text-white text-center tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] leading-relaxed">
  {h3}
</h3>

              </div>
            </div>
          </div>

          {/* Desktop View - Original Layout */}
          <div className="hidden md:block w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-t-3xl w-full">
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-55 py-8">
                  <Image
                    src={image}
                    alt="Hero"
                    width={160}
                    height={160}
                    className="object-cover rounded-full h-40 w-40"
                  />
                </div>
                <div className="w-60 h-0.5 bg-[rgb(206,32,39,255)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Title */}
      <h3 className="text-2xl mt-12  py-4 text-center tracking-[0.2em] md:tracking-[0.2em] lg:tracking-[0.2em] leading-relaxed">
  {h3}
</h3>
    </div>
  );
};

export default Box;
