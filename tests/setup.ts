// Jest setup file
// This file is executed before each test file

// Global test configuration
jest.setTimeout(10000); // 10 seconds timeout for all tests

// Mock console methods if needed for testing
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Reset console mocks before each test
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods after each test
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});