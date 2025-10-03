// app/TermsofUse/page.js

import TermsofUse from '../../components/TermsofUse'; // client component

// Server-side dynamic metadata
export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/slug/terms-of-use`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch SEO');
    const data = await res.json();

    return {
      title: data.metaTitle || 'Terms of Use - KW Saudi Arabia',
      description: data.metaDescription || 'Terms of Use for KW Saudi Arabia website',
      keywords: data.metaKeywords || 'terms of use, keller williams, saudi arabia',
    };
  } catch (err) {
    // Fallback metadata if API fails
    console.error('Failed to fetch SEO:', err);
    return {
      title: 'Terms of Use - KW Saudi Arabia',
      description: 'Terms of Use for KW Saudi Arabia website',
      keywords: 'terms of use, keller williams, saudi arabia'
    };
  }
}

export default function TermsofUsePage() {
  return <TermsofUse />;
}