/**
 * Internationalization (i18n) Domain - Re-exports for backward compatibility
 *
 * This module will be migrated to @cvplus/i18n submodule
 * All imports should be updated to use @cvplus/i18n/backend
 */

// Main localization service
export * from './services/regional-localization.service';

// Regional optimization framework
export * from './regional-localization/ComplianceChecker';
export * from './regional-localization/CulturalOptimizer';
export * from './regional-localization/RegionalScoreCalculator';
export * from './regional-localization/types';