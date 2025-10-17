// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MemoryStorage
 * @dev Smart contract for storing memory data on IPFS with one-to-many address mapping
 * Each address can have multiple memory entries stored as IPFS hashes
 */
contract MemoryStorage is Ownable, ReentrancyGuard {
    
    // Struct to represent a memory entry
    struct MemoryEntry {
        string ipfsHash;           // IPFS hash of the stored data
        uint256 timestamp;         // When the memory was stored
        address owner;             // Address that owns this memory
        uint256 entryId;           // Unique ID for this entry
    }
    
    // Mapping from address to array of memory entry IDs
    mapping(address => uint256[]) private addressToMemoryIds;
    
    // Mapping from memory entry ID to MemoryEntry struct
    mapping(uint256 => MemoryEntry) private memoryEntries;
    
    // Counter for generating unique memory entry IDs
    uint256 private nextMemoryId = 1;
    
    // Events
    event MemoryStored(
        address indexed owner,
        uint256 indexed memoryId,
        string ipfsHash,
        uint256 timestamp
    );
    
    event MemoryRetrieved(
        address indexed requester,
        uint256 indexed memoryId,
        string ipfsHash
    );
    
    event MemoryDeleted(
        address indexed owner,
        uint256 indexed memoryId
    );
    
    /**
     * @dev Constructor sets the initial owner
     */
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Store a new memory entry with IPFS hash
     * @param _ipfsHash The IPFS hash of the memory data
     * @return memoryId The unique ID of the stored memory
     */
    function storeMemory(string memory _ipfsHash) 
        external 
        nonReentrant 
        returns (uint256 memoryId) 
    {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        memoryId = nextMemoryId++;
        
        MemoryEntry memory newEntry = MemoryEntry({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            owner: msg.sender,
            entryId: memoryId
        });
        
        memoryEntries[memoryId] = newEntry;
        addressToMemoryIds[msg.sender].push(memoryId);
        
        emit MemoryStored(msg.sender, memoryId, _ipfsHash, block.timestamp);
        
        return memoryId;
    }
    
    /**
     * @dev Get a specific memory entry by ID
     * @param _memoryId The ID of the memory entry to retrieve
     * @return ipfsHash The IPFS hash of the memory data
     * @return timestamp When the memory was stored
     * @return owner The address that owns this memory
     */
    function getMemory(uint256 _memoryId) 
        external 
        view 
        returns (
            string memory ipfsHash,
            uint256 timestamp,
            address owner
        ) 
    {
        require(_memoryId > 0 && _memoryId < nextMemoryId, "Invalid memory ID");
        
        MemoryEntry memory entry = memoryEntries[_memoryId];
        
        return (entry.ipfsHash, entry.timestamp, entry.owner);
    }
    
    /**
     * @dev Get a specific memory entry by ID and emit retrieval event
     * @param _memoryId The ID of the memory entry to retrieve
     * @return ipfsHash The IPFS hash of the memory data
     * @return timestamp When the memory was stored
     * @return owner The address that owns this memory
     */
    function getMemoryWithEvent(uint256 _memoryId) 
        external 
        returns (
            string memory ipfsHash,
            uint256 timestamp,
            address owner
        ) 
    {
        require(_memoryId > 0 && _memoryId < nextMemoryId, "Invalid memory ID");
        
        MemoryEntry memory entry = memoryEntries[_memoryId];
        
        emit MemoryRetrieved(msg.sender, _memoryId, entry.ipfsHash);
        
        return (entry.ipfsHash, entry.timestamp, entry.owner);
    }
    
    /**
     * @dev Get all memory IDs for a specific address
     * @param _address The address to get memories for
     * @return memoryIds Array of memory IDs owned by the address
     */
    function getMemoriesByAddress(address _address) 
        external 
        view 
        returns (uint256[] memory memoryIds) 
    {
        return addressToMemoryIds[_address];
    }
    
    /**
     * @dev Get multiple memory entries by their IDs
     * @param _memoryIds Array of memory IDs to retrieve
     * @return entries Array of MemoryEntry structs
     */
    function getMultipleMemories(uint256[] memory _memoryIds) 
        external 
        view 
        returns (MemoryEntry[] memory entries) 
    {
        entries = new MemoryEntry[](_memoryIds.length);
        
        for (uint256 i = 0; i < _memoryIds.length; i++) {
            require(_memoryIds[i] > 0 && _memoryIds[i] < nextMemoryId, "Invalid memory ID");
            entries[i] = memoryEntries[_memoryIds[i]];
        }
        
        return entries;
    }
    
    /**
     * @dev Delete a memory entry (only by owner)
     * @param _memoryId The ID of the memory entry to delete
     */
    function deleteMemory(uint256 _memoryId) external nonReentrant {
        require(_memoryId > 0 && _memoryId < nextMemoryId, "Invalid memory ID");
        require(memoryEntries[_memoryId].owner == msg.sender, "Not the owner of this memory");
        
        // Remove from address mapping
        uint256[] storage userMemories = addressToMemoryIds[msg.sender];
        for (uint256 i = 0; i < userMemories.length; i++) {
            if (userMemories[i] == _memoryId) {
                userMemories[i] = userMemories[userMemories.length - 1];
                userMemories.pop();
                break;
            }
        }
        
        // Clear the memory entry
        delete memoryEntries[_memoryId];
        
        emit MemoryDeleted(msg.sender, _memoryId);
    }
    
    /**
     * @dev Get the total number of memory entries
     * @return count The total number of memory entries
     */
    function getTotalMemoryCount() external view returns (uint256 count) {
        return nextMemoryId - 1;
    }
    
    /**
     * @dev Get the number of memories for a specific address
     * @param _address The address to check
     * @return count The number of memories owned by the address
     */
    function getMemoryCountByAddress(address _address) 
        external 
        view 
        returns (uint256 count) 
    {
        return addressToMemoryIds[_address].length;
    }
    
    /**
     * @dev Check if an address owns a specific memory
     * @param _address The address to check
     * @param _memoryId The memory ID to check
     * @return isOwner True if the address owns the memory
     */
    function isMemoryOwner(address _address, uint256 _memoryId) 
        external 
        view 
        returns (bool isOwner) 
    {
        if (_memoryId == 0 || _memoryId >= nextMemoryId) {
            return false;
        }
        return memoryEntries[_memoryId].owner == _address;
    }
}
