"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Camera, AlertCircle } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
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

// Extended contract templates with Mantle-specific features
const CONTRACT_TEMPLATES = {
    'meta-tx': `
      // Meta Transaction Handler for Mantle v2
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
    'erc20': `
      // ERC20 with Mantle gas optimizations
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
      }
      // Additional token functionality
        function mint(address to, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
            _mint(to, amount);
        }

        function burn(address from, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
            _burn(from, amount);
        }`,
    'access': `
      // Role-based access control
      mapping(bytes32 => mapping(address => bool)) private _roles;
      
      modifier onlyRole(bytes32 role) {
          require(_roles[role][msg.sender], "Unauthorized");
          _;
      }`,
    'bridge-adapter': `
      // Mantle Bridge Adapter
      address public constant L1_BRIDGE = 0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012;
      address public constant L2_BRIDGE = 0x4200000000000000000000000000000000000010;
      
      function bridgeToL1(uint256 amount) external {
          // Implement bridge to L1 logic
          // Uses Mantle's native bridging system
      }
      
      function bridgeFromL1(uint256 amount) external {
          // Implement bridge from L1 logic
          // Verifies L1 transaction proof
      }`,
    'gas-optimizer': `
      // Mantle Gas Price Optimizer
      uint256 public constant DEFAULT_GAS_PRICE = 0.02 gwei;
      
      function getOptimizedGasPrice() public view returns (uint256) {
          // Fetch current gas price from Mantle oracle
          // Apply optimization algorithm
          return DEFAULT_GAS_PRICE;
      }`,
    'token-ratio': `
      // Mantle Token Ratio Handler
      address public constant BVM_GAS_PRICE_ORACLE = 0x420000000000000000000000000000000000000F;
      
      function getTokenRatio() public view returns (uint256) {
          // Fetch current token ratio from Mantle oracle
          // Used for fee calculations
          return tokenRatio;
      }`,
    'nft': `
      // ERC721 with Mantle optimizations
      mapping(uint256 => address) private _owners;
      mapping(address => uint256) private _balances;
      mapping(uint256 => address) private _tokenApprovals;
      
      function mint(address to, uint256 tokenId) public {
          require(_owners[tokenId] == address(0), "Already minted");
          _balances[to] += 1;
          _owners[tokenId] = to;
          emit Transfer(address(0), to, tokenId);
      }`,
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
  
// Deployment helper function
const handleDeploy = async (isTestnet: boolean) => {
    try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            setDeploymentStatus({
                type: 'error',
                message: 'Please install MetaMask to deploy contracts'
            });
            return;
        }

        // Check if we have any components selected
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

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        setDeploymentStatus({
            type: 'info',
            message: 'Deploying contract to ' + (isTestnet ? 'Testnet' : 'Mainnet') + '...'
        });

        const network = isTestnet ? NETWORKS.mantleTestnet : NETWORKS.mantle;
        const address = await deployContract(generateCode(), network);

        // Create explorer link
        const explorerUrl = `${network.blockExplorerUrls[0]}/address/${address}`;
        
        setDeploymentStatus({
            type: 'success',
            message: `Contract deployed successfully! View on Explorer: ${explorerUrl}`
        });

    } catch (error: any) {
        let errorMessage = error.message;

        // Handle common deployment errors
        if (error.code === 4001) {
            errorMessage = 'Transaction rejected by user';
        } else if (error.message.includes('insufficient funds')) {
            errorMessage = `Insufficient MNT balance. Make sure you have enough MNT tokens for gas fees on ${isTestnet ? 'Testnet' : 'Mainnet'}`;
        }

        setDeploymentStatus({
            type: 'error',
            message: `Deployment failed: ${errorMessage}`
        });
    }
};

  
// Draggable Component
const DraggableComponent = ({ id, children, index, moveComponent }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'component',
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    const [, drop] = useDrop({
      accept: 'component',
      hover: (item, monitor) => {
        if (!moveComponent) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        moveComponent(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });
  
    return (
      <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
        {children}
      </div>
    );
};

export default function MosaicBuilder() {
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [deploymentStatus, setDeploymentStatus] = useState(null);

    const BASE_CONTRACT = {
        abi: [
            // Events
            "event Transfer(address indexed from, address indexed to, uint256 value)",
            "event Approval(address indexed owner, address indexed spender, uint256 value)",
            "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
            "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
            
            // Core functions
            "function transfer(address to, uint256 amount) public returns (bool)",
            "function balanceOf(address account) public view returns (uint256)",
            "function mint(address to, uint256 amount) public returns (bool)",
            "function burn(address from, uint256 amount) public returns (bool)",
            "function grantRole(bytes32 role, address account) public",
            
            // Meta transaction functions
            "function executeMetaTx(address user, bytes memory functionData, uint256 nonce, uint256 percentage, bytes memory signature) external",
            "function nonces(address user) public view returns (uint256)"
        ],
        bytecode: "0x608060405234801561001057600080fd5b50604051610a5f380380610a5f833981810160405281019061003291906100..." // We'll need the actual bytecode here
    };
    // Network configurations
    const NETWORKS = {
        mantleTestnet: {
            chainId: '0x138B', // 5003 in hex
            rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
            chainName: 'Mantle Sepolia Testnet', // Updated to specify Sepolia
            nativeCurrency: {
                name: 'MNT',
                symbol: 'MNT',
                decimals: 18
            },
            blockExplorerUrls: ['https://sepolia.mantlescan.xyz']
        },
        mantle: {
            chainId: '0x1388', // 5000 in hex
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
    // Initialize Prism.js when components change
    useEffect(() => {
      Prism.highlightAll();
    }, [selectedComponents]);
  
    // Function to move components (fix for the moveComponent error)
    const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
      setSelectedComponents((prevComponents) => {
        const newComponents = [...prevComponents];
        const dragComponent = newComponents[dragIndex];
        newComponents.splice(dragIndex, 1);
        newComponents.splice(hoverIndex, 0, dragComponent);
        return newComponents;
      });
    }, []);
    
    // Function to compile and deploy the contract
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
    const handleDeploy = async (isTestnet: boolean) => {
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
                    <>
                        Contract deployed! View on Explorer:{' '}
                        <a 
                            href={explorerUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {address}
                        </a>
                    </>
                )
            });
    
        } catch (error: any) {
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
        const code = `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;
    
    contract GeneratedContract {
        ${selectedComponents.map(component => {
            // Clean the template code
            return component.template
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                .replace(/\/\/.*/g, '')  // Remove single-line comments
                .replace(/\n\s*\n/g, '\n') // Remove empty lines
                .trim();
        }).join('\n\n')}
    }`;
    
        return code;
    }, [selectedComponents]);
  
    const droppableStyle = {
      backgroundColor: selectedComponents.length === 0 ? '#f9fafb' : 'transparent',
      border: '2px dashed #e5e7eb',
      borderRadius: '0.5rem',
      minHeight: 'calc(100vh - 10rem)',
      padding: '1rem',
    };
  
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="h-screen bg-background">
          {/* Header */}
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-[#2D3FE7]" />
                <span className="text-xl font-bold">Mosaic</span>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => handleDeploy(true)}
                >
                  Deploy to Testnet
                </Button>
                <Button 
                  className="bg-[#2D3FE7] hover:bg-[#2D3FE7]/90"
                  onClick={() => handleDeploy(false)}
                >
                  Deploy to Mantle
                </Button>
              </div>
            </div>
          </div>
  
          {/* Deployment Status Alert */}
          {deploymentStatus && (
            <Alert className={`mx-4 mt-4 ${
              deploymentStatus.type === 'error' ? 'bg-red-100' : 
              deploymentStatus.type === 'success' ? 'bg-green-100' : 
              'bg-blue-100'
            }`}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Deployment Status</AlertTitle>
              <AlertDescription>
                {deploymentStatus.message}
              </AlertDescription>
            </Alert>
          )}
  
          {/* Main Content */}
          <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-4rem)]">
            {/* Component Library */}
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full flex-col">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Components</h2>
                  <div className="grid gap-4">
                    {ContractComponents.map((component) => (
                    <div key={component.id}>
                        <ComponentCard 
                        component={component}
                        onClick={() => setSelectedComponents([...selectedComponents, component])}
                        />
                    </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResizablePanel>
  
            <ResizableHandle />
  
            {/* Visual Builder */}
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full flex-col">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Contract Builder</h2>
                  <div style={droppableStyle}>
                    <ScrollArea className="h-full w-full">
                      {selectedComponents.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Click components from the left to start building
                        </p>
                      ) : (
                        selectedComponents.map((component, index) => (
                          <DraggableComponent
                            key={`${component.id}-${index}`}
                            id={component.id}
                            index={index}
                            moveComponent={moveComponent}
                          >
                            <Card className="mb-4 cursor-move">
                              <CardHeader>
                                <CardTitle>{component.name}</CardTitle>
                                <Button 
                                  variant="ghost" 
                                  className="absolute top-2 right-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
                                  }}
                                >
                                  ×
                                </Button>
                              </CardHeader>
                            </Card>
                          </DraggableComponent>
                        ))
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </ResizablePanel>
  
            <ResizableHandle />
  
            {/* Code Preview */}
            <ResizablePanel defaultSize={25}>
                <div className="flex h-full flex-col">
                    <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Generated Code</h2>
                    <Card className="h-[calc(100vh-10rem)]">
                        <CardContent className="p-4">
                        <CodePreview code={generateCode()} />
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DndProvider>
    );
}