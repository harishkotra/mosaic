'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Wand2, Download, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Network configurations
// const NETWORKS = {
//     mantleTestnet: {
//         chainId: '0x138B', // 5003 in hex
//         rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
//         chainName: 'Mantle Sepolia Testnet',
//         nativeCurrency: {
//             name: 'MNT',
//             symbol: 'MNT',
//             decimals: 18
//         },
//         blockExplorerUrls: ['https://sepolia.mantlescan.xyz']
//     },
//     mantle: {
//         chainId: '0x1388', // 5000 in hex
//         rpcUrls: ['https://rpc.mantle.xyz'],
//         chainName: 'Mantle',
//         nativeCurrency: {
//             name: 'MNT',
//             symbol: 'MNT',
//             decimals: 18
//         },
//         blockExplorerUrls: ['https://mantlescan.xyz']
//     }
// };

export default function AIContractGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<{
    type: 'error' | 'success' | 'info' | null,
    message: string | React.ReactNode
  }>(null);

  // Generate Contract Function (existing implementation)
  const generateContract = async () => {
    if (!prompt.trim()) {
      toast.error('Please provide a contract description');
      return;
    }

    setIsLoading(true);
    setGeneratedContract('');
    setDeploymentStatus(null);

    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.contract) {
        setGeneratedContract(data.contract);
        toast.success('Contract generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate contract');
      }
    } catch (error) {
      console.error('Contract generation error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy Contract Function (existing implementation)
  const copyContract = () => {
    navigator.clipboard.writeText(generatedContract);
    toast.success('Contract copied to clipboard');
  };

  // Save Contract Locally
  const saveContractLocally = () => {
    if (!generatedContract) {
      toast.error('No contract to save');
      return;
    }

    const blob = new Blob([generatedContract], { type: 'text/plain' });
    const filename = `Mantle_Contract_${new Date().toISOString().replace(/[:.]/g, '_')}.sol`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    toast.success(`Contract saved as ${filename}`);
  };

  // Load Contract Locally
  const loadContractLocally = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setGeneratedContract(text);
        toast.success('Contract loaded successfully');
      };
      reader.readAsText(file);
    }
  };

//   // Deployment Function
//   const deployContract = async (isTestnet: boolean) => {
//     if (!generatedContract) {
//       toast.error('Generate a contract first');
//       return;
//     }

//     try {
//       // Check if MetaMask is installed
//       if (!window.ethereum) {
//         toast.error('Please install MetaMask to deploy contracts');
//         return;
//       }

//       // Request account access
//       await window.ethereum.request({ method: 'eth_requestAccounts' });

//       // Set deployment status
//       setDeploymentStatus({
//         type: 'info',
//         message: `Deploying to ${isTestnet ? 'Sepolia Testnet' : 'Mantle Mainnet'}...`
//       });

//       // Select network based on testnet flag
//       const network = isTestnet ? NETWORKS.mantleTestnet : NETWORKS.mantle;

//       // Switch to the correct network
//       try {
//         await window.ethereum.request({
//           method: 'wallet_switchEthereumChain',
//           params: [{ chainId: network.chainId }],
//         });
//       } catch (switchError: any) {
//         // If the network isn't added, add it
//         if (switchError.code === 4902) {
//           await window.ethereum.request({
//             method: 'wallet_addEthereumChain',
//             params: [{
//               chainId: network.chainId,
//               chainName: network.chainName,
//               nativeCurrency: network.nativeCurrency,
//               rpcUrls: network.rpcUrls,
//               blockExplorerUrls: network.blockExplorerUrls
//             }],
//           });
//         }
//       }

//       // Create provider and signer
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();

//       // Simplified contract deployment (you might want to improve compilation)
//       const factory = new ethers.ContractFactory(
//         [], // ABI (placeholder)
//         `0x${Buffer.from(generatedContract).toString('hex')}`, // Very basic bytecode conversion
//         signer
//       );

//       const contract = await factory.deploy();
//       const deployedContract = await contract.deployTransaction.wait();

//       // Update deployment status
//       setDeploymentStatus({
//         type: 'success',
//         message: (
//           <>
//             Contract deployed successfully! 
//             <a 
//               href={`${network.blockExplorerUrls[0]}/address/${deployedContract.contractAddress}`} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="ml-2 text-blue-600 underline"
//             >
//               View on Explorer
//             </a>
//           </>
//         )
//       });

//     } catch (error: any) {
//       console.error('Deployment error:', error);
      
//       const errorMessage = error.code === 4001 
//         ? 'Transaction rejected by user' 
//         : error.message.includes('insufficient funds')
//         ? 'Insufficient MNT balance for gas fees'
//         : 'Deployment failed';

//       setDeploymentStatus({
//         type: 'error',
//         message: `Deployment error: ${errorMessage}`
//       });
//     }
//   };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#2D3FE7]">
        AI Smart Contract Generator for Mantle
      </h1>

      {/* Deployment Status Alert */}
      {deploymentStatus && (
        <div className={`
          mb-4 p-4 rounded-lg flex items-center
          ${deploymentStatus.type === 'error' ? 'bg-red-100 text-red-800' : 
            deploymentStatus.type === 'success' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'}
        `}>
          <AlertCircle className="mr-2 h-5 w-5" />
          {deploymentStatus.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Prompt Input Card (existing implementation) */}
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter a detailed description of the smart contract you want to generate. 
              Example: 'Create an ERC20 token with minting and burning capabilities, 
              implement role-based access control, and add Mantle-specific gas optimizations.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="mt-4 flex space-x-4">
              <Button 
                onClick={generateContract} 
                disabled={isLoading}
                className="bg-[#2D3FE7] hover:bg-[#2D3FE7]/90"
              >
                {isLoading ? 'Generating...' : 'Generate Contract'}
                <Wand2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Contract Preview Card (existing implementation) */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Contract</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedContract ? (
              <>
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={copyContract}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <SyntaxHighlighter 
                    language="solidity" 
                    style={materialOceanic}
                    customStyle={{ 
                      maxHeight: '500px', 
                      overflowY: 'auto' 
                    }}
                  >
                    {generatedContract}
                  </SyntaxHighlighter>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Your AI-generated contract will appear here
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <Button 
          onClick={saveContractLocally}
          variant="outline"
          disabled={!generatedContract}
        >
          <Download className="mr-2 h-4 w-4" /> Save Contract
        </Button>
        
        <input 
          type="file" 
          id="contract-upload" 
          className="hidden" 
          accept=".sol"
          onChange={loadContractLocally}
        />
        <Button 
          onClick={() => document.getElementById('contract-upload')?.click()}
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" /> Load Contract
        </Button>

        {/* <Button 
          onClick={() => deployContract(true)}
          disabled={!generatedContract}
          variant="outline"
        >
          Deploy to Testnet
        </Button>
        <Button 
          onClick={() => deployContract(false)}
          disabled={!generatedContract}
          className="bg-[#2D3FE7] hover:bg-[#2D3FE7]/90"
        >
          Deploy to Mainnet
        </Button> */}
      </div>
      
      <div className="mt-8 bg-blue-50/50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-semibold mb-4 text-[#2D3FE7]">
            Mantle-Specific Contract Prompt Ideas
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
            {
                title: "Cross-Chain Token Bridge",
                prompt: "Design a cross-chain ERC20 token bridge between Mantle L1 and L2, implementing secure proof verification and gas-optimized transfer mechanisms."
            },
            {
                title: "Meta Transaction Gasless Wallet",
                prompt: "Create a meta-transaction enabled wallet contract for Mantle that allows gasless transactions, with nonce management and signature verification using Mantle's gas price oracle."
            },
            {
                title: "Dynamic Gas Price NFT Marketplace",
                prompt: "Develop an NFT marketplace contract that dynamically adjusts listing fees based on Mantle's current gas price oracle, with built-in royalty mechanisms and role-based access control."
            },
            {
                title: "Yield Farming with Mantle Optimization",
                prompt: "Implement a yield farming contract that leverages Mantle's low-gas architecture, including staking, reward distribution, and adaptive reward calculations."
            },
            {
                title: "Governance Token with Delegation",
                prompt: "Design a governance token contract for a DAO on Mantle, implementing token delegation, voting power calculation, and proposal execution with gas-efficient mechanisms."
            },
            {
                title: "Insurance Pool with Risk Management",
                prompt: "Create a decentralized insurance pool contract on Mantle with dynamic risk assessment, premium calculation, and claim verification using role-based access controls."
            },
            {
                title: "Multi-Signature Treasury Management",
                prompt: "Develop a multi-signature treasury management contract optimized for Mantle, with configurable signers, transaction thresholds, and gas-efficient execution."
            },
            {
                title: "Subscription Service Contract",
                prompt: "Build a gas-optimized subscription service contract that supports recurring payments, automatic renewals, and Mantle-specific fee management."
            },
            {
                title: "Decentralized Identity Verification",
                prompt: "Design a decentralized identity verification contract on Mantle that allows secure, non-transferable identity tokens with role-based access and privacy features."
            },
            {
                title: "Automated Liquidity Management",
                prompt: "Create an automated liquidity management contract for decentralized exchanges on Mantle, implementing dynamic fee tiers and gas-optimized rebalancing strategies."
            },
            {
                title: "Carbon Credit Trading Platform",
                prompt: "Develop a carbon credit trading platform contract on Mantle with verifiable carbon offset tracking, transparent trading mechanisms, and role-based administrative controls."
            },
            {
                title: "Fractional Real Estate Tokenization",
                prompt: "Design a fractional real estate tokenization contract that supports secure token minting, dividend distribution, and Mantle-optimized transfer mechanisms."
            }
            ].map((example, index) => (
            <Button 
                key={index} 
                variant="outline" 
                className="w-full text-left justify-start hover:bg-blue-100"
                onClick={() => setPrompt(example.prompt)}
            >
                <span className="font-semibold mr-2">🧩</span>
                {example.title}
            </Button>
            ))}
        </div>
      </div>

      {/* Guidance Section */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-[#2D3FE7]">
          Tips for Best Results
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Be as specific as possible about your contract&apos;s requirements</li>
          <li>Include details about token type, access control, and special features</li>
          <li>Mention any Mantle-specific optimizations you need</li>
          <li>Describe the contract&apos;s purpose and core functionality</li>
        </ul>
      </div>

      
    </div>
  );
}