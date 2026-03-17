# Use a lightweight Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY app/package*.json ./
RUN npm install

# Copy application source
COPY app/ .

# Ensure persistent data directory exists
RUN mkdir -p data

# Expose the application port
EXPOSE 3000

# Add a healthcheck instruction to the image (optional, but good practice alongside Compose)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD [ "npm", "start" ]
