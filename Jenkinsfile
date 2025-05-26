pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = '6c73b0b8-4a8d-4035-a8b7-2d22ceb52623'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
                stash includes: 'node_modules/**', name: 'deps'
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
                unstash 'deps'
                sh '''
                    echo "deploying..."
                    npm install netlify-cli
                    node_modules/.bin/netlify --version
                    echo "site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status                   
                '''
            }
        }
    }
}