.PHONY: help build up down restart logs ps clean medical law support education financial all

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)ASI Agents Docker Management$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-20s$(NC) %s\n", $$1, $$2}'

build: ## Build all Docker images
	@echo "$(GREEN)Building all agent systems...$(NC)"
	docker-compose build

up: ## Start all agent systems
	@echo "$(GREEN)Starting all agent systems...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)All systems are now running!$(NC)"
	@make ps

down: ## Stop all agent systems
	@echo "$(RED)Stopping all agent systems...$(NC)"
	docker-compose down

restart: ## Restart all agent systems
	@echo "$(BLUE)Restarting all agent systems...$(NC)"
	docker-compose restart

logs: ## Show logs from all systems
	docker-compose logs -f

ps: ## Show status of all containers
	@echo "$(BLUE)Container Status:$(NC)"
	@docker-compose ps

clean: ## Stop and remove all containers, networks, and volumes
	@echo "$(RED)Cleaning up all resources...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)Cleanup complete!$(NC)"

# Individual system commands
medical: ## Start only Medical system (port 8000)
	@echo "$(GREEN)Starting Medical Consultation System...$(NC)"
	docker-compose up -d medical-system
	docker-compose logs -f medical-system

law: ## Start only Law system (port 9000)
	@echo "$(GREEN)Starting Legal Consultation System...$(NC)"
	docker-compose up -d law-system
	docker-compose logs -f law-system

support: ## Start only Customer Support system (port 10000)
	@echo "$(GREEN)Starting Customer Support System...$(NC)"
	docker-compose up -d support-system
	docker-compose logs -f support-system

education: ## Start only Education system (port 11000)
	@echo "$(GREEN)Starting Education System...$(NC)"
	docker-compose up -d education-system
	docker-compose logs -f education-system

financial: ## Start only Financial system (port 12000)
	@echo "$(GREEN)Starting Financial Advisory System...$(NC)"
	docker-compose up -d financial-system
	docker-compose logs -f financial-system

# Quick commands
all: build up ## Build and start all systems

rebuild: ## Rebuild and restart all systems
	@echo "$(BLUE)Rebuilding all systems...$(NC)"
	docker-compose up -d --build

stop-medical: ## Stop Medical system
	docker-compose stop medical-system

stop-law: ## Stop Law system
	docker-compose stop law-system

stop-support: ## Stop Support system
	docker-compose stop support-system

stop-education: ## Stop Education system
	docker-compose stop education-system

stop-financial: ## Stop Financial system
	docker-compose stop financial-system

# Logs for individual systems
logs-medical: ## Show Medical system logs
	docker-compose logs -f medical-system

logs-law: ## Show Law system logs
	docker-compose logs -f law-system

logs-support: ## Show Support system logs
	docker-compose logs -f support-system

logs-education: ## Show Education system logs
	docker-compose logs -f education-system

logs-financial: ## Show Financial system logs
	docker-compose logs -f financial-system

# Health checks
health: ## Check health of all systems
	@echo "$(BLUE)System Health Status:$(NC)"
	@docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# Backup commands
backup: ## Backup all data volumes
	@echo "$(GREEN)Backing up all data volumes...$(NC)"
	@mkdir -p backups
	@docker run --rm -v asi-medical-data:/data -v $(PWD)/backups:/backup alpine tar czf /backup/medical-data-$$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
	@docker run --rm -v asi-law-data:/data -v $(PWD)/backups:/backup alpine tar czf /backup/law-data-$$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
	@docker run --rm -v asi-support-data:/data -v $(PWD)/backups:/backup alpine tar czf /backup/support-data-$$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
	@docker run --rm -v asi-education-data:/data -v $(PWD)/backups:/backup alpine tar czf /backup/education-data-$$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
	@docker run --rm -v asi-financial-data:/data -v $(PWD)/backups:/backup alpine tar czf /backup/financial-data-$$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
	@echo "$(GREEN)Backup complete! Files saved to ./backups/$(NC)"

# Development helpers
shell-medical: ## Access Medical system container shell
	docker-compose exec medical-system /bin/bash

shell-law: ## Access Law system container shell
	docker-compose exec law-system /bin/bash

shell-support: ## Access Support system container shell
	docker-compose exec support-system /bin/bash

shell-education: ## Access Education system container shell
	docker-compose exec education-system /bin/bash

shell-financial: ## Access Financial system container shell
	docker-compose exec financial-system /bin/bash

# Testing
test: ## Test all system endpoints
	@echo "$(BLUE)Testing all systems...$(NC)"
	@echo "Medical System (8000):"
	@curl -s http://localhost:8000 || echo "$(RED)Medical system not responding$(NC)"
	@echo "\nLaw System (9000):"
	@curl -s http://localhost:9000 || echo "$(RED)Law system not responding$(NC)"
	@echo "\nSupport System (10000):"
	@curl -s http://localhost:10000 || echo "$(RED)Support system not responding$(NC)"
	@echo "\nEducation System (11000):"
	@curl -s http://localhost:11000 || echo "$(RED)Education system not responding$(NC)"
	@echo "\nFinancial System (12000):"
	@curl -s http://localhost:12000 || echo "$(RED)Financial system not responding$(NC)"

# Resource monitoring
stats: ## Show resource usage statistics
	docker stats --no-stream

# Environment setup
env: ## Create .env file from example
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(GREEN).env file created! Please edit it with your configuration.$(NC)"; \
	else \
		echo "$(RED).env file already exists!$(NC)"; \
	fi
