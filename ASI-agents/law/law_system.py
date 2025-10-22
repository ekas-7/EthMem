"""
Law System - Bureau-managed multi-agent legal consultation system
Combines lawyer, client, and case memory agents for intelligent legal consultations.
"""

import os
from uagents import Agent, Context, Model, Protocol, Bureau
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# ASI API Configuration
ASI_API_URL = "https://api.asi1.ai/v1/chat/completions"
ASI_API_KEY = os.getenv("ASI_ONE_API_KEY")


# ==================== MESSAGE MODELS ====================

class LegalQuery(Model):
    """Model for incoming legal queries"""
    client_id: str
    case_description: str
    legal_history: str = ""
    case_type: str = "general"
    urgency_level: str = "normal"


class LegalAdvice(Model):
    """Model for legal advice response"""
    client_id: str
    legal_analysis: str
    recommendations: list[str]
    next_steps: list[str]
    consultation_required: bool
    urgency_assessment: str


class MemoryRequest(Model):
    """Model for requesting case memories"""
    user_id: str
    category: str = "all"
    limit: int = 10


class MemoryResponse(Model):
    """Model for memory response"""
    user_id: str
    memories: list[dict]
    count: int


# ==================== AGENTS ====================

# Initialize Lawyer Agent
lawyer_agent = Agent(
    name="lawyer_agent",
    seed="lawyer_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Initialize Client Agent
client_agent = Agent(
    name="client_agent",
    seed="client_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Initialize Case Memory Agent
from case_memory_agent import MemoryStorageInterface
memory_storage = MemoryStorageInterface()

memory_agent = Agent(
    name="case_memory_agent",
    seed="case_memory_agent_seed_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)


# ==================== PROTOCOLS ====================

# Lawyer Protocol
lawyer_protocol = Protocol(name="LegalConsultationProtocol", version="1.0.0")

@lawyer_protocol.on_message(model=LegalQuery, replies=LegalAdvice)
async def handle_legal_query(ctx: Context, sender: str, msg: LegalQuery):
    """Handle incoming legal queries from clients"""
    ctx.logger.info(f"📨 Received legal query from client: {msg.client_id}")
    ctx.logger.info(f"📋 Case Type: {msg.case_type}")
    ctx.logger.info(f"⚖️ Case Description: {msg.case_description[:100]}...")
    
    # Request case memories from memory agent
    ctx.logger.info("🧠 Requesting case memories from memory agent...")
    memory_request = MemoryRequest(
        user_id=msg.client_id,
        category="all",
        limit=10
    )
    
    await ctx.send(memory_agent.address, memory_request)
    
    # Store pending query
    ctx.storage.set("pending_query", msg.dict())
    ctx.storage.set("pending_sender", sender)


@lawyer_protocol.on_message(model=MemoryResponse)
async def process_with_memories(ctx: Context, sender: str, msg: MemoryResponse):
    """Process legal query with case memories"""
    query_dict = ctx.storage.get("pending_query")
    if not query_dict:
        return
    
    query = LegalQuery(**query_dict)
    original_sender = ctx.storage.get("pending_sender")
    
    ctx.logger.info(f"💾 Found {len(msg.memories)} case memories")
    
    # Extract relevant legal memories
    legal_memories = [m for m in msg.memories if m.get('category') in ['case_history', 'legal_matter', 'jurisdiction', 'preferences']]
    ctx.logger.info(f"⚖️ Found {len(legal_memories)} relevant legal memories")
    
    # Enhance legal history with memories
    enhanced_history = query.legal_history
    if legal_memories:
        memory_text = "\n".join([f"- {m.get('entity')} ({m.get('category')}): {m.get('context', '')}" for m in legal_memories])
        enhanced_history = f"{query.legal_history}\n\nRelevant Case History:\n{memory_text}"
        ctx.logger.info("📋 Enhanced legal history with case memories")
    
    # Analyze case using ASI API
    analysis = analyze_case_asi(query.case_description, enhanced_history, query.case_type)
    recommendations = generate_legal_recommendations_asi(analysis, query.case_type, legal_memories)
    next_steps = generate_next_steps(query.case_type, query.urgency_level)
    urgency = assess_urgency(query.case_description, query.urgency_level)
    
    advice = LegalAdvice(
        client_id=query.client_id,
        legal_analysis=analysis,
        recommendations=recommendations,
        next_steps=next_steps,
        consultation_required=urgency in ["high", "urgent"],
        urgency_assessment=urgency
    )
    
    await ctx.send(original_sender, advice)
    ctx.logger.info(f"✅ Sent legal advice to {original_sender}")
    
    ctx.storage.set("pending_query", None)
    ctx.storage.set("pending_sender", None)


lawyer_agent.include(lawyer_protocol)


# Client Protocol
client_protocol = Protocol(name="ClientConsultationProtocol", version="1.0.0")

@client_protocol.on_interval(period=60.0)
async def send_legal_query(ctx: Context):
    """Periodically send legal queries to lawyer"""
    ctx.logger.info("📤 Sending legal consultation request...")
    
    query = LegalQuery(
        client_id="CLI-001",
        case_description="I received a contract termination notice from my employer without proper cause. I have been with the company for 5 years and never had performance issues. What are my rights?",
        legal_history="",
        case_type="civil",
        urgency_level="normal"
    )
    
    await ctx.send(lawyer_agent.address, query)
    ctx.logger.info("✅ Legal query sent to lawyer")


@client_protocol.on_message(model=LegalAdvice)
async def receive_legal_advice(ctx: Context, sender: str, msg: LegalAdvice):
    """Handle legal advice received"""
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
    ctx.logger.info("="*60 + "\n")


client_agent.include(client_protocol)


# Memory Protocol
memory_protocol = Protocol(name="CaseMemoryManagementProtocol", version="1.0.0")

@memory_protocol.on_message(model=MemoryRequest, replies=MemoryResponse)
async def handle_memory_request(ctx: Context, sender: str, msg: MemoryRequest):
    """Handle memory requests"""
    ctx.logger.info(f"📨 Memory request from {sender} for category: {msg.category}")
    
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
    ctx.logger.info(f"✅ Sent {len(memories)} memories to {sender}")


memory_agent.include(memory_protocol)


# ==================== HELPER FUNCTIONS ====================

def analyze_case_asi(case_description: str, legal_history: str, case_type: str) -> str:
    """Analyze case using ASI API"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""You are an experienced legal consultant. Analyze the following case:

Case Type: {case_type}
Case Description: {case_description}
Legal History: {legal_history}

Provide a comprehensive legal analysis covering key legal issues, applicable laws, and recommendations."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a knowledgeable legal advisor."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return fallback_analysis(case_description, case_type)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_analysis(case_description, case_type)


def generate_legal_recommendations_asi(analysis: str, case_type: str, memories: list) -> list[str]:
    """Generate legal recommendations using ASI API"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        memory_context = ""
        if memories:
            memory_context = "Client history: " + ", ".join([m.get('entity', '') for m in memories[:3]])
        
        prompt = f"""Based on this {case_type} case analysis:
{analysis}

{memory_context}

Provide 4 specific, actionable legal recommendations."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a legal advisor providing recommendations."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            text = response.json()['choices'][0]['message']['content']
            recs = [r.strip() for r in text.split('\n') if r.strip() and any(c.isalnum() for c in r)]
            return recs[:4] if recs else fallback_recommendations(case_type)
        else:
            return fallback_recommendations(case_type)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_recommendations(case_type)


def fallback_analysis(case_description: str, case_type: str) -> str:
    """Fallback analysis"""
    return f"Legal Analysis for {case_type.upper()} Case: This matter requires legal review. Consult a qualified {case_type} law attorney for specific guidance."


def fallback_recommendations(case_type: str) -> list[str]:
    """Fallback recommendations"""
    return [
        f"Consult a {case_type} law specialist",
        "Gather all relevant documents",
        "Document all facts and communications",
        "Avoid discussing publicly"
    ]


def generate_next_steps(case_type: str, urgency: str) -> list[str]:
    """Generate next steps"""
    steps = []
    if urgency in ["high", "urgent"]:
        steps.append("Schedule urgent consultation within 48 hours")
    else:
        steps.append("Schedule consultation at your convenience")
    
    steps.extend([
        "Organize relevant documents and evidence",
        "Research similar cases and outcomes",
        "Consider alternative dispute resolution"
    ])
    
    return steps[:4]


def assess_urgency(case_description: str, stated_urgency: str) -> str:
    """Assess urgency"""
    urgent_keywords = ["court date", "deadline", "lawsuit", "urgent", "immediate"]
    if any(k in case_description.lower() for k in urgent_keywords):
        return "urgent"
    return stated_urgency


# ==================== BUREAU SETUP ====================

bureau = Bureau(endpoint=["http://127.0.0.1:9000/submit"])
bureau.add(lawyer_agent)
bureau.add(client_agent)
bureau.add(memory_agent)


if __name__ == "__main__":
    print("\n" + "="*70)
    print("⚖️  LEGAL CONSULTATION SYSTEM WITH MEMORY INTEGRATION")
    print("="*70)
    print(f"👨‍⚖️ Lawyer Agent:  {lawyer_agent.address}")
    print(f"👤 Client Agent: {client_agent.address}")
    print(f"🧠 Memory Agent:  {memory_agent.address}")
    print("="*70)
    print(f"💾 Loaded {len(memory_storage.memories)} case memories:")
    for mem in memory_storage.memories:
        print(f"   - [{mem['category']}] {mem['context']}")
    print("="*70)
    print()
    bureau.run()
