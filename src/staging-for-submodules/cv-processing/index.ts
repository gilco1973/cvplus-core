/**
 * CV Processing Module - Staging for Submodule Migration
 *
 * This module contains all CV processing business logic that will be migrated
 * to the @cvplus/cv-processing submodule in the future.
 *
 * MIGRATION NOTE: These services are staged for extraction to cv-processing submodule.
 * All imports should continue to work through re-export facades in src/services/.
 *
 * @author Gil Klainert
 * @module CVProcessingStaging
 * @since 2025-09-14
 */

// ===== CV ANALYSIS SERVICES =====
export { CVAnalysisService } from './services/cv/cv-analysis.service';
export { EnhancedATSAnalysisService } from './services/enhanced-ats-analysis.service';
export { PolicyEnforcementService } from './services/policy-enforcement.service';

// ===== CV GENERATION SERVICES =====
export { CVGenerationService } from './services/cv/cv-generation.service';
export { CVTemplateService } from './services/cv/cv-template.service';
export { CVGenerator } from './services/cvGenerator';

// ===== CV VALIDATION SERVICES =====
export { CVValidationService } from './services/cv/cv-validation.service';
export { CVValidator } from './services/validation/cv-validator';

// ===== CV UTILITY SERVICES =====
export { CVHashService } from './services/cv-hash.service';

// ===== ENHANCEMENT SERVICES =====
export { EnhancementProcessingService } from './services/enhancements/enhancement-processing.service';

// ===== CV GENERATOR FRAMEWORK =====
export * from './services/cv-generator/types';

// ===== MIGRATION METADATA =====
export const CV_PROCESSING_MODULE_METADATA = {
  name: 'cv-processing',
  description: 'CV Processing and Analysis Services',
  targetSubmodule: '@cvplus/cv-processing',
  migrationDate: '2025-09-14',
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