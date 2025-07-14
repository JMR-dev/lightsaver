# 1. Build stage
FROM node:22-slim AS builder

ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=22

# Install dependencies for Node
RUN apt-get update &&  apt-get dist-upgrade -y && apt-get install -y ca-certificates build-essential 

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .

RUN rm -rf node_modules pnpm-lock.yaml
RUN yes | pnpm install

RUN pnpm turbo run build --filter=lightsaver_user_client...

#debugging
RUN ls -al /app/apps/lightsaver_user_client

# 2. Production stage
FROM node:22-slim

# Enable corepack and prepare pnpm

WORKDIR /app

COPY --from=builder /app/apps/lightsaver_user_client ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3000