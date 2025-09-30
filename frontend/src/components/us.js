'use client'
import React from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
const Contact = (props) => {
  return (
    <div className="">
      {/* Hero Section */}
      <Header></Header>
      <div className="relative min-h-[76vh] md:min-h-[100vh]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src='/contact.jpg'
            alt="Background"
            fill
            className="object-cover "
            priority
          />
          <div className="absolute inset-0" />
        </div>

        {/* White Box (Fixed Dimensions) */}
        <div className="relative z-10 flex flex-col items-center  justify-end min-h-[46vh] md:min-h-[100vh]  px-10">
          
        <div className="w-full md:hidden ">
            <div className="bg-gray-500/50 backdrop-blur-sm max-w-sm mx-auto px-8 py-0 mt-0 rounded-3xl">
              <div className="flex flex-col items-center">
              <div className="relative w-25 h-20"> 
  <Image
    src='/contactdown.png'
    alt="Hero"
    width={128} 
    height={128}
    className="object-cover rounded-full w-full h-full" 
  />
</div>
<hr className='w-25 h-[1.3px] bg-[rgb(206,32,39,255)] border-0'/>
<h3 className="text-lg font-normal py-4 text-white text-center tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] leading-relaxed">
{props.h3}
</h3>

              </div>
            </div>
          </div>

          <div className="hidden md:block w-full max-w-xl mx-auto">
            <div className="bg-white rounded-t-3xl md:pb-20 w-full">
              <div className="flex flex-col items-center">
                <div className="relative w-[100px] h-[100px] md:w-[100px] md:h-[100px]">
                  <Image
                    src='/contactdown.png'
                    alt="Hero"
                    fill
                    className="object-cover rounded-full"
                  />
                 
                </div>
               <p className='text-gray-500'>{props.h3}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  {/* Intro Text */}
      <main className="px-4 py-6 md:mt-10 mt-10">
        <div className="mx-auto text-center">
            <p className='text-xs md:text-[1rem] tracking-[0.1em] mb-4' >  Partner With A Winning Team </p>
          <h1 className="text-xl md:text-5xl font-normal text-gray-800">
           KW SAUDI ARABIA
          </h1>
          <hr className="w-60 md:w-60 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-6 md:mt-14" />
          <div className="mt-10">
            <p className="text-xs md:text-[1rem]">
            You Join A Winning Team Of Real Estate Professionals Who Are Leading The  Industry To Greater Heights
            </p>
            
          </div>
        </div>
      </main>
     {/* Form Section */}
           <div className="min-h-screen md:py-26">
             {/* Title Banner */}
             <div className="bg-[rgb(206,32,39,255)] md:py-2 py-2 flex justify-center relative">

<div className="relative">
  {/* KW Logo */}
  <Image
    src="/kwlinelogo.png"
    alt="KW Logo"
    width={120}
    height={120}
     className="object-contain w-12 h-12 md:w-36 md:h-36"
  />
  <div className="absolute inset-0 flex items-center justify-center">
  <span className="text-white font-normal text-base md:text-3xl tracking-[0.2em] whitespace-nowrap">
    GET IN TOUCH WITH US !
  </span>
</div>

</div>
</div>

     
             {/* Form + Sidebar Container */}
             <div className="flex flex-col lg:flex-row bg-gray-200 min-h-screen">
               {/* Left Black Sidebar */}
               <div className="hidden md:flex bg-black text-white flex-col items-center w-full lg:w-95 border-r-2 rounded-r-2xl relative min-h-full">
                 <div className="flex flex-col items-center top-0 left-10 absolute">
                   {/* Logo in sidebar */}
                   <Image
                     src="/KellerWilliams_KSA.png"
                     alt="logo"
                     width={260}
                     height={260}
                     className="mb-2"
                   />
                 </div>
     
                 <div className="pt-24 space-y-12 group">
                   {/* Target Icon */}
                   
                 </div>
     
             <div className="hidden md:flex flex-wrap justify-center gap-6">
  {/* Image 1 */}
  <div className="flex flex-col items-center group">
    <div className="relative h-[180px] w-[250px] mb-2 transition-transform duration-300 ease-in-out group-hover:-translate-y-2">
      <Image
        src="https://static.wixstatic.com/media/36a881_b93011b55c3c4cc5a3fec96a287e4564~mv2.png/v1/crop/x_279,y_23,w_289,h_255/fill/w_211,h_188,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screenshot%202025-02-18%20135420.png"
        alt="Rocket Icon"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  </div>

  {/* Image 3 */}
  <div className="flex flex-col items-center group">
    <div className="relative h-[180px] w-[250px] mb-2 transition-transform duration-300 ease-in-out group-hover:-translate-y-2">
      <Image
        src="https://static.wixstatic.com/media/36a881_b93011b55c3c4cc5a3fec96a287e4564~mv2.png/v1/crop/x_0,y_324,w_289,h_255/fill/w_211,h_188,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screenshot%202025-02-18%20135420.png"
        alt="Rocket Icon"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  </div>

  {/* Image 4 */}
  <div className="flex flex-col items-center group">
    <div className="relative h-[180px] w-[250px] mb-2 transition-transform duration-300 ease-in-out group-hover:-translate-y-2">
      <Image
        src="https://static.wixstatic.com/media/36a881_b93011b55c3c4cc5a3fec96a287e4564~mv2.png/v1/crop/x_568,y_324,w_289,h_255/fill/w_211,h_188,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screenshot%202025-02-18%20135420.png"
        alt="Rocket Icon"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  </div>
 </div>
  </div>

               {/* Right Form Section */}
               <div className="flex-1 md:py-20 md:p-10 min-h-full py-10">
                <div className="px-10 sm:px-10 lg:px-20">
  <form className="space-y-6">
    {/* Text Inputs */}
    <div>
  <label className="block mb-2 ml-2 md:text-[18px] font-normal">
    First Name *
  </label>
  <input
    type="text"
    required
    placeholder="First name"
    className="w-full pl-4 py-2 md:py-3 text-base md:text-lg rounded-lg bg-white"
  />
</div>

<div>
  <label className="block mb-2 ml-2 md:text-[18px] font-normal">
    Last Name *
  </label>
  <input
    type="text"
    required
    placeholder="Last name"
    className="w-full  pl-4 py-2 md:py-3 text-base md:text-lg rounded-lg bg-white"
  />
</div>
<div>
  <label className="block mb-2 ml-2 md:text-[18px] font-normal">
    Phone*
  </label>
  <input
    type="number"
    required
    placeholder="Phone"
    className="w-full  pl-4 py-2 md:py-3 text-base md:text-lg rounded-lg bg-white"
  />
</div> 
<div>
  <label className="block mb-2 ml-2 md:text-[18px] font-normal">
    Email *
  </label>
  <input
    type="email"
    required
    placeholder=" Email"
    className="w-full  pl-4 py-2 md:py-3 text-base md:text-lg rounded-lg bg-white"
  />
</div>

<div>
  <label className="block mb-2 ml-2 md:text-[18px] font-normal">
    City *
  </label>
  <input
    type="text"
    required
    placeholder="City"
    className="w-full  pl-4 py-2 md:py-3 text-base md:text-lg rounded-lg bg-white"
  />
</div>


    {/* Message Textarea */}
    <div>
      <label className="block mb-2 ml-2 md:text-[18px] font-normal">
        Message *
      </label>
      <textarea
        required
        rows={3}
        className="w-full  pl-4 py-2 md:py-3 text-base md:text-lg rounded-lg bg-white resize-none"
        placeholder="Type your message here..."
      ></textarea>
    </div>
  

     
                    
     
                   
                     <div className="mt-8 flex justify-end">
                     <button
                    type="submit"
                    className="w-full md:w-32 bg-[rgb(206,32,39,255)] text-white py-2 rounded-full text-base font-semibold hover:bg-gray-600 transition"
                  >
                    Submit
                  </button>
                     </div>
                   </form>
                 </div>
               </div>
             </div>
           </div>
     
          
          <div className="flex justify-center py-2 md:py-0">
                   <Image
                     src="/howwillyouthink.png"
                     alt="How Will You Thrive"
                     width={800}
                     height={400}
                   
                   />
                 </div>
           
                 <hr className="w-8/12 md:w-5/12 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-2 md:mt-14 mb-10" />
      
      <Footer></Footer>
    </div>
  );
};

export default Contact;
