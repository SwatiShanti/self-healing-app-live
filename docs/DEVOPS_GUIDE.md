# DevOps Implementation Guide

This document explains the DevOps tools and concepts used in this project.

## Tools Used

| Tool | Purpose |
|------|---------|
| **Git & GitHub** | Version Control. Tracks changes and triggers pipelines. |
| **Jenkins** | CI/CD Automation. Orchestrates the build and deploy process. |
| **Docker** | Containerization. Ensures the app runs effectively anywhere. |
| **Docker Compose** | Service Management. Define multi-container apps (or single complex ones) easily. |
| **Shell Scripting** | Custom automation for health checks and verification. |

## Key Concepts

### 1. Continuous Integration (CI)
Every time code is committed, it is automatically built and tested. This prevents "integration hell" where merging changes becomes difficult. In our `Jenkinsfile`, the `Build` and `Test` stages cover this.

### 2. Continuous Deployment (CD)
After passing tests, the application is automatically deployed to the production environment (the Docker host). The `Deploy` stage in our pipeline handles this by updating the running container.

### 3. Self-Healing
A core feature of robust systems. This application uses two layers of self-healing:
1.  **Process Level**: If the Node.js process crashes, Docker's `--restart always` policy ensures the container starts up again immediately.
2.  **Health Level**: The `HEALTHCHECK` instruction in the Dockerfile allows the orchestrator to know if the app is "zombie" (running but not responding) and take action.
3.  **Data Persistence**: We use a volume-mapped file (`feedbacks.json`) in the `app/data` directory so that even if the container crashes and restarts, the user feedback is preserved.

---

## 🎓 Viva / Presentation Q&A

**Q: What makes this project "Self-Healing"?**
**A:** The application runs in a Docker container with a `restart: always` policy. If the application crashes (which we can simulate via the `/crash` endpoint), the Docker Daemon detects the exit code and automatically restarts the container. Additionally, we use persistent storage via `feedbacks.json`, so no data is lost during this crash.

**Q: Why do we use Docker?**
**A:** Docker solves the "it works on my machine" problem. It packages the code, runtime (Node.js), and dependencies into a single image that runs exactly the same way on development, testing, and production servers.

**Q: How does the CI/CD pipeline work?**
**A:** I configured Jenkins to watch my GitHub repository. When I push code:
1. Jenkins pulls the changes.
2. It runs `npm install` and tests.
3. It builds a new Docker image.
4. It stops the old container and starts the new one automatically with volume mapping for data.

**Q: What is the purpose of the Health Check?**
**A:** The `/health` endpoint allows monitoring tools (like AWS CloudWatch or Docker Swarm) to periodically ping the app. If the app is stuck or "hanging", the health check fails, triggering an alert or a restart.

**Q: How do you handle data persistence?**
**A:** We write user feedback to a JSON file (`feedbacks.json`) in the `app/data` folder. In our Docker setup, this is mapped to a host volume to ensure data survives container destruction.

**Q: What is the Admin Dashboard?**
**A:** It's a secure area accessible at `/admin` where administrators can view, manage, and delete submitted feedbacks. It also shows real-time system stats like uptime and request counts.
