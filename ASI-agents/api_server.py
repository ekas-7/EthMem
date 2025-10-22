"""
ASI-Agents API Server
FastAPI backend that interfaces with all agent systems and provides REST APIs
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import requests
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import asyncio

# Load environment variables
load_dotenv()

app = FastAPI(
    title="ASI-Agents API",
    description="Unified API for Medical, Legal, Customer Support, Education, and Financial AI Agents",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ASI API Configuration
ASI_API_URL = "https://api.asi1.ai/v1/chat/completions"
ASI_API_KEY = os.getenv("ASI_ONE_API_KEY")

# Agent system ports
AGENT_PORTS = {
    "medical": 8000,
    "legal": 9000,
    "customer_support": 10000,
    "education": 11000,
    "financial": 12000
}

# ============ REQUEST/RESPONSE MODELS ============

class MedicalConsultationRequest(BaseModel):
    patient_id: str
    symptoms: str
    medical_history: Optional[str] = ""
    urgency_level: Optional[str] = "normal"

class MedicalConsultationResponse(BaseModel):
    patient_id: str
    diagnosis: str
    recommendations: List[str]
    follow_up_required: bool
    urgency_assessment: str
    timestamp: str

class LegalConsultationRequest(BaseModel):
    client_id: str
    case_description: str
    legal_history: Optional[str] = ""
    case_type: Optional[str] = "general"
    urgency_level: Optional[str] = "normal"

class LegalConsultationResponse(BaseModel):
    client_id: str
    legal_analysis: str
    recommendations: List[str]
    next_steps: List[str]
    consultation_required: bool
    urgency_assessment: str
    timestamp: str

class SupportTicketRequest(BaseModel):
    customer_id: str
    issue_description: str
    ticket_history: Optional[str] = ""
    priority: Optional[str] = "normal"
    category: Optional[str] = "general"

class SupportTicketResponse(BaseModel):
    customer_id: str
    ticket_id: str
    solution: str
    recommendations: List[str]
    escalation_required: bool
    estimated_resolution_time: str
    timestamp: str

class EducationRequest(BaseModel):
    student_id: str
    question: str
    subject: str
    learning_level: Optional[str] = "intermediate"
    learning_history: Optional[str] = ""

class EducationResponse(BaseModel):
    student_id: str
    explanation: str
    examples: List[str]
    practice_problems: List[str]
    additional_resources: List[str]
    timestamp: str

class FinancialAdvisoryRequest(BaseModel):
    investor_id: str
    query: str
    portfolio: Optional[Dict[str, Any]] = None
    risk_tolerance: Optional[str] = "moderate"
    investment_history: Optional[str] = ""

class FinancialAdvisoryResponse(BaseModel):
    investor_id: str
    analysis: str
    recommendations: List[str]
    risk_assessment: str
    suggested_actions: List[str]
    timestamp: str

class MemoryRequest(BaseModel):
    user_id: str
    category: Optional[str] = "all"
    limit: Optional[int] = 10

class MemoryResponse(BaseModel):
    user_id: str
    memories: List[Dict[str, Any]]
    count: int

# ============ HELPER FUNCTIONS ============

def call_asi_api(system_prompt: str, user_message: str) -> str:
    """Call ASI API for LLM inference"""
    try:
        headers = {
            "Authorization": f"Bearer {ASI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        response = requests.post(ASI_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASI API Error: {str(e)}")

def load_memories(agent_type: str, user_id: str) -> List[Dict]:
    """Load user memories from JSON file"""
    memory_files = {
        "medical": "medical/user_memories.json",
        "legal": "law/case_memories.json",
        "customer_support": "customer-support/customer_memories.json",
        "education": "education/student_memories.json",
        "financial": "financial/portfolio_memories.json"
    }
    
    try:
        file_path = memory_files.get(agent_type)
        if not file_path or not os.path.exists(file_path):
            return []
        
        with open(file_path, 'r') as f:
            data = json.load(f)
            memories = data.get('memories', [])
            # Filter by user_id if needed
            return [m for m in memories if m.get('user_id') == user_id or m.get('patient_id') == user_id]
    except Exception as e:
        print(f"Error loading memories: {e}")
        return []

# ============ API ENDPOINTS ============

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ASI-Agents API Server",
        "version": "1.0.0",
        "agents": ["medical", "legal", "customer_support", "education", "financial"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# ============ MEDICAL AGENT ENDPOINTS ============

@app.post("/api/medical/consult", response_model=MedicalConsultationResponse)
async def medical_consultation(request: MedicalConsultationRequest):
    """Get medical consultation"""
    try:
        # Load patient memories
        memories = load_memories("medical", request.patient_id)
        memory_context = "\n".join([f"- {m.get('context', '')}" for m in memories[:5]])
        
        system_prompt = f"""You are an expert AI medical consultant. Provide professional medical advice.
        
Patient History from Memory:
{memory_context if memory_context else "No previous medical history available"}

Consider the patient's symptoms, medical history, and urgency level.
Provide diagnosis, recommendations, and determine if follow-up is required."""

        user_message = f"""Patient ID: {request.patient_id}
Symptoms: {request.symptoms}
Medical History: {request.medical_history}
Urgency Level: {request.urgency_level}

Please provide:
1. Preliminary diagnosis
2. Recommendations (as a numbered list)
3. Whether follow-up is required (Yes/No)
4. Urgency assessment"""

        response = call_asi_api(system_prompt, user_message)
        
        # Parse response
        lines = response.strip().split('\n')
        diagnosis = ""
        recommendations = []
        follow_up = False
        urgency = request.urgency_level
        
        current_section = ""
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if "diagnosis" in line.lower() and ":" in line:
                current_section = "diagnosis"
                diagnosis = line.split(":", 1)[1].strip() if ":" in line else line
            elif "recommendation" in line.lower() and ":" in line:
                current_section = "recommendations"
            elif "follow" in line.lower() and ":" in line:
                follow_up = "yes" in line.lower()
            elif "urgency" in line.lower() and ":" in line:
                urgency = line.split(":", 1)[1].strip()
            elif line.startswith(("1.", "2.", "3.", "4.", "5.", "-", "•")):
                recommendations.append(line.lstrip("12345.-• "))
        
        if not diagnosis:
            diagnosis = response[:200]
        
        return MedicalConsultationResponse(
            patient_id=request.patient_id,
            diagnosis=diagnosis,
            recommendations=recommendations if recommendations else ["General care recommended"],
            follow_up_required=follow_up,
            urgency_assessment=urgency,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/medical/memories", response_model=MemoryResponse)
async def get_medical_memories(request: MemoryRequest):
    """Get patient medical memories"""
    memories = load_memories("medical", request.user_id)
    return MemoryResponse(
        user_id=request.user_id,
        memories=memories[:request.limit],
        count=len(memories)
    )

# ============ LEGAL AGENT ENDPOINTS ============

@app.post("/api/legal/consult", response_model=LegalConsultationResponse)
async def legal_consultation(request: LegalConsultationRequest):
    """Get legal consultation"""
    try:
        memories = load_memories("legal", request.client_id)
        memory_context = "\n".join([f"- {m.get('context', '')}" for m in memories[:5]])
        
        system_prompt = f"""You are an expert AI legal consultant. Provide professional legal advice.

Client Case History:
{memory_context if memory_context else "No previous case history available"}

Consider the case description, legal history, and case type.
Provide legal analysis, recommendations, and next steps."""

        user_message = f"""Client ID: {request.client_id}
Case Description: {request.case_description}
Legal History: {request.legal_history}
Case Type: {request.case_type}
Urgency: {request.urgency_level}

Please provide:
1. Legal analysis
2. Recommendations
3. Next steps
4. Whether in-person consultation is required"""

        response = call_asi_api(system_prompt, user_message)
        
        # Parse response
        analysis = response[:300]
        recommendations = []
        next_steps = []
        consultation_required = "consultation required" in response.lower()
        
        lines = response.strip().split('\n')
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if "analysis" in line.lower():
                current_section = "analysis"
            elif "recommendation" in line.lower():
                current_section = "recommendations"
            elif "next step" in line.lower() or "action" in line.lower():
                current_section = "next_steps"
            elif line.startswith(("1.", "2.", "3.", "4.", "5.", "-", "•")):
                clean_line = line.lstrip("12345.-• ")
                if current_section == "recommendations":
                    recommendations.append(clean_line)
                elif current_section == "next_steps":
                    next_steps.append(clean_line)
        
        return LegalConsultationResponse(
            client_id=request.client_id,
            legal_analysis=analysis,
            recommendations=recommendations if recommendations else ["Seek legal counsel"],
            next_steps=next_steps if next_steps else ["Schedule consultation"],
            consultation_required=consultation_required,
            urgency_assessment=request.urgency_level,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/legal/memories", response_model=MemoryResponse)
async def get_legal_memories(request: MemoryRequest):
    """Get client case memories"""
    memories = load_memories("legal", request.user_id)
    return MemoryResponse(
        user_id=request.user_id,
        memories=memories[:request.limit],
        count=len(memories)
    )

# ============ CUSTOMER SUPPORT ENDPOINTS ============

@app.post("/api/support/ticket", response_model=SupportTicketResponse)
async def create_support_ticket(request: SupportTicketRequest):
    """Create and resolve support ticket"""
    try:
        memories = load_memories("customer_support", request.customer_id)
        memory_context = "\n".join([f"- {m.get('context', '')}" for m in memories[:5]])
        
        system_prompt = f"""You are an expert AI customer support agent. Provide helpful solutions.

Customer History:
{memory_context if memory_context else "No previous support history available"}

Analyze the issue and provide solutions, recommendations, and estimate resolution time."""

        user_message = f"""Customer ID: {request.customer_id}
Issue: {request.issue_description}
History: {request.ticket_history}
Priority: {request.priority}
Category: {request.category}

Please provide:
1. Solution
2. Recommendations
3. Whether escalation is needed
4. Estimated resolution time"""

        response = call_asi_api(system_prompt, user_message)
        
        # Parse response
        solution = response[:300]
        recommendations = []
        escalation = "escalat" in response.lower()
        resolution_time = "24-48 hours"
        
        lines = response.strip().split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith(("1.", "2.", "3.", "4.", "5.", "-", "•")):
                recommendations.append(line.lstrip("12345.-• "))
            if "hour" in line.lower() or "day" in line.lower():
                resolution_time = line
        
        import uuid
        ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        
        return SupportTicketResponse(
            customer_id=request.customer_id,
            ticket_id=ticket_id,
            solution=solution,
            recommendations=recommendations if recommendations else ["Follow standard procedure"],
            escalation_required=escalation,
            estimated_resolution_time=resolution_time,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/support/memories", response_model=MemoryResponse)
async def get_support_memories(request: MemoryRequest):
    """Get customer support memories"""
    memories = load_memories("customer_support", request.user_id)
    return MemoryResponse(
        user_id=request.user_id,
        memories=memories[:request.limit],
        count=len(memories)
    )

# ============ EDUCATION ENDPOINTS ============

@app.post("/api/education/tutor", response_model=EducationResponse)
async def education_tutoring(request: EducationRequest):
    """Get educational tutoring"""
    try:
        memories = load_memories("education", request.student_id)
        memory_context = "\n".join([f"- {m.get('context', '')}" for m in memories[:5]])
        
        system_prompt = f"""You are an expert AI tutor. Provide clear, educational explanations.

Student Learning History:
{memory_context if memory_context else "No previous learning history available"}

Adapt your teaching to the student's level and provide examples and practice problems."""

        user_message = f"""Student ID: {request.student_id}
Question: {request.question}
Subject: {request.subject}
Level: {request.learning_level}
History: {request.learning_history}

Please provide:
1. Clear explanation
2. Examples (with steps)
3. Practice problems
4. Additional resources"""

        response = call_asi_api(system_prompt, user_message)
        
        # Parse response
        explanation = response[:400]
        examples = []
        practice_problems = []
        resources = []
        
        lines = response.strip().split('\n')
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if "example" in line.lower():
                current_section = "examples"
            elif "practice" in line.lower() or "problem" in line.lower():
                current_section = "practice"
            elif "resource" in line.lower() or "reference" in line.lower():
                current_section = "resources"
            elif line.startswith(("1.", "2.", "3.", "4.", "5.", "-", "•")):
                clean_line = line.lstrip("12345.-• ")
                if current_section == "examples":
                    examples.append(clean_line)
                elif current_section == "practice":
                    practice_problems.append(clean_line)
                elif current_section == "resources":
                    resources.append(clean_line)
        
        return EducationResponse(
            student_id=request.student_id,
            explanation=explanation,
            examples=examples if examples else ["Example: See explanation above"],
            practice_problems=practice_problems if practice_problems else ["Try solving similar problems"],
            additional_resources=resources if resources else ["Refer to textbook"],
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/education/memories", response_model=MemoryResponse)
async def get_education_memories(request: MemoryRequest):
    """Get student learning memories"""
    memories = load_memories("education", request.user_id)
    return MemoryResponse(
        user_id=request.user_id,
        memories=memories[:request.limit],
        count=len(memories)
    )

# ============ FINANCIAL ENDPOINTS ============

@app.post("/api/financial/advise", response_model=FinancialAdvisoryResponse)
async def financial_advisory(request: FinancialAdvisoryRequest):
    """Get financial advisory"""
    try:
        memories = load_memories("financial", request.investor_id)
        memory_context = "\n".join([f"- {m.get('context', '')}" for m in memories[:5]])
        
        portfolio_str = json.dumps(request.portfolio, indent=2) if request.portfolio else "No portfolio provided"
        
        system_prompt = f"""You are an expert AI financial advisor. Provide professional investment advice.

Investor History:
{memory_context if memory_context else "No previous investment history available"}

Analyze the portfolio, risk tolerance, and provide recommendations."""

        user_message = f"""Investor ID: {request.investor_id}
Query: {request.query}
Portfolio: {portfolio_str}
Risk Tolerance: {request.risk_tolerance}
History: {request.investment_history}

Please provide:
1. Financial analysis
2. Recommendations
3. Risk assessment
4. Suggested actions"""

        response = call_asi_api(system_prompt, user_message)
        
        # Parse response
        analysis = response[:300]
        recommendations = []
        risk_assessment = f"{request.risk_tolerance} risk profile"
        suggested_actions = []
        
        lines = response.strip().split('\n')
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if "recommendation" in line.lower():
                current_section = "recommendations"
            elif "risk" in line.lower():
                current_section = "risk"
                if ":" in line:
                    risk_assessment = line.split(":", 1)[1].strip()
            elif "action" in line.lower() or "step" in line.lower():
                current_section = "actions"
            elif line.startswith(("1.", "2.", "3.", "4.", "5.", "-", "•")):
                clean_line = line.lstrip("12345.-• ")
                if current_section == "recommendations":
                    recommendations.append(clean_line)
                elif current_section == "actions":
                    suggested_actions.append(clean_line)
        
        return FinancialAdvisoryResponse(
            investor_id=request.investor_id,
            analysis=analysis,
            recommendations=recommendations if recommendations else ["Diversify portfolio"],
            risk_assessment=risk_assessment,
            suggested_actions=suggested_actions if suggested_actions else ["Review portfolio quarterly"],
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/financial/memories", response_model=MemoryResponse)
async def get_financial_memories(request: MemoryRequest):
    """Get investor portfolio memories"""
    memories = load_memories("financial", request.user_id)
    return MemoryResponse(
        user_id=request.user_id,
        memories=memories[:request.limit],
        count=len(memories)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
