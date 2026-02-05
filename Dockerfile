# Stage 1: Build the Frontend
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy root package files
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Go back to root and copy built frontend + backend source
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY backend/ ./backend/

# Environment settings
ENV NODE_ENV=production
ENV PORT=5000

# Expose the API and static serving port
EXPOSE 5000

WORKDIR /app/backend
CMD ["npm", "start"]
