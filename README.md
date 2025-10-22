# EthMem

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)](https://soliditylang.org/)
[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://www.python.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)](https://developer.chrome.com/docs/extensions/)

> **Unified LLM Memory — Your Blockchain Identity**
> 
> Merge your digital mind with your decentralized self.

---

## 🌟 Overview

**EthMem** unlocks a new layer of digital continuity by turning a user's LLM memory into a portable, cryptographically-secured identity. Interactions, learned context, and personal insights can be carried across apps while remaining owned by the user.

### Key Principles

- **🔒 Private-by-design**: No central servers required for identity storage
- **🔄 Portable**: Memory can be used across compatible apps  
- **✅ Verifiable**: Cryptographic proofs bind memory to a user identity
- **🎯 Decentralized**: IPFS-based storage with blockchain anchoring

### 🎯 Call to Action

Claim your decentralized memory and never lose context again.

---

## 📦 Repository Structure

This repository contains four major components that work together to create the EthMem ecosystem:

```
ETHMem/
├── frontend/              # 🎨 Next.js web application
├── extension/             # 🔌 Browser extension for ChatGPT/Claude/Gemini
├── smart-contract/        # 📜 Ethereum smart contracts for memory storage
└── ASI-agents/            # 🤖 AI agent ecosystems with memory integration
```

---

## 🎨 Frontend - Next.js Application

A modern Next.js 15 web application that serves as the user-facing interface for EthMem.

### 🏗️ Structure

```
frontend/
├── app/
│   ├── page.jsx                # Landing page
│   ├── layout.jsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── components/             # Reusable components
│   │   ├── Connect.jsx         # Wallet/identity connection UI
│   │   ├── FAQ.jsx             # Frequently asked questions
│   │   ├── Header.jsx          # Top navigation and hero
│   │   ├── HowItWorks.jsx      # Explanation and illustration
│   │   ├── Pricing.jsx         # Pricing cards
│   │   └── Testimonials.jsx    # User testimonials
│   └── dashboard/              # Dashboard pages
├── components/
│   ├── ConnectWallet.jsx       # Wallet connection logic
│   └── WalletProvider.jsx      # Web3 provider wrapper
├── hooks/
│   └── useWallet.js            # Wallet connection hook
├── lib/
│   ├── cn.js                   # Class name utilities
│   └── web3modal.js            # Web3Modal configuration
└── public/                     # Static assets
```

### 🚀 Quick Start

**Prerequisites**: Node.js 18+ and npm/pnpm

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 📦 Tech Stack

- **Framework**: Next.js 15.5.4 (with Turbopack)
- **UI**: React 19.1.0, Tailwind CSS 4
- **Web3**: Wagmi 2.18.1, Web3Modal 5.1.11, Viem 2.38.3
- **State Management**: TanStack React Query 5.90.5
- **Icons**: Lucide React, React Icons

---

## 🔌 Browser Extension - AI Memory Extraction

A Chrome/Edge extension that intercepts conversations from ChatGPT, Claude, and Gemini to extract and store memories.

### 🏗️ Structure

```
extension/
├── manifest.json               # Extension configuration (v3)
├── src/
│   ├── background/
│   │   └── background.js       # Service worker & message coordinator
│   ├── content/
│   │   └── contentScript.js    # UI injection & message forwarding
│   ├── page/
│   │   ├── pageScript.js       # API interception (monkeypatch)
│   │   ├── ethAdapter.js       # Wallet connection
│   │   └── smartInjector.js    # Smart injection utilities
│   ├── popup/
│   │   ├── popup.html          # Extension popup UI
│   │   └── popup.js            # Popup logic
│   ├── ui/
│   │   ├── memoryViewer.js     # Memory viewer modal
│   │   ├── modelManagement.*   # AI model management UI
│   │   └── transformers*.js    # Transformers.js integration
│   └── lib/
│       ├── memoryExtractor.js  # Extract structured memories
│       ├── memoryStorage.js    # IndexedDB operations
│       ├── cloudService.js     # Cloud synchronization
│       └── modelInferenceService.js  # Local AI inference
└── assets/
    └── logo.png                # Extension icon
```

### 🎯 Features

- **Multi-Platform Support**: ChatGPT, Claude AI, and Google Gemini
- **Smart Memory Extraction**: Pattern matching + AI-based extraction
- **Local Storage**: IndexedDB for offline memory storage
- **On-Chain Sync**: IPFS + Ethereum for decentralized storage
- **Privacy-First**: All processing happens locally

### 🚀 Installation

```bash
# Load extension
1. Open chrome://extensions/ (or edge://extensions/)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the /extension folder

# Test on ChatGPT
1. Navigate to https://chatgpt.com
2. Look for "ethmem" button in header
3. Send a message: "I live in Mumbai"
4. Click button to view extracted memory
```

### 📊 Memory Schema

```javascript
{
  id: "mem-timestamp-random",
  timestamp: 1697712000000,
  source: "I live in delhi",
  category: "location",
  entity: "delhi",
  context: {
    conversationId: "chatgpt-...",
    platform: "chatgpt"
  },
  metadata: {
    confidence: 0.85,
    modelUsed: "laflan-mini",
    extractionVersion: "1.0"
  },
  status: "local" // "synced" | "on-chain"
}
```

### 🔄 How It Works

```
ChatGPT API Call
    ↓
pageScript.js (monkeypatch fetch)
    ↓
Extract user message from request
    ↓
window.postMessage → contentScript.js
    ↓
chrome.runtime.sendMessage → background.js
    ↓
memoryExtractor.js processes text
    ↓
Pattern matching extracts: category + entity + confidence
    ↓
If confidence > 0.7 → save to IndexedDB
```

---

## 📜 Smart Contract - On-Chain Memory Storage

Hardhat 3-based Solidity smart contracts for storing memory data on IPFS with one-to-many address mapping.

### 🏗️ Structure

```
smart-contract/
├── contracts/
│   └── MemoryStorage.sol       # Main smart contract
├── scripts/
│   ├── deploy.js               # Deployment script
│   └── interact.js             # Interaction examples
├── test/
│   ├── MemoryStorage.test.js   # JavaScript tests
│   └── MemoryStorage.ts        # TypeScript tests
├── ignition/
│   └── modules/
│       └── MemoryStorage.ts    # Hardhat Ignition deployment
├── hardhat.config.ts           # Hardhat 3 configuration
└── .env.example                # Environment variables template
```

### ⚡ Features

- **One-to-Many Mapping**: Each address can store multiple memory entries
- **IPFS Integration**: Stores IPFS hashes, not raw data
- **Ownership Control**: Only memory owners can delete entries
- **Gas Optimized**: Efficient storage and retrieval
- **Event Logging**: Comprehensive events for all operations

### 🔧 Core Functions

```solidity
// Store a new memory entry
storeMemory(string ipfsHash) → uint256 memoryId

// Retrieve a specific memory entry
getMemory(uint256 memoryId) → MemoryEntry

// Get all memory IDs for an address
getMemoriesByAddress(address user) → uint256[]

// Retrieve multiple memories at once
getMultipleMemories(uint256[] memoryIds) → MemoryEntry[]

// Delete a memory (owner only)
deleteMemory(uint256 memoryId)

// Utility functions
getTotalMemoryCount() → uint256
getMemoryCountByAddress(address user) → uint256
```

### 🚀 Quick Start

**Prerequisites**: Node.js 18+

```bash
# Navigate to smart-contract
cd smart-contract

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your PRIVATE_KEY and SEPOLIA_RPC_URL

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to local network
npm run node        # Terminal 1
npm run deploy:local  # Terminal 2

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

### 📦 Tech Stack

- **Framework**: Hardhat 2.19.0
- **Solidity**: ^0.8.20
- **Libraries**: OpenZeppelin Contracts 5.0.0
- **Testing**: Chai, Ethers.js 6.4.0
- **Deployment**: Hardhat Ignition

---

## 🤖 ASI-Agents - Multi-Domain AI Ecosystems

Five independent multi-agent systems, each designed for a specific domain with memory integration.

### 🏗️ Structure

```
ASI-agents/
├── medical/                     # 🏥 Medical consultation system
│   ├── doctor_agent.py
│   ├── patient_agent.py
│   ├── memory_agent.py
│   ├── medical_system.py        # Port 8000
│   ├── user_memories.json
│   ├── ARCHITECTURE.md
│   └── README.md
│
├── law/                         # ⚖️ Legal consultation system
│   ├── lawyer_agent.py
│   ├── client_agent.py
│   ├── case_memory_agent.py
│   ├── law_system.py            # Port 9000
│   └── ARCHITECTURE.md
│
├── customer-support/            # 🎧 Customer support system
│   ├── support_agent.py
│   ├── customer_agent.py
│   ├── ticket_memory_agent.py
│   ├── support_system.py        # Port 10000
│   └── ARCHITECTURE.md
│
├── education/                   # 📚 Education system
│   ├── tutor_agent.py
│   ├── student_agent.py
│   ├── learning_memory_agent.py
│   ├── education_system.py      # Port 11000
│   └── ARCHITECTURE.md
│
└── financial/                   # 💰 Financial advisory system
    ├── advisor_agent.py
    ├── investor_agent.py
    ├── portfolio_memory_agent.py
    ├── financial_system.py      # Port 12000
    └── ARCHITECTURE.md
```

### 🌟 Five Ecosystems

1. **🏥 Medical** - AI-powered healthcare consultations with personalized medical memory
2. **⚖️ Legal** - Intelligent legal advice with case history integration
3. **🎧 Customer Support** - Smart customer service with support ticket memory
4. **📚 Education** - Personalized AI tutoring with adaptive learning profiles
5. **💰 Financial** - Portfolio analysis and investment guidance with risk profiling

### 🏗️ Shared Architecture

All ecosystems follow the same pattern:

```
┌─────────────────────────────────────────────┐
│         ECOSYSTEM ARCHITECTURE               │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐      ┌──────────────┐    │
│  │   Expert     │◄────►│   Client     │    │
│  │   Agent      │      │   Agent      │    │
│  └──────┬───────┘      └──────────────┘    │
│         │                                    │
│         ▼                                    │
│  ┌──────────────┐                           │
│  │   Memory     │                           │
│  │   Agent      │                           │
│  └──────────────┘                           │
│                                              │
│  All managed by uAgents Bureau              │
└─────────────────────────────────────────────┘
```

### 🚀 Quick Start

**Prerequisites**: Python 3.13+

```bash
# Navigate to ASI-agents
cd ASI-agents

# Run setup script
chmod +x setup.sh
./setup.sh

# Or manually install
pip install -r requirements.txt

# Run any ecosystem (example: medical)
cd medical
python medical_system.py

# Access the system
# Medical: http://localhost:8000
# Legal: http://localhost:9000
# Support: http://localhost:10000
# Education: http://localhost:11000
# Financial: http://localhost:12000
```

### 📦 Dependencies

- **uAgents**: 0.12.0+ (Fetch.ai framework)
- **uagents-ai-engine**: 0.4.0+
- **Pydantic**: 2.0.0+
- **aiohttp**: 3.8.0+
- **cosmpy**: 0.9.0+

---

## 🔗 How Components Work Together

```
┌─────────────────┐
│  Browser Ext    │  Extract memories from LLM conversations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  IndexedDB      │  Store locally
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  IPFS           │  Upload to decentralized storage
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Smart Contract │  Store IPFS hash on-chain
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │  View and manage memories
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ASI Agents     │  Use memories for personalized interactions
└─────────────────┘
```

---

## 🚀 Getting Started - Full Stack

### 1. Clone the Repository

```bash
git clone https://github.com/ekas-7/ETHMem.git
cd ETHMem
```

### 2. Set Up Smart Contracts

```bash
cd smart-contract
npm install
cp .env.example .env
# Configure .env with your keys
npm run compile
npm test
npm run deploy:sepolia
cd ..
```

### 3. Set Up Frontend

```bash
cd frontend
npm install
cp env.example .env.local
# Configure .env.local with your settings
npm run dev
cd ..
```

### 4. Install Browser Extension

```bash
# Open chrome://extensions/
# Enable Developer mode
# Load unpacked → select extension/ folder
```

### 5. Run ASI Agents (Optional)

```bash
cd ASI-agents
./setup.sh
cd medical
python medical_system.py
```

---

## 🛠️ Development

### Prerequisites

- **Node.js**: 18+ (for frontend & smart contracts)
- **Python**: 3.13+ (for ASI agents)
- **Browser**: Chrome/Edge (for extension)
- **Wallet**: MetaMask or similar Web3 wallet

### Environment Variables

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

#### Smart Contract (`smart-contract/.env`)
```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
ETHERSCAN_API_KEY=your_etherscan_key
```

---

## 📚 Documentation

- **Frontend**: See `frontend/README.md`
- **Extension**: See `extension/README.md`
- **Smart Contract**: See `smart-contract/README.md`
- **ASI Agents**: See `ASI-agents/README.md`
- **Architecture**: See `ARCHITECTURE.md` files in each agent ecosystem

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Fetch.ai](https://fetch.ai/) - uAgents framework
- [OpenZeppelin](https://openzeppelin.com/) - Smart contract libraries
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Web3Modal](https://web3modal.com/) - Wallet connection

---

## 📞 Contact & Support

For questions, issues, or contributions, please open an issue on GitHub.

**Repository**: [github.com/ekas-7/ETHMem](https://github.com/ekas-7/ETHMem)

---

**Built with ❤️ for the decentralized future**

