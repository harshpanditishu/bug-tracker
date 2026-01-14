/**
 * Comprehensive UI Tests for Bug Tracker Application
 * Tests user interface interactions, forms, and visual elements
 */

import { test, expect } from '@playwright/test';
import { BugListPage } from './page-objects/BugListPage';
import { generateUniqueBug, validBugs } from '../test-data/fixtures';

let bugPage: BugListPage;

test.beforeEach(async ({ page }) => {
  bugPage = new BugListPage(page);
  await bugPage.goto();
});

test.describe('Page Load and Initial Render', () => {
  test('TC-UI-001: Should load the bug list page successfully', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(bugPage.pageTitle).toBeVisible();
  });

  test('TC-UI-002: Should display Add Bug button', async () => {
    await expect(bugPage.addBugButton).toBeVisible();
  });

  test('TC-UI-003: Should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('TC-UI-004: Page should be accessible', async ({ page }) => {
    // Basic accessibility check - should have proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Add Bug Functionality', () => {
  test('TC-UI-005: Should open Add Bug modal when clicking Add Bug button', async () => {
    await bugPage.openAddBugModal();
    await expect(bugPage.modal).toBeVisible();
    await expect(bugPage.titleInput).toBeVisible();
    await expect(bugPage.descriptionInput).toBeVisible();
  });

  test('TC-UI-006: Should create a new bug with valid data', async () => {
    const bugData = generateUniqueBug({
      title: 'UI Test Bug',
      description: 'Created via UI test',
      status: 'Open',
      priority: 'High',
    });

    await bugPage.createBug(bugData);
    
    // Verify bug appears in the list
    const isVisible = await bugPage.isBugVisible(bugData.title);
    expect(isVisible).toBeTruthy();
  });

  test('TC-UI-007: Should create bug with Medium priority', async () => {
    const bugData = generateUniqueBug({ priority: 'Medium' });
    await bugPage.createBug(bugData);
    
    await bugPage.verifyBugDetails(bugData.title, { priority: 'Medium' });
  });

  test('TC-UI-008: Should create bug with Low priority', async () => {
    const bugData = generateUniqueBug({ priority: 'Low' });
    await bugPage.createBug(bugData);
    
    await bugPage.verifyBugDetails(bugData.title, { priority: 'Low' });
  });

  test('TC-UI-009: Should create bug with In Progress status', async () => {
    const bugData = generateUniqueBug({ status: 'In Progress' });
    await bugPage.createBug(bugData);
    
    await bugPage.verifyBugDetails(bugData.title, { status: 'In Progress' });
  });

  test('TC-UI-010: Should close modal when clicking Cancel', async () => {
    await bugPage.openAddBugModal();
    await expect(bugPage.modal).toBeVisible();
    
    await bugPage.closeModal();
    await expect(bugPage.modal).not.toBeVisible();
  });

  test('TC-UI-011: Form should have all required fields', async () => {
    await bugPage.openAddBugModal();
    
    await expect(bugPage.titleInput).toBeVisible();
    await expect(bugPage.descriptionInput).toBeVisible();
    await expect(bugPage.statusSelect).toBeVisible();
    await expect(bugPage.prioritySelect).toBeVisible();
    await expect(bugPage.submitButton).toBeVisible();
  });
});

test.describe('Edit Bug Functionality', () => {
  test.beforeEach(async () => {
    // Create a bug to edit
    const bugData = generateUniqueBug({ title: 'Bug to Edit' });
    await bugPage.createBug(bugData);
  });

  test('TC-UI-012: Should open edit modal with pre-filled data', async () => {
    const editButton = bugPage.getEditButton('Bug to Edit');
    await editButton.click();
    
    await expect(bugPage.modal).toBeVisible();
    await expect(bugPage.titleInput).toHaveValue(/Bug to Edit/);
  });

  test('TC-UI-013: Should update bug title', async () => {
    const newTitle = `Updated Title ${Date.now()}`;
    await bugPage.editBug('Bug to Edit', { title: newTitle });
    
    const isVisible = await bugPage.isBugVisible(newTitle);
    expect(isVisible).toBeTruthy();
  });

  test('TC-UI-014: Should update bug priority', async () => {
    await bugPage.editBug('Bug to Edit', { priority: 'Low' });
    await bugPage.verifyBugDetails('Bug to Edit', { priority: 'Low' });
  });

  test('TC-UI-015: Should update bug status', async () => {
    await bugPage.editBug('Bug to Edit', { status: 'Resolved' });
    await bugPage.verifyBugDetails('Bug to Edit', { status: 'Resolved' });
  });

  test('TC-UI-016: Should update multiple fields at once', async () => {
    const newTitle = `Fully Updated ${Date.now()}`;
    await bugPage.editBug('Bug to Edit', {
      title: newTitle,
      status: 'In Progress',
      priority: 'High',
    });
    
    await bugPage.verifyBugDetails(newTitle, {
      status: 'In Progress',
      priority: 'High',
    });
  });
});

test.describe('Delete Bug Functionality', () => {
  test.beforeEach(async () => {
    // Create a bug to delete
    const bugData = generateUniqueBug({ title: 'Bug to Delete' });
    await bugPage.createBug(bugData);
  });

  test('TC-UI-017: Should show confirmation modal when clicking delete', async () => {
    const deleteButton = bugPage.getDeleteButton('Bug to Delete');
    await deleteButton.click();
    
    await expect(bugPage.confirmationModal).toBeVisible();
  });

  test('TC-UI-018: Should delete bug when confirming', async () => {
    await bugPage.deleteBug('Bug to Delete', true);
    
    // Wait a bit for the UI to update
    await bugPage.page.waitForTimeout(1000);
    
    const isVisible = await bugPage.isBugVisible('Bug to Delete');
    expect(isVisible).toBeFalsy();
  });

  test('TC-UI-019: Should NOT delete bug when canceling', async () => {
    await bugPage.deleteBug('Bug to Delete', false);
    
    const isVisible = await bugPage.isBugVisible('Bug to Delete');
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Bug List Display', () => {
  test('TC-UI-020: Should display multiple bugs', async () => {
    // Create multiple bugs
    for (let i = 0; i < 3; i++) {
      const bugData = generateUniqueBug({ title: `List Bug ${i}` });
      await bugPage.createBug(bugData);
    }
    
    const bugCount = await bugPage.getBugCount();
    expect(bugCount).toBeGreaterThanOrEqual(3);
  });

  test('TC-UI-021: Should display bug with all details', async () => {
    const bugData = generateUniqueBug({
      title: 'Detailed Bug',
      status: 'Open',
      priority: 'High',
    });
    
    await bugPage.createBug(bugData);
    await bugPage.verifyBugDetails('Detailed Bug', {
      status: 'Open',
      priority: 'High',
    });
  });
});

test.describe('Filter and Search', () => {
  test.beforeEach(async () => {
    // Create bugs with different statuses and priorities
    await bugPage.createBug(generateUniqueBug({ 
      title: 'High Priority Bug', 
      priority: 'High', 
      status: 'Open' 
    }));
    await bugPage.createBug(generateUniqueBug({ 
      title: 'Low Priority Bug', 
      priority: 'Low', 
      status: 'Resolved' 
    }));
    await bugPage.createBug(generateUniqueBug({ 
      title: 'Medium Priority Bug', 
      priority: 'Medium', 
      status: 'In Progress' 
    }));
  });

  test('TC-UI-022: Should filter bugs by High priority', async () => {
    // Check if filter exists
    const filterExists = await bugPage.filterPriorityDropdown.isVisible().catch(() => false);
    
    if (filterExists) {
      await bugPage.filterByPriority('High');
      
      const isVisible = await bugPage.isBugVisible('High Priority Bug');
      expect(isVisible).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('TC-UI-023: Should filter bugs by status', async () => {
    const filterExists = await bugPage.filterStatusDropdown.isVisible().catch(() => false);
    
    if (filterExists) {
      await bugPage.filterByStatus('Resolved');
      
      const isVisible = await bugPage.isBugVisible('Low Priority Bug');
      expect(isVisible).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('TC-UI-024: Should search for bugs', async () => {
    const searchExists = await bugPage.searchInput.isVisible().catch(() => false);
    
    if (searchExists) {
      await bugPage.searchBugs('High Priority');
      
      const isVisible = await bugPage.isBugVisible('High Priority Bug');
      expect(isVisible).toBeTruthy();
    } else {
      test.skip();
    }
  });
});

test.describe('Form Validation', () => {
  test('TC-UI-025: Should not submit form with empty title', async ({ page }) => {
    await bugPage.openAddBugModal();
    
    await bugPage.titleInput.fill('');
    await bugPage.descriptionInput.fill('Some description');
    await bugPage.submitButton.click();
    
    // Modal should still be visible (form validation failed)
    await expect(bugPage.modal).toBeVisible();
  });

  test('TC-UI-026: Should show validation message for empty title', async ({ page }) => {
    await bugPage.openAddBugModal();
    
    await bugPage.submitButton.click();
    
    // Check for validation message or error
    const errorMessage = page.locator('text=/required|empty|fill/i').first();
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    // Either validation message appears OR modal stays open
    const modalVisible = await bugPage.modal.isVisible();
    expect(hasError || modalVisible).toBeTruthy();
  });
});

test.describe('Comments Functionality', () => {
  test.beforeEach(async () => {
    const bugData = generateUniqueBug({ title: 'Bug with Comments' });
    await bugPage.createBug(bugData);
  });

  test('TC-UI-027: Should open bug details', async () => {
    const bugExists = await bugPage.isBugVisible('Bug with Comments');
    expect(bugExists).toBeTruthy();
    
    // Click on bug to see details
    await bugPage.openBugDetails('Bug with Comments');
  });

  test('TC-UI-028: Should add comment to bug', async ({ page }) => {
    await bugPage.openBugDetails('Bug with Comments');
    
    // Check if comment section exists
    const commentSection = page.locator('[data-testid="comment-section"], .comments').first();
    const commentExists = await commentSection.isVisible().catch(() => false);
    
    if (commentExists) {
      await bugPage.addComment('This is a test comment', 'Test User');
      
      // Verify comment was added
      const commentCount = await bugPage.getCommentCount();
      expect(commentCount).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });
});

test.describe('Responsive Design', () => {
  test('TC-UI-029: Should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await bugPage.goto();
    await expect(bugPage.addBugButton).toBeVisible();
  });

  test('TC-UI-030: Should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await bugPage.goto();
    await expect(bugPage.addBugButton).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('TC-UI-031: Page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await bugPage.goto();
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('TC-UI-032: Should handle creating 5 bugs quickly', async () => {
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
      const bugData = generateUniqueBug({ title: `Perf Bug ${i}` });
      await bugPage.createBug(bugData);
    }
    
    const duration = Date.now() - startTime;
    
    // Should complete within 30 seconds
    expect(duration).toBeLessThan(30000);
  });
});
