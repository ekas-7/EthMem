"""
Financial System - Bureau-managed financial advisory system with portfolio memory
"""

from uagents import Bureau
from advisor_agent import advisor_agent
from investor_agent import investor_agent
from portfolio_memory_agent import portfolio_memory_agent, memory_storage

bureau = Bureau(endpoint=["http://127.0.0.1:12000/submit"])
bureau.add(advisor_agent)
bureau.add(investor_agent)
bureau.add(portfolio_memory_agent)

if __name__ == "__main__":
    print("\n" + "="*70)
    print("💰 FINANCIAL ADVISORY SYSTEM WITH PORTFOLIO MEMORY")
    print("="*70)
    print(f"👨‍💼 Advisor Agent:  {advisor_agent.address}")
    print(f"👨‍💼 Investor Agent: {investor_agent.address}")
    print(f"🧠 Memory Agent:    {portfolio_memory_agent.address}")
    print("="*70)
    print(f"💾 Loaded {len(memory_storage.memories)} portfolio memories:")
    for mem in memory_storage.memories:
        print(f"   - [{mem['category']}] {mem['context']}")
    print("="*70)
    print()
    bureau.run()
