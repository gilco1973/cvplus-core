/**
 * CV Analysis Service - Re-export Facade
 *
 * MIGRATION NOTICE: This service has been moved to staging-for-submodules/cv-processing/
 * for future extraction to @cvplus/cv-processing submodule.
 *
 * This file maintains backward compatibility by re-exporting from the staging area.
 * All existing imports will continue to work without changes.
 *
 * @deprecated Use import from @cvplus/cv-processing when submodule is created
 * @author Gil Klainert
 * @since 2025-09-14
 */

// TEMPORARILY DISABLED: cv-processing package not built yet
// export { CVAnalysisService } from "@cvplus/cv-processing";
// export type * from "@cvplus/cv-processing";

// Placeholder implementation for backward compatibility
export const CVAnalysisService = {
  analyze: async () => ({ success: false, error: 'Service temporarily unavailable during migration' }),
  // Add other expected methods as needed
} as const;

// Placeholder types
export interface CVAnalysisOptions {
  includeATS?: boolean;
  includePersonality?: boolean;
}

export interface CVAnalysisResult {
  success: boolean;
  analysis?: any;
  error?: string;
}

// TODO: Re-enable when @cvplus/cv-processing is built
// export { CVAnalysisService } from '@cvplus/cv-processing';
// export type * from '@cvplus/cv-processing';
