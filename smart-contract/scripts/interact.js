const { ethers } = require("hardhat");

// Contract interaction script
async function main() {
  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x...";
  
  console.log("Interacting with MemoryStorage contract at:", CONTRACT_ADDRESS);
  
  // Get the contract instance
  const MemoryStorage = await ethers.getContractFactory("MemoryStorage");
  const memoryStorage = MemoryStorage.attach(CONTRACT_ADDRESS);
  
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  
  // Example interactions
  
  // 1. Store a memory
  console.log("\n1. Storing a memory...");
  const sampleIpfsHash = "QmSampleDataHash123456789"; // Replace with actual IPFS hash
  const storeTx = await memoryStorage.storeMemory(sampleIpfsHash);
  const storeReceipt = await storeTx.wait();
  console.log("Memory stored in transaction:", storeReceipt.hash);
  
  // 2. Get total memory count
  console.log("\n2. Getting total memory count...");
  const totalCount = await memoryStorage.getTotalMemoryCount();
  console.log("Total memories:", totalCount.toString());
  
  // 3. Get memories for current address
  console.log("\n3. Getting memories for current address...");
  const myMemoryIds = await memoryStorage.getMemoriesByAddress(signer.address);
  console.log("My memory IDs:", myMemoryIds.map(id => id.toString()));
  
  // 4. Retrieve a specific memory
  if (myMemoryIds.length > 0) {
    console.log("\n4. Retrieving memory ID 1...");
    const [ipfsHash, timestamp, owner] = await memoryStorage.getMemory(1);
    console.log("IPFS Hash:", ipfsHash);
    console.log("Timestamp:", new Date(timestamp * 1000).toISOString());
    console.log("Owner:", owner);
  }
  
  // 5. Check ownership
  console.log("\n5. Checking ownership...");
  const isOwner = await memoryStorage.isMemoryOwner(signer.address, 1);
  console.log("Is owner of memory 1:", isOwner);
  
  // 6. Get memory count for current address
  console.log("\n6. Getting memory count for current address...");
  const myCount = await memoryStorage.getMemoryCountByAddress(signer.address);
  console.log("My memory count:", myCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Interaction failed:", error);
    process.exit(1);
  });
