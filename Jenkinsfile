pipeline {
    agent any

    stages {
        stage('install dependencies') {
            agent {
                docker {
                image 'node:18-alpine'
                reuseNode true
                }
            }
            steps {
                sh '''
                    npm install
                '''
            }
        }
        stage('Test') {
            agent {
                docker {
                image 'node:18-alpine'
                reuseNode true
                }
            }
            steps {
                sh '''
                    test -f server.js
                    npm test
                '''
            }
        }
        stage('deploy') {
            steps {
                echo "step ini untuk deploy"
            }
        }
    }
}