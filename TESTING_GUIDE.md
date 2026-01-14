# Bug Tracker - Comprehensive Testing Guide
## Using Microsoft Playwright MCP for API & UI Testing

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Master Prompt for Test Generation](#master-prompt-for-test-generation)
4. [Manual Test Cases](#manual-test-cases)
5. [Test Execution](#test-execution)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Bug Tracker application running (Backend on port 8080, Frontend on port 3000)
- ✅ Microsoft Playwright MCP browser tools activated in VS Code
- ✅ Node.js and npm installed
- ✅ TypeScript knowledge (basic)

---

## Step-by-Step Setup

### Step 1: Activate Playwright MCP Browser Tools
```
Ask Copilot to activate the browser interaction tools:
"Activate the browser interaction and page capture tools for Playwright MCP"
```

### Step 2: Start Your Application
```bash
# Terminal 1 - Backend
cd bugtracker-backend
go run cmd/bugtracker/main.go

# Terminal 2 - Frontend
cd bugtracker-frontend
npm install
npm run dev

# Terminal 3 - Docker Compose (Alternative)
docker compose up --build
```

### Step 3: Verify Application is Running
- Backend Health: http://localhost:8080/api/health
- Frontend UI: http://localhost:3000

### Step 4: Create Test Directories Structure
```bash
mkdir -p tests-comprehensive/api
mkdir -p tests-comprehensive/ui
mkdir -p tests-comprehensive/test-data
mkdir -p tests-comprehensive/reports
```

---

## Master Prompt for Test Generation

### 🎯 Master Prompt - Part 1: Application Exploration & Manual Test Cases

```
I need you to thoroughly explore and test my Bug Tracker application using Microsoft Playwright MCP browser tools. Please follow these steps systematically:

STEP 1 - APPLICATION EXPLORATION:
1. Navigate to http://localhost:3000 and take an accessibility snapshot
2. Identify all UI elements: buttons, forms, input fields, lists, modals
3. Document the visual layout and component hierarchy
4. Take screenshots of the initial state

STEP 2 - FEATURE DISCOVERY & INTERACTION:
For the Bug Tracker application, systematically test these workflows:

A. BUG MANAGEMENT FEATURES:
   1. Creating a new bug (look for "Add Bug" or "Create" button)
   2. Viewing bug list
   3. Editing existing bugs
   4. Deleting bugs
   5. Filtering/sorting bugs by status and priority
   
B. BUG DETAILS:
   1. View individual bug details
   2. Check status options: Open, In Progress, Resolved
   3. Check priority levels: Low, Medium, High
   
C. COMMENTS FEATURE:
   1. Adding comments to bugs
   2. Viewing comments list
   3. Comment timestamps and metadata

STEP 3 - DATA VALIDATION:
For each feature you test:
1. Document required fields and validation rules
2. Test with valid and invalid data
3. Note error messages and validation feedback
4. Verify data persistence (refresh page and check if data remains)

STEP 4 - CREATE MANUAL TEST CASES DOCUMENT:
Based on your exploration, create a detailed manual test cases document with:
- Test Case ID
- Test Scenario Name
- Prerequisites
- Test Steps (numbered and detailed)
- Expected Results
- Test Data needed
- Priority (High/Medium/Low)

Format the output as a comprehensive markdown document saved to: 
tests-comprehensive/MANUAL_TEST_CASES.md

STEP 5 - API ENDPOINT DISCOVERY:
1. Monitor network requests in browser console
2. Document all API endpoints called
3. Note request/response formats
4. Identify authentication requirements (if any)

Please start with Step 1 and proceed methodically through each step. After each major step, show me what you've discovered before moving to the next step.
```

---

### 🎯 Master Prompt - Part 2: Automated Test Script Generation

```
Now that we have the manual test cases documented, please generate comprehensive TypeScript Playwright test scripts:

REQUIREMENTS:

1. API TEST SUITE (tests-comprehensive/api/bugs-api.spec.ts):
   Create tests for:
   - Health check endpoint
   - CRUD operations for bugs (Create, Read, Update, Delete)
   - Validation testing (missing fields, invalid data)
   - Comments API (create, get comments)
   - Bulk operations (delete all bugs)
   - Error handling scenarios
   - Response schema validation

2. UI TEST SUITE (tests-comprehensive/ui/bugs-ui.spec.ts):
   Create tests for:
   - Page load and initial render
   - Add new bug workflow (full form interaction)
   - Edit bug functionality
   - Delete bug with confirmation
   - Status and priority filtering
   - Search/filter functionality
   - Comment section interaction
   - Form validation (client-side)
   - Visual regression checks
   - Accessibility checks

3. TEST DATA MANAGEMENT (tests-comprehensive/test-data/):
   - Create fixtures for valid bug data
   - Create fixtures for invalid data
   - Create helper functions for test data generation

4. CONFIGURATION:
   - Playwright config with proper timeouts
   - Base URL configuration
   - Reporters (HTML, JUnit, JSON)
   - Parallel execution settings
   - Retry logic for flaky tests

5. BEST PRACTICES:
   - Use Page Object Model (POM) pattern
   - Implement proper waits and assertions
   - Add descriptive test names
   - Include before/after hooks for cleanup
   - Use fixtures for test isolation
   - Add comments explaining complex interactions
   - Implement proper error handling

6. UTILITIES:
   - API helper functions
   - Custom assertions
   - Test data generators
   - Screenshot and video on failure

Please generate all files with complete, production-ready code. Include:
- Proper TypeScript types
- ESLint/Prettier compatible formatting
- Comprehensive assertions
- Error messages that help debug failures
- Setup and teardown logic
```

---

## Manual Test Cases

Below is a template. The actual test cases will be generated by the Master Prompt above.

### API Test Cases

#### TC-API-001: Health Check Endpoint
**Priority:** High  
**Endpoint:** GET /api/health

**Test Steps:**
1. Send GET request to /api/health
2. Verify response status is 200
3. Verify response body contains `{"status": "ok"}`

**Expected Result:** API returns healthy status

---

#### TC-API-002: Create Bug - Valid Data
**Priority:** High  
**Endpoint:** POST /api/bugs

**Test Data:**
```json
{
  "title": "Test Bug",
  "description": "Bug description",
  "status": "Open",
  "priority": "High"
}
```

**Test Steps:**
1. Send POST request with valid bug data
2. Verify response status is 200/201
3. Verify response contains all fields including generated ID
4. Verify timestamps are present (created_at, updated_at)

**Expected Result:** Bug is created successfully with ID returned

---

#### TC-API-003: Create Bug - Missing Title
**Priority:** High  
**Endpoint:** POST /api/bugs

**Test Data:**
```json
{
  "description": "Bug without title",
  "status": "Open",
  "priority": "Medium"
}
```

**Test Steps:**
1. Send POST request with missing title
2. Verify response status is 400
3. Verify error message indicates title is required

**Expected Result:** Request fails with validation error

---

### UI Test Cases

#### TC-UI-001: Load Bug List Page
**Priority:** High  
**Page:** Home Page (/)

**Test Steps:**
1. Navigate to http://localhost:3000
2. Wait for page to load completely
3. Verify page title/header is visible
4. Verify bug list component is rendered
5. Verify "Add Bug" button is visible

**Expected Result:** Page loads successfully with all components visible

---

#### TC-UI-002: Add New Bug
**Priority:** High  
**Page:** Home Page with Add Bug Modal

**Test Steps:**
1. Click "Add Bug" button
2. Verify modal/form opens
3. Fill in title field: "UI Test Bug"
4. Fill in description: "Created by automated test"
5. Select status: "Open"
6. Select priority: "High"
7. Click "Submit" or "Create" button
8. Wait for modal to close
9. Verify new bug appears in the list
10. Verify bug details match entered data

**Expected Result:** Bug is created and visible in the list

---

#### TC-UI-003: Edit Existing Bug
**Priority:** High  

**Prerequisites:** At least one bug exists

**Test Steps:**
1. Locate a bug in the list
2. Click "Edit" button/icon for the bug
3. Verify edit modal opens with pre-filled data
4. Change title to "Updated Title"
5. Change priority to "Low"
6. Click "Save" or "Update" button
7. Verify modal closes
8. Verify bug list shows updated information

**Expected Result:** Bug is updated successfully

---

#### TC-UI-004: Delete Bug with Confirmation
**Priority:** High  

**Prerequisites:** At least one bug exists

**Test Steps:**
1. Locate a bug in the list
2. Click "Delete" button/icon
3. Verify confirmation modal appears
4. Verify modal asks for confirmation
5. Click "Confirm" or "Yes" button
6. Wait for modal to close
7. Verify bug is removed from the list

**Expected Result:** Bug is deleted after confirmation

---

## Test Execution

### Running API Tests
```bash
cd tests-comprehensive
npm install
npx playwright test api/ --reporter=html
```

### Running UI Tests
```bash
npx playwright test ui/ --headed
npx playwright test ui/ --project=chromium
```

### Running All Tests
```bash
npx playwright test --reporter=html,junit
```

### Debugging Tests
```bash
npx playwright test --debug
npx playwright test --ui
```

### Generate Test Report
```bash
npx playwright show-report
```

---

## Test Data Examples

### Valid Bug Object
```typescript
const validBug = {
  title: "Critical Login Issue",
  description: "Users cannot login with correct credentials",
  status: "Open",
  priority: "High"
};
```

### Invalid Bug Objects
```typescript
// Missing title
const invalidBug1 = {
  description: "No title provided",
  status: "Open",
  priority: "Medium"
};

// Invalid status
const invalidBug2 = {
  title: "Test",
  description: "Invalid status",
  status: "InvalidStatus",
  priority: "Low"
};

// Invalid priority
const invalidBug3 = {
  title: "Test",
  description: "Invalid priority",
  status: "Open",
  priority: "Critical" // Should be Low, Medium, or High
};
```

---

## Expected Test Coverage

### API Tests Coverage:
- ✅ Health check
- ✅ Create bug (valid data)
- ✅ Create bug (validation errors)
- ✅ Get all bugs
- ✅ Get single bug by ID
- ✅ Update bug
- ✅ Delete bug
- ✅ Delete all bugs
- ✅ Get comments for bug
- ✅ Create comment for bug
- ✅ Error handling (404, 400, 500)

### UI Tests Coverage:
- ✅ Page load and rendering
- ✅ Add bug workflow
- ✅ Edit bug workflow
- ✅ Delete bug workflow
- ✅ Filter by status
- ✅ Filter by priority
- ✅ Comment interaction
- ✅ Form validation
- ✅ Modal interactions
- ✅ Data persistence

---

## Notes

1. **Test Isolation:** Each test should be independent and not rely on data from other tests
2. **Cleanup:** Always clean up test data after tests complete
3. **Parallel Execution:** Configure workers carefully to avoid race conditions
4. **Screenshots:** Automatically captured on failure for debugging
5. **Retry Logic:** Configure retries for flaky tests (max 2 retries recommended)

---

## ✅ Ready-to-Use Test Suite Available!

**Great news!** A complete test suite has already been created for you in the `tests-comprehensive/` directory!

### What's Included:
- ✅ **29 API Tests** - Complete CRUD operations, validation, error handling
- ✅ **32 UI Tests** - All user workflows, forms, modals, filtering
- ✅ **Page Object Model** - Maintainable UI test architecture
- ✅ **Test Data Fixtures** - Reusable test data generators
- ✅ **Helper Utilities** - API and UI helper functions
- ✅ **Multi-Browser Support** - Chrome, Firefox, Safari, Mobile
- ✅ **CI/CD Ready** - JUnit and HTML reporters configured

### Quick Start:

1. **Navigate to tests directory:**
   ```bash
   cd tests-comprehensive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npx playwright install
   ```

3. **Run tests:**
   ```bash
   # API tests only
   npx playwright test api/
   
   # UI tests only
   npx playwright test ui/
   
   # All tests
   npx playwright test
   
   # View report
   npx playwright show-report
   ```

### Documentation:

📚 **[START HERE: Quick Start Guide](tests-comprehensive/QUICK_START.md)**
- Get tests running in 10 minutes
- Troubleshooting common issues
- Basic customization

🎯 **[Master Prompts for Playwright MCP](tests-comprehensive/MASTER_PROMPTS.md)**
- Step-by-step prompts for Copilot
- Intelligent test generation
- Application exploration

📖 **[Complete Reference](tests-comprehensive/README.md)**
- All 61 test cases documented
- Architecture explanation
- Advanced customization

📊 **[Test Overview](tests-comprehensive/TEST_OVERVIEW.md)**
- High-level summary
- Test coverage metrics
- Success checklist

### Two Paths to Success:

**Path 1: Quick Execution (Recommended for first-time users)**
- Use the pre-built tests as-is
- May need to update UI selectors to match your HTML
- See [QUICK_START.md](tests-comprehensive/QUICK_START.md)

**Path 2: Intelligent Exploration (For customization)**
- Use the Master Prompts with Copilot
- Let Playwright MCP explore your application
- Auto-generate customized tests
- See [MASTER_PROMPTS.md](tests-comprehensive/MASTER_PROMPTS.md)

## Next Steps

1. ✅ Navigate to `tests-comprehensive/` directory
2. ✅ Read [QUICK_START.md](tests-comprehensive/QUICK_START.md)
3. ✅ Install dependencies and run tests
4. ✅ Review test results
5. ✅ Optionally use Master Prompts to customize
6. ✅ Integrate tests into CI/CD pipeline (Jenkins)
7. ✅ Set up test reports in Jenkins
8. ✅ Schedule regular test runs

---

**Happy Testing! 🚀**
