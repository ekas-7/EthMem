# ASI Doctor Agent - Architecture & Integration Guide

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     ASI Doctor Agent                         │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Mailbox    │◄────►│ Agent Core   │                    │
│  │   (Async)    │      │  (uAgents)   │                    │
│  └──────────────┘      └──────┬───────┘                    │
│                               │                              │
│         ┌─────────────────────┼─────────────────┐          │
│         ▼                     ▼                 ▼          │
│  ┌─────────────┐      ┌─────────────┐   ┌─────────────┐  │
│  │  Medical    │      │ Appointment │   │  Follow-up  │  │
│  │  Query      │      │  Scheduler  │   │  Manager    │  │
│  │  Handler    │      │             │   │             │  │
│  └─────────────┘      └─────────────┘   └─────────────┘  │
│         │                     │                 │          │
└─────────┼─────────────────────┼─────────────────┼──────────┘
          │                     │                 │
          ▼                     ▼                 ▼
   ┌─────────────────────────────────────────────────┐
   │            zkMem Blockchain Layer               │
   │                                                  │
   │  • Encrypted Medical Records                    │
   │  • Patient Identity (Ethereum Address)          │
   │  • Consultation History                         │
   │  • IPFS Storage for Large Data                  │
   └─────────────────────────────────────────────────┘
```

## Message Flow

### 1. Medical Consultation Flow

```
Patient Agent                Doctor Agent              zkMem Blockchain
     │                            │                           │
     │  1. MedicalQuery          │                           │
     ├──────────────────────────►│                           │
     │                            │                           │
     │                            │ 2. Analyze Symptoms       │
     │                            │    & Generate Advice      │
     │                            │                           │
     │  3. MedicalAdvice         │                           │
     │◄──────────────────────────┤                           │
     │                            │                           │
     │                            │ 4. Log Consultation       │
     │                            ├──────────────────────────►│
     │                            │                           │
     │                            │ 5. Store Encrypted Data   │
     │                            │◄──────────────────────────┤
```

### 2. Appointment Scheduling Flow

```
Patient Agent                Doctor Agent
     │                            │
     │  AppointmentRequest       │
     ├──────────────────────────►│
     │                            │
     │                            │ Check Availability
     │                            │ Generate Appointment ID
     │                            │
     │  AppointmentConfirmation  │
     │◄──────────────────────────┤
```

## Integration with zkMem

### Smart Contract Integration

The doctor agent can interact with zkMem smart contracts to store medical data:

```python
# Example integration code
from web3 import Web3
import json

class ZkMemIntegration:
    def __init__(self, contract_address, rpc_url, private_key):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.contract_address = contract_address
        self.account = self.w3.eth.account.from_key(private_key)
        
        # Load contract ABI
        with open('MemoryStorage.json', 'r') as f:
            contract_json = json.load(f)
            self.contract = self.w3.eth.contract(
                address=contract_address,
                abi=contract_json['abi']
            )
    
    def store_consultation(self, patient_address, consultation_data):
        """Store encrypted consultation data on blockchain"""
        
        # Encrypt data before storage
        encrypted_data = self.encrypt_medical_data(consultation_data)
        
        # Create transaction
        tx = self.contract.functions.storeMemory(
            patient_address,
            encrypted_data,
            "medical_consultation"
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        return self.w3.eth.wait_for_transaction_receipt(tx_hash)
    
    def encrypt_medical_data(self, data):
        """Encrypt medical data for privacy"""
        # Implement encryption (e.g., using patient's public key)
        # This is a placeholder - use proper encryption in production
        import json
        from base64 import b64encode
        return b64encode(json.dumps(data).encode()).decode()
    
    def retrieve_consultation_history(self, patient_address):
        """Retrieve patient's consultation history from blockchain"""
        return self.contract.functions.getMemoryHistory(
            patient_address
        ).call()
```

### Updated doctor_agent.py with zkMem Integration

```python
# Add to doctor_agent.py

from web3 import Web3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize zkMem integration
if os.getenv('ZKMEM_CONTRACT_ADDRESS'):
    zkmem = ZkMemIntegration(
        contract_address=os.getenv('ZKMEM_CONTRACT_ADDRESS'),
        rpc_url=os.getenv('ETHEREUM_RPC_URL'),
        private_key=os.getenv('PRIVATE_KEY')
    )
else:
    zkmem = None

def log_interaction(ctx: Context, query: MedicalQuery, advice: MedicalAdvice):
    """Enhanced logging with blockchain storage"""
    consultation_data = {
        "query": query.dict(),
        "advice": advice.dict(),
        "timestamp": str(ctx.timestamp),
        "agent_address": str(doctor_agent.address)
    }
    
    # Store locally
    ctx.storage.set(
        f"consultation_{query.patient_id}_{ctx.timestamp}",
        consultation_data
    )
    
    # Store on blockchain if configured
    if zkmem:
        try:
            receipt = zkmem.store_consultation(
                patient_address=query.patient_id,
                consultation_data=consultation_data
            )
            ctx.logger.info(f"Stored on blockchain: {receipt['transactionHash'].hex()}")
        except Exception as e:
            ctx.logger.error(f"Blockchain storage failed: {e}")
```

## Deployment Options

### 1. Local Development

Run agent locally for testing:

```bash
python doctor_agent.py
```

### 2. Fetch.ai Agentverse

Deploy to Agentverse for production:

1. Create account at https://agentverse.ai
2. Get mailbox key
3. Register agent
4. Deploy code

```bash
# Using Agentverse CLI (if available)
agentverse deploy --agent doctor_agent.py --name "Doctor Agent"
```

### 3. Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "doctor_agent.py"]
```

Build and run:

```bash
docker build -t asi-doctor-agent .
docker run -p 8001:8001 --env-file .env asi-doctor-agent
```

## Security Best Practices

### 1. Data Encryption

```python
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2

def encrypt_medical_record(data, patient_public_key):
    """Encrypt using patient's public key"""
    # Use asymmetric encryption for sensitive data
    # Implementation details depend on your crypto library
    pass

def decrypt_medical_record(encrypted_data, patient_private_key):
    """Decrypt using patient's private key"""
    pass
```

### 2. Access Control

```python
def verify_patient_identity(patient_id, signature):
    """Verify patient owns the Ethereum address"""
    # Implement signature verification
    pass

@doctor_agent.on_message(model=MedicalQuery)
async def handle_medical_query(ctx: Context, sender: str, msg: MedicalQuery):
    # Verify sender identity before processing
    if not verify_patient_identity(msg.patient_id, msg.signature):
        ctx.logger.warning(f"Unauthorized access attempt from {sender}")
        return
    
    # Process query...
```

### 3. Audit Logging

```python
def create_audit_log(action, patient_id, agent_id, details):
    """Create immutable audit log entry"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "action": action,
        "patient_id": patient_id,
        "agent_id": agent_id,
        "details": details,
        "hash": hash_entry(...)  # Create hash for integrity
    }
```

## Performance Optimization

### 1. Caching

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_medical_knowledge(symptom):
    """Cache medical knowledge lookups"""
    pass
```

### 2. Batch Processing

```python
@doctor_agent.on_interval(period=60.0)
async def process_batch_queries(ctx: Context):
    """Process multiple queries in batch"""
    pending_queries = ctx.storage.get("pending_queries", [])
    
    if pending_queries:
        # Process in batch
        for query in pending_queries:
            await process_query(ctx, query)
        
        ctx.storage.set("pending_queries", [])
```

### 3. Async Operations

```python
import asyncio

async def parallel_diagnosis(symptoms_list):
    """Run multiple diagnoses in parallel"""
    tasks = [
        analyze_symptoms_async(symptoms)
        for symptoms in symptoms_list
    ]
    return await asyncio.gather(*tasks)
```

## Monitoring & Observability

### Metrics to Track

1. **Performance**
   - Query response time
   - Throughput (queries/minute)
   - Error rate

2. **Medical**
   - Urgency distribution
   - Common symptoms
   - Follow-up rate

3. **System**
   - Agent uptime
   - Mailbox queue size
   - Blockchain transaction success rate

### Example Monitoring

```python
from prometheus_client import Counter, Histogram

query_counter = Counter('medical_queries_total', 'Total medical queries')
response_time = Histogram('query_response_seconds', 'Query response time')

@doctor_agent.on_message(model=MedicalQuery)
async def handle_medical_query(ctx: Context, sender: str, msg: MedicalQuery):
    query_counter.inc()
    
    with response_time.time():
        # Process query
        pass
```

## Future Enhancements

### 1. AI Model Integration

```python
# Integrate with medical AI models
from transformers import pipeline

medical_ai = pipeline("text-classification", model="medical-bert")

def ai_enhanced_diagnosis(symptoms):
    """Use AI model for diagnosis"""
    result = medical_ai(symptoms)
    return result
```

### 2. Multi-Agent Collaboration

```python
@doctor_agent.on_message(model=SpecialistConsultation)
async def consult_specialist(ctx: Context, sender: str, msg: SpecialistConsultation):
    """Collaborate with specialist agents"""
    specialist_address = get_specialist_address(msg.specialty)
    await ctx.send(specialist_address, msg)
```

### 3. Patient Portal Integration

```python
# Create API endpoint for patient portal
from fastapi import FastAPI

app = FastAPI()

@app.post("/api/consultation")
async def create_consultation(patient_id: str, symptoms: str):
    """HTTP endpoint for patient portal"""
    query = MedicalQuery(
        patient_id=patient_id,
        symptoms=symptoms
    )
    # Send to agent
    return await send_to_agent(query)
```

## Compliance Considerations

### HIPAA Compliance
- Encrypt all PHI (Protected Health Information)
- Implement access controls
- Maintain audit logs
- Ensure secure transmission

### GDPR Compliance
- Right to access
- Right to deletion
- Data minimization
- Privacy by design

## Testing Strategy

### Unit Tests
```python
import pytest

def test_analyze_symptoms():
    diagnosis = analyze_symptoms("fever and cough", "")
    assert "respiratory" in diagnosis.lower()

def test_assess_urgency():
    urgency = assess_urgency("chest pain", "normal")
    assert urgency == "emergency"
```

### Integration Tests
```python
@pytest.mark.asyncio
async def test_medical_query_flow():
    # Test full query flow
    pass
```

### Load Tests
```python
# Use locust or similar for load testing
from locust import User, task

class DoctorAgentUser(User):
    @task
    def send_medical_query(self):
        # Simulate medical query
        pass
```

## Support & Resources

- **Fetch.ai Documentation**: https://docs.fetch.ai
- **uAgents Framework**: https://github.com/fetchai/uAgents
- **zkMem Project**: https://github.com/ekas-7/zKMem
- **Agentverse**: https://agentverse.ai

---

For questions or contributions, please refer to the main zkMem repository.
