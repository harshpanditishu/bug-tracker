/**
 * API Helper Functions for Bug Tracker Testing
 * Provides reusable functions for API interactions
 */

import { APIRequestContext, expect } from '@playwright/test';
import { Bug, BugData, Comment, CommentData } from '../test-data/fixtures';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

/**
 * API Helper class for bug operations
 */
export class BugAPI {
  constructor(private request: APIRequestContext) {}

  /**
   * Create a new bug
   */
  async createBug(bugData: BugData): Promise<Bug> {
    const response = await this.request.post(`${API_BASE_URL}/bugs`, {
      data: bugData,
    });
    
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * Get all bugs
   */
  async getAllBugs(): Promise<Bug[]> {
    const response = await this.request.get(`${API_BASE_URL}/bugs`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * Get a single bug by ID
   */
  async getBugById(id: number): Promise<Bug> {
    const response = await this.request.get(`${API_BASE_URL}/bugs/${id}`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * Update a bug
   */
  async updateBug(id: number, bugData: Partial<BugData>): Promise<Bug> {
    const response = await this.request.put(`${API_BASE_URL}/bugs/${id}`, {
      data: bugData,
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * Delete a bug
   */
  async deleteBug(id: number): Promise<void> {
    const response = await this.request.delete(`${API_BASE_URL}/bugs/${id}`);
    expect(response.ok()).toBeTruthy();
  }

  /**
   * Delete all bugs (cleanup)
   */
  async deleteAllBugs(): Promise<void> {
    const response = await this.request.delete(`${API_BASE_URL}/bugs`);
    expect(response.ok()).toBeTruthy();
  }

  /**
   * Get comments for a bug
   */
  async getComments(bugId: number): Promise<Comment[]> {
    const response = await this.request.get(`${API_BASE_URL}/bugs/${bugId}/comments`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * Create a comment for a bug
   */
  async createComment(bugId: number, commentData: CommentData): Promise<Comment> {
    const response = await this.request.post(`${API_BASE_URL}/bugs/${bugId}/comments`, {
      data: commentData,
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.request.get(`${API_BASE_URL}/health`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }
}

/**
 * Helper function to verify bug structure
 */
export function verifyBugStructure(bug: any, expectedData?: Partial<BugData>) {
  expect(bug).toHaveProperty('id');
  expect(bug).toHaveProperty('title');
  expect(bug).toHaveProperty('description');
  expect(bug).toHaveProperty('status');
  expect(bug).toHaveProperty('priority');
  expect(bug).toHaveProperty('created_at');
  expect(bug).toHaveProperty('updated_at');

  if (expectedData) {
    if (expectedData.title) expect(bug.title).toBe(expectedData.title);
    if (expectedData.description) expect(bug.description).toBe(expectedData.description);
    if (expectedData.status) expect(bug.status).toBe(expectedData.status);
    if (expectedData.priority) expect(bug.priority).toBe(expectedData.priority);
  }
}

/**
 * Helper function to verify comment structure
 */
export function verifyCommentStructure(comment: any, expectedData?: Partial<CommentData>) {
  expect(comment).toHaveProperty('id');
  expect(comment).toHaveProperty('bug_id');
  expect(comment).toHaveProperty('text');
  expect(comment).toHaveProperty('author');
  expect(comment).toHaveProperty('created_at');

  if (expectedData) {
    if (expectedData.text) expect(comment.text).toBe(expectedData.text);
    if (expectedData.author) expect(comment.author).toBe(expectedData.author);
  }
}

/**
 * Wait for condition with timeout
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout: number = 5000,
  interval: number = 500
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}
