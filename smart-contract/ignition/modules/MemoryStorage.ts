import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MemoryStorageModule", (m) => {
  // Deploy the MemoryStorage contract
  const memoryStorage = m.contract("MemoryStorage");

  // Optional: Store a test memory if DEPLOY_TEST_MEMORY is set to true
  // This would be useful for testing the deployment
  if (process.env.DEPLOY_TEST_MEMORY === "true") {
    const testIpfsHash = "QmTestHash123456789"; // Replace with actual IPFS hash
    m.call(memoryStorage, "storeMemory", [testIpfsHash]);
  }

  return { memoryStorage };
});
