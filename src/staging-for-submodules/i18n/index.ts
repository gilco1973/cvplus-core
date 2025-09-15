/**
 * Internationalization (i18n) Domain - Re-exports for backward compatibility
 *
 * MIGRATION STATUS: Services moved to @cvplus/i18n but local files removed
 * All imports should be updated to use @cvplus/i18n/backend
 */

// TEMPORARILY DISABLED: Local files moved to @cvplus/i18n package
// Main localization service
// export * from './services/regional-localization.service';

// Regional optimization framework
// export * from './regional-localization/ComplianceChecker';
// export * from './regional-localization/CulturalOptimizer';
// export * from './regional-localization/RegionalScoreCalculator';
// export * from './regional-localization/types';

// Since @cvplus/i18n has a dist directory, we can try importing from it
// If the package is built properly, this should work
export * from '@cvplus/i18n';

// Fallback metadata
export const I18N_MODULE_METADATA = {
  name: 'i18n',
  description: 'Internationalization and Regional Localization Services',
  targetSubmodule: '@cvplus/i18n',
  migrationStatus: 'COMPLETE',
  services: [
    'RegionalLocalizationService',
    'ComplianceChecker',
    'CulturalOptimizer',
    'RegionalScoreCalculator'
  ]
} as const;
