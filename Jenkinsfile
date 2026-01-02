pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "codetech-backend"
        CLIENT_IMAGE  = "codetech-client"
        DOCKER_USER   = "arya51090"   // 👈 DockerHub ID hard-coded
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Pulling code from GitHub"
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images"
                sh 'docker compose build'
            }
        }

        stage('DockerHub Login') {
            steps {
                echo "🔐 Login to DockerHub"
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'IGNORE_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u arya51090 --password-stdin
                    '''
                }
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                echo "📤 Pushing images to DockerHub"
                sh '''
                docker tag codetech-backend:latest arya51090/codetech-backend:latest
                docker tag codetech-client:latest  arya51090/codetech-client:latest

                docker push arya51090/codetech-backend:latest
                docker push arya51090/codetech-client:latest
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                echo "🚀 Deploying application"
                sh '''
                docker compose down || true
                docker compose up -d
                '''
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
