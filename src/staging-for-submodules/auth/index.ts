/**
 * Authentication Domain - Re-exports for backward compatibility
 *
 * This module will be migrated to @cvplus/auth submodule
 * All imports should be updated to use @cvplus/auth/backend
 */

// Session management
export * from './services/session-checkpoint.service';

// TODO: Add authentication types when identified
// export * from './types/auth.types';