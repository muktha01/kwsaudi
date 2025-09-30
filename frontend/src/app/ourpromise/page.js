import React from 'react'
import Header from '@/components/header'
import Box from '@/components/box'
import Footer from '@/components/footer'
import Image from 'next/image'
export default function page() {
  return (
    <div>
        <Header></Header>
        <Box
        src="/ourpromisebg.jpg"
        h3="Our Promise"
        image="https://static.wixstatic.com/media/36a881_a82aacde83a9442dae07d99a846cadf4~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8-removebg-preview%20(1).png"
      />
       <main className="px-4 mt-10">
        <div className="mx-auto text-center">
        <span className="md:font-normal text-lg tracking-[0.2em] md:text-4xl no-underline bg-transparent leading-[1.3]">
  OUR BELIEFS
</span>


          <hr className="w-30 md:w-46 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-1 md:mt-8" />
          <div className="md:mt-10 md:py-0 py-10">
          <p className="md:mx-65 mx-4 font-[montserrat] tracking-[0em] md:text-[0.9rem] text-[0.7rem] md:font-normal font-semibold no-underline bg-transparent leading-[1.6]">
  We believe that the company we keep can contribute to our lives in untold ways.
  To help cement this understanding we&rsquo;ve formalized a


              Belief system that guides how we treat each other.
            </p>
          </div>
        </div>
      </main>
      <div className="order-1 md:order-2 flex flex-col items-center justify-center">
    <Image
      src="/howwillyouthink.png"
      alt="How Will You Thrive"
      width={800}
      height={400}
      className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
    />
    <button className="bg-[rgb(206,32,39,255)] w-40 text-white px-8 py-1.5 text-[0.6rem] rounded-full block mx-auto md:hidden mt-4 mb-4">
      JOIN US
    </button>
  </div>
      <Footer></Footer>
    </div>
  )
}
