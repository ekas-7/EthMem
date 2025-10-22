"""
Memory Agent - Interfaces with Browser Extension Storage
This agent reads memories from the browser extension's IndexedDB
and broadcasts them to other agents in the system via protocols.
"""

import os
import json
import sqlite3
from pathlib import Path
from typing import List, Dict, Optional
from uagents import Agent, Context, Model, Protocol
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# ============ MESSAGE MODELS ============
class UserMemory(Model):
    """Model for user memory data"""
    id: str
    entity: str
    category: str
    context: str
    timestamp: int
    status: str
    metadata: dict


class MemoryBroadcast(Model):
    """Model for broadcasting memories to agents"""
    user_id: str
    memories: List[Dict]
    total_count: int
    categories: List[str]


class MemoryRequest(Model):
    """Model for requesting specific memories"""
    user_id: str
    category: Optional[str] = None
    limit: Optional[int] = 10


class MemoryResponse(Model):
    """Model for memory query responses"""
    user_id: str
    memories: List[Dict]
    count: int


# ============ MEMORY STORAGE INTERFACE ============
class MemoryStorageInterface:
    """Interface to browser extension's local storage"""
    
    def __init__(self, storage_path: Optional[str] = None):
        """
        Initialize memory storage interface
        Args:
            storage_path: Path to a JSON file or SQLite DB simulating extension storage
        """
        self.storage_path = storage_path or os.path.join(
            os.path.dirname(__file__), 
            "user_memories.json"
        )
        self.ensure_storage_exists()
    
    def ensure_storage_exists(self):
        """Create storage file if it doesn't exist"""
        if not os.path.exists(self.storage_path):
            # Create with sample data
            sample_data = {
                "memories": [
                    {
                        "id": "mem_001",
                        "entity": "John Doe",
                        "category": "name",
                        "context": "User's name is John Doe",
                        "timestamp": 1729598400000,
                        "status": "local",
                        "metadata": {"source": "chat", "confidence": 0.95}
                    },
                    {
                        "id": "mem_002",
                        "entity": "New York",
                        "category": "location",
                        "context": "User lives in New York",
                        "timestamp": 1729598500000,
                        "status": "local",
                        "metadata": {"source": "chat", "confidence": 0.90}
                    },
                    {
                        "id": "mem_003",
                        "entity": "peanuts",
                        "category": "allergy",
                        "context": "User is allergic to peanuts",
                        "timestamp": 1729598600000,
                        "status": "local",
                        "metadata": {"source": "chat", "confidence": 0.98}
                    },
                    {
                        "id": "mem_004",
                        "entity": "Software Engineer",
                        "category": "occupation",
                        "context": "User works as a Software Engineer",
                        "timestamp": 1729598700000,
                        "status": "local",
                        "metadata": {"source": "chat", "confidence": 0.92}
                    }
                ]
            }
            
            with open(self.storage_path, 'w') as f:
                json.dump(sample_data, f, indent=2)
            
            print(f"[MemoryAgent] Created sample storage at {self.storage_path}")
    
    def get_all_memories(self) -> List[Dict]:
        """Retrieve all memories from storage"""
        try:
            with open(self.storage_path, 'r') as f:
                data = json.load(f)
                return data.get("memories", [])
        except Exception as e:
            print(f"[MemoryAgent] Error reading memories: {e}")
            return []
    
    def get_memories_by_category(self, category: str) -> List[Dict]:
        """Get memories filtered by category"""
        all_memories = self.get_all_memories()
        return [m for m in all_memories if m.get("category") == category]
    
    def get_memory_categories(self) -> List[str]:
        """Get list of all unique categories"""
        memories = self.get_all_memories()
        return list(set(m.get("category") for m in memories if m.get("category")))
    
    def add_memory(self, memory: Dict):
        """Add new memory to storage"""
        try:
            with open(self.storage_path, 'r') as f:
                data = json.load(f)
            
            data["memories"].append(memory)
            
            with open(self.storage_path, 'w') as f:
                json.dump(data, f, indent=2)
            
            print(f"[MemoryAgent] Memory added: {memory.get('id')}")
            return True
        except Exception as e:
            print(f"[MemoryAgent] Error adding memory: {e}")
            return False
    
    def get_stats(self) -> Dict:
        """Get memory statistics"""
        memories = self.get_all_memories()
        categories = {}
        for mem in memories:
            cat = mem.get("category", "unknown")
            categories[cat] = categories.get(cat, 0) + 1
        
        return {
            "total": len(memories),
            "categories": categories,
            "recent": memories[-5:] if len(memories) > 5 else memories
        }


# ============ INITIALIZE MEMORY AGENT ============
memory_agent = Agent(
    name="memory_agent",
    seed="memory_agent_seed_phrase_ETHMem_2024",
    port=8002,
)

# Initialize storage interface
storage = MemoryStorageInterface()

# Define Memory Protocol
memory_protocol = Protocol(name="MemoryManagementProtocol", version="1.0.0")


@memory_agent.on_event("startup")
async def startup(ctx: Context):
    """Memory agent startup"""
    ctx.logger.info(f"🧠 Memory Agent started")
    ctx.logger.info(f"📍 Address: {ctx.agent.address}")
    ctx.logger.info(f"💾 Storage path: {storage.storage_path}")
    
    # Load and display stats
    stats = storage.get_stats()
    ctx.logger.info(f"📊 Memory Statistics:")
    ctx.logger.info(f"   Total memories: {stats['total']}")
    ctx.logger.info(f"   Categories: {', '.join(stats['categories'].keys())}")


@memory_protocol.on_interval(period=60.0)
async def broadcast_memories(ctx: Context):
    """Broadcast all memories to registered agents periodically"""
    ctx.logger.info("📡 Broadcasting user memories...")
    
    memories = storage.get_all_memories()
    categories = storage.get_memory_categories()
    
    broadcast = MemoryBroadcast(
        user_id="user_001",
        memories=memories,
        total_count=len(memories),
        categories=categories
    )
    
    ctx.logger.info(f"📤 Broadcasting {len(memories)} memories across {len(categories)} categories")
    
    # Store in agent storage for other agents to query
    ctx.storage.set("user_memories", {
        "memories": memories,
        "last_updated": ctx.timestamp
    })


@memory_protocol.on_message(model=MemoryRequest, replies=MemoryResponse)
async def handle_memory_request(ctx: Context, sender: str, msg: MemoryRequest):
    """Handle memory requests from other agents"""
    ctx.logger.info(f"📨 Memory request from {sender}")
    ctx.logger.info(f"   User ID: {msg.user_id}")
    ctx.logger.info(f"   Category: {msg.category or 'all'}")
    ctx.logger.info(f"   Limit: {msg.limit}")
    
    # Get memories
    if msg.category:
        memories = storage.get_memories_by_category(msg.category)
    else:
        memories = storage.get_all_memories()
    
    # Apply limit
    if msg.limit:
        memories = memories[:msg.limit]
    
    response = MemoryResponse(
        user_id=msg.user_id,
        memories=memories,
        count=len(memories)
    )
    
    await ctx.send(sender, response)
    ctx.logger.info(f"✅ Sent {len(memories)} memories to {sender}")


@memory_protocol.on_interval(period=300.0)
async def sync_status(ctx: Context):
    """Periodic status update"""
    stats = storage.get_stats()
    ctx.logger.info(f"💾 Memory Storage Status:")
    ctx.logger.info(f"   Total: {stats['total']} memories")
    for category, count in stats['categories'].items():
        ctx.logger.info(f"   - {category}: {count}")


if __name__ == "__main__":
    # Include protocol and publish manifest
    memory_agent.include(memory_protocol, publish_manifest=True)
    memory_agent.run()
