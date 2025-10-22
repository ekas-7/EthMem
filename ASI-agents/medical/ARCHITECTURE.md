# ASI-Agents Architecture

## Overview

The ASI-Agents system is a **multi-agent healthcare platform** that combines AI-powered medical consultation with decentralized memory management. The system uses the **Fetch.ai uAgents framework** for agent-to-agent communication and integrates with **ASI (Artificial Superintelligence) API** for intelligent medical analysis.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Agent Design](#agent-design)
3. [Protocol Communication](#protocol-communication)
4. [Memory Management](#memory-management)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Security & Privacy](#security--privacy)
8. [Integration Points](#integration-points)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ETHMem Ecosystem                                │
│                                                                     │
│  ┌──────────────────┐                    ┌──────────────────┐     │
│  │  Browser         │                    │  Ethereum        │     │
│  │  Extension       │────────────────────│  Blockchain      │     │
│  │  (IndexedDB)     │   Store On-Chain   │  (MemoryStorage) │     │
│  └────────┬─────────┘                    └──────────────────┘     │
│           │                                                         │
│           │ Read Memories                                          │
│           ▼                                                         │
│  ┌──────────────────────────────────────────────────────┐         │
│  │            ASI-Agents Bureau System                   │         │
│  │                                                       │         │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │         │
│  │  │   Memory     │  │   Doctor     │  │  Patient   │ │         │
│  │  │   Agent      │  │   Agent      │  │  Agent     │ │         │
│  │  │              │  │              │  │            │ │         │
│  │  │ Port: 8002   │  │ Port: 8000   │  │ Port: 8001 │ │         │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │         │
│  │         │                 │                 │         │         │
│  │         └─────────────────┼─────────────────┘         │         │
│  │                           │                           │         │
│  │                    Protocol Bus                       │         │
│  │                  (Message Exchange)                   │         │
│  └───────────────────────────┼───────────────────────────┘         │
│                              │                                     │
│                              ▼                                     │
│                    ┌──────────────────┐                           │
│                    │  Agentverse      │                           │
│                    │  (Fetch.ai)      │                           │
│                    │  - Mailbox       │                           │
│                    │  - Almanac       │                           │
│                    └──────────────────┘                           │
│                                                                     │
│                              ▼                                     │
│                    ┌──────────────────┐                           │
│                    │   ASI API        │                           │
│                    │   (asi1-mini)    │                           │
│                    │  - Diagnosis     │                           │
│                    │  - Recommendations│                          │
│                    └──────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Agent Design

### 1. Doctor Agent (`doctor_agent.py`)

**Purpose**: Provides AI-powered medical consultations using patient symptoms and memory-enhanced medical history.

**Responsibilities**:
- Receive medical queries from patients
- Request user memories from Memory Agent
- Analyze symptoms using ASI API
- Generate personalized recommendations
- Handle appointment scheduling
- Log consultations for blockchain storage

**Protocol**: `MedicalConsultationProtocol v1.0.0`

**Message Handlers**:
```python
@doctor_protocol.on_message(model=MedicalQuery, replies=MedicalAdvice)
async def handle_medical_query(ctx, sender, msg)

@doctor_protocol.on_message(model=AppointmentRequest, replies=AppointmentConfirmation)
async def handle_appointment(ctx, sender, msg)
```

**Key Features**:
- Memory-aware diagnosis
- Allergy and condition checking
- Emergency detection
- ASI API integration with fallback logic

---

### 2. Patient Agent (`patient_agent.py`)

**Purpose**: Simulates patient interactions and demonstrates the consultation workflow.

**Responsibilities**:
- Send medical queries to Doctor Agent
- Receive and display medical advice
- Request appointments when follow-up is needed
- Handle appointment confirmations

**Protocol**: `PatientConsultationProtocol v1.0.0`

**Message Handlers**:
```python
@patient_protocol.on_message(model=MedicalAdvice)
async def handle_advice(ctx, sender, msg)

@patient_protocol.on_message(model=AppointmentConfirmation)
async def handle_confirmation(ctx, sender, msg)
```

**Periodic Tasks**:
- Send consultation requests every 45 seconds (configurable)

---

### 3. Memory Agent (`memory_agent.py`)

**Purpose**: Manages user memories extracted from browser extension and serves them to other agents.

**Responsibilities**:
- Interface with browser extension storage
- Store and retrieve user memories
- Respond to memory requests from other agents
- Categorize memories (medical, personal, preferences)
- Periodic status updates

**Protocol**: `MemoryManagementProtocol v1.0.0`

**Message Handlers**:
```python
@memory_protocol.on_message(model=MemoryRequest, replies=MemoryResponse)
async def handle_memory_request(ctx, sender, msg)
```

**Storage Interface**:
```python
class MemoryStorageInterface:
    - get_all_memories()
    - get_memories_by_category(category)
    - add_memory(memory)
    - get_stats()
```

**Memory Categories**:
- **Medical**: `allergy`, `medication`, `condition`
- **Personal**: `name`, `age`, `location`, `occupation`
- **Preferences**: `food`, `hobby`, `music`, `movie`
- **Social**: `family`, `friend`, `colleague`
- **Skills**: `skill`, `language`, `education`
- **Travel**: `visited`, `planning`

---

## Protocol Communication

### Protocol-Based Architecture

The system uses **Fetch.ai Protocol** framework for structured, type-safe communication:

```python
# Define Protocol
protocol = Protocol(name="ProtocolName", version="1.0.0")

# Message Handler with Request/Response Pattern
@protocol.on_message(model=RequestModel, replies=ResponseModel)
async def handler(ctx: Context, sender: str, msg: RequestModel):
    # Process request
    response = ResponseModel(...)
    await ctx.send(sender, response)
```

### Message Models

#### Medical Consultation Models

**MedicalQuery**:
```python
{
    "patient_id": str,
    "symptoms": str,
    "medical_history": str,
    "urgency_level": "low" | "normal" | "high" | "emergency"
}
```

**MedicalAdvice**:
```python
{
    "patient_id": str,
    "diagnosis": str,
    "recommendations": List[str],
    "follow_up_required": bool,
    "urgency_assessment": str
}
```

#### Appointment Models

**AppointmentRequest**:
```python
{
    "patient_id": str,
    "preferred_date": str,
    "reason": str
}
```

**AppointmentConfirmation**:
```python
{
    "patient_id": str,
    "appointment_id": str,
    "scheduled_date": str,
    "status": str
}
```

#### Memory Models

**MemoryRequest**:
```python
{
    "user_id": str,
    "category": Optional[str],  # Filter by category
    "limit": Optional[int]       # Max results
}
```

**MemoryResponse**:
```python
{
    "user_id": str,
    "memories": List[Dict],
    "count": int
}
```

**UserMemory**:
```python
{
    "id": str,
    "entity": str,
    "category": str,
    "context": str,
    "timestamp": int,
    "status": "local" | "synced" | "on-chain",
    "metadata": {
        "source": str,
        "confidence": float,
        "modelUsed": str
    }
}
```

### Protocol Manifest Publishing

Each protocol publishes its manifest to the **Almanac** (Fetch.ai's agent registry):

```python
agent.include(protocol, publish_manifest=True)
```

**Manifest Structure**:
```json
{
  "version": "1.0",
  "metadata": {
    "name": "MedicalConsultationProtocol",
    "version": "1.0.0",
    "digest": "proto:hash..."
  },
  "models": [...],
  "interactions": [...]
}
```

---

## Memory Management

### Storage Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Browser Extension                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           IndexedDB (EthMemDB)                    │  │
│  │                                                   │  │
│  │  Store: memories                                  │  │
│  │  Indexes:                                         │  │
│  │    - category                                     │  │
│  │    - timestamp                                    │  │
│  │    - status                                       │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                               │
│                         │ Extract & Store               │
│                         ▼                               │
│              ┌──────────────────────┐                   │
│              │  memoryExtractor.js  │                   │
│              │  (AI-based)          │                   │
│              └──────────────────────┘                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Export/Sync
                      ▼
            ┌──────────────────────┐
            │  user_memories.json  │ ◄──── Memory Agent
            │  (Local Storage)     │       Reads From
            └──────────────────────┘
                      │
                      │ Blockchain Sync
                      ▼
            ┌──────────────────────┐
            │  Ethereum Blockchain │
            │  MemoryStorage.sol   │
            └──────────────────────┘
```

### Memory Lifecycle

1. **Extraction**: Browser extension uses AI to extract facts from conversations
2. **Local Storage**: Stored in IndexedDB with metadata
3. **Agent Access**: Memory Agent reads from JSON export
4. **Agent Distribution**: Memories shared with other agents via protocols
5. **Blockchain Sync**: Eventually stored on-chain for permanence

---

## Data Flow

### Medical Consultation Flow

```
Patient Agent                Doctor Agent              Memory Agent              ASI API
     │                            │                         │                      │
     │  1. MedicalQuery          │                         │                      │
     │──────────────────────────►│                         │                      │
     │                            │                         │                      │
     │                            │  2. MemoryRequest       │                      │
     │                            │────────────────────────►│                      │
     │                            │                         │                      │
     │                            │  3. MemoryResponse      │                      │
     │                            │◄────────────────────────│                      │
     │                            │    (allergies, etc.)    │                      │
     │                            │                         │                      │
     │                            │  4. Enhanced Analysis                          │
     │                            │─────────────────────────────────────────────►  │
     │                            │                         │                      │
     │                            │  5. AI Diagnosis & Recommendations            │
     │                            │◄─────────────────────────────────────────────  │
     │                            │                         │                      │
     │  6. MedicalAdvice         │                         │                      │
     │◄──────────────────────────│                         │                      │
     │  (personalized)            │                         │                      │
     │                            │                         │                      │
     │  7. AppointmentRequest    │                         │                      │
     │──────────────────────────►│                         │                      │
     │                            │                         │                      │
     │  8. Confirmation          │                         │                      │
     │◄──────────────────────────│                         │                      │
     │                            │                         │                      │
```

---

## Technology Stack

### Core Framework
- **uAgents** (Fetch.ai): Multi-agent communication framework
- **Python 3.13**: Programming language

### AI & APIs
- **ASI API** (`asi1-mini`): Medical analysis and recommendations
- **OpenAI-compatible API**: Fallback and alternatives

### Blockchain
- **Ethereum**: On-chain memory storage
- **Solidity**: Smart contract (MemoryStorage.sol)
- **Hardhat**: Development environment

### Storage
- **IndexedDB**: Browser-based local storage
- **JSON**: Agent-accessible memory export
- **IPFS**: Decentralized file storage (planned)

### Communication
- **HTTP/REST**: API communication
- **WebSockets**: Real-time updates (via uAgents)
- **Agentverse Mailbox**: Cloud-based agent messaging

### Dependencies
```
uagents>=0.12.0
uagents-ai-engine>=0.4.0
pydantic>=2.0.0
aiohttp>=3.8.0
requests>=2.31.0
python-dotenv>=1.0.0
cosmpy>=0.9.0
```

---

## Security & Privacy

### Data Protection

1. **Local-First**: Memories stored locally before optional blockchain sync
2. **Encryption**: Sensitive medical data encrypted before storage
3. **Access Control**: Agent-to-agent communication uses signed messages
4. **Privacy**: User controls what memories are shared

### Agent Security

1. **Seed Phrases**: Unique agent identities
2. **Message Signing**: Verify sender authenticity
3. **Protocol Validation**: Type-safe message schemas
4. **API Key Management**: Environment variables for sensitive keys

### Medical Compliance

- **Disclaimer**: All medical advice marked as preliminary/educational
- **Human Oversight**: System recommends professional consultation
- **Audit Trail**: All interactions logged for review
- **Data Rights**: User owns and controls their memory data

---

## Integration Points

### 1. Browser Extension Integration

**Data Flow**:
```
Extension → IndexedDB → JSON Export → Memory Agent → Other Agents
```

**API Endpoints** (Future):
```
GET  /api/memories           # Get all memories
GET  /api/memories/:category # Get by category
POST /api/memories           # Add new memory
PUT  /api/memories/:id       # Update memory
```

### 2. Blockchain Integration

**Smart Contract**: `MemoryStorage.sol`

**Functions**:
- `storeMemory(bytes32 hash, string metadata)`
- `getMemory(address user, uint256 index)`
- `updateMemoryStatus(bytes32 hash, uint8 status)`

**Storage Model**:
```solidity
struct Memory {
    bytes32 contentHash;      // IPFS hash
    uint256 timestamp;
    uint8 status;             // local/synced/on-chain
    string metadata;
}
```

### 3. ASI API Integration

**Endpoint**: `https://api.asi1.ai/v1/chat/completions`

**Request Format**:
```json
{
  "model": "asi1-mini",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "max_tokens": 200,
  "temperature": 0.7
}
```

**Use Cases**:
- Symptom analysis
- Personalized recommendations
- Medical context understanding

### 4. Agentverse Integration

**Features**:
- **Mailbox**: Cloud-based message queue for offline agents
- **Almanac**: Agent registry and discovery
- **Inspector**: Debug and monitor agent activity

**Configuration**:
```python
agent = Agent(
    name="agent_name",
    seed="unique_seed_phrase",
    mailbox="JWT_TOKEN"
)
```

---

## Deployment

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run individual agents
python doctor_agent.py
python patient_agent.py
python memory_agent.py

# Run complete system
python medical_system.py
```

### Bureau Setup

The **Bureau** manages multiple agents in a single process:

```python
bureau = Bureau(endpoint=["http://127.0.0.1:8000/submit"])
bureau.add(doctor_agent)
bureau.add(patient_agent)
bureau.add(memory_agent)
bureau.run()
```

**Advantages**:
- Single process management
- Shared event loop
- Easier debugging
- Resource efficiency

### Production Deployment

1. **Agent Distribution**: Deploy agents on separate servers
2. **Load Balancing**: Multiple agent instances
3. **Database**: Replace JSON with PostgreSQL/MongoDB
4. **Monitoring**: Prometheus + Grafana
5. **Logging**: Centralized logging (ELK stack)

---

## Future Enhancements

### Planned Features

1. **Multi-User Support**: Handle multiple patients simultaneously
2. **Specialist Agents**: Cardiology, Dermatology, Mental Health agents
3. **Prescription Management**: Drug interaction checking
4. **Telemedicine Integration**: Video consultation support
5. **EHR Integration**: Connect with Electronic Health Records
6. **Mobile App**: React Native patient interface
7. **Voice Interface**: Natural language interaction
8. **Analytics Dashboard**: Health trends and insights

### Blockchain Roadmap

1. **zk-SNARK Proofs**: Privacy-preserving memory verification
2. **Cross-Chain**: Support multiple blockchain networks
3. **DAO Governance**: Community-driven protocol updates
4. **Token Economy**: Incentivize quality medical contributions
5. **NFT Certificates**: Verifiable medical credentials

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - See [LICENSE](LICENSE) file.

---

**Built with ❤️ using Fetch.ai uAgents and ASI API**
