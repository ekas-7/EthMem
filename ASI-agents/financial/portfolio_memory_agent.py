"""
Portfolio Memory Agent - Manages investor financial history and portfolio data
"""

import json
import os
from datetime import datetime
from uagents import Agent, Context, Protocol
from advisor_agent import MemoryRequest, MemoryResponse

class MemoryStorageInterface:
    def __init__(self, storage_file="portfolio_memories.json"):
        self.storage_file = storage_file
        self.memories = []
        self.load_memories()
    
    def load_memories(self):
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r') as f:
                    data = json.load(f)
                    self.memories = data.get('memories', [])
                print(f"💾 Loaded {len(self.memories)} portfolio memories")
            except Exception as e:
                self.memories = []
        else:
            self.create_sample_memories()
    
    def create_sample_memories(self):
        sample_data = {
            "user_id": "user_001",
            "memories": [
                {
                    "id": "mem_001",
                    "entity": "Michael Chen",
                    "category": "name",
                    "context": "Investor's name is Michael Chen",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "registration", "confidence": 1.0}
                },
                {
                    "id": "mem_002",
                    "entity": "60/40 stocks/bonds",
                    "category": "portfolio",
                    "context": "Current allocation: 60% stocks, 40% bonds",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "portfolio_analysis", "confidence": 1.0}
                },
                {
                    "id": "mem_003",
                    "entity": "Retirement at 65",
                    "category": "goals",
                    "context": "Primary goal: Comfortable retirement at age 65",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "financial_planning", "confidence": 1.0}
                },
                {
                    "id": "mem_004",
                    "entity": "Moderate risk tolerance",
                    "category": "risk_profile",
                    "context": "Willing to accept moderate volatility for growth",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "risk_assessment", "confidence": 0.95}
                },
                {
                    "id": "mem_005",
                    "entity": "Tech stocks, Index funds",
                    "category": "investments",
                    "context": "Currently invested in tech stocks and index funds",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "holdings", "confidence": 1.0}
                }
            ]
        }
        
        with open(self.storage_file, 'w') as f:
            json.dump(sample_data, f, indent=2)
        
        self.memories = sample_data["memories"]
        print(f"✅ Created sample portfolio memories: {self.storage_file}")
    
    def get_all_memories(self):
        return self.memories
    
    def get_memories_by_category(self, category: str):
        if category == "all":
            return self.memories
        return [m for m in self.memories if m.get('category') == category]

memory_storage = MemoryStorageInterface()

portfolio_memory_agent = Agent(
    name="portfolio_memory_agent",
    seed="portfolio_memory_agent_seed_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

memory_protocol = Protocol(name="PortfolioMemoryManagementProtocol", version="1.0.0")

@memory_protocol.on_message(model=MemoryRequest, replies=MemoryResponse)
async def handle_memory_request(ctx: Context, sender: str, msg: MemoryRequest):
    ctx.logger.info(f"📨 Memory request from {sender}")
    
    if msg.category and msg.category != "all":
        memories = memory_storage.get_memories_by_category(msg.category)
    else:
        memories = memory_storage.get_all_memories()
    
    if msg.limit:
        memories = memories[:msg.limit]
    
    response = MemoryResponse(
        user_id=msg.user_id,
        memories=memories,
        count=len(memories)
    )
    
    await ctx.send(sender, response)
    ctx.logger.info(f"✅ Sent {len(memories)} memories")

portfolio_memory_agent.include(memory_protocol)

if __name__ == "__main__":
    print(f"🧠 Portfolio Memory Agent: {portfolio_memory_agent.address}")
    print(f"💾 Loaded {len(memory_storage.memories)} portfolio memories")
    portfolio_memory_agent.run()
