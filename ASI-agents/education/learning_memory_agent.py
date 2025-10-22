"""
Learning Memory Agent - Manages student learning history and progress
"""

import json
import os
from datetime import datetime
from uagents import Agent, Context, Protocol
from tutor_agent import MemoryRequest, MemoryResponse

class MemoryStorageInterface:
    """Interface to student learning memory storage"""
    
    def __init__(self, storage_file="student_memories.json"):
        self.storage_file = storage_file
        self.memories = []
        self.load_memories()
    
    def load_memories(self):
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r') as f:
                    data = json.load(f)
                    self.memories = data.get('memories', [])
                print(f"💾 Loaded {len(self.memories)} student memories")
            except Exception as e:
                print(f"Error loading memories: {e}")
                self.memories = []
        else:
            self.create_sample_memories()
    
    def create_sample_memories(self):
        """Create sample student memories"""
        sample_data = {
            "user_id": "user_001",
            "memories": [
                {
                    "id": "mem_001",
                    "entity": "Emma Rodriguez",
                    "category": "name",
                    "context": "Student's name is Emma Rodriguez",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "enrollment", "confidence": 1.0}
                },
                {
                    "id": "mem_002",
                    "entity": "Mathematics, Science",
                    "category": "subject_strength",
                    "context": "Excels in math and science subjects",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "assessment", "confidence": 0.92}
                },
                {
                    "id": "mem_003",
                    "entity": "Visual learner",
                    "category": "learning_style",
                    "context": "Prefers diagrams, charts, and visual aids",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "learning_profile", "confidence": 0.95}
                },
                {
                    "id": "mem_004",
                    "entity": "Algebra, Geometry",
                    "category": "completed_topics",
                    "context": "Successfully completed algebra and geometry modules",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "progress_tracking", "confidence": 1.0}
                },
                {
                    "id": "mem_005",
                    "entity": "Word problems",
                    "category": "struggles",
                    "context": "Needs extra support with word problem interpretation",
                    "timestamp": int(datetime.now().timestamp() * 1000),
                    "status": "local",
                    "metadata": {"source": "assessment", "confidence": 0.88}
                }
            ]
        }
        
        with open(self.storage_file, 'w') as f:
            json.dump(sample_data, f, indent=2)
        
        self.memories = sample_data["memories"]
        print(f"✅ Created sample student memories: {self.storage_file}")
    
    def get_all_memories(self):
        return self.memories
    
    def get_memories_by_category(self, category: str):
        if category == "all":
            return self.memories
        return [m for m in self.memories if m.get('category') == category]

memory_storage = MemoryStorageInterface()

learning_memory_agent = Agent(
    name="learning_memory_agent",
    seed="learning_memory_agent_seed_zkMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

memory_protocol = Protocol(name="LearningMemoryManagementProtocol", version="1.0.0")

@memory_protocol.on_message(model=MemoryRequest, replies=MemoryResponse)
async def handle_memory_request(ctx: Context, sender: str, msg: MemoryRequest):
    """Handle memory requests"""
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

learning_memory_agent.include(memory_protocol)

if __name__ == "__main__":
    print(f"🧠 Learning Memory Agent: {learning_memory_agent.address}")
    print(f"💾 Loaded {len(memory_storage.memories)} student memories")
    learning_memory_agent.run()
