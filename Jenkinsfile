pipeline {
    agent any
    
    environment {
        // Define environment variables
        IMAGE_NAME = "self-healing-app"
        CONTAINER_NAME = "self-healing-app"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // In a real scenario, this would pull from your Git repo
                // For this project folder, we assume the workspace is already populated or pulled
                checkout scm
                echo 'Code checked out from Source Control Management'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running Unit Tests...'
                // A basic check to ensure syntax is correct or similar
                dir('app') {
                    sh 'npm test'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh "docker build -t ${IMAGE_NAME}:latest ."
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying Application...'
                    // Ensure the persistent data directory exists on the host
                    sh "mkdir -p ${WORKSPACE}/app/data"
                    
                    // Stop and remove existing container if it exists
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    
                    // Run the new container with restart policy and volumes
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 80:3000 \
                        -e ADMIN_PASSWORD=admin123 \
                        -v ${WORKSPACE}/app/data:/usr/src/app/data \
                        --restart always \
                        ${IMAGE_NAME}:latest
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sleep 5 // Wait for container to spin up
                script {
                    def status = sh(script: "docker inspect -f '{{.State.Running}}' ${CONTAINER_NAME}", returnStdout: true).trim()
                    if (status == 'true') {
                        echo "Deployment Verified: Container is RUNNING."
                    } else {
                        error "Deployment Verification Failed: Container is NOT running."
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
    }
}
