# syntax=docker/dockerfile:1.6
#
# Bellavista Coffee — multi-stage Next.js 14 build.
#
# Targets a 2 GB Lightsail VPS running alongside n8n (ADR-004).
# Uses Next's `output: "standalone"` to produce a minimal runtime image.
#
# Build locally OR on-server:
#   docker build -t bellavista-app:latest .
#
# If on-server build pushes RAM past ~85%, switch to B11B (GitHub
# Actions + GHCR). See docs/deploy.md.

# ----- deps -----
FROM node:20-alpine AS deps
WORKDIR /app
# Install only what package.json declares. Cache layer.
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# ----- builder -----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# prebuild runs the Zod content validator; build produces .next/standalone/
RUN npm run build

# ----- runner -----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Non-root user for the runtime.
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# Standalone output includes a pruned server.js + minimal node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Content is read at request time by lib/journal.ts — must ship with image.
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
