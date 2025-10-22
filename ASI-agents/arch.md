# ASI-Agents Frontend & API Documentation

## 🌐 Overview

This document describes the web frontend and API server for the ASI-Agents ecosystem, providing a unified interface to interact with all five agent systems.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FULL STACK ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │ ◄─────► │  API Server  │                  │
│  │  (Next.js)   │  HTTP   │  (FastAPI)   │                  │
│  │  Port 3001   │         │  Port 8080   │                  │
│  └──────────────┘         └──────┬───────┘                  │
│                                   │                           │
│                          ┌────────┴────────┐                 │
│                          │                 │                 │
│                    ┌─────▼─────┐    ┌─────▼─────┐           │
│                    │  Medical  │    │   Legal   │           │
│                    │  Agent    │    │  Agent    │           │
│                    │ Port 8000 │    │ Port 9000 │           │
│                    └───────────┘    └───────────┘           │
│                                                               │
│           ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│           │ Support  │  │Education │  │Financial │         │
│           │  Agent   │  │  Agent   │  │  Agent   │         │
│           │Port 10000│  │Port 11000│  │Port 12000│         │
│           └──────────┘  └──────────┘  └──────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Components

### 1. Frontend (Next.js)
- Modern React-based web interface
- Five dedicated pages for each agent
- Real-time memory viewer
- Responsive design with Tailwind CSS
- Port: **3001**

### 2. API Server (FastAPI)
- RESTful API gateway
- Unified interface to all agents
- Memory management integration
- ASI API integration
- Port: **8080**

### 3. Agent Systems
- Medical (8000)
- Legal (9000)
- Customer Support (10000)
- Education (11000)
- Financial (12000)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up

# Or start specific services
docker-compose up api-server frontend
```

Access:
- Frontend: http://localhost:3001
- API Server: http://localhost:8080
- API Docs: http://localhost:8080/docs

### Option 2: Local Development

**1. Start API Server:**
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export ASI_ONE_API_KEY="your-api-key-here"

# Run API server
python api_server.py
```

**2. Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**3. Access:**
- Frontend: http://localhost:3001
- API: http://localhost:8080

## 📡 API Documentation

### Base URL
```
http://localhost:8080
```

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-10-22T12:00:00"
}
```

### Medical Endpoints

#### Get Medical Consultation
```bash
POST /api/medical/consult
Content-Type: application/json

{
  "patient_id": "PAT001",
  "symptoms": "Headache and fever for 2 days",
  "medical_history": "No known allergies",
  "urgency_level": "normal"
}
```

Response:
```json
{
  "patient_id": "PAT001",
  "diagnosis": "Likely viral infection",
  "recommendations": [
    "Rest and hydration",
    "Over-the-counter pain relievers"
  ],
  "follow_up_required": false,
  "urgency_assessment": "normal",
  "timestamp": "2024-10-22T12:00:00"
}
```

#### Get Patient Memories
```bash
POST /api/medical/memories
Content-Type: application/json

{
  "user_id": "PAT001",
  "limit": 10
}
```

### Legal Endpoints

#### Get Legal Consultation
```bash
POST /api/legal/consult
Content-Type: application/json

{
  "client_id": "CLI001",
  "case_description": "Contract dispute with vendor",
  "legal_history": "",
  "case_type": "civil",
  "urgency_level": "normal"
}
```

### Customer Support Endpoints

#### Create Support Ticket
```bash
POST /api/support/ticket
Content-Type: application/json

{
  "customer_id": "CUST001",
  "issue_description": "Unable to login to account",
  "ticket_history": "",
  "priority": "high",
  "category": "technical"
}
```

### Education Endpoints

#### Get Tutoring Session
```bash
POST /api/education/tutor
Content-Type: application/json

{
  "student_id": "STU001",
  "question": "Explain Newton's second law",
  "subject": "physics",
  "learning_level": "intermediate",
  "learning_history": ""
}
```

### Financial Endpoints

#### Get Financial Advice
```bash
POST /api/financial/advise
Content-Type: application/json

{
  "investor_id": "INV001",
  "query": "Should I diversify my portfolio?",
  "portfolio": {
    "stocks": 50000,
    "bonds": 30000,
    "crypto": 10000
  },
  "risk_tolerance": "moderate",
  "investment_history": ""
}
```

## 🎨 Frontend Pages

### Home Page (`/`)
- Overview of all five agents
- Interactive agent cards
- Navigation to specific agents

### Medical Page (`/medical`)
- Symptom input form
- Medical history display
- Diagnosis and recommendations
- Patient memory viewer

### Legal Page (`/legal`)
- Case description form
- Legal history integration
- Analysis and next steps
- Case memory viewer

### Support Page (`/support`)
- Issue description form
- Ticket creation
- Solution and recommendations
- Customer history viewer

### Education Page (`/education`)
- Question input form
- Subject and level selection
- Explanation with examples
- Practice problems
- Learning history viewer

### Financial Page (`/financial`)
- Investment query form
- Portfolio input (JSON or text)
- Financial analysis
- Risk assessment
- Investment history viewer

## 🔧 Configuration

### Environment Variables

**.env (API Server)**:
```bash
ASI_ONE_API_KEY=your-asi-api-key
LOG_LEVEL=INFO
```

**frontend/.env**:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Docker Configuration

The `docker-compose.yml` includes:
- All 5 agent systems
- API server
- Frontend application
- Shared network
- Volume mounts for memory persistence

## 🧪 Testing

### Test API Server
```bash
# Health check
curl http://localhost:8080/health

# Test medical endpoint
curl -X POST http://localhost:8080/api/medical/consult \
  -H "Content-Type: application/json" \
  -d '{"patient_id":"PAT001","symptoms":"test","urgency_level":"normal"}'
```

### Test Frontend
1. Open http://localhost:3001
2. Navigate to any agent page
3. Fill out the form
4. Submit and verify response

## 📊 Memory Integration

Each agent system maintains user memories in JSON files:
- `medical/user_memories.json`
- `law/case_memories.json`
- `customer-support/customer_memories.json`
- `education/student_memories.json`
- `financial/portfolio_memories.json`

The API server loads these memories and provides them as context to the agents.

## 🔒 Security

- API key required for ASI API calls
- CORS enabled for frontend access
- No authentication on endpoints (add as needed)
- Memory files mounted read-only in Docker

## 📈 Performance

- FastAPI with async support
- Next.js with SSR and optimization
- Docker containers with health checks
- Efficient memory loading

## 🐛 Troubleshooting

### API Server Issues
```bash
# Check if running
curl http://localhost:8080/health

# Check logs
docker-compose logs api-server

# Restart service
docker-compose restart api-server
```

### Frontend Issues
```bash
# Check if running
curl http://localhost:3001

# Check logs
docker-compose logs frontend

# Rebuild
docker-compose up --build frontend
```

### Agent Connection Issues
Verify all agent systems are running:
```bash
docker-compose ps
```

## 🚀 Deployment

### Production Deployment

1. **Build images**:
   ```bash
   docker-compose build
   ```

2. **Start services**:
   ```bash
   docker-compose up -d
   ```

3. **Configure reverse proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
       }
       
       location /api {
           proxy_pass http://localhost:8080;
       }
   }
   ```

## 📝 Development

### Adding New Endpoints

1. Add route to `api_server.py`
2. Define request/response models
3. Implement handler function
4. Test with curl or Postman
5. Update frontend to use new endpoint

### Adding New Frontend Features

1. Create component in `frontend/app/components/`
2. Import and use in page
3. Test responsiveness
4. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- Check `/docs` endpoint for interactive API documentation
- Review logs: `docker-compose logs -f`
- See individual agent READMEs for details

## 📄 License

MIT License - See LICENSE file for details
