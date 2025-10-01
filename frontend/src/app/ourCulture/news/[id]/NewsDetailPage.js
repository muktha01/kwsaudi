"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import NewFooter from '@/components/newfooter'
import { useTranslation } from '@/contexts/TranslationContext';
export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, isRTL } = useTranslation()
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to get from localStorage (for immediate display)
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('selectedBlog');
          if (stored) {
            const blogData = JSON.parse(stored);
            if (blogData && blogData._id === id) {
              setBlog(blogData);
            }
          }
        }

        // Fetch fresh data from API
        console.log('Fetching news with ID:', id);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/News/${id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const blogData = await res.json();
        console.log('API Response:', blogData);
        setBlog(blogData);
        
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load news article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) return (
    <div className="p-8 text-center">
      <div className="text-lg text-gray-600">Loading news article...</div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <div className="text-lg text-red-600">{error}</div>
    </div>
  );

  if (!blog) return (
    <div className="p-8 text-center">
      <div className="text-lg text-gray-600">No blog found.</div>
    </div>
  );

  return (
    <div>
      <div>
    <div className="relative p-4 sm:p-6 md:p-8">
      <Header />

      <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

      <div className="relative bg-gray-100 pb-10">
      <div className="pt-32 sm:pt-32 md:pt-44 mx-4 md:mx-36">
        <Link href="/ourCulture/news" className="text-blue-600 hover:underline mb-4 inline-block">&larr; {t("Back to News")}</Link>
        <h1 className="md:text-3xl text-2xl font-bold mb-4">{blog.title}</h1>
        
        {/* Article Metadata */}
        
        <div className="w-full aspect-[4/3] md:aspect-[14/6] relative mb-6">
  <Image
  src={
    blog.coverImage
      ? (() => {
          const cleanPath = blog.coverImage.replace(/\\/g, "/");
          return cleanPath.startsWith("http")
            ? cleanPath
            : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
        })()
      : "/event.png"
  }
  alt={blog.title || "Blog image"}
  fill
  className="object-cover"
/>

</div>

        <div className="text-lg text-gray-800 md:px-20 md:mt-20">
          <div className="mb-4 text-sm text-gray-600">
            {blog.location && <span>{blog.location} • </span>}
            {blog.eventDate && (
              <span>
                {new Date(blog.eventDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
          <div 
            className="rich-text-content"
            style={{
              lineHeight: '1.7',
            }}
            dangerouslySetInnerHTML={{ 
              __html: blog.content || '<p>No content available.</p>' 
            }}
          />
          
          <style jsx global>{`
            .rich-text-content h1 {
              font-size: 1.5rem;
              font-weight: bold;
              margin: 0.5em 0;
              color: inherit;
            }
            .rich-text-content h2 {
              font-size: 1.25rem;
              font-weight: bold;
              margin: 0.5em 0;
              color: inherit;
            }
            .rich-text-content h3 {
              font-size: 1.1rem;
              font-weight: bold;
              margin: 0.5em 0;
              color: inherit;
            }
            .rich-text-content p {
              margin: 0.5em 0;
            }
            .rich-text-content ul,
            .rich-text-content ol {
              padding-left: 1.5rem;
              margin: 0.5em 0;
            }
            .rich-text-content li {
              margin-bottom: 0.25em;
            }
            .rich-text-content strong {
              font-weight: bold;
            }
            .rich-text-content em {
              font-style: italic;
            }
            .rich-text-content u {
              text-decoration: underline;
            }
          `}</style>
        </div>

      </div>
    </div>
    </div>
    </div>
    <NewFooter></NewFooter>
        </div>
  );
} 