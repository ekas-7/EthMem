# ASI-Agents: Memory-Enhanced Medical Consultation System

A multi-agent healthcare platform that combines **AI-powered medical consultation** with **decentralized memory management** using Fetch.ai's uAgents framework and ASI (Artificial Superintelligence) API.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![uAgents](https://img.shields.io/badge/uAgents-0.12.0+-green.svg)](https://fetch.ai/)

## 🌟 Features

### Core Capabilities

- 🏥 **AI-Powered Medical Consultation**: Uses ASI API (`asi1-mini`) for intelligent symptom analysis
- 🧠 **Memory-Enhanced Healthcare**: Integrates user memories (allergies, conditions, medications) for personalized care
- 📬 **Protocol-Based Communication**: Type-safe agent-to-agent messaging with Fetch.ai protocols
- 📅 **Appointment Scheduling**: Automated appointment booking and confirmation
- ⚡ **Urgency Assessment**: Automatic triage based on symptoms
- 💾 **Blockchain Integration**: Ready for zkMem on-chain memory storage
- 🔒 **Privacy-First**: Local storage with optional blockchain sync

### Agent System

1. **Doctor Agent** - Provides medical consultations with memory-aware diagnosis
2. **Patient Agent** - Simulates patient interactions and appointment requests
3. **Memory Agent** - Manages user memories from browser extension storage

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Agents Overview](#-agents-overview)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#%EF%B8%8F-configuration)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ekas-7/zKMem.git
cd zKMem/ASI-agents

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your ASI_ONE_API_KEY

# Run the complete system
python medical_system.py
```

---

## 🏗️ Architecture

The system uses a **multi-agent architecture** with protocol-based communication:

```
┌──────────────────┐      MemoryRequest      ┌──────────────────┐
│  Memory Agent    │◄─────────────────────────│  Doctor Agent    │
│  Port: 8002      │                          │  Port: 8000      │
│                  │      MemoryResponse      │                  │
│  - User memories │──────────────────────────►│  - ASI-powered   │
│  - Categories    │                          │  - Memory-aware  │
│  - Storage mgmt  │                          │  - Personalized  │
└──────────────────┘                          └─────────┬────────┘
         ▲                                              │
         │                                              │
         │                                              ▼
         │                                    ┌──────────────────┐
         │                                    │  Patient Agent   │
         │                                    │  Port: 8001      │
         │                                    │                  │
         └────────────────────────────────────│  - Send queries  │
                                              │  - Get advice    │
                                              │  - Appointments  │
                                              └──────────────────┘
                       │
                       ▼
            ┌──────────────────┐
            │ Browser Extension│
            │   (IndexedDB)    │
            └──────────────────┘
                       │
                       ▼
            ┌──────────────────┐
            │   Blockchain     │
            │  (Future: zkMem) │
            └──────────────────┘
```

👉 See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

---

## 🤖 Agents Overview

### 1. Doctor Agent (`doctor_agent.py`)

**Provides AI-powered medical consultations**

**Features:**
- Analyzes symptoms using ASI API
- Requests user memories for context
- Generates personalized recommendations
- Handles appointment scheduling
- Emergency detection and triage

**Protocol:** `MedicalConsultationProtocol v1.0.0`

**Message Handlers:**
```python
@doctor_protocol.on_message(model=MedicalQuery, replies=MedicalAdvice)
@doctor_protocol.on_message(model=AppointmentRequest, replies=AppointmentConfirmation)
```

### 2. Patient Agent (`patient_agent.py`)

**Simulates patient interactions**

**Features:**
- Sends medical queries
- Receives AI-powered advice
- Requests appointments
- Handles confirmations

**Protocol:** `PatientConsultationProtocol v1.0.0`

### 3. Memory Agent (`memory_agent.py`)

**Manages user memories from browser extension**

**Features:**
- Reads from IndexedDB/JSON storage
- Categorizes memories (medical, personal, preferences)
- Serves memories to other agents via protocols
- Supports filtering by category

**Protocol:** `MemoryManagementProtocol v1.0.0`

**Memory Categories:**
- Medical: `allergy`, `medication`, `condition`
- Personal: `name`, `age`, `location`, `occupation`
- Preferences: `food`, `hobby`, `music`, `movie`
- Social: `family`, `friend`, `colleague`
- Skills: `skill`, `language`, `education`

---

## 📦 Installation

### Prerequisites

- Python 3.13 or higher
- pip package manager
- ASI API key ([Get one here](https://asi1.ai))
- (Optional) Fetch.ai Agentverse account for mailbox

### Step 1: Clone Repository

```bash
git clone https://github.com/ekas-7/zKMem.git
cd zKMem/ASI-agents
```

### Step 2: Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# ASI API Configuration
ASI_ONE_API_KEY=sk_your_asi_api_key_here

# Agent Configuration
AGENT_NAME=doctor_agent
AGENT_SEED=doctor_agent_seed_phrase_zkMem_2024
```

---

## 💻 Usage

### Run Complete System (Recommended)

Run all agents in a single Bureau-managed process:

```bash
python medical_system.py
```

**Output:**
```
======================================================================
🏥 MEDICAL CONSULTATION SYSTEM WITH MEMORY INTEGRATION
======================================================================
👨‍⚕️ Doctor Agent:  agent1qvrt...
👤 Patient Agent: agent1qt8p...
🧠 Memory Agent:  agent1qvk8...
======================================================================
💾 Loaded 3 user memories:
   - [name] User's name is John Doe
   - [allergy] User is allergic to peanuts
   - [condition] User has type 2 diabetes
======================================================================

INFO: [bureau]: Starting server on http://0.0.0.0:8000
INFO: [patient_agent]: 📤 Sending medical consultation request...
INFO: [doctor_agent]: 📨 Received medical query
INFO: [doctor_agent]: 🧠 Requesting user memories...
INFO: [doctor_agent]: 💾 Found 2 medical memories
INFO: [patient_agent]: 📋 MEDICAL ADVICE RECEIVED
INFO: [patient_agent]: 🔍 Diagnosis: ...given your type 2 diabetes and peanut allergy...
```

### Run Individual Agents

```bash
# Terminal 1: Doctor Agent
python doctor_agent.py

# Terminal 2: Patient Agent  
python patient_agent.py

# Terminal 3: Memory Agent
python memory_agent.py
```

### Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ASI_ONE_API_KEY` | ASI API key for AI inference | Yes | - |
| `AGENT_NAME` | Agent identifier | No | `doctor_agent` |
| `AGENT_SEED` | Unique seed phrase for agent identity | No | Auto-generated |
| `AGENT_MAILBOX_KEY` | Agentverse mailbox JWT token | No | - |
| `NETWORK` | Network type (`testnet` or `mainnet`) | No | `testnet` |

### Agent Ports

| Agent | Port | Endpoint |
|-------|------|----------|
| Doctor Agent | 8000 | `http://0.0.0.0:8000` |
| Patient Agent | 8001 | `http://0.0.0.0:8001` |
| Memory Agent | 8002 | `http://0.0.0.0:8002` |

### Memory Storage

User memories are stored in `user_memories.json`:

```json
{
  "memories": [
    {
      "id": "mem_001",
      "entity": "peanuts",
      "category": "allergy",
      "context": "User is allergic to peanuts",
      "timestamp": 1729598600000,
      "status": "local",
      "metadata": {
        "source": "chat",
        "confidence": 0.98
      }
    }
  ]
}
```

---

## 📚 API Reference

### Message Models
## 📚 API Reference

### Message Models

#### MedicalQuery
```python
{
    "patient_id": str,
    "symptoms": str,
    "medical_history": str,  # Optional, auto-enhanced with memories
    "urgency_level": "low" | "normal" | "high" | "emergency"
}
```

#### MedicalAdvice
```python
{
    "patient_id": str,
    "diagnosis": str,           # AI-generated diagnosis
    "recommendations": List[str], # Personalized recommendations
    "follow_up_required": bool,
    "urgency_assessment": str
}
```

#### AppointmentRequest
```python
{
    "patient_id": str,
    "preferred_date": str,
    "reason": str
}
```

#### AppointmentConfirmation
```python
{
    "patient_id": str,
    "appointment_id": str,      # Auto-generated ID
    "scheduled_date": str,
    "status": "confirmed" | "pending" | "cancelled"
}
```

#### MemoryRequest
```python
{
    "user_id": str,
    "category": Optional[str],  # Filter: allergy, condition, medication, etc.
    "limit": Optional[int]       # Max results, default: 10
}
```

#### MemoryResponse
```python
{
    "user_id": str,
    "memories": List[Dict],     # Array of UserMemory objects
    "count": int
}
```

---

## 📖 Examples

### Example 1: Medical Consultation with Allergies

**Input (Patient):**
```python
query = MedicalQuery(
    patient_id="PAT-001",
    symptoms="fever and cough for 3 days, feeling very tired",
    medical_history="",
    urgency_level="normal"
)
```

**Memory Agent provides:**
```json
{
  "memories": [
    {"category": "allergy", "entity": "peanuts"},
    {"category": "condition", "entity": "type 2 diabetes"}
  ]
}
```

**Output (Doctor):**
```python
advice = MedicalAdvice(
    patient_id="PAT-001",
    diagnosis="Based on your symptoms—fever, cough, and fatigue—especially given your type 2 diabetes and peanut allergy, consult a healthcare provider promptly...",
    recommendations=[
        "Monitor blood glucose levels closely",
        "Avoid peanuts and known allergens",
        "Stay hydrated with sugar-free fluids",
        "Contact provider if symptoms worsen"
    ],
    follow_up_required=False,
    urgency_assessment="normal"
)
```

### Example 2: Emergency Detection

**Input:**
```python
query = MedicalQuery(
    patient_id="PAT-002",
    symptoms="severe chest pain and difficulty breathing",
    urgency_level="normal"  # User may not recognize urgency
)
```

**Output:**
```python
advice = MedicalAdvice(
    patient_id="PAT-002",
    diagnosis="URGENT: Possible cardiac issue requiring immediate attention",
    recommendations=[
        "CALL EMERGENCY SERVICES IMMEDIATELY",
        "Do not drive yourself",
        "Avoid physical exertion",
        "Seek emergency medical care"
    ],
    follow_up_required=True,
    urgency_assessment="emergency"  # Auto-upgraded
)
```

### Example 3: Memory Query

```python
# Request all medical memories
request = MemoryRequest(
    user_id="user_001",
    category="allergy",
    limit=5
)

# Response
response = MemoryResponse(
    user_id="user_001",
    memories=[
        {
            "id": "mem_003",
            "entity": "peanuts",
            "category": "allergy",
            "context": "User is allergic to peanuts",
            "timestamp": 1729598600000,
            "status": "local",
            "metadata": {"source": "chat", "confidence": 0.98}
        }
    ],
    count=1
)
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_doctor_agent.py

# Run with coverage
pytest --cov=. --cov-report=html
```

### Manual Testing

```bash
# Test individual agent
python doctor_agent.py

# Send test query (in another terminal)
python -c "
from uagents import Agent, Context
from medical_system import MedicalQuery

# Create test query
query = MedicalQuery(
    patient_id='TEST-001',
    symptoms='headache and fever',
    urgency_level='normal'
)
# Send to doctor agent address
"
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `[Errno 48] address already in use`

**Solution:**
```bash
# Find process using port
lsof -i:8000

# Kill process
kill -9 <PID>

# Or change port in code
bureau = Bureau(endpoint=["http://127.0.0.1:8003/submit"])
```

#### 2. ASI API Errors

**Error:** `ASI API error: 401 Unauthorized`

**Solution:**
- Check your `ASI_ONE_API_KEY` in `.env`
- Verify API key is active at https://asi1.ai
- Fallback logic will use rule-based analysis

#### 3. Memory Storage Not Found

**Error:** `No such file or directory: user_memories.json`

**Solution:**
- File is auto-created on first run
- Check file permissions
- Manually create from template in ARCHITECTURE.md

#### 4. Almanac Registration Warnings

**Warning:** `I do not have enough funds to register on Almanac contract`

**Solution:**
- This is informational only
- Agents work without Almanac registration
- For production, get testnet funds from Fetch.ai faucet

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/zKMem.git
cd zKMem/ASI-agents

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
pytest

# Commit and push
git add .
git commit -m "Add: your feature"
git push origin feature/your-feature

# Open Pull Request
```

### Code Style

- Follow PEP 8
- Use type hints
- Add docstrings for functions
- Write tests for new features

---

## 📝 Project Structure

```
ASI-agents/
├── doctor_agent.py          # Main doctor agent
├── patient_agent.py         # Patient simulation agent
├── memory_agent.py          # Memory management agent
├── medical_system.py        # Bureau-based system (all agents)
├── user_memories.json       # Memory storage (auto-generated)
├── requirements.txt         # Python dependencies
├── .env.example            # Environment template
├── .env                    # Your config (gitignored)
├── setup.sh                # Setup script
├── README.md               # This file
└── ARCHITECTURE.md         # Detailed architecture docs
```

---

## 🔒 Security & Privacy

### Data Protection

- **Local-First**: Memories stored locally before optional sync
- **Encryption Ready**: Structure supports encrypted storage
- **User Control**: Users own and control their data
- **No PHI Storage**: Current version uses sample data only

### Medical Disclaimer

⚠️ **IMPORTANT**: This system provides **preliminary, educational information only**. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions regarding medical conditions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Fetch.ai** - uAgents framework and Agentverse platform
- **ASI.ai** - ASI API for intelligent medical analysis
- **zkMem Team** - Decentralized memory storage vision
- **Contributors** - Everyone who helped build this!

---

## 📞 Support

- 📧 Email: support@zkmem.dev
- 💬 Discord: [Join our community](https://discord.gg/zkmem)
- 🐛 Issues: [GitHub Issues](https://github.com/ekas-7/zKMem/issues)
- 📚 Docs: [Full Documentation](https://docs.zkmem.dev)

---

## 🗺️ Roadmap

### v1.0 (Current)
- ✅ Multi-agent system with protocols
- ✅ ASI API integration
- ✅ Memory management
- ✅ Medical consultations

### v1.1 (Planned)
- [ ] Multi-user support
- [ ] Enhanced memory sync with extension
- [ ] Prescription management
- [ ] Analytics dashboard

### v2.0 (Future)
- [ ] Specialist agents (cardiology, dermatology, etc.)
- [ ] zkMem blockchain integration
- [ ] Mobile app
- [ ] Voice interface
- [ ] EHR integration

---

## 📊 Stats

- **Agents**: 3 (Doctor, Patient, Memory)
- **Protocols**: 3 (Medical, Patient, Memory)
- **Memory Categories**: 15+
- **Message Models**: 6
- **Lines of Code**: ~1500+

---

**Built with ❤️ using Fetch.ai uAgents and ASI API**

*Empowering personalized healthcare through AI and decentralized memory*

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
