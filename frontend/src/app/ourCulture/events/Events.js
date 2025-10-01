'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import Footer from '@/components/newfooter';
import { FiSearch } from 'react-icons/fi';
import Box from '@/components/box';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useTranslation } from '@/contexts/TranslationContext';

// Utility function to strip HTML tags and get plain text
const stripHtmlTags = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export default function Events(){
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroSrc, setHeroSrc] = useState('/');
  const router = useRouter();
 const [page, setPage] = useState('');
  // Add page translation hooks for proper translation
  // const { language, isTranslating } = usePageTranslation();
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
       
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setBlogs(data);
        console.log(data.coverImage);
        
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/events`);
        if (!res.ok) return;
        const page = await res.json();
        setPage(page)
        if (page?.backgroundImage) {
           const cleanPath = page.backgroundImage.replace(/\\/g, '/');
        setHeroSrc(
          cleanPath.startsWith('http')
            ? cleanPath
            : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`
        );
        }
      
      } catch (e) {
        console.error('Error fetching page hero:', e);
      }
    };
    fetchPageHero();
  }, []);

  const handleReadMore = (post) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedEvent', JSON.stringify(post));
      router.push(`/ourCulture/events/${post._id}`);
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen ${isRTL ? 'font-arabic' : ''}`}>
      <Header />
      
      <Box
        h3={page.backgroundOverlayContent}
        src={heroSrc}
      />
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-gray-600">
            {t("Loading events...")}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-red-600 text-center">
            {t(error)}
          </div>
        </div>
      )}

      {/* Blog Cards */}
      {!loading && !error && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 p-4 md:px-40`}>
          {blogs.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-lg text-gray-600">
                {t("No events found.")}
              </div>
            </div>
          ) : (
            blogs.map((post, index) => (
              <div
                key={post._id || index}
                className="bg-white shadow-lg  overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="w-full h-60 bg-gray-200 relative">
                 <Image
  src={
    post.coverImage
      ? (() => {
          const cleanPath = post.coverImage.replace(/\\/g, "/");
          return cleanPath.startsWith("http")
            ? cleanPath
            : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
        })()
      : "/event.png"
  }
  alt={post.title || t("Event")}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

                </div>

                <div className={`p-4 flex flex-col flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
                  {post.createdAt && (
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(post.createdAt).toLocaleDateString(
                        isRTL ? 'ar-SA' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }
                      )}
                    </p>
                  )}
                  <h3 className="md:text-2xl text-xl mb-2 font-semibold line-clamp-2">
                    {t(post.title)}
                  </h3>
                  <p className="text-gray-600 text-base line-clamp-3 mb-3">
                    {t(post.description)}
                  </p>

                  <button
                    onClick={() => handleReadMore(post)}
                    className="mt-auto w-full px-4 py-2 bg-[rgb(206,32,39)] text-white transition-colors text-base font-semibold hover:bg-[rgb(180,28,35)] "
                  >
                    {t("Read More")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

