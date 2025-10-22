# ASI Agents Dockerfile
# Base image for all ASI agent systems
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all agent code
COPY . .

# Create directory for memory files
RUN mkdir -p /app/data

# Environment variables (will be overridden by docker-compose)
ENV PYTHONUNBUFFERED=1
ENV LOG_LEVEL=INFO

# Expose ports (each system uses a different port)
EXPOSE 8000 9000 10000 11000 12000

# Default command (will be overridden by docker-compose)
CMD ["python", "-u", "medical/medical_system.py"]
