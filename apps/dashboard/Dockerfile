FROM node:20-alpine AS base

RUN npm i -g pnpm turbo
RUN corepack enable


FROM base AS builder

# Set working directory
WORKDIR /formizee

COPY . .
RUN turbo prune dashboard --docker --out-dir=./dashboard-out

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /formizee

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /formizee/dashboard-out/json/ .
COPY --from=builder /formizee/dashboard-out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /formizee/dashboard-out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo build --filter=dashboard

FROM base AS runner
WORKDIR /formizee

COPY --from=installer /formizee .

WORKDIR /formizee/apps/dashboard

RUN rm .env.local || true

CMD pnpm start 
