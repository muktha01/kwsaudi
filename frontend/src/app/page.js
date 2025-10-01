// app/instantvaluation/page.js


// Server-side dynamic metadata
export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/slug/home-page`, { next: { revalidate: 60 } });
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
import Home from './Home';

export default function Mypage() {
  return <Home/>;
}
