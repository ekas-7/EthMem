#!/bin/bash

# Setup script for ASI-Agents Multi-Domain Ecosystems
# This script sets up the environment for Medical, Legal, and Customer Support systems

echo "================================================================"
echo "🚀 ASI-Agents Multi-Domain Setup"
echo "================================================================"
echo "   🏥 Medical Consultation System"
echo "   ⚖️  Legal Consultation System"
echo "   🎧 Customer Support System"
echo "================================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.13 or higher."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"
echo ""

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip."
    exit 1
fi

echo "✓ pip3 found"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi
echo ""

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Install requirements
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo "✓ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    echo "# ASI API Configuration" > .env
    echo "ASI_ONE_API_KEY=your_asi_api_key_here" >> .env
    echo "" >> .env
    echo "# Optional: Custom ports (defaults shown)" >> .env
    echo "# MEDICAL_PORT=8000" >> .env
    echo "# LAW_PORT=9000" >> .env
    echo "# SUPPORT_PORT=10000" >> .env
    echo "✓ .env file created"
    echo "⚠️  Please edit .env and add your ASI API key!"
else
    echo "✓ .env file already exists"
fi
echo ""

# Create memory files for each ecosystem if they don't exist
echo "📝 Setting up ecosystem memory files..."

if [ ! -f "medical/user_memories.json" ]; then
    echo "  Creating medical/user_memories.json..."
fi

if [ ! -f "law/case_memories.json" ]; then
    echo "  Creating law/case_memories.json..."
fi

if [ ! -f "customer-support/customer_memories.json" ]; then
    echo "  Creating customer-support/customer_memories.json..."
fi

echo "✓ Memory files ready (auto-created on first run)"
echo ""

# Display completion message
echo "================================================================"
echo "✨ Setup Complete!"
echo "================================================================"
echo ""
echo "🏥 To run Medical System:"
echo "   cd medical && python medical_system.py"
echo ""
echo "⚖️  To run Legal System:"
echo "   cd law && python law_system.py"
echo ""
echo "🎧 To run Customer Support System:"
echo "   cd customer-support && python support_system.py"
echo ""
echo "📚 Documentation:"
echo "   - Main README: README.md"
echo "   - Medical: medical/README.md"
echo "   - Legal: law/README.md"
echo "   - Support: customer-support/README.md"
echo ""
echo "⚙️  Configuration:"
echo "   - Edit .env with your ASI_ONE_API_KEY"
echo "   - Each ecosystem runs on a different port"
echo ""
echo "================================================================"
echo ""

read -p "Which system would you like to run? (medical/law/support/none): " system_choice
echo ""

case $system_choice in
    medical)
        echo "🏥 Starting Medical Consultation System..."
        cd medical && python medical_system.py
        ;;
    law)
        echo "⚖️  Starting Legal Consultation System..."
        cd law && python law_system.py
        ;;
    support)
        echo "🎧 Starting Customer Support System..."
        cd customer-support && python support_system.py
        ;;
    *)
        echo "✓ Setup complete! Run a system manually when ready."
        ;;
esac

    echo "Starting doctor agent..."
    python doctor_agent.py
fi
