# Legal Consultation System - Architecture Documentation

## Overview

The **Legal Consultation System** is a multi-agent ecosystem that provides AI-powered legal consultations with case history integration. Built on Fetch.ai's uAgents framework and enhanced with ASI (Artificial Superintelligence) API, the system delivers personalized legal guidance by combining intelligent analysis with contextual case memories.

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│            LEGAL CONSULTATION SYSTEM ARCHITECTURE               │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                    ┌──────────────┐          │
│  │    Client    │◄──────────────────►│    Lawyer    │          │
│  │    Agent     │  Legal Query        │    Agent     │          │
│  │              │  Legal Advice       │              │          │
│  │ (Simulation) │                    │  (ASI-based) │          │
│  └──────────────┘                    └──────┬───────┘          │
│                                              │                   │
│                                              │ Request           │
│                                              │ Case Memories     │
│                                              ▼                   │
│                                       ┌──────────────┐          │
│                                       │ Case Memory  │          │
│                                       │    Agent     │◄─────┐   │
│                                       │              │      │   │
│                                       │ (JSON Store) │      │   │
│                                       └──────────────┘      │   │
│                                              │              │   │
│                                              │              │   │
│                                       ┌──────▼────────┐     │   │
│                                       │case_memories  │     │   │
│                                       │    .json      │     │   │
│                                       │               │     │   │
│                                       │ - Case History│     │   │
│                                       │ - Jurisdiction│     │   │
│                                       │ - Preferences │     │   │
│                                       └───────────────┘     │   │
│                                                             │   │
│  Browser Extension (zkMem) ────────────────────────────────┘   │
│  Exports legal case data to JSON                               │
│                                                                  │
│  All agents coordinated by Fetch.ai Bureau                     │
│  Protocol-based communication via Agentverse Mailbox           │
└────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Lawyer Agent (`lawyer_agent.py`)
**Purpose**: AI-powered legal consultant providing case analysis and recommendations.

**Key Features**:
- Legal case analysis using ASI API
- Case history integration
- Jurisdiction-specific guidance
- Urgency assessment
- Next steps generation

**Protocols**:
- `LegalConsultationProtocol` v1.0.0

**Message Models**:
- `LegalQuery` - Incoming legal questions
- `LegalAdvice` - Analysis and recommendations
- `ConsultationRequest` - Scheduling requests
- `ConsultationConfirmation` - Appointment confirmations

### 2. Client Agent (`client_agent.py`)
**Purpose**: Simulates clients seeking legal advice.

**Behavior**:
- Sends periodic legal queries (every 60 seconds)
- Receives and displays legal advice
- Handles consultation confirmations

**Sample Query**: Employment termination without cause

### 3. Case Memory Agent (`case_memory_agent.py`)
**Purpose**: Manages legal case history and client information.

**Memory Categories**:
- `name` - Client identification
- `legal_matter` - Type of legal issues
- `jurisdiction` - Geographic location/legal jurisdiction
- `case_history` - Previous legal matters
- `preferences` - Client communication preferences

**Storage**: JSON file (`case_memories.json`)

### 4. Law System (`law_system.py`)
**Purpose**: Bureau-managed coordinator for all agents.

**Responsibilities**:
- Agent lifecycle management
- Protocol registration
- Message routing
- System initialization

**Port**: 9000 (configurable)

## Data Flow

### Legal Consultation Flow

```
1. Client submits legal query
   ├─► Client Agent sends LegalQuery to Lawyer Agent
   │
2. Lawyer requests case context
   ├─► Lawyer Agent sends MemoryRequest to Memory Agent
   │
3. Memory retrieval
   ├─► Memory Agent retrieves relevant case history
   ├─► Returns MemoryResponse with case data
   │
4. Enhanced analysis
   ├─► Lawyer combines query + case history
   ├─► Calls ASI API for intelligent legal analysis
   ├─► Generates personalized recommendations
   │
5. Response delivery
   └─► Lawyer Agent sends LegalAdvice to Client Agent
```

## ASI API Integration

### Legal Analysis Endpoint
```python
POST https://api.asi1.ai/v1/chat/completions

Headers:
  Authorization: Bearer {ASI_API_KEY}
  Content-Type: application/json

Payload:
{
  "model": "asi1-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a knowledgeable legal advisor"
    },
    {
      "role": "user", 
      "content": "Analyze: [case details + history]"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

### Fallback Mechanism
If ASI API is unavailable:
- Uses rule-based analysis
- Provides general legal guidance
- Recommends consulting qualified attorney

## Memory Management

### Case Memory Schema
```json
{
  "id": "mem_001",
  "entity": "John Smith",
  "category": "name|legal_matter|jurisdiction|case_history|preferences",
  "context": "Descriptive context about the memory",
  "timestamp": 1729598600000,
  "status": "local|synced",
  "metadata": {
    "source": "registration|intake|case_file",
    "confidence": 0.95
  }
}
```

### Memory Categories
- **name**: Client identification
- **legal_matter**: Area of law (employment, family, criminal, etc.)
- **jurisdiction**: State/country legal jurisdiction
- **case_history**: Previous cases and outcomes
- **preferences**: Communication and service preferences

## Protocol Specifications

### LegalConsultationProtocol

**Messages**:
1. **LegalQuery** (Client → Lawyer)
   ```python
   {
     "client_id": str,
     "case_description": str,
     "legal_history": str,
     "case_type": "general|criminal|civil|corporate|family",
     "urgency_level": "low|normal|high|urgent"
   }
   ```

2. **LegalAdvice** (Lawyer → Client)
   ```python
   {
     "client_id": str,
     "legal_analysis": str,
     "recommendations": List[str],
     "next_steps": List[str],
     "consultation_required": bool,
     "urgency_assessment": str
   }
   ```

### CaseMemoryManagementProtocol

**Messages**:
1. **MemoryRequest** (Lawyer → Memory)
   ```python
   {
     "user_id": str,
     "category": "all|legal_matter|jurisdiction|...",
     "limit": int
   }
   ```

2. **MemoryResponse** (Memory → Lawyer)
   ```python
   {
     "user_id": str,
     "memories": List[Dict],
     "count": int
   }
   ```

## Security & Privacy

### Data Protection
- **Local-First**: Case data stored locally
- **Encryption Ready**: Structure supports encryption
- **Access Control**: Memory agent validates requests
- **Audit Trail**: All memory access logged

### Legal Disclaimer
⚠️ **IMPORTANT**: This system provides **general legal information only**. It is NOT a substitute for professional legal counsel. Always consult qualified attorneys for legal matters.

## Configuration

### Environment Variables
```bash
# Required
ASI_ONE_API_KEY=your_asi_api_key

# Optional
LAW_PORT=9000
```

### Agent Configuration
```python
# Lawyer Agent
name="lawyer_agent"
seed="lawyer_agent_seed_phrase_zkMem_2024"
mailbox="[Agentverse JWT Token]"

# Client Agent  
name="client_agent"
seed="client_agent_seed_phrase_zkMem_2024"
mailbox="[Agentverse JWT Token]"

# Case Memory Agent
name="case_memory_agent"
seed="case_memory_agent_seed_zkMem_2024"
mailbox="[Agentverse JWT Token]"
```

## Deployment

### Local Development
```bash
cd ASI-agents/law
python law_system.py
```

### Production Considerations
- Use environment-specific seeds
- Enable SSL/TLS for API calls
- Implement rate limiting
- Add authentication for memory access
- Set up monitoring and logging

## Performance

- **Response Time**: 2-5 seconds (including ASI API)
- **Memory Lookup**: <100ms
- **Concurrent Clients**: Scales with Bureau capacity
- **Throughput**: ~10-20 consultations/minute

## Future Enhancements

1. **Specialized Legal Domains**
   - Criminal law specialist
   - Family law specialist
   - Corporate law specialist

2. **Document Analysis**
   - Contract review
   - Legal document generation
   - Precedent search

3. **Blockchain Integration**
   - Immutable case records
   - Smart contract legal agreements
   - zkMem full integration

4. **Advanced Features**
   - Multi-jurisdiction support
   - Legal research integration
   - Court filing assistance
   - Client portal

## Technology Stack

- **Agent Framework**: Fetch.ai uAgents >=0.12.0
- **AI Engine**: ASI API (asi1-mini model)
- **Language**: Python 3.13+
- **Messaging**: Agentverse Mailbox
- **Storage**: JSON (local-first)
- **Protocols**: Custom uAgents protocols

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintainer**: zkMem Team
