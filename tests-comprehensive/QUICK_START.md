# 🚀 Quick Start Guide: Playwright MCP Testing for Bug Tracker

**Complete in 30 minutes!**

---

## ⚡ Quick Setup (5 minutes)

### 1. Prerequisites Check
```bash
# Check backend
curl http://localhost:8080/api/health

# Check frontend
curl http://localhost:3000
```

✅ Both should respond successfully

### 2. Install Test Dependencies
```bash
cd tests-comprehensive
npm install
npx playwright install
```

---

## 🎯 Option A: Use Ready-Made Tests (10 minutes)

**If you just want to run tests immediately:**

### Step 1: Start Your Application
```bash
# Terminal 1 - Backend
cd bugtracker-backend
go run cmd/bugtracker/main.go

# Terminal 2 - Frontend
cd bugtracker-frontend
npm run dev
```

### Step 2: Run Tests
```bash
cd tests-comprehensive

# API tests only (fast)
npx playwright test api/ --reporter=list

# UI tests in one browser
npx playwright test ui/ --project=chromium

# All tests
npx playwright test

# View report
npx playwright show-report
```

### Step 3: Fix Selectors (if tests fail)

The UI tests use generic selectors. Update `ui/page-objects/BugListPage.ts` with your actual selectors:

```typescript
// Example: If your Add Bug button has a specific class
this.addBugButton = page.locator('button.add-bug-btn');

// Or if it has a data-testid
this.addBugButton = page.locator('[data-testid="add-bug-button"]');
```

**Tool to find selectors:**
```bash
npx playwright codegen http://localhost:3000
```

---

## 🔍 Option B: Use Playwright MCP to Explore & Generate (20 minutes)

**If you want Copilot to explore your app and customize tests:**

### Step 1: Activate Playwright MCP

**Say to Copilot:**
```
Activate the browser interaction and page capture tools for testing
```

### Step 2: Explore Your Application

**Copy this entire prompt to Copilot:**

```
Navigate to http://localhost:3000 and explore the Bug Tracker application:

1. Take a screenshot of the homepage
2. Document all buttons and interactive elements you see
3. Click the "Add Bug" or "Create Bug" button
4. Take a screenshot of the form
5. Fill in the form with:
   - Title: "Playwright MCP Test Bug"
   - Description: "Automated test"
   - Status: "Open"
   - Priority: "High"
6. Submit the form
7. Take a screenshot of the result
8. Document the actual HTML elements and their selectors

Based on this exploration, update the BugListPage.ts file with the correct selectors.
```

### Step 3: Update Tests with Real Selectors

Copilot will show you the actual element selectors. Update your Page Object Model:

```typescript
// In ui/page-objects/BugListPage.ts
// Replace generic selectors with real ones Copilot found
this.addBugButton = page.locator('THE_ACTUAL_SELECTOR');
```

### Step 4: Run Updated Tests
```bash
npx playwright test ui/bugs-ui.spec.ts --headed
```

---

## 📝 Quick Test Run Checklist

Before running tests:
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Database is clean (or tests will handle cleanup)
- [ ] Dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)

---

## 🐛 Common Issues & Fixes

### Issue 1: "Browser not found"
```bash
npx playwright install
```

### Issue 2: "Connection refused"
Check if apps are running:
```bash
# Should show backend process
netstat -ano | findstr :8080

# Should show frontend process
netstat -ano | findstr :3000
```

### Issue 3: "Element not found" in UI tests
Run Playwright codegen to find correct selectors:
```bash
npx playwright codegen http://localhost:3000
```
Click on elements to see their selectors, then update BugListPage.ts

### Issue 4: Tests are slow
Run in parallel:
```bash
npx playwright test --workers=4
```

Or run only what you need:
```bash
# Just one test
npx playwright test -g "TC-API-001"

# Just API tests
npx playwright test api/
```

---

## 📊 Understanding Test Results

After running tests, you'll see:

```
Running 61 tests using 4 workers

  ✓ api/bugs-api.spec.ts:15:5 › TC-API-001: Health check (250ms)
  ✓ api/bugs-api.spec.ts:25:5 › TC-API-002: Create bug (350ms)
  ✗ ui/bugs-ui.spec.ts:12:5 › TC-UI-001: Page load (FAILED)
```

- ✓ = Passed
- ✗ = Failed
- ⊘ = Skipped

**View detailed report:**
```bash
npx playwright show-report
```

---

## 🎨 Customization Guide

### Add Your Own Test

1. **API Test** (add to `api/bugs-api.spec.ts`):
```typescript
test('TC-API-030: Your custom test', async ({ request }) => {
  const response = await request.get('bugs');
  expect(response.ok()).toBeTruthy();
  // Your assertions here
});
```

2. **UI Test** (add to `ui/bugs-ui.spec.ts`):
```typescript
test('TC-UI-033: Your custom UI test', async ({ page }) => {
  await bugPage.goto();
  // Your test steps here
  await expect(page.locator('your-element')).toBeVisible();
});
```

### Add Test Data

Edit `test-data/fixtures.ts`:
```typescript
export const myCustomData = {
  title: 'Custom Test Bug',
  description: 'My test scenario',
  status: 'Open',
  priority: 'High',
};
```

---

## 🚀 CI/CD Quick Integration

Add to your Jenkinsfile:

```groovy
stage('Comprehensive Tests') {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.48.0'
            reuseNode true
        }
    }
    steps {
        dir('tests-comprehensive') {
            sh 'npm install'
            sh 'npx playwright test --reporter=junit,html'
        }
    }
    post {
        always {
            junit 'tests-comprehensive/test-results/results.xml'
            publishHTML([
                reportDir: 'tests-comprehensive/playwright-report',
                reportFiles: 'index.html',
                reportName: 'Comprehensive Test Report'
            ])
        }
    }
}
```

---

## 📚 File Reference

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `api/bugs-api.spec.ts` | API test cases | Often |
| `ui/bugs-ui.spec.ts` | UI test cases | Often |
| `ui/page-objects/BugListPage.ts` | UI selectors & methods | When UI changes |
| `test-data/fixtures.ts` | Test data | When adding new scenarios |
| `helpers/api-helpers.ts` | API utilities | Rarely |
| `playwright.config.ts` | Test configuration | Rarely |

---

## 🎯 Next Steps

After basic tests are running:

1. **Review Manual Test Cases**: `MANUAL_TEST_CASES.md` (will be generated by Copilot)
2. **Review Master Prompts**: `MASTER_PROMPTS.md` (for advanced usage)
3. **Customize Tests**: Update selectors and add your scenarios
4. **Integrate with CI/CD**: Add to Jenkins pipeline
5. **Schedule Regular Runs**: Run tests on every commit

---

## 💡 Pro Tips

1. **Use headed mode** for debugging: `--headed`
2. **Use UI mode** for interactive testing: `--ui`
3. **Use debug mode** to pause tests: `--debug`
4. **Use codegen** to record tests: `codegen http://localhost:3000`
5. **Run specific tests** with grep: `-g "TC-API-001"`

---

## 🆘 Need Help?

1. Check `README.md` for detailed documentation
2. Check `MASTER_PROMPTS.md` for Copilot prompts
3. Check `TESTING_GUIDE.md` in project root
4. Run `npx playwright --help` for CLI options
5. Visit [Playwright Docs](https://playwright.dev)

---

## ✅ Success Checklist

- [ ] Tests run without connection errors
- [ ] API tests (29) all pass
- [ ] UI tests (32) all pass or are being fixed
- [ ] HTML report opens successfully
- [ ] You understand how to add new tests
- [ ] Tests are integrated into CI/CD

---

**You're ready! Start with Option A for quick results, or Option B for customized tests.** 🎉
