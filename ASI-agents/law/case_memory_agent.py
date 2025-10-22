"""
Case Memory Agent - Manages client legal memories and case history
Integrates with browser extension storage to provide personalized legal context.
"""

import json
import os
from datetime import datetime
from uagents import Agent, Context, Model, Protocol


# Import message models
from lawyer_agent import MemoryRequest, MemoryResponse


class MemoryStorageInterface:
    """
    Interface to case memory storage (browser extension JSON export)
    """
    
    def __init__(self, storage_file="case_memories.json"):
        self.storage_file = storage_file
        self.memories = []
        self.load_memories()
    
    def load_memories(self):
        """Load case memories from JSON file"""
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r') as f:
                    data = json.load(f)
                    self.memories = data.get('memories', [])
                print(f"💾 Loaded {len(self.memories)} case memories from storage")
            except Exception as e:
                print(f"Error loading memories: {e}")
                self.memories = []
        else:
            # Create default file with sample data
            self.create_sample_memories()
    
    def create_sample_memories(self):
        """Create sample case memories"""
        sample_data = {
            "user_id": "user_001",
            "memories": [
                {
                    "id": "mem_001",
                    "entity": "John Smith",
                    "category": "name",
                    "context": "Client's full name is John Smith",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "registration", "confidence": 1.0}
                },
                {
                    "id": "mem_002",
                    "entity": "employment law",
                    "category": "legal_matter",
                    "context": "Previous employment dispute in 2022",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "case_history", "confidence": 0.95}
                },
                {
                    "id": "mem_003",
                    "entity": "California",
                    "category": "jurisdiction",
                    "context": "Client resides in California",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "profile", "confidence": 1.0}
                },
                {
                    "id": "mem_004",
                    "entity": "5 years employment",
                    "category": "case_history",
                    "context": "Current employer tenure is 5 years",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "intake", "confidence": 1.0}
                }
            ]
        }
        
        with open(self.storage_file, 'w') as f:
            json.dump(sample_data, f, indent=2)
        
        self.memories = sample_data["memories"]
        print(f"✅ Created sample case memories: {self.storage_file}")
    
    def get_all_memories(self):
        """Get all case memories"""
        return self.memories
    
    def get_memories_by_category(self, category: str):
        """Get memories filtered by category"""
        if category == "all":
            return self.memories
        return [m for m in self.memories if m.get('category') == category]
    
    def get_memories_limited(self, limit: int):
        """Get limited number of memories"""
        return self.memories[:limit]


# Initialize Case Memory Agent
memory_agent = Agent(
    name="case_memory_agent",
    seed="case_memory_agent_seed_zkMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Initialize storage interface
storage = MemoryStorageInterface()

# Define Memory Management Protocol
memory_protocol = Protocol(name="CaseMemoryManagementProtocol", version="1.0.0")


@memory_protocol.on_message(model=MemoryRequest, replies=MemoryResponse)
async def handle_memory_request(ctx: Context, sender: str, msg: MemoryRequest):
    """
    Handle requests for case memories from other agents
    """
    ctx.logger.info(f"📨 Memory request from {sender} for category: {msg.category}")
    
    # Get memories based on request
    if msg.category and msg.category != "all":
        memories = storage.get_memories_by_category(msg.category)
    else:
        memories = storage.get_all_memories()
    
    # Apply limit
    if msg.limit:
        memories = memories[:msg.limit]
    
    # Create response
    response = MemoryResponse(
        user_id=msg.user_id,
        memories=memories,
        count=len(memories)
    )
    
    await ctx.send(sender, response)
    ctx.logger.info(f"✅ Sent {len(memories)} memories to {sender}")


# Include protocol in agent
memory_agent.include(memory_protocol)


if __name__ == "__main__":
    print("\n" + "="*70)
    print("🧠 CASE MEMORY AGENT")
    print("="*70)
    print(f"📍 Address: {memory_agent.address}")
    print(f"💾 Loaded {len(storage.memories)} case memories:")
    for mem in storage.memories:
        print(f"   - [{mem['category']}] {mem['context']}")
    print("="*70)
    print()
    memory_agent.run()
