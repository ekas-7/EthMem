"""
Advisor Agent - ASI-based Financial Advisory Agent
Provides personalized financial advice with AI-powered portfolio analysis.
"""

import os
import requests
from uagents import Agent, Context, Model, Protocol
from dotenv import load_dotenv

load_dotenv()

ASI_API_URL = "https://api.asi1.ai/v1/chat/completions"
ASI_API_KEY = os.getenv("ASI_ONE_API_KEY")


class FinancialQuery(Model):
    """Model for financial advice queries"""
    client_id: str
    query_type: str  # investment, retirement, budgeting, tax, general
    question: str
    financial_history: str = ""
    risk_tolerance: str = "moderate"  # conservative, moderate, aggressive
    time_horizon: str = "medium"  # short (< 5y), medium (5-15y), long (> 15y)


class FinancialAdvice(Model):
    """Model for financial advice response"""
    client_id: str
    analysis: str
    recommendations: list[str]
    action_items: list[str]
    risk_assessment: str
    projected_outcomes: str


class PortfolioReview(Model):
    """Model for portfolio review request"""
    client_id: str
    current_allocation: dict
    goals: str
    timeline: str


class MemoryRequest(Model):
    user_id: str
    category: str = "all"
    limit: int = 10


class MemoryResponse(Model):
    user_id: str
    memories: list[dict]
    count: int


advisor_agent = Agent(
    name="advisor_agent",
    seed="advisor_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

advisor_protocol = Protocol(name="FinancialAdvisoryProtocol", version="1.0.0")


@advisor_protocol.on_message(model=FinancialQuery, replies=FinancialAdvice)
async def handle_financial_query(ctx: Context, sender: str, msg: FinancialQuery):
    """Handle financial advice queries"""
    ctx.logger.info(f"💰 Received financial query from client: {msg.client_id}")
    ctx.logger.info(f"📊 Query Type: {msg.query_type}")
    ctx.logger.info(f"💡 Question: {msg.question[:100]}...")
    
    ctx.logger.info("🧠 Requesting financial history from memory agent...")
    memory_request = MemoryRequest(
        user_id=msg.client_id,
        category="all",
        limit=10
    )
    
    memory_agent_address = "agent1qw8p7m5k3n2r4t6y8u0i9o7p5a3s1d2f4g6h8j0k2l4m6n8p0q2r4t6y8u0i2o"
    await ctx.send(memory_agent_address, memory_request)
    
    ctx.storage.set("pending_query", msg.dict())
    ctx.storage.set("pending_sender", sender)


@advisor_protocol.on_message(model=MemoryResponse)
async def process_with_memories(ctx: Context, sender: str, msg: MemoryResponse):
    """Process financial query with portfolio memories"""
    query_dict = ctx.storage.get("pending_query")
    if not query_dict:
        return
    
    query = FinancialQuery(**query_dict)
    original_sender = ctx.storage.get("pending_sender")
    
    ctx.logger.info(f"💾 Received {msg.count} financial memories")
    
    financial_memories = [m for m in msg.memories if m.get('category') in ['portfolio', 'goals', 'risk_profile', 'investments']]
    ctx.logger.info(f"📈 Found {len(financial_memories)} relevant financial memories")
    
    enhanced_history = query.financial_history
    if financial_memories:
        memory_text = "\n".join([f"- {m.get('entity')} ({m.get('category')}): {m.get('context', '')}" for m in financial_memories])
        enhanced_history = f"{query.financial_history}\n\nFinancial Profile:\n{memory_text}"
        ctx.logger.info("📋 Enhanced financial profile with memories")
    
    analysis = analyze_financial_situation_asi(query.question, enhanced_history, query.query_type, query.risk_tolerance)
    recommendations = generate_recommendations_asi(analysis, query.risk_tolerance, query.time_horizon, financial_memories)
    action_items = generate_action_items(query.query_type, query.time_horizon)
    risk = assess_risk(query.risk_tolerance, financial_memories)
    outcomes = project_outcomes(query.time_horizon, query.risk_tolerance)
    
    advice = FinancialAdvice(
        client_id=query.client_id,
        analysis=analysis,
        recommendations=recommendations,
        action_items=action_items,
        risk_assessment=risk,
        projected_outcomes=outcomes
    )
    
    await ctx.send(original_sender, advice)
    ctx.logger.info(f"✅ Sent financial advice to {original_sender}")
    
    ctx.storage.set("pending_query", None)
    ctx.storage.set("pending_sender", None)


def analyze_financial_situation_asi(question: str, history: str, query_type: str, risk: str) -> str:
    """Analyze financial situation using ASI API"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""You are a certified financial advisor. Analyze this {query_type} query:

Question: {question}
Financial Background: {history}
Risk Tolerance: {risk}

Provide professional financial analysis and guidance."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a knowledgeable financial advisor providing prudent advice."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return fallback_analysis(question, query_type)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_analysis(question, query_type)


def generate_recommendations_asi(analysis: str, risk: str, horizon: str, memories: list) -> list[str]:
    """Generate personalized recommendations"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        memory_context = ""
        if memories:
            memory_context = "Portfolio context: " + ", ".join([m.get('entity', '') for m in memories[:3]])
        
        prompt = f"""Based on this financial analysis:
{analysis}

Risk: {risk}, Horizon: {horizon}
{memory_context}

Provide 4 specific, actionable financial recommendations."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are providing actionable financial recommendations."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            text = response.json()['choices'][0]['message']['content']
            recs = [r.strip() for r in text.split('\n') if r.strip() and any(c.isalnum() for c in r)]
            return recs[:4] if recs else fallback_recommendations(risk)
        else:
            return fallback_recommendations(risk)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_recommendations(risk)


def fallback_analysis(question: str, query_type: str) -> str:
    return f"""Financial Analysis for {query_type.title()} Query:

Your question: {question}

Based on general financial principles, I recommend consulting with a certified financial planner for personalized advice tailored to your specific situation."""


def fallback_recommendations(risk: str) -> list[str]:
    return [
        f"Diversify investments appropriate for {risk} risk tolerance",
        "Build emergency fund (3-6 months expenses)",
        "Review and rebalance portfolio quarterly",
        "Consult certified financial planner for detailed strategy"
    ]


def generate_action_items(query_type: str, horizon: str) -> list[str]:
    items = [
        "Schedule meeting with financial advisor",
        "Review current financial statements",
        "Research recommended investment options"
    ]
    if horizon == "long":
        items.append("Consider tax-advantaged retirement accounts")
    return items[:3]


def assess_risk(tolerance: str, memories: list) -> str:
    portfolio_diversification = len([m for m in memories if m.get('category') == 'investments'])
    if portfolio_diversification > 3:
        return f"{tolerance.title()} risk with well-diversified portfolio"
    return f"{tolerance.title()} risk - consider diversification"


def project_outcomes(horizon: str, risk: str) -> str:
    projections = {
        "short": "1-3 years: Focus on capital preservation",
        "medium": "5-15 years: Balanced growth potential",
        "long": "15+ years: Long-term wealth accumulation"
    }
    return projections.get(horizon, "Consult advisor for projections")


advisor_agent.include(advisor_protocol)


if __name__ == "__main__":
    print("\n" + "="*70)
    print("💰 FINANCIAL ADVISORY SYSTEM")
    print("="*70)
    print(f"👨‍💼 Advisor Agent: {advisor_agent.address}")
    print("="*70)
    print()
    advisor_agent.run()
