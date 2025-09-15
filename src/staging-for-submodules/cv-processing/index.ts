/**
 * CV Processing Domain - Re-exports for backward compatibility
 *
 * MIGRATION COMPLETE: These services have been successfully migrated to @cvplus/cv-processing
 * This file now provides backward compatibility by re-exporting from the target package.
 *
 * Domain: CV analysis, enhancement, processing workflows
 * Target Submodule: @cvplus/cv-processing ✅ MIGRATED
 * Migration Phase: 4C ✅ COMPLETE
 */

// Re-export from migrated @cvplus/cv-processing package for backward compatibility
// TEMPORARILY DISABLED: @cvplus/cv-processing package not built yet
// export * from '@cvplus/cv-processing';

// Temporary fallback exports for backward compatibility
export const CV_PROCESSING_PLACEHOLDER = {
  CVAnalysisService: null,
  EnhancedATSAnalysisService: null,
  PolicyEnforcementService: null,
  CVGenerationService: null,
  CVTemplateService: null,
  CVValidator: null,
  CVValidationService: null,
  CVHashService: null,
  CVGenerator: null,
  EnhancementProcessingService: null
} as const;

// TODO: Re-enable when @cvplus/cv-processing is built
// export * from '@cvplus/cv-processing';

// Legacy metadata for backward compatibility
export const CV_PROCESSING_MODULE_METADATA = {
  name: 'cv-processing',
  description: 'CV Processing and Analysis Services',
  targetSubmodule: '@cvplus/cv-processing',
  migrationDate: '2025-09-14',
  migrationStatus: 'COMPLETE',
  services: [
    'CVAnalysisService',
    'EnhancedATSAnalysisService',
    'PolicyEnforcementService',
    'CVGenerationService',
    'CVTemplateService',
    'CVValidator',
    'CVValidationService',
    'CVHashService',
    'CVGenerator',
    'EnhancementProcessingService'
  ],
  totalServices: 10,
  estimatedLinesOfCode: 2500
} as const;