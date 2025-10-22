"""
Investor Agent - Simulates an investor seeking financial advice
"""

from uagents import Agent, Context, Protocol
from advisor_agent import FinancialQuery, FinancialAdvice

investor_agent = Agent(
    name="investor_agent",
    seed="investor_agent_seed_phrase_zkMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

investor_protocol = Protocol(name="InvestorQueryProtocol", version="1.0.0")

@investor_protocol.on_interval(period=60.0)
async def send_financial_query(ctx: Context):
    ctx.logger.info("📤 Sending financial query...")
    
    query = FinancialQuery(
        client_id="INV-001",
        query_type="investment",
        question="I have $10,000 to invest. Should I focus on stocks, bonds, or a mix? I'm 35 and saving for retirement.",
        financial_history="",
        risk_tolerance="moderate",
        time_horizon="long"
    )
    
    advisor_address = "agent1q..."  # Set in financial_system.py
    await ctx.send(advisor_address, query)
    ctx.logger.info("✅ Query sent")

@investor_protocol.on_message(model=FinancialAdvice)
async def receive_advice(ctx: Context, sender: str, msg: FinancialAdvice):
    ctx.logger.info("\n" + "="*60)
    ctx.logger.info("💰 FINANCIAL ADVICE RECEIVED")
    ctx.logger.info("="*60)
    ctx.logger.info(f"📊 Analysis: {msg.analysis[:200]}...")
    ctx.logger.info("💡 Recommendations:")
    for i, rec in enumerate(msg.recommendations, 1):
        ctx.logger.info(f"   {i}. {rec[:100]}...")
    ctx.logger.info(f"⚠️ Risk: {msg.risk_assessment}")
    ctx.logger.info(f"📈 Outlook: {msg.projected_outcomes}")
    ctx.logger.info("="*60 + "\n")

investor_agent.include(investor_protocol)

if __name__ == "__main__":
    print(f"👨‍💼 Investor Agent: {investor_agent.address}")
    investor_agent.run()
