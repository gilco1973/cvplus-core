/**
 * CVPlus Core Package - Minimal Exports
 * Essential exports only for basic submodule functionality
 */

// ============================================================================
// TYPES
// ============================================================================

export * from './types';

// ============================================================================
// LOGGING
// ============================================================================

// Re-export logging from dedicated logging submodule
// Re-export essential logging from @cvplus/logging backend
// Re-export runtime values (including enums)
export {
  LoggerFactory,
  logger,
  createLogger,
  LogLevel,
  LogDomain
} from '../../logging/dist/backend/index.js';

// Re-export types separately for isolatedModules compatibility
export type {
  LogEntry
} from '../../logging/dist/backend/index.js';