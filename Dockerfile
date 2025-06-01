# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy demo files to root
COPY demo-get-fcm-token/index.html ./
COPY demo-get-fcm-token/firebase-config.js ./
COPY demo-get-fcm-token/firebase-messaging-sw.js ./

# Copy and set up the environment replacement script
COPY replace-env.sh ./
RUN chmod +x /app/replace-env.sh

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start application with environment variable replacement
CMD ["/bin/sh", "-c", "/app/replace-env.sh && npm run start:prod"]