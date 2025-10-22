"""
Patient Agent - Communicates with Doctor Agent via Protocol
This agent simulates a patient sending medical queries to the doctor agent
and receiving medical advice and appointment confirmations.
"""

import os
from uagents import Agent, Context, Model, Protocol
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define message models (matching doctor agent models)
class MedicalQuery(Model):
    """Model for medical query requests"""
    patient_id: str
    symptoms: str
    medical_history: str = ""
    urgency_level: str = "normal"  # low, normal, high, emergency


class MedicalAdvice(Model):
    """Model for medical advice responses"""
    patient_id: str
    diagnosis: str
    recommendations: list[str]
    follow_up_required: bool
    urgency_assessment: str


class AppointmentRequest(Model):
    """Model for appointment requests"""
    patient_id: str
    preferred_date: str
    reason: str


class AppointmentConfirmation(Model):
    """Model for appointment confirmation responses"""
    patient_id: str
    appointment_id: str
    scheduled_date: str
    status: str


# Initialize Patient Agent
patient_agent = Agent(
    name="patient_agent",
    seed="patient_agent_seed_phrase_ETHMem_2024",
    mailbox="eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3NjM3MDg1OTUsImlhdCI6MTc2MTExNjU5NSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJjODZiYWRmYTY3OGZiYzVlMWM1YzdiNTciLCJzY29wZSI6ImF2Iiwic3ViIjoiMDdiNzQ2Y2NlYjQzOTNiNDgzZjNiZjVjZjJkNmRkNjYwMGU5ODUyZjNjM2FkMDNiIn0.QJNlslN5SQ2LPr-_oWoEXH2k3jwQZLgV22neCxBkrIUzolG7RG-Y8QPhfEyLa7uF7fqtV3KDJgbuhcIfDdCLRkkAjkukHek41du5iM0WM3gtXJZbv_x2KProX3EcZXt-a1BQ35LciFUf4U7IS-OGawOo3VI87SMAM_OExA4DcSFTqiBg3ECPAkmFz9HdzdBEQUCrKkLfj68LpKJAGi2aPYRwCjFTJUuuv9m9x6HWILn7FPlCKLa3pA1C5qbairCJr9LuA1jkIKPx3N4FcsYYWVe_x48J_tS-UCZ9GEmRc88JoUowLreZTMOhAJR8_3o_LBCvrZ0vPTJDJjcGlRfOcw"
)

# Define Patient Protocol
patient_protocol = Protocol(name="PatientConsultationProtocol", version="1.0.0")

# Doctor agent address (will be set after doctor agent starts)
DOCTOR_AGENT_ADDRESS = "agent1qvrte6z80hl8my64g45qwtwpw6p5lmmhzal3jap0zxxj23khh9jgcavmk4g"


@patient_protocol.on_event("startup")
async def startup(ctx: Context):
    """Patient agent startup"""
    ctx.logger.info(f"Patient Agent started")
    ctx.logger.info(f"Agent address: {patient_agent.address}")
    ctx.logger.info("Ready to send medical consultations...")


@patient_protocol.on_interval(period=30.0)
async def send_medical_query(ctx: Context):
    """Send a medical query to the doctor agent every 30 seconds"""
    ctx.logger.info("Sending medical query to doctor...")
    
    query = MedicalQuery(
        patient_id="PAT-001",
        symptoms="fever and cough for 3 days, feeling very tired",
        medical_history="No significant medical history",
        urgency_level="normal"
    )
    
    await ctx.send(DOCTOR_AGENT_ADDRESS, query)
    ctx.logger.info(f"Medical query sent to doctor: {DOCTOR_AGENT_ADDRESS}")


@patient_protocol.on_message(model=MedicalAdvice)
async def handle_medical_advice(ctx: Context, sender: str, msg: MedicalAdvice):
    """Handle medical advice received from doctor"""
    ctx.logger.info(f"Received medical advice from {sender}")
    ctx.logger.info(f"Diagnosis: {msg.diagnosis}")
    ctx.logger.info(f"Urgency: {msg.urgency_assessment}")
    ctx.logger.info(f"Recommendations:")
    for i, rec in enumerate(msg.recommendations, 1):
        ctx.logger.info(f"  {i}. {rec}")
    
    # If follow-up required, request an appointment
    if msg.follow_up_required:
        ctx.logger.info("Follow-up required. Requesting appointment...")
        appointment_req = AppointmentRequest(
            patient_id=msg.patient_id,
            preferred_date="2025-10-25 10:00 AM",
            reason="Follow-up consultation"
        )
        await ctx.send(sender, appointment_req)


@patient_protocol.on_message(model=AppointmentConfirmation)
async def handle_appointment_confirmation(ctx: Context, sender: str, msg: AppointmentConfirmation):
    """Handle appointment confirmation from doctor"""
    ctx.logger.info(f"Appointment confirmed!")
    ctx.logger.info(f"Appointment ID: {msg.appointment_id}")
    ctx.logger.info(f"Scheduled: {msg.scheduled_date}")
    ctx.logger.info(f"Status: {msg.status}")


if __name__ == "__main__":
    # Include protocol and publish manifest to Almanac
    patient_agent.include(patient_protocol, publish_manifest=True)
    patient_agent.run()
