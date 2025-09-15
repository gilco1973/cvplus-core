/**
 * CVPlus Submodules Staging Area
 *
 * This staging area contains business logic that will be migrated to independent
 * git submodules. Each domain represents a future @cvplus/[domain] package.
 *
 * PHASE 4C MIGRATION - Added: multimedia, workflow, i18n, auth domains
 *
 * Migration Status:
 * ✅ cv-processing - CV analysis and enhancement
 * ✅ external-data - External data integration and enrichment
 * ✅ premium - Subscription and billing management
 * ✅ analytics - Business intelligence and tracking
 * ✅ multimedia - Media generation and QR codes
 * ✅ workflow - Timeline and calendar integration
 * ✅ i18n - Localization and regional optimization
 * ✅ auth - Authentication and session management
 */

// Phase 4A domains
export * from './cv-processing';
export * from './external-data';
export * from './premium';
export * from './analytics';

// Phase 4C domains (NEW)
export * from './multimedia';
export * from './workflow';
export * from './i18n';
export * from './auth';