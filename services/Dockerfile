FROM node:22-slim AS builder

RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y ca-certificates build-essential

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .

RUN pnpm install --filter=api...

RUN pnpm --filter=api run build || true

FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/services ./services
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/services

EXPOSE 4000

CMD ["node", "--import", "tsx", "src/index.ts"]
