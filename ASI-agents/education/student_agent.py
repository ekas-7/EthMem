"""
Student Agent - Simulates a student seeking tutoring
"""

from uagents import Agent, Context, Protocol
from tutor_agent import LearningQuery, TutoringResponse

student_agent = Agent(
    name="student_agent",
    seed="student_agent_seed_phrase_zkMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

student_protocol = Protocol(name="StudentLearningProtocol", version="1.0.0")

@student_protocol.on_interval(period=60.0)
async def send_learning_query(ctx: Context):
    """Send learning queries periodically"""
    tutor_address = "agent1q..."  # Set in education_system.py
    
    ctx.logger.info("📤 Sending learning query to tutor...")
    
    query = LearningQuery(
        student_id="STU-001",
        subject="Mathematics",
        topic="Quadratic Equations",
        question="I don't understand how to solve x² + 5x + 6 = 0. Can you explain the factoring method?",
        learning_history="",
        difficulty_level="intermediate",
        learning_style="visual"
    )
    
    await ctx.send(tutor_address, query)
    ctx.logger.info("✅ Learning query sent")

@student_protocol.on_message(model=TutoringResponse)
async def receive_tutoring(ctx: Context, sender: str, msg: TutoringResponse):
    """Handle tutoring response"""
    ctx.logger.info("\n" + "="*60)
    ctx.logger.info("📚 TUTORING RESPONSE RECEIVED")
    ctx.logger.info("="*60)
    ctx.logger.info(f"📖 Subject: {msg.subject}")
    ctx.logger.info(f"💡 Explanation: {msg.explanation[:200]}...")
    ctx.logger.info("📝 Examples:")
    for i, ex in enumerate(msg.examples, 1):
        ctx.logger.info(f"   {i}. {ex[:100]}...")
    ctx.logger.info("🎯 Practice Problems:")
    for i, prob in enumerate(msg.practice_problems, 1):
        ctx.logger.info(f"   {i}. {prob[:100]}...")
    ctx.logger.info(f"📊 Mastery: {msg.mastery_assessment}")
    ctx.logger.info("="*60 + "\n")

student_agent.include(student_protocol)

if __name__ == "__main__":
    print(f"👨‍🎓 Student Agent: {student_agent.address}")
    student_agent.run()
