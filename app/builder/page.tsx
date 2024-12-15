'use client';

import dynamic from 'next/dynamic';

// Dynamically import to ensure client-side rendering
const MosaicBuilder = dynamic(() => import('../components/MosaicBuilder'), {
  ssr: false
});

export default function BuilderPage() {
  return <MosaicBuilder />;
}