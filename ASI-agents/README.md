# ASI Doctor Agent

An ASI (Artificial Superintelligence Infrastructure) based medical consultation agent built using Fetch.ai's uAgents framework with mailbox functionality enabled for asynchronous communication.

## Features

- 🏥 **Medical Consultation**: Provides initial symptom assessment and medical advice
- 📬 **Mailbox Enabled**: Asynchronous messaging for reliable communication
- 📅 **Appointment Scheduling**: Handles appointment requests and confirmations
- ⚡ **Urgency Assessment**: Automatically evaluates urgency levels of medical queries
- 🔄 **Follow-up Management**: Periodic checks for required patient follow-ups
- 💾 **Interaction Logging**: Stores consultation records (can integrate with zkMem blockchain)

## Architecture

The doctor agent uses Fetch.ai's uAgents framework to create an autonomous agent that:

1. Listens for incoming medical queries via mailbox
2. Processes symptoms and medical history
3. Generates diagnoses and recommendations
4. Assesses urgency levels
5. Schedules appointments
6. Logs interactions for memory/blockchain storage

## Message Models

### MedicalQuery
```python
{
    "patient_id": str,
    "symptoms": str,
    "medical_history": str (optional),
    "urgency_level": str (low/normal/high/emergency)
}
```

### MedicalAdvice
```python
{
    "patient_id": str,
    "diagnosis": str,
    "recommendations": list[str],
    "follow_up_required": bool,
    "urgency_assessment": str
}
```

### AppointmentRequest
```python
{
    "patient_id": str,
    "preferred_date": str,
    "reason": str
}
```

## Installation

1. Install Python 3.9 or higher

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

The agent is configured with the following defaults:
- **Name**: doctor_agent
- **Port**: 8001
- **Endpoint**: http://localhost:8001/submit
- **Mailbox**: Enabled (true)

You can modify these in `doctor_agent.py`.

## Running the Agent

Start the doctor agent:

```bash
python doctor_agent.py
```

You should see output like:
```
Doctor Agent started
Agent address: agent1q...
Mailbox enabled: True
Ready to receive medical consultations...
```

## Usage Examples

### Sending a Medical Query

```python
from uagents import Agent, Context, Model
from doctor_agent import MedicalQuery

# Create a patient agent
patient = Agent(name="patient", mailbox=True)

@patient.on_interval(period=10.0)
async def send_query(ctx: Context):
    query = MedicalQuery(
        patient_id="patient_001",
        symptoms="fever and cough for 3 days",
        medical_history="no known allergies",
        urgency_level="normal"
    )
    
    # Send to doctor agent address
    await ctx.send("agent1q...", query)

patient.run()
```

### Requesting an Appointment

```python
from doctor_agent import AppointmentRequest

appointment = AppointmentRequest(
    patient_id="patient_001",
    preferred_date="2024-10-25 14:00",
    reason="Follow-up consultation"
)

await ctx.send("doctor_agent_address", appointment)
```

## Integration with zkMem

The agent is designed to integrate with the zkMem ecosystem:

1. **Memory Storage**: Consultation logs can be stored in the zkMem smart contract
2. **Identity Verification**: Patient IDs can be linked to Ethereum addresses
3. **Privacy**: Medical data can be encrypted before blockchain storage
4. **Portability**: Medical history can follow patients across different healthcare providers

### Example Integration

```python
# In log_interaction function
def log_interaction(ctx: Context, query: MedicalQuery, advice: MedicalAdvice):
    # Encrypt medical data
    encrypted_data = encrypt_medical_data({
        "query": query.dict(),
        "advice": advice.dict()
    })
    
    # Store to zkMem blockchain via smart contract
    await store_to_blockchain(
        patient_address=query.patient_id,
        encrypted_memory=encrypted_data,
        memory_type="medical_consultation"
    )
```

## Agent Communication Flow

```
Patient Agent → (MedicalQuery) → Doctor Agent
                                       ↓
                                 Analyze Symptoms
                                       ↓
                                 Generate Advice
                                       ↓
Doctor Agent → (MedicalAdvice) → Patient Agent
                                       ↓
                              Log to zkMem Blockchain
```

## Security Considerations

⚠️ **Important**: This is a demonstration agent. For production medical applications:

1. Implement proper medical AI models or knowledge bases
2. Add authentication and authorization
3. Encrypt all medical data
4. Comply with HIPAA, GDPR, and other healthcare regulations
5. Add medical professional oversight
6. Implement audit trails
7. Use secure communication channels

## Development

### Adding New Features

To extend the doctor agent:

1. Define new message models in the agent file
2. Add message handlers with `@doctor_agent.on_message(model=YourModel)`
3. Implement business logic in helper functions
4. Update the README with new features

### Testing

```bash
# Run agent in verbose mode
python doctor_agent.py --verbose

# Test with mock queries
python test_doctor_agent.py
```

## License

Part of the zkMem project - see main repository for license details.

## Contributing

Contributions are welcome! Please ensure:
- Medical logic is clearly documented
- Security best practices are followed
- Code follows the project style guide

## Disclaimer

This agent is for demonstration purposes only and should not be used for actual medical advice. Always consult qualified healthcare professionals for medical concerns.
