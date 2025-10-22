"""
Support Agent - ASI-based Customer Support Agent
This agent handles customer support tickets with AI-powered assistance.
Integrates with ASI API for intelligent customer support responses.
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
class SupportTicket(Model):
    """Model for customer support tickets"""
    customer_id: str
    ticket_id: str = ""
    issue_description: str
    customer_history: str = ""
    category: str = "general"  # technical, billing, account, product, general
    priority: str = "normal"  # low, normal, high, urgent


class SupportResponse(Model):
    """Model for support response"""
    customer_id: str
    ticket_id: str
    solution: str
    suggestions: list[str]
    escalation_required: bool
    priority_assessment: str
    estimated_resolution_time: str


class EscalationRequest(Model):
    """Model for ticket escalation"""
    customer_id: str
    ticket_id: str
    reason: str
    assigned_to: str


class EscalationConfirmation(Model):
    """Model for escalation confirmation"""
    ticket_id: str
    status: str
    assigned_agent: str
    estimated_response_time: str


class MemoryRequest(Model):
    """Model for requesting customer memories"""
    user_id: str
    category: str = "all"
    limit: int = 10


class MemoryResponse(Model):
    """Model for memory response"""
    user_id: str
    memories: list[dict]
    count: int


# Initialize Support Agent with mailbox enabled
support_agent = Agent(
    name="support_agent",
    seed="support_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Define Support Protocol
support_protocol = Protocol(name="CustomerSupportProtocol", version="1.0.0")


@support_protocol.on_message(model=SupportTicket, replies=SupportResponse)
async def handle_support_ticket(ctx: Context, sender: str, msg: SupportTicket):
    """
    Handle incoming customer support tickets
    Provides AI-powered solutions and suggestions
    """
    import hashlib
    
    # Generate ticket ID if not provided
    if not msg.ticket_id:
        ticket_id = hashlib.md5(f"{msg.customer_id}{msg.issue_description}".encode()).hexdigest()[:8]
        msg.ticket_id = f"TKT-{ticket_id.upper()}"
    
    ctx.logger.info(f"📨 Received support ticket: {msg.ticket_id}")
    ctx.logger.info(f"👤 Customer: {msg.customer_id}")
    ctx.logger.info(f"📁 Category: {msg.category}")
    ctx.logger.info(f"📋 Issue: {msg.issue_description[:100]}...")
    
    # Request customer memories from memory agent
    ctx.logger.info("🧠 Requesting customer history from memory agent...")
    memory_request = MemoryRequest(
        user_id=msg.customer_id,
        category="all",
        limit=10
    )
    
    # Send memory request to memory agent (will be set in support_system.py)
    memory_agent_address = "agent1qw8p7m5k3n2r4t6y8u0i9o7p5a3s1d2f4g6h8j0k2l4m6n8p0q2r4t6y8u0i2o"
    await ctx.send(memory_agent_address, memory_request)
    
    # Store the ticket temporarily
    ctx.storage.set("pending_ticket", msg.dict())
    ctx.storage.set("pending_sender", sender)


@support_protocol.on_message(model=MemoryResponse)
async def process_with_memories(ctx: Context, sender: str, msg: MemoryResponse):
    """
    Process support ticket with customer memories
    """
    # Retrieve pending ticket
    ticket_dict = ctx.storage.get("pending_ticket")
    if not ticket_dict:
        return
    
    ticket = SupportTicket(**ticket_dict)
    original_sender = ctx.storage.get("pending_sender")
    
    ctx.logger.info(f"💾 Received {msg.count} customer memories")
    
    # Extract relevant customer memories
    support_memories = [m for m in msg.memories if m.get('category') in ['purchase_history', 'preferences', 'issues', 'account_info']]
    ctx.logger.info(f"📊 Found {len(support_memories)} relevant customer memories")
    
    # Enhance customer history with memories
    enhanced_history = ticket.customer_history
    if support_memories:
        memory_text = "\n".join([f"- {m.get('entity')} ({m.get('category')}): {m.get('context', '')}" for m in support_memories])
        enhanced_history = f"{ticket.customer_history}\n\nCustomer History:\n{memory_text}"
        ctx.logger.info("📋 Enhanced customer profile with memories")
    
    # Analyze ticket and generate solution
    solution = analyze_ticket_asi(ticket.issue_description, enhanced_history, ticket.category)
    suggestions = generate_suggestions_asi(solution, ticket.category, support_memories)
    resolution_time = estimate_resolution_time(ticket.category, ticket.priority)
    
    # Assess priority
    priority = assess_priority(ticket.issue_description, ticket.priority)
    
    # Create response
    response = SupportResponse(
        customer_id=ticket.customer_id,
        ticket_id=ticket.ticket_id,
        solution=solution,
        suggestions=suggestions,
        escalation_required=priority in ["high", "urgent"],
        priority_assessment=priority,
        estimated_resolution_time=resolution_time
    )
    
    # Send response back to customer
    await ctx.send(original_sender, response)
    ctx.logger.info(f"✅ Sent support response for ticket {ticket.ticket_id}")
    
    # Clear pending ticket
    ctx.storage.set("pending_ticket", None)
    ctx.storage.set("pending_sender", None)


@support_protocol.on_message(model=EscalationRequest, replies=EscalationConfirmation)
async def handle_escalation(ctx: Context, sender: str, msg: EscalationRequest):
    """
    Handle ticket escalation requests
    """
    ctx.logger.info(f"⬆️ Escalation request for ticket: {msg.ticket_id}")
    ctx.logger.info(f"Reason: {msg.reason}")
    
    # Create escalation confirmation
    confirmation = EscalationConfirmation(
        ticket_id=msg.ticket_id,
        status="escalated",
        assigned_agent=msg.assigned_to or "Senior Support Team",
        estimated_response_time="Within 2 hours"
    )
    
    await ctx.send(sender, confirmation)
    ctx.logger.info(f"✅ Ticket {msg.ticket_id} escalated successfully")


def analyze_ticket_asi(issue_description: str, customer_history: str, category: str) -> str:
    """
    Analyze support ticket using ASI API
    """
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""You are a helpful customer support agent. Analyze this support ticket:

Category: {category}
Issue: {issue_description}
Customer History: {customer_history}

Provide a clear, friendly solution to the customer's issue. Be empathetic and professional."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a friendly and knowledgeable customer support agent."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 400
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return fallback_solution(issue_description, category)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_solution(issue_description, category)


def generate_suggestions_asi(solution: str, category: str, memories: list) -> list[str]:
    """
    Generate personalized suggestions using ASI API
    """
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        memory_context = ""
        if memories:
            memory_context = "Customer context: " + ", ".join([m.get('entity', '') for m in memories[:3]])
        
        prompt = f"""Based on this support solution for a {category} issue:

{solution}

{memory_context}

Provide 3 helpful suggestions or next steps for the customer."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a customer support agent providing helpful suggestions."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 200
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            text = response.json()['choices'][0]['message']['content']
            sugs = [s.strip() for s in text.split('\n') if s.strip() and any(c.isalnum() for c in s)]
            return sugs[:3] if sugs else fallback_suggestions(category)
        else:
            return fallback_suggestions(category)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_suggestions(category)


def fallback_solution(issue_description: str, category: str) -> str:
    """Fallback solution when ASI API is unavailable"""
    return f"""Thank you for contacting support regarding your {category} issue.

I understand you're experiencing: {issue_description}

I'm here to help! Based on your issue, I recommend:
1. Checking our knowledge base for similar issues
2. Trying basic troubleshooting steps (restart, clear cache)
3. If the issue persists, our team will investigate further

We appreciate your patience and will resolve this as quickly as possible."""


def fallback_suggestions(category: str) -> list[str]:
    """Fallback suggestions"""
    return [
        f"Check our {category} FAQ for common solutions",
        "Try clearing your browser cache and cookies",
        "Contact us again if the issue persists"
    ]


def estimate_resolution_time(category: str, priority: str) -> str:
    """Estimate resolution time based on category and priority"""
    if priority in ["high", "urgent"]:
        return "Within 2 hours"
    elif category == "technical":
        return "Within 24 hours"
    elif category == "billing":
        return "Within 12 hours"
    else:
        return "Within 48 hours"


def assess_priority(issue_description: str, stated_priority: str) -> str:
    """Assess ticket priority"""
    urgent_keywords = [
        "can't access", "not working", "urgent", "critical", "broken",
        "charged incorrectly", "locked out", "emergency"
    ]
    
    description_lower = issue_description.lower()
    
    if any(keyword in description_lower for keyword in urgent_keywords):
        return "urgent"
    
    if stated_priority in ["high", "urgent"]:
        return "urgent"
    
    return stated_priority


# Include protocol in agent
support_agent.include(support_protocol)


if __name__ == "__main__":
    print("\n" + "="*70)
    print("🎧 CUSTOMER SUPPORT SYSTEM")
    print("="*70)
    print(f"👨‍💼 Support Agent: {support_agent.address}")
    print("="*70)
    print()
    support_agent.run()
