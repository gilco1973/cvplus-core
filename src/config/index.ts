/**
 * CVPlus Core Configuration
 * 
 * Centralized configuration exports for the CVPlus platform.
 * Includes environment, Firebase, CORS, and pricing configurations.
 * 
 * @author Gil Klainert
 * @version 1.0.0
 */

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

export { 
  config as environmentConfig,
  environmentUtils
} from './environment';

// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================

export * from './firebase';

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

export * from './cors';

// ============================================================================
// PRICING CONFIGURATION
// ============================================================================

export type { 
  PricingConfig
} from './pricing';

export { 
  BACKEND_PRICING_CONFIG,
  getTierConfig,
  validatePricingConfig
} from './pricing';