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
                script {

                    def testExitCode = bat(
                        script: '''
                        set PATH=C:\\Users\\sssurya\\nodejs;%PATH%

                        npx playwright test --workers=1 --retries=0
                        ''',
                        returnStatus: true
                    )

                    env.TEST_EXIT_CODE = testExitCode.toString()

                    echo "Playwright Exit Code = ${testExitCode}"
                }
            }
        }

        stage('Verify JSON Report') {
            steps {
                script {

                    if (fileExists('playwright-results.json')) {
                        echo 'playwright-results.json generated successfully'
                    } else {
                        error 'playwright-results.json not found'
                    }

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

        stage('Publish Allure Report') {
            steps {
                allure(
                    includeProperties: false,
                    jdk: '',
                    commandline: 'allure',
                    results: [[path: 'allure-results']]
                )
            }
        }

    }

    post {

        always {

            script {

                def jsonText = readFile('playwright-results.json')
                def results = readJSON text: jsonText

                def passedCount = results.stats.expected
                def failedCount = results.stats.unexpected
                def totalCount = passedCount + failedCount

                if (failedCount > 0) {
                    currentBuild.result = 'FAILURE'
                } else {
                    currentBuild.result = 'SUCCESS'
                }

                def allureUrl = "${env.BUILD_URL}allure/"
                def buildUrl = "${env.BUILD_URL}"

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
    },
    {
      "type": "TextBlock",
      "text": "Total Tests: ${totalCount}"
    },
    {
      "type": "TextBlock",
      "text": "Passed: ${passedCount}"
    },
    {
      "type": "TextBlock",
      "text": "Failed: ${failedCount}"
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "Open Allure Report",
      "url": "${allureUrl}"
    },
    {
      "type": "Action.OpenUrl",
      "title": "Open Jenkins Build",
      "url": "${buildUrl}"
    }
  ]
}
"""

                withCredentials([
                    string(
                        credentialsId: 'teams-webhook',
                        variable: 'TEAMS_WEBHOOK'
                    )
                ]) {

                    powershell '''
Invoke-RestMethod `
  -Uri $env:TEAMS_WEBHOOK `
  -Method POST `
  -ContentType "application/json" `
  -InFile teams.json

Write-Host "Teams notification sent successfully"
'''
                }

                echo "Total Tests : ${totalCount}"
                echo "Passed Tests: ${passedCount}"
                echo "Failed Tests: ${failedCount}"
            }

            echo 'Pipeline Completed'
        }

        success {
            echo 'Pipeline Succeeded'
        }

        failure {
            echo 'Pipeline Failed'
        }
    }
}
