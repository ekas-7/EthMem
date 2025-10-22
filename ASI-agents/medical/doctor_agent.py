"""
Doctor Agent - ASI-based Medical Assistant Agent
This agent acts as a medical consultation assistant with mailbox enabled
for asynchronous communication with users and other agents.
Integrates with ASI (Artificial Superintelligence) API for intelligent medical consultations.
Uses Protocol-based communication for structured agent-to-agent interactions.
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


# Define message models for communication
class MedicalQuery(Model):
    """Model for incoming medical queries"""
    patient_id: str
    symptoms: str
    medical_history: str = ""
    urgency_level: str = "normal"  # low, normal, high, emergency


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


# Initialize the Doctor Agent with mailbox enabled
# Using Agentverse mailbox - no local port/endpoint needed
doctor_agent = Agent(
    name="doctor_agent",
    seed="doctor_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"  # Agentverse mailbox API key
)

# Define Doctor Protocol for medical consultation
doctor_protocol = Protocol(name="MedicalConsultationProtocol", version="1.0.0")


@doctor_protocol.on_event("startup")
async def introduce(ctx: Context):
    """Protocol startup event handler"""
    ctx.logger.info(f"Doctor Agent started")
    ctx.logger.info(f"Agent address: {doctor_agent.address}")
    ctx.logger.info("Medical Consultation Protocol initialized")
    ctx.logger.info("Ready to receive medical consultations...")


@doctor_protocol.on_message(model=MedicalQuery, replies=MedicalAdvice)
async def handle_medical_query(ctx: Context, sender: str, msg: MedicalQuery):
    """
    Handle incoming medical queries from patients or other agents
    Provides initial assessment and recommendations
    """
    ctx.logger.info(f"Received medical query from patient: {msg.patient_id}")
    ctx.logger.info(f"Symptoms: {msg.symptoms}")
    
    # Process the query and generate advice
    # In a real implementation, this would use medical knowledge bases or AI models
    diagnosis = analyze_symptoms(msg.symptoms, msg.medical_history)
    recommendations = generate_recommendations(diagnosis, msg.urgency_level)
    
    # Assess urgency
    urgency = assess_urgency(msg.symptoms, msg.urgency_level)
    
    # Create response
    advice = MedicalAdvice(
        patient_id=msg.patient_id,
        diagnosis=diagnosis,
        recommendations=recommendations,
        follow_up_required=urgency in ["high", "emergency"],
        urgency_assessment=urgency
    )
    
    # Send response back to sender
    await ctx.send(sender, advice)
    ctx.logger.info(f"Sent medical advice to {sender}")
    
    # Log interaction for memory/blockchain storage
    log_interaction(ctx, msg, advice)


@doctor_protocol.on_message(model=AppointmentRequest, replies=AppointmentConfirmation)
async def handle_appointment_request(ctx: Context, sender: str, msg: AppointmentRequest):
    """
    Handle appointment scheduling requests
    """
    ctx.logger.info(f"Received appointment request from patient: {msg.patient_id}")
    
    # Process appointment request
    # In production, this would check availability and calendar
    appointment_id = f"APT-{msg.patient_id}-{hash(msg.preferred_date) % 10000}"
    
    confirmation = AppointmentConfirmation(
        patient_id=msg.patient_id,
        appointment_id=appointment_id,
        scheduled_date=msg.preferred_date,
        status="confirmed"
    )
    
    await ctx.send(sender, confirmation)
    ctx.logger.info(f"Appointment confirmed: {appointment_id}")


@doctor_protocol.on_interval(period=300.0)  # Check every 5 minutes
async def check_patient_follow_ups(ctx: Context):
    """
    Periodic task to check for required patient follow-ups
    """
    ctx.logger.info("Checking for pending follow-ups...")
    # In production, query database/blockchain for pending follow-ups
    # Send reminders to patients who need follow-up consultations


# Helper functions for medical logic
def analyze_symptoms(symptoms: str, medical_history: str) -> str:
    """
    Analyze patient symptoms and medical history using ASI API
    """
    try:
        if not ASI_API_KEY:
            raise ValueError("ASI_ONE_API_KEY not configured")
        
        # Construct prompt for ASI
        prompt = f"""You are a medical assistant AI helping with initial patient assessment.
        
Patient Symptoms: {symptoms}
Medical History: {medical_history if medical_history else "No significant medical history provided"}

Please provide a preliminary diagnosis or assessment. Be professional, cautious, and recommend seeking professional medical care when appropriate. Keep your response concise (2-3 sentences).

IMPORTANT: This is for educational/informational purposes only and should not replace professional medical advice."""

        # Make request to ASI API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ASI_API_KEY}"
        }
        
        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a helpful medical assistant AI providing preliminary assessments. Always emphasize the importance of consulting with healthcare professionals."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 200,
            "temperature": 0.7
        }
        
        response = requests.post(ASI_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        diagnosis = result['choices'][0]['message']['content'].strip()
        return diagnosis
        
    except Exception as e:
        # Fallback to rule-based logic if ASI API fails
        print(f"ASI API error: {e}. Using fallback logic.")
        symptoms_lower = symptoms.lower()
        
        if "fever" in symptoms_lower and "cough" in symptoms_lower:
            return "Possible respiratory infection or flu. Please consult a healthcare provider for proper diagnosis."
        elif "chest pain" in symptoms_lower:
            return "Requires immediate attention - possible cardiac issue. Seek emergency medical care immediately."
        elif "headache" in symptoms_lower and "fatigue" in symptoms_lower:
            return "Possible tension headache or stress-related condition. Monitor symptoms and consult a doctor if they persist."
        else:
            return "General consultation recommended for symptom assessment. Please schedule an appointment with a healthcare provider."


def generate_recommendations(diagnosis: str, urgency: str) -> list[str]:
    """
    Generate medical recommendations based on diagnosis using ASI API
    """
    try:
        if not ASI_API_KEY:
            raise ValueError("ASI_ONE_API_KEY not configured")
            
        prompt = f"""Based on this preliminary diagnosis: "{diagnosis}"
        
Urgency Level: {urgency}

Provide 3-4 practical, actionable recommendations for the patient. Format as a simple list.
Keep recommendations professional and emphasize seeking medical care when needed."""

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ASI_API_KEY}"
        }
        
        payload = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a medical assistant providing practical health recommendations. Be clear, concise, and responsible."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 250,
            "temperature": 0.7
        }
        
        response = requests.post(ASI_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        recommendations_text = result['choices'][0]['message']['content'].strip()
        
        # Parse recommendations from response
        # Split by newlines and clean up
        recommendations = [line.strip().lstrip('•-*123456789. ') for line in recommendations_text.split('\n') if line.strip()]
        
        return recommendations[:4]  # Limit to 4 recommendations
        
    except Exception as e:
        print(f"ASI API error: {e}. Using fallback logic.")
        # Fallback logic
        recommendations = []
        
        if "respiratory" in diagnosis.lower():
            recommendations = [
                "Rest and stay hydrated",
                "Monitor temperature regularly",
                "Consider over-the-counter fever reducers if needed",
                "Seek immediate care if breathing difficulty occurs"
            ]
        elif "cardiac" in diagnosis.lower() or "chest pain" in diagnosis.lower():
            recommendations = [
                "URGENT: Seek immediate medical attention",
                "Do not drive yourself - call emergency services",
                "Avoid physical exertion"
            ]
        elif "tension" in diagnosis.lower() or "headache" in diagnosis.lower():
            recommendations = [
                "Ensure adequate rest and sleep",
                "Practice stress management techniques",
                "Stay hydrated",
                "Consider over-the-counter pain relief if needed"
            ]
        else:
            recommendations = [
                "Schedule an in-person consultation with a healthcare provider",
                "Monitor symptoms and note any changes",
                "Maintain healthy lifestyle practices",
                "Seek immediate care if symptoms worsen"
            ]
        
        return recommendations


def assess_urgency(symptoms: str, declared_urgency: str) -> str:
    """
    Assess the urgency level of the medical query
    """
    symptoms_lower = symptoms.lower()
    
    # Check for emergency keywords
    emergency_keywords = ["chest pain", "difficulty breathing", "severe bleeding", 
                         "unconscious", "seizure", "stroke"]
    
    if any(keyword in symptoms_lower for keyword in emergency_keywords):
        return "emergency"
    
    # Check for high priority keywords
    high_priority = ["high fever", "severe pain", "vomiting", "dizziness"]
    
    if any(keyword in symptoms_lower for keyword in high_priority):
        return "high"
    
    # Otherwise use declared urgency or default to normal
    return declared_urgency if declared_urgency in ["low", "normal", "high"] else "normal"


def log_interaction(ctx: Context, query: MedicalQuery, advice: MedicalAdvice):
    """
    Log medical interaction for record keeping
    In production, this would store to blockchain via ETHMem smart contracts
    """
    ctx.logger.info(f"Logging interaction for patient: {query.patient_id}")
    # Here you would integrate with the ETHMem smart contract to store
    # encrypted medical records on the blockchain
    ctx.storage.set(
        f"consultation_{query.patient_id}_{ctx.timestamp}",
        {
            "query": query.dict(),
            "advice": advice.dict(),
            "timestamp": str(ctx.timestamp)
        }
    )


if __name__ == "__main__":
    # Include protocol and publish manifest to Almanac
    doctor_agent.include(doctor_protocol, publish_manifest=True)
    doctor_agent.run()
