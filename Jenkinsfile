pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'codetech-backend'
        DOCKER_IMAGE_CLIENT = 'codetech-client'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Check if run on Windows or Linux for proper command usage
                    if (isUnix()) {
                        sh 'docker-compose build'
                    } else {
                        bat 'docker-compose build'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                     if (isUnix()) {
                        sh 'docker-compose up -d'
                    } else {
                        bat 'docker-compose up -d'
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
