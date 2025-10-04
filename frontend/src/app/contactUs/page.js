// app/contactUs/page.js
import { generateHreflangMetadata, getLanguageFromParams } from '@/utils/hreflang';
import Contact from './Contact'; // client component

// Server-side dynamic metadata with hreflang support
export async function generateMetadata({ searchParams }) {
  const lang = await getLanguageFromParams(searchParams);
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/slug/contact-us`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch SEO');
    const data = await res.json();

    return {
      title: data.metaTitle || undefined,
      description: data.metaDescription || undefined,
      keywords: data.metaKeywords || undefined,
      ...generateHreflangMetadata('/contactUs', lang), // Add hreflang tags
    };
  } catch (err) {
    // Fallback with hreflang even if SEO API fails
    console.error('Failed to fetch SEO:', err);
    return {
      ...generateHreflangMetadata('/contactUs', lang),
    };
  }
}

// Server component rendering the client component
export default function Mypage() {
  return <Contact />;
}
