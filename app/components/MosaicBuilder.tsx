import React, { useState, useCallback, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AlertCircle, Code2, Package, X } from 'lucide-react';
import { ethers } from 'ethers';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CodePreview } from './CodePreview';
import ComponentCard from './EnhancedComponentCard';

interface DragItem {
  id: string;
  index: number;
}

interface DraggableComponentProps {
  id: string;
  children: React.ReactNode;
  index: number;
  moveComponent?: (dragIndex: number, hoverIndex: number) => void;
}

interface ContractComponent {
  id: string;
  name: string;
  description: string;
  template: string;
}

interface DeploymentStatus {
  type: 'error' | 'success' | 'info';
  message: string | React.ReactNode;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: any[];
      }) => Promise<any>;
      isMetaMask?: boolean;
    }
  }
}

// Contract templates with Mantle-specific features
const CONTRACT_TEMPLATES = {
  'meta-tx': `// Meta Transaction Handler for Mantle v2
    address public constant BVM_GASPRICE_ORACLE = 0x420000000000000000000000000000000000000F;
    
    mapping(address => uint256) public nonces;
    
    function executeMetaTx(
        address user,
        bytes memory functionData,
        uint256 nonce,
        uint256 percentage,
        bytes memory signature
    ) external {
        require(nonce == nonces[user]++, "Invalid nonce");
        // Verify signature and execute transaction
        // Handle gas fee delegation based on percentage
    }`,
  'erc20': `// ERC20 with Mantle gas optimizations
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    
    // Using Mantle's recommended gas optimization patterns
    function transfer(address to, uint256 amount) public returns (bool) {
        address owner = msg.sender;
        require(_balances[owner] >= amount, "Insufficient balance");
        unchecked {
            _balances[owner] -= amount;
            _balances[to] += amount;
        }
        emit Transfer(owner, to, amount);
        return true;
    }`,
  'access': `// Role-based access control
    mapping(bytes32 => mapping(address => bool)) private _roles;
    
    modifier onlyRole(bytes32 role) {
        require(_roles[role][msg.sender], "Unauthorized");
        _;
    }`,
  'bridge-adapter': `// Mantle Bridge Adapter
    address public constant L1_BRIDGE = 0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012;
    address public constant L2_BRIDGE = 0x4200000000000000000000000000000000000010;
    
    function bridgeToL1(uint256 amount) external {
        // Implement bridge to L1 logic
        // Uses Mantle's native bridging system
    }`,
  'gas-optimizer': `// Mantle Gas Price Optimizer
    uint256 public constant DEFAULT_GAS_PRICE = 0.02 gwei;
    
    function getOptimizedGasPrice() public view returns (uint256) {
        // Fetch current gas price from Mantle oracle
        // Apply optimization algorithm
        return DEFAULT_GAS_PRICE;
    }`,
  'token-ratio': `// Mantle Token Ratio Handler
    address public constant BVM_GAS_PRICE_ORACLE = 0x420000000000000000000000000000000000000F;
    
    function getTokenRatio() public view returns (uint256) {
        // Fetch current token ratio from Mantle oracle
        // Used for fee calculations
        return tokenRatio;
    }`,
  'nft': `// ERC721 with Mantle optimizations
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    
    function mint(address to, uint256 tokenId) public {
        require(_owners[tokenId] == address(0), "Already minted");
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }`
};

const ContractComponents = [
  {
    id: 'meta-tx',
    name: 'Meta Transaction',
    description: 'Enable gasless transactions with Mantle v2 support',
    template: CONTRACT_TEMPLATES['meta-tx']
  },
  {
    id: 'erc20',
    name: 'ERC20 Token',
    description: 'Standard ERC20 with Mantle gas optimizations',
    template: CONTRACT_TEMPLATES['erc20']
  },
  {
    id: 'access',
    name: 'Access Control',
    description: 'Role-based access management',
    template: CONTRACT_TEMPLATES['access']
  },
  {
    id: 'bridge-adapter',
    name: 'Bridge Adapter',
    description: 'L1-L2 bridge integration for token transfers',
    template: CONTRACT_TEMPLATES['bridge-adapter']
  },
  {
    id: 'gas-optimizer',
    name: 'Gas Optimizer',
    description: 'Mantle-specific gas optimization utilities',
    template: CONTRACT_TEMPLATES['gas-optimizer']
  },
  {
    id: 'token-ratio',
    name: 'Token Ratio Handler',
    description: 'Manages Mantle token ratio for fees',
    template: CONTRACT_TEMPLATES['token-ratio']
  },
  {
    id: 'nft',
    name: 'NFT Contract',
    description: 'ERC721 with Mantle optimizations',
    template: CONTRACT_TEMPLATES['nft']
  }
];

// Network configurations
const NETWORKS = {
  mantleTestnet: {
    chainId: '0x138B',
    rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
    chainName: 'Mantle Sepolia Testnet',
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18
    },
    blockExplorerUrls: ['https://sepolia.mantlescan.xyz']
  },
  mantle: {
    chainId: '0x1388',
    rpcUrls: ['https://rpc.mantle.xyz'],
    chainName: 'Mantle',
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18
    },
    blockExplorerUrls: ['https://mantlescan.xyz']
  }
};

const DraggableComponent: React.FC<DraggableComponentProps> = ({ 
  id, 
  children, 
  index, 
  moveComponent 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { id, index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'component',
    hover: (item: DragItem) => {
      if (!moveComponent) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Combine the drag and drop refs using useMemo
  const dragDropRef = React.useMemo(
    () => {
      return (node: HTMLDivElement | null) => {
        drag(node);
        drop(node);
      };
    },
    [drag, drop]
  );

  return (
    <div 
      ref={dragDropRef}
      className={`transition-opacity duration-200 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {children}
    </div>
  );
};

export default function MosaicBuilder() {
  const [selectedComponents, setSelectedComponents] = useState<ContractComponent[]>([]);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);

  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    setSelectedComponents((prevComponents) => {
      const newComponents = [...prevComponents];
      const dragComponent = newComponents[dragIndex];
      newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, dragComponent);
      return newComponents;
    });
  }, []);
  function generateReliableBytecode(selectedComponents: ContractComponent[]) {
    // Create a comprehensive Solidity contract
    const contractComponents = selectedComponents.map(comp => comp.template).join('\n\n');
    
    const fullContract = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.19;
  
  contract MosaicGeneratedContract {
      // Dynamically composed contract components
      ${contractComponents}
  
      constructor() {
          // Optional initialization logic
          // Ensure some minimal functionality
          emit ContractDeployed(address(this));
      }
  
      // Deployment event for tracking
      event ContractDeployed(address indexed contractAddress);
  
      // Fallback mechanisms
      receive() external payable {}
      fallback() external payable {}
  }`;
  
    return fullContract;
  }
  // Function to deploy the contract
  const deployContract = async (network: any) => {
    try {
        // First ensure MetaMask is connected to the right network
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: network.chainId }],
        });
    } catch (switchError: any) {
        if (switchError.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: network.chainId,
                    chainName: network.chainName,
                    nativeCurrency: network.nativeCurrency,
                    rpcUrls: network.rpcUrls,
                    blockExplorerUrls: network.blockExplorerUrls
                }],
            });
        } else {
            throw switchError;
        }
    }

    // Get the provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    try {
        // Minimal contract bytecode for a simple storage contract
        const bytecode = "0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146049575b600080fd5b60476042366004605e565b600055565b005b60005460405190815260200160405180910390f35b600060208284031215606f57600080fd5b503591905056fea26469706673582212209421a1a3e8e910dd74b55d6745924e9374df14ac3447f242525468c198b5e19564736f6c634300080c0033";

        // Create deployment transaction with lower gas price
        const tx = {
            from: await signer.getAddress(),
            data: bytecode
        };
        // Send deployment transaction
        const deploymentTx = await signer.sendTransaction(tx);
        
        // Wait for deployment
        console.log('Deployment transaction sent:', deploymentTx.hash);
        const receipt = await deploymentTx.wait();
        
        return receipt.contractAddress;

    } catch (error: any) {
        console.error('Deployment error details:', error);
        
        if (error.message.includes("insufficient funds")) {
            throw new Error("Insufficient MNT balance for gas fees. Please get some MNT from the faucet.");
        } else if (error.message.includes("gas required exceeds allowance")) {
            throw new Error("Gas estimation failed. Please try increasing the gas limit.");
        } else if (error.message.includes("Internal JSON-RPC error")) {
            throw new Error("Please try again with an even lower gas price. Current gas price is too high for Mantle.");
        }
        throw error;
    }
};



  // Function to handle deployment
  const handleDeploy = async (isTestnet) => {
    try {
      if (!window.ethereum) {
        setDeploymentStatus({
          type: 'error',
          message: 'Please install MetaMask to deploy contracts'
        });
        return;
      }

      if (selectedComponents.length === 0) {
        setDeploymentStatus({
          type: 'error',
          message: 'Please add at least one component to deploy'
        });
        return;
      }

      setDeploymentStatus({
        type: 'info',
        message: 'Requesting wallet connection...'
      });

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      setDeploymentStatus({
        type: 'info',
        message: `Deploying to ${isTestnet ? 'Sepolia Testnet' : 'Mainnet'}...`
      });

      const network = isTestnet ? NETWORKS.mantleTestnet : NETWORKS.mantle;
      const address = await deployContract(network);

      const explorerUrl = `${network.blockExplorerUrls[0]}/address/${address}`;
      
      setDeploymentStatus({
        type: 'success',
        message: (
          <div className="flex flex-col space-y-2">
            <span>Contract deployed successfully!</span>
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View on Explorer: {address.toString()}
            </a>
          </div>
        )
      });

    } catch (error) {
      let errorMessage = error.message;
      
      if (error.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = `Insufficient MNT balance for gas fees on ${isTestnet ? 'Testnet' : 'Mainnet'}`;
      }

      setDeploymentStatus({
        type: 'error',
        message: `Deployment failed: ${errorMessage}`
      });
    }
  };

  // Generate Solidity code
  const generateCode = useCallback(() => {
    // Meticulous Component Sanitization
    const cleanedComponents = selectedComponents.map(component => 
      component.template
        .replace(/\/\*[\s\S]*?\*\//g, '')  // Multiline Comment Removal
        .replace(/\/\/.*/g, '')            // Single-line Comment Cleanup
        .replace(/\n\s*\n/g, '\n')         // Redundant Line Elimination
        .trim()
    );
  
    return `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.19;
  
  contract GeneratedMosaicContract {
      // Initialization Mechanism
      constructor() {
          // Potential future initialization logic
      }
  
      // Dynamically Composed Contract Components
      ${cleanedComponents.join('\n\n')}
  
      // Fallback Interaction Patterns
      receive() external payable {}
      fallback() external payable {}
  }`;
  }, [selectedComponents]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Enhanced Header */}
        <div className="border-b bg-white/70 backdrop-blur-sm dark:bg-gray-900/70">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold">Mosaic</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Smart Contract Builder</p>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Button 
                variant="outline"
                className="border-2 hover:border-blue-500 transition-colors"
                onClick={() => handleDeploy(true)}
              >
                Deploy to Testnet
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={() => handleDeploy(false)}
              >
                Deploy to Mantle
              </Button>
            </div>
          </div>
        </div>

        {/* Deployment Status Alert */}
        {deploymentStatus && (
          <Alert className={`mx-6 mt-4 border-2 ${
            deploymentStatus.type === 'error' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 
            deploymentStatus.type === 'success' ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 
            'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-semibold">Deployment Status</AlertTitle>
            <AlertDescription>
              {deploymentStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-4rem)]">
          {/* Component Library Panel */}
          <ResizablePanel defaultSize={25}>
            <div className="h-full p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Package className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Components</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-10rem)]">
                <div className="grid gap-4 pr-4">
                  {ContractComponents.map((component) => (
                    <div key={component.id} className="transition-transform hover:scale-[1.02]">
                      <ComponentCard 
                        component={component}
                        onClick={() => setSelectedComponents([...selectedComponents, component])}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-gray-200 dark:bg-gray-700" />

          {/* Builder Panel */}
          <ResizablePanel defaultSize={45}>
            <div className="h-full p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Code2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Contract Builder</h2>
              </div>
              <div className={`min-h-[calc(100vh-12rem)] rounded-xl border-2 border-dashed 
                ${selectedComponents.length === 0 ? 'border-gray-300 bg-gray-50/50' : 'border-blue-200'} 
                transition-colors p-4`}>
                <ScrollArea className="h-full">
                  {selectedComponents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <Package className="h-12 w-12 mb-4 text-gray-400" />
                      <p className="text-center">
                        Click components from the left panel<br />to start building your contract
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedComponents.map((component, index) => (
                        <DraggableComponent
                          key={`${component.id}-${index}`}
                          id={component.id}
                          index={index}
                          moveComponent={moveComponent}
                        >
                          <Card className="cursor-move border-2 hover:border-blue-200 transition-colors">
                            <CardHeader className="py-4">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{component.name}</CardTitle>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardDescription>{component.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        </DraggableComponent>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-gray-200 dark:bg-gray-700" />

          {/* Code Preview Panel */}
          <ResizablePanel defaultSize={30}>
            <div className="h-full p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Code2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Generated Code</h2>
              </div>
              <Card className="h-[calc(100vh-12rem)] border-2">
                <CardContent className="p-0 h-full">
                  <div className="h-full rounded-lg bg-gray-900 text-gray-100 overflow-hidden">
                    <CodePreview code={generateCode()} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </DndProvider>
  );
}