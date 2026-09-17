pipeline {

    agent {
        label 'PAD'
    }

    stages {

        stage('User Check') {
            steps {
                bat '''
                whoami
                hostname
                '''
            }
        }

        stage('Verify Node') {
            steps {
                bat '"C:\\Users\\sssurya\\nodejs\\node.exe" -v'
                bat '"C:\\Users\\sssurya\\nodejs\\npm.cmd" -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '"C:\\Users\\sssurya\\nodejs\\npm.cmd" install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat '''
                set PATH=C:\\Users\\sssurya\\nodejs;%PATH%

                node -v
                npm -v

                npx playwright install
                '''
            }
        }

        stage('Clean Allure Results') {
            steps {
                bat '''
                if exist allure-results rmdir /s /q allure-results
                if exist allure-report rmdir /s /q allure-report
                '''
            }
        }

        stage('Launch Calculator') {
            steps {
                bat '''
                echo Launching Calculator...
                start calc.exe
                ping 127.0.0.1 -n 5 > nul
                '''
            }
        }

        stage('Launch Notepad') {
            steps {
                bat '''
                echo Launching Notepad...
                start notepad.exe
                ping 127.0.0.1 -n 5 > nul
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat '''
                set PATH=C:\\Users\\sssurya\\nodejs;%PATH%

                npx playwright test tests/example.spec.ts tests/poc.spec.ts tests/google_dummy.spec.ts tests/dumm1_sauce_menu.spec.ts --workers=1 --retries=0
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat '''
                C:\\Users\\sssurya\\nodejs\\allure.cmd generate allure-results --clean -o allure-report
                '''
            }
        }
    }

    post {

        success {
            bat '''
            start "" cmd /k "C:\\JenkinsAgent\\StartAllure.bat"
            '''
            echo 'Pipeline Succeeded'
        }

        failure {
            echo 'Pipeline Failed'
        }

        always {

            script {

                withCredentials([string(credentialsId: 'teams-webhook', variable: 'TEAMS_WEBHOOK')]) {

                    powershell """
                    \$body = @{
                        title = 'Jenkins Automation Execution'
                        text  = 'Status: ${currentBuild.currentResult}`n' +
                                 'Job: ${env.JOB_NAME}`n' +
                                 'Build Number: ${env.BUILD_NUMBER}`n' +
                                 'Jenkins URL: ${env.BUILD_URL}`n' +
                                 'Allure Report: ${env.BUILD_URL}allure/'
                    } | ConvertTo-Json

                    Invoke-RestMethod `
                        -Uri \$env:TEAMS_WEBHOOK `
                        -Method Post `
                        -ContentType 'application/json' `
                        -Body \$body
                    """
                }
            }

            echo 'Pipeline Completed'
        }
    }
}
