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
        stage('test') {
            steps {
                sh 'npx eslint .'
            }
        }
        stage('deploy') {
            steps {
                echo "step ini untuk deploy"
            }
        }
    }
}