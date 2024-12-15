import React, { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ComponentCard = ({ component, onClick }) => {
  const explanations = {
    'meta-tx': {
      purpose: "Enables gasless transactions where a third party can pay for gas fees on behalf of users",
      benefits: [
        "Improves user experience by removing gas fee barrier",
        "Users can interact with dApps without holding MNT tokens",
        "Supports partial fee delegation with percentage splits"
      ],
      useCase: "Perfect for dApps wanting to subsidize user transactions or implement gasless onboarding"
    },
    'erc20': {
      purpose: "Standard ERC20 token implementation optimized for Mantle's gas model",
      benefits: [
        "Lower transaction costs through Mantle-specific optimizations",
        "Built-in admin controls for token management",
        "Standard ERC20 compatibility for exchange listings"
      ],
      useCase: "Ideal for creating new tokens, governance tokens, or reward systems"
    },
    'access': {
      purpose: "Role-based permission system for contract access control",
      benefits: [
        "Granular control over contract functions",
        "Multiple admin roles with different permissions",
        "Easy to add/revoke permissions"
      ],
      useCase: "Essential for contracts requiring different permission levels (admins, operators, users)"
    },
    'bridge-adapter': {
      purpose: "Facilitates token transfers between Ethereum L1 and Mantle L2",
      benefits: [
        "Native integration with Mantle's official bridge",
        "Secure cross-chain token transfers",
        "Automatic state verification"
      ],
      useCase: "Required for dApps operating across both Ethereum and Mantle networks"
    },
    'gas-optimizer': {
      purpose: "Utilities for optimizing gas usage on Mantle",
      benefits: [
        "Automatically adjusts gas prices based on network conditions",
        "Implements Mantle's recommended gas patterns",
        "Reduces transaction costs"
      ],
      useCase: "Helpful for contracts with complex operations needing gas optimization"
    },
    'token-ratio': {
      purpose: "Manages Mantle's unique token ratio system for fee calculations",
      benefits: [
        "Handles MNT:ETH price ratio for fees",
        "Automatic fee adjustments based on market conditions",
        "Ensures stable transaction costs"
      ],
      useCase: "Important for contracts involving fee calculations or token swaps"
    },
    'nft': {
      purpose: "ERC721 NFT implementation with Mantle-specific optimizations",
      benefits: [
        "Gas-efficient NFT operations",
        "Standard ERC721 compatibility",
        "Optimized metadata handling"
      ],
      useCase: "Perfect for NFT collections, gaming assets, or digital collectibles"
    }
  };

  return (
    <TooltipProvider>
      <Card 
        className="cursor-pointer hover:border-[#2D3FE7] transition-colors relative"
        onClick={onClick}
      >
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm">{component.name}</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600"/>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[300px] p-4">
                <div className="space-y-2">
                  <p className="font-semibold">Purpose:</p>
                  <p className="text-sm">{explanations[component.id].purpose}</p>
                  
                  <p className="font-semibold mt-2">Benefits:</p>
                  <ul className="text-sm list-disc pl-4">
                    {explanations[component.id].benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                  
                  <p className="font-semibold mt-2">Best for:</p>
                  <p className="text-sm">{explanations[component.id].useCase}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription className="text-xs">
            {component.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </TooltipProvider>
  );
};

export default ComponentCard;