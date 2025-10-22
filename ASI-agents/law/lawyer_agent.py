"""
Lawyer Agent - ASI-based Legal Consultation Agent
This agent acts as a legal consultation assistant with mailbox enabled
for asynchronous communication with clients and other agents.
Integrates with ASI (Artificial Superintelligence) API for intelligent legal consultations.
Uses Protocol-based communication for structured agent-to-agent interactions.
"""

import os
import requests
from uagents import Agent, Context, Model, Protocol
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ASI API Configuration
ASI_API_URL = "https://api.asi1.ai/v1/chat/completions"
ASI_API_KEY = os.getenv("ASI_ONE_API_KEY")


# Define message models for communication
class LegalQuery(Model):
    """Model for incoming legal queries"""
    client_id: str
    case_description: str
    legal_history: str = ""
    case_type: str = "general"  # general, criminal, civil, corporate, family
    urgency_level: str = "normal"  # low, normal, high, urgent


class LegalAdvice(Model):
    """Model for legal advice response"""
    client_id: str
    legal_analysis: str
    recommendations: list[str]
    next_steps: list[str]
    consultation_required: bool
    urgency_assessment: str


class ConsultationRequest(Model):
    """Model for consultation scheduling"""
    client_id: str
    preferred_date: str
    case_type: str
    reason: str


class ConsultationConfirmation(Model):
    """Model for consultation confirmation"""
    client_id: str
    consultation_id: str
    scheduled_date: str
    status: str
    meeting_link: str = ""


class MemoryRequest(Model):
    """Model for requesting user/case memories"""
    user_id: str
    category: str = "all"  # all, case_history, preferences, documents, etc.
    limit: int = 10


class MemoryResponse(Model):
    """Model for memory response"""
    user_id: str
    memories: list[dict]
    count: int


# Initialize the Lawyer Agent with mailbox enabled
lawyer_agent = Agent(
    name="lawyer_agent",
    seed="lawyer_agent_seed_phrase_zkMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Define Lawyer Protocol for legal consultation
lawyer_protocol = Protocol(name="LegalConsultationProtocol", version="1.0.0")


@lawyer_protocol.on_message(model=LegalQuery, replies=LegalAdvice)
async def handle_legal_query(ctx: Context, sender: str, msg: LegalQuery):
    """
    Handle incoming legal queries from clients
    Provides initial legal analysis and recommendations
    """
    ctx.logger.info(f"📨 Received legal query from client: {msg.client_id}")
    ctx.logger.info(f"📋 Case Type: {msg.case_type}")
    ctx.logger.info(f"⚖️ Case Description: {msg.case_description}")
    
    # Request case memories from memory agent
    ctx.logger.info("🧠 Requesting case memories from memory agent...")
    memory_request = MemoryRequest(
        user_id=msg.client_id,
        category="all",
        limit=10
    )
    
    # Send memory request to memory agent
    memory_agent_address = "agent1qwqm5j7npe8lu0vyq3mvfje7nshrqxjnfn7e2lx9v54zf2u7v8p6yvy9a2w"  # Will be set in law_system.py
    await ctx.send(memory_agent_address, memory_request)
    
    # Store the query temporarily to process when we get memories
    ctx.storage.set("pending_query", msg.dict())
    ctx.storage.set("pending_sender", sender)


@lawyer_protocol.on_message(model=MemoryResponse)
async def process_with_memories(ctx: Context, sender: str, msg: MemoryResponse):
    """
    Process legal query with case memories
    """
    # Retrieve pending query
    query_dict = ctx.storage.get("pending_query")
    if not query_dict:
        return
    
    query = LegalQuery(**query_dict)
    original_sender = ctx.storage.get("pending_sender")
    
    ctx.logger.info(f"💾 Received {msg.count} case memories")
    
    # Extract relevant legal memories
    legal_memories = [m for m in msg.memories if m.get('category') in ['case_history', 'legal_matter', 'jurisdiction', 'preferences']]
    ctx.logger.info(f"⚖️ Found {len(legal_memories)} relevant legal memories")
    
    # Enhance legal history with memories
    enhanced_history = query.legal_history
    if legal_memories:
        memory_text = "\n".join([f"- {m.get('entity')} ({m.get('category')}): {m.get('context', '')}" for m in legal_memories])
        enhanced_history = f"{query.legal_history}\n\nRelevant Case History:\n{memory_text}"
        ctx.logger.info("📋 Enhanced legal history with case memories")
    
    # Process the query and generate advice
    analysis = analyze_case_asi(query.case_description, enhanced_history, query.case_type)
    recommendations = generate_legal_recommendations_asi(analysis, query.case_type, legal_memories)
    next_steps = generate_next_steps(query.case_type, query.urgency_level)
    
    # Assess urgency
    urgency = assess_urgency(query.case_description, query.urgency_level)
    
    # Create response
    advice = LegalAdvice(
        client_id=query.client_id,
        legal_analysis=analysis,
        recommendations=recommendations,
        next_steps=next_steps,
        consultation_required=urgency in ["high", "urgent"],
        urgency_assessment=urgency
    )
    
    # Send advice back to client
    await ctx.send(original_sender, advice)
    ctx.logger.info(f"✅ Sent legal advice to {original_sender}")
    
    # Clear pending query
    ctx.storage.set("pending_query", None)
    ctx.storage.set("pending_sender", None)


@lawyer_protocol.on_message(model=ConsultationRequest, replies=ConsultationConfirmation)
async def handle_consultation_request(ctx: Context, sender: str, msg: ConsultationRequest):
    """
    Handle consultation scheduling requests
    """
    ctx.logger.info(f"📅 Consultation request from {msg.client_id}")
    ctx.logger.info(f"Preferred date: {msg.preferred_date}")
    
    # Generate consultation ID
    import hashlib
    consultation_id = hashlib.md5(f"{msg.client_id}{msg.preferred_date}".encode()).hexdigest()[:8]
    
    # Create confirmation
    confirmation = ConsultationConfirmation(
        client_id=msg.client_id,
        consultation_id=f"CONS-{consultation_id.upper()}",
        scheduled_date=msg.preferred_date,
        status="confirmed",
        meeting_link=f"https://meet.zklaw.ai/{consultation_id}"
    )
    
    await ctx.send(sender, confirmation)
    ctx.logger.info(f"✅ Consultation confirmed: {confirmation.consultation_id}")


def analyze_case_asi(case_description: str, legal_history: str, case_type: str) -> str:
    """
    Analyze case using ASI API
    """
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""You are an experienced legal consultant. Analyze the following case:

Case Type: {case_type}
Case Description: {case_description}
Legal History: {legal_history}

Provide a comprehensive legal analysis covering:
1. Key legal issues identified
2. Applicable laws and precedents
3. Potential risks and liabilities
4. Strengths and weaknesses of the case

Keep your analysis professional, clear, and actionable."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a knowledgeable legal advisor providing professional legal analysis."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            return fallback_analysis(case_description, case_type)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_analysis(case_description, case_type)


def generate_legal_recommendations_asi(analysis: str, case_type: str, memories: list) -> list[str]:
    """
    Generate personalized legal recommendations using ASI API and case memories
    """
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        memory_context = ""
        if memories:
            memory_context = "Consider the client's history: " + ", ".join([m.get('entity', '') for m in memories[:3]])
        
        prompt = f"""Based on this legal analysis for a {case_type} case:

{analysis}

{memory_context}

Provide 4 specific, actionable legal recommendations for the client."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a legal advisor providing actionable recommendations."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            recommendations_text = result['choices'][0]['message']['content']
            # Parse into list
            recs = [r.strip() for r in recommendations_text.split('\n') if r.strip() and any(c.isalnum() for c in r)]
            return recs[:4] if recs else fallback_recommendations(case_type)
        else:
            return fallback_recommendations(case_type)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_recommendations(case_type)


def fallback_analysis(case_description: str, case_type: str) -> str:
    """
    Fallback legal analysis when ASI API is unavailable
    """
    return f"""Legal Analysis for {case_type.upper()} Case:

Based on the case description provided, this appears to be a matter requiring careful legal consideration. 

Key Points:
1. This is a {case_type} legal matter that may require specialized expertise
2. The facts presented suggest potential legal implications that should be reviewed
3. Relevant statutes and precedents should be researched thoroughly
4. Documentation and evidence gathering is crucial

Recommendation: Schedule a detailed consultation with a qualified attorney specializing in {case_type} law to discuss your specific situation and develop an appropriate legal strategy."""


def fallback_recommendations(case_type: str) -> list[str]:
    """
    Fallback recommendations when ASI API is unavailable
    """
    return [
        f"Consult with a {case_type} law specialist for detailed guidance",
        "Gather all relevant documents, contracts, and correspondence",
        "Document all facts, dates, and communications related to the matter",
        "Avoid discussing the case publicly or on social media"
    ]


def generate_next_steps(case_type: str, urgency: str) -> list[str]:
    """
    Generate next steps based on case type and urgency
    """
    steps = []
    
    if urgency in ["high", "urgent"]:
        steps.append("Schedule an urgent consultation within 48 hours")
        steps.append("Preserve all evidence and documentation immediately")
    else:
        steps.append("Schedule a consultation at your convenience")
        steps.append("Organize relevant documents and evidence")
    
    if case_type == "criminal":
        steps.extend([
            "Do not speak with law enforcement without legal representation",
            "Document your account of events in detail"
        ])
    elif case_type == "civil":
        steps.extend([
            "Review all contracts and agreements related to the dispute",
            "Identify potential witnesses or supporting parties"
        ])
    elif case_type == "corporate":
        steps.extend([
            "Review corporate governance documents and bylaws",
            "Consult with your board or stakeholders as appropriate"
        ])
    elif case_type == "family":
        steps.extend([
            "Gather financial documents and asset information",
            "Consider mediation as an alternative to litigation"
        ])
    else:
        steps.extend([
            "Research similar cases and outcomes",
            "Consider alternative dispute resolution options"
        ])
    
    return steps[:4]


def assess_urgency(case_description: str, stated_urgency: str) -> str:
    """
    Assess case urgency based on description and stated level
    """
    urgent_keywords = [
        "court date", "deadline", "arrest", "warrant", "eviction",
        "foreclosure", "urgent", "emergency", "immediate", "lawsuit filed"
    ]
    
    description_lower = case_description.lower()
    
    # Check for urgent keywords
    if any(keyword in description_lower for keyword in urgent_keywords):
        return "urgent"
    
    # Respect stated urgency if high
    if stated_urgency in ["high", "urgent"]:
        return "urgent"
    
    return stated_urgency


# Include the protocol in the agent
lawyer_agent.include(lawyer_protocol)


if __name__ == "__main__":
    print("\n" + "="*70)
    print("⚖️  LEGAL CONSULTATION SYSTEM")
    print("="*70)
    print(f"👨‍⚖️ Lawyer Agent: {lawyer_agent.address}")
    print("="*70)
    print()
    lawyer_agent.run()
