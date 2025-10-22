# ASI-Agents Frontend

A modern, responsive web interface for interacting with all five ASI agent systems: Medical, Legal, Customer Support, Education, and Financial.

## 🌟 Features

- **🏥 Medical Consultation**: AI-powered healthcare consultations with symptom analysis
- **⚖️ Legal Consultation**: Intelligent legal advice with case history
- **🎧 Customer Support**: Smart ticket management and resolution
- **📚 Education System**: Personalized AI tutoring with examples and practice problems
- **💰 Financial Advisory**: Portfolio analysis and investment guidance

## 🏗️ Architecture

The frontend is built with:
- **Next.js 14**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Lucide React**: Modern icon library

### Directory Structure

```
frontend/
├── app/
│   ├── layout.jsx                  # Root layout with navigation
│   ├── page.jsx                    # Home page with agent cards
│   ├── globals.css                 # Global styles
│   ├── components/
│   │   ├── Navigation.jsx          # Top navigation bar
│   │   ├── LoadingSpinner.jsx      # Loading state component
│   │   └── MemoryViewer.jsx        # Memory history display
│   ├── medical/
│   │   └── page.jsx                # Medical consultation page
│   ├── legal/
│   │   └── page.jsx                # Legal consultation page
│   ├── support/
│   │   └── page.jsx                # Customer support page
│   ├── education/
│   │   └── page.jsx                # Education tutoring page
│   └── financial/
│       └── page.jsx                # Financial advisory page
├── public/                         # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
└── Dockerfile
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Local Development

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

### Production Build

```bash
npm run build
npm start
```

## 🐳 Docker Deployment

The frontend is included in the main docker-compose configuration:

```bash
# From the ASI-agents root directory
docker-compose up frontend
```

Or run all services including frontend:

```bash
docker-compose up
```

Access the frontend at: http://localhost:3001

## 🎨 UI Components

### Navigation
- Responsive navigation bar with icons
- Active page highlighting
- Mobile-friendly menu

### LoadingSpinner
- Animated loading indicator
- Customizable loading message
- Used during API requests

### MemoryViewer
- Displays user/patient/client history
- Expandable memory list
- Category tags and timestamps

## 📡 API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8080`

### API Endpoints Used

**Medical**:
- `POST /api/medical/consult` - Get medical consultation
- `POST /api/medical/memories` - Retrieve patient memories

**Legal**:
- `POST /api/legal/consult` - Get legal consultation
- `POST /api/legal/memories` - Retrieve case memories

**Customer Support**:
- `POST /api/support/ticket` - Create support ticket
- `POST /api/support/memories` - Retrieve customer history

**Education**:
- `POST /api/education/tutor` - Get tutoring session
- `POST /api/education/memories` - Retrieve learning history

**Financial**:
- `POST /api/financial/advise` - Get financial advice
- `POST /api/financial/memories` - Retrieve investment history

## 🎨 Styling

The application uses Tailwind CSS with custom color schemes for each agent:

- **Medical**: Green gradient (from-green-400 to-emerald-600)
- **Legal**: Blue gradient (from-blue-400 to-indigo-600)
- **Customer Support**: Orange gradient (from-orange-400 to-red-600)
- **Education**: Purple gradient (from-purple-400 to-pink-600)
- **Financial**: Yellow gradient (from-yellow-400 to-orange-600)

## 🧪 Development

### Adding a New Agent Page

1. Create a new directory in `app/` (e.g., `app/new-agent/`)
2. Add `page.jsx` with the agent interface
3. Update `Navigation.jsx` to include the new route
4. Add the agent card to `app/page.jsx`
5. Ensure API endpoints are available in the backend

### Customizing Styles

Edit `tailwind.config.js` to customize colors, spacing, or add new utilities.

## 📱 Responsive Design

The frontend is fully responsive and works on:
- Desktop (1920x1080 and above)
- Laptop (1366x768 and above)
- Tablet (768px and above)
- Mobile (320px and above)

## 🔒 Security Considerations

- All API calls use environment variables for base URL
- No sensitive data stored in local storage
- CORS configured on backend
- Input validation on forms

## 🐛 Troubleshooting

### Frontend won't start
- Check Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and `.next`, then run `npm install` again

### API calls fail
- Verify backend is running on port 8080
- Check NEXT_PUBLIC_API_BASE_URL in `.env`
- Ensure CORS is enabled on backend

### Styling issues
- Run `npm run dev` to rebuild Tailwind classes
- Check browser console for errors

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the main README.md in the project root
- Review API documentation in `api_server.py`
