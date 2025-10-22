"""
Medical Consultation System with Memory Integration
Manages Doctor, Patient, and Memory agents with protocol-based communication
Integrates user memories from browser extension for personalized healthcare
"""

import os
import json
import requests
from typing import List, Dict, Optional
from pathlib import Path
from uagents import Agent, Context, Model, Protocol, Bureau
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ASI API Configuration
ASI_API_URL = "https://api.asi1.ai/v1/chat/completions"
ASI_API_KEY = os.getenv("ASI_ONE_API_KEY")


# ============ MESSAGE MODELS ============
class MedicalQuery(Model):
    """Model for incoming medical queries"""
    patient_id: str
    symptoms: str
    medical_history: str = ""
    urgency_level: str = "normal"


class MedicalAdvice(Model):
    """Model for medical advice response"""
    patient_id: str
    diagnosis: str
    recommendations: list[str]
    follow_up_required: bool
    urgency_assessment: str


class AppointmentRequest(Model):
    """Model for appointment scheduling"""
    patient_id: str
    preferred_date: str
    reason: str


class AppointmentConfirmation(Model):
    """Model for appointment confirmation"""
    patient_id: str
    appointment_id: str
    scheduled_date: str
    status: str


class MemoryRequest(Model):
    """Model for requesting user memories"""
    user_id: str
    category: Optional[str] = None
    limit: Optional[int] = 10


class MemoryResponse(Model):
    """Model for memory query responses"""
    user_id: str
    memories: List[Dict]
    count: int


# ============ INITIALIZE AGENTS ============
doctor_agent = Agent(
    name="doctor_agent",
    seed="doctor_agent_seed_phrase_zkMem_2024",
    port=8000,
)

patient_agent = Agent(
    name="patient_agent",
    seed="patient_agent_seed_phrase_zkMem_2024",
    port=8001,
)

memory_agent = Agent(
    name="memory_agent",
    seed="memory_agent_seed_phrase_zkMem_2024",
    port=8002,
)


# ============ MEMORY STORAGE INTERFACE ============
class MemoryStorageInterface:
    """Interface to browser extension's local storage"""
    
    def __init__(self, storage_path: Optional[str] = None):
        self.storage_path = storage_path or os.path.join(
            os.path.dirname(__file__), 
            "user_memories.json"
        )
        self.ensure_storage_exists()
    
    def ensure_storage_exists(self):
        """Create storage file if it doesn't exist"""
        if not os.path.exists(self.storage_path):
            sample_data = {
                "memories": [
                    {
                        "id": "mem_001",
                        "entity": "John Doe",
                        "category": "name",
                        "context": "User's name is John Doe",
                        "timestamp": 1729598400000,
                        "status": "local",
                        "metadata": {"source": "chat", "confidence": 0.95}
                    },
                    {
                        "id": "mem_003",
                        "entity": "peanuts",
                        "category": "allergy",
                        "context": "User is allergic to peanuts",
                        "timestamp": 1729598600000,
                        "status": "local",
                        "metadata": {"source": "chat", "confidence": 0.98}
                    },
                    {
                        "id": "mem_005",
                        "entity": "diabetes",
                        "category": "condition",
                        "context": "User has type 2 diabetes",
                        "timestamp": 1729598800000,
                        "status": "local",
                        "metadata": {"source": "chat", "confidence": 0.96}
                    }
                ]
            }
            
            with open(self.storage_path, 'w') as f:
                json.dump(sample_data, f, indent=2)
            
            print(f"[MemoryStorage] Created sample storage at {self.storage_path}")
    
    def get_all_memories(self) -> List[Dict]:
        """Retrieve all memories from storage"""
        try:
            with open(self.storage_path, 'r') as f:
                data = json.load(f)
                return data.get("memories", [])
        except Exception as e:
            print(f"[MemoryStorage] Error reading memories: {e}")
            return []
    
    def get_memories_by_category(self, category: str) -> List[Dict]:
        """Get memories filtered by category"""
        all_memories = self.get_all_memories()
        return [m for m in all_memories if m.get("category") == category]


# Initialize storage
storage = MemoryStorageInterface()


# ============ MEMORY PROTOCOL ============
memory_protocol = Protocol(name="MemoryManagementProtocol", version="1.0.0")


@memory_agent.on_event("startup")
async def memory_startup(ctx: Context):
    ctx.logger.info(f"🧠 Memory Agent started")
    ctx.logger.info(f"📍 Address: {ctx.agent.address}")
    
    memories = storage.get_all_memories()
    ctx.logger.info(f"💾 Loaded {len(memories)} memories from storage")


@memory_protocol.on_message(model=MemoryRequest, replies=MemoryResponse)
async def handle_memory_request(ctx: Context, sender: str, msg: MemoryRequest):
    """Handle memory requests from other agents"""
    ctx.logger.info(f"📨 Memory request from {sender} for category: {msg.category or 'all'}")
    
    if msg.category:
        memories = storage.get_memories_by_category(msg.category)
    else:
        memories = storage.get_all_memories()
    
    if msg.limit:
        memories = memories[:msg.limit]
    
    response = MemoryResponse(
        user_id=msg.user_id,
        memories=memories,
        count=len(memories)
    )
    
    await ctx.send(sender, response)
    ctx.logger.info(f"✅ Sent {len(memories)} memories to {sender}")


# ============ DOCTOR PROTOCOL ============
doctor_protocol = Protocol(name="MedicalConsultationProtocol", version="1.0.0")


@doctor_agent.on_event("startup")
async def doctor_startup(ctx: Context):
    ctx.logger.info(f"🏥 Doctor Agent started")
    ctx.logger.info(f"📍 Address: {ctx.agent.address}")
    ctx.logger.info("✅ Ready to receive medical consultations...")


@doctor_protocol.on_message(model=MedicalQuery, replies=MedicalAdvice)
async def handle_medical_query(ctx: Context, sender: str, msg: MedicalQuery):
    ctx.logger.info(f"📨 Received medical query from patient: {msg.patient_id}")
    ctx.logger.info(f"🤒 Symptoms: {msg.symptoms}")
    
    # Request user memories from memory agent
    ctx.logger.info(f"🧠 Requesting user memories from memory agent...")
    memory_req = MemoryRequest(user_id=msg.patient_id, category=None, limit=20)
    await ctx.send(memory_agent.address, memory_req)
    
    # Get medical-related memories from storage (allergy, medication, condition)
    medical_memories = []
    for category in ["allergy", "medication", "condition"]:
        medical_memories.extend(storage.get_memories_by_category(category))
    
    # Build enhanced medical history
    enhanced_history = msg.medical_history
    if medical_memories:
        ctx.logger.info(f"💾 Found {len(medical_memories)} medical memories")
        memory_context = "\n".join([f"- {m['context']}" for m in medical_memories])
        enhanced_history = f"{msg.medical_history}\n\nKnown Medical Information:\n{memory_context}"
        ctx.logger.info(f"📋 Enhanced medical history with user memories")
    
    # Analyze using ASI API with enhanced history
    diagnosis = analyze_symptoms_asi(msg.symptoms, enhanced_history)
    recommendations = generate_recommendations_asi(diagnosis, msg.urgency_level, medical_memories)
    urgency = assess_urgency(msg.symptoms, msg.urgency_level)
    
    advice = MedicalAdvice(
        patient_id=msg.patient_id,
        diagnosis=diagnosis,
        recommendations=recommendations,
        follow_up_required=urgency in ["high", "emergency"],
        urgency_assessment=urgency
    )
    
    await ctx.send(sender, advice)
    ctx.logger.info(f"✅ Sent medical advice to {sender}")


@doctor_protocol.on_message(model=AppointmentRequest, replies=AppointmentConfirmation)
async def handle_appointment(ctx: Context, sender: str, msg: AppointmentRequest):
    ctx.logger.info(f"📅 Appointment request from: {msg.patient_id}")
    
    appointment_id = f"APT-{msg.patient_id}-{hash(msg.preferred_date) % 10000}"
    confirmation = AppointmentConfirmation(
        patient_id=msg.patient_id,
        appointment_id=appointment_id,
        scheduled_date=msg.preferred_date,
        status="confirmed"
    )
    
    await ctx.send(sender, confirmation)
    ctx.logger.info(f"✅ Appointment confirmed: {appointment_id}")


# ============ PATIENT PROTOCOL ============
patient_protocol = Protocol(name="PatientConsultationProtocol", version="1.0.0")


@patient_agent.on_event("startup")
async def patient_startup(ctx: Context):
    ctx.logger.info(f"👤 Patient Agent started")
    ctx.logger.info(f"📍 Address: {ctx.agent.address}")


@patient_protocol.on_interval(period=45.0)
async def send_consultation_request(ctx: Context):
    ctx.logger.info("📤 Sending medical consultation request...")
    
    query = MedicalQuery(
        patient_id="PAT-001",
        symptoms="fever and cough for 3 days, feeling very tired",
        medical_history="No significant medical history",
        urgency_level="normal"
    )
    
    await ctx.send(doctor_agent.address, query)
    ctx.logger.info(f"✅ Medical query sent to doctor")


@patient_protocol.on_message(model=MedicalAdvice)
async def handle_advice(ctx: Context, sender: str, msg: MedicalAdvice):
    ctx.logger.info(f"\n{'='*60}")
    ctx.logger.info(f"📋 MEDICAL ADVICE RECEIVED")
    ctx.logger.info(f"{'='*60}")
    ctx.logger.info(f"🔍 Diagnosis: {msg.diagnosis}")
    ctx.logger.info(f"⚠️  Urgency: {msg.urgency_assessment}")
    ctx.logger.info(f"💊 Recommendations:")
    for i, rec in enumerate(msg.recommendations, 1):
        ctx.logger.info(f"   {i}. {rec}")
    ctx.logger.info(f"{'='*60}\n")
    
    if msg.follow_up_required:
        ctx.logger.info("📅 Follow-up required, requesting appointment...")
        appointment = AppointmentRequest(
            patient_id=msg.patient_id,
            preferred_date="2025-10-25 10:00 AM",
            reason="Follow-up consultation"
        )
        await ctx.send(sender, appointment)


@patient_protocol.on_message(model=AppointmentConfirmation)
async def handle_confirmation(ctx: Context, sender: str, msg: AppointmentConfirmation):
    ctx.logger.info(f"\n🎉 APPOINTMENT CONFIRMED!")
    ctx.logger.info(f"📋 ID: {msg.appointment_id}")
    ctx.logger.info(f"📅 Date: {msg.scheduled_date}")
    ctx.logger.info(f"✅ Status: {msg.status}\n")


# ============ ASI API HELPER FUNCTIONS ============
def analyze_symptoms_asi(symptoms: str, medical_history: str) -> str:
    """Analyze symptoms using ASI API"""
    try:
        if not ASI_API_KEY:
            raise ValueError("ASI_ONE_API_KEY not configured")
        
        prompt = f"""You are a medical assistant AI. Analyze these symptoms:
Symptoms: {symptoms}
Medical History: {medical_history or "None provided"}

Provide a brief preliminary assessment (2-3 sentences). Be professional and cautious."""

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ASI_API_KEY}"
        }
        
        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a medical assistant providing preliminary assessments."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 200
        }
        
        response = requests.post(ASI_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
        
    except Exception as e:
        print(f"ASI API error: {e}")
        if "fever" in symptoms.lower() and "cough" in symptoms.lower():
            return "Possible respiratory infection or flu. Please consult a healthcare provider."
        return "General consultation recommended. Please schedule an appointment."


def generate_recommendations_asi(diagnosis: str, urgency: str, medical_memories: List[Dict] = None) -> list[str]:
    """Generate recommendations using ASI API, considering user's medical memories"""
    try:
        if not ASI_API_KEY:
            raise ValueError("ASI_ONE_API_KEY not configured")
        
        # Build context from medical memories
        memory_context = ""
        if medical_memories:
            allergies = [m['entity'] for m in medical_memories if m['category'] == 'allergy']
            conditions = [m['entity'] for m in medical_memories if m['category'] == 'condition']
            medications = [m['entity'] for m in medical_memories if m['category'] == 'medication']
            
            if allergies:
                memory_context += f"\nPatient Allergies: {', '.join(allergies)}"
            if conditions:
                memory_context += f"\nExisting Conditions: {', '.join(conditions)}"
            if medications:
                memory_context += f"\nCurrent Medications: {', '.join(medications)}"
            
        prompt = f"""Based on: "{diagnosis}"
Urgency: {urgency}
{memory_context}

Provide 3-4 practical, personalized recommendations considering the patient's medical history. Format as a simple list.
IMPORTANT: Avoid recommending anything that conflicts with known allergies or conditions."""

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ASI_API_KEY}"
        }
        
        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 200
        }
        
        response = requests.post(ASI_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        result = response.json()
        text = result['choices'][0]['message']['content'].strip()
        recommendations = [line.strip().lstrip('•-*123456789. ') for line in text.split('\n') if line.strip()]
        return recommendations[:4]
        
    except Exception as e:
        print(f"ASI API error: {e}")
        # Fallback recommendations considering allergies
        recs = [
            "Rest and stay hydrated",
            "Monitor symptoms",
            "Consult a healthcare provider if symptoms worsen"
        ]
        
        if medical_memories:
            allergies = [m['entity'] for m in medical_memories if m['category'] == 'allergy']
            if allergies:
                recs.append(f"Note: Avoid {', '.join(allergies)} due to known allergies")
        
        return recs


def assess_urgency(symptoms: str, declared_urgency: str) -> str:
    """Assess urgency level"""
    symptoms_lower = symptoms.lower()
    emergency_keywords = ["chest pain", "difficulty breathing", "severe bleeding"]
    
    if any(keyword in symptoms_lower for keyword in emergency_keywords):
        return "emergency"
    
    high_priority = ["high fever", "severe pain", "vomiting"]
    if any(keyword in symptoms_lower for keyword in high_priority):
        return "high"
    
    return declared_urgency if declared_urgency in ["low", "normal", "high"] else "normal"


# ============ BUREAU SETUP ============
if __name__ == "__main__":
    # Initialize Bureau with endpoint
    bureau = Bureau(endpoint=["http://127.0.0.1:8000/submit"])
    
    # Include protocols with published manifests
    doctor_agent.include(doctor_protocol, publish_manifest=True)
    patient_agent.include(patient_protocol, publish_manifest=True)
    memory_agent.include(memory_protocol, publish_manifest=True)
    
    # Add agents to bureau
    bureau.add(doctor_agent)
    bureau.add(patient_agent)
    bureau.add(memory_agent)
    
    print("\n" + "="*70)
    print("🏥 MEDICAL CONSULTATION SYSTEM WITH MEMORY INTEGRATION")
    print("="*70)
    print(f"👨‍⚕️ Doctor Agent:  {doctor_agent.address}")
    print(f"👤 Patient Agent: {patient_agent.address}")
    print(f"🧠 Memory Agent:  {memory_agent.address}")
    print("="*70)
    
    # Display loaded memories
    memories = storage.get_all_memories()
    print(f"💾 Loaded {len(memories)} user memories:")
    for mem in memories[:3]:  # Show first 3
        print(f"   - [{mem['category']}] {mem['context']}")
    if len(memories) > 3:
        print(f"   ... and {len(memories) - 3} more")
    print("="*70 + "\n")
    
    # Run the bureau
    bureau.run()
