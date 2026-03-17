# Self-Healing Web Application with CI/CD

A full-stack Node.js application demonstrating modern DevOps practices: **Containerization, Automation, and Self-Healing**.

## 🚀 Features
- **Modern UI**: Feedback/Issue reporting form with glassmorphism design.
- **Dockerized**: Fully containerized for consistent environments.
- **Self-Healing**: Automatically recovers from crashes using Docker restart policies.
- **CI/CD**: Jenkins pipeline for automated testing and deployment.
- **Health Monitoring**: Built-in health check endpoints and scripts.

## 📂 Project Structure
```
.
├── app/                  # Application Source Code
│   ├── public/           # Frontend (HTML/CSS)
│   ├── index.js          # Backend Server
│   └── package.json      # Node Dependencies
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # System Design
│   └── DEVOPS_GUIDE.md   # Tool Explanations
├── scripts/              # Helper Scripts
│   └── healthcheck.sh    # Health Monitor
├── Dockerfile            # Container Definition
├── docker-compose.yml    # Service Definition
└── Jenkinsfile           # CI/CD Pipeline Definition
```

## 🛠️ Quick Start

### Prerequisites
- Docker & Docker Compose
- (Optional) Jenkins for pipeline usage

### Run Locally (Manual)
1. **Clone the repo** (or use this folder).
2. **Start with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```
3. **Access the App**: Open [http://localhost](http://localhost).
4. **View Logs**:
   ```bash
   docker-compose logs -f
   ```

### Run Locally (Without Docker)
```bash
cd app
npm install
node index.js
# Access at http://localhost:3000
```

## 🧪 Testing Self-Healing
1. Ensure the app is running via Docker.
2. Visit the **Crash Endpoint**: [http://localhost/crash](http://localhost/crash).
3. The browser will show an error (connection reset).
4. Wait 1-2 seconds and refresh [http://localhost](http://localhost).
5. The site will be back online automatically!

## 🛡️ Admin Dashboard
Access the new Admin Panel at [http://localhost/admin](http://localhost/admin).
- **Default Password**: `admin123` (Configure via `ADMIN_PASSWORD` env variable).
- **Features**: View all submitted feedbacks, resolve/delete issues, and monitor live system stats.

## 🌐 Live Deployment Guide
To make this website live for the world to see:

### 1. Cloud Server Setup
- Provision a Linux VM (AWS EC2, DigitalOcean Droplet, etc.).
- Install Docker and Docker Compose.

### 2. Deploy via Docker
1. Transfer the project files to the server.
2. Update the `ADMIN_PASSWORD` in `docker-compose.yml`.
3. Run:
   ```bash
   docker-compose up -d --build
   ```

### 3. Networking
- Ensure port 80 (and 443 for SSL) is open in your server's security group/firewall.
- For a custom domain, point your domain's **A Record** to the server's public IP.

### 4. CI/CD (Optional but Recommended)
- Use the included `Jenkinsfile` to automate deployments whenever you push code to your repository.

---
*Created for DevOps College Final Project / Live Project Demonstration.*
