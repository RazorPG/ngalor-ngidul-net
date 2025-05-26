pipeline {
    agent any

    stages {
        stage('Test') {
            agent {
                docker {
                image 'node:18-alpine'
                reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    test -f server.js
                '''
            }
        }
        stage('Deploy') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "deploying..."
                    npm install -g netlify-cli
                    netlify --version
                '''
            }
        }
    }
}