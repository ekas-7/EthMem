const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemoryStorage", function () {
  let memoryStorage;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const MemoryStorage = await ethers.getContractFactory("MemoryStorage");
    memoryStorage = await MemoryStorage.deploy();
    await memoryStorage.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await memoryStorage.owner()).to.equal(owner.address);
    });

    it("Should start with zero memories", async function () {
      expect(await memoryStorage.getTotalMemoryCount()).to.equal(0);
    });
  });

  describe("Storing Memories", function () {
    it("Should store a memory and emit event", async function () {
      const ipfsHash = "QmTestHash123456789";
      
      await expect(memoryStorage.connect(addr1).storeMemory(ipfsHash))
        .to.emit(memoryStorage, "MemoryStored")
        .withArgs(addr1.address, 1, ipfsHash, (value) => value > 0);

      expect(await memoryStorage.getTotalMemoryCount()).to.equal(1);
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(memoryStorage.connect(addr1).storeMemory(""))
        .to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("Should allow multiple memories from same address", async function () {
      const ipfsHash1 = "QmTestHash111111111";
      const ipfsHash2 = "QmTestHash222222222";
      
      await memoryStorage.connect(addr1).storeMemory(ipfsHash1);
      await memoryStorage.connect(addr1).storeMemory(ipfsHash2);
      
      expect(await memoryStorage.getTotalMemoryCount()).to.equal(2);
      expect(await memoryStorage.getMemoryCountByAddress(addr1.address)).to.equal(2);
    });

    it("Should allow memories from different addresses", async function () {
      const ipfsHash1 = "QmTestHash111111111";
      const ipfsHash2 = "QmTestHash222222222";
      
      await memoryStorage.connect(addr1).storeMemory(ipfsHash1);
      await memoryStorage.connect(addr2).storeMemory(ipfsHash2);
      
      expect(await memoryStorage.getTotalMemoryCount()).to.equal(2);
      expect(await memoryStorage.getMemoryCountByAddress(addr1.address)).to.equal(1);
      expect(await memoryStorage.getMemoryCountByAddress(addr2.address)).to.equal(1);
    });
  });

  describe("Retrieving Memories", function () {
    beforeEach(async function () {
      // Store some test memories
      await memoryStorage.connect(addr1).storeMemory("QmTestHash111111111");
      await memoryStorage.connect(addr1).storeMemory("QmTestHash222222222");
      await memoryStorage.connect(addr2).storeMemory("QmTestHash333333333");
    });

    it("Should retrieve a specific memory", async function () {
      const [ipfsHash, timestamp, owner] = await memoryStorage.getMemory(1);
      
      expect(ipfsHash).to.equal("QmTestHash111111111");
      expect(owner).to.equal(addr1.address);
      expect(timestamp).to.be.gt(0);
    });

    it("Should get all memories for an address", async function () {
      const memoryIds = await memoryStorage.getMemoriesByAddress(addr1.address);
      
      expect(memoryIds.length).to.equal(2);
      expect(memoryIds[0]).to.equal(1);
      expect(memoryIds[1]).to.equal(2);
    });

    it("Should get multiple memories by IDs", async function () {
      const memoryIds = [1, 2, 3];
      const entries = await memoryStorage.getMultipleMemories(memoryIds);
      
      expect(entries.length).to.equal(3);
      expect(entries[0].ipfsHash).to.equal("QmTestHash111111111");
      expect(entries[1].ipfsHash).to.equal("QmTestHash222222222");
      expect(entries[2].ipfsHash).to.equal("QmTestHash333333333");
    });

    it("Should reject invalid memory ID", async function () {
      await expect(memoryStorage.getMemory(0))
        .to.be.revertedWith("Invalid memory ID");
      
      await expect(memoryStorage.getMemory(999))
        .to.be.revertedWith("Invalid memory ID");
    });
  });

  describe("Deleting Memories", function () {
    beforeEach(async function () {
      await memoryStorage.connect(addr1).storeMemory("QmTestHash111111111");
      await memoryStorage.connect(addr1).storeMemory("QmTestHash222222222");
    });

    it("Should delete a memory and emit event", async function () {
      await expect(memoryStorage.connect(addr1).deleteMemory(1))
        .to.emit(memoryStorage, "MemoryDeleted")
        .withArgs(addr1.address, 1);

      expect(await memoryStorage.getMemoryCountByAddress(addr1.address)).to.equal(1);
    });

    it("Should only allow owner to delete their memory", async function () {
      await expect(memoryStorage.connect(addr2).deleteMemory(1))
        .to.be.revertedWith("Not the owner of this memory");
    });

    it("Should reject invalid memory ID for deletion", async function () {
      await expect(memoryStorage.connect(addr1).deleteMemory(999))
        .to.be.revertedWith("Invalid memory ID");
    });
  });

  describe("Ownership Checks", function () {
    beforeEach(async function () {
      await memoryStorage.connect(addr1).storeMemory("QmTestHash111111111");
    });

    it("Should correctly identify memory owner", async function () {
      expect(await memoryStorage.isMemoryOwner(addr1.address, 1)).to.be.true;
      expect(await memoryStorage.isMemoryOwner(addr2.address, 1)).to.be.false;
    });

    it("Should return false for invalid memory ID", async function () {
      expect(await memoryStorage.isMemoryOwner(addr1.address, 999)).to.be.false;
    });
  });

  describe("Integration Test with Sample Data", function () {
    it("Should store and retrieve the sample data structure", async function () {
      // This represents the IPFS hash of the JSON data:
      // { "Extracted info" : "User love laddu", "Tags" : ["food","Gym"] }
      const sampleIpfsHash = "QmSampleDataHash123456789";
      
      // Store the memory
      const tx = await memoryStorage.connect(addr1).storeMemory(sampleIpfsHash);
      const receipt = await tx.wait();
      
      // Verify storage
      expect(await memoryStorage.getTotalMemoryCount()).to.equal(1);
      expect(await memoryStorage.getMemoryCountByAddress(addr1.address)).to.equal(1);
      
      // Retrieve the memory
      const [retrievedHash, timestamp, owner] = await memoryStorage.getMemory(1);
      
      expect(retrievedHash).to.equal(sampleIpfsHash);
      expect(owner).to.equal(addr1.address);
      expect(timestamp).to.be.gt(0);
      
      // Verify ownership
      expect(await memoryStorage.isMemoryOwner(addr1.address, 1)).to.be.true;
    });
  });
});

// Helper function for time manipulation in tests
const time = {
  latest: async () => {
    const block = await ethers.provider.getBlock('latest');
    return block.timestamp;
  }
};
