# Allure Test Report Setup for Jenkins

This guide explains how to configure Allure test reporting for both backend (Go) and frontend (Jest) tests in Jenkins.

## Prerequisites

### 1. Install Allure Plugin in Jenkins

1. Go to **Jenkins** → **Manage Jenkins** → **Plugins**
2. Search for **Allure**
3. Install the **Allure** plugin
4. Restart Jenkins if required

### 2. Configure Allure Commandline Tool

1. Go to **Jenkins** → **Manage Jenkins** → **Tools**
2. Scroll to **Allure Commandline** section
3. Click **Add Allure Commandline**
4. Set:
   - **Name**: `allure`
   - **Install automatically**: Check this option
   - Select latest version from the dropdown
5. Click **Save**

## Test Report Configuration

### Backend (Go Tests)

The backend uses `go-junit-report` to convert Go test output to JUnit XML format:

```bash
go test -v ./... 2>&1 | tee test-output.log
go-junit-report -in test-output.log -out test-results.xml
```

The Docker image `snakee/golang-junit:1.21` includes `go-junit-report` pre-installed.

**Output**: `bugtracker-backend/test-results.xml`

### Frontend (Jest Tests)

The frontend is already configured with `jest-junit` reporter in `package.json`:

```json
{
  "jest-junit": {
    "outputDirectory": ".",
    "outputName": "test-results.xml"
  }
}
```

**Output**: `bugtracker-frontend/test-results.xml`

## Jenkinsfile Configuration

The pipeline includes:

1. **Per-stage test result collection**:
   ```groovy
   post {
       always {
           junit allowEmptyResults: true, testResults: 'test-results.xml'
       }
   }
   ```

2. **Global Allure report publishing**:
   ```groovy
   post {
       always {
           allure([
               reportBuildPolicy: 'ALWAYS',
               results: [[path: 'bugtracker-backend/test-results.xml'], 
                        [path: 'bugtracker-frontend/test-results.xml']]
           ])
       }
   }
   ```

## Viewing Reports

After running the pipeline:

1. Go to your Jenkins job
2. Click on the build number
3. Click **Allure Report** in the left sidebar
4. View comprehensive test results with:
   - Test overview and statistics
   - Test suites and individual test details
   - Trends across builds
   - Categories and behaviors
   - Timeline

## Alternative: Using Allure Results Format

For more detailed Allure reports with history and trends, you can configure tests to generate native Allure results instead of JUnit XML:

### Frontend with Allure

Install Allure Jest reporter:
```bash
cd bugtracker-frontend
npm install --save-dev jest-allure
```

Update `jest.config.ts`:
```typescript
reporters: [
  'default',
  ['jest-allure', { outputDirectory: 'allure-results' }]
]
```

### Backend with Allure

Install Allure Go:
```bash
go get github.com/dailymotion/allure-go
```

Then update test files to use Allure annotations.

### Update Jenkinsfile for Allure Results

```groovy
post {
    always {
        allure([
            includeProperties: false,
            jdk: '',
            properties: [],
            reportBuildPolicy: 'ALWAYS',
            results: [[path: 'bugtracker-backend/allure-results'], 
                     [path: 'bugtracker-frontend/allure-results']]
        ])
    }
}
```

## Troubleshooting

### "Allure commandline not found"
- Ensure Allure Commandline is configured in Jenkins Tools
- Verify the tool name matches what's used in pipeline

### "No test results found"
- Check that test-results.xml files are being generated
- Verify paths in the Allure configuration
- Use `archiveArtifacts` to save test results for debugging:
  ```groovy
  archiveArtifacts artifacts: '**/test-results.xml', allowEmptyArchive: true
  ```

### Permission Issues
- Ensure Docker containers have write permissions to the workspace
- The current configuration uses `reuseNode true` to avoid volume permission issues

## Benefits of Allure Reports

- **Rich Visualizations**: Graphs, charts, and statistics
- **Historical Trends**: Track test performance over time
- **Detailed Test Information**: Steps, attachments, parameters
- **Categorization**: Group tests by features, behaviors, or tags
- **Easy Navigation**: Filter and search through test results
- **Build Comparison**: Compare test results across different builds
