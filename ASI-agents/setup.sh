#!/bin/bash

# Setup script for ASI Doctor Agent
# This script sets up the environment and runs the doctor agent

echo "=================================="
echo "ASI Doctor Agent Setup"
echo "=================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
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
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Install requirements
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo "✓ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✓ .env file already exists"
fi
echo ""

# Check if user wants to run the agent
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "To run the doctor agent:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run the agent: python doctor_agent.py"
echo ""
echo "To test the agent:"
echo "  python test_doctor_agent.py"
echo ""
echo "To run test agent with actual messaging:"
echo "  python test_doctor_agent.py --run-agent"
echo ""

read -p "Do you want to start the doctor agent now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting doctor agent..."
    python doctor_agent.py
fi
