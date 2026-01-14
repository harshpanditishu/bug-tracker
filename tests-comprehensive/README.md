# Comprehensive Testing Suite for Bug Tracker

This directory contains comprehensive API and UI tests for the Bug Tracker application using Playwright and TypeScript.

## 📁 Directory Structure

```
tests-comprehensive/
├── api/                          # API tests
│   └── bugs-api.spec.ts         # Comprehensive API test suite
├── ui/                          # UI tests
│   ├── bugs-ui.spec.ts          # UI test suite
│   └── page-objects/            # Page Object Model
│       └── BugListPage.ts       # Bug list page POM
├── test-data/                   # Test data and fixtures
│   └── fixtures.ts              # Test data generators
├── helpers/                     # Helper utilities
│   └── api-helpers.ts           # API helper functions
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🚀 Quick Start

### Installation

```bash
cd tests-comprehensive
npm install
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run API tests only
npm run test:api

# Run UI tests only
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui-mode

# Run specific browser
npm run test:chromium

# Debug tests
npm run test:debug
```

### View Reports

```bash
# Open HTML report
npm run report

# Reports are automatically generated in:
# - playwright-report/ (HTML)
# - test-results/ (JUnit XML, JSON)
```

## 📋 Test Coverage

### API Tests (29 test cases)

#### Health Check
- ✅ TC-API-001: Health check endpoint

#### Bug Creation
- ✅ TC-API-002: Create bug with valid data
- ✅ TC-API-003: Create bug with High priority
- ✅ TC-API-004: Create bug with In Progress status
- ✅ TC-API-005: Create bug with Resolved status
- ✅ TC-API-006: Create multiple bugs
- ✅ TC-API-007: Reject bug without title
- ✅ TC-API-008: Reject bug with empty title
- ✅ TC-API-009: Reject bug with invalid status
- ✅ TC-API-010: Reject bug with invalid priority

#### Bug Retrieval
- ✅ TC-API-011: Get all bugs
- ✅ TC-API-012: Get single bug by ID
- ✅ TC-API-013: Return 404 for non-existent bug
- ✅ TC-API-014: Return 400 for invalid ID format

#### Bug Update
- ✅ TC-API-015: Update bug title
- ✅ TC-API-016: Update bug status
- ✅ TC-API-017: Update bug priority
- ✅ TC-API-018: Update multiple fields
- ✅ TC-API-019: Return 404 for non-existent bug update

#### Bug Deletion
- ✅ TC-API-020: Delete a bug
- ✅ TC-API-021: Return 404 for non-existent bug deletion
- ✅ TC-API-022: Delete all bugs

#### Comments
- ✅ TC-API-023: Create comment for bug
- ✅ TC-API-024: Get comments for bug
- ✅ TC-API-025: Return 404 for comment on non-existent bug
- ✅ TC-API-026: Return 404 for getting comments on non-existent bug

#### Edge Cases & Performance
- ✅ TC-API-027: Special characters in title
- ✅ TC-API-028: Unicode characters
- ✅ TC-API-029: Performance test (10 bugs)

### UI Tests (32 test cases)

#### Page Load
- ✅ TC-UI-001: Page loads successfully
- ✅ TC-UI-002: Add Bug button visible
- ✅ TC-UI-003: Page has proper title
- ✅ TC-UI-004: Basic accessibility check

#### Add Bug
- ✅ TC-UI-005: Open Add Bug modal
- ✅ TC-UI-006: Create bug with valid data
- ✅ TC-UI-007: Create bug with Medium priority
- ✅ TC-UI-008: Create bug with Low priority
- ✅ TC-UI-009: Create bug with In Progress status
- ✅ TC-UI-010: Close modal on cancel
- ✅ TC-UI-011: Form has required fields

#### Edit Bug
- ✅ TC-UI-012: Open edit modal with pre-filled data
- ✅ TC-UI-013: Update bug title
- ✅ TC-UI-014: Update bug priority
- ✅ TC-UI-015: Update bug status
- ✅ TC-UI-016: Update multiple fields

#### Delete Bug
- ✅ TC-UI-017: Show confirmation modal
- ✅ TC-UI-018: Delete bug on confirm
- ✅ TC-UI-019: Cancel deletion

#### Bug List
- ✅ TC-UI-020: Display multiple bugs
- ✅ TC-UI-021: Display bug with details

#### Filter & Search
- ✅ TC-UI-022: Filter by High priority
- ✅ TC-UI-023: Filter by status
- ✅ TC-UI-024: Search bugs

#### Form Validation
- ✅ TC-UI-025: Reject empty title
- ✅ TC-UI-026: Show validation message

#### Comments
- ✅ TC-UI-027: Open bug details
- ✅ TC-UI-028: Add comment

#### Responsive Design
- ✅ TC-UI-029: Mobile viewport
- ✅ TC-UI-030: Tablet viewport

#### Performance
- ✅ TC-UI-031: Page load time
- ✅ TC-UI-032: Create 5 bugs performance

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the tests-comprehensive directory:

```env
UI_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8080/api
```

### Playwright Configuration

The `playwright.config.ts` file includes:
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile testing (Pixel 5, iPhone 12)
- Automatic retries on failure (CI)
- HTML, JUnit, and JSON reporters
- Screenshots on failure
- Video recording on failure
- Trace on retry

## 📊 Reports

### HTML Report
After running tests, view the HTML report:
```bash
npx playwright show-report
```

### JUnit XML
For CI/CD integration, JUnit reports are in:
```
test-results/results.xml
```

### JSON Report
For custom processing:
```
test-results/results.json
```

## 🧪 Test Data

Test data is managed through fixtures in `test-data/fixtures.ts`:

- **Valid test data**: Pre-defined valid bugs and comments
- **Invalid test data**: For validation testing
- **Generators**: Create unique test data with timestamps
- **Edge cases**: Long strings, special characters, Unicode

## 🎯 Best Practices

1. **Test Isolation**: Each test is independent
2. **Cleanup**: Tests clean up after themselves
3. **Page Object Model**: Reusable UI interactions
4. **Descriptive Names**: Clear test case IDs and names
5. **Proper Waits**: Using Playwright's auto-waiting
6. **Assertions**: Clear and specific assertions
7. **Error Handling**: Proper error messages for debugging

## 🔧 Debugging

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui-mode
```

### Specific Test
```bash
npx playwright test -g "TC-API-001"
```

### Headed Mode
```bash
npm run test:headed
```

## 📝 Adding New Tests

1. Add test data to `test-data/fixtures.ts` if needed
2. Add helper functions to `helpers/api-helpers.ts` if needed
3. For UI tests, update `ui/page-objects/BugListPage.ts` if needed
4. Add test cases to appropriate spec file
5. Follow naming convention: `TC-{TYPE}-{NUMBER}`

## 🐛 Troubleshooting

### Tests failing to connect
```bash
# Check if application is running
curl http://localhost:8080/api/health
curl http://localhost:3000
```

### Browser not installed
```bash
npx playwright install
```

### Port already in use
Update `.env` file with correct ports

## 🚀 CI/CD Integration

### Jenkins Integration
Add to Jenkinsfile:
```groovy
stage('Run Comprehensive Tests') {
    steps {
        dir('tests-comprehensive') {
            sh 'npm install'
            sh 'npx playwright install --with-deps'
            sh 'npx playwright test --reporter=junit'
        }
    }
    post {
        always {
            junit 'tests-comprehensive/test-results/results.xml'
            publishHTML([
                reportDir: 'tests-comprehensive/playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
        }
    }
}
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## 📄 License

MIT
