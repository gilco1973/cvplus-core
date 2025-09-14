/**
 * CVPlus Core Package
 * 
 * Main export file for the @cvplus/core package.
 * Provides shared types, constants, and utilities for the CVPlus platform.
 * 
 * @author Gil Klainert
 * @version 1.0.0
 */

// ============================================================================
// TYPES
// ============================================================================

export * from './types';

// ============================================================================
// INTERFACES (for other modules to implement)
// ============================================================================

// Export service interfaces, but avoid type conflicts with types folder
export type {
  IAuthService,
  IPermissionService,
  ISessionService,
  AuthCredentials,
  AuthResult,
  SessionData,
  SessionValidationResult,
  Permission,
  Role,
  PermissionCheckResult,
  PremiumStatus,
  FeatureAccessResult,
  AuthErrorCode,
  AuthError
} from './interfaces/auth.interface';

// Export the conflicting types with specific names to avoid ambiguity
export type {
  AuthValidationResult as InterfaceAuthValidationResult,
  AuthenticatedUser as InterfaceAuthenticatedUser
} from './interfaces/auth.interface';

// ============================================================================
// CONSTANTS
// ============================================================================

export * from './constants';

// ============================================================================
// CONFIGURATION
// ============================================================================

export { 
  environmentConfig,
  environmentUtils,
  BACKEND_PRICING_CONFIG,
  getTierConfig,
  validatePricingConfig
} from './config';
export type { PricingConfig } from './config';

// ============================================================================
// UTILITIES
// ============================================================================

export * from './utils';

// Re-export ValidationResult from utils explicitly to avoid conflict
export type { ValidationResult } from './utils/firestore-validation.service';

// ============================================================================
// MIDDLEWARE FACTORY (ZERO DEPENDENCIES)
// ============================================================================

export { 
  middlewareFactory,
  requireAuth,
  requirePremiumFeature,
  requireRateLimit,
  requireFeatureAccess,
  configureMiddleware,
  CoreMiddlewareFactory
} from './middleware/middleware-factory';

export type { 
  IMiddlewareFactory,
  MiddlewareFactoryConfig,
  PremiumGuardOptions,
  RateLimitOptions
} from './middleware/middleware-factory';

// ============================================================================
// ARCHITECTURAL PATTERNS (for cross-layer communication)
// ============================================================================

export {
  container,
  registerService,
  resolveService,
  tryResolveService,
  ServiceKeys,
  CVPlusDIContainer
} from './patterns/dependency-injection';

export type {
  ServiceContainer,
  ServiceKey
} from './patterns/dependency-injection';

export {
  eventBus,
  CVPlusEvents,
  emitSubscriptionCheck,
  onSubscriptionResponse,
  emitFeatureAccess,
  trackAnalyticsEvent,
  CVPlusEventBus
} from './patterns/event-bus';

export type {
  EventBus,
  EventHandler,
  CVPlusEventType
} from './patterns/event-bus';

export type {
  ISubscriptionService,
  UserSubscriptionData,
  IFeatureRegistry,
  Feature,
  FeatureConfig,
  IPaymentProcessor,
  PaymentRequest,
  PaymentResult,
  SubscriptionRequest,
  SubscriptionResult,
  RefundResult,
  IAnalyticsTracker,
  AnalyticsQuery,
  AnalyticsReport,
  INotificationService,
  EmailRequest,
  SMSRequest,
  PushNotificationRequest,
  NotificationTemplate
} from './patterns/service-interfaces';

// ============================================================================
// LOGGING SYSTEM
// ============================================================================

export * from './logging';

// ============================================================================
// VERSION INFO
// ============================================================================

export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@cvplus/core';