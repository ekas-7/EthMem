"""
Customer Agent - Simulates a customer seeking support
"""

from uagents import Agent, Context, Protocol
from support_agent import SupportTicket, SupportResponse

customer_agent = Agent(
    name="customer_agent",
    seed="customer_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

customer_protocol = Protocol(name="CustomerRequestProtocol", version="1.0.0")

@customer_protocol.on_interval(period=60.0)
async def send_support_request(ctx: Context):
    """Send support tickets periodically"""
    support_address = "agent1q..."  # Set in support_system.py
    
    ctx.logger.info("📤 Sending support ticket...")
    
    ticket = SupportTicket(
        customer_id="CUST-001",
        issue_description="I can't log into my account. Keep getting 'Invalid credentials' error even though my password is correct.",
        customer_history="",
        category="technical",
        priority="normal"
    )
    
    await ctx.send(support_address, ticket)
    ctx.logger.info("✅ Support ticket sent")

@customer_protocol.on_message(model=SupportResponse)
async def receive_support_response(ctx: Context, sender: str, msg: SupportResponse):
    """Handle support response"""
    ctx.logger.info("\n" + "="*60)
    ctx.logger.info("🎧 SUPPORT RESPONSE RECEIVED")
    ctx.logger.info("="*60)
    ctx.logger.info(f"🎫 Ticket: {msg.ticket_id}")
    ctx.logger.info(f"💡 Solution: {msg.solution}")
    ctx.logger.info("📝 Suggestions:")
    for i, sug in enumerate(msg.suggestions, 1):
        ctx.logger.info(f"   {i}. {sug}")
    ctx.logger.info(f"⏱️ Estimated Resolution: {msg.estimated_resolution_time}")
    ctx.logger.info("="*60 + "\n")

customer_agent.include(customer_protocol)

if __name__ == "__main__":
    print(f"👤 Customer Agent: {customer_agent.address}")
    customer_agent.run()
