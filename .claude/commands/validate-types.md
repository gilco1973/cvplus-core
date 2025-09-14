# Core Type Validation Command

## Description
Validates TypeScript types and compilation without emitting files

## Usage
```bash
npm run type-check
```

## What it checks
- TypeScript compilation errors
- Type safety across all modules
- Import/export consistency
- Declaration file compatibility
- Strict mode compliance

## Type Standards
- No `any` types allowed
- Strict null checks enabled
- Comprehensive union types for domain objects
- Generic types for reusability
- Proper return type annotations

## Integration Validation
Ensures that all exported types are compatible with:
- Other CVPlus submodules
- Firebase Functions SDK
- Frontend React components
- External API consumers