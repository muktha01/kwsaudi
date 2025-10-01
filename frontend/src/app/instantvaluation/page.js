


export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/slug/instantvaluation`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch SEO');
    const data = await res.json();
    return {
      title: data.metaTitle || 'Instant Valuation',
      description: data.metaDescription || 'Get your instant property valuation online',
      keywords: data.metaKeywords ? data.metaKeywords.split(',') : ['property', 'valuation', 'instant valuation'],
    };
  } catch {
    return {
      title: 'Instant Valuation',
      description: 'Get your instant property valuation online',
      keywords: ['property', 'valuation', 'instant valuation'],
    };
  }
}

export default function InstantValuationPage() {
  // Import the client component only inside the server component
  const InstantValuationClient = require('./InstantValuationClient').default;
  return <InstantValuationClient />;
}

