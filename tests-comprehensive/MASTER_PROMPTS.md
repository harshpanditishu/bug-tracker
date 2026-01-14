# 🎯 MASTER PROMPTS FOR PLAYWRIGHT MCP TESTING

This document contains ready-to-use prompts for using Microsoft Playwright MCP to test the Bug Tracker application.

---

## 📋 Prerequisites Checklist

Before starting, ensure:
- [ ] Bug Tracker backend is running on http://localhost:8080
- [ ] Bug Tracker frontend is running on http://localhost:3000
- [ ] You can access http://localhost:3000 in your browser
- [ ] Playwright MCP tools are available in VS Code Copilot

---

## 🚀 STEP 1: Activate Playwright MCP Tools

**Prompt:**
```
Please activate the browser interaction tools and page capture tools so I can use Microsoft Playwright MCP for testing.
```

---

## 🔍 STEP 2: Application Exploration & Manual Test Cases Generation

**Master Prompt - Part 1:**
```
I need you to thoroughly explore and document my Bug Tracker application using Microsoft Playwright MCP browser tools. Follow these steps systematically:

PHASE 1 - INITIAL EXPLORATION:
1. Navigate to http://localhost:3000
2. Take a screenshot of the initial page
3. Get an accessibility snapshot to understand the page structure
4. Document all visible UI elements:
   - Buttons (Add Bug, Edit, Delete, etc.)
   - Forms and input fields
   - Lists and data displays
   - Modals and dialogs

PHASE 2 - FEATURE TESTING:
Test these workflows step by step, documenting each interaction:

A. CREATE BUG WORKFLOW:
   1. Click the "Add Bug" or "Create Bug" button
   2. Take a screenshot of the modal/form
   3. Fill in the form with test data:
      - Title: "Test Bug from Playwright MCP"
      - Description: "This is a comprehensive test"
      - Status: "Open"
      - Priority: "High"
   4. Submit the form
   5. Wait for the bug to appear in the list
   6. Take a screenshot of the result
   7. Document any success messages or feedback

B. VIEW BUGS LIST:
   1. Take a screenshot of the bugs list
   2. Count how many bugs are displayed
   3. Document the structure of each bug item
   4. Note what information is shown (title, status, priority, dates, etc.)

C. EDIT BUG WORKFLOW:
   1. Locate the bug you just created
   2. Click the Edit button
   3. Take a screenshot of the edit form
   4. Change the priority to "Low"
   5. Change the status to "In Progress"
   6. Submit the changes
   7. Verify the changes are reflected in the list
   8. Take a screenshot

D. DELETE BUG WORKFLOW:
   1. Click the Delete button for a bug
   2. Document if a confirmation dialog appears
   3. Take a screenshot of the confirmation
   4. Confirm the deletion
   5. Verify the bug is removed from the list

E. COMMENTS FEATURE (if available):
   1. Click on a bug to view details
   2. Look for a comments section
   3. Try to add a comment
   4. Document the comment structure

PHASE 3 - VALIDATION TESTING:
1. Try to create a bug with empty title - document the error
2. Try to create a bug with only title - see if it works
3. Test all status options: Open, In Progress, Resolved
4. Test all priority options: Low, Medium, High

PHASE 4 - API ENDPOINT DISCOVERY:
1. Use browser console to monitor network requests
2. Document all API calls made:
   - POST /api/bugs (create)
   - GET /api/bugs (list)
   - GET /api/bugs/{id} (get single)
   - PUT /api/bugs/{id} (update)
   - DELETE /api/bugs/{id} (delete)
   - GET /api/bugs/{id}/comments
   - POST /api/bugs/{id}/comments
3. Note the request and response formats

PHASE 5 - CREATE MANUAL TEST CASES DOCUMENT:
Based on everything you discovered, create a comprehensive manual test cases document with:

For each test case include:
- Test Case ID (e.g., TC-UI-001, TC-API-001)
- Test Scenario Name
- Priority (High/Medium/Low)
- Prerequisites
- Detailed Test Steps (numbered)
- Expected Results
- Test Data
- Actual Results (to be filled during testing)

Save this document to: tests-comprehensive/MANUAL_TEST_CASES.md

Please execute each phase methodically and show me what you discover before moving to the next phase. Take screenshots at each important step.

Start with PHASE 1 now.
```

---

## 📝 STEP 3: Generate Automated Test Scripts

**Master Prompt - Part 2:**

After the manual test cases are created, use this prompt:

```
Now that we have thoroughly explored the application and documented manual test cases, please generate comprehensive automated test scripts using TypeScript and Playwright.

REQUIREMENTS:

1. REVIEW EXISTING TEST STRUCTURE:
   - Check the tests-comprehensive/ directory
   - Review the existing Page Object Model in ui/page-objects/BugListPage.ts
   - Review the test fixtures in test-data/fixtures.ts
   - Review the API helpers in helpers/api-helpers.ts

2. UPDATE PAGE OBJECT MODEL:
   Based on what you discovered during exploration, update the BugListPage.ts file:
   - Adjust locators to match the actual HTML structure
   - Add any missing methods for interactions you discovered
   - Ensure all selectors work with the real application
   - Add methods for any features I didn't account for

3. ENHANCE TEST DATA:
   Update test-data/fixtures.ts if needed:
   - Add any missing test data scenarios
   - Add edge cases you discovered
   - Ensure data matches the actual API requirements

4. UPDATE API TESTS:
   Review and enhance api/bugs-api.spec.ts:
   - Ensure all API endpoints discovered are tested
   - Add any missing validation tests
   - Update assertions to match actual API responses
   - Add tests for any additional endpoints you found

5. UPDATE UI TESTS:
   Review and enhance ui/bugs-ui.spec.ts:
   - Update locators based on actual UI structure
   - Add tests for any UI features I missed
   - Ensure all workflows are covered
   - Add visual regression checks if needed
   - Update waits and timeouts based on actual performance

6. CREATE INTEGRATION TESTS:
   Create a new file ui/bugs-integration.spec.ts for end-to-end scenarios:
   - Create bug → View in list → Edit → Delete (full lifecycle)
   - Create bug → Add comments → View comments
   - Create multiple bugs → Filter by status → Filter by priority
   - Test data persistence (create, refresh page, verify still there)

7. BEST PRACTICES:
   - Use proper TypeScript types
   - Add descriptive comments
   - Use Playwright's auto-waiting features
   - Implement proper error handling
   - Add retry logic for flaky tests
   - Use test.describe for grouping
   - Use test.beforeEach and test.afterEach for setup/cleanup

8. DOCUMENTATION:
   - Add JSDoc comments to all methods
   - Update README.md if needed
   - Document any assumptions made
   - Note any limitations discovered

Please make all necessary updates to the test files based on your exploration. Ensure the tests are production-ready and will pass when run against the actual application.

Start by updating the Page Object Model based on the actual UI structure you discovered.
```

---

## 🧪 STEP 4: Execute and Validate Tests

**Prompt:**
```
Now let's run the comprehensive tests we created:

1. First, install dependencies:
   Run: cd tests-comprehensive && npm install

2. Install Playwright browsers:
   Run: npx playwright install

3. Run API tests first:
   Run: npx playwright test api/ --reporter=list

4. If API tests pass, run UI tests:
   Run: npx playwright test ui/ --headed --project=chromium

5. Generate and show the HTML report:
   Run: npx playwright show-report

6. Analyze the results and fix any failing tests

Please execute these steps and show me the results. If any tests fail, help me debug and fix them.
```

---

## 🔧 STEP 5: Debug Failing Tests

If tests fail, use this prompt:

**Prompt:**
```
Some tests are failing. Let's debug them:

1. Show me the test failure details from the output

2. For UI test failures:
   - Take a screenshot of the failing step
   - Check the browser console for errors
   - Verify the element selectors are correct
   - Add debug waits if needed

3. For API test failures:
   - Show me the actual vs expected response
   - Verify the API is responding correctly
   - Check if test data cleanup is working

4. Update the tests to fix the issues

5. Re-run the specific failing test to verify the fix

Let's start with the first failing test. Show me the error and let's fix it together.
```

---

## 📊 STEP 6: Generate Test Coverage Report

**Prompt:**
```
Generate a comprehensive test coverage report:

1. Run all tests with coverage:
   npx playwright test --reporter=html,json

2. Create a summary document showing:
   - Total number of test cases
   - Pass/Fail/Skip counts
   - Test execution time
   - Coverage by feature area (CRUD operations, validation, UI interactions)
   - Known issues or limitations

3. Create a test results dashboard showing:
   - API test results (29 tests)
   - UI test results (32 tests)
   - Performance metrics
   - Browser compatibility results

4. Save the summary to: tests-comprehensive/TEST_RESULTS_SUMMARY.md

5. Include screenshots of the test execution and HTML report
```

---

## 🚀 STEP 7: CI/CD Integration

**Prompt:**
```
Help me integrate these comprehensive tests into my Jenkins pipeline:

1. Review my existing Jenkinsfile at jenkins/Jenkinsfile

2. Add a new stage for comprehensive testing that:
   - Runs after the application is launched
   - Executes both API and UI tests
   - Generates test reports
   - Archives test results
   - Publishes HTML reports

3. The stage should:
   - Use Node.js Docker image
   - Install dependencies
   - Install Playwright browsers
   - Run tests with proper reporters
   - Handle test failures gracefully
   - Publish JUnit and HTML reports

4. Add proper error handling and cleanup

5. Test the Jenkins stage configuration

Please add this stage to my Jenkinsfile.
```

---

## 📚 Additional Useful Prompts

### For Exploring Specific Features:

**Comments Feature:**
```
Navigate to the bug tracker and specifically test the comments functionality:
1. Create a new bug
2. Click on it to view details
3. Add multiple comments
4. Verify comments are displayed
5. Document the comment structure
6. Create test cases for the comments feature
```

**Filter and Search:**
```
Test the filtering and search functionality:
1. Create bugs with different priorities and statuses
2. Test status filter dropdown
3. Test priority filter dropdown
4. Test search functionality
5. Verify filtered results are correct
6. Document any bugs found
```

**Mobile Responsiveness:**
```
Test the application on mobile viewport:
1. Resize browser to mobile size (375x667)
2. Navigate through all features
3. Test create, edit, delete workflows
4. Take screenshots of each view
5. Document any layout issues
6. Create mobile-specific test cases
```

---

## 💡 Tips for Using These Prompts

1. **Run Prompts Sequentially**: Start with Step 1 and proceed in order
2. **Review Output**: Check what Copilot discovers before moving to next step
3. **Adjust as Needed**: Modify prompts based on your specific application
4. **Save Screenshots**: Copilot will take screenshots - review them
5. **Iterate**: If tests fail, use debugging prompts to fix them
6. **Document**: Keep track of what works and what doesn't

---

## ⚠️ Important Notes

- **Application Must Be Running**: Ensure both backend and frontend are running before starting
- **Clean State**: Start with a clean database for consistent test results
- **Network Access**: Ensure localhost ports 3000 and 8080 are accessible
- **Browser Installation**: Playwright browsers must be installed
- **Patience**: Exploration and test generation can take several minutes

---

## 🎓 Learning Path

1. Start with **STEP 1** to activate tools
2. Use **STEP 2** to explore and understand your application
3. Review the manual test cases generated
4. Use **STEP 3** to create automated tests
5. Execute tests with **STEP 4**
6. Debug any issues with **STEP 5**
7. Generate reports with **STEP 6**
8. Integrate with CI/CD using **STEP 7**

---

## 📞 Troubleshooting

If you encounter issues:

1. **Playwright MCP not available**: Ask Copilot to activate browser tools
2. **Application not accessible**: Check if backend and frontend are running
3. **Tests fail**: Use Step 5 debugging prompt
4. **Slow execution**: Run tests in parallel or reduce test count
5. **Selector issues**: Use Playwright Inspector to find correct selectors

---

**Ready to start? Begin with STEP 1! 🚀**
