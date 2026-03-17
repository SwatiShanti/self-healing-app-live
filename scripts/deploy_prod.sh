#!/bin/bash

# Self-Healing Web App - Production Deployment Script
# This script prepares the server and starts the application using Docker Compose.

set -e

echo "🚀 Starting Production Deployment..."

# 1. Ensure Docker is installed (Basic check)
if ! [ -x "$(command -v docker)" ]; then
  echo "❌ Error: Docker is not installed. Please install Docker first." >&2
  exit 1
fi

# 2. Setup environment
echo "📁 Preparing data directory..."
mkdir -p app/data
chmod 777 app/data

# 3. Handle Admin Password
if [ -z "$ADMIN_PASSWORD" ]; then
    echo "⚠️  WARNING: ADMIN_PASSWORD environment variable is not set."
    echo "👉 Using default: 'admin123'. PLEASE CHANGE THIS LATER!"
    export ADMIN_PASSWORD="admin123"
fi

# 4. Build and Start
echo "🏗️  Building and starting containers..."
docker-compose down --remove-orphans || true
docker-compose up -d --build

echo "✅ Deployment Successful!"
echo "🌐 Your app should now be live."
echo "📊 Monitoring logs (Ctrl+C to exit):"
docker-compose logs -f
