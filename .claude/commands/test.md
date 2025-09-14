# Core Test Command

## Description
Runs the test suite for CVPlus Core module utilities and functions

## Usage
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Framework
- **Framework**: Jest
- **Coverage Target**: 85%+ for all utilities
- **Test Types**: Unit tests for utilities, type guards, validation functions

## Critical Test Areas
- Type guards and validation functions
- Error handling utilities
- Firebase integration helpers
- String, date, and array utilities
- Configuration management

## Coverage Requirements
All utility functions must have comprehensive test coverage including:
- Happy path scenarios
- Edge cases and error conditions
- Type safety validation
- Performance characteristics