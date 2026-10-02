# ---------- Stage 1: build the React frontend ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: production image ----------
FROM node:20-alpine
ENV NODE_ENV=production
# Defaults for non-secret config. Override with -e at runtime. Secrets (keys, AUTH_SECRET) are NOT set here.
ENV PORT=3000 \
    AWS_REGION=us-east-1 \
    S3_BUCKET_NAME=s3-simple-image-demo-ismail-2026 \
    DYNAMODB_USERS_TABLE=Users \
    DYNAMODB_MEMORIES_TABLE=Memories
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Backend code
COPY server.js ./
COPY src ./src

# Built frontend from stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY public ./public

# Run as non-root
USER node

EXPOSE 3000

CMD ["node", "server.js"]
