# LightSaver

## Technologies Used

- **Next.js 15**: React 19-based framework for building server-side rendered web applications
- **GraphQL**: API query language for flexible and efficient data fetching
- **Express.js**: Fast, unopinionated web framework for Node.js, powering the backend API
- **Ory Kratos**: Open-source identity and user management system for authentication
- **PostgreSQL 18**: Relational database for persistent storage
- **Podman Compose**: Container orchestration for local development and deployment
- **Turborepo**: Monorepo build system for managing multiple packages
- **OpenTofu**: FOSS fork of Terraform
- **RabbitMQ**: Message broker for asynchronous communication and background processing

## Project Structure

```text
lightsaver/
├── apps/
│   └── lightsaver_user_client/    # Next.js frontend
├── services/                       # GraphQL API backend
├── infrastructure/
│   └── kratos/                    # Ory Kratos configuration
├── podman-compose.yaml            # Container orchestration
└── .env.example                   # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- Podman and Podman Compose

### Setup

1. Clone the repository and install dependencies:

   ```sh
   pnpm install
   ```

1. Copy the environment file and configure it:

   ```sh
   cp .env.example .env
   # Edit .env and set secure values for:
   # - POSTGRES_PASSWORD
   # - KRATOS_SECRETS_COOKIE
   # - KRATOS_SECRETS_CIPHER
   ```

1. Start all services with Podman Compose:

```sh
podman-compose up
```

### Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js user interface |
| GraphQL API | http://localhost:4000/graphql | Express + Apollo Server |
| Kratos Public | http://localhost:4433 | Authentication API |
| Kratos Admin | http://localhost:4434 | Kratos admin API |
| Mailhog | http://localhost:8025 | Dev email testing UI |

### Authentication

The app uses Ory Kratos for authentication with the following flows:

- **Registration**: `/auth/registration` - Create a new account
- **Login**: `/auth/login` - Sign in to your account
- **Recovery**: `/auth/recovery` - Reset forgotten password
- **Verification**: `/auth/verification` - Verify email address
- **Settings**: `/auth/settings` - Update account settings
- **Dashboard**: `/dashboard` - Protected user dashboard

### Development

Run individual services locally:

```sh
# Frontend (Next.js)
pnpm --filter lightsaver_user_client dev

# Backend (GraphQL API)
pnpm --filter api dev
```

## Docker/Podman Commands

Build and run all services:

```sh
podman-compose up --build
```

Run in detached mode:

```sh
podman-compose up -d
```

Stop all services:

```sh
podman-compose down
```

View logs:

```sh
podman-compose logs -f
```