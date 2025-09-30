// app/instantvaluation/page.js

import Sellerguid from './Sellerguid'; // client component

// Server-side dynamic metadata
export async function generateMetadata() {
  try {
    const res = await fetch('http://localhost:5001/api/seo/slug/seller-guide', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch SEO');
    const data = await res.json();

    return {
      title: data.metaTitle || undefined,
      description: data.metaDescription || undefined,
      keywords: data.metaKeywords || undefined,
    };
  } catch (err) {
    // No fallback; metadata will be undefined if API fails
    console.error('Failed to fetch SEO:', err);
    return {};
  }
}

// Server component rendering the client component
export default function Mypage() {
  return <Sellerguid />;
}
