#!/bin/bash

# Configuration
URL="http://localhost/health"
CONTAINER_NAME="self-healing-app"

# Check status
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ "$STATUS" -eq 200 ]; then
    echo "$(date): Health Check PASSED. Application is running."
else
    echo "$(date): Health Check FAILED (Status: $STATUS). Attempting self-healing..."
    
    # Self-Healing Action
    docker restart $CONTAINER_NAME
    
    if [ $? -eq 0 ]; then
        echo "$(date): Container restarted successfully."
    else
        echo "$(date): Failed to restart container. Immediate attention required!"
    fi
fi
