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

# Copy Firebase files
COPY firebase ./public/firebase

# Copy index.html and Firebase files to root
COPY firebase/index.html ./
COPY firebase/firebase-config.js ./
COPY firebase/firebase-messaging-sw.js ./

# Copy and set up the environment replacement script
COPY replace-env.sh ./
RUN chmod +x /app/replace-env.sh

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start application with environment variable replacement
CMD ["/bin/sh", "-c", "/app/replace-env.sh && npm run start:prod"]