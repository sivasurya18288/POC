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

                npx playwright test tests/examples.spec.ts tests/poc.spec.ts tests/google_dummy.spec.ts tests/dummy_sauce_menu.spec.ts --workers=1 --retries=0 --reporter=json > playwright-results.json
                '''
            }
        }

        stage('Parse Playwright Results') {
            steps {
                script {

                    def jsonText = readFile('playwright-results.json')

                    echo "Playwright JSON Report Generated"

                    echo jsonText.substring(
                        0,
                        Math.min(500, jsonText.length())
                    )
                }
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

                writeFile file: 'teams.json', text: """
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "TextBlock",
      "size": "Large",
      "weight": "Bolder",
      "text": "Automation Execution Summary"
    },
    {
      "type": "TextBlock",
      "text": "Status: ${currentBuild.currentResult}"
    },
    {
      "type": "TextBlock",
      "text": "Build Number: ${env.BUILD_NUMBER}"
    }
  ]
}
"""

                withCredentials([string(credentialsId: 'teams-webhook', variable: 'TEAMS_WEBHOOK')]) {

                    powershell '''
Invoke-RestMethod `
  -Uri $env:TEAMS_WEBHOOK `
  -Method POST `
  -ContentType "application/json" `
  -InFile teams.json

Write-Host "Teams notification sent successfully"
'''
                }
            }

            echo 'Pipeline Completed'
        }
    }
}
