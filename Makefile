.PHONY: help dev up down build rebuild logs clean install test

# Default target
help:
	@echo "LightSaver - Podman Development Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  make dev        - Start all services in development mode with hot-reload"
	@echo "  make up         - Start all services in detached mode"
	@echo "  make down       - Stop all services"
	@echo "  make build      - Build all service images"
	@echo "  make rebuild    - Rebuild and restart all services"
	@echo "  make logs       - Follow logs from all services"
	@echo "  make logs-api   - Follow logs from API service"
	@echo "  make logs-fe    - Follow logs from frontend service"
	@echo "  make clean      - Stop services and remove volumes"
	@echo "  make install    - Install dependencies in running containers"
	@echo "  make shell-api  - Open shell in API container"
	@echo "  make shell-fe   - Open shell in frontend container"
	@echo "  make db-shell   - Open PostgreSQL shell"
	@echo "  make setup      - Initial setup (copy .env, install deps)"

# Start services in development mode with hot-reload
dev:
	podman-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start services in detached mode
up:
	podman-compose up -d

# Stop all services
down:
	podman-compose down

# Build all images
build:
	podman-compose build

# Rebuild and restart
rebuild:
	podman-compose down
	podman-compose build
	podman-compose up -d

# View logs
logs:
	podman-compose logs -f

logs-api:
	podman-compose logs -f api

logs-fe:
	podman-compose logs -f frontend

logs-db:
	podman-compose logs -f postgres

logs-mq:
	podman-compose logs -f rabbitmq

# Stop and remove everything including volumes
clean:
	podman-compose down -v
	@echo "Cleaned up all containers and volumes"

# Install dependencies
install:
	podman-compose exec frontend pnpm install
	podman-compose exec api pnpm install

# Open shells
shell-api:
	podman-compose exec api sh

shell-fe:
	podman-compose exec frontend sh

# Database shell
db-shell:
	podman-compose exec postgres psql -U lightsaver -d lightsaver

# Initial setup
setup:
	@if [ ! -f .env ]; then cp .env.example .env; echo "Created .env file"; fi
	@echo "Setup complete! Run 'make dev' to start development"

# Production build
prod-build:
	podman build -t lightsaver-app .

# Run production container
prod-run:
	podman run -p 3000:3000 lightsaver-app
