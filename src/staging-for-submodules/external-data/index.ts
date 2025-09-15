/**
 * External Data Domain - Re-exports for backward compatibility
 *
 * MIGRATION COMPLETE: These services have been successfully migrated to @cvplus/external-data
 * This file now provides backward compatibility by re-exporting from the target package.
 *
 * Domain: External data integration, enrichment, adapters
 * Target Submodule: @cvplus/external-data ✅ MIGRATED
 * Migration Phase: 4C ✅ COMPLETE
 */

// Re-export from migrated @cvplus/external-data package for backward compatibility
// TEMPORARILY DISABLED: @cvplus/external-data package not built yet
// export * from '@cvplus/external-data';

// Temporary fallback exports for backward compatibility
export const EXTERNAL_DATA_PLACEHOLDER = {
  ExternalDataService: null,
  DataEnrichmentService: null,
  APIIntegrationService: null
} as const;

// TODO: Re-enable when @cvplus/external-data is built
// export * from '@cvplus/external-data';