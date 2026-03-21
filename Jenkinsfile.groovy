pipeline {
    agent any
    
    environment {
        PROJECT_DIR = "${env.HOME}/blog-deployment"
        APP_DIR = "${env.HOME}/blog-deployment/Chanveasna-ENG.github.io"
    }
    
    stages {
        stage('Checkout Workspace') {
            steps {
                retry(3) {
                    script {
                        echo 'Attempting to pull code from GitHub...'
                        git url: 'https://github.com/Chanveasna-ENG/Chanveasna-ENG.github.io.git', branch: 'main'
                    }
                }
            }
        }
        
        stage('Initialize Environment') {
            steps {
                sh '''
                # Verify Docker
                if ! command -v docker > /dev/null 2>&1; then
                    curl -fsSL https://get.docker.com | sh
                fi
                
                # Install rsync for exact file mirroring
                if ! command -v rsync > /dev/null 2>&1; then
                    sudo apt-get update && sudo apt-get install -y rsync
                fi
                
                # Ensure the deployment directories exist
                mkdir -p ${APP_DIR}
                '''
            }
        }
        
        stage('Deploy Codebase & Rebuild') {
            steps {
                sh '''
                # Mirror workspace to host directory, strictly excluding the .git folder
                rsync -a --delete --exclude='.git' ./ ${APP_DIR}/
                
                cd ${APP_DIR}
                docker compose up -d --build
                '''
            }
        }
    }
}
