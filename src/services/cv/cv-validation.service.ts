/**
 * CV Validation Service - Re-export Facade
 */

// TEMPORARILY DISABLED: cv-processing package not built yet
// export { CVValidationService } from "@cvplus/cv-processing";

// Placeholder implementation for backward compatibility
export const CVValidationService = {
  validate: async () => ({ success: false, error: 'Service temporarily unavailable during migration' }),
} as const;

export interface CVValidationOptions {
  strict?: boolean;
  checkATS?: boolean;
}

export interface CVValidationResult {
  success: boolean;
  valid?: boolean;
  errors?: string[];
  warnings?: string[];
  error?: string;
}
