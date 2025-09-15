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

// Export utils but exclude logging items that conflict with logging module
export * from './utils/validation';
export * from './utils/formatting';
export * from './utils/date';
export * from './utils/string';
export * from './utils/object';
export * from './utils/array';
export * from './utils/type-guards';
export * from './utils/async';
export * from './utils/crypto';
export * from './utils/error-helpers';
export * from './utils/error-handling';
export * from './utils/classnames';
export * from './utils/firebase-error-handler';
export * from './utils/firebase-response-formatter';
export * from './utils/firebase-auth-validator';
export * from './utils/auth';
export * from './utils/firestore-sanitizer';
export * from './utils/firestore-validation.service';
export * from './utils/safe-firestore.service';
export * from './utils/privacy';
export * from './utils/slug';
export {
  EnhancedErrorHandler,
  handleFunctionError,
  withErrorHandling
} from './utils/enhanced-error-handler';

// Export firebase-logger items with aliases to avoid conflicts
export type {
  LogLevel as UtilsLogLevel,
  LogEntry as UtilsLogEntry,
  LoggerConfig as UtilsLoggerConfig
} from './utils/firebase-logger';
export {
  createLogger as createUtilsLogger,
  logger as utilsLogger
} from './utils/firebase-logger';

// Re-export ValidationResult from utils explicitly to avoid conflict
export type { ValidationResult } from './utils/firestore-validation.service';

// ============================================================================
// ============================================================================
// STAGING FOR SUBMODULES - BACKWARD COMPATIBILITY
// ============================================================================

// These re-exports maintain backward compatibility for services being migrated
// to independent submodules. Once migration is complete, consumers should
// import directly from @cvplus/[domain]/backend
// TEMPORARILY DISABLED: Staging exports disabled to resolve type conflicts
// export * from './staging-for-submodules';
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

// Re-export logging from dedicated logging submodule
// Re-export logging from @cvplus/logging backend
// Note: Using relative path to logging package build output
// Re-export runtime values (including enums)
export {
  LoggerFactory,
  CorrelationService,
  logger,
  createLogger,
  correlationMiddleware,
  LogLevel,
  LogDomain,
  FirebaseTransport,
  LogStream,
  AlertRule,
  AuditTrail,
  LogArchive
} from '../../logging/dist/backend/index.js';

// Re-export types separately for isolatedModules compatibility
export type {
  LogEntry
} from '../../logging/dist/backend/index.js';

// ============================================================================
// VERSION INFO
// ============================================================================

export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@cvplus/core';

// ============================================================================
// ENHANCED MODELS
// ============================================================================

export type {
  EnhancedSessionState,
  ProcessingCheckpoint,
  QueuedAction
} from './types/enhanced-models';

export { CVStep } from './types/enhanced-models';

// ============================================================================
// CV PROCESSING RE-EXPORTS (Backward Compatibility)
// ============================================================================

// Re-export CV processing services for backward compatibility
// export {
//   CVAnalysisService,
//   CVGenerationService,
//   CVTemplateService,
//   CVValidationService,
//   CVGenerator,
//   EnhancementProcessingService,
//   PiiDetector
// } from '@cvplus/cv-processing'; // Temporarily disabled

// Re-export CV processing types for backward compatibility
export type {
  CV,
  CVContent,
  CVMetadata,
  WorkExperience,
  Education,
  Skill,
  Achievement,
  Reference,
  CVTemplate,
  TemplateConfig,
  TemplateSection,
  TemplateStyle,
  EnhancedJob,
  EnhancedJobCore,
  JobFunction,
  EnhancedATS,
  EnhancedSkills,
  CVTemplateType,
  CVTemplateMetadata,
  CVTemplateSections,
  CVTemplateOptions,
  JobType,
  JobRequirements,
  JobBenefits,
  CompanyInfo,
  JobFunctionType,
  JobFunctionCategory,
  JobFunctionData,
  EnhancedJobType,
  EnhancedJobAnalysis,
  EnhancedJobMatching,
  EnhancedJobCoreType,
  EnhancedJobCoreData,
  EnhancedJobCoreAnalysis,
  EnhancedATSType,
  ATSScore,
  ATSRecommendations,
  ATSCompatibility,
  EnhancedSkillsType,
  SkillCategory,
  SkillAnalysis,
  SkillRecommendations
} from '@cvplus/cv-processing';