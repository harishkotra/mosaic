import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Code2, 
  Cpu, 
  GanttChartSquare,
  ArrowRight,
  Blocks,
  Bot,
  Zap
} from 'lucide-react';

const MosaicLanding = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  const features = [
    {
      icon: <Code2 className="h-8 w-8 text-[#2D3FE7]" />,
      title: 'Component Library',
      description: 'Pre-built, audited smart contract components optimized for Mantle Network'
    },
    {
      icon: <GanttChartSquare className="h-8 w-8 text-[#2D3FE7]" />,
      title: 'Visual Builder',
      description: 'Drag and drop interface to compose your contract with no coding required'
    },
    {
      icon: <Building2 className="h-8 w-8 text-[#2D3FE7]" />,
      title: '1-Click Deploy',
      description: 'Deploy directly to Mantle Network or Testnet with automatic gas optimization'
    },
    {
      icon: <Cpu className="h-8 w-8 text-[#2D3FE7]" />,
      title: 'Built for Mantle',
      description: 'Optimized for Mantle V2 with support for meta-transactions and native MNT gas'
    }
  ];

  const steps = [
    {
      icon: <Blocks className="h-6 w-6" />,
      title: 'Select Components',
      description: 'Browse our library of pre-built components including ERC20, NFTs, access control and more'
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'Customize & Compose',
      description: 'Drag and drop components to build your contract. Each component is pre-configured for Mantle'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Deploy & Go Live',
      description: 'Deploy to Mantle Testnet or Mainnet with one click. No complex configuration needed'
    }
  ];

  if (showBuilder) {
    return <MosaicBuilder />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-[#2D3FE7] p-2 rounded-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h7v7H3V3z" fill="white"/>
                  <path d="M14 3h7v7h-7V3z" fill="white"/>
                  <path d="M14 14h7v7h-7v-7z" fill="white"/>
                  <path d="M3 14h7v7H3v-7z" fill="white"/>
                </svg>
              </div>
              <span className="text-xl font-bold">Mosaic</span>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                How it Works
              </a>
              <button
                onClick={() => setShowBuilder(true)}
                className="bg-[#2D3FE7] text-white px-6 py-2 rounded-lg hover:bg-[#2D3FE7]/90 transition-colors"
              >
                Launch Builder
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Build Mantle Smart Contracts<br />Without Code
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Mosaic is a visual smart contract builder for Mantle Network. Compose secure,
            gas-optimized contracts from pre-built components and deploy with one click.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBuilder(true)}
            className="bg-[#2D3FE7] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#2D3FE7]/90 transition-colors inline-flex items-center space-x-2"
          >
            <span>Start Building</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                {feature.icon}
                <h3 className="text-lg font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#2D3FE7]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#2D3FE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-xl opacity-90 mb-8">
              Start building secure smart contracts on Mantle Network today
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBuilder(true)}
              className="bg-white text-[#2D3FE7] px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <span>Launch Builder</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MosaicLanding;