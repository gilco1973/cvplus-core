# Core Lint Command

## Description
Runs ESLint and formatting checks on CVPlus Core module

## Usage
```bash
npm run lint       # Check for linting issues
npm run lint:fix   # Automatically fix linting issues
```

## Linting Standards
- TypeScript ESLint rules
- Strict mode enforcement
- No unused variables or imports
- Consistent code formatting
- JSDoc documentation requirements

## Code Quality Enforcement
- All files must be under 200 lines
- Pure functions preferred for utilities
- Comprehensive error handling required
- Performance-optimized implementations
- Tree-shaking friendly exports

## Pre-commit Validation
Linting is required to pass before:
- Git commits
- Build process
- Publishing to npm
- Integration with other submodules