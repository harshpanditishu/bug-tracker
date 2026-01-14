/**
 * Test Data Fixtures for Bug Tracker Application
 * Contains valid and invalid test data for comprehensive testing
 */

export interface BugData {
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
}

export interface Bug extends BugData {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface CommentData {
  text: string;
  author: string;
}

export interface Comment extends CommentData {
  id: number;
  bug_id: number;
  created_at: string;
}

/**
 * Valid bug test data
 */
export const validBugs: BugData[] = [
  {
    title: 'Login button not responding on mobile',
    description: 'When users click the login button on mobile devices, nothing happens. This issue affects both iOS and Android users.',
    status: 'Open',
    priority: 'High',
  },
  {
    title: 'Database connection timeout',
    description: 'Database queries are timing out after 5 seconds, causing performance issues.',
    status: 'In Progress',
    priority: 'High',
  },
  {
    title: 'Minor UI alignment issue in dashboard',
    description: 'The dashboard widgets are slightly misaligned on screens smaller than 1024px.',
    status: 'Open',
    priority: 'Low',
  },
  {
    title: 'Email notifications not being sent',
    description: 'Users report not receiving email notifications for bug updates.',
    status: 'Resolved',
    priority: 'Medium',
  },
  {
    title: 'Search functionality returns incorrect results',
    description: 'When searching for bugs by title, the results include irrelevant bugs.',
    status: 'In Progress',
    priority: 'Medium',
  },
];

/**
 * Invalid bug test data for validation testing
 */
export const invalidBugs = {
  missingTitle: {
    description: 'This bug has no title',
    status: 'Open',
    priority: 'Medium',
  },
  emptyTitle: {
    title: '',
    description: 'This bug has an empty title',
    status: 'Open',
    priority: 'High',
  },
  invalidStatus: {
    title: 'Bug with invalid status',
    description: 'Testing invalid status value',
    status: 'InvalidStatus',
    priority: 'Low',
  },
  invalidPriority: {
    title: 'Bug with invalid priority',
    description: 'Testing invalid priority value',
    status: 'Open',
    priority: 'Critical',
  },
  missingStatus: {
    title: 'Bug without status',
    description: 'Testing missing status field',
    priority: 'Medium',
  },
  missingPriority: {
    title: 'Bug without priority',
    description: 'Testing missing priority field',
    status: 'Open',
  },
};

/**
 * Valid comment test data
 */
export const validComments: CommentData[] = [
  {
    text: 'I can reproduce this issue on my device as well.',
    author: 'John Doe',
  },
  {
    text: 'Working on a fix for this. Should be ready by EOD.',
    author: 'Jane Smith',
  },
  {
    text: 'This is a duplicate of bug #123.',
    author: 'Alice Johnson',
  },
  {
    text: 'Fixed in the latest release. Closing this bug.',
    author: 'Bob Wilson',
  },
];

/**
 * Invalid comment test data
 */
export const invalidComments = {
  missingText: {
    author: 'Test User',
  },
  emptyText: {
    text: '',
    author: 'Test User',
  },
  missingAuthor: {
    text: 'Comment without author',
  },
};

/**
 * Generate a unique bug with timestamp
 */
export function generateUniqueBug(overrides: Partial<BugData> = {}): BugData {
  const timestamp = Date.now();
  return {
    title: `Test Bug ${timestamp}`,
    description: `This is an automated test bug created at ${new Date().toISOString()}`,
    status: 'Open',
    priority: 'Medium',
    ...overrides,
  };
}

/**
 * Generate a unique comment with timestamp
 */
export function generateUniqueComment(overrides: Partial<CommentData> = {}): CommentData {
  const timestamp = Date.now();
  return {
    text: `Test comment created at ${timestamp}`,
    author: 'Automated Test',
    ...overrides,
  };
}

/**
 * Generate multiple unique bugs
 */
export function generateMultipleBugs(count: number): BugData[] {
  return Array.from({ length: count }, (_, index) => ({
    title: `Test Bug ${Date.now()}_${index}`,
    description: `Automated test bug number ${index + 1}`,
    status: ['Open', 'In Progress', 'Resolved'][index % 3] as BugData['status'],
    priority: ['Low', 'Medium', 'High'][index % 3] as BugData['priority'],
  }));
}

/**
 * Test data for edge cases
 */
export const edgeCases = {
  longTitle: {
    title: 'A'.repeat(500), // Very long title
    description: 'Testing with extremely long title',
    status: 'Open' as const,
    priority: 'Low' as const,
  },
  longDescription: {
    title: 'Bug with long description',
    description: 'B'.repeat(5000), // Very long description
    status: 'Open' as const,
    priority: 'Medium' as const,
  },
  specialCharactersTitle: {
    title: 'Bug with special chars: <script>alert("XSS")</script> & é â ñ',
    description: 'Testing special character handling',
    status: 'Open' as const,
    priority: 'High' as const,
  },
  unicodeCharacters: {
    title: '测试 Bug テスト 🐛',
    description: 'Testing Unicode and emoji support',
    status: 'Open' as const,
    priority: 'Low' as const,
  },
};

/**
 * Expected error messages for validation
 */
export const expectedErrors = {
  missingTitle: 'title is required',
  invalidStatus: 'invalid status',
  invalidPriority: 'invalid priority',
  bugNotFound: 'bug not found',
  invalidBugId: 'invalid bug ID format',
};
