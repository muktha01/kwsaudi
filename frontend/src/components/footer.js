'use client';
import React from 'react';
import Image from 'next/image';
import {
  FaSearch, FaBars, FaTimes, FaBuilding,
  FaNetworkWired, FaUserTie, FaKey, FaUser,
  FaUsers, FaGlobe, FaHome, FaEnvelope, FaPhone,
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
  FaTwitter, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaChevronDown
} from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import { useTranslation } from '../contexts/TranslationContext'; // Import useTranslation

const Footer = () => {
  const { t } = useTranslation(); // Use the translation hook
  return (
    <div className="w-full">
      {/* Footer Grid */}
      <hr className="block md:hidden w-full bg-gray-100" />

      <div className="md:mt-1 w-full max-w-full mx-auto">
        {/* Top Contact Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:border md:border-gray-100 md:rounded-xl items-center md:items-start text-center md:text-left md:border-b md:p-8 pb-2 md:pb-4 text-xs md:text-sm md:bg-gray-100 md:text-gray-700">
          {/* Contact Us Title */}
          <div className="flex items-center justify-center space-x-2 font-semibold mb-2 md:mb-0 mt-4 md:mt-0 md:py-0">
            <span className=" text-lg text-[rgb(206,32,39,255)]">{t('CONTACT US')}</span>
          </div>
          
          <hr className="block md:hidden w-20 md:w-5/12 border-0 mx-auto bg-[rgb(206,32,39,255)]  h-[2px] mt-1 md:mt-14 mb-5" />
          
          <div className="flex flex-col items-center justify-center mb-2 md:hidden w-full">
            <span className="text-sm mb-2">{t('EMAIL')}  <span className="inline-block w-2" />  - <span className="inline-block w-4" />  <span className="text-[0.8rem] font-bold">INFO@KWSAUDIARABIA.COM</span></span>
            <span className="text-sm">{t('TELEPHONE')}  <span className="inline-block w-2" /> - <span className="inline-block w-4" />  <span className="text-[0.8rem] font-bold">9200-15671</span></span>
          </div>
          
          {/* Email - Desktop */}
          <div className="hidden md:flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start text-[1rem] mb-1 md:mb-0">
            <span className="font-normal md:mr-1">{t('EMAIL')}<span className="inline-block w-4" />-<span className="inline-block w-4" /></span>
            <span className='font-bold'>INFO@KWSAUDIARABIA.COM</span>
          </div>

          {/* Telephone - Desktop */}
          <div className="hidden md:flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start text-[1rem]">
            <span className="font-normal md:mr-1">{t('TELEPHONE')}<span className="inline-block w-4" />-<span className="inline-block w-4" /></span>
            <span className='font-bold'>9200-15671</span>
          </div>

          {/* Social Icons - Desktop */}
          <div className="hidden md:flex space-x-2 md:space-x-3 text-gray-700 text-sm md:text-lg">
            <a href="https://www.linkedin.com/company/kwsaudiarabia/" aria-label="LinkedIn" 
              target="_blank" rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <FaLinkedinIn size={12} />
            </a>
            <a href="https://www.youtube.com/@KWSaudiArabia" aria-label="YouTube" 
              target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <FaYoutube size={12} />
            </a>
            <a href="https://x.com/KWSaudiArabia" aria-label="Twitter" target="_blank"
              rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <FaXTwitter size={12} />
            </a>
            <a href="https://www.snapchat.com/add/kwsaudiarabia?invite_id=uOPm-ny1&locale=en_SA%40calendar%3Dgregorian&share_id=AYEA3l8WSMqsIdDUTwPzow&sid=26f1fc0b18b4498197cf201797833561" 
              aria-label="Snapchat" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <FaSnapchatGhost size={12} />
            </a>
            <a href="https://www.instagram.com/kwsaudiarabia/" aria-label="Instagram" 
              target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <FaInstagram size={12} />
            </a>
            <a href="https://www.facebook.com/kellerwilliamssaudiarabia" aria-label="Facebook" 
              target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <FaFacebookF size={12} />
            </a>
            <a href="https://www.tiktok.com/notfound" aria-label="TikTok" 
              target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
              <FaTiktok size={12} />
            </a>
          </div>
        </div>

        <hr className="block md:hidden w-40 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[2px]" />

        {/* Main Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-0 md:gap-4 w-full md:mx-0 mx-4 px-2">
          {[
            {
              label: t("Properties"),
              imageUrl: "https://static.wixstatic.com/media/36a881_58e60526563049da91b5a702cb9995ac~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1.png",
              path: "/properties",
              items: [
                { name: t("Active"), path: "/properties/active" },
                { name: t("Sold"), path: "/properties/sold" },
                { name: t("Rent"), path: "/properties/rent" },
                { name: t("Auction"), path: "/properties/auction" },
                { name: t("New Development"), path: "/properties/newdevelopment" },
                { name: t("International"), path: "https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721" },
              ],
            },
            {
              label: t("Market Center"),
              imageUrl: "https://static.wixstatic.com/media/36a881_63ae150a87e247f4910718ae270a72c0~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2.png",
              path: "/marketCenter",
              items: [
                { name: t("Jasmine"), path: "/riyadh" },
                { name: t("Jeddah"), path: "/jeddah" },
                { name: t("All"), path: "/marketCenter" },
              ],
            },
            {
              label: t("Agent"),
              imageUrl: "https://static.wixstatic.com/media/36a881_e044755275e349d683e96f438b0bb5c2~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3.png",
              path: "/agent",
              items: [
                { name: t("Name"), path: "/agent" },
                { name: t("Market Center"), path: "/agent" },
                { name: t("LOGIN"), path: "agent/login" },
              ],
            },
            {
              label: t("Seller"),
              imageUrl: "https://static.wixstatic.com/media/36a881_19eaa839fd874fc8981955a4021a4ca8~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4.png",
              path: "/seller",
              items: [
                { name: t("Instant Evaluation"), path: "/instantvaluation" },
                { name: t("Seller Guide"), path: "/seller/sellerguid" },
                { name: t("Book/Search KW Agent"), path: "/agent" },
                { name: t("Five Steps To Sell"), path: "/seller" },
              ],
            },
            {
              label: t("Buyer"),
              imageUrl: "https://static.wixstatic.com/media/36a881_e46ac8d781f74cc4b8398f64c2d63425~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5.png",
              path: "/buyer",
              items: [
                { name: t("Search Property"), path: "/properties" },
                { name: t("Property Auction"), path: "/properties/auction" },
                { name: t("New Development"), path: "/properties/newdevelopment" },
                { name: t("Buyer Guide"), path: "/buyer/buyerguid" },
              ],
            },
            {
              label: t("Tenant"),
              imageUrl: "https://static.wixstatic.com/media/36a881_464aa2c8eefd4c3aab2ff966735952a8~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6.png",
              path: "/tenant",
              items: [
                { name: t("Rent Search"), path: "/properties/rent" },
                { name: t("Tenant Guide"), path: "/tenant" },
              ],
            },
            {
              label: t("Franchise"),
              imageUrl: "https://static.wixstatic.com/media/36a881_93371d3a91d7440b895906dd5eb1620a~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7.png",
              path: "/franchise",
              items: [
                { name: t("Overview"), path: "/franchise" },
                { name: t("Benefits"), path: "/franchise" },
                { name: t("Application"), path: "/franchise" },
              ],
            },
            {
              label: t("Our Culture"),
              imageUrl: "https://static.wixstatic.com/media/36a881_795b387ef3734f7b97a97edd833d71b7~mv2.png/v1/fill/w_230,h_189,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8.png",
              path: "/ourCulture",
              items: [
                { name: t("About Us"), path: "/aboutus" },
                { name: t("Why KW"), path: "/ourCulture/whyKW" },
                { name: t("KW Training"), path: "/training" },
                { name: t("KW Technology"), path: "/ourCulture/technology" },
                { name: t("KW University"), path: "https://console.command.kw.com/connect/learning			" },
                { name: t("Events"), path: "/ourCulture/event" },
                { name: t("News"), path: "/ourCulture/event" },
                { name: t("Join Us"), path: "/joinus" },
                { name: t("Contact Us"), path: "/contactUs" },
              ],
            },
          ].map(({ label, imageUrl, path, items }, i) => (
            <div key={i} className="mb-0 md:mb-0">
              {/* Image with link - Desktop only */}
              <div className="hidden md:flex rounded-xl flex-col transition-all cursor-pointer">
                <a href={path}>
                  <Image
                    src={imageUrl}
                    alt={label}
                    width={100}
                    height={100}
                    className="object-contain h-25 w-25 md:h-50 md:w-50"
                  />
                </a>
              </div>
              
              {/* Label - Mobile only */}
              <p className="block md:hidden text-[rgb(206,32,39,255)]  md:text-[0.8rem] mt-4 mb-2">{label}</p>

              {/* Items list */}
              <div className="border-l border-[rgb(206,32,39,255)] md:border-gray-300 pl-3 ml-4">
                <ul className="md:text-base text-xs space-y-1 md:space-y-6 text-left">
                  {items.map((item, index) => (
                    <li key={index} className="hover:text-[rgb(206,32,39,255)] transition-colors">
                      <a href={item.path} className="block w-full py-1">
                      {["LOGIN", "Join Us", "Contact Us"].includes(item.name) ? (
  <span className="text-[rgb(206,32,39,255)] font-semibold">{t(item.name)}</span>
) : (
  t(item.name)
)}

                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Info - Desktop */}
      <div className="hidden md:block bg-gray-100 px-4 py-3 text-gray-50 border-t mt-10">
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          {/* Logo */}
          <div className="flex items-center h-12 md:h-14">
            <Image
              src="/footerlogo.jpg"
              alt="KW Saudi Arabia Logo"
              width={200}
              height={50}
              className="h-55 w-55 object-contain"
            />
          </div>
          
          {/* Address + Links */}
          <div className="text-right space-y-1 text-xs p-2">
            <a href="#" className='text-gray-500 md:text-sm text-[0.65rem] tracking-[0.2em]'>{t('Jasmine Real Estate Management and Development Company')}</a>
            <p className="text-gray-500 md:text-sm text-[0.65rem] tracking-[0.1em] mt-2">{t('REGA LICENSE NUMBER #1200018764')}</p>
            <p className="text-gray-500 md:text-sm text-[0.65rem] tracking-[0.1em] mt-2">{t('KW Saudi Arabia HQ - 2740 King Fahad Branch Rd, Al Sahafah, 6403, Riyadh 13515')}</p>
            <div className="flex flex-wrap justify-end gap-2 text-gray-600 md:text-sm text-[0.65rem] tracking-[0.1em] mt-2">
              <a href="#" className="hover:underline  mr-4">{t('© 2026 All Rights Reserved')}</a>
              <div className="w-px h-4 bg-gray-500/50  mt-1"></div>
              <a href="#" className="hover:underline ml-2 mr-4">{t('KW Saudi Arabia')}</a>
              <div className="w-px h-4 bg-gray-500/50 mt-1"></div>
              <a href="http://localhost:5001/privacypolicy		" className="hover:underline ml-2 mr-4">{t('Privacy Policy')}</a>
              <div className="w-px h-4 bg-gray-500/50 mt-1"></div>
              <a href="http://localhost:5001/termsofuse		" className="hover:underline ml-2">{t('Terms Of Use')}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info - Mobile */}
      <div className="w-full bg-gray-100 text-center text-[0.65rem] text-gray-700 md:hidden px-6 pt-4 mt-10 pb-6 space-y-2">
        {/* Links with Logo */}
        <div className="flex justify-center items-center gap-3 font-medium">
          <span>{t('PRIVACY POLICY')}</span>
          <Image
            src="/kwlogo.png"
            alt="KW Logo"
            width={20}
            height={20}
            className="h-6 md:h-8 w-auto object-contain"
          />
          <span>{t('TERMS OF USE')}</span>
        </div>

        {/* Arabic Text */}
        <div className="font-arabic">{t('Keller Williams Saudi Arabia Real Estate Marketing Company')}</div>

        {/* License Number */}
        <div>{t('REGA LICENSE NUMBER : 1200018764')}</div>

        {/* Address */}
        <div>
          {t('KW SAUDI ARABIA HQ - 2740 KING FAHAD BRANCH RD , AL SAHAFAH, 2403 , RIYADH 13315')}
        </div>

        {/* Bottom Text */}
        <div className="text-gray-500 text-[0.6rem] pt-2">{t('© 2024. ALL RIGHTS RESERVED')}</div>
      </div>
    </div>
  );
};

export default Footer;