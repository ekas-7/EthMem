const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of MemoryStorage contract...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy the MemoryStorage contract
  const MemoryStorage = await ethers.getContractFactory("MemoryStorage");
  const memoryStorage = await MemoryStorage.deploy();
  
  await memoryStorage.waitForDeployment();
  const contractAddress = await memoryStorage.getAddress();
  
  console.log("MemoryStorage deployed to:", contractAddress);
  console.log("Contract owner:", await memoryStorage.owner());
  
  // Verify deployment by checking some basic functions
  console.log("Verifying deployment...");
  const totalCount = await memoryStorage.getTotalMemoryCount();
  console.log("Initial memory count:", totalCount.toString());
  
  // Example: Store a test memory (optional - for demonstration)
  if (process.env.DEPLOY_TEST_MEMORY === "true") {
    console.log("Storing test memory...");
    const testIpfsHash = "QmTestHash123456789"; // This would be a real IPFS hash
    const tx = await memoryStorage.storeMemory(testIpfsHash);
    const receipt = await tx.wait();
    console.log("Test memory stored in transaction:", receipt.hash);
    
    const newCount = await memoryStorage.getTotalMemoryCount();
    console.log("Memory count after test storage:", newCount.toString());
  }
  
  console.log("Deployment completed successfully!");
  console.log("\nContract Address:", contractAddress);
  console.log("Network:", network.name);
  console.log("Block Number:", await ethers.provider.getBlockNumber());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name,
    deployer: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString()
  };
  
  console.log("\nDeployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
