"""
Support System - Bureau-managed customer support system with memory integration
See medical/medical_system.py or law/law_system.py for full implementation details.
This file provides the same architecture adapted for customer support.
"""

from uagents import Bureau
from support_agent import support_agent
from customer_agent import customer_agent
from ticket_memory_agent import ticket_memory_agent, memory_storage

# Create Bureau with all agents
bureau = Bureau(endpoint=["http://127.0.0.1:10000/submit"])
bureau.add(support_agent)
bureau.add(customer_agent)
bureau.add(ticket_memory_agent)

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🎧 CUSTOMER SUPPORT SYSTEM WITH MEMORY INTEGRATION")
    print("="*70)
    print(f"👨‍💼 Support Agent:  {support_agent.address}")
    print(f"👤 Customer Agent: {customer_agent.address}")
    print(f"🧠 Memory Agent:   {ticket_memory_agent.address}")
    print("="*70)
    print(f"💾 Loaded {len(memory_storage.memories)} customer memories:")
    for mem in memory_storage.memories:
        print(f"   - [{mem['category']}] {mem['context']}")
    print("="*70)
    print()
    bureau.run()
