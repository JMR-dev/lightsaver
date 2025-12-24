# LightSaver

## Technologies Used

- **Next.js**: React-based framework for building server-side rendered and statically generated web applications.
- **GraphQL**: API query language for flexible and efficient data fetching.
- **Express.js**: Fast, unopinionated web framework for Node.js, powering the backend API.
- **PostgreSQL**: Relational database for persistent storage.
- **Podman & Podman Compose**: Container orchestration for local development and deployment.
- **Terraform CDKTF**: Infrastructure as Code (IaC) using the Cloud Development Kit for Terraform.
- **RabbitMQ**: Message broker for asynchronous communication and background processing.

## Prerequisites

- **Podman**: Install from [podman.io](https://podman.io/getting-started/installation)
- **Podman Compose**: Install via `pip install podman-compose`
- **Node.js**: Version 22.17.0 or higher
- **pnpm**: Package manager (installed via corepack)

## Local Development with Podman

### Quick Start

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd lightsaver
   ```

2. **Set up environment variables**
   ```sh
   cp .env.example .env
   # Edit .env with your configuration if needed
   ```

3. **Start all services with Podman Compose**
   ```sh
   # Development mode with hot-reload
   podman-compose -f docker-compose.yml -f docker-compose.dev.yml up

   # Or use the base configuration only
   podman-compose up
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - RabbitMQ Management: http://localhost:15672 (user: lightsaver, password: lightsaver_dev)
   - PostgreSQL: localhost:5432

### Available Podman Commands

**Start services in detached mode:**
```sh
podman-compose up -d
```

**Stop services:**
```sh
podman-compose down
```

**Stop services and remove volumes:**
```sh
podman-compose down -v
```

**View logs:**
```sh
# All services
podman-compose logs -f

# Specific service
podman-compose logs -f frontend
podman-compose logs -f api
```

**Rebuild services:**
```sh
podman-compose build
podman-compose up --build
```

**Run commands in a service container:**
```sh
# Frontend
podman-compose exec frontend pnpm install
podman-compose exec frontend pnpm build

# API
podman-compose exec api pnpm install
```

### Production Build

Build the production image:
```sh
podman build -t lightsaver-app .
```

Run the production container:
```sh
podman run -p 3000:3000 lightsaver-app
```

### Service Architecture

The project uses the following services:

- **frontend**: Next.js application (port 3000)
- **api**: Express + GraphQL API (port 4000)
- **postgres**: PostgreSQL database (port 5432)
- **rabbitmq**: RabbitMQ message broker (ports 5672, 15672)

### Troubleshooting

**Port conflicts:**
If ports are already in use, modify the port mappings in `docker-compose.yml`.

**Permission issues with volumes:**
Podman runs rootless by default. Add `:z` or `:Z` to volume mounts if you encounter permission issues.

**SELinux issues:**
The dev compose file includes `:z` flags for volume mounts to handle SELinux contexts.

**Container doesn't start:**
Check logs with `podman-compose logs <service-name>` to diagnose issues.