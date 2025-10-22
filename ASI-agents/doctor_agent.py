"""
Doctor Agent - ASI-based Medical Assistant Agent
This agent acts as a medical consultation assistant with mailbox enabled
for asynchronous communication with users and other agents.
"""

from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low


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
doctor_agent = Agent(
    name="doctor_agent",
    seed="doctor_agent_seed_phrase_zkMem_2024",
    port=8001,
    endpoint=["http://localhost:8001/submit"],
    mailbox=True  # Enable mailbox for asynchronous messaging
)

# Fund agent if needed (for testnet)
fund_agent_if_low(doctor_agent.wallet.address())


@doctor_agent.on_event("startup")
async def introduce(ctx: Context):
    """Agent startup event handler"""
    ctx.logger.info(f"Doctor Agent started")
    ctx.logger.info(f"Agent address: {doctor_agent.address}")
    ctx.logger.info(f"Mailbox enabled: {doctor_agent.mailbox is not None}")
    ctx.logger.info("Ready to receive medical consultations...")


@doctor_agent.on_message(model=MedicalQuery)
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


@doctor_agent.on_message(model=AppointmentRequest)
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


@doctor_agent.on_interval(period=300.0)  # Check every 5 minutes
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
    Analyze patient symptoms and medical history
    In production, this would use medical AI models or knowledge bases
    """
    # Simplified logic for demonstration
    symptoms_lower = symptoms.lower()
    
    if "fever" in symptoms_lower and "cough" in symptoms_lower:
        return "Possible respiratory infection or flu"
    elif "chest pain" in symptoms_lower:
        return "Requires immediate attention - possible cardiac issue"
    elif "headache" in symptoms_lower and "fatigue" in symptoms_lower:
        return "Possible tension headache or stress-related condition"
    else:
        return "General consultation recommended for symptom assessment"


def generate_recommendations(diagnosis: str, urgency: str) -> list[str]:
    """
    Generate medical recommendations based on diagnosis
    """
    recommendations = []
    
    if "respiratory" in diagnosis.lower():
        recommendations = [
            "Rest and stay hydrated",
            "Monitor temperature regularly",
            "Consider over-the-counter fever reducers if needed",
            "Seek immediate care if breathing difficulty occurs"
        ]
    elif "cardiac" in diagnosis.lower():
        recommendations = [
            "URGENT: Seek immediate medical attention",
            "Do not drive yourself - call emergency services",
            "Avoid physical exertion"
        ]
    elif "tension" in diagnosis.lower():
        recommendations = [
            "Ensure adequate rest and sleep",
            "Practice stress management techniques",
            "Stay hydrated",
            "Consider over-the-counter pain relief if needed"
        ]
    else:
        recommendations = [
            "Schedule an in-person consultation",
            "Monitor symptoms and note any changes",
            "Maintain healthy lifestyle practices"
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
    In production, this would store to blockchain via zkMem smart contracts
    """
    ctx.logger.info(f"Logging interaction for patient: {query.patient_id}")
    # Here you would integrate with the zkMem smart contract to store
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
    doctor_agent.run()
