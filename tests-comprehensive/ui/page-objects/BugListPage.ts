/**
 * Page Object Model for Bug List Page
 * Provides reusable methods for interacting with the Bug Tracker UI
 */

import { Page, Locator, expect } from '@playwright/test';
import { BugData } from '../test-data/fixtures';

export class BugListPage {
  readonly page: Page;
  
  // Locators
  readonly addBugButton: Locator;
  readonly bugList: Locator;
  readonly searchInput: Locator;
  readonly filterStatusDropdown: Locator;
  readonly filterPriorityDropdown: Locator;
  readonly pageTitle: Locator;
  
  // Modal locators
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusSelect: Locator;
  readonly prioritySelect: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly closeModalButton: Locator;
  
  // Confirmation modal
  readonly confirmationModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Main page elements - adjust selectors based on actual implementation
    this.addBugButton = page.locator('button:has-text("Add Bug"), button:has-text("Create Bug"), button:has-text("New Bug")').first();
    this.bugList = page.locator('[data-testid="bug-list"], .bug-list, [class*="bug-list"]').first();
    this.searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    this.filterStatusDropdown = page.locator('select[name="status"], select:has-text("Status")').first();
    this.filterPriorityDropdown = page.locator('select[name="priority"], select:has-text("Priority")').first();
    this.pageTitle = page.locator('h1, h2').first();
    
    // Modal elements
    this.modal = page.locator('[role="dialog"], .modal, [data-testid="bug-modal"]').first();
    this.modalTitle = this.modal.locator('h2, h3, .modal-title').first();
    this.titleInput = this.modal.locator('input[name="title"], input[placeholder*="Title"]').first();
    this.descriptionInput = this.modal.locator('textarea[name="description"], textarea[placeholder*="Description"], input[name="description"]').first();
    this.statusSelect = this.modal.locator('select[name="status"]').first();
    this.prioritySelect = this.modal.locator('select[name="priority"]').first();
    this.submitButton = this.modal.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create"), button:has-text("Update")').first();
    this.cancelButton = this.modal.locator('button:has-text("Cancel")').first();
    this.closeModalButton = this.modal.locator('button[aria-label="Close"], .close-button').first();
    
    // Confirmation modal
    this.confirmationModal = page.locator('[role="alertdialog"], [data-testid="confirmation-modal"]').first();
    this.confirmDeleteButton = this.confirmationModal.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').first();
    this.cancelDeleteButton = this.confirmationModal.locator('button:has-text("Cancel"), button:has-text("No")').first();
  }

  /**
   * Navigate to the bug tracker page
   */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('body');
  }

  /**
   * Check if page is loaded correctly
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open the Add Bug modal
   */
  async openAddBugModal() {
    await this.addBugButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  /**
   * Fill bug form
   */
  async fillBugForm(bugData: BugData) {
    await this.titleInput.fill(bugData.title);
    await this.descriptionInput.fill(bugData.description);
    await this.statusSelect.selectOption(bugData.status);
    await this.prioritySelect.selectOption(bugData.priority);
  }

  /**
   * Submit bug form
   */
  async submitBugForm() {
    await this.submitButton.click();
    await this.modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Create a new bug (complete workflow)
   */
  async createBug(bugData: BugData) {
    await this.openAddBugModal();
    await this.fillBugForm(bugData);
    await this.submitBugForm();
    
    // Wait for the bug to appear in the list
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get bug item by title
   */
  getBugByTitle(title: string): Locator {
    return this.page.locator(`[data-testid="bug-item"]:has-text("${title}"), .bug-item:has-text("${title}"), li:has-text("${title}")`).first();
  }

  /**
   * Get edit button for a bug
   */
  getEditButton(bugTitle: string): Locator {
    const bugItem = this.getBugByTitle(bugTitle);
    return bugItem.locator('button:has-text("Edit"), [aria-label="Edit"]').first();
  }

  /**
   * Get delete button for a bug
   */
  getDeleteButton(bugTitle: string): Locator {
    const bugItem = this.getBugByTitle(bugTitle);
    return bugItem.locator('button:has-text("Delete"), [aria-label="Delete"]').first();
  }

  /**
   * Edit a bug
   */
  async editBug(currentTitle: string, newData: Partial<BugData>) {
    const editButton = this.getEditButton(currentTitle);
    await editButton.click();
    await this.modal.waitFor({ state: 'visible' });
    
    if (newData.title) await this.titleInput.fill(newData.title);
    if (newData.description) await this.descriptionInput.fill(newData.description);
    if (newData.status) await this.statusSelect.selectOption(newData.status);
    if (newData.priority) await this.prioritySelect.selectOption(newData.priority);
    
    await this.submitBugForm();
  }

  /**
   * Delete a bug with confirmation
   */
  async deleteBug(bugTitle: string, confirm: boolean = true) {
    const deleteButton = this.getDeleteButton(bugTitle);
    await deleteButton.click();
    
    // Wait for confirmation modal
    await this.confirmationModal.waitFor({ state: 'visible' });
    
    if (confirm) {
      await this.confirmDeleteButton.click();
    } else {
      await this.cancelDeleteButton.click();
    }
    
    await this.confirmationModal.waitFor({ state: 'hidden' });
  }

  /**
   * Get all bugs displayed in the list
   */
  async getAllBugTitles(): Promise<string[]> {
    const bugItems = await this.page.locator('[data-testid="bug-item"], .bug-item, li').allTextContents();
    return bugItems;
  }

  /**
   * Check if a bug exists in the list
   */
  async isBugVisible(title: string): Promise<boolean> {
    const bug = this.getBugByTitle(title);
    try {
      await bug.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Filter bugs by status
   */
  async filterByStatus(status: string) {
    await this.filterStatusDropdown.selectOption(status);
    await this.page.waitForTimeout(500);
  }

  /**
   * Filter bugs by priority
   */
  async filterByPriority(priority: string) {
    await this.filterPriorityDropdown.selectOption(priority);
    await this.page.waitForTimeout(500);
  }

  /**
   * Search for bugs
   */
  async searchBugs(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.page.waitForTimeout(500);
  }

  /**
   * Get bug count
   */
  async getBugCount(): Promise<number> {
    const bugs = await this.page.locator('[data-testid="bug-item"], .bug-item').count();
    return bugs;
  }

  /**
   * Verify bug details in the list
   */
  async verifyBugDetails(title: string, expectedData: Partial<BugData>) {
    const bugItem = this.getBugByTitle(title);
    await expect(bugItem).toBeVisible();
    
    if (expectedData.status) {
      await expect(bugItem).toContainText(expectedData.status);
    }
    if (expectedData.priority) {
      await expect(bugItem).toContainText(expectedData.priority);
    }
  }

  /**
   * Open bug details/comments
   */
  async openBugDetails(title: string) {
    const bugItem = this.getBugByTitle(title);
    await bugItem.click();
  }

  /**
   * Add comment to a bug
   */
  async addComment(commentText: string, author: string) {
    const commentInput = this.page.locator('textarea[placeholder*="Comment"], input[placeholder*="Comment"]').first();
    const authorInput = this.page.locator('input[placeholder*="Author"], input[name="author"]').first();
    const submitComment = this.page.locator('button:has-text("Add Comment"), button:has-text("Submit")').first();
    
    await commentInput.fill(commentText);
    await authorInput.fill(author);
    await submitComment.click();
    
    await this.page.waitForTimeout(500);
  }

  /**
   * Get comment count for current bug
   */
  async getCommentCount(): Promise<number> {
    const comments = await this.page.locator('[data-testid="comment"], .comment').count();
    return comments;
  }

  /**
   * Close modal
   */
  async closeModal() {
    if (await this.cancelButton.isVisible()) {
      await this.cancelButton.click();
    } else if (await this.closeModalButton.isVisible()) {
      await this.closeModalButton.click();
    }
    await this.modal.waitFor({ state: 'hidden' });
  }
}
