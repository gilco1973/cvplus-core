/**
 * Jest test setup for CVPlus Core package
 * Configure global test environment and utilities
 */

// Global test utilities and mocks can be added here

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Keep error and warn for test debugging
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};

// Setup timezone for consistent date testing
process.env.TZ = 'UTC';

// Mock Date.now for consistent timestamps in tests
const originalDateNow = Date.now;
beforeEach(() => {
  // Reset to original implementation before each test
  Date.now = originalDateNow;
});

afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();
});

// Global test timeout
jest.setTimeout(10000);