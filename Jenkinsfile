pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = "codetech-backend"
        CLIENT_IMAGE   = "codetech-client"
        DOCKERHUB_USER = credentials('dockerhub').username
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Pulling code from GitHub"
                checkout scm   // 👈 GitHub credential (ID: Github) automatically use hota hai
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images"
                script {
                    if (isUnix()) {
                        sh 'docker compose build'
                    } else {
                        bat 'docker compose build'
                    }
                }
            }
        }

        stage('DockerHub Login') {
            steps {
                echo "🔐 Login to DockerHub"
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                echo "📤 Pushing images to DockerHub"
                script {
                    sh '''
                    docker tag codetech-backend:latest $DOCKER_USER/codetech-backend:latest
                    docker tag codetech-client:latest  $DOCKER_USER/codetech-client:latest

                    docker push $DOCKER_USER/codetech-backend:latest
                    docker push $DOCKER_USER/codetech-client:latest
                    '''
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                echo "🚀 Deploying application"
                script {
                    if (isUnix()) {
                        sh '''
                        docker compose down || true
                        docker compose up -d
                        '''
                    } else {
                        bat '''
                        docker compose down
                        docker compose up -d
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD completed successfully"
        }
        failure {
            echo "❌ CI/CD failed"
        }
        always {
            cleanWs()
        }
    }
}
