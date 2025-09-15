/**
 * CV Generator - Re-export Facade
 */

// TEMPORARILY DISABLED: cv-processing package not built yet
// export { CVGenerator } from "@cvplus/cv-processing";

// Placeholder implementation for backward compatibility
export const CVGenerator = {
  generate: async () => ({ success: false, error: 'Service temporarily unavailable during migration' }),
  generatePDF: async () => ({ success: false, error: 'Service temporarily unavailable during migration' }),
} as const;

export interface CVGeneratorOptions {
  template?: string;
  format?: 'pdf' | 'html' | 'docx';
  data?: any;
}

export interface CVGeneratorResult {
  success: boolean;
  url?: string;
  data?: Buffer;
  error?: string;
}
