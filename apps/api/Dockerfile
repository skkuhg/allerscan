# Multi-stage build for Express backend
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages
COPY pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --filter=@allerscan/api...

# Build stage
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Copy source files
COPY . .

# Generate Prisma client
RUN cd apps/api && pnpm db:generate

# Build the application
RUN pnpm build --filter=@allerscan/api

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express

# Copy built application
COPY --from=builder --chown=express:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=express:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=builder --chown=express:nodejs /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder --chown=express:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=express:nodejs /app/packages ./packages

# Switch to non-root user
USER express

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "apps/api/dist/index.js"]