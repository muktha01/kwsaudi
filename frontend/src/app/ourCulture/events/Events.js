'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { eventsArabicApi } from './events-arabicApi';
// import { cache } from '@/utils/hybridCache';

// Utility function to strip HTML tags and get plain text
const stripHtmlTags = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export default function EventsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
  const [hasSwitchedToArabic, setHasSwitchedToArabic] = useState(false);
  const router = useRouter();
  const { t, isRTL, language } = useTranslation();

  // Fetch events based on current language on mount and when language changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;
        if (language === 'ar') {
          data = await eventsArabicApi.getAllEvents();
        } else {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          data = await res.json();
        }
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [language]);

  // Fetch hero image & overlay text
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/slug/events`);
        if (!res.ok) return;
        const pageData = await res.json();
        setPage(pageData);

        if (pageData?.backgroundImage) {
          const cleanPath = pageData.backgroundImage.replace(/\\/g, '/');
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

  // Navigate to single event
  const handleReadMore = (post) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedEvent', JSON.stringify(post));
      router.push(`/ourCulture/events/${post._id}`);
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen ${isRTL ? 'font-arabic' : ''}`}>
      <Header />

      <Box h3={page.backgroundOverlayContent} src={heroSrc} />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-gray-600">{t('Loading events...')}</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-red-600 text-center">{t(error)}</div>
        </div>
      )}

      {/* Blog Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-4 mx-10 sm:mx-10 md:mx-10 lg:mx-10 xl:mx-36 2xl:mx-36">
          {blogs.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-lg text-gray-600">{t('No events found.')}</div>
            </div>
          ) : (
            blogs.map((post, index) => (
              <div
                key={post._id || index}
                className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="w-full h-60 bg-gray-200 relative">
                  <Image
                    src={(() => {
                      const img = post.coverImage || post.image;
                      if (img) {
                        const cleanPath = img.replace(/\\/g, '/');
                        return cleanPath.startsWith('http')
                          ? cleanPath
                          : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
                      }
                      return '/event.png';
                    })()}
                    alt={post.title || t('Event')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className={`p-4 flex flex-col flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
                  {(post.createdAt || post.date) && (
                    <p className="text-xs text-gray-500 mb-1">
                      {(() => {
                        const dateVal = post.startDate || post.date || post.createdAt;
                        if (!dateVal) return null;
                        try {
                          return new Date(dateVal).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          });
                        } catch {
                          return dateVal;
                        }
                      })()}
                    </p>
                  )}
                  {(() => {
                    const timeVal = post.time || post.time_ar || post.eventTime || post.startTime || '';
                    if (typeof timeVal === 'string' && timeVal.trim()) {
                      return (
                        <p className="text-xs text-gray-500 mb-3">{timeVal.trim()}</p>
                      );
                    }
                    return null;
                  })()}
                  <h3 className="lg:text-2xl text-xl mb-2 font-semibold line-clamp-2">
                    {t(post.title)}
                  </h3>
                  <p className="text-gray-600 text-base line-clamp-3 mb-3">
                    {stripHtmlTags(t(post.description))}
                  </p>

                  <button
                    onClick={() => handleReadMore(post)}
                    className="mt-auto w-full px-4 py-2 bg-[rgb(206,32,39)] text-white transition-colors text-base font-semibold hover:bg-[rgb(180,28,35)]"
                  >
                    {t('Read More')}
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
}
