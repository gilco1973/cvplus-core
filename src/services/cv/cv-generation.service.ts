/**
 * CV Generation Service - Re-export Facade
 */

// TEMPORARILY DISABLED: cv-processing package not built yet
// export { CVGenerationService } from "@cvplus/cv-processing";

// Placeholder implementation for backward compatibility
export const CVGenerationService = {
  generate: async () => ({ success: false, error: 'Service temporarily unavailable during migration' }),
} as const;

export interface CVGenerationOptions {
  template?: string;
  format?: string;
}

export interface CVGenerationResult {
  success: boolean;
  url?: string;
  error?: string;
}
