"""
Tutor Agent - ASI-based Educational Tutoring Agent
This agent provides personalized tutoring with AI-powered learning assistance.
Integrates with ASI API for intelligent educational guidance.
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
class LearningQuery(Model):
    """Model for student learning queries"""
    student_id: str
    subject: str
    topic: str
    question: str
    learning_history: str = ""
    difficulty_level: str = "intermediate"  # beginner, intermediate, advanced
    learning_style: str = "visual"  # visual, auditory, kinesthetic, reading


class TutoringResponse(Model):
    """Model for tutoring response"""
    student_id: str
    subject: str
    explanation: str
    examples: list[str]
    practice_problems: list[str]
    additional_resources: list[str]
    mastery_assessment: str


class AssessmentRequest(Model):
    """Model for learning assessment"""
    student_id: str
    subject: str
    topic: str
    difficulty_level: str


class AssessmentResults(Model):
    """Model for assessment results"""
    student_id: str
    subject: str
    score: float
    strengths: list[str]
    areas_for_improvement: list[str]
    recommended_topics: list[str]


class MemoryRequest(Model):
    """Model for requesting student memories"""
    user_id: str
    category: str = "all"
    limit: int = 10


class MemoryResponse(Model):
    """Model for memory response"""
    user_id: str
    memories: list[dict]
    count: int


# Initialize Tutor Agent
tutor_agent = Agent(
    name="tutor_agent",
    seed="tutor_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Define Tutor Protocol
tutor_protocol = Protocol(name="EducationalTutoringProtocol", version="1.0.0")


@tutor_protocol.on_message(model=LearningQuery, replies=TutoringResponse)
async def handle_learning_query(ctx: Context, sender: str, msg: LearningQuery):
    """Handle student learning queries"""
    ctx.logger.info(f"📚 Received learning query from student: {msg.student_id}")
    ctx.logger.info(f"📖 Subject: {msg.subject} | Topic: {msg.topic}")
    ctx.logger.info(f"❓ Question: {msg.question[:100]}...")
    
    # Request learning memories
    ctx.logger.info("🧠 Requesting learning history from memory agent...")
    memory_request = MemoryRequest(
        user_id=msg.student_id,
        category="all",
        limit=10
    )
    
    memory_agent_address = "agent1qw8p7m5k3n2r4t6y8u0i9o7p5a3s1d2f4g6h8j0k2l4m6n8p0q2r4t6y8u0i2o"
    await ctx.send(memory_agent_address, memory_request)
    
    ctx.storage.set("pending_query", msg.dict())
    ctx.storage.set("pending_sender", sender)


@tutor_protocol.on_message(model=MemoryResponse)
async def process_with_memories(ctx: Context, sender: str, msg: MemoryResponse):
    """Process learning query with student memories"""
    query_dict = ctx.storage.get("pending_query")
    if not query_dict:
        return
    
    query = LearningQuery(**query_dict)
    original_sender = ctx.storage.get("pending_sender")
    
    ctx.logger.info(f"💾 Received {msg.count} learning memories")
    
    # Extract relevant learning memories
    learning_memories = [m for m in msg.memories if m.get('category') in ['subject_strength', 'learning_style', 'completed_topics', 'struggles']]
    ctx.logger.info(f"📊 Found {len(learning_memories)} relevant learning memories")
    
    # Enhance learning history
    enhanced_history = query.learning_history
    if learning_memories:
        memory_text = "\n".join([f"- {m.get('entity')} ({m.get('category')}): {m.get('context', '')}" for m in learning_memories])
        enhanced_history = f"{query.learning_history}\n\nLearning Profile:\n{memory_text}"
        ctx.logger.info("📋 Enhanced learning profile with memories")
    
    # Generate personalized tutoring
    explanation = generate_explanation_asi(query.topic, query.question, enhanced_history, query.difficulty_level, query.learning_style)
    examples = generate_examples_asi(query.subject, query.topic, query.difficulty_level)
    practice_problems = generate_practice_asi(query.subject, query.topic, query.difficulty_level)
    resources = generate_resources(query.subject, query.topic)
    mastery = assess_mastery_level(learning_memories, query.topic)
    
    response = TutoringResponse(
        student_id=query.student_id,
        subject=query.subject,
        explanation=explanation,
        examples=examples,
        practice_problems=practice_problems,
        additional_resources=resources,
        mastery_assessment=mastery
    )
    
    await ctx.send(original_sender, response)
    ctx.logger.info(f"✅ Sent tutoring response to {original_sender}")
    
    ctx.storage.set("pending_query", None)
    ctx.storage.set("pending_sender", None)


def generate_explanation_asi(topic: str, question: str, history: str, level: str, style: str) -> str:
    """Generate personalized explanation using ASI API"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""You are an expert tutor. Explain this concept to a {level} student with {style} learning preference:

Topic: {topic}
Question: {question}
Student Background: {history}

Provide a clear, engaging explanation tailored to their learning style and level."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a patient, knowledgeable tutor who adapts to each student's needs."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return fallback_explanation(topic, question, level)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_explanation(topic, question, level)


def generate_examples_asi(subject: str, topic: str, level: str) -> list[str]:
    """Generate examples using ASI API"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""Provide 3 clear, practical examples for {level} students learning about {topic} in {subject}."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are an educational content creator providing clear examples."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            text = response.json()['choices'][0]['message']['content']
            examples = [e.strip() for e in text.split('\n') if e.strip() and any(c.isalnum() for c in e)]
            return examples[:3] if examples else fallback_examples(subject, topic)
        else:
            return fallback_examples(subject, topic)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_examples(subject, topic)


def generate_practice_asi(subject: str, topic: str, level: str) -> list[str]:
    """Generate practice problems using ASI API"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""Create 3 practice problems for {level} students on {topic} in {subject}. Include varying difficulty."""

        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are creating educational practice problems."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }
        
        response = requests.post(ASI_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            text = response.json()['choices'][0]['message']['content']
            problems = [p.strip() for p in text.split('\n') if p.strip() and any(c.isalnum() for c in p)]
            return problems[:3] if problems else fallback_practice(topic)
        else:
            return fallback_practice(topic)
            
    except Exception as e:
        print(f"ASI API error: {e}")
        return fallback_practice(topic)


def fallback_explanation(topic: str, question: str, level: str) -> str:
    """Fallback explanation"""
    return f"""Let me help you understand {topic} at a {level} level.

Your question: {question}

This is a fundamental concept that builds on what you've already learned. Let's break it down step by step and work through it together. I recommend reviewing the basics first, then practicing with examples to build your understanding."""


def fallback_examples(subject: str, topic: str) -> list[str]:
    """Fallback examples"""
    return [
        f"Example 1: A basic application of {topic} in everyday scenarios",
        f"Example 2: An intermediate {subject} problem using {topic}",
        f"Example 3: A real-world case where {topic} is essential"
    ]


def fallback_practice(topic: str) -> list[str]:
    """Fallback practice problems"""
    return [
        f"Practice 1: Solve a simple {topic} problem",
        f"Practice 2: Apply {topic} to a new scenario",
        f"Practice 3: Challenge problem combining {topic} with other concepts"
    ]


def generate_resources(subject: str, topic: str) -> list[str]:
    """Generate additional resources"""
    return [
        f"Khan Academy - {subject}: {topic}",
        f"YouTube tutorials on {topic}",
        f"Interactive simulations for {topic}",
        f"Practice worksheets for {subject}"
    ]


def assess_mastery_level(memories: list, topic: str) -> str:
    """Assess student's mastery level"""
    if not memories:
        return "Beginning - New to this topic"
    
    completed = [m for m in memories if m.get('category') == 'completed_topics' and topic.lower() in m.get('entity', '').lower()]
    if completed:
        return "Advanced - Previously mastered this topic"
    
    struggles = [m for m in memories if m.get('category') == 'struggles' and topic.lower() in m.get('entity', '').lower()]
    if struggles:
        return "Developing - Working through challenges in this area"
    
    return "Intermediate - Building on foundational knowledge"


tutor_agent.include(tutor_protocol)


if __name__ == "__main__":
    print("\n" + "="*70)
    print("📚 EDUCATIONAL TUTORING SYSTEM")
    print("="*70)
    print(f"👨‍🏫 Tutor Agent: {tutor_agent.address}")
    print("="*70)
    print()
    tutor_agent.run()
