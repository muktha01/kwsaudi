'use client';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import AgentLinksComponent from '@/components/AgentLinksComponent';

export default function AgentLinksPage() {
  return (
    <div>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Agent Resources
            </h1>
            <p className="text-xl text-center max-w-2xl mx-auto">
              Access important tools, calendars, and resources for KW Saudi Arabia agents
            </p>
          </div>
        </div>

        {/* Agent Links Section */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <AgentLinksComponent />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}