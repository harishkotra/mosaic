import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';  // Ensure you have Tailwind CSS configured

export const metadata: Metadata = {
  title: 'Mosaic - Mantle Smart Contract Builder',
  description: 'Simplify smart contract development on Mantle',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/mosaic-logo.svg" 
                alt="Mosaic Logo" 
                width={40} 
                height={40} 
              />
              <span className="text-xl font-bold text-[#2D3FE7]">Mosaic</span>
            </Link>
            <div className="space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-[#2D3FE7] transition-colors"
              >
                🏠 Home
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-gray-600 hover:text-[#2D3FE7] transition-colors"
              >
                🧭 How It Works
              </Link>
              <Link 
                href="/ai-contract-generator" 
                className="text-gray-600 hover:text-[#2D3FE7] transition-colors"
              >
                🤖 AI Generator
              </Link>
              <Link 
                href="/builder" 
                className="bg-[#2D3FE7] text-white px-4 py-2 rounded-full hover:bg-[#2D3FE7]/90 transition-colors"
              >
                🛠️ Builder
              </Link>
            </div>
          </div>
        </nav>
        
        {children}
      </body>
    </html>
  );
}