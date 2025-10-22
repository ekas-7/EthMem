"""
Client Agent - Simulates a legal client seeking consultation
This agent demonstrates protocol-based communication with the lawyer agent.
"""

from uagents import Agent, Context, Model, Protocol
import asyncio

# Import message models
from lawyer_agent import LegalQuery, LegalAdvice, ConsultationRequest, ConsultationConfirmation


# Initialize Client Agent
client_agent = Agent(
    name="client_agent",
    seed="client_agent_seed_phrase_zkMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Define Client Protocol
client_protocol = Protocol(name="ClientConsultationProtocol", version="1.0.0")


@client_protocol.on_interval(period=60.0)
async def send_legal_query(ctx: Context):
    """
    Periodically send legal queries to the lawyer agent
    """
    lawyer_address = "agent1qw8p7m5k3n2r4t6y8u0i9o7p5a3s1d2f4g6h8j0k2l4m6n8p0q2r4t6y8u0i2o"  # Will be set in law_system.py
    
    ctx.logger.info("📤 Sending legal consultation request...")
    
    # Create sample legal query
    query = LegalQuery(
        client_id="CLI-001",
        case_description="I received a contract termination notice from my employer without proper cause. I have been with the company for 5 years and never had performance issues. What are my rights?",
        legal_history="",
        case_type="civil",
        urgency_level="normal"
    )
    
    await ctx.send(lawyer_address, query)
    ctx.logger.info("✅ Legal query sent to lawyer")


@client_protocol.on_message(model=LegalAdvice)
async def receive_legal_advice(ctx: Context, sender: str, msg: LegalAdvice):
    """
    Handle legal advice received from lawyer agent
    """
    ctx.logger.info("\n" + "="*60)
    ctx.logger.info("⚖️  LEGAL ADVICE RECEIVED")
    ctx.logger.info("="*60)
    ctx.logger.info(f"📋 Legal Analysis: {msg.legal_analysis}")
    ctx.logger.info(f"⚠️  Urgency: {msg.urgency_assessment}")
    ctx.logger.info("💼 Recommendations:")
    for i, rec in enumerate(msg.recommendations, 1):
        ctx.logger.info(f"   {i}. {rec}")
    ctx.logger.info("📝 Next Steps:")
    for i, step in enumerate(msg.next_steps, 1):
        ctx.logger.info(f"   {i}. {step}")
    if msg.consultation_required:
        ctx.logger.info("🔔 URGENT: In-person consultation strongly recommended")
    ctx.logger.info("="*60 + "\n")


@client_protocol.on_message(model=ConsultationConfirmation)
async def receive_confirmation(ctx: Context, sender: str, msg: ConsultationConfirmation):
    """
    Handle consultation confirmation
    """
    ctx.logger.info(f"✅ Consultation confirmed!")
    ctx.logger.info(f"📅 Consultation ID: {msg.consultation_id}")
    ctx.logger.info(f"📆 Scheduled: {msg.scheduled_date}")
    ctx.logger.info(f"🔗 Meeting link: {msg.meeting_link}")


# Include protocol in agent
client_agent.include(client_protocol)


if __name__ == "__main__":
    print("\n" + "="*70)
    print("👤 CLIENT AGENT - Legal Consultation Seeker")
    print("="*70)
    print(f"📍 Address: {client_agent.address}")
    print("="*70)
    print()
    client_agent.run()
