"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import NewFooter from '@/components/newfooter';
import { useTranslation } from '@/contexts/TranslationContext';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useTranslation();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try localStorage for instant display
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('selectedBlog');
          if (stored) {
            const blogData = JSON.parse(stored);
            if (blogData && blogData._id === id) {
              setBlog(blogData);
            }
          }
        }

        // Select API URL based on language
        const url =
          language === "ar"
            ? `${process.env.NEXT_PUBLIC_API_URL}/news-arabic/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`;

        // Attempt fetch (with retry)
        let res = await fetch(url);
        if (!res.ok && res.status !== 404) {
          // Retry once in case of transient error
          await new Promise((r) => setTimeout(r, 800));
          res = await fetch(url);
        }

        if (res.status === 404) {
          setBlog(null);
          setError(language === "ar" ? "لم يتم العثور على المقالة." : "No news article found.");
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(language === "ar"
          ? "فشل تحميل المقالة. حاول مرة أخرى لاحقًا."
          : "Failed to load news article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id, language]);

  if (loading)
    return (
      <div className="p-8 text-center">
        <div className="text-lg text-gray-600">Loading news article...</div>
      </div>
    );

  if (error && !blog)
    return (
      <div className="p-8 text-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );

  if (!blog)
    return (
      <div className="p-8 text-center">
        <div className="text-lg text-gray-600">No news article found.</div>
      </div>
    );

  return (
    <div>
      <div className="relative p-4 sm:p-6 lg:p-8">
        <Header />
        <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[150px] lg:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

        <div className="relative bg-gray-100 pb-10">
          <div className="pt-32 sm:pt-32 lg:pt-44 mx-4 lg:mx-36">
            <Link
              href="/ourCulture/news"
              className="text-blue-600 hover:underline mb-4 inline-block"
            >
              &larr; {language === "ar" ? "العودة إلى الأخبار" : "Back to News"}
            </Link>

            <h1 className="lg:text-3xl text-2xl font-bold mb-4">
              {blog.title}
            </h1>

            {/* Cover image */}
            <div className="w-full aspect-[4/3] lg:aspect-[14/6] relative mb-6">
              <Image
                src={(() => {
                  const img = blog.coverImage || blog.image;
                  if (img) {
                    const cleanPath = img.replace(/\\/g, "/");
                    return cleanPath.startsWith("http")
                      ? cleanPath
                      : `${process.env.NEXT_PUBLIC_BASE_URL}/${cleanPath}`;
                  }
                  return "/event.png";
                })()}
                alt={blog.title || "Blog image"}
                fill
                className="object-cover"
              />
            </div>

            {/* Description */}
            <div className="text-lg text-gray-800 lg:px-20">
              <div className="mb-4 text-sm text-gray-600">
                {blog.eventDate && (
                  <span>
                    {new Date(blog.eventDate).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                )}
              </div>

              <div
                className="rich-text-content"
                style={{ lineHeight: "1.7" }}
                dangerouslySetInnerHTML={{
                  __html: blog.content || "<p>No content available.</p>",
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

      <NewFooter />
    </div>
  );
}
