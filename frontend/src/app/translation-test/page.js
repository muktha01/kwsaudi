'use client'
import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import EnhancedTranslationDebugger from '../../components/EnhancedTranslationDebugger';
import { useTranslation } from '../../contexts/TranslationContext';

const TranslationTestPage = () => {
  const { language, isRTL } = useTranslation();

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      
      <div className="pt-32 pb-16 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Translation System Test Page
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Test Content Section 1 */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-blue-600">
                Real Estate Services
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Welcome to KW Saudi Arabia, your trusted partner in real estate. 
                  We offer comprehensive services for buying, selling, and renting properties.
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Property Search and Listing</li>
                  <li>Market Analysis and Valuation</li>
                  <li>Investment Consultation</li>
                  <li>Property Management</li>
                  <li>Legal and Documentation Support</li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Why Choose Us?</h3>
                  <p className="text-blue-700">
                    With years of experience in the Saudi Arabian real estate market, 
                    we provide professional service and expert guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* Test Content Section 2 */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-green-600">
                Property Types
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Residential</h4>
                  <p className="text-sm text-gray-600">Apartments, Villas, Townhouses</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Commercial</h4>
                  <p className="text-sm text-gray-600">Offices, Retail, Warehouses</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Investment</h4>
                  <p className="text-sm text-gray-600">Income Properties, Land</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Luxury</h4>
                  <p className="text-sm text-gray-600">Premium Properties, Penthouses</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Special Offers</h3>
                <p className="text-yellow-700">
                  Contact us today for exclusive deals and special financing options.
                </p>
                <button className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test Navigation Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Navigation Menu Test</h2>
          <nav className="flex flex-wrap gap-4">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Home</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Buy</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Sell</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Rent</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Agents</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">About Us</a>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contact</a>
          </nav>
        </div>

        {/* Test Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Form Test</h2>
          <form className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Select property type</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Townhouse</option>
                <option>Commercial</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea 
                rows="4"
                placeholder="Tell us about your requirements"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Test Numbers and Special Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Special Content Test</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2" data-no-translate>500+</div>
              <p className="text-gray-600">Properties Sold</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2" data-no-translate>15</div>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2" data-no-translate>1000+</div>
              <p className="text-gray-600">Happy Clients</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Mixed Content Test:</h3>
            <p>
              Visit our website at <span data-no-translate>https://kwsaudi.com</span> or 
              email us at <span data-no-translate>info@kwsaudi.com</span>. 
              Call us at <span data-no-translate>+966 11 123 4567</span> for immediate assistance.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Enhanced Translation Debugger */}
      <EnhancedTranslationDebugger />
    </div>
  );
};

export default TranslationTestPage;