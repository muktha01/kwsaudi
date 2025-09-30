// app/instantvaluation/page.js


// Server-side dynamic metadata
export async function generateMetadata() {
  try {
  const res = await fetch('http://localhost:5001/api/seo/slug/agent-space', { next: { revalidate: 60 } });
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
import React, { Suspense } from 'react';

export default function Mypage() {
  const AgentProfile = require('./AgentProfile').default;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgentProfile />
    </Suspense>
  );
}
