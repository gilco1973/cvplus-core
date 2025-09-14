# Core Build Command

## Description
Builds the CVPlus Core module with TypeScript compilation and Rollup bundling

## Usage
```bash
npm run build
```

## What it does
1. Cleans the dist directory
2. Compiles TypeScript types (tsconfig.build.json)
3. Bundles with Rollup for both CommonJS and ESM outputs
4. Generates declaration files for TypeScript consumers

## Outputs
- `dist/index.js` - CommonJS bundle
- `dist/index.esm.js` - ES Module bundle
- `dist/index.d.ts` - TypeScript declarations
- Subpath exports for types, constants, utils, config

## Development
For development with watch mode:
```bash
npm run dev
# or
npm run build:watch
```