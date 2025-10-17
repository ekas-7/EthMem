import { expect } from "chai";
import { viem } from "hardhat";
import { getAddress, parseEther } from "viem";

describe("MemoryStorage", function () {
  let memoryStorage: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await viem.getWalletClients();

    // Deploy contract
    memoryStorage = await viem.deployContract("MemoryStorage");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const contractOwner = await memoryStorage.read.owner();
      expect(contractOwner.toLowerCase()).to.equal(owner.account.address.toLowerCase());
    });

    it("Should start with zero memories", async function () {
      const totalCount = await memoryStorage.read.getTotalMemoryCount();
      expect(totalCount).to.equal(0n);
    });
  });

  describe("Storing Memories", function () {
    it("Should store a memory and emit event", async function () {
      const ipfsHash = "QmTestHash123456789";
      
      const hash = await memoryStorage.write.storeMemory([ipfsHash], {
        account: addr1.account.address,
      });
      
      // Wait for transaction to be mined
      await viem.getPublicClient().waitForTransactionReceipt({ hash });

      const totalCount = await memoryStorage.read.getTotalMemoryCount();
      expect(totalCount).to.equal(1n);
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(
        memoryStorage.write.storeMemory([""], {
          account: addr1.account.address,
        })
      ).to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("Should allow multiple memories from same address", async function () {
      const ipfsHash1 = "QmTestHash111111111";
      const ipfsHash2 = "QmTestHash222222222";
      
      await memoryStorage.write.storeMemory([ipfsHash1], {
        account: addr1.account.address,
      });
      
      await memoryStorage.write.storeMemory([ipfsHash2], {
        account: addr1.account.address,
      });
      
      const totalCount = await memoryStorage.read.getTotalMemoryCount();
      expect(totalCount).to.equal(2n);
      
      const addr1Count = await memoryStorage.read.getMemoryCountByAddress([addr1.account.address]);
      expect(addr1Count).to.equal(2n);
    });

    it("Should allow memories from different addresses", async function () {
      const ipfsHash1 = "QmTestHash111111111";
      const ipfsHash2 = "QmTestHash222222222";
      
      await memoryStorage.write.storeMemory([ipfsHash1], {
        account: addr1.account.address,
      });
      
      await memoryStorage.write.storeMemory([ipfsHash2], {
        account: addr2.account.address,
      });
      
      const totalCount = await memoryStorage.read.getTotalMemoryCount();
      expect(totalCount).to.equal(2n);
      
      const addr1Count = await memoryStorage.read.getMemoryCountByAddress([addr1.account.address]);
      const addr2Count = await memoryStorage.read.getMemoryCountByAddress([addr2.account.address]);
      expect(addr1Count).to.equal(1n);
      expect(addr2Count).to.equal(1n);
    });
  });

  describe("Retrieving Memories", function () {
    beforeEach(async function () {
      // Store some test memories
      await memoryStorage.write.storeMemory(["QmTestHash111111111"], {
        account: addr1.account.address,
      });
      await memoryStorage.write.storeMemory(["QmTestHash222222222"], {
        account: addr1.account.address,
      });
      await memoryStorage.write.storeMemory(["QmTestHash333333333"], {
        account: addr2.account.address,
      });
    });

    it("Should retrieve a specific memory", async function () {
      const [ipfsHash, timestamp, owner] = await memoryStorage.read.getMemory([1n]);
      
      expect(ipfsHash).to.equal("QmTestHash111111111");
      expect(owner.toLowerCase()).to.equal(addr1.account.address.toLowerCase());
      expect(timestamp).to.be.gt(0n);
    });

    it("Should get all memories for an address", async function () {
      const memoryIds = await memoryStorage.read.getMemoriesByAddress([addr1.account.address]);
      
      expect(memoryIds.length).to.equal(2);
      expect(memoryIds[0]).to.equal(1n);
      expect(memoryIds[1]).to.equal(2n);
    });

    it("Should get multiple memories by IDs", async function () {
      const memoryIds = [1n, 2n, 3n];
      const entries = await memoryStorage.read.getMultipleMemories([memoryIds]);
      
      expect(entries.length).to.equal(3);
      expect(entries[0].ipfsHash).to.equal("QmTestHash111111111");
      expect(entries[1].ipfsHash).to.equal("QmTestHash222222222");
      expect(entries[2].ipfsHash).to.equal("QmTestHash333333333");
    });

    it("Should reject invalid memory ID", async function () {
      await expect(memoryStorage.read.getMemory([0n]))
        .to.be.revertedWith("Invalid memory ID");
      
      await expect(memoryStorage.read.getMemory([999n]))
        .to.be.revertedWith("Invalid memory ID");
    });
  });

  describe("Deleting Memories", function () {
    beforeEach(async function () {
      await memoryStorage.write.storeMemory(["QmTestHash111111111"], {
        account: addr1.account.address,
      });
      await memoryStorage.write.storeMemory(["QmTestHash222222222"], {
        account: addr1.account.address,
      });
    });

    it("Should delete a memory", async function () {
      await memoryStorage.write.deleteMemory([1n], {
        account: addr1.account.address,
      });

      const addr1Count = await memoryStorage.read.getMemoryCountByAddress([addr1.account.address]);
      expect(addr1Count).to.equal(1n);
    });

    it("Should only allow owner to delete their memory", async function () {
      await expect(
        memoryStorage.write.deleteMemory([1n], {
          account: addr2.account.address,
        })
      ).to.be.revertedWith("Not the owner of this memory");
    });

    it("Should reject invalid memory ID for deletion", async function () {
      await expect(
        memoryStorage.write.deleteMemory([999n], {
          account: addr1.account.address,
        })
      ).to.be.revertedWith("Invalid memory ID");
    });
  });

  describe("Ownership Checks", function () {
    beforeEach(async function () {
      await memoryStorage.write.storeMemory(["QmTestHash111111111"], {
        account: addr1.account.address,
      });
    });

    it("Should correctly identify memory owner", async function () {
      const isOwner1 = await memoryStorage.read.isMemoryOwner([addr1.account.address, 1n]);
      const isOwner2 = await memoryStorage.read.isMemoryOwner([addr2.account.address, 1n]);
      
      expect(isOwner1).to.be.true;
      expect(isOwner2).to.be.false;
    });

    it("Should return false for invalid memory ID", async function () {
      const isOwner = await memoryStorage.read.isMemoryOwner([addr1.account.address, 999n]);
      expect(isOwner).to.be.false;
    });
  });

  describe("Integration Test with Sample Data", function () {
    it("Should store and retrieve the sample data structure", async function () {
      // This represents the IPFS hash of the JSON data:
      // { "Extracted info" : "User love laddu", "Tags" : ["food","Gym"] }
      const sampleIpfsHash = "QmSampleDataHash123456789";
      
      // Store the memory
      const hash = await memoryStorage.write.storeMemory([sampleIpfsHash], {
        account: addr1.account.address,
      });
      
      // Wait for transaction to be mined
      await viem.getPublicClient().waitForTransactionReceipt({ hash });
      
      // Verify storage
      const totalCount = await memoryStorage.read.getTotalMemoryCount();
      const addr1Count = await memoryStorage.read.getMemoryCountByAddress([addr1.account.address]);
      
      expect(totalCount).to.equal(1n);
      expect(addr1Count).to.equal(1n);
      
      // Retrieve the memory
      const [retrievedHash, timestamp, owner] = await memoryStorage.read.getMemory([1n]);
      
      expect(retrievedHash).to.equal(sampleIpfsHash);
      expect(owner.toLowerCase()).to.equal(addr1.account.address.toLowerCase());
      expect(timestamp).to.be.gt(0n);
      
      // Verify ownership
      const isOwner = await memoryStorage.read.isMemoryOwner([addr1.account.address, 1n]);
      expect(isOwner).to.be.true;
    });
  });
});
