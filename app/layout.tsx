import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';

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
  // Get current year for the copyright notice
  const currentYear = new Date().getFullYear();
  
  // Array of funny emoji combinations for the copyright
  const funnyEmojis = ['🧙‍♂️', '🚀', '✨', '💫'];
  
  // Get a random emoji from the array
  const randomEmoji = funnyEmojis[Math.floor(Math.random() * funnyEmojis.length)];

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Navigation */}
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

        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Left side - Links */}
              <div className="flex space-x-6 text-sm text-gray-600">
                <a 
                  href="https://docs.mantle.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#2D3FE7] transition-colors"
                >
                <Image 
                  src="/mantle-logo.avif"
                  alt="Mantle Logo" 
                  width={96} 
                  height={96}
                  className='text-gray-600 max-w-2xl mx-auto'
                /></a>
                <a 
                  href="https://github.com/harishkotra/mosaic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#2D3FE7] transition-colors"
                >
                &nbsp;&nbsp;GitHub
                </a>
                
              </div>
              
              {/* Right side - Copyright */}
              <div className="text-sm text-gray-600">
                <p className="text-center md:text-right">
                  {randomEmoji} Crafted with code and chaos by Harish Kotra
                  <br />
                  Copydown © {currentYear} - All bugs are features in disguise ✨
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}