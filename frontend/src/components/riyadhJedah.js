'use client'
import React, { useState } from 'react';
import Header from './header';
import Footer from './footer';
import Box from './box';
import Image from 'next/image';
const RiyadhJedah = (props) => {

    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      addressTo: '',
      message: ''
    });
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus(null);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus('success');
          setForm({ firstName: '', lastName: '', email: '', addressTo: '', message: '' });
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    const teamMembers = [
  {
    name: "MUHANNAD AWAD",
    title: "CEO / OPERATING PRINCIPLE",
    email: "M.AWAD@KWSAUDIARABIA.COM",
    phone: "+966 56 505 7711",
    image: "https://static.wixstatic.com/media/36a881_c32aecbd35de48f1839a4c8b90be6196~mv2.jpg/v1/fill/w_365,h_365,fp_0.46_0.15,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pic48_edited.jpg", // Image must be in /public
  },
  {
    name: "HAIFA SDIRI",
    title: "REGIONAL MCA",
    email: "HSDIRI@KWSAUDIARABIA.COM",
    phone: "+966 55 469 1606",
    image: "https://static.wixstatic.com/media/36a881_1d8efa05d1da4efcbcdcfd4a99921c79~mv2.png/v1/fill/w_365,h_365,fp_0.49_0.23,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Haifa%20Sdiri.png", // Image must be in /public
  },
  {
    name: "ABDALLAH BAKEER",
    title: "REGIONAL DIRECTOR",
    email: "A.BAKEER@KWSAUDIARABIA.COM",
    phone: "+966 50 006 1897",
    image: "https://static.wixstatic.com/media/36a881_0ddd8c953b7b41509013bd8846239274~mv2.png/v1/fill/w_336,h_336,fp_0.51_0.24,lg_1,q_85,enc_avif,quality_auto/Abdullah%20Bakeer.png"
  },
  {
    name: "ALAA MOFTAH",
    title: "REGIONAL TECHNOLOGY MANAGER",
    email: "ALAA.MOFTAH@KWSAUDIARABIA.COM",
    phone: "+966 50 060 0592",
    image: "https://static.wixstatic.com/media/36a881_e0f85e7b86444035b1f97950b5574a74~mv2.png/v1/fill/w_365,h_365,fp_0.51_0.24,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Alaa%20Moftah.png", // Image must be in /public
  },
  {
    name: "AYAN HASSAN",
    title: "REGIONAL OPERATION MANAGER",
    email: "AYANH@KWSAUDIARABIA.COM",
    phone: "+966 56 754 8770",
    image: "https://static.wixstatic.com/media/36a881_2841965220f84b56b10665f5679c8081~mv2.png/v1/fill/w_365,h_365,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Nuha%20Alsubhi.png"
  },
  {
    name: "OSAMA HAMZE",
    title: "REGIONAL TECHNOLOGY",
    email: "OSAMA.HAMZE@KWSAUDIARABIA.COM",
    phone: "+966 59 848 0973",
    image: "https://static.wixstatic.com/media/36a881_da8c9c2ce26a4f6bb8c54774c402735f~mv2.png/v1/fill/w_365,h_365,fp_0.49_0.22,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Osama%20Hamza.png", // Image must be in /public
  },
];
    return (
        <div>
         
        {/* Combined Section */}
      <div className="bg-gray-200 rounded-2xl border-gray-200 my-8 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side (Map + Address) */}
         <div className="flex-1 p-6 flex justify-center items-center">
  <div className="w-full md:max-w-full">
  <div className="text-center mb-4">
  <div className="font-bold uppercase tracking-widest text-sm flex justify-between max-w-xs mx-auto pb-4">
    <span>EMAIL</span>
    <span>TELEPHONE</span>
  </div>
  <hr className="border-t border-[rgb(206,32,39,255)] w-120 mx-auto mb-4" />
  <p className="text-[0.6rem] md:text-sm font-medium mt-2 tracking-wide">
    {props.address}
  </p>
</div>


    {/* Map */}
    <div className="w-full h-[300px] mt-15 md:px-15">
      <iframe
        src={props.map}
        className="w-full h-full rounded"
        loading="lazy"
      />
    </div>
  </div>
</div>

          {/* Vertical Line */}
          <div className="hidden md:flex items-stretch">
            <div className="w-[2px] bg-gray-300 mx-1"></div>
          </div>

          {/* Right Side (Form) */}
<div className="flex-1 p-6 flex justify-center items-center">
  <form className="w-full md:max-w-full space-y-4 py-10 md:px-15" onSubmit={handleSubmit}>
    <div>
      <label className="block mb-1 md:text-base text-base font-sm">First Name</label>
      <input
        type="text"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="First name"
        className="w-full text-base p-3 mt-2 border-white rounded bg-white focus:outline-none"
        required
      />
    </div>
    <div className='py-2'>
      <label className="block mb-1 md:text-base text-base font-sm">Last Name</label>
      <input
        type="text"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Last name"
        className="w-full p-3 text-base mt-2 border-white rounded bg-white focus:outline-none"
        required
      />
    </div>
    <div className='py-2'>
      <label className="block mb-1 md:text-base text-base font-sm">Email *</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-3 text-base mt-2 border-white rounded bg-white focus:outline-none"
        required
      />
    </div>
    <div className='py-2'>
      <label className="block mb-1 md:text-base text-base font-sm">Address To</label>
      <select
        name="addressTo"
        value={form.addressTo}
        onChange={handleChange}
        className="w-full p-3 text-base mt-2 border-white rounded bg-white focus:outline-none"
        required
      >
        <option value="">Select</option>
        <option value="sales">Sales</option>
        <option value="support">Support</option>
      </select>
    </div>
    <div className='py-2'>
      <label className="block mb-1  md:text-base text-base font-sm">Message *</label>
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Message"
        rows="2"
        className="w-full p-4 text-base border-white mt-2 rounded bg-white focus:outline-none"
        required
      />
    </div>
    <button
      type="submit"
      className="w-full md:w-32 bg-[rgb(206,32,39,255)] text-white py-2 rounded-full text-base font-semibold hover:bg-gray-600 transition"
    >
      Submit
    </button>
    {status === 'success' && (
      <p className="text-green-600 text-center mt-2">Thank you! Your message has been sent.</p>
    )}
    {status === 'error' && (
      <p className="text-red-600 text-center mt-2">Sorry, there was an error. Please try again.</p>
    )}
  </form>
</div>

        </div>
      </div>
        <div className="min-h-screen bg-white mt-4 md:mt-20">
        {/* Changed outer container to stack on mobile */}
        <div className="flex flex-col md:flex-row border-t border-b border-r border-black">
          
          {/* Left Section - Full width on mobile, sticky 50% on desktop */}
          <div className="w-full md:w-1/2 flex justify-center items-center 
                         md:sticky md:top-0 top-20 h-auto md:h-screen 
                         border-b md:border-b-0 md:border-r border-black
                         py-4 md:py-0">
            <div className="text-center px-4">
              <h2 className="text-3xl font-semibold mb-2">OUR TEAM</h2>
              <div className="w-30 h-0.5 bg-[rgb(206,32,39,255)] mb-2 mx-auto border-0 mt-4 md:mt-10"></div>
              <p className="text-sm tracking-wider mt-4 md:mt-10 text-gray-600">{props.p}</p>
            </div>
          </div>
      
          {/* Right Section - Full width on mobile, 50% on desktop */}
          <div className="w-full md:w-1/2">
            {teamMembers.map((member, index) => (
              <div key={index}>
                {/* Changed to vertical layout on mobile */}
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-xl object-cover w-full max-w-[200px] mx-auto md:mx-0"
                  />
                  <div className="pt-2 text-center md:text-left">
                  <p className="font-sans font-normal no-underline text-[18px] md:text-[22px] leading-[1.2] tracking-normal">
                      {member.name}
                    </p>
                    <hr className="w-37 md:w-60 h-[1px] bg-[rgba(202,3,32,1)] border-0 my-2 mx-auto" />

                    <p className=" font-normal  no-underline text-[0.8rem] leading-[1.6] tracking-normal">
                      {member.title}
                    </p>
                    <p className="text-sm mb-1 text-gray-600 mt-8 md:mt-16">{member.email}</p>
                    <p className="text-sm text-gray-600">{member.phone}</p>
                  </div>
                </div>
      
                {/* Divider - Same as before */}
                {index !== teamMembers.length - 1 && (
                  <hr className="border-t border-black" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
             <div className="flex justify-center py:4 md:py-16">
                    <Image
                      src="/howwillyouthink.png"
                      alt="How Will You Thrive"
                      width={800}
                      height={400}
                      className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
                    />
                  </div>
                   <hr className="w-8/12 md:w-6/12 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-10 mb-10" />
          <Footer></Footer>
        </div>
    );
}

export default RiyadhJedah;
