import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image 
              src="/mosaic-logo.svg"
              alt="Mosaic Logo" 
              width={96} 
              height={96}
            />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-[#2D3FE7]">Mosaic</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform Complex Smart Contract Development into a Simple, Visual Lego-like Experience
          </p>
        </header>

        {/* Feature Cards */}
        <section className="max-w-4xl mx-auto mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4 text-[#2D3FE7]">Modular Design</h2>
              <p>Easily compose smart contracts by dragging and dropping pre-built components tailored for Mantle.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4 text-[#2D3FE7]">Gas Optimized</h2>
              <p>Leverage Mantle-specific optimizations to reduce transaction costs and improve contract efficiency.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4 text-[#2D3FE7]">No-Code Deployment</h2>
              <p>Deploy directly to Mantle Mainnet or Sepolia Testnet with just a few clicks.</p>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="mb-24">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <Image 
              src="/builder-1.png"
              alt="Mosaic Builder Interface" 
              width={1200} 
              height={675}
              className="w-full"
            />
          </div>
        </section>

        {/* Dual CTA Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Choose Your Building Experience</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              href="/builder" 
              className="bg-[#2D3FE7] text-white px-8 py-4 rounded-xl text-xl hover:bg-[#2D3FE7]/90 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <span className="material-icons">drag_indicator</span>
              Visual Builder
            </Link>
            <Link 
              href="/ai-generator" 
              className="bg-white text-[#2D3FE7] border-2 border-[#2D3FE7] px-8 py-4 rounded-xl text-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <span className="material-icons">smart_toy</span>
              AI Generator
            </Link>
          </div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Whether you prefer drag-and-drop building or AI-powered contract generation,
            Mosaic provides the tools you need to create efficient smart contracts on Mantle.
          </p>
          <Image 
              src="/mantle-logo.avif"
              alt="Mantle Logo" 
              width={96} 
              height={96}
              className='mt-6 text-gray-600 max-w-2xl mx-auto'
            />
        </section>
      </div>
    </div>
  );
}