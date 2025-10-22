# ETHMem Smart Contract

A Hardhat 3-based smart contract project for storing memory data on IPFS with one-to-many address mapping. Each Ethereum address can store multiple memory entries, where each entry contains an IPFS hash pointing to the actual data.

> **Note**: This project uses Hardhat 3, which is now production-ready. For more information, see the [Hardhat 3 documentation](https://hardhat.org/docs/getting-started).

## Features

- **One-to-Many Mapping**: Each address can store multiple memory entries
- **IPFS Integration**: Stores IPFS hashes instead of data directly on-chain
- **Ownership Control**: Only memory owners can delete their entries
- **Event Logging**: Comprehensive events for all operations
- **Gas Optimized**: Efficient storage and retrieval mechanisms

## Project Structure

```
smart-contract/
├── contracts/
│   └── MemoryStorage.sol      # Main smart contract
├── scripts/
│   ├── deploy.js              # Legacy deployment script
│   └── interact.js            # Contract interaction examples
├── test/
│   ├── MemoryStorage.test.js  # Legacy JavaScript tests
│   └── MemoryStorage.ts       # Modern TypeScript tests
├── ignition/
│   └── modules/
│       └── MemoryStorage.ts   # Hardhat Ignition deployment module
├── hardhat.config.ts          # Hardhat 3 TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Smart Contract Overview

The `MemoryStorage` contract provides the following functionality:

### Core Functions

- `storeMemory(string ipfsHash)`: Store a new memory entry
- `getMemory(uint256 memoryId)`: Retrieve a specific memory entry
- `getMemoriesByAddress(address user)`: Get all memory IDs for an address
- `getMultipleMemories(uint256[] memoryIds)`: Retrieve multiple memories at once
- `deleteMemory(uint256 memoryId)`: Delete a memory (owner only)

### Utility Functions

- `getTotalMemoryCount()`: Get total number of stored memories
- `getMemoryCountByAddress(address user)`: Get count of memories for an address
- `isMemoryOwner(address user, uint256 memoryId)`: Check ownership

### Events

- `MemoryStored`: Emitted when a memory is stored
- `MemoryRetrieved`: Emitted when a memory is retrieved
- `MemoryDeleted`: Emitted when a memory is deleted

## Sample Data Structure

The contract is designed to work with JSON data like:

```json
{
  "Extracted info": "User love laddu",
  "Tags": ["food", "Gym"]
}
```

This data would be stored on IPFS, and the IPFS hash would be stored in the smart contract.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your actual values
```

## Usage

### Compile Contracts
```bash
npm run compile
```

### Run All Tests
```bash
npm run test
```

### Run JavaScript Tests Only
```bash
npm run test:js
```

### Run TypeScript Tests Only
```bash
npm run test:ts
```

### Deploy to Local Network
```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy using Hardhat Ignition
npm run deploy:local
```

### Deploy to Sepolia Testnet
```bash
npm run deploy:sepolia
```

## Environment Variables

Create a `.env` file with the following variables:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Contract Interaction Examples

### Store a Memory
```javascript
const ipfsHash = "QmYourIPFSHashHere";
const tx = await memoryStorage.storeMemory(ipfsHash);
await tx.wait();
```

### Retrieve a Memory
```javascript
const [ipfsHash, timestamp, owner] = await memoryStorage.getMemory(1);
```

### Get All Memories for an Address
```javascript
const memoryIds = await memoryStorage.getMemoriesByAddress(userAddress);
```

### Delete a Memory
```javascript
await memoryStorage.deleteMemory(memoryId);
```

## Gas Optimization

The contract is optimized for gas efficiency:

- Uses `uint256[]` for address-to-memory mapping
- Implements reentrancy guards
- Efficient deletion by swapping with last element
- Minimal storage operations

## Security Features

- **Ownable**: Only contract owner can perform administrative functions
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Input Validation**: Validates IPFS hashes and memory IDs
- **Access Control**: Only memory owners can delete their entries

## Testing

The test suite includes both Solidity and TypeScript tests:

### Solidity Tests (`MemoryStorage.test.js`)
- Fast, EVM-native unit tests
- Direct contract interaction
- Access to cheatcodes for advanced testing

### TypeScript Tests (`MemoryStorage.ts`)
- Integration tests using viem
- Realistic blockchain simulation
- End-to-end workflow testing

### Test Coverage
- Deployment tests
- Memory storage and retrieval tests
- Ownership and access control tests
- Edge case handling
- Integration tests with sample data

Run tests with:
```bash
npm run test      # Run all tests
npm run test:js   # Run only JavaScript tests
npm run test:ts   # Run only TypeScript tests
```

## Deployment

This project uses **Hardhat Ignition** for deployment, which provides:

- Declarative deployment definitions
- Parallel transaction execution
- Error recovery and resume capabilities
- Dependency management

The contract can be deployed to:

- **Local Hardhat Network**: For development and testing
- **Sepolia Testnet**: For testing on a public testnet
- **Mainnet**: For production use (modify network config)

### Deployment Module

The deployment is defined in `ignition/modules/MemoryStorage.ts`:

```typescript
export default buildModule("MemoryStorageModule", (m) => {
  const memoryStorage = m.contract("MemoryStorage");
  
  // Optional: Store test memory during deployment
  if (process.env.DEPLOY_TEST_MEMORY === "true") {
    m.call(memoryStorage, "storeMemory", ["QmTestHash123456789"]);
  }
  
  return { memoryStorage };
});
```

## License

MIT License - see LICENSE file for details.
