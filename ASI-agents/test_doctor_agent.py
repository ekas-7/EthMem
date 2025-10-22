"""
Test script for Doctor Agent
Run this to test the doctor agent's functionality
"""

from uagents import Agent, Context
from doctor_agent import (
    MedicalQuery, 
    MedicalAdvice, 
    AppointmentRequest,
    analyze_symptoms,
    assess_urgency
)


# Create a test patient agent
test_patient = Agent(
    name="test_patient",
    seed="test_patient_seed_123",
    port=8002,
    mailbox=True
)


@test_patient.on_event("startup")
async def setup(ctx: Context):
    """Initialize test patient"""
    ctx.logger.info("Test Patient Agent started")
    ctx.logger.info(f"Patient address: {test_patient.address}")


@test_patient.on_interval(period=15.0)
async def send_test_query(ctx: Context):
    """Send a test medical query to the doctor agent"""
    
    # Replace with your doctor agent's address
    doctor_address = "agent1q..."  # Update this!
    
    # Test query 1: Common cold symptoms
    query1 = MedicalQuery(
        patient_id="test_patient_001",
        symptoms="fever, cough, and sore throat for 2 days",
        medical_history="no known allergies",
        urgency_level="normal"
    )
    
    ctx.logger.info(f"Sending test query to doctor agent...")
    await ctx.send(doctor_address, query1)


@test_patient.on_interval(period=30.0)
async def send_appointment_request(ctx: Context):
    """Send a test appointment request"""
    
    doctor_address = "agent1q..."  # Update this!
    
    appointment = AppointmentRequest(
        patient_id="test_patient_001",
        preferred_date="2024-10-25 14:00",
        reason="Follow-up consultation for persistent cough"
    )
    
    ctx.logger.info("Sending appointment request...")
    await ctx.send(doctor_address, appointment)


@test_patient.on_message(model=MedicalAdvice)
async def handle_advice(ctx: Context, sender: str, msg: MedicalAdvice):
    """Receive and display medical advice from doctor"""
    ctx.logger.info("=" * 60)
    ctx.logger.info("RECEIVED MEDICAL ADVICE")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Patient ID: {msg.patient_id}")
    ctx.logger.info(f"Diagnosis: {msg.diagnosis}")
    ctx.logger.info(f"Urgency: {msg.urgency_assessment}")
    ctx.logger.info(f"Follow-up Required: {msg.follow_up_required}")
    ctx.logger.info("\nRecommendations:")
    for i, rec in enumerate(msg.recommendations, 1):
        ctx.logger.info(f"  {i}. {rec}")
    ctx.logger.info("=" * 60)


def test_helper_functions():
    """Test the helper functions directly"""
    print("\n" + "=" * 60)
    print("TESTING HELPER FUNCTIONS")
    print("=" * 60)
    
    # Test 1: Respiratory symptoms
    print("\nTest 1: Respiratory Symptoms")
    symptoms1 = "fever and cough for 3 days"
    diagnosis1 = analyze_symptoms(symptoms1, "")
    urgency1 = assess_urgency(symptoms1, "normal")
    print(f"Symptoms: {symptoms1}")
    print(f"Diagnosis: {diagnosis1}")
    print(f"Urgency: {urgency1}")
    
    # Test 2: Cardiac symptoms (emergency)
    print("\nTest 2: Cardiac Symptoms (Emergency)")
    symptoms2 = "severe chest pain and difficulty breathing"
    diagnosis2 = analyze_symptoms(symptoms2, "")
    urgency2 = assess_urgency(symptoms2, "normal")
    print(f"Symptoms: {symptoms2}")
    print(f"Diagnosis: {diagnosis2}")
    print(f"Urgency: {urgency2}")
    
    # Test 3: Headache symptoms
    print("\nTest 3: Headache Symptoms")
    symptoms3 = "headache and fatigue"
    diagnosis3 = analyze_symptoms(symptoms3, "")
    urgency3 = assess_urgency(symptoms3, "low")
    print(f"Symptoms: {symptoms3}")
    print(f"Diagnosis: {diagnosis3}")
    print(f"Urgency: {urgency3}")
    
    print("=" * 60)


if __name__ == "__main__":
    import sys
    
    # Test helper functions first
    test_helper_functions()
    
    # Check if we should run the agent
    if len(sys.argv) > 1 and sys.argv[1] == "--run-agent":
        print("\nStarting test patient agent...")
        print("Make sure to update the doctor_address in the code!")
        test_patient.run()
    else:
        print("\nTo run the test patient agent and send actual messages:")
        print("1. Update the doctor_address in this file with your doctor agent's address")
        print("2. Run: python test_doctor_agent.py --run-agent")
