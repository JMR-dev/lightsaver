# Production Build - Podman Compatible
# 1. Build stage
FROM docker.io/library/node:22-slim AS builder

ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=22

# Install dependencies for Node
RUN apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y ca-certificates build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/lightsaver_user_client/package.json ./apps/lightsaver_user_client/
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/lightsaver_user_client ./apps/lightsaver_user_client

# Build the application
RUN pnpm turbo run build --filter=lightsaver_user_client...

# 2. Production stage
FROM docker.io/library/node:22-slim

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/apps/lightsaver_user_client/.next ./apps/lightsaver_user_client/.next
COPY --from=builder /app/apps/lightsaver_user_client/public ./apps/lightsaver_user_client/public
COPY --from=builder /app/apps/lightsaver_user_client/package.json ./apps/lightsaver_user_client/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./

EXPOSE 3000

# Run the production server
CMD ["node_modules/.bin/next", "start", "apps/lightsaver_user_client"]