"""
Medical Consultation System - Bureau Setup
Manages both Doctor and Patient agents with protocol-based communication
This demonstrates agent-to-agent communication using the uAgents framework
"""

import os
import requests
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
    
    # Analyze using ASI API
    diagnosis = analyze_symptoms_asi(msg.symptoms, msg.medical_history)
    recommendations = generate_recommendations_asi(diagnosis, msg.urgency_level)
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


def generate_recommendations_asi(diagnosis: str, urgency: str) -> list[str]:
    """Generate recommendations using ASI API"""
    try:
        if not ASI_API_KEY:
            raise ValueError("ASI_ONE_API_KEY not configured")
            
        prompt = f"""Based on: "{diagnosis}"
Urgency: {urgency}

Provide 3-4 practical recommendations. Format as a simple list."""

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
        return [
            "Rest and stay hydrated",
            "Monitor symptoms",
            "Consult a healthcare provider if symptoms worsen",
            "Take over-the-counter medication as needed"
        ]


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
    
    # Add agents to bureau
    bureau.add(doctor_agent)
    bureau.add(patient_agent)
    
    print("\n" + "="*60)
    print("🏥 MEDICAL CONSULTATION SYSTEM STARTING")
    print("="*60)
    print(f"👨‍⚕️ Doctor Agent: {doctor_agent.address}")
    print(f"👤 Patient Agent: {patient_agent.address}")
    print("="*60 + "\n")
    
    # Run the bureau
    bureau.run()
