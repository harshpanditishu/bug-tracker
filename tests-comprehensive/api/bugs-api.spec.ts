/**
 * Comprehensive API Tests for Bug Tracker Application
 * Tests all CRUD operations, validations, and error handling
 */

import { test, expect } from '@playwright/test';
import { BugAPI, verifyBugStructure, verifyCommentStructure } from '../helpers/api-helpers';
import {
  validBugs,
  invalidBugs,
  validComments,
  generateUniqueBug,
  generateUniqueComment,
  expectedErrors,
  edgeCases,
} from '../test-data/fixtures';

let bugAPI: BugAPI;
let createdBugIds: number[] = [];

test.beforeEach(async ({ request }) => {
  bugAPI = new BugAPI(request);
});

test.afterEach(async () => {
  // Cleanup: Delete all bugs created during tests
  try {
    for (const id of createdBugIds) {
      await bugAPI.deleteBug(id);
    }
    createdBugIds = [];
  } catch (error) {
    console.log('Cleanup error:', error);
  }
});

test.describe('Health Check', () => {
  test('TC-API-001: Should return healthy status', async () => {
    const health = await bugAPI.healthCheck();
    expect(health.status).toBe('ok');
  });
});

test.describe('Bug Creation - Valid Cases', () => {
  test('TC-API-002: Create bug with all valid fields', async () => {
    const bugData = generateUniqueBug();
    const bug = await bugAPI.createBug(bugData);
    
    createdBugIds.push(bug.id);
    verifyBugStructure(bug, bugData);
    
    expect(bug.id).toBeGreaterThan(0);
    expect(bug.created_at).toBeTruthy();
    expect(bug.updated_at).toBeTruthy();
  });

  test('TC-API-003: Create bug with High priority', async () => {
    const bugData = generateUniqueBug({ priority: 'High' });
    const bug = await bugAPI.createBug(bugData);
    
    createdBugIds.push(bug.id);
    expect(bug.priority).toBe('High');
  });

  test('TC-API-004: Create bug with In Progress status', async () => {
    const bugData = generateUniqueBug({ status: 'In Progress' });
    const bug = await bugAPI.createBug(bugData);
    
    createdBugIds.push(bug.id);
    expect(bug.status).toBe('In Progress');
  });

  test('TC-API-005: Create bug with Resolved status', async () => {
    const bugData = generateUniqueBug({ status: 'Resolved' });
    const bug = await bugAPI.createBug(bugData);
    
    createdBugIds.push(bug.id);
    expect(bug.status).toBe('Resolved');
  });

  test('TC-API-006: Create multiple bugs', async () => {
    const bugs = [];
    for (let i = 0; i < 3; i++) {
      const bugData = generateUniqueBug({ title: `Batch Bug ${i}` });
      const bug = await bugAPI.createBug(bugData);
      bugs.push(bug);
      createdBugIds.push(bug.id);
    }
    
    expect(bugs).toHaveLength(3);
    bugs.forEach(bug => verifyBugStructure(bug));
  });
});

test.describe('Bug Creation - Validation Errors', () => {
  test('TC-API-007: Should reject bug without title', async ({ request }) => {
    const response = await request.post('bugs', {
      data: invalidBugs.missingTitle,
    });
    
    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('title');
  });

  test('TC-API-008: Should reject bug with empty title', async ({ request }) => {
    const response = await request.post('bugs', {
      data: invalidBugs.emptyTitle,
    });
    
    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('title');
  });

  test('TC-API-009: Should reject bug with invalid status', async ({ request }) => {
    const response = await request.post('bugs', {
      data: invalidBugs.invalidStatus,
    });
    
    expect(response.status()).toBe(400);
  });

  test('TC-API-010: Should reject bug with invalid priority', async ({ request }) => {
    const response = await request.post('bugs', {
      data: invalidBugs.invalidPriority,
    });
    
    expect(response.status()).toBe(400);
  });
});

test.describe('Bug Retrieval', () => {
  test('TC-API-011: Get all bugs', async () => {
    // Create a bug first
    const bugData = generateUniqueBug();
    const createdBug = await bugAPI.createBug(bugData);
    createdBugIds.push(createdBug.id);
    
    // Get all bugs
    const bugs = await bugAPI.getAllBugs();
    expect(Array.isArray(bugs)).toBeTruthy();
    expect(bugs.length).toBeGreaterThan(0);
    
    // Verify structure of first bug
    if (bugs.length > 0) {
      verifyBugStructure(bugs[0]);
    }
  });

  test('TC-API-012: Get single bug by ID', async () => {
    const bugData = generateUniqueBug();
    const createdBug = await bugAPI.createBug(bugData);
    createdBugIds.push(createdBug.id);
    
    const bug = await bugAPI.getBugById(createdBug.id);
    verifyBugStructure(bug, bugData);
    expect(bug.id).toBe(createdBug.id);
  });

  test('TC-API-013: Should return 404 for non-existent bug', async ({ request }) => {
    const response = await request.get('bugs/999999');
    expect(response.status()).toBe(404);
  });

  test('TC-API-014: Should return 400 for invalid bug ID format', async ({ request }) => {
    const response = await request.get('bugs/invalid');
    expect(response.status()).toBe(400);
  });
});

test.describe('Bug Update', () => {
  test('TC-API-015: Update bug title', async () => {
    const bugData = generateUniqueBug();
    const createdBug = await bugAPI.createBug(bugData);
    createdBugIds.push(createdBug.id);
    
    const updatedTitle = `Updated ${Date.now()}`;
    const updatedBug = await bugAPI.updateBug(createdBug.id, { title: updatedTitle });
    
    expect(updatedBug.title).toBe(updatedTitle);
    expect(updatedBug.id).toBe(createdBug.id);
  });

  test('TC-API-016: Update bug status', async () => {
    const bugData = generateUniqueBug({ status: 'Open' });
    const createdBug = await bugAPI.createBug(bugData);
    createdBugIds.push(createdBug.id);
    
    const updatedBug = await bugAPI.updateBug(createdBug.id, { status: 'Resolved' });
    expect(updatedBug.status).toBe('Resolved');
  });

  test('TC-API-017: Update bug priority', async () => {
    const bugData = generateUniqueBug({ priority: 'Low' });
    const createdBug = await bugAPI.createBug(bugData);
    createdBugIds.push(createdBug.id);
    
    const updatedBug = await bugAPI.updateBug(createdBug.id, { priority: 'High' });
    expect(updatedBug.priority).toBe('High');
  });

  test('TC-API-018: Update multiple fields', async () => {
    const bugData = generateUniqueBug();
    const createdBug = await bugAPI.createBug(bugData);
    createdBugIds.push(createdBug.id);
    
    const updates = {
      title: 'Completely Updated',
      description: 'New description',
      status: 'In Progress' as const,
      priority: 'High' as const,
    };
    
    const updatedBug = await bugAPI.updateBug(createdBug.id, updates);
    expect(updatedBug.title).toBe(updates.title);
    expect(updatedBug.description).toBe(updates.description);
    expect(updatedBug.status).toBe(updates.status);
    expect(updatedBug.priority).toBe(updates.priority);
  });

  test('TC-API-019: Should return 404 when updating non-existent bug', async ({ request }) => {
    const response = await request.put('bugs/999999', {
      data: { title: 'Updated' },
    });
    expect(response.status()).toBe(404);
  });
});

test.describe('Bug Deletion', () => {
  test('TC-API-020: Delete a bug', async () => {
    const bugData = generateUniqueBug();
    const createdBug = await bugAPI.createBug(bugData);
    
    await bugAPI.deleteBug(createdBug.id);
    
    // Verify bug is deleted
    const { request } = test.info().project.use as any;
    const response = await request.get(`bugs/${createdBug.id}`);
    expect(response.status()).toBe(404);
  });

  test('TC-API-021: Should return 404 when deleting non-existent bug', async ({ request }) => {
    const response = await request.delete('bugs/999999');
    expect(response.status()).toBe(404);
  });

  test('TC-API-022: Delete all bugs', async () => {
    // Create multiple bugs
    for (let i = 0; i < 3; i++) {
      const bugData = generateUniqueBug();
      await bugAPI.createBug(bugData);
    }
    
    // Delete all
    await bugAPI.deleteAllBugs();
    
    // Verify all bugs are deleted
    const bugs = await bugAPI.getAllBugs();
    expect(bugs).toHaveLength(0);
  });
});

test.describe('Comments', () => {
  let testBugId: number;

  test.beforeEach(async () => {
    const bugData = generateUniqueBug();
    const bug = await bugAPI.createBug(bugData);
    testBugId = bug.id;
    createdBugIds.push(bug.id);
  });

  test('TC-API-023: Create comment for a bug', async () => {
    const commentData = generateUniqueComment();
    const comment = await bugAPI.createComment(testBugId, commentData);
    
    verifyCommentStructure(comment, commentData);
    expect(comment.bug_id).toBe(testBugId);
  });

  test('TC-API-024: Get comments for a bug', async () => {
    // Create some comments
    const commentData1 = generateUniqueComment({ text: 'First comment' });
    const commentData2 = generateUniqueComment({ text: 'Second comment' });
    
    await bugAPI.createComment(testBugId, commentData1);
    await bugAPI.createComment(testBugId, commentData2);
    
    // Get all comments
    const comments = await bugAPI.getComments(testBugId);
    expect(Array.isArray(comments)).toBeTruthy();
    expect(comments.length).toBeGreaterThanOrEqual(2);
  });

  test('TC-API-025: Should return 404 when creating comment for non-existent bug', async ({ request }) => {
    const response = await request.post('bugs/999999/comments', {
      data: generateUniqueComment(),
    });
    expect(response.status()).toBe(404);
  });

  test('TC-API-026: Should return 404 when getting comments for non-existent bug', async ({ request }) => {
    const response = await request.get('bugs/999999/comments');
    expect(response.status()).toBe(404);
  });
});

test.describe('Edge Cases', () => {
  test('TC-API-027: Create bug with special characters in title', async () => {
    const bugData = { ...edgeCases.specialCharactersTitle };
    const bug = await bugAPI.createBug(bugData);
    
    createdBugIds.push(bug.id);
    expect(bug.title).toBe(bugData.title);
  });

  test('TC-API-028: Create bug with Unicode characters', async () => {
    const bugData = { ...edgeCases.unicodeCharacters };
    const bug = await bugAPI.createBug(bugData);
    
    createdBugIds.push(bug.id);
    expect(bug.title).toBe(bugData.title);
  });
});

test.describe('Performance', () => {
  test('TC-API-029: Create 10 bugs within acceptable time', async () => {
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
      const bugData = generateUniqueBug({ title: `Performance Test ${i}` });
      const bug = await bugAPI.createBug(bugData);
      createdBugIds.push(bug.id);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete within 10 seconds
    expect(duration).toBeLessThan(10000);
  });
});
