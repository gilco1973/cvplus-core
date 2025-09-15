/**
 * CV Template Service - Re-export Facade
 */

// TEMPORARILY DISABLED: cv-processing package not built yet
// export { CVTemplateService } from "@cvplus/cv-processing";

// Placeholder implementation for backward compatibility
export const CVTemplateService = {
  getTemplate: async () => ({ success: false, error: 'Service temporarily unavailable during migration' }),
  listTemplates: async () => ({ success: false, error: 'Service temporarily unavailable during migration' }),
} as const;

export interface CVTemplate {
  id: string;
  name: string;
  preview?: string;
}

export interface CVTemplateResult {
  success: boolean;
  template?: CVTemplate;
  templates?: CVTemplate[];
  error?: string;
}
