pipeline {
    agent any

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
                    npm install -g netlify-cli
                    node_modules/.bin/netlify --version
                '''
            }
        }
    }
}