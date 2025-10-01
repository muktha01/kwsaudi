// app/instantvaluation/page.js


// Server-side dynamic metadata
export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/slug/property-details`, { cache: 'no-store' });
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
  const PropertyListing = require('./PropertyListing').default;
  return <PropertyListing />;
}
