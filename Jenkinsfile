pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel-token')
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
                    npm install vercel
                    node_modules/.bin/vercel --version
                    npx vercel --token $VERCEL_TOKEN --prod --confirm --cwd .
                    node_modules/.bin/vercel status
                    echo "deployed successfully"                   
                '''
            }
        }
    }
}