pipeline {
    agent any

    stages {
        stage('w/o docker') {
            steps {
                sh '''
                echo "without docker"
                ls -la
                touch container-no.txt
                '''
            }
        }
        stage('w/ docker') {
            agent {
                docker{
                image 'node:18-alpine'
                reuseNode true
                }
            }
            steps {
                sh '''
                ls -la
                echo "with docker"
                touch container-yes.txt
                '''
            }
        }
    }
}