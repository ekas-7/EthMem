# ASI-Agents: Multi-Domain AI Agent Ecosystems# ASI-Agents: Memory-Enhanced Medical Consultation System



[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)A multi-agent healthcare platform that combines **AI-powered medical consultation** with **decentralized memory management** using Fetch.ai's uAgents framework and ASI (Artificial Superintelligence) API.

[![Python 3.13](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/)

[![Fetch.ai uAgents](https://img.shields.io/badge/Fetch.ai-uAgents-00D4FF)](https://fetch.ai)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![ASI API](https://img.shields.io/badge/ASI-API-purple)](https://asi1.ai)[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)

[![uAgents](https://img.shields.io/badge/uAgents-0.12.0+-green.svg)](https://fetch.ai/)

> **Three Complete Agent Ecosystems** - Medical, Legal & Customer Support - All Powered by ASI and Memory Integration

## 🌟 Features

<p align="center">

  <img src="https://img.shields.io/badge/Medical-🏥-green" alt="Medical"/>### Core Capabilities

  <img src="https://img.shields.io/badge/Legal-⚖️-blue" alt="Legal"/>

  <img src="https://img.shields.io/badge/Support-🎧-orange" alt="Support"/>- 🏥 **AI-Powered Medical Consultation**: Uses ASI API (`asi1-mini`) for intelligent symptom analysis

</p>- 🧠 **Memory-Enhanced Healthcare**: Integrates user memories (allergies, conditions, medications) for personalized care

- 📬 **Protocol-Based Communication**: Type-safe agent-to-agent messaging with Fetch.ai protocols

---- 📅 **Appointment Scheduling**: Automated appointment booking and confirmation

- ⚡ **Urgency Assessment**: Automatic triage based on symptoms

## 🌟 Overview- 💾 **Blockchain Integration**: Ready for zkMem on-chain memory storage

- 🔒 **Privacy-First**: Local storage with optional blockchain sync

Welcome to **ASI-Agents** - a comprehensive collection of three independent multi-agent systems, each designed for a specific domain but sharing the same powerful architecture:

### Agent System

- **🏥 Medical Consultation System** - AI-powered healthcare consultations with personalized medical memory

- **⚖️ Legal Consultation System** - Intelligent legal advice with case history integration1. **Doctor Agent** - Provides medical consultations with memory-aware diagnosis

- **🎧 Customer Support System** - Smart customer service with support ticket memory2. **Patient Agent** - Simulates patient interactions and appointment requests

3. **Memory Agent** - Manages user memories from browser extension storage

Each ecosystem is **completely independent** yet follows the **same architecture pattern**, making it easy to understand, extend, and deploy any or all of them.

---

---

## 📋 Table of Contents

## 📁 Project Structure

- [Quick Start](#-quick-start)

```- [Architecture](#-architecture)

ASI-agents/- [Agents Overview](#-agents-overview)

├── README.md                    # This file - Main overview- [Installation](#-installation)

├── requirements.txt             # Shared Python dependencies- [Usage](#-usage)

├── setup.sh                     # Setup script for all ecosystems- [Configuration](#%EF%B8%8F-configuration)

│- [API Reference](#-api-reference)

├── medical/                     # 🏥 Medical Consultation Ecosystem- [Examples](#-examples)

│   ├── doctor_agent.py          # AI doctor agent- [Contributing](#-contributing)

│   ├── patient_agent.py         # Patient simulation agent

│   ├── memory_agent.py          # Medical memory management---

│   ├── medical_system.py        # Bureau-managed system

│   ├── user_memories.json       # Medical memory storage## 🚀 Quick Start

│   ├── ARCHITECTURE.md          # Medical system architecture

│   └── README.md                # Medical system documentation```bash

│# Clone the repository

├── law/                         # ⚖️ Legal Consultation Ecosystemgit clone https://github.com/ekas-7/zKMem.git

│   ├── lawyer_agent.py          # AI lawyer agentcd zKMem/ASI-agents

│   ├── client_agent.py          # Client simulation agent

│   ├── case_memory_agent.py     # Legal memory management# Create virtual environment

│   ├── law_system.py            # Bureau-managed systempython3 -m venv venv

│   ├── case_memories.json       # Legal case memory storagesource venv/bin/activate  # On Windows: venv\Scripts\activate

│   ├── ARCHITECTURE.md          # Legal system architecture

│   └── README.md                # Legal system documentation# Install dependencies

│pip install -r requirements.txt

└── customer-support/            # 🎧 Customer Support Ecosystem

    ├── support_agent.py         # AI support agent# Configure environment

    ├── customer_agent.py        # Customer simulation agentcp .env.example .env

    ├── ticket_memory_agent.py   # Support memory management# Edit .env and add your ASI_ONE_API_KEY

    ├── support_system.py        # Bureau-managed system

    ├── customer_memories.json   # Customer memory storage# Run the complete system

    ├── ARCHITECTURE.md          # Support system architecturepython medical_system.py

    └── README.md                # Support system documentation```

```

---

---

## 🏗️ Architecture

## 🏗️ Shared Architecture

The system uses a **multi-agent architecture** with protocol-based communication:

All three ecosystems follow the **same proven architecture**:

```

```┌──────────────────┐      MemoryRequest      ┌──────────────────┐

┌─────────────────────────────────────────────────────────────┐│  Memory Agent    │◄─────────────────────────│  Doctor Agent    │

│                     ECOSYSTEM ARCHITECTURE                   ││  Port: 8002      │                          │  Port: 8000      │

├─────────────────────────────────────────────────────────────┤│                  │      MemoryResponse      │                  │

│                                                               ││  - User memories │──────────────────────────►│  - ASI-powered   │

│  ┌──────────────┐        ┌──────────────┐                   ││  - Categories    │                          │  - Memory-aware  │

│  │   Expert     │◄──────►│   Client     │                   ││  - Storage mgmt  │                          │  - Personalized  │

│  │   Agent      │        │   Agent      │                   │└──────────────────┘                          └─────────┬────────┘

│  │  (Doctor/    │        │  (Patient/   │                   │         ▲                                              │

│  │   Lawyer/    │        │   Client/    │                   │         │                                              │

│  │   Support)   │        │   Customer)  │                   │         │                                              ▼

│  └──────┬───────┘        └──────────────┘                   │         │                                    ┌──────────────────┐

│         │                                                     │         │                                    │  Patient Agent   │

│         │ Request                                            │         │                                    │  Port: 8001      │

│         │ Memories                                           │         │                                    │                  │

│         ▼                                                     │         └────────────────────────────────────│  - Send queries  │

│  ┌──────────────┐                                            │                                              │  - Get advice    │

│  │   Memory     │                                            │                                              │  - Appointments  │

│  │   Agent      │◄──── Browser Extension                    │                                              └──────────────────┘

│  │  (Medical/   │      (JSON Export)                        │                       │

│  │   Legal/     │                                            │                       ▼

│  │   Support)   │                                            │            ┌──────────────────┐

│  └──────────────┘                                            │            │ Browser Extension│

│         │                                                     │            │   (IndexedDB)    │

│         │ Enhanced                                           │            └──────────────────┘

│         │ Context                                            │                       │

│         ▼                                                     │                       ▼

│  ┌──────────────┐                                            │            ┌──────────────────┐

│  │   ASI API    │                                            │            │   Blockchain     │

│  │   (asi1.ai)  │                                            │            │  (Future: zkMem) │

│  │  AI Analysis │                                            │            └──────────────────┘

│  └──────────────┘                                            │```

│                                                               │

│  All agents managed by Fetch.ai Bureau                       │👉 See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

│  Protocol-based communication via Agentverse                 │

└─────────────────────────────────────────────────────────────┘---

```

## 🤖 Agents Overview

### Key Components (Same for All)

### 1. Doctor Agent (`doctor_agent.py`)

1. **Expert Agent** - Provides specialized advice (Medical/Legal/Support)

2. **Client Agent** - Simulates user interactions**Provides AI-powered medical consultations**

3. **Memory Agent** - Manages personalized user/case/customer history

4. **Bureau System** - Coordinates all agents in the ecosystem**Features:**

5. **ASI API Integration** - Powers intelligent analysis and responses- Analyzes symptoms using ASI API

6. **Protocol Communication** - Structured agent-to-agent messaging- Requests user memories for context

- Generates personalized recommendations

---- Handles appointment scheduling

- Emergency detection and triage

## 🚀 Quick Start

**Protocol:** `MedicalConsultationProtocol v1.0.0`

### Prerequisites

**Message Handlers:**

- Python 3.13+```python

- ASI API key from [asi1.ai](https://asi1.ai)@doctor_protocol.on_message(model=MedicalQuery, replies=MedicalAdvice)

- Internet connection for agent communication@doctor_protocol.on_message(model=AppointmentRequest, replies=AppointmentConfirmation)

```

### Installation

### 2. Patient Agent (`patient_agent.py`)

```bash

# Clone the repository**Simulates patient interactions**

git clone https://github.com/ekas-7/zKMem.git

cd zKMem/ASI-agents**Features:**

- Sends medical queries

# Run setup script (creates .env, installs dependencies)- Receives AI-powered advice

chmod +x setup.sh- Requests appointments

./setup.sh- Handles confirmations



# Or install manually**Protocol:** `PatientConsultationProtocol v1.0.0`

pip install -r requirements.txt

### 3. Memory Agent (`memory_agent.py`)

# Configure your ASI API key

echo "ASI_ONE_API_KEY=your_asi_api_key_here" > .env**Manages user memories from browser extension**

```

**Features:**

### Run Any Ecosystem- Reads from IndexedDB/JSON storage

- Categorizes memories (medical, personal, preferences)

Each ecosystem can run **completely independently**:- Serves memories to other agents via protocols

- Supports filtering by category

```bash

# 🏥 Medical System**Protocol:** `MemoryManagementProtocol v1.0.0`

cd medical

python medical_system.py**Memory Categories:**

- Medical: `allergy`, `medication`, `condition`

# ⚖️ Legal System- Personal: `name`, `age`, `location`, `occupation`

cd law- Preferences: `food`, `hobby`, `music`, `movie`

python law_system.py- Social: `family`, `friend`, `colleague`

- Skills: `skill`, `language`, `education`

# 🎧 Customer Support System

cd customer-support---

python support_system.py

```## 📦 Installation



---### Prerequisites



## 🏥 Medical Consultation System- Python 3.13 or higher

- pip package manager

**Purpose**: AI-powered medical consultations with personalized health memory integration.- ASI API key ([Get one here](https://asi1.ai))

- (Optional) Fetch.ai Agentverse account for mailbox

### Features

- 🩺 Symptom analysis and preliminary diagnosis### Step 1: Clone Repository

- 💊 Personalized recommendations based on medical history

- 🧬 Allergy and condition awareness```bash

- ⚠️ Urgency assessment and triagegit clone https://github.com/ekas-7/zKMem.git

- 📋 Medical memory integration from browser extensioncd zKMem/ASI-agents

```

### Example Use Case

```python### Step 2: Create Virtual Environment

# Patient reports symptoms

query = MedicalQuery(```bash

    patient_id="PAT-001",python3 -m venv venv

    symptoms="fever and cough for 3 days",source venv/bin/activate  # Linux/Mac

    urgency_level="normal"# OR

)venv\Scripts\activate     # Windows

```

# Doctor agent:

# 1. Requests medical memories (allergies, conditions)### Step 3: Install Dependencies

# 2. Enhances medical history

# 3. Uses ASI API for intelligent diagnosis```bash

# 4. Returns personalized medical advicepip install -r requirements.txt

``````



**[Full Documentation →](medical/README.md)**### Step 4: Configure Environment



---```bash

cp .env.example .env

## ⚖️ Legal Consultation System```



**Purpose**: Intelligent legal consultations with case history and jurisdiction awareness.Edit `.env` and add your credentials:



### Features```env

- 📜 Legal case analysis and preliminary assessment# ASI API Configuration

- ⚖️ Jurisdiction-specific guidanceASI_ONE_API_KEY=sk_your_asi_api_key_here

- 📚 Case history integration

- 🔍 Legal issue identification# Agent Configuration

- 📝 Next steps and recommendationsAGENT_NAME=doctor_agent

AGENT_SEED=doctor_agent_seed_phrase_zkMem_2024

### Example Use Case```

```python

# Client seeks legal advice---

query = LegalQuery(

    client_id="CLI-001",## 💻 Usage

    case_description="Employment termination without cause",

    case_type="civil",### Run Complete System (Recommended)

    urgency_level="normal"

)Run all agents in a single Bureau-managed process:



# Lawyer agent:```bash

# 1. Requests case memories (history, jurisdiction)python medical_system.py

# 2. Analyzes legal issues```

# 3. Uses ASI API for legal analysis

# 4. Provides actionable legal recommendations**Output:**

``````

======================================================================

**[Full Documentation →](law/README.md)**🏥 MEDICAL CONSULTATION SYSTEM WITH MEMORY INTEGRATION

======================================================================

---👨‍⚕️ Doctor Agent:  agent1qvrt...

👤 Patient Agent: agent1qt8p...

## 🎧 Customer Support System🧠 Memory Agent:  agent1qvk8...

======================================================================

**Purpose**: AI-powered customer support with ticket history and preference awareness.💾 Loaded 3 user memories:

   - [name] User's name is John Doe

### Features   - [allergy] User is allergic to peanuts

- 🎫 Intelligent ticket routing and analysis   - [condition] User has type 2 diabetes

- 👤 Customer history integration======================================================================

- 💡 Solution suggestions based on past issues

- ⏱️ Resolution time estimationINFO: [bureau]: Starting server on http://0.0.0.0:8000

- 📊 Priority assessmentINFO: [patient_agent]: 📤 Sending medical consultation request...

INFO: [doctor_agent]: 📨 Received medical query

### Example Use CaseINFO: [doctor_agent]: 🧠 Requesting user memories...

```pythonINFO: [doctor_agent]: 💾 Found 2 medical memories

# Customer submits support ticketINFO: [patient_agent]: 📋 MEDICAL ADVICE RECEIVED

ticket = SupportTicket(INFO: [patient_agent]: 🔍 Diagnosis: ...given your type 2 diabetes and peanut allergy...

    customer_id="CUST-001",```

    issue_description="Can't log into account",

    category="technical",### Run Individual Agents

    priority="normal"

)```bash

# Terminal 1: Doctor Agent

# Support agent:python doctor_agent.py

# 1. Requests customer memories (history, preferences)

# 2. Analyzes ticket with context# Terminal 2: Patient Agent  

# 3. Uses ASI API for solution generationpython patient_agent.py

# 4. Provides personalized support response

```# Terminal 3: Memory Agent

python memory_agent.py

**[Full Documentation →](customer-support/README.md)**```



---### Run Setup Script



## 🔑 Key Technologies```bash

chmod +x setup.sh

### Core Framework./setup.sh

- **Fetch.ai uAgents** (>=0.12.0) - Agent framework and protocol communication```

- **Python 3.13** - Primary programming language

- **Agentverse Mailbox** - Cloud-based agent messaging (no local ports needed!)---



### AI & APIs## ⚙️ Configuration

- **ASI API** (asi1.ai) - Artificial Superintelligence for intelligent analysis

- **asi1-mini model** - Fast, accurate responses for all domains### Environment Variables



### Data & Storage| Variable | Description | Required | Default |

- **JSON-based Memory** - Local-first storage with optional sync|----------|-------------|----------|---------|

- **Browser Extension** - Memory extraction from user interactions| `ASI_ONE_API_KEY` | ASI API key for AI inference | Yes | - |

- **Pydantic Models** - Type-safe message passing| `AGENT_NAME` | Agent identifier | No | `doctor_agent` |

| `AGENT_SEED` | Unique seed phrase for agent identity | No | Auto-generated |

---| `AGENT_MAILBOX_KEY` | Agentverse mailbox JWT token | No | - |

| `NETWORK` | Network type (`testnet` or `mainnet`) | No | `testnet` |

## 🎯 Common Features Across All Ecosystems

### Agent Ports

| Feature | Medical | Legal | Support |

|---------|---------|-------|---------|| Agent | Port | Endpoint |

| **AI-Powered Analysis** | ✅ Diagnosis | ✅ Legal Analysis | ✅ Solution Generation ||-------|------|----------|

| **Memory Integration** | ✅ Medical History | ✅ Case History | ✅ Ticket History || Doctor Agent | 8000 | `http://0.0.0.0:8000` |

| **Personalization** | ✅ Allergies, Conditions | ✅ Jurisdiction, Preferences | ✅ Purchase History, Preferences || Patient Agent | 8001 | `http://0.0.0.0:8001` |

| **Urgency Assessment** | ✅ Triage Levels | ✅ Case Priority | ✅ Ticket Priority || Memory Agent | 8002 | `http://0.0.0.0:8002` |

| **Recommendations** | ✅ Medical Advice | ✅ Legal Steps | ✅ Support Suggestions |

| **Protocol Communication** | ✅ uAgents | ✅ uAgents | ✅ uAgents |### Memory Storage

| **ASI API Integration** | ✅ | ✅ | ✅ |

| **Bureau Management** | ✅ | ✅ | ✅ |User memories are stored in `user_memories.json`:



---```json

{

## 🛠️ Development  "memories": [

    {

### Adding a New Ecosystem      "id": "mem_001",

      "entity": "peanuts",

Want to create a **Financial Advisor**, **Educational Tutor**, or **Real Estate** ecosystem? Follow this pattern:      "category": "allergy",

      "context": "User is allergic to peanuts",

1. **Create folder**: `ASI-agents/your-domain/`      "timestamp": 1729598600000,

2. **Create three agents**:      "status": "local",

   - Expert agent (advisor/tutor/agent)      "metadata": {

   - Client agent (user simulation)        "source": "chat",

   - Memory agent (domain-specific memory)        "confidence": 0.98

3. **Create system file**: Bureau-managed coordinator      }

4. **Copy architecture**: Use medical/legal/support as template    }

5. **Adapt domain logic**: Change prompts, categories, and models  ]

}

### Running Tests```



```bash---

# Test individual ecosystem

cd medical && python medical_system.py## 📚 API Reference

cd law && python law_system.py

cd customer-support && python support_system.py### Message Models

## 📚 API Reference

# Each should show:

# - Agent addresses### Message Models

# - Memory loading

# - Protocol registration#### MedicalQuery

# - Periodic interactions```python

```{

    "patient_id": str,

---    "symptoms": str,

    "medical_history": str,  # Optional, auto-enhanced with memories

## 📊 Performance & Scalability    "urgency_level": "low" | "normal" | "high" | "emergency"

}

- **Response Time**: ~2-5 seconds (ASI API latency)```

- **Memory Capacity**: Unlimited (JSON-based storage)

- **Concurrent Agents**: Limited by Bureau (recommended: 3-10 per Bureau)#### MedicalAdvice

- **Throughput**: ~10-20 requests/minute per ecosystem```python

- **Scalability**: Horizontal (multiple Bureau instances){

    "patient_id": str,

---    "diagnosis": str,           # AI-generated diagnosis

    "recommendations": List[str], # Personalized recommendations

## 🔒 Security & Privacy    "follow_up_required": bool,

    "urgency_assessment": str

### Data Protection}

- **Local-First**: Memories stored locally before optional sync```

- **Encryption Ready**: Structure supports encrypted storage

- **User Control**: Users own and control their data#### AppointmentRequest

- **No PHI/PII Storage**: Current version uses sample data only```python

{

### Important Disclaimers    "patient_id": str,

    "preferred_date": str,

**Medical System**:    "reason": str

⚠️ Provides **preliminary, educational information only**. NOT a substitute for professional medical advice.}

```

**Legal System**:

⚠️ Provides **general legal information only**. NOT a substitute for qualified legal counsel.#### AppointmentConfirmation

```python

**Support System**:{

⚠️ Provides **automated support**. Complex issues may require human escalation.    "patient_id": str,

    "appointment_id": str,      # Auto-generated ID

---    "scheduled_date": str,

    "status": "confirmed" | "pending" | "cancelled"

## 📝 Configuration}

```

### Environment Variables (.env)

#### MemoryRequest

```bash```python

# Required for all ecosystems{

ASI_ONE_API_KEY=your_asi_api_key_here    "user_id": str,

    "category": Optional[str],  # Filter: allergy, condition, medication, etc.

# Optional: Custom ports (defaults shown)    "limit": Optional[int]       # Max results, default: 10

MEDICAL_PORT=8000}

LAW_PORT=9000```

SUPPORT_PORT=10000

```#### MemoryResponse

```python

### Memory Files{

    "user_id": str,

Each ecosystem has its own memory file:    "memories": List[Dict],     # Array of UserMemory objects

- **Medical**: `user_memories.json` (allergies, conditions, medications)    "count": int

- **Legal**: `case_memories.json` (cases, jurisdiction, preferences)}

- **Support**: `customer_memories.json` (purchases, issues, preferences)```



Files are auto-created with sample data on first run.---



---## 📖 Examples



## 🤝 Contributing### Example 1: Medical Consultation with Allergies



We welcome contributions! Here's how:**Input (Patient):**

```python

1. **Fork the repository**query = MedicalQuery(

2. **Create a feature branch**    patient_id="PAT-001",

   ```bash    symptoms="fever and cough for 3 days, feeling very tired",

   git checkout -b feature/amazing-feature    medical_history="",

   ```    urgency_level="normal"

3. **Make your changes**)

   - Follow existing code patterns```

   - Add tests if applicable

   - Update documentation**Memory Agent provides:**

4. **Commit and push**```json

   ```bash{

   git commit -m "Add: amazing feature"  "memories": [

   git push origin feature/amazing-feature    {"category": "allergy", "entity": "peanuts"},

   ```    {"category": "condition", "entity": "type 2 diabetes"}

5. **Open a Pull Request**  ]

}

### Contribution Ideas```

- 🆕 New domain ecosystems (Education, Finance, Real Estate)

- 🧪 Unit tests and integration tests**Output (Doctor):**

- 📚 Enhanced documentation and tutorials```python

- 🎨 UI/Frontend for agent interactionadvice = MedicalAdvice(

- 🔧 Performance optimizations    patient_id="PAT-001",

- 🌐 Multi-language support    diagnosis="Based on your symptoms—fever, cough, and fatigue—especially given your type 2 diabetes and peanut allergy, consult a healthcare provider promptly...",

    recommendations=[

---        "Monitor blood glucose levels closely",

        "Avoid peanuts and known allergens",

## 📚 Documentation        "Stay hydrated with sugar-free fluids",

        "Contact provider if symptoms worsen"

- **[Medical System Architecture](medical/ARCHITECTURE.md)** - Detailed medical agent design    ],

- **[Legal System Architecture](law/ARCHITECTURE.md)** - Legal consultation architecture    follow_up_required=False,

- **[Support System Architecture](customer-support/ARCHITECTURE.md)** - Customer support design    urgency_assessment="normal"

- **[Fetch.ai uAgents Docs](https://docs.fetch.ai/uAgents)** - Official uAgents documentation)

- **[ASI API Docs](https://asi1.ai/docs)** - ASI API reference```



---### Example 2: Emergency Detection



## 🗺️ Roadmap**Input:**

```python

### Phase 1 (Current) ✅query = MedicalQuery(

- Three complete ecosystems (Medical, Legal, Support)    patient_id="PAT-002",

- ASI API integration    symptoms="severe chest pain and difficulty breathing",

- Memory management    urgency_level="normal"  # User may not recognize urgency

- Protocol-based communication)

```

### Phase 2 (Q1 2025)

- Frontend dashboards for each ecosystem**Output:**

- Real-time agent monitoring```python

- Enhanced memory sync with blockchainadvice = MedicalAdvice(

- Multi-user support    patient_id="PAT-002",

    diagnosis="URGENT: Possible cardiac issue requiring immediate attention",

### Phase 3 (Q2 2025)    recommendations=[

- New ecosystems (Financial, Educational, Real Estate)        "CALL EMERGENCY SERVICES IMMEDIATELY",

- Voice interface integration        "Do not drive yourself",

- Mobile apps        "Avoid physical exertion",

- Enterprise deployment tools        "Seek emergency medical care"

    ],

### Phase 4 (Future)    follow_up_required=True,

- zkMem blockchain full integration    urgency_assessment="emergency"  # Auto-upgraded

- Decentralized agent marketplace)

- Cross-ecosystem agent collaboration```

- Advanced analytics and reporting

### Example 3: Memory Query

---

```python

## 📞 Support & Community# Request all medical memories

request = MemoryRequest(

- 📧 **Email**: support@zkmem.dev    user_id="user_001",

- 💬 **Discord**: [Join our community](https://discord.gg/zkmem)    category="allergy",

- 🐛 **Issues**: [GitHub Issues](https://github.com/ekas-7/zKMem/issues)    limit=5

- 📖 **Docs**: [Full Documentation](https://docs.zkmem.dev))

- 🐦 **Twitter**: [@zkMem](https://twitter.com/zkmem)

# Response

---response = MemoryResponse(

    user_id="user_001",

## 📄 License    memories=[

        {

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.            "id": "mem_003",

            "entity": "peanuts",

---            "category": "allergy",

            "context": "User is allergic to peanuts",

## 🙏 Acknowledgments            "timestamp": 1729598600000,

            "status": "local",

- **Fetch.ai** - uAgents framework and Agentverse platform            "metadata": {"source": "chat", "confidence": 0.98}

- **ASI.ai** - Artificial Superintelligence API        }

- **zkMem Team** - Decentralized memory vision and browser extension    ],

- **Contributors** - Everyone who has helped build and improve this project!    count=1

)

---```



## 🌟 Star the Project!---



If you find this project useful, please consider giving it a ⭐ on GitHub!## 🧪 Testing



---### Run Tests



**Built with ❤️ using Fetch.ai uAgents and ASI API**```bash

# Run all tests

*Empowering intelligent agent ecosystems across Medical, Legal, and Customer Support domains*pytest



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
