import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image 
              src="/mosaic-logo.svg"  // You'll need to add this to public/
              alt="Mosaic Logo" 
              width={96} 
              height={96}
            />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-[#2D3FE7]">Mosaic</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simplify Mantle Smart Contract Development with Modular, Drag-and-Drop Composition
          </p>
        </header>

        <section className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-[#2D3FE7]">Modular Design</h2>
              <p>Easily compose smart contracts by dragging and dropping pre-built components tailored for Mantle.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4 text-[#2D3FE7]">Gas Optimized</h2>
                <p>Leverage Mantle-specific optimizations to reduce transaction costs and improve contract efficiency.</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4 text-[#2D3FE7]">No-Code Deployment</h2>
                <p>Deploy directly to Mantle Mainnet or Sepolia Testnet with just a few clicks.</p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link 
            href="/builder" 
            className="bg-[#2D3FE7] text-white px-8 py-3 rounded-full text-xl hover:bg-[#2D3FE7]/90 transition-colors"
          >
            Start Building
          </Link>
        </div>
      </div>
    </div>
  );
}