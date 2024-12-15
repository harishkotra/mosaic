![mosaic-logo](https://github.com/user-attachments/assets/98855e57-25f6-4cb9-b7cf-54b61b9271ed)
# 🧱 Mosaic: Mantle Smart Contract Builder

## 🌟 Overview

Mosaic is an innovative smart contract development platform specifically designed for the Mantle blockchain ecosystem. It offers two powerful approaches to contract creation: a visual drag-and-drop builder and an AI-powered contract generator. Whether you prefer hands-on composition or AI assistance, Mosaic empowers developers and blockchain enthusiasts to rapidly create and deploy optimized smart contracts.

## Screenshots

![mosaic-landing-page](https://github.com/user-attachments/assets/ea45a393-375f-4286-853a-4d30e737af9f)
![mosaic-how-it-works](https://github.com/user-attachments/assets/eb5c1cf9-7f82-4869-81de-a140f8c83538)
![mosaic-ai-generator](https://github.com/user-attachments/assets/178cd70d-9c82-4ff9-9e18-3df248b09542)
![mosaic-ai-generator-2](https://github.com/user-attachments/assets/0e4de27b-b96a-4ef0-86c8-c1fde49edbb6)
![mosaic-no-code-builder-1](https://github.com/user-attachments/assets/805cfb15-25d3-44fb-abea-f7fcc220635e)
![mosaic-no-code-builder-2](https://github.com/user-attachments/assets/0b7fee58-4eb1-43c3-861e-7823381b044a)
![mosaic-no-code-builder-3](https://github.com/user-attachments/assets/f2d15105-0361-42cc-a361-7ad2973497c0)
![mosaic-deploy](https://github.com/user-attachments/assets/5f3cbef4-f814-45a9-817a-c2bbe801e749)
![mosaic-testnet-deploy](https://github.com/user-attachments/assets/42679f54-e774-4601-b004-bd34562237f8)
![mosaic-deployed-contract](https://github.com/user-attachments/assets/99b437fd-4fa2-496b-9adb-1b503fa51072)

## ✨ Key Features

### Visual Contract Builder
- Intuitive drag-and-drop interface for composing contracts
- Pre-built, Mantle-optimized contract modules
- Real-time Solidity code generation
- Component-based architecture for maximum reusability

### AI Contract Generator
- Powered by Llama 3.2 8B parameter model via Gaia
- Natural language contract generation
- Context-aware code completion
- Mantle-specific optimizations and best practices

### Example AI Prompts
Here are some effective prompts to help you get started with the AI generator:

```
"Create an ERC20 token contract for a community rewards system with:
- Monthly distribution caps
- Vesting schedules for team tokens
- Anti-whale mechanisms limiting large transfers"
```

```
"Design a meta-transaction handler for my DeFi protocol that:
- Supports percentage-based gas fee delegation
- Includes signature verification
- Has role-based permissions for gas sponsors"
```

```
"Generate a bridge adapter contract that:
- Handles ERC20 token transfers between Ethereum and Mantle
- Includes emergency pause functionality
- Implements a challenge period for withdrawals"
```

### Supported Contract Components

Both the visual builder and AI generator support:
- Meta Transaction Handlers
- ERC20 Token Implementations
- Role-Based Access Control
- Bridge Adapters
- Gas Optimization Utilities
- NFT Contract Templates

### Deployment Options
- One-click deployment to Mantle Mainnet
- Streamlined testing on Mantle Sepolia Testnet
- Seamless MetaMask integration
- Built-in gas estimation and optimization

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MetaMask Browser Extension
- MNT Tokens for deployment

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mosaic.git
cd mosaic
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser

## 🛠 Technology Stack

Frontend:
- Next.js 15+
- React with TypeScript
- Tailwind CSS
- Shadcn UI Components
- React DnD (Drag and Drop)

Smart Contract Integration:
- Ethers.js
- Web3Modal
- MetaMask SDK

AI Integration:
- Gaia API Client
- Llama 3.2 8B parameter model
- Stream-based response handling

## 📦 Smart Contract Components

Meta Transaction
- Enable gasless transactions with advanced Mantle v2 support
- Configurable fee delegation ratios
- Multi-signature validation options

ERC20 Token
- Gas-optimized token implementation for Mantle
- Built-in hooks for extensions
- Comprehensive security features

Access Control
- Role-based permission management
- Time-locked role transitions
- Emergency admin functions

Bridge Adapter
- Seamless L1-L2 token transfers
- State verification and challenge periods
- Configurable bridge parameters

Gas Optimizer
- Dynamic fee adjustment mechanisms
- Batch transaction support
- Priority fee management

## 🤖 AI Generator Features

The AI Generator leverages the Llama 3.2 8B parameter model to provide:

Code Generation:
- Natural language to Solidity conversion
- Mantle-specific optimizations
- Best practice implementations

Context Awareness:
- Understanding of contract requirements
- Integration with existing code
- Compatibility checking

Learning Resources:
- Example prompt library
- Code explanation generation
- Gas optimization suggestions

## 🔒 Security

Security Measures:
- Pre-audited contract templates
- Automated vulnerability scanning
- Role-based access control
- Mantle architecture compatibility

Best Practices:
- Gas optimization patterns
- Secure coding guidelines
- Transaction safety checks

## 🤝 Contributing

We welcome contributions! Please see our Contributing Guidelines for details.

How to Contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌐 Roadmap

Upcoming Features:
- [ ] Advanced AI prompt templates
- [ ] Multi-contract system generation
- [ ] Contract verification automation
- [ ] Integration testing framework
- [ ] Enhanced gas estimation
- [ ] AI-powered security analysis
- [ ] Custom component creation tools

Built with ❤️ for Web3 Developers
